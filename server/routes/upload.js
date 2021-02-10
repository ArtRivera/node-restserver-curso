const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');

//middleware
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //Valida tipo
    const tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) == -1)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo no es valido',
                tipo
            }
        })

    const archivo = req.files.archivo;
    const [, extension] = archivo.name.split('.');
    console.log(extension);
    //extensiones permitidas
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extension) == -1)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })


    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`


    uploadPath = `${process.env.ROOT_DIR}/uploads/${tipo}/${nombreArchivo}`;


    archivo.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Imagen cargada
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;

            default:
                break;
        }

        // res.json({
        //     ok: true,
        //     message: 'Archivo subido exitosamente'
        // });
    });
})


const imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })


    });
}

const imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    error: {
                        message: 'No se pudo guardar la imagen del producto'
                    }
                })
            res.json({
                ok: true,
                Producto: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}

const borrarArchivo = (nombreArchivo, tipo) => {
    const pathImg = `${process.env.ROOT_DIR}/uploads/${tipo}/${nombreArchivo}`;

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;