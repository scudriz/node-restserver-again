const express = require('express');
const Categoria = require('../models/categoria');
const { verificaToken, verificaRole } = require('../middlewares/autenticacion');
const app = express();

app.get('/categorias', verificaToken, (req, res) => {

    return res.json({
        seed: process.env.SEED
    })

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Categoria.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email') //se especifica los campos que se desean mostrar
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    categorias,
                    total: conteo
                });

            })

        });

})

app.get('/categorias/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Categoria.findById(id)
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias,
            });

        });

})

app.post('/categorias', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id // id esta en el token que se recibe
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: categoriaDB
        });
    })

})

app.put('/categorias/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let actualizar = {
        descripcion: req.body.descripcion
    }

    Categoria.findByIdAndUpdate(id, actualizar, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: categoriaDB
        });
    });

})

app.delete('/categorias/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: categoriaDB
        });

    });
})

module.exports = app;