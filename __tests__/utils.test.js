const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

/*
comments:
[
  {
    body: "Oh, I've got compassion ...",
    belongs_to: articles.title,
    created_by: users.username,
    votes: 16,
    created_at: 1511354163389,
  },
  {},
  ...
]
should be --->
comments:
[
  {
    body: "Oh, I've got compassion ...",

    ** article_id: articles.article_id
    ** author: users.username, **

    votes: 16,
    created_at: 1511354163389,
  },
  {},
  ...
]

create ref needs to match articles.article_title to articles.article_id
*/
describe("formatDates", () => {
  test("returns a new empty array when passed an empty array", () => {
    const testList = [];
    const formattedList = formatDates(testList);
    const expected = [];
    expect(formattedList).toEqual(expected);
    expect(formattedList).not.toBe(testList);
  });
  test("returns a formatted array when passed an array of one object", () => {
    const testList = [
      {
        title: "title-a",
        topic: "topic-b",
        author: "author-f",
        body: "body-c",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const formattedList = formatDates(testList);
    const expected = [
      {
        title: "title-a",
        topic: "topic-b",
        author: "author-f",
        body: "body-c",
        created_at: new Date(1542284514171),
        votes: 100,
      },
    ];
    expect(formattedList).toEqual(expected);
  });
  test("returns a formatted array when passed an array of multiple objects", () => {
    const testList = [
      {
        title: "title-a",
        topic: "topic-b",
        author: "author-f",
        body: "body-a",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: "title-b",
        topic: "topic-f",
        author: "author-e",
        body: "body-b",
        created_at: 1416140514171,
        votes: 4,
      },
      {
        title: "title-c",
        topic: "topic-a",
        author: "author-a",
        body: "body-c",
        created_at: 1289996514171,
        votes: 76,
      },
    ];
    const formattedList = formatDates(testList);
    const expected = [
      {
        title: "title-a",
        topic: "topic-b",
        author: "author-f",
        body: "body-a",
        created_at: new Date(1542284514171),
        votes: 100,
      },
      {
        title: "title-b",
        topic: "topic-f",
        author: "author-e",
        body: "body-b",
        created_at: new Date(1416140514171),
        votes: 4,
      },
      {
        title: "title-c",
        topic: "topic-a",
        author: "author-a",
        body: "body-c",
        created_at: new Date(1289996514171),
        votes: 76,
      },
    ];
    expect(formattedList).toEqual(expected);
  });
  test("does not mutate the original input data", () => {
    const testList = [
      {
        title: "title-a",
        topic: "topic-b",
        author: "author-f",
        body: "body-a",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: "title-b",
        topic: "topic-f",
        author: "author-e",
        body: "body-b",
        created_at: 1416140514171,
        votes: 4,
      },
      {
        title: "title-c",
        topic: "topic-a",
        author: "author-a",
        body: "body-c",
        created_at: 1289996514171,
        votes: 76,
      },
    ];
    formatDates(testList);
    const controlList = [
      {
        title: "title-a",
        topic: "topic-b",
        author: "author-f",
        body: "body-a",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: "title-b",
        topic: "topic-f",
        author: "author-e",
        body: "body-b",
        created_at: 1416140514171,
        votes: 4,
      },
      {
        title: "title-c",
        topic: "topic-a",
        author: "author-a",
        body: "body-c",
        created_at: 1289996514171,
        votes: 76,
      },
    ];
    expect(testList).toEqual(controlList);
  });
});

describe("makeRefObj", () => {
  test("returns an empty object when passed an empty array", () => {
    const testList = [{}];
    const testListRef = makeRefObj(testList);
    const expected = {};
    expect(testListRef).toEqual(expected);
  });
  test("creates a reference object using the key and value provided when passed an array of one object", () => {
    const testList = [{ article_id: 1, title: "title-a" }];
    const testListRef = makeRefObj(testList, "title", "article_id");
    const expected = { "title-a": 1 };
    expect(testListRef).toEqual(expected);
  });
});

describe("formatComments", () => {});
