const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

module.exports = (req,res,next) => {
  const [authType, token] = req.headers.authorization.split(" ")
  console.log(token)

  if(token) {
    jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
      if (error) {
        console.log(error);
        res.status(401).json({message: "you shall not pass!"})
      } else {
        req.decodedJwt = decodedToken;

        next();
      }
    })
  } else {
    res.status(400).json({ message: "provide authentication info"});
  }
};