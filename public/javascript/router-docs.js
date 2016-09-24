/**
 * Created by thinkking on 9/21/16.
 */

var express = require('express');
var router = express.Router();

/**
 * End Points relevant to Documentation
 */

router.get('/docs', function(req, res, next) {
  res.render('docs', { title: 'HarvestAPI Specs' });
});

module.exports = router;
