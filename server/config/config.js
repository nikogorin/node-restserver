// import { url } from "inspector";

// ==============================
// Puerto
// ==============================
process.env.PORT = process.env.PORT || 3000;


// ==============================
// Entorno
// ==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============================
// Vencimiento del token
// ==============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

let caducidadToken;
if (process.env.NODE_ENV === 'dev') {
    caducidadToken = '365d';
} else {
    caducidadToken = '48h';
}

process.env.CADUCIDAD_TOKEN = caducidadToken;

// ==============================
// SEED de autenticacion
// ==============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ==============================
// Base de datos
// ==============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;


// ==============================
// Google client ID
// ==============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '271848087052-159n0vjudf6ashdpurn1okvb8o29ngp9.apps.googleusercontent.com';