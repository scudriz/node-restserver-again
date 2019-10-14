const express = require('express');
const _ = require('underscore');
const Producto = require('../models/producto');
const { verificaToken, verificaRole } = require('../middlewares/autenticacion');
const app = express();

app.get('/productos', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email') //se especifica los campos que se desean mostrar
        .populate('categoria', 'descripcion') //se especifica los campos que se desean mostrar
        .sort('nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos: productoDB,
                    total: conteo
                });

            })

        });

})

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    console.log(regex);

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion') //se especifica los campos que se desean mostrar
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productoDB,
            });

        });
});

app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.findById(id)
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email') //se especifica los campos que se desean mostrar
        .populate('categoria', 'descripcion') //se especifica los campos que se desean mostrar
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe en BD'
                    }
                });
            }

            res.json({
                ok: true,
                productos: productoDB,
            });

        });

})

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: req.usuario._id // id esta en el token que se recibe
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos: productoDB
        });
    })

})

app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    //To pick only values that can be updated
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos: productoDB
        });
    });

})

app.delete('/productos/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .exec((err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }

            if (producto.disponible === true) {

                Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productos) => {

                    return res.json({
                        ok: true,
                        productos
                    });
                });

            } else {

                return res.status(400).json({
                    ok: false,
                    err: "Producto ya no existe"
                });
            }



        });

})

module.exports = app;