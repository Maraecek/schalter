var express = require('express');
var app = express();


app.post('/ps/status', function(req, res){
  console.log("Status Post received.")
});



app.listen(8181);