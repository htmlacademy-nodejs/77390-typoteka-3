'use strict';

const {Router} = require(`express`);
const router = new Router();
const {ctrlPostsMain} = require(`../controls/posts`);

router.get(`/`, ctrlPostsMain);

module.exports = router;
