'use strict';

const {Router} = require(`express`);
const router = new Router();
const {
  ctrlGetArticles,
  ctrlAddArticle,
  ctrlGetArticle,
  ctrlUpdateArticle,
  ctrlRemoveArticle,
  ctrlGetArticleComments,
  ctrlAddArticleComment,
  ctrlRemoveArticleComment,
} = require(`../../controls/api/articles`);

router.get(`/`, ctrlGetArticles);
router.post(`/`, ctrlAddArticle);
router.get(`/:articleId`, ctrlGetArticle);
router.put(`/:articleId`, ctrlUpdateArticle);
router.delete(`/:articleId`, ctrlRemoveArticle);
router.get(`/:articleId/comments`, ctrlGetArticleComments);
router.post(`/:articleId/comments`, ctrlAddArticleComment);
router.delete(`/:articleId/comments/:commentId`, ctrlRemoveArticleComment);

module.exports = router;
