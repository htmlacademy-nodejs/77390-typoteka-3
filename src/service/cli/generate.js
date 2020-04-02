'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const addDate = require(`date-fns/add`);
const formatDate = require(`date-fns/format`);

const {readFileToArray} = require(`../../utils/files`);
const {log} = require(`../../utils/log`);

const {
  getRandomInt,
} = require(`../../utils/data`);

const {
  ExitCode,
} = require(`../../constants`);

const FILE_TITLES_PATH = path.join(__dirname, '..', '..', 'data', 'titles.txt');
const FILE_SENTENCES_PATH = path.join(__dirname, '..', '..', 'data', 'sentences.txt');
const FILE_CATEGORIES_PATH = path.join(__dirname, '..', '..', 'data', 'categories.txt');



/**
 * Количество сгенерированных постов по умолчанию
 * @type {number}
 */
const DEFAULT_COUNT = 1;
/**
 * Имя файла для записи мок данных
 * @type {string}
 */
const FILE_NAME = `mocks.json`;
/**
 * Максимальное количество предложений в превью отдельного поста
 * @type {number}
 */
const MAX_SENTENCES_IN_PREVIEW = 5;
/**
 * Максимальное количество предложений в полном тексте отдельного поста
 * Случайное разумное число
 * @type {number}
 */
const MAX_SENTENCES_IN_FULL_TEXT = 25;

const today = Date.now();
const minCreatedDate = +addDate(today, {
  months: -3,
});

/**
 * Генерация массива категорий
 * @param {[]} allCategories
 * @return {[]}
 */
const getCategories = (allCategories) => {
  return [...new Set(new Array(getRandomInt(1, allCategories.length - 1))
    .fill(undefined)
    .map(() => allCategories[getRandomInt(0, allCategories.length - 1)]
  ))]
};

/**
 * Генерация анонса/полного текста
 * @param {string[]} sentences Массив предложений для генерации
 * @param {number} maxSentences Максимальное количество предложений в тексте
 * @return {string}
 */
const getText = (sentences, maxSentences) => {
  return new Array(getRandomInt(1, maxSentences))
    .fill(undefined)
    .map(() => sentences[getRandomInt(0, sentences.length - 1)])
    .join();
};

/**
 * Генерация даты поста
 * @return {string}
 */
const getDate = () => {
  return formatDate(getRandomInt(minCreatedDate, today), `yyyy-MM-dd HH:mm:SS`);
};

/**
 * @return {Promise<{sentences: Array, titles: Array, categories: Array}>}
 */
const getMockData = async () => {
  try {
    const [titles, sentences, categories] = await Promise.all([
      readFileToArray(FILE_TITLES_PATH),
      readFileToArray(FILE_SENTENCES_PATH),
      readFileToArray(FILE_CATEGORIES_PATH),
    ]);
    return {
      titles,
      sentences,
      categories,
    };
  } catch (e) {
    throw e;
  }
};

/**
 * Генерация массива случайных постов
 * @param {array} data.titles
 * @param {array} data.sentences
 * @param {array} data.categories
 * @param {object} data
 * @param {number} count
 * @return {object[]}
 */
const generatePosts = (data, count) => {
  const {titles, sentences, categories} = data;
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getDate(),
    announce: getText(sentences, MAX_SENTENCES_IN_PREVIEW),
    fullText: getText(sentences, MAX_SENTENCES_IN_FULL_TEXT),
    category: getCategories(categories),
  }))
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    let countPosts = Number.parseInt(count, 10);
    let content;
    if (Number.isNaN(countPosts)) countPosts =  DEFAULT_COUNT;
    if (countPosts > 1000) {
      log(`Не больше 1000 объявлений`, {status: 'error'});
      process.exit(ExitCode.error);
    }

    try {
      const data = await getMockData();
      content = JSON.stringify(generatePosts(data, countPosts));
    } catch (e) {
      log(`Не могу получить данные для генерации: ${e}`, {status: 'error'});
      process.exit(ExitCode.error);
    }

    try {
      await fs.writeFile(FILE_NAME, content);
      log(`Успешно. Файл создан`, {status: 'success'});
    } catch (e) {
      log(`Не могу создать файл: ${e}`, {status: 'error'});
      process.exit(ExitCode.error);
    }
  }
};
