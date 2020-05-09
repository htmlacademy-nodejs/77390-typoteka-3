'use strict';

const fsPromise = require(`fs`).promises;
const fs = require(`fs`);

/**
 * Чтение файла и возврат строк в виде массива
 * @param {string} filePath
 * @return {array}
 */
const readFileToArray = async (filePath) => {
  try {
    const content = await fsPromise.readFile(filePath, `utf8`);
    return content
      .trim()
      .split(`\n`)
      .map((el) => el.trim())
      .filter((el) => el !== ``);
  } catch (e) {
    throw e;
  }
};

/**
 * Чтение файла и возврат строк в виде массива. Синхронное чтение файла
 * @param {string} filePath
 * @return {array}
 */
const readFileToArraySync = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, `utf8`);
    return content
      .trim()
      .split(`\n`)
      .map((el) => el.trim())
      .filter((el) => el !== ``);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  readFileToArray,
  readFileToArraySync,
};
