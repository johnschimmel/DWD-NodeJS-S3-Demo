
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongodb')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  
var app = express();

// Express app configuration 
app.configure(function(){

  // database
  app.db = mongoose.connect(process.env.MONGOLAB_URI);

  //  templates directory
  app.set('views', __dirname + '/views');

  // setup template engine - we're using Hogan-Express
  // https://github.com/vol4ok/hogan-express
  app.set('view engine', 'html');
  app.set('layout','layout');
  app.engine('html', require('hogan-express'));

  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  // css, images and js
  app.use(express.static(path.join(__dirname, 'public')));

});



// public routes
var routes = require('./routes/index.js');
app.get('/', routes.index);
app.post('/newimage', routes.newimage);


// Turn the server on!
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
