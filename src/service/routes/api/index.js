'use strict';

const {Router} = require(`express`);
const router = new Router();
const {getRouterArticles} = require(`./articles`);
const {getRouterCategories} = require(`./categories`);
const {getRouterSearch} = require(`./search`);
const {
  getMockArticles,
  getMockCategories,
  getMockArticlesSync,
  getMockCategoriesSync,
} = require(`../../lib/get-mock-data`);
const {CategoriesService} = require(`../../data-service/categories`);
const {ArticlesService} = require(`../../data-service/articles`);
const {SearchService} = require(`../../data-service/search`);
const {CommentService} = require(`../../data-service/comment`);

const getRouterApi = () => {
  const articles = getMockArticlesSync();
  const categories = getMockCategoriesSync();
  const categoriesService = new CategoriesService(categories);
  const articlesService = new ArticlesService(articles);
  const commentService = new CommentService();
  const searchService = new SearchService(articlesService);

  router.use(`/articles`, getRouterArticles(articlesService, commentService));
  router.use(`/categories`, getRouterCategories(categoriesService));
  router.use(`/search`, getRouterSearch(searchService));
  return router;
};

module.exports = {
  getRouterApi,
};
