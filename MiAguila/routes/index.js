'use strict';
var express = require('express');
var router = express.Router();
var bll = require('../bll/controller');

bll.methods.connectMongo();


/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.post('/loadinfo', function (req, res) {
    bll.methods.getTrips(res, req.body.city, req.body.status);
    //res.json({ 'status': 'ok' });
});

module.exports = router;
