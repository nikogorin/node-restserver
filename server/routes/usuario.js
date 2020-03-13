const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Rol } = require('../middlewares/autenticacion');

const app = express();


app.get('/', function(req, res) {
    res.json('Hello World')
})

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email rol estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    count: conteo,
                    usuario
                })
            })
        })

})

app.post('/usuario', [verificaToken, verificaAdmin_Rol], (req, res) => {

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

        usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
})

app.put('/usuario/', [verificaToken, verificaAdmin_Rol], (req, res) => {

    let id = req.body.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Usuario.findByIdAndUpdate(id, body, options, (err, usuarioDB) => {

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
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Rol], (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
})

module.exports = app;