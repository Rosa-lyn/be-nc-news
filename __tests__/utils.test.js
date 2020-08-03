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
  test("creates a reference object when there is more than one object in the array", () => {
    const testList = [
      { article_id: 1, title: "title-a" },
      { article_id: 2, title: "title-b" },
      { article_id: 3, title: "title-c" },
    ];
    const testListRef = makeRefObj(testList, "title", "article_id");
    const expected = { "title-a": 1, "title-b": 2, "title-c": 3 };
    expect(testListRef).toEqual(expected);
  });
  test("doesn't mutate the original data", () => {
    const testList = [
      { article_id: 1, title: "title-a" },
      { article_id: 2, title: "title-b" },
      { article_id: 3, title: "title-c" },
    ];
    makeRefObj(testList, "title", "article_id");
    const controlList = [
      { article_id: 1, title: "title-a" },
      { article_id: 2, title: "title-b" },
      { article_id: 3, title: "title-c" },
    ];
    expect(testList).toEqual(controlList);
  });
  test("title and article_id are set as default values for the key and value parameters if not provided", () => {
    let testList = [
      { article_id: 1, title: "title-a" },
      { article_id: 2, title: "title-b" },
      { article_id: 3, title: "title-c" },
    ];
    let testListRef = makeRefObj(testList);
    let expected = { "title-a": 1, "title-b": 2, "title-c": 3 };
    expect(testListRef).toEqual(expected);

    testList = [
      { username: "grumpy19", name: "Paul Grump" },
      { username: "happyamy2016", name: "Amy Happy" },
      { username: "cooljmessy", name: "Peter Messy" },
    ];
    testListRef = makeRefObj(testList, "username", "name");
    expected = {
      grumpy19: "Paul Grump",
      happyamy2016: "Amy Happy",
      cooljmessy: "Peter Messy",
    };
    expect(testListRef).toEqual(expected);
  });
});

describe("formatComments", () => {
  test("returns a new empty array when passed an empty array", () => {
    const comments = [];
    const articleRef = {
      "article A": 1,
      "article B": 2,
      "article C": 3,
    };
    const formattedComments = formatComments(comments, articleRef);
    const expected = [];
    expect(formattedComments).toEqual(expected);
    expect(formattedComments).not.toBe(comments);
  });
  test("changes 'created_by' property to 'author' when passed an array of one comment", () => {
    const comments = [
      {
        body: "body 1",
        belongs_to: "article A",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const articleRef = {
      "article A": 1,
      "article B": 2,
      "article C": 3,
    };
    const formattedComments = formatComments(comments, articleRef);
    expect(formattedComments[0].author).toBe("butter_bridge");
    expect(formattedComments[0]).not.toHaveProperty("created_by");
  });
  test("changes 'created_by' property to 'author' when passed an array of multiple comments", () => {
    const comments = [
      {
        body: "body 1",
        belongs_to: "article A",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: "body 2",
        belongs_to: "article B",
        created_by: "grumpy19",
        votes: 25,
        created_at: 1416140514171,
      },
      {
        body: "body 3",
        belongs_to: "article C",
        created_by: "cooljmessy",
        votes: 755,
        created_at: 1289996514171,
      },
    ];
    const articleRef = {
      "article A": 1,
      "article B": 2,
      "article C": 3,
    };
    const formattedComments = formatComments(comments, articleRef);
    expect(formattedComments.length).toBe(3);
    formattedComments.forEach((comment) => {
      expect(comment).toHaveProperty("author");
    });
  });

  test("removes 'belongs_to' property and adds 'article_id' with the corresponding id from the articleRef object, for an array of one comment", () => {
    const comments = [
      {
        body: "body 1",
        belongs_to: "article A",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const articleRef = {
      "article A": 1,
      "article B": 2,
      "article C": 3,
    };
    const formattedComments = formatComments(comments, articleRef);
    expect(formattedComments[0].article_id).toBe(1);
    expect(formattedComments[0]).not.toHaveProperty("belongs_to");
  });
  test("removes 'belongs_to' property and adds 'article_id' with the corresponding id from the articleRef object, for an array of multiple comments", () => {
    const comments = [
      {
        body: "body 1",
        belongs_to: "article A",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: "body 2",
        belongs_to: "article B",
        created_by: "grumpy19",
        votes: 25,
        created_at: 1416140514171,
      },
      {
        body: "body 3",
        belongs_to: "article C",
        created_by: "cooljmessy",
        votes: 755,
        created_at: 1289996514171,
      },
    ];
    const articleRef = {
      "article A": 1,
      "article B": 2,
      "article C": 3,
    };
    const formattedComments = formatComments(comments, articleRef);
    formattedComments.forEach((comment) => {
      expect(comment).not.toHaveProperty("belongs_to");
      expect(comment).toHaveProperty("article_id");
    });
  });
  test("converts 'created_at' value into a javascript date object for an array of one comment", () => {
    const comments = [
      {
        body: "body 1",
        belongs_to: "article A",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const articleRef = {
      "article A": 1,
      "article B": 2,
      "article C": 3,
    };
    const formattedComments = formatComments(comments, articleRef);
    expect(formattedComments[0].created_at).toEqual(new Date(1511354163389));
  });
  test("converts 'created_at' value into a javascript date object for an array of multiple comments", () => {
    const comments = [
      {
        body: "body 1",
        belongs_to: "article A",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: "body 2",
        belongs_to: "article B",
        created_by: "grumpy19",
        votes: 25,
        created_at: 1416140514171,
      },
      {
        body: "body 3",
        belongs_to: "article C",
        created_by: "cooljmessy",
        votes: 755,
        created_at: 1289996514171,
      },
    ];
    const articleRef = {
      "article A": 1,
      "article B": 2,
      "article C": 3,
    };
    const formattedComments = formatComments(comments, articleRef);
    formattedComments.forEach((comment) => {
      const date = comment.created_at;
      expect(comment.created_at).toEqual(new Date(date));
    });
  });
  test("doesn't mutate original data", () => {
    const comments = [
      {
        body: "body 1",
        belongs_to: "article A",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: "body 2",
        belongs_to: "article B",
        created_by: "grumpy19",
        votes: 25,
        created_at: 1416140514171,
      },
      {
        body: "body 3",
        belongs_to: "article C",
        created_by: "cooljmessy",
        votes: 755,
        created_at: 1289996514171,
      },
    ];
    const articleRef = {
      "article A": 1,
      "article B": 2,
      "article C": 3,
    };
    formatComments(comments, articleRef);
    const commentsControl = [
      {
        body: "body 1",
        belongs_to: "article A",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: "body 2",
        belongs_to: "article B",
        created_by: "grumpy19",
        votes: 25,
        created_at: 1416140514171,
      },
      {
        body: "body 3",
        belongs_to: "article C",
        created_by: "cooljmessy",
        votes: 755,
        created_at: 1289996514171,
      },
    ];
    const articleRefControl = {
      "article A": 1,
      "article B": 2,
      "article C": 3,
    };
    expect(comments).toEqual(commentsControl);
    expect(articleRef).toEqual(articleRefControl);
  });
});
