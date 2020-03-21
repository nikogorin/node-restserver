const express = require('express');
const _ = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
let Producto = require('../models/producto');

// =================================
// Mostrar todas los productos
// =================================

app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    desde = Number(desde);
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productosBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    count: conteo,
                    productos: productosBD
                })
            })
        })
})

// =================================
// Mostrar una categorias
// =================================

app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
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
                        message: 'El id no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// =================================
// Mostrar una categorias
// =================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })
})


// =================================
// Crear un categoria
// =================================

app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
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

        res.status(201).json({
            ok: true,
            categoria: productoDB
        });
    });
});


app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body; //_.pick(req.body, ['nombre', 'precioUni', 'descripcion']);

    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Producto.findByIdAndUpdate(id, body, options, (err, productoDB) => {
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
                    message: 'El id no es correcto'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        if (body.disponible)
            productoDB.disponible = body.disponible;
        if (body.categoria)
            productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });


    });
});

app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Producto.findByIdAndUpdate(id, { disponible: false }, options, (err, productoDB) => {
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
                    message: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            message: `Se elimino el producto ${productoDB.nombre}`
        });
    });
});
module.exports = app;