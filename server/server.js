require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Configuracion Global de Rutas
app.use(require('./routes/index'));
// Habilitar public
app.use(express.static(`${process.env.ROOT_DIR}/public`))
    // app.use(express.static(path.resolve(__dirname, '../public')));

// Conectar con mongoDB
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('BD Encendida');
});

app.listen(process.env.PORT, () => console.log('Escuchando puerto 3000'));