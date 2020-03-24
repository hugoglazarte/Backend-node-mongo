var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// ==========================
// VERIFICAR TOKEN / Middlewere
// ==========================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    // validando token
    jwt.verify( token, SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok:false,
                mensaje: 'Token invalido',
                errors: err
            })
        }

        req.usuario = decoded.usuario;

        // si es valido continuamos con los procesos
        next();

        // res.status(200).json({
        //     ok:true,
        //     decoded: decoded
        // })

    });
};

