'use strict';

const {
  articles,
} = require(`./helpers/articles`);

const {
  getItemsSuccessResponse,
} = require(`../../../utils/get-response`);

const ctrlSearch = async (req, res) => {
  try {
    const {query} = req.query;
    const items = query ?
      articles.filter((it) => it.title.toLowerCase().includes(query.toLowerCase())) :
      articles;
    res.json(getItemsSuccessResponse(items, {total: items.length}));
  } catch (err) {
    res.json(getItemsSuccessResponse([], {total: 0}));
  }
};

module.exports = {
  ctrlSearch
};
