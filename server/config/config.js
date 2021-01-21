// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BD
let urlDB;

//Seed Autenticacion
process.env.SEED = process.env.SEED || 'seed-dev';
//Fecha de vencimiento del token
process.env.CAD_TOKEN = { expiresIn: 60 * 60 * 24 * 30 };


if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else
    urlDB = process.env.MONGODB_URL;

process.env.URLDB = urlDB;