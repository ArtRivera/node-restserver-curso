const express = require('express');
let app = express();
const { verificarToken } = require('../middlewares/auth');

let Producto = require('../models/producto');

// Obtener productos
app.get('/productos', verificarToken, (req, res) => {

    const desde = Number(req.query.desde) || 0;
    const limit = Number(req.query.limit) || 10;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limit)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productosDB) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            res.status(200).json({
                ok: true,
                productos: productosDB
            });
        });

});

//Buscar productos
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    const { termino } = req.params;

    const regexp = new RegExp(termino, 'i');

    Producto.find({ nombre: regexp })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            res.status(200).json({
                ok: true,
                producto: productoDB
            });

        })

})

app.get('/producto/:id', verificarToken, (req, res) => {

    const { id } = req.params;

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });

            res.status(200).json({
                ok: true,
                producto: productoDB
            })

        });
});

app.post('/producto', verificarToken, (req, res) => {

    const body = req.body || null;
    const usuario = req.usuario;

    if (body) {
        const producto = new Producto({
            nombre: body.nombre,
            precioUni: Number(body.precio),
            descripcion: body.descripcion,
            categoria: body.categoria,
            usuario: usuario._id
        });

        producto.save((err, productoDB) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });

            res.status(200).json({
                ok: true,
                producto: productoDB
            })
        })

    }
});

app.put('/producto/:id', verificarToken, (req, res) => {

    const { id } = req.params;
    const body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });

        if (!productoDB)
            return res.status(400).json({
                ok: false,
                err: {
                    mssg: 'No fue encontrado el producto'
                }
            });

        res.status(200).json({
            ok: true,
            producto: productoDB
        })
    });
});


app.delete('/producto/:id', verificarToken, (req, res) => {
    const { id } = req.params;

    Producto.findByIdAndUpdate(id, { 'disponible': false }, { new: true }, (err, productoDB) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });

        if (!productoDB)
            return res.status(400).json({
                ok: false,
                err: {
                    mssg: 'No fue encontrado el producto'
                }
            });

        res.status(200).json({
            ok: true,
            producto: productoDB
        })
    });
})

module.exports = app;