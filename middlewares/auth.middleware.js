const jwt = require('jsonwebtoken');

module.exports = {
    verificarToken: (req, res, next) => {
        // Aceita token no header Authorization (Bearer), em cookies, ou em query param (para compatibilidade total)
        let token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (req.query && req.query.token) {
            token = req.query.token;
        }
        if (!token) {
            return res.status(403).json({ mensagem: 'Token não fornecido' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.usuarioId = decoded.id;
            next();
        } catch (error) {
            res.status(403).json({ mensagem: 'Token inválido' });
        }
    }
};