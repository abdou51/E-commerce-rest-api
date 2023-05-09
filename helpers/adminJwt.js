const jwt = require('jsonwebtoken');

function adminJwt(req, res, next) {
  // Get the Authorization header from the request
  const authHeader = req.headers['authorization'];

  // Check if the header is undefined or does not start with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json("Token is required");
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.secret);
    req.user = decoded;

    // Check if the decoded user object has the isadmin attribute and it's true
    if (decoded.isAdmin === true) {
      next();
    } else {
      return res.status(403).json("You do not have permission to perform this action");
    }

  } catch (err) {
    return res.status(403).json("Invalid token");
  }
}

module.exports = adminJwt;
