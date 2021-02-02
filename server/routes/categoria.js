const express = require('express');
const { verificarToken, verificaAdminRole } = require('../middlewares/auth');
const app = express();

const Categoria = require('../models/categoria');


// Obtener todas las categorias

app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario')
        .exec((err, categoriasDB) => {
            if (err)
                res.status(401).json({
                    ok: false,
                    err
                });

            res.status(200).json({
                ok: true,
                categorias: categoriasDB
            });
        });
});

// Obtener categoria por ID
app.get('/categoria/:id', verificarToken, (req, res) => {
    const { id } = req.params || null;
    Categoria
        .findById(id, (err, categoriasDB) => {
            if (err)
                res.status(401).json({
                    ok: false,
                    err
                });

            res.status(200).json({
                ok: true,
                categorias: categoriasDB
            });
        })
});


app.post('/categoria', verificarToken, (req, res) => {
    const id = req.usuario._id;
    const { body } = req;

    req.h

    if (!body.descripcion)
        return res.status(400).json({
            ok: false,
            message: 'La descripción es necesaria'
        });
    else {
        let categoria = new Categoria({
            descripcion: body.descripcion,
            usuario: id
        });

        categoria.save((err, categoriaDB) => {
            if (err)
                res.status(401).json({
                    ok: false,
                    err
                });
            else
                res.status(200).json({
                    ok: true,
                    categoria: categoriaDB
                });
        })
    }

});

app.put('/categoria/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { body } = req;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err)
            res.status(401).json({
                ok: false,
                err
            });
        else
            res.status(200).json({
                ok: true,
                categoria: categoriaDB
            });
    });
});


app.delete('/categoria/:id', [verificarToken, verificaAdminRole], (req, res) => {
    const { id } = req.query;

    Categoria.findByIdAndRemove(id, (err, deleted) => {
        if (err)
            res.status(401).json({
                ok: false,
                err
            });
        if (!deleted) {
            res.status(401).json({
                ok: false,
                err: 'El ID no es correcto'
            });
        } else
            res.status(200).json({
                ok: true,
                message: `La categoria ${deleted} ha sido eliminada`
            });
    })
});


module.exports = app;