process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection");

beforeEach(() => connection.seed.run());
describe("app", () => {
  afterAll(() => connection.destroy());
  describe("invalid paths", () => {
    test("ALL 404: responds with 'path not found' for non-existent paths", () => {
      return request(app)
        .get("/jpg/topics")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Path not found :(");
        });
    });
  });
  describe("/api", () => {
    test("INVALID METHODS 405: responds 'method not allowed' when a delete request is made", () => {
      return request(app)
        .delete("/api")
        .expect(405)
        .then((res) => {
          expect(res.body.msg).toEqual("Method not allowed :(");
        });
    });
    test("GET 200: responds with all the endpoints available on the API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          expect(res.body.endpoints).toEqual(
            expect.objectContaining({
              "GET /api": expect.any(Object),
              "GET /api/topics": expect.any(Object),
              "GET /api/users/:username": expect.any(Object),
              "GET /api/articles/:article_id": expect.any(Object),
              "PATCH /api/articles/:article_id": expect.any(Object),
              "POST /api/articles/:article_id/comments": expect.any(Object),
              "GET /api/articles/:article_id/comments": expect.any(Object),
              "GET /api/articles": expect.any(Object),
              "PATCH /api/comments/:comment_id": expect.any(Object),
              "DELETE /api/comments/:comment_id": expect.any(Object),
            })
          );
        });
    });
    describe("/topics", () => {
      test("INVALID METHODS 405: responds 'method not allowed' when a delete or patch request is made", () => {
        const invalidMethods = ["delete", "patch"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toEqual("Method not allowed :(");
            });
        });
        return Promise.all(methodPromises);
      });
      test("GET 200: responds with an array of topic objects with necessary properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            expect(res.body.topics).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                }),
              ])
            );
          });
      });
    });
    describe("/users", () => {
      describe("/:username", () => {
        test("INVALID METHODS 405: responds 'method not allowed' when a post or put request is made", () => {
          const invalidMethods = ["post", "put"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method](`/api/users/${String}`)
              .expect(405)
              .then((res) => {
                expect(res.body.msg).toEqual("Method not allowed :(");
              });
          });
          return Promise.all(methodPromises);
        });
        test("GET 200: responds with a user object with necessary properties", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then((res) => {
              expect(res.body.user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  avatar_url: expect.any(String),
                  name: expect.any(String),
                })
              );
            });
        });
        test("GET 404: responds with 'user not found' when given a username that doesn't exist", () => {
          return request(app)
            .get("/api/users/rosa_lyn")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe("User not found :(");
            });
        });
      });
    });
    describe("/articles", () => {
      test("INVALID METHODS 405: responds 'method not allowed' when a delete, patch or put request is made", () => {
        const invalidMethods = ["delete", "patch", "put"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toEqual("Method not allowed :(");
            });
        });
        return Promise.all(methodPromises);
      });
      test("GET 200: responds with all articles in an array with necessary properties", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(10);
            expect(res.body.articles).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(Number),
                }),
              ])
            );
          });
      });
      test("GET 200: articles are sorted descending by created_at date by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("GET 200: accepts a 'sort_by' query and sorts articles by the given column", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("author", {
              descending: true,
            });
          });
      });
      test("GET 400: responds with 'invalid sort query' when given a sort column that doesn't exist", () => {
        return request(app)
          .get("/api/articles?sort_by=slug")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toEqual("Invalid sort query :(");
          });
      });
      test("GET 200: accepts an 'order' query and orders articles by the given order, 'asc' or 'desc'", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("created_at", {
              descending: false,
            });
          });
      });
      test("GET 200: accepts an 'author' query, which filters the articles by the username value", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(3);
            res.body.articles.forEach((article) => {
              expect(article.author).toBe("butter_bridge");
            });
          });
      });
      test("GET 200: responds with an empty array if given a valid 'author' value but there aren't any articles by that author", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(0);
          });
      });
      test("GET 404: responds 'author not found' when given an author that doesn't exist", () => {
        return request(app)
          .get("/api/articles?author=rosa_lyn")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("User not found :(");
          });
      });
      test("GET 200: accepts a 'topic' query, which filters the articles by the topic value", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(1);
            res.body.articles.forEach((article) => {
              expect(article.topic).toBe("cats");
            });
          });
      });
      test("GET 200: responds with an empty array if given a valid 'topic' value but there aren't any articles with that topic", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(0);
          });
      });
      test("GET 404: responds 'topic not found' when given a topic that doesn't exist", () => {
        return request(app)
          .get("/api/articles?topic=bumblebees")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toEqual("Topic not found :(");
          });
      });
      test("GET 200: accepts multiple queries at once", () => {
        return request(app)
          .get(
            "/api/articles?sort_by=title&order=desc&author=icellusedkars&topic=mitch"
          )
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(6);
            expect(res.body.articles).toBeSortedBy("title", {
              descending: true,
            });
            res.body.articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
              expect(article.author).toBe("icellusedkars");
            });
          });
      });
      test("GET 200: ignores queries that aren't allowed", () => {
        return request(app)
          .get("/api/articles?hello=true")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(10);
            expect(res.body.articles).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(Number),
                }),
              ])
            );
          });
      });
      test("GET 200: responds with a maximum of 10 articles by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(10);
          });
      });
      test("GET 200: accepts a 'limit' query and limits the number of responses to the given limit value", () => {
        return request(app)
          .get("/api/articles?limit=5")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(5);
          });
      });
      test("GET 200: accepts a 'p' (page) query and displays articles only on that page", () => {
        return request(app)
          .get("/api/articles?limit=5&p=2")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(5);
            expect(res.body.articles[0].article_id).toBe(6);
          });
      });
      test("GET 200: accepts a 'p' (page) query and displays articles only on that page when the number of articles on the page is less than the limit value", () => {
        return request(app)
          .get("/api/articles?limit=5&p=3")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(2);
            expect(res.body.articles[0].article_id).toBe(11);
          });
      });
      test("GET 200: displays page 1 by default if no 'p' value is given", () => {
        return request(app)
          .get("/api/articles?limit=5")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(5);
            expect(res.body.articles[0].article_id).toBe(1);
          });
      });
      test("GET 200: has a 'total_count' property, which shows the total number of articles when no filters are applied, discounting the limit", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body).toEqual(
              expect.objectContaining({
                total_count: expect.any(Number),
              })
            );
          });
      });
      describe("/:article_id", () => {
        test("INVALID METHODS 405: responds 'method not allowed' when a post request is made", () => {
          return request(app)
            .post(`/api/articles/${Number}`)
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toEqual("Method not allowed :(");
            });
        });
        test("GET 200: responds with an article object with necessary properties", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then((res) => {
              expect(res.body.article).toEqual(
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  body: expect.any(String),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(Number),
                })
              );
            });
        });
        test("GET 400: responds with 'invalid id' when given an article id with the wrong datatype", () => {
          return request(app)
            .get("/api/articles/Moustache")
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toEqual("Invalid id :(");
            });
        });
        test("GET 404: responds with 'article not found' when given an article id that doesn't exist", () => {
          return request(app)
            .get("/api/articles/4000000")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toEqual("Article not found :(");
            });
        });
        test("PATCH 200: updates number of votes on article for positive value and responds with updated article", () => {
          return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: 10 })
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).toEqual(10);
            });
        });
        test("PATCH 200: updates number of votes on article for negative value and responds with updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -50 })
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).toEqual(50);
            });
        });
        test("PATCH 200: inc_votes defaults to 0 when given a malformed body", () => {
          return request(app)
            .patch("/api/articles/5")
            .send({})
            .expect(200)
            .then((res) => {
              expect(res.body.article).toEqual(
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  body: expect.any(String),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: 0,
                  // comment_count: expect.any(Number),
                })
              );
            });
        });
        test("PATCH 404: responds with 'article not found' when given an article id that doesn't exist", () => {
          return request(app)
            .patch("/api/articles/4000000")
            .send({ inc_votes: 5 })
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toEqual("Article not found :(");
            });
        });
        test("PATCH 400: responds with 'invalid id' when given an article id with the wrong datatype", () => {
          return request(app)
            .patch("/api/articles/Am I a cat?")
            .send({ inc_votes: 20 })
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toEqual("Invalid id :(");
            });
        });
        describe("/comments", () => {
          test("INVALID METHODS 405: responds 'method not allowed' when a delete or patch request is made", () => {
            const invalidMethods = ["delete", "patch"];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method](`/api/articles/${Number}/comments`)
                .expect(405)
                .then((res) => {
                  expect(res.body.msg).toEqual("Method not allowed :(");
                });
            });
            return Promise.all(methodPromises);
          });
          test("POST 201: adds a comment to an article and responds with the posted comment", () => {
            return request(app)
              .post("/api/articles/7/comments")
              .send({ username: "icellusedkars", body: "I am still hungry" })
              .expect(201)
              .then((res) => {
                expect(res.body.comment).toEqual(
                  expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                  })
                );
              });
          });
          test("POST 404: responds 'article not found' when given an article id that doesn't exist", () => {
            return request(app)
              .post("/api/articles/123456/comments")
              .send({ username: "icellusedkars", body: "I am still hungry" })
              .expect(404)
              .then((res) => {
                expect(res.body.msg).toEqual("Article not found :(");
              });
          });
          test("POST 400: responds 'invalid id' when passed an article id with the wrong datatype", () => {
            return request(app)
              .post("/api/articles/A/comments")
              .send({ username: "butter_bridge", body: "I love cats" })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toEqual("Invalid id :(");
              });
          });
          test("POST 400: responds 'bad request' when given a malformed request body", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({})
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toEqual("Bad request :(");
              });
          });
          test("GET 200: responds with an array of comments for the given article id with necessary properties", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then((res) => {
                expect(res.body.comments).toEqual(
                  expect.arrayContaining([
                    expect.objectContaining({
                      comment_id: expect.any(Number),
                      votes: expect.any(Number),
                      created_at: expect.any(String),
                      author: expect.any(String),
                      body: expect.any(String),
                    }),
                  ])
                );
              });
          });
          test("GET 200: responds with an empty array if the given article doesn't have any comments", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then((res) => {
                expect(res.body.comments.length).toBe(0);
              });
          });
          test("GET 404: responds with 'article not found' when given an article id that doesn't exist", () => {
            return request(app)
              .get("/api/articles/8765432/comments")
              .expect(404)
              .then((res) => {
                expect(res.body.msg).toEqual("Article not found :(");
              });
          });
          test("GET 200: comments are sorted in descending order by 'created_at' column by default", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then((res) => {
                expect(res.body.comments).toBeSortedBy("created_at", {
                  descending: true,
                });
              });
          });
          test("GET 200: accepts a 'sort_by' query and sorts comments by given column", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes")
              .expect(200)
              .then((res) => {
                expect(res.body.comments).toBeSortedBy("votes", {
                  descending: true,
                });
              });
          });
          test("GET 200: accepts an 'order' query and sets the sort order to ascending or descending", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then((res) => {
                expect(res.body.comments).toBeSortedBy("created_at", {
                  descending: false,
                });
              });
          });
          test("GET 200: accepts multiple queries at once", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author&order=asc")
              .expect(200)
              .then((res) => {
                expect(res.body.comments).toBeSortedBy("author", {
                  descending: false,
                });
              });
          });
          test("GET 200: ignores queries that aren't allowed", () => {
            return request(app)
              .get("/api/articles/1/comments?sort=author")
              .then((res) => {
                expect(res.body.comments).toEqual(
                  expect.arrayContaining([
                    expect.objectContaining({
                      comment_id: expect.any(Number),
                      votes: expect.any(Number),
                      created_at: expect.any(String),
                      author: expect.any(String),
                      body: expect.any(String),
                    }),
                  ])
                );
                expect(res.body.comments).toBeSortedBy("created_at", {
                  descending: true,
                });
              });
          });
          test("GET 400: responds with 'invalid sort query' when given a sort column that doesn't exist", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=username")
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toEqual("Invalid sort query :(");
              });
          });
        });
      });
    });
    describe("/comments", () => {
      describe("/:comment_id", () => {
        test("INVALID METHODS 405: responds 'method not allowed' when a post or put request is made", () => {
          const invalidMethods = ["post", "put"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method](`/api/comments/${Number}`)
              .expect(405)
              .then((res) => {
                expect(res.body.msg).toEqual("Method not allowed :(");
              });
          });
          return Promise.all(methodPromises);
        });
        test("PATCH 200: updates number of votes on comment for positive value and responds with updated comment", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 4 })
            .expect(200)
            .then((res) => {
              expect(res.body.comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  author: expect.any(String),
                  article_id: expect.any(Number),
                  votes: 20,
                  created_at: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
        });
        test("PATCH 200: updates number of votes on comment for negative value and responds with updated comment", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -4 })
            .expect(200)
            .then((res) => {
              expect(res.body.comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  author: expect.any(String),
                  article_id: expect.any(Number),
                  votes: 12,
                  created_at: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
        });
        test("PATCH 200: number of votes defaults to 0 if given a malformed body", () => {
          return request(app)
            .patch("/api/comments/4")
            .send({})
            .expect(200)
            .then((res) => {
              expect(res.body.comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  author: expect.any(String),
                  article_id: expect.any(Number),
                  votes: -100,
                  created_at: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
        });
        test("PATCH 404: responds 'comment not found' when given a valid but non-existent comment_id", () => {
          return request(app)
            .patch("/api/comments/20000")
            .send({ inc_votes: 5 })
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toEqual("Comment not found :(");
            });
        });
        test("PATCH 400: responds 'invalid id' when given an id with the wrong datatype", () => {
          return request(app)
            .patch("/api/comments/my_comment")
            .send({ inc_votes: 3 })
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toEqual("Invalid id :(");
            });
        });
        test("DELETE 204: deletes the given comment", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(() => {
              return request(app)
                .get("/api/articles/9/comments")
                .expect(200)
                .then((res) => {
                  expect(res.body.comments.length).toBe(1);
                  res.body.comments.forEach((comment) => {
                    expect(comment.comment_id).not.toBe(1);
                  });
                });
            });
        });
        test("DELETE 404: responds 'comment not found' when given a comment id that doesn't exist", () => {
          return request(app)
            .delete("/api/comments/20000")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe("Comment not found :(");
            });
        });
        test("DELETE 400: responds 'invalid id' when given a comment id with the wrong datatype", () => {
          return request(app)
            .delete("/api/comments/my_comment")
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toEqual("Invalid id :(");
            });
        });
      });
    });
  });
});
