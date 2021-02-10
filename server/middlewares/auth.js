const jwt = require('jsonwebtoken');


// Verificar Token
const verificarToken = (req, res, next) => {
    const token = req.get('token');
    console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err)
            return res.status(401).json({
                ok: false,
                err
            });

        req.usuario = decoded.usuario;
        next();

    })
}

const verificarTokenImg = (req, res, next) => {
    const token = req.query.token;
    console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err)
            return res.status(401).json({
                ok: false,
                err
            });

        req.usuario = decoded.usuario;
        next();

    })
}

const verificaAdminRole = (req, res, next) => {

    const { role } = req.usuario;
    if (role == 'ADMIN_ROLE')
        next();
    else
        return res.status(401).json({
            ok: false,
            err: "No tiene permisos de aministrador"
        })

};


module.exports = {
    verificarToken,
    verificarTokenImg,
    verificaAdminRole
}