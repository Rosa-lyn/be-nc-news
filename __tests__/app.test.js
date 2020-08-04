process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection");

beforeEach(() => connection.seed.run());
describe("app", () => {
  afterAll(() => connection.destroy());
  describe("/api", () => {
    describe("/topics", () => {
      test("GET 200: responds with an array of topic objects with necessary keys", () => {
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
  });
});
