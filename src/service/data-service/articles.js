'use strict';

const nanoid = require(`nanoid`).nanoid;
const {FORMAT_DATE} = require(`../../constants/date`);
const formatDate = require(`date-fns/format`);

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }

  async findAll() {
    return this._articles;
  }

  async findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  async create(article) {
    const newArticle = {
      id: nanoid(),
      ...article,
      createdDate: article.createDate || formatDate(Date.now(), FORMAT_DATE),
      comments: article.comments || [],
    };

    this._articles.push(newArticle);
    return newArticle;
  }

  async drop(id) {
    const index = this._articles.findIndex((it) => it.id === id);
    if (index === -1) {
      return null;
    }
    return this._articles.splice(index, 1)[0];
  }

  async update(id, article) {
    const index = this._articles.findIndex((it) => it.id === id);
    if (index === -1) {
      return null;
    }
    this._articles[index] = {
      ...this._articles[index],
      ...article,
    };
    return this._articles[index];
  }

}

module.exports = {
  ArticlesService,
};
