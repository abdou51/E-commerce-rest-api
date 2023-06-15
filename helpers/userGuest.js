const jwt = require('jsonwebtoken');

function userGuest(req, res, next) {

  const authHeader = req.headers['authorization'];


  if (!authHeader || !authHeader.startsWith('Bearer ')) {

    req.user = null;
    next();
    return; 
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.secret);
    req.user = decoded;

    next();
  } catch (err) {

    return res.sendStatus(403).json("wrong token");
  }
}

module.exports = userGuest;
