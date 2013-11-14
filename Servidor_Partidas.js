const net = require("net");
var contadorLocal = 0;

var socket = new net.Socket();
socket.connect(61337, "127.0.0.1", function () {//Se conecta a la IP "127.0.0.1" por el puerto "61337"
    console.log("Conexión establecida");
});

socket.on('data', function(data){//Se reciben todos los mensajes enviados desde el servidor central en la variable "data"
	data = JSON.parse(data);//Se decodifica mensaje data para convertirlo en un objeto JS
	switch(data.opcion){
		case 0: // Cuando se manda un mensaje para que este servidor gestione una partida
		 		console.log ("Me encargare de gestionar la partida entre " + data.jugador1 + " y " + data.jugador2);
		break;

		case 1:
	  			if(data.contadorLocal%10==0)console.log("contador global: "+data.contadorGlobal+" contador local: "+data.contadorLocal);
	  	break;
	}
});

socket.on('error', function (err) {
  console.log('error'+ err);
});
