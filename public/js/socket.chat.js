var socket = io();

var params = new URLSearchParams(window.location.search)

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El nombre es necesario')
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function () {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(res){
        console.log('Usuarios conectados', res);
        
    })

});

// escuchar
socket.on('disconnect', function () {

    console.log('Perdimos conexión con el servidor');

});

// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function (resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function (mensaje) {
    console.log('Servidor:', mensaje);
});

socket.on('listaPersonas', function (mensaje) {
    console.log('Personas:', mensaje);
});

// Mensajes Privados
socket.on('mensajePrivado', function(data){
    console.log('Mensaje Privado:', data);
    
})
