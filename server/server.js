require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', (req, resp) => {

    resp.json('Get Usuario');
});
app.post('/usuario', (req, resp) => {
    let body = req.body;

    if (body.nombre === undefined) {
        resp.status(400).json({ ok: false, mssg: 'El nombre es necesario' });
    } else {
        resp.json({
            body
        });
    }


});

app.put('/usuario/:id', (req, resp) => {
    let id = req.params.id;
    resp.json({
        id
    });
});

app.delete('/usuario', (req, resp) => {
    resp.json('Delete Usuario');
});

app.listen(process.env.PORT, () => console.log('Escuchando puerto 3000'));