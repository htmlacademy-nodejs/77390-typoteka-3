'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/`, (req, res) => res.render(`main`));
router.get(`/register`, (req, res) => res.render(`sign-up`));
router.get(`/login`, (req, res) => res.render(`login`));
router.get(`/search`, (req, res) => res.render(`search`));

module.exports = router;
