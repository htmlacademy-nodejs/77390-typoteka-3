'use strict';

const {
  getItemsSuccessResponse,
  getErrorResponse,
} = require(`../../../utils/get-response`);

const {
  HttpCode,
} = require(`../../../constants/http`);

const {
  MESSAGE_INTERNAL_SERVER_ERROR,
} = require(`../../../constants/messages`);

const getCtrlGetCategories = (service) => {
  const ctrlGetCategories = async (req, res) => {
    try {
      const items = await service.findAll();
      await res.json(getItemsSuccessResponse(items, {total: items.length}));
    } catch (err) {
      await res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
    }
  };
  return ctrlGetCategories;
};

module.exports = {
  getCtrlGetCategories,
};
