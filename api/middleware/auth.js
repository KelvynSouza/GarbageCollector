import jwt from "jsonwebtoken";
import config from "config";
import collectionRepository from "../db/repository/collectionRepository.js";

function auth(req, res, next) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) return res.status(401).send("Access denied. No token provided.");
  const tokenToRead = token.split(" ")[1];
  try {
    const decoded = jwt.verify(tokenToRead, config.get("privatekey"));
    
    var collectRepository = new collectionRepository()
    collectRepository.getByUser(decoded.user).then(result=>{
        if(!result) return res.status(401).send("Access denied. Token invalid!");
        next();
    })
    
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

function generateUserToken(user) {
  const token = jwt.sign({ user }, config.get("privatekey"));
  return token;
}

export { auth, generateUserToken };
