/*
formatDates()
This utility function should be able to take an array (list) of objects and return a new array. Each item in the new array must have its timestamp converted into a Javascript date object. Everything else in each item must be maintained.

hint: Think carefully about how you can test that this has worked - it's not by copying and pasting a sql timestamp from the terminal into your test
*/

exports.formatDates = (list) => {
  const formattedList = list.map((listItem) => {
    const date = listItem.created_at;
    const { ...listCopy } = listItem;
    listCopy.created_at = new Date(date);
    return listCopy;
  });

  return formattedList;
};

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};
