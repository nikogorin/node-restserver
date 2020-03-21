const express = require('express');
let { verificaToken, verificaAdmin_Rol } = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();

let Categoria = require('../models/categoria');

// =================================
// Mostrar todas las categorias
// =================================
app.get('/categoria', verificaToken, (req, res) => {
    // let desde = req.query.desde || 0;
    // let limite = req.query.limite || 15;

    // desde = Number(desde);
    // limite = Number(limite);

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        // .skip(desde)
        // .limit(limite)
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    count: conteo,
                    categoria
                });
            });
        });
});

// =================================
// Mostrar una categoria por ID
// =================================
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// =================================
// Crear nueva categoria
// =================================
app.post('/categoria', [verificaToken, verificaAdmin_Rol], (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
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
            categoria: categoriaDB
        });
    });
});

// =================================
// Actualizar una categoria
// =================================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Rol], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Categoria.findByIdAndUpdate(id, body, options, (err, categoriaDB) => {

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
            categoria: categoriaDB
        });
    })
});

// =================================
// Borrar una categoria
// =================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Rol], (req, res) => {
    let id = req.params.id;

    Categoria.findOneAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'categoria borrada'
        });
    });

});


module.exports = app;