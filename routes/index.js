var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Crop = mongoose.model('Crop');
var Unit = mongoose.model('Unit');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/crops', function(req, res, next) {
  Crop.find(function(err, crops){
    if(err){ return next(err); }

    res.json(crops);
  });
});

router.get('/units', function(req, res, next) {
  Unit.find(function(err, units){
    if(err){ return next(err); }

    res.json(units);
  });
});

router.post('/crops', function(req, res, next) {
  var crop = new Crop(req.body);

  crop.save(function(err, crop){
    if(err){ return next(err); }

    res.send(crop);
  });
});

router.post('/units', function(req, res, next) {
  var unit = new Unit(req.body);

  unit.save(function(err, unit){
    if(err){ return next(err); }

    res.send(unit);
  });
});

module.exports = router;
