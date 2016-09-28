var bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  models = require("./models"),
  controllers = require("./controllers"),
  express = require("express"),
  config = require("./config"),
  https = require("https"),
  http = require("http"),
  cors = require('cors'),
  dhxMVP;

var winston = require('winston');
var winston = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ 
        filename: config.log_file,
        handleExceptions: true,
        humanReadableUnhandledException: true
      })
    ]
});

mongoose.connect(config.db);

dhxMVP = function(){
  var self = this;
  self.app = express();
  self.app.use(function(a,b,c){
    if(process.env.dhxMVP_LOG){
      console.log(a.path);
    }
    c();
  });
  self.app.use(bodyParser.json({limit: '4mb'}));
  self.app.use(cors());


  
  app.models = models.create(mongoose);
  self.start = function(options){
    //start server
    if( config.https )
    {
      var o = config.https;
      //override default config settings
      for(var j in options){ 
        o[j] = options[j]; 
      }
      https.createServer(o, self.app).listen(9090);
    }
    else{
      http.createServer(self.app).listen(9090);
    }
  };
  //bind modules
  controllers.bind(app);

  self.app.use(function(err, req, res, next) {
    if( err )
    {
      winston.error(err.message);
      res.status(500).send('Something broke!');
      // next(err);
    }
  });

  return self;
};

module.exports = dhxMVP();