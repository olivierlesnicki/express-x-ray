var express = require('express');
var bodyParser = require('body-parser')
var xray = require('x-ray');
var router = express.Router();
var _ = require('lodash');

router
  .post(bodyParser.json())
  .post('/', function (req, res) {

    var x; // x-ray instance
    var url = req.body.url;
    var select = req.body.select;
    var prepare = req.body.prepare;

    if(!url) {
      res
        .status(400)
        .send({
          error: 'url property missing'
        });
      return;
    }

    if(!select) {
      res
        .status(400)
        .send({
          error: 'select property missing'
        });
      return;
    }

    x = xray(url);
    x.select(select);

    if(prepare) {
      _.each(prepare, function (regex, name) {
        x.prepare(name, function (str) {
          var m = str.match(new RegExp(regex));
          if(m && m.length > 1) {
            m.shift();
            return m.length > 1 ? m : m[0];
          }
          return str;
        });
      });
    }

    x.prepare({
      number: function (str) {
        return Number(str);
      },
      boolean: function (str) {
         return !!str;
      }
    });  

    x.run(function(err, data) {
      if(err) {
        res
          .status(500)
          .send(err);
      }
      res.send(data);
    });

  });

module.exports = router;