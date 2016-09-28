var path = require("path");
var fs = require("fs");

var files = fs.readdirSync(path.join(__dirname, "models"));

module.exports = {
  create: function(db){
    var model = {};
    for(var i in files){
      try{
        if(files[i].indexOf('.js', files[i].length - 3) == -1){
          continue;
        }
        var m = require(path.join(__dirname, "models", files[i]));
        for(var key in m){
          model[key] = m[key](db);
        }
      } catch(e) { console.error("ERROR BINDING MODEL: ", files[i], e); }
    }
    return model; 
  }
};
