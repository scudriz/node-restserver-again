const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaRole } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuarios', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                });

            })

        });

})

app.post('/usuarios', [verificaToken, verificaRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    })


})

app.put('/usuarios/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;
    //To pick only values that can be updated
    let body = _.pick(req.body, ['nombre', 'img', 'email', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

})

app.delete('/usuarios/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;

    Usuario.findById(id)
        .exec((err, usuario) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (usuario.estado == true) {

                Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDesactivado) => {

                    return res.json({
                        ok: true,
                        usuario: usuarioDesactivado
                    });
                });

            } else {

                return res.status(400).json({
                    ok: false,
                    err: "Usuario ya no existe"
                });
            }



        });


})

module.exports = app;