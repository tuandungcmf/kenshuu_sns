var express = require('express');
var app = express();

// app.use(express.static('./public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8000);

var user =[];

io.on('connection', function(socket){
  console.log('Connect to '+ socket.id);
  // console.log(socket.adapter.rooms);

  socket.on('client-sent-color', function(data){
    io.sockets.emit('server-send-color', data);
  });

  socket.on('login', function(data){
    user.push(data);
    socket.emit('loginSuccess', data);
  });

  socket.on('newMessage', function(data){
    //io.sockets.emit('newMessage',data);
    io.sockets.in(socket.channel).emit('sentMsg', data);
  });

  socket.on('newroom', function(data){
    socket.join(data);
    socket.channel = data;
    var channel = [];
    for(r in socket.adapter.rooms){
      channel.push(r);
    }
    io.sockets.emit('server-sent-channel', channel );
    socket.emit('server-sent-channel-socket', data);
  });

  socket.on('disconnect', function () {
    console.log('User disconnected: '+socket.id);
  });
});
