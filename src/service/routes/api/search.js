'use strict';

const {Router} = require(`express`);
const router = new Router();
const {
  getCtrlSearch,
} = require(`../../controls/api/search`);

const getRouterSearch = (service) => {
  router.get(`/`, getCtrlSearch(service));
  return router;
};

module.exports = {
  getRouterSearch
};
