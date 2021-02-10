const path = require('path');

//Directorio Proyecto
process.env.ROOT_DIR = path.resolve(__dirname, '../../');
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


// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '1054539970645-e8hdin6uvlj4a7a1k6j0obaiq3eeeifg.apps.googleusercontent.com';