const express = require('express');
const app = express();
const SERVER_PORT = process.env.PORT || 3333;

app.use('/',express.static(__dirname+'/public'));

app.listen(SERVER_PORT,function(){
    console.log('Server started.');
})