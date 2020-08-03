exports.formatDates = (list) => {
  const formattedList = list.map((listItem) => {
    const date = listItem.created_at;
    const { ...listCopy } = listItem;
    listCopy.created_at = new Date(date);
    return listCopy;
  });

  return formattedList;
};

exports.makeRefObj = (list, key, value) => {
  const listRefKey = list[0][key];
  const listRefValue = list[0][value];
  const listRef = {};
  listRef[listRefKey] = listRefValue;
  return listRef;
};

exports.formatComments = (comments, articleRef) => {};
