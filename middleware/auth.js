// check jwt from request
const jwt = require("jsonwebtoken");
const config = require("config");
//check with sample token
// curl -i -X GET -H 'x-auth-token: token?here' http://localhost:5001/api/auth

module.exports = function (req, res, next) {
  //get token from header
  const token = req.header("x-auth-token");
  //check if no token
  if (!token) {
    return res.status(401).json({ message: "no token, authorization deny" });
  }
  // verify token
  try {
    const decoded = jwt.verify(token, config.get("jwt"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
