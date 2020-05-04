'use strict';

const {Router} = require(`express`);
const router = Router();
const routerArticles = require(`./articles`);
const routerCategories = require(`./categories`);
const routerSearch = require(`./search`);

router.use(`/articles`, routerArticles);
router.use(`/categories`, routerCategories);
router.use(`/search`, routerSearch);

module.exports = router;
