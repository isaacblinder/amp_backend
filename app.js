//export PORT=14773; export NODE_ENV=PRODUCTION; ~/usr/local/lib/node_modules/.bin/forever -o ~/var/log/app.log -e ~/var/log/app_error.log start bin/www -c "--disableHostCheck true"
//ssh ib820@linserv1.cims.nyu.edu
var express = require('express');
var app = express();

var path = require('path');
var cookieParser = require('cookie-parser');
var https = require('https')
var logger = require('morgan');
var fs = require('fs')
const ampCors = require('amp-toolbox-cors');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
  
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
  };
  app.use(allowCrossDomain);
*/

  app.use(ampCors({
    verifyOrigin: false
  }));

/* POST main page. */
app.post('/main', function(req, res, next) {
    console.log('received POST request')
    console.log('body: ', req.body)
    let amount = req.body.income * 1000
    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    res.status(200).json({name: req.body.name, amount: amount, interest: 30}); 
});

/* GET main page. */
app.get('/main', function(req, res, next) {
    console.log('received GET request')
    const retVal = {
        "items": [
          {
            "title": "AMP YouTube Channel",
            "url": "https://www.youtube.com/channel/UCXPBsjgKKG2HqsKBhWA4uQw"
          },
          {
            "title": "AMPproject.org",
            "url": "https://www.ampproject.org/"
          },
          {
            "title": "AMP By Example",
            "url": "https://ampbyexample.com/"
          },
          {
            "title": "AMP Start",
            "url": "https://ampstart.com/"
          }
        ]
       }
    res.status(200).json(retVal); 
});

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  .listen(3000, function () {
    console.log('listening on port 3000')
  })
