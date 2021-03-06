var puerto = 8008;//puerto por el cual se conectaran al servidor de nodejs html
var io= require('socket.io').listen(puerto, { log: false });

console.log("Empezó a funcionar el Servidor Central de partidas");

var usuariosConectados = new Array();
var usuariosDisponibles = new Array();
var socketsConectados = new Array();
var usuariosJugando = new Array();


io.sockets.on('connection', function (socket) {

	usuariosConectados.push(socket.id);
	//usuariosConectados.push("<br>")
	usuariosDisponibles.push(socket.id);
	socketsConectados.push(socket);
	
	console.log("Se conectó el usuario " + socket.id);
	socket.emit('mensajeDeBienvenida',{mensaje:"Bienvenido al servidor de juegos gato usuario: "+socket.id , idUsuario: socket.id});
	// socket.emit envia el mensaje solamente a "socket", que vendría siendo el cliente conectado específico.
	io.sockets.emit('actualizarListaUsuarios', {lista: usuariosConectados}); //io.sockets.emit manda a todos los clientes 

	io.sockets.emit('actualizarListaUsuariosDisponibles', {lista: usuariosDisponibles}); 
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
	    usuariosJugando.splice( usuariosJugando.indexOf( socket.id  ), 1);

	    io.sockets.emit('actualizarListaUsuarios', {lista: usuariosConectados});
	    io.sockets.emit('actualizarListaUsuariosDisponibles', {lista: usuariosDisponibles}); 
		io.sockets.emit('actualizarListaUsuariosJugando', {lista: usuariosJugando});

	});

	socket.on('enviarInvitacion',function(datos){

		var socketDestino = socketsConectados[usuariosConectados.indexOf(datos.destino)];
		console.log("El usuario: " + socket.id + " ha invitado al usuario " + socketDestino.id + " a un juego");

		//socketDestino.emit('confirmarInvitacion',{origen: socket});
		io.sockets.socket(socketDestino.id).emit('confirmarInvitacion',{origen: socket.id, destino:socketDestino.id});
	});

	socket.on('armarPartida',function(datos){

		console.log ("Se armará una partida entre " + datos.origen + " y " +  datos.destino);

		//Usuarios disponibles
	    usuariosDisponibles.splice( usuariosDisponibles.indexOf( datos.origen  ), 1);	    
	    usuariosDisponibles.splice( usuariosDisponibles.indexOf( datos.destino  ), 1);
	    io.sockets.emit('actualizarListaUsuariosDisponibles', {lista: usuariosDisponibles}); 

	    //Usuarios jugando		
		usuariosJugando.push(datos.origen);
		usuariosJugando.push(datos.destino);
		io.sockets.emit('actualizarListaUsuariosJugando', {lista: usuariosJugando});

		var aux_carga = cargaServidores[0];
		var aux_servidor=0;
		for (var i=0;i<cargaServidores.length;i++)
			{ 
			if (cargaServidores[i]< aux_carga) {

				aux_carga = cargaServidores[i];
				aux_servidor =i;
			};

			}

		var servidorDestino = servidoresConectados[aux_servidor];
		var puertoDestino = puertosServidores[aux_servidor];

		console.log("voy a conectarme al puerto " + puertoDestino);
		

		io.sockets.socket(datos.origen).emit('conectarConServidorPartida',{puerto:puertoDestino });
		io.sockets.socket(datos.destino).emit('conectarConServidorPartida',{puerto:puertoDestino});

		/*servidorDestino.write(

			JSON.stringify(

				{ opcion:0, jugador1: datos.origen, jugador2: datos.destino}
			)
		); */




	});



});


///////////////////////////////////////////////////////////
//COMUICACIÓN CON SERVIDORES DE PARTIDA NODEJS/////

const net = require("net");
var servidoresConectados = new Array();
var cargaServidores = new Array();
var puertosServidores = new Array();

puertosServidores.push(8007);

var server = net.createServer(function (client) {
    
    servidoresConectados.push(client);

    console.log("Se ha conectado un servidor de juegos");  

    client.on('data', function(data) {    //client de algun lado aparece.... pero se debe referir al servidor xD
     
    });
    
  
    server.on('error', function(err){
        console.log("Error: "+err)
    });
});

// Listen for connections
server.listen(61337, "localhost", function () {
    console.log("Servidor creado");
});