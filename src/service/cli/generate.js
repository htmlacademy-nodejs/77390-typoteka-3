'use strict';

const fs = require(`fs`);
const addDate = require(`date-fns/add`);
const formatDate = require(`date-fns/format`);

const {log} = require(`../../utils/log`);

const {
  getRandomInt,
} = require(`../../utils/data`);

const {
  ExitCode,
} = require(`../../constants`);

const titles = require(`../../data/titles`).data;
const sentences = require(`../../data/sentences`).data;
const categories = require(`../../data/categories`).data;


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
 * @return {[]}
 */
const getCategories = () => {
  return [...new Set(new Array(getRandomInt(1, categories.length - 1))
    .fill(undefined)
    .map(() => categories[getRandomInt(0, categories.length - 1)]
  ))]
};

/**
 * Генерация анонса/полного текста
 * @param {number} maxSentences Максимальное количество предложений в тексте
 * @return {string}
 */
const getText = (maxSentences) => {
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
 * Генерация массива случайных объявлений
 * @param {number} count
 * @return {object[]}
 */
const generatePosts = (count) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getDate(),
    announce: getText(MAX_SENTENCES_IN_PREVIEW),
    fullText: getText(MAX_SENTENCES_IN_FULL_TEXT),
    category: getCategories(),
  }))
);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    let countOffer = Number.parseInt(count, 10);
    if (Number.isNaN(countOffer)) countOffer =  DEFAULT_COUNT;
    if (countOffer > 1000) {
      log(`Не больше 1000 объявлений`, {status: 'error'});
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generatePosts(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        log(`Не могу создать файл`, {status: 'error'});
        process.exit(ExitCode.error);
      }
      log(`Успешно. Файл создан`, {status: 'info'});
    });
  }
};
