var path = require("path");
var fs = require("fs");

var files = fs.readdirSync(path.join(__dirname, "controllers"));

module.exports = {
  bind: function(app){
    for(var i in files){
      if(files[i].indexOf(".js", files[i].length - 3) == -1){
        continue;
      }
      try{
        require(path.join(__dirname, "controllers", files[i]))(app);
      } catch(e) { console.error("ERROR BINDING CONTROLLER: ", files[i], e); }
    }
  }
};
