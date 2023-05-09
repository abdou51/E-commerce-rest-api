const jwt = require('jsonwebtoken');

function userJwt(req, res, next) {
  // Get the Authorization header from the request
  const authHeader = req.headers['authorization'];

  // Check if the header is undefined or does not start with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {

    return res.sendStatus(401).json("Token is required");
  }


  const token = authHeader.substring(7);

  try {

    const decoded = jwt.verify(token, process.env.secret);
    req.user = decoded;
    console.log(req.user)


    next();
  } catch (err) {

    return res.sendStatus(403).json("wrong token");
  }
}

module.exports = userJwt;