var puerto = 8008;//puerto por el cual se conectaran al servidor de nodejs html
var io= require('socket.io').listen(puerto, { log: false });

console.log("Empezó a funcionar el Servidor Central de partidas");

var usuariosConectados = new Array();
var usuariosDisponibles = new Array();
var socketsConectados = new Array();

io.sockets.on('connection', function (socket) {

	usuariosConectados.push(socket.id);
	//usuariosConectados.push("<br>")
	usuariosDisponibles.push(socket.id);
	socketsConectados.push(socket);
	
	console.log("Se conectó el usuario " + socket.id);
	socket.emit('mensajeDeBienvenida',{mensaje:"Bienvenido al servidor de juegos gato usuario: "+socket.id , idUsuario: socket.id});
	// socket.emit envia el mensaje solamente a "socket", que vendría siendo el cliente conectado específico.
	io.sockets.emit('actualizarListaUsuarios', {lista: usuariosConectados}); //io.sockets.emit manda a todos los clientes 
	//socket.confirm("holaholaohoal");
	//Vamos a recibir la solicitud de enfrentamiento de un usuario.

	/*socket.on('enviarSolicitudBatalla', function(datos){

		var destino= datos.destino;
		
		if (confirm('Are you sure you want to save this thing into the database?')) 

		}); */

	socket.on('disconnect', function () {
	    console.log("se desconecto el usuario "+socket.id);  
	    usuariosConectados.splice( usuariosConectados.indexOf( socket.id  ), 1);
	    usuariosDisponibles.splice( usuariosDisponibles.indexOf( socket.id  ), 1);
	    socketsConectados.splice( socketsConectados.indexOf( socket ), 1);

	    io.sockets.emit('actualizarListaUsuarios', {lista: usuariosConectados});

		
	});

	socket.on('enviarInvitacion',function(datos){

		var socketDestino = socketsConectados[usuariosConectados.indexOf(datos.destino)];
		console.log("El usuario: " + socket.id + " ha invitado al usuario " + socketDestino.id + " a un juego");

		//socketDestino.emit('confirmarInvitacion',{origen: socket});
		io.sockets.socket(socketDestino.id).emit('confirmarInvitacion',{origen: socket.id});
	});

});


