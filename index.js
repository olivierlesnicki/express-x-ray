var express = require('express');
var xray = require('x-ray');
var router = express.Router();

router.post('/', function (req, res) {

  var x; // x-ray instance
  var url = req.params.url;
  var select = req.params.select;

  if(!url) {
    res
      .status(400)
      .error({
        error: 'Please provide "url" property.'
      });
    return;
  }

  if(!select) {
    res
      .status(400)
      .error({
        error: 'Please provide "select" property.'
      });
    return;
  }

  x = xray(url);
  x.select(select);

  x.run(err, function(data) {
    res.send(data);
  });

});

module.exports = router;