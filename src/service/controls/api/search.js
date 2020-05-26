'use strict';

const {
  getItemsSuccessResponse,
} = require(`../../../utils/get-response`);

const getCtrlSearch = (service) => {
  const ctrlSearch = async (req, res) => {
    try {
      const {query} = req.query;
      const items = await service.search(query);
      return res.json(getItemsSuccessResponse(items, {total: items.length}));
    } catch (err) {
      return res.json(getItemsSuccessResponse([], {total: 0}));
    }
  };
  return ctrlSearch;
};

module.exports = {
  getCtrlSearch,
};
