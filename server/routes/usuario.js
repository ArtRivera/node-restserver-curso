const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
// Config MiddleWares
const { verificarToken, verificaAdminRole } = require('../middlewares/auth');


app.get('/usuario', verificarToken, (req, resp) => {

    const estado = req.query.estado || 'true';

    let desde = Number(req.query.desde) || 0;

    let limit = Number(req.query.limit) || 5;


    Usuario.find({ estado }, 'nombre img role google estado email')
        .skip(desde)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.countDocuments({ estado }, (err, count) => {
                resp.status(200).json({
                    ok: true,
                    usuarios,
                    count
                });
            });
        });
});

// Insertar usuario
app.post('/usuario', [verificarToken, verificaAdminRole], (req, resp) => {

    let { body } = req;

    if (body.nombre === undefined) {
        resp.status(400).json({ ok: false, mssg: 'El nombre es necesario' });
    } else {
        let body = req.body;
        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });
        usuario.save((err, usuarioDB) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    err
                })
            } else {
                return resp.status(200).json({
                    ok: true,
                    usuario: usuarioDB
                });
            }
        });

    }


});

// Actualizar usuario
app.put('/usuario/:id', [verificarToken, verificaAdminRole], (req, resp) => {
    let id = req.params.id;
    let { body } = req;

    body = _.omit(body, ['google', 'password']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                err
            })
        } else {
            resp.status(200).json({
                ok: true,
                usuario: usuarioBD
            });

        }

    });

});

//Borrar usuario
app.delete('/usuario/:id', [verificarToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    const cambiaEstado = {
        estado: false
    }

    // Usuario.findByIdAndRemove(id, (err, deleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, deleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!deleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: deleted
        });
    })
});

module.exports = app;