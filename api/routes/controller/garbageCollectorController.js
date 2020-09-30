import express from "express";
import { auth, generateUserToken } from "../../middleware/auth.js";
import pkg from "celebrate";
const { celebrate } = pkg;

import {
  postGarbageValidator,
  putGarbageValidator,
  postUserValidator,
} from "../validator/garbageCollectorValidator.js";

import collectionRepository from "../../db/repository/collectionRepository.js";

const collection_repository = new collectionRepository();
const router = express.Router();

router.get("/", auth, (req, res, next) => {
  collection_repository
    .getAll()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => next(err));
});

router.get("/:codeID", auth, (req, res, next) => {
  const id = req.params.codeID;
  collection_repository
    .getById(id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => next(err));
});

router.post("/", celebrate(postGarbageValidator), (req, res, next) => {
  collection_repository
    .add(req.body)
    .then((result) => {
      const token = generateUserToken(req.body.user);
      res.header("x-auth-token", token).send({
        user: req.body.user,
      });
      res.status(201).json({ result: "Successfully registered!" });
    })
    .catch((err) => next(err));
});

router.put("/", auth, celebrate(putGarbageValidator), (req, res, next) => {
  collection_repository
    .update(req.body)
    .then((result) => {
      res.status(200).json({ result: "Successfully updated!" });
    })
    .catch((err) => next(err));
});

router.delete("/:codeID", auth, (req, res, next) => {
  const id = req.params.codeID;
  collection_repository
    .delete(id)
    .then((result) => {
      res.status(200).json({
        result: "User Deleted",
      });
    })
    .catch((err) => next(err));
});

router.get("/user/:User", auth, (req, res, next) => {
  const filter = { user: req.params.User };
  collection_repository
    .getByFilter(filter)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => next(err));
});

router.post("/user", celebrate(postUserValidator), (req, res, next) => {
  var user = getBaseUser(req.body.user);
  collection_repository
    .add(user)
    .then((result) => {
      const token = generateUserToken(req.body.user);
      res.header("x-auth-token", token).status(201).send({
        user: req.body.user,
        result: "Successfully registered!",
      });
    })
    .catch((err) => next(err));
});


//Helpers
function getBaseUser(user) {
  return {
    user,
    collected_garbage: {
      glass: 0,
      plastic: 0,
      metal: 0,
      paper: 0,
    },
  };
}

export default router;
