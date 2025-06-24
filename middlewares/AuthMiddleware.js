const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(403).json({ mensagem: "Acesso negado. Faça login primeiro." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ mensagem: "Token inválido" });
  }
};