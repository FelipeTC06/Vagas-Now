const main = require('../functions/programathor/crawler');
const allJobs = require('../functions/programathor/get-all-jobs');
const router = require('express').Router();

router.get('/programathor', main);
router.get('/programathor/vagas', allJobs);


module.exports = router;