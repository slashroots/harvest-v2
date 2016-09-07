var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Harvest' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Harvest' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Harvest' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Harvest' });
});

router.get('/confirmation', function(req, res, next) {
  res.render('confirmation', { title: 'Harvest' });
});

router.get('/validated', function(req, res, next) {
  res.render('validated', { title: 'Harvest' });
});

module.exports = router;
