//

var servidorNode = 'http://127.0.0.1'; //IP del servidro, debiese ser dinámica para la entrega final
var puerto = 8008; //puerto del servidor Node 
var socket; //En esta variable se guarda la conexión

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
		
		var listaString = datos.lista.join();
		document.getElementById("listaUsuarios").innerHTML=listaString;
		
	});

	socket.on('confirmarInvitacion',function(datos){

		var respuesta = confirm("El usuario " + datos.origen + " quiere invitarte a una partida. Presiona OK para aceptar");
		if (respuesta == true)
		  {
		  alert("Acepte yey");
		  }
		else
		  {
		  alert("Rechaze >=D");
		  }

			});

	/*socket.on('recibirSolicitudBatalla',function(datos){

		var destino = datos.destino;

		if (confirm('Are you sure you want to save this thing into the database?')){

		}
	}): */

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