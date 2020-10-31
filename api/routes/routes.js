import express from "express";
import bodyParser from "body-parser";

import garbageCollectorRoutes from "./controller/garbageCollectorController.js";
import pricesRoutes from "./controller/pricesCollectorController.js";
import collectionRepository from "../db/repository/collectionRepository.js";
import { generateUserToken } from "../middleware/auth.js";
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/authenticate/:User", (req, res, next) => {
  const user =  req.params.User ;
  var collection_repository = new collectionRepository()
  collection_repository.getByUser(user).then(result=>{

    if(!result) return res.status(404).send("User not found!");

    var token = generateUserToken(user);

    res.header("x-auth-token", token).status(201).send({
      user: req.body.user,
      result: "User Found!",
      _id: result._id
    });
  })
    .catch((err) => next(err));
});

app.use("/garbcollect", garbageCollectorRoutes);
app.use("/prices", pricesRoutes);


app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = "fail";
  err.statusCode = 404;

  next(err);
}); 

export default app;
