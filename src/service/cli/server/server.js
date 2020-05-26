'use strict';

const express = require(`express`);

const routesPosts = require(`../../routes/posts`);
const {getRouterApi} = require(`../../routes/api`);
const {ctrlNotFound} = require(`../../controls/not-found`);
const {
  loggerUrlMiddleware,
  loggerStatusMiddleware,
} = require(`../../middlewares/logger`);
const {API_PREFIX} = require(`../../../constants/urls`);

const app = express();
app.use(express.json());

app.use(loggerUrlMiddleware);
app.use(loggerStatusMiddleware);
app.use(`/posts`, routesPosts);
app.use(API_PREFIX, getRouterApi());
app.use(ctrlNotFound);

module.exports = {
  app,
};
