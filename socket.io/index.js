var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  //res.sendFile('index.html');
  //res.sendFile(path.join(__dirname, './public', 'index.html'));
  res.sendFile('index.html' , { root : __dirname});
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(2013, function(){
  console.log('listening on *:2013');
});