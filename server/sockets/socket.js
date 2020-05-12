const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios')

const { crearMensajes } = require('../utilidades/utilidades')

const usuarios = new Usuarios()


io.on('connection', (client) => {
    client.on('entrarChat', (usuario, callback) => {
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre / sala es necesario'
            })
        }
        client.join(usuario.sala)
        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonaXSala(usuario.sala))
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensajes('Admin', `${usuario.nombre} se unió`))

        callback(usuarios.getPersonaXSala(usuario.sala))
    })

    client.on('crearMensaje', (data, callback) => {
        
        let persona = usuarios.getPersona(client.id)
        let mensaje = crearMensajes(persona.nombre, data.mensaje)
        client.broadcast.to(data.sala).emit('crearMensaje', mensaje)
        callback(mensaje)
    })

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id)

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensajes('Admin', `${personaBorrada.nombre} salió`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonaXSala(personaBorrada.sala))
    })

    // Mensaje Privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id)
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensajes(persona.nombre, data.mensaje))

    })
});

