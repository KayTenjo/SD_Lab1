

var servidorNode ='http://127.0.0.1'; //IP del servidro, debiese ser dinámica para la entrega final
var puerto = 8008; //puerto del servidor Node 
var socket; //En esta variable se guarda la conexión
var socketPartida; //Aqui se guardara la conexión con el servidor de partidas asignado
var miTurno=false;

try {

	//Vamos a establecer la conexión
	socket = io.connect(servidorNode + ':' + puerto + '/');

	//Eventos ejecutados por parte del servidor
	// Cada vez que el servidor solicita un evento, se ejecuta lo que se indica aquí
	socket.on('mensajeDeBienvenida',function(datos){
		alert(datos.mensaje);
		document.getElementById("idUsuario").innerHTML=datos.idUsuario;
	});

	socket.on('actualizarListaUsuarios',function(datos){
		
		var listaString = datos.lista.join("<br>");
		document.getElementById("listaUsuarios").innerHTML=listaString;
		
	});

	socket.on('actualizarListaUsuariosDisponibles',function(datos){
	
		var listaDisponibles = datos.lista.join("<br>");
		document.getElementById("usuariosDisponibles").innerHTML=listaDisponibles;
	
	});

	socket.on('actualizarListaUsuariosJugando',function(datos){
	
		var listaJugando = datos.lista.join("<br>");
		document.getElementById("usuariosJugando").innerHTML=listaJugando;
	
	});

	socket.on('confirmarInvitacion',function(datos){

		var respuesta = confirm("El usuario " + datos.origen + " quiere invitarte a una partida. Presiona OK para aceptar");
		if (respuesta == true)
		  {
		  alert("Acepte yey");
		  socket.emit('armarPartida',{origen: datos.origen, destino: datos.destino});
		  }
		else
		  {
		  alert("Rechaze >=D");
		  }
		  
	});

	socket.on('conectarConServidorPartida', function(datos){

		alert("llegue aqui yey");
		var puertoServidor = datos.puerto;
		socketPartida = io.connect(servidorNode + ':' + puertoServidor + '/');

	});

	socket.on('comenzarPartida1',function(datos){

		miTurno = true;
		document.getElementById("idRival").innerHTML = datos.oponente;
		document.getElementById("turno").innerHTML = "Estás en tu turno";
	});

	socket.on('comenzarPartida2',function(datos){

		miTurno = false;
		document.getElementById("idRival").innerHTML = datos.oponente;
		document.getElementById("turno").innerHTML = "Es el turno oponente";
	});

	socket.on('miTurno',function(datos){

		miTurno = true;
		document.getElementById("turno").innerHTML = "Estás en tu turno";

	});

}

catch (err){

	alert ('No se encuentra disponible el servidor de jeugos =(' +err);
}

function enviarInvitacion(){

	//Vamos a enviar una petición al servidor para que le envíe una alerta
	//al jugador al que se le envío una invitación

	var destino = document.getElementById("idDestino").value;

	socket.emit('enviarInvitacion',{destino: destino});
}

function siguienteTurno(){

	if (miTurno) {

		var oponente = document.getElementById("idRival").value;
		document.getElementById("turno").innerHTML = "Es el turno oponente";
		miTurno =false;
		socket.emit('siguienteTurno',{oponente:oponente});
	}
	
}

