'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/category/:id`, (req, res) => res.render(`articles-by-category.pug`));
router.get(`/add`, (req, res) => res.render(`new-post`));
router.get(`/edit/:id`, (req, res) => res.render(`edit-post`));
router.get(`/:id`, (req, res) => res.render(`post`));

module.exports = router;
