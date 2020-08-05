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
    describe("/topics", () => {
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
              expect(res.body.msg).toBe("User: rosa_lyn not found :(");
            });
        });
      });
    });
    describe("/articles", () => {
      describe("/:article_id", () => {
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
        test("GET 400: responds with 'invalid article id' when given an article id with the wrong datatype", () => {
          return request(app)
            .get("/api/articles/Moustache")
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toEqual(
                "Invalid article id: Moustache :( Article id must be a number"
              );
            });
        });
        test("GET 404: responds with 'article not found' when given an article id that doesn't exist", () => {
          return request(app)
            .get("/api/articles/4000000")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toEqual("Article: 4000000 not found :(");
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
        test("PATCH 404: responds with 'article not found' when given an article id that doesn't exist", () => {
          return request(app)
            .patch("/api/articles/4000000")
            .send({ inc_votes: 5 })
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toEqual("Article: 4000000 not found :(");
            });
        });
        test("PATCH 400: responds with 'invalid article id' when given an article id with the wrong datatype", () => {
          return request(app)
            .patch("/api/articles/Am I a cat?")
            .send({ inc_votes: 20 })
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toEqual(
                "Invalid article id: Am I a cat? :( Article id must be a number"
              );
            });
        });
        test("PATCH 400: responds with 'missing required fields' when given a malformed request body", () => {
          return request(app)
            .patch("/api/articles/5")
            .send({})
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toEqual(
                "Missing required fields on request body :( Body must be in the form { inc_votes: newVote }"
              );
            });
        });
        test("PATCH 400: responds with 'invalid body' when given an inc_votes value with the wrong datatype", () => {
          return request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: "ten" })
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toEqual(
                "Invalid request body :( inc_votes value must be a number"
              );
            });
        });
        describe("/comments", () => {
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
                expect(res.body.msg).toEqual("Article: 123456 not found :(");
              });
          });
          xtest("POST 400: responds 'invalid article id' when passed an article id with the wrong datatype", () => {
            return request(app)
              .post("/api/articles/A/comments")
              .send({ username: "butter_bridge", body: "I love cats" })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toEqual(
                  "Invalid article id: A :( Article id must be a number"
                );
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
        });
      });
    });
  });
});
