const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

/*
[
  {
    title: 'Living in the shadow of a great man',
    topic: 'mitch',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: 1542284514171,
    votes: 100,
  },
  {
    title: 'Sony Vaio; or, The Laptop',
    topic: 'mitch',
    author: 'icellusedkars',
    body:
      'Call me Mitchell. ...',
    created_at: 1416140514171,
  }
]

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
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
