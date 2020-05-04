'use strict';

const nanoid = require(`nanoid`).nanoid;
const Ajv = require(`ajv`);
const formatDate = require(`date-fns/format`);

const {
  articles,
} = require(`./helpers/articles`);

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
require(`ajv-errors`)(ajv, {singleError: false} );

const ctrlGetArticles = async (req, res) => {
  try {
    res.json(getItemsSuccessResponse(articles, {total: articles.length}));
  } catch (err) {
    res.json(getItemsSuccessResponse([], {total: 0}));
  }
};

const ctrlAddArticle = async (req, res) => {
  try {
    const newArticle = req.body.item;
    const article = {
      id: nanoid(),
      ...newArticle,
      createdDate: newArticle.createDate || formatDate(Date.now(), `yyyy-MM-dd HH:mm:SS`),
    }
    const valid = ajv.validate(schemaArticle, article);
    if (!valid) {
      res
        .status(HttpCode.BAD_REQUEST)
        .json(getErrorResponse(MESSAGE_ARTICLE_BED_FIELD, HttpCode.BAD_REQUEST, {
          failFields: getFailFields(ajv.errors),
        }))
    } else {
      articles.push(article);
      res.json(getItemSuccessResponse(article));
    }
  } catch (err) {
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlGetArticle = async (req, res) => {
  try {
    const id = req.params.articleId;
    const article = articles.find(it => it.id === id);
    if (article) {
      res.json(getItemSuccessResponse(article));
    } else {
      res
        .status(HttpCode.NOT_FOUND)
        .json(getErrorResponse(MESSAGE_ARTICLE_NOT_FOUND, HttpCode.NOT_FOUND));
    }
  } catch (err) {
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlUpdateArticle = async (req, res) => {
  try {
    const id = req.params.articleId;
    const newArticle = req.body.item;
    const index = articles.findIndex(it => it.id === id);
    if (index !== -1) {
      const article = {
        ...articles[index],
        ...newArticle,
      };
      const valid = ajv.validate(schemaArticle, article);
      if (!valid) {
        res
          .status(HttpCode.BAD_REQUEST)
          .json(getErrorResponse(MESSAGE_ARTICLE_BED_FIELD, HttpCode.BAD_REQUEST, {
            failFields: getFailFields(ajv.errors),
          }))
      } else {
        articles[index] = article;
        res.json(getItemSuccessResponse(article));
      }
    } else {
      res
        .status(HttpCode.NOT_FOUND)
        .json(getErrorResponse(MESSAGE_ARTICLE_NOT_FOUND, HttpCode.NOT_FOUND));
    }
  } catch (err) {
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlRemoveArticle = async (req, res) => {
  try {
    const id = req.params.articleId;
    const index = articles.findIndex(it => it.id === id);
    if (index !== -1) {
      articles.splice(index, 1);
    }
    res.status(HttpCode.NO_CONTENT).send();
  } catch (err) {
    console.log(err);
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlGetArticleComments = async (req, res) => {
  try {
    const id = req.params.articleId;
    const article = articles.find(it => it.id === id);
    if (article) {
      const comments = article.comments || [];
      res.json(getItemsSuccessResponse(comments, {total: comments.length}));
    } else {
      res
        .status(HttpCode.NOT_FOUND)
        .json(getErrorResponse(MESSAGE_ARTICLE_NOT_FOUND, HttpCode.NOT_FOUND));
    }
  } catch (err) {
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const ctrlAddArticleComment = async (req, res) => {
  try {
    const id = req.params.articleId;
    const article = articles.find(it => it.id === id);
    if (article) {
      const comments = article.comments || [];
      const comment = {
        id: nanoid(),
        ...req.body.item,
      };
      comments.push(comment);
      article.comments = comments;
      res.json(getItemSuccessResponse(comment));
    } else {
      res
        .status(HttpCode.NOT_FOUND)
        .json(getErrorResponse(MESSAGE_ARTICLE_NOT_FOUND, HttpCode.NOT_FOUND));
    }
  } catch (err) {
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};


const ctrlRemoveArticleComment = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const commentId = req.params.commentId;
    const article = articles.find(it => it.id === articleId);
    if (article) {
      const comments = article.comments || [];
      const commentIndex = comments.findIndex(it => it.id === commentId);
      if (commentIndex !== -1) {
        comments.splice(commentIndex, 1);
      }
      res.status(HttpCode.NO_CONTENT).send();
    } else {
      res
        .status(HttpCode.NOT_FOUND)
        .json(getErrorResponse(MESSAGE_ARTICLE_NOT_FOUND, HttpCode.NOT_FOUND));
    }
  } catch (err) {
    console.log(err);
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(getErrorResponse(MESSAGE_INTERNAL_SERVER_ERROR, HttpCode.INTERNAL_SERVER_ERROR));
  }
};


module.exports = {
  ctrlGetArticles,
  ctrlAddArticle,
  ctrlGetArticle,
  ctrlUpdateArticle,
  ctrlRemoveArticle,
  ctrlGetArticleComments,
  ctrlAddArticleComment,
  ctrlRemoveArticleComment,
};
