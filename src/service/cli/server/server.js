'use strict';

const express = require(`express`);

const routesPosts = require(`../../routes/posts`);
const routesApi = require(`../../routes/api`);
const {ctrlNotFound} = require(`../../controls/not-found`);
const {
  loggerUrlMiddleware,
  loggerStatusMiddleware,
} = require(`../../middlewares/logger`);

const app = express();
app.use(express.json());

app.use(loggerUrlMiddleware);
app.use(loggerStatusMiddleware);
app.use(`/posts`, routesPosts);
app.use(`/api`, routesApi);
app.use(ctrlNotFound);

module.exports = {
  app,
};
