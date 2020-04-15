

var express = require('express');

var app = express();

var server = app.listen(3000);
app.use(express.static('public'));


console.log("running now");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection)

function newConnection(socket){
  var ts = new Date();
  var h = ts.getHours();
  var m = ts.getMinutes();
  var s = ts.getSeconds();
  var zeit = h+":"+m+":"+s;


  console.log(zeit + '- new connection-id: ' + socket.id );
  socket.on('ablage_array', ablage_array_received);
  socket.on('new_game', new_game_received);
  socket.on('neuer_stich', neuer_stich_received);
  socket.on('armut', armut_received);

/*
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  var address = socket.handshake.address;
  console.log('New connection from ' + address.address + ':' + address.port);
});
*/
  function ablage_array_received(data){
      //console.log(data);
      var ts = new Date();
      var h = ts.getHours();
      var m = ts.getMinutes();
      var s = ts.getSeconds();
      var zeit = h+":"+m+":"+s;
      console.log(zeit + "- " + "Received new Ablage_array");
    socket.broadcast.emit('ablage_array', data);
    //io.sockets.emit (to all including sender);
  }

  function new_game_received(data){
      //console.log(data);
      var ts = new Date();
      var h = ts.getHours();
      var m = ts.getMinutes();
      var s = ts.getSeconds();
      var zeit = h+":"+m+":"+s;
      console.log(zeit + "- " + "Send new Game");
    socket.broadcast.emit('new_game', data);
    //io.sockets.emit (to all including sender);
  }

  function neuer_stich_received(data){
      //console.log(data);
      var ts = new Date();
      var h = ts.getHours();
      var m = ts.getMinutes();
      var s = ts.getSeconds();
      var zeit = h+":"+m+":"+s;
      console.log(zeit + "- " + "Neuer Stich");
    socket.broadcast.emit('neuer_stich', data);
    //io.sockets.emit (to all including sender);
  }

  function armut_received(data){
      //console.log(data);
      var ts = new Date();
      var h = ts.getHours();
      var m = ts.getMinutes();
      var s = ts.getSeconds();
      var zeit = h+":"+m+":"+s;
      console.log(zeit + "- " + "Armut Empfangen");
    socket.broadcast.emit('armut', data);
    //io.sockets.emit (to all including sender);
  }

}
//
