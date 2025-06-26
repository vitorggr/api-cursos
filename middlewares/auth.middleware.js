const jwt = require('jsonwebtoken');

module.exports = {
    verificarToken: (req, res, next) => {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
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