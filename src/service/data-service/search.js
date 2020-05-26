'use strict';

class SearchService {
  constructor(itemsService) {
    this._itemsService = itemsService;
  }

  async _getAllItems() {
    return this._itemsService.findAll();
  }

  async search(searchText) {
    const items = await this._getAllItems();
    return searchText ?
      items.filter((item) => item.title.includes(searchText)) :
      [];
  }

}

module.exports = {
  SearchService
};
