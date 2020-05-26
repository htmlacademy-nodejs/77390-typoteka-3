'use strict';

const {Router} = require(`express`);
const router = new Router();
const {
  getCtrlGetCategories,
} = require(`../../controls/api/categories`);


const getRouterCategories = (service) => {
  router.get(`/`, getCtrlGetCategories(service));
  return router;
};

module.exports = {
  getRouterCategories
};
