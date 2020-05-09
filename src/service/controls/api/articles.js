'use strict';

const Ajv = require(`ajv`);

const {HttpCode} = require(`../../../constants/http`);
const {
  MESSAGE_INTERNAL_SERVER_ERROR,
  MESSAGE_ARTICLE_NOT_FOUND,
  MESSAGE_ARTICLE_BED_FIELD,
} = require(`../../../constants/messages`);

const schemaArticle = require(`../../../schemas/article.json`);

const {
  getItemsSuccessResponse,
  getItemSuccessResponse,
  getErrorResponse,
  getFailFields,
} = require(`../../../utils/get-response`);

const ajv = new Ajv({allErrors: true, jsonPointers: true});
require(`ajv-errors`)(ajv, {singleError: false});

let _articlesService;
let _commentService;

const ctrlGetArticles = async (req, res) => {
  try {
    const articles = await _articlesService.findAll();
    return res.json(getItemsSuccessResponse(articles, {total: articles.length}));
  } catch (err) {
    return res.json(getItemsSuccessResponse([], {total: 0}));
  }
};

const ctrlAddArticle = async (req, res) => {
  try {
    const data = req.body.item;
    const valid = ajv.validate(schemaArticle, data);
    if (!valid) {
      const failFields = getFailFields(ajv.errors);
      res.locals.error = {
        message: MESSAGE_ARTICLE_BED_FIELD,
        code: HttpCode.BAD_REQUEST,
        failFields,
      };
      return res
        .status(HttpCode.BAD_REQUEST)
        .json(getErrorResponse(MESSAGE_ARTICLE_BED_FIELD, HttpCode.BAD_REQUEST, {
          failFields,
        }));
    }
    const article = await _articlesService.create(data);
    return res.json(getItemSuccessResponse(article));
  } catch (err) {
    return res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlGetArticle = async (req, res) => {
  try {
    const id = req.params.articleId;
    const article = await _articlesService.findOne(id);
    if (!article) {
      return res
        .status(HttpCode.NOT_FOUND)
        .json(getErrorResponse(MESSAGE_ARTICLE_NOT_FOUND, HttpCode.NOT_FOUND));
    }
    return res.json(getItemSuccessResponse(article));
  } catch (err) {
    return res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlUpdateArticle = async (req, res) => {
  try {
    const id = req.params.articleId;
    const data = req.body.item;
    const valid = ajv.validate(schemaArticle, data);
    if (!valid) {
      const failFields = getFailFields(ajv.errors);
      res.locals.error = {
        message: MESSAGE_ARTICLE_BED_FIELD,
        code: HttpCode.BAD_REQUEST,
        failFields,
      };
      return res
        .status(HttpCode.BAD_REQUEST)
        .json(getErrorResponse(MESSAGE_ARTICLE_BED_FIELD, HttpCode.BAD_REQUEST, {
          failFields,
        }));
    }
    const updatedArticle = await _articlesService.update(id, data);
    if (!updatedArticle) {
      return res
        .status(HttpCode.NOT_FOUND)
        .json(getErrorResponse(MESSAGE_ARTICLE_NOT_FOUND, HttpCode.NOT_FOUND));
    }
    return res.json(getItemSuccessResponse(updatedArticle));
  } catch (err) {
    return res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlRemoveArticle = async (req, res) => {
  try {
    const id = req.params.articleId;
    await _articlesService.drop(id);
    return res.status(HttpCode.NO_CONTENT).send();
  } catch (err) {
    return res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlGetArticleComments = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const article = await _articlesService.findOne(articleId);
    if (!article) {
      return res
        .status(HttpCode.NOT_FOUND)
        .json(getErrorResponse(MESSAGE_ARTICLE_NOT_FOUND, HttpCode.NOT_FOUND));
    }
    const comments = await _commentService.findAll(article);
    return res.json(getItemsSuccessResponse(comments, {total: comments.length}));
  } catch (err) {
    return res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlAddArticleComment = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const article = await _articlesService.findOne(articleId);
    if (!article) {
      return res
        .status(HttpCode.NOT_FOUND)
        .json(getErrorResponse(MESSAGE_ARTICLE_NOT_FOUND, HttpCode.NOT_FOUND));
    }
    const data = req.body.item;
    const comment = await _commentService.create(article, data);
    return res.json(getItemSuccessResponse(comment));
  } catch (err) {
    return res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlRemoveArticleComment = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const article = await _articlesService.findOne(articleId);
    if (!article) {
      return res
        .status(HttpCode.NOT_FOUND)
        .json(getErrorResponse(MESSAGE_ARTICLE_NOT_FOUND, HttpCode.NOT_FOUND));
    }
    const commentId = req.params.commentId;
    await _commentService.drop(article, commentId);
    return res.status(HttpCode.NO_CONTENT).send();
  } catch (err) {
    return res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const getCtrlsArticles = (articlesService, commentsService) => {
  _articlesService = articlesService;
  _commentService = commentsService;
  return {
    ctrlGetArticles,
    ctrlAddArticle,
    ctrlGetArticle,
    ctrlUpdateArticle,
    ctrlRemoveArticle,
    ctrlGetArticleComments,
    ctrlAddArticleComment,
    ctrlRemoveArticleComment,
  };
};

module.exports = {
  getCtrlsArticles,
};
