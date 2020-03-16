require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const colors = require('colors');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuracion globales de rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) throw err;

        console.log('Base de datos '.cyan + 'ONLINE'.green);
    });



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:'.cyan, process.env.PORT.green);
})