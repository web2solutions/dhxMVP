var bind = function(app){
  app.get("/echo/:string", function(req,res){
    res.send(req.params.string);
  });
};

module.exports = bind;
