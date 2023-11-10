const main = require('../functions/programathor/crawler');
const router = require('express').Router();

router.get('/programathor', main);


module.exports = router;