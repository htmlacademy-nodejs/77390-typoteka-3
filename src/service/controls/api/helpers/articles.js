'use strict';

const fs = require(`fs`);
require(`../../../../utils/env`);
const FILE_NAME = process.env.MOCK_DATA_FILE_NAME;

const getAllArticles = () => {
  try {
    const fileContent = fs.readFileSync(FILE_NAME);
    return JSON.parse(fileContent);
  } catch (e) {
    return [];
  }
};

const articles = getAllArticles();

module.exports = {
  articles,
};
