var puerto = 8007;//puerto por el cual se conectaran al servidor de nodejs html
var io= require('socket.io').listen(puerto, { log: false });
console.log("Se ha iniciado el servidor de partidas");

const net = require("net");

var usuariosConectados = new Array();
var idCentralUsuariosConectados = new Array();

var socketNet = new net.Socket();
socketNet.connect(61337, "127.0.0.1", function () {//Se conecta al servidor central a través de la IP "127.0.0.1" por el puerto "61337"
  console.log("Conexión establecida");
});

////// Funciones de comunicación entre el servidor y clientes///////////////

io.sockets.on('connection', function (socket) {

	console.log ("se ha conectado el usuario " + socket.id);
	usuariosConectados.push(socket.id);
		
	});



//////////////////////////


socketNet.on('data', function(data){//Se reciben todos los mensajes enviados desde el servidor central en la variable "data"
	data = JSON.parse(data);//Se decodifica mensaje data para convertirlo en un objeto JS
	switch(data.opcion){
		case 0: // Cuando se manda un mensaje para que este servidor gestione una partida
		 		console.log ("Me encargare de gestionar la partida entre " + data.jugador1 + " y " + data.jugador2);
		 		idCentralUsuariosConectados.push(data.jugador1);
		 		idCentralUsuariosConectados.push(data.jugador2);
		 		//while (  ( (usuariosConectados.indexOf(data.jugador1) == -1) ||  (usuariosConectados.indexOf(data.jugador2) == -1) )) {}
		 		console.log(usuariosConectados.indexOf(data.jugador1));
		 		//comenzarPartida(data.jugador1,data.jugador2);
		break;

	}
});

socketNet.on('siguienteTurno',function(datos){

	io.sockets.socket(datos.oponente).emit('miTurno',{});

});

socketNet.on('error', function (err) {
  console.log('error'+ err);
});

function comenzarPartida(jugador1,jugador2){

	console.log("Va a comenzar la partida entre " + jugador1+ " y " + jugador2);
	io.sockets.socket(jugador1).emit('comenzarPartida1',{oponente: jugador2});
	io.sockets.socket(jugador2).emit('comenzarPartida2',{oponente: jugador1});

}




