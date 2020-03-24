// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// var SEED = require('../config/config').SEED;

// MIDDLEWARE DE AUTENTICACION
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

app.get('/', (req, res, next) => {

    Usuario.find( {}, 'nombre img email role').exec(( err, usuarios ) => {
        if(err){
            return res.status(500).json({
                ok: true,
                mensaje: 'Error en peticion GET',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });
    });

});

// ==========================
// CREAR NUEVO USUARIO / con middleware (mdAutenticacion)
// ==========================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( ( err, usuarioGuardado ) => {

        if(err){
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });
});

// ==========================
// VERIFICAR TOKEN / Middlewere
// ==========================

// app.use('/', (req, res, next) => {

//     var token = req.query.token;

//     // validando token
//     jwt.verify( token, SEED, (err, decoded) => {

//         if(err){
//             return res.status(401).json({
//                 ok:false,
//                 mensaje: 'Token invalido',
//                 errors: err
//             })
//         }
//     });

//     // si es valido continuamos con los procesos
//     next();

// })



// ==========================
// UPDATE USUARIO
// ==========================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById( id, (err, usuario) => {

        // Error
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        // NO encontro
        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                errors: { message: 'No existe usuario con ese ID' }
            });
        }
        // Encontro usuario
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar usuario',
                    errors: err
                });
            }

            // una vez que guardo, oculto la pass
            usuarioGuardado.password = ':-)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            })
        });

    });

});

// ==========================
// ELIMINAR USUARIO
// ==========================
app.delete('/:id', (req, res) => {
    
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'error al borrar usuario',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })

    });

});


module.exports = app;