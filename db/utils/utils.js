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

exports.formatComments = (comments, articleRef) => {
  const formattedComments = comments.map((comment) => {
    const author = comment.created_by;
    const belongsTo = comment.belongs_to;
    const articleId = articleRef[belongsTo];
    const date = new Date(comment.created_at);

    const { belongs_to, created_by, ...commentsCopy } = comment;

    commentsCopy.author = author;
    commentsCopy.article_id = articleId;
    commentsCopy.created_at = date;

    return commentsCopy;
  });

  return formattedComments;
};
