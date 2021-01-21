const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


app.post('/login', (req, res) => {

    let { body } = req;

    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Contraseña Incorrecta'
            });
        }

        const token = jwt.sign({
            usuario
        }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 });

        res.status(200).json({
            ok: true,
            usuario: usuario,
            token
        });

    })
});












module.exports = app;