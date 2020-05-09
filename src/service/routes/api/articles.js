'use strict';

const {Router} = require(`express`);
const router = new Router();
const {
  getCtrlsArticles,
} = require(`../../controls/api/articles`);

const getRouterArticles = (articlesService, commentService) => {
  const {
    ctrlGetArticles,
    ctrlAddArticle,
    ctrlGetArticle,
    ctrlUpdateArticle,
    ctrlRemoveArticle,
    ctrlGetArticleComments,
    ctrlAddArticleComment,
    ctrlRemoveArticleComment,
  } = getCtrlsArticles(articlesService, commentService);
  router.get(`/`, ctrlGetArticles);
  router.post(`/`, ctrlAddArticle);
  router.get(`/:articleId`, ctrlGetArticle);
  router.put(`/:articleId`, ctrlUpdateArticle);
  router.delete(`/:articleId`, ctrlRemoveArticle);
  router.get(`/:articleId/comments`, ctrlGetArticleComments);
  router.post(`/:articleId/comments`, ctrlAddArticleComment);
  router.delete(`/:articleId/comments/:commentId`, ctrlRemoveArticleComment);
  return router;
};

module.exports = {
  getRouterArticles
};
