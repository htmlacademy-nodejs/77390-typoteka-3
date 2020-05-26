'use strict';

require(`../../utils/env`);
const fsPromises = require(`fs`).promises;
const fs = require(`fs`);
const path = require(`path`);
const {
  readFileToArray,
  readFileToArraySync,
} = require(`../../utils/files`);

const {
  PATH_TO_DATA,
} = require(`../../constants/paths`);

const FILENAME_MOCK_DATA = process.env.MOCK_DATA_FILE_NAME;
const FILE_CATEGORIES_PATH = path.join(PATH_TO_DATA, `categories.txt`);
let articles = null;
let categories = null;

const getMockArticles = async () => {
  if (articles !== null) {
    return Promise.resolve(articles);
  }

  try {
    const fileContent = await fsPromises.readFile(FILENAME_MOCK_DATA);
    articles = JSON.parse(fileContent);
  } catch (err) {
    return Promise.reject(err);
  }

  return Promise.resolve(articles);
};


const getMockArticlesSync = () => {
  if (articles !== null) {
    return articles;
  }

  try {
    const fileContent = fs.readFileSync(FILENAME_MOCK_DATA);
    articles = JSON.parse(fileContent);
  } catch (err) {
    return [];
  }

  return articles;
};

const getMockCategories = async () => {
  if (categories !== null) {
    return Promise.resolve(categories);
  }

  try {
    categories = await readFileToArray(FILE_CATEGORIES_PATH);
  } catch (err) {
    return Promise.reject(err);
  }

  return Promise.resolve(categories);
};

const getMockCategoriesSync = () => {
  if (categories !== null) {
    return categories;
  }

  try {
    categories = readFileToArraySync(FILE_CATEGORIES_PATH);
  } catch (err) {
    return [];
  }

  return categories;
};

module.exports = {
  getMockArticles,
  getMockArticlesSync,
  getMockCategories,
  getMockCategoriesSync,
};
