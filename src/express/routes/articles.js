'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));
router.get(`/add`, (req, res) => res.send(`/articles/add`));
router.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
router.get(`/:id`, (req, res) => res.send(`/articles/:id`));

module.exports = router;
