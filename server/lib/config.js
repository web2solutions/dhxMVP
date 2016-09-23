var path = require("path");
var fs = require("fs");

var config = {
  //https: {
  //  key: fs.readFileSync(path.join(__dirname, "..", "config", "server", "my-server.key.pem")),
  //  cert: fs.readFileSync(path.join(__dirname, "..", "config", "server", "my-server.crt.pem"))
  //},
  modules: [
    //__dirname + "/base/echo.js",
    //__dirname + "/base/messages.js",
    //__dirname + "/base/user.js"
  ],
  db: "mongodb://127.0.0.1/dhxmvp_development",
  email: {
    nodemaileroptions: {
      host: "smtp.gmail.com",
      port: 465,
      //secure: true,
      auth: {
        user: 'web2solucoes@gmail.com',
        pass: 'xxxxx'
      },
      secureConnection: false,
      tls: { ciphers: 'SSLv3' }
    },
    from: "web2solucoes@gmail.com"
  },
  url: 'http://49.50.88.222', //DO NOT USE A TRAILING /
  contact: 'web2solucoes@gmail.com',
  data: 'data/',
  stripe: {
    sk: "sk_test_XtEYHWCYxS51bEJ0hfN5gl2F",
    pk: "pk_test_QdUdIc1vFN3AQbbFJa0chLYZ"
  },
  log_file: 'dhxmvp.log'
};

module.exports = config;