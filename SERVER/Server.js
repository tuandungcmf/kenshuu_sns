var express = require('express');
var app = express();

// app.use(express.static('./public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

io.on('connection', function(socket){
  console.log('Connect to '+ socket.id);
	socket.on('client-sent-color', function(data){
    console.log(data.userId + ' ' + data.passWord);
    io.sockets.emit('server-send-color', data);
  });
//
// 	io.to('socket_id').emit('ten_Connection', data);
// 	io.socket.emit('ten_Connection', data);
// 	io.socket.in('ten_channel').emit('ten_Connection',data);
});
