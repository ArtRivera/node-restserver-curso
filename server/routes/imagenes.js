const express = require('express');
const fs = require('fs');

const { verificarTokenImg } = require('../middlewares/auth');

const app = express();


app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {
    const { tipo } = req.params;
    const { img } = req.params;

    const pathImg = `${process.env.ROOT_DIR}/uploads/${tipo}/${img}`;

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else
        res.sendFile(`${process.env.ROOT_DIR}/server/assets/no-image.jpg`);
});


module.exports = app;