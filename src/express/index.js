'use strict';

require(`../utils/env`);
const express = require(`express`);
const path = require(`path`);
const colors = require(`colors/safe`);

const articlesRoutes = require(`./routes/articles`);
const categoriesRoutes = require(`./routes/categories`);
const myRoutes = require(`./routes/my`);
const mainRoutes = require(`./routes/main`);

const PORT = process.env.PORT_FRONT_SERVER;
const PUBLIC_DIR = `public`;

const app = express();

app.set(`views`, path.resolve(__dirname, `templates`, `pages`));
app.set(`view engine`, `pug`);

app.use(`/articles`, articlesRoutes);
app.use(`/categories`, categoriesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use((req, res) => {
  res.status(404).render(`errors/404`);
});

app.listen(PORT, () => {
  console.log(colors.green(`Ожидаю соединений на ${PORT}`));
});
