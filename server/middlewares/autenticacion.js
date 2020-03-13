const jwt = require('jsonwebtoken');


// ========================
// Verificar Token
// ========================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no válido.'
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};

// ========================
// Verificar Admin Rol
// ========================

let verificaAdmin_Rol = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        let usuario = decoded.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                ok: false,
                err: 'El usuario no es administrador'
            });
        }

        next();

    });
}

module.exports = {
    verificaToken,
    verificaAdmin_Rol
}