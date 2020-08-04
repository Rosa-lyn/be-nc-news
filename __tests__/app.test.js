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
      });
    });
  });
});
