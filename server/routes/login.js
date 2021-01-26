const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


// Configuaraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log(payload.picture);
    console.log(payload.name);
    console.log(payload.email);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {
    let { idtoken } = req.body;
    console.log(idtoken);

    const googleUser = await verify(idtoken)
        .catch(e => {
            return res.status(401).json({
                ok: false,
                error: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion Normal'
                    }
                });
            } else {
                const token = jwt.sign({
                    usuarioDB
                }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 });

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // Si el user no existe en la BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                const token = jwt.sign({
                    usuario
                }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 });

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            })

        }
    });
});












module.exports = app;