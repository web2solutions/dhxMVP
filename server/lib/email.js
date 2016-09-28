var nodemailer = require("nodemailer");
var config = require("./config");
var path = require("path");
var jade = require("jade");
var fs = require("fs");

var emailer = {};

var transporter = nodemailer.createTransport(config.email.nodemaileroptions);

var templates = {};

var files = fs.readdirSync(
              path.join(__dirname, "..", "templates", "email")
            );

for(var i in files){
  var f = files[i];
  if(f.indexOf(".jade") == -1){
    continue; 
  }
  var n = f.substr(0, f.indexOf(".jade"));
  templates[n] = jade.compile(
    fs.readFileSync(
      path.join(__dirname, "..", "templates", "email", f)
    )
  );
}

emailer.send = function(options, cb){
  if(!templates[options.template]){
    cb("Template not found");
    return;
  }
  var html = templates[options.template](options.data);
  var emailoptions = {
    from: options.from,
    to: options.to,
    subject: options.subject || "",
    html: html
  };
  transporter.sendMail(emailoptions, function(e,i){
    if(e){
      console.log(e);
      cb(e);
      return;
    }
    cb(e, i);
  });
};

module.exports = emailer;
