exports.formatDates = (list) => {
  const formattedList = list.map((listItem) => {
    const date = listItem.created_at;
    const { ...listCopy } = listItem;
    listCopy.created_at = new Date(date);
    return listCopy;
  });

  return formattedList;
};

exports.makeRefObj = (list, key = "title", value = "article_id") => {
  const listRef = {};
  list.forEach((listItem) => {
    const listRefKey = listItem[key];
    const listRefValue = listItem[value];
    listRef[listRefKey] = listRefValue;
  });
  return listRef;
};

exports.formatComments = (comments, articleRef) => {};
