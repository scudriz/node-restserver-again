const jwt = require('jsonwebtoken');

// =================
// verificar token
// =================

let verificaToken = (req, res, next) => {
    let token = req.get('Authorization'); // obtener header
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Error de Token',
                    err
                }
            });
        }

        req.usuario = decoded.usuario
        next();
    });

};


let verificaRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El ususario no es administrador'
            }
        });
    }

    next();

};

module.exports = {
    verificaToken,
    verificaRole
}