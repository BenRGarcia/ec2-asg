var express = require('express');
var router = express.Router();
var loadtest = require('loadtest');

let IS_LOAD_TESTING = false;

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/load-test', async(req, res, next) => {
  if (IS_LOAD_TESTING) {
    res.status(429).send();
  } else {
    IS_LOAD_TESTING = true;
    loadtest.loadTest({
      url: 'http://localhost:8080/',
      agentKeepAlive: false,
      concurrency: 10,
      maxRequests: 90000,
      maxSeconds: 60 * 5, // 5 minutes
      timeout: 1000,
      method: 'GET',
      requestsPerSecond: 300,
    }, (err, result) => {
      IS_LOAD_TESTING = false;
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(202).send(result);
      }
    });
  }
});

module.exports = router;
