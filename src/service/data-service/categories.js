'use strict';

class CategoriesService {
  constructor(categories) {
    this._categories = categories;
  }

  async findAll() {
    return this._categories;
  }
}

module.exports = {
  CategoriesService
};
