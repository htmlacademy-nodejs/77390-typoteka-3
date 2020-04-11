'use strict';

require(`../utils/env`);
const express = require(`express`);
const colors = require(`colors/safe`);

const articlesRoutes = require(`./routes/articles`);
const categoriesRoutes = require(`./routes/categories`);
const myRoutes = require(`./routes/my`);
const mainRoutes = require(`./routes/main`);

const PORT = process.env.DEFAULT_PORT_FRONT_SERVER;

const app = express();

app.use(`/articles`, articlesRoutes);
app.use(`/categories`, categoriesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.listen(PORT, () => {
  console.log(colors.green(`Ожидаю соединений на ${PORT}`))
});
