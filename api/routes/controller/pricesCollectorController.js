import express from "express";
import pkg from "celebrate";
const { celebrate } = pkg;

import { auth } from "../../middleware/auth.js";


import {
  postPricesValidator,
  putPricesValidator
} from "../validator/pricesValidator.js";

import pricesRepository from "../../db/repository/pricesRepository.js";

const prices_repository = new pricesRepository();
const router = express.Router();

router.get("/",auth, (req, res, next) => {
  prices_repository
    .getAll()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => next(err));
});

router.get("/:Name", auth, (req, res, next) => {
  const query = {item:req.params.codeID};
  prices_repository
    .getByFilter(query)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => next(err));
});

router.post("/", auth, celebrate(postPricesValidator), (req, res, next) => {
  prices_repository
    .add(req.body)
    .then((result) => {
      res.status(201).json({ result: "Successfully registered!" });
    })
    .catch((err) => next(err));
});


router.put("/", auth, celebrate(putPricesValidator), (req, res, next) => {
  prices_repository
    .update(req.body)
    .then((result) => {
      res.status(200).json({ result: "Successfully updated!" });
    })
    .catch((err) => next(err));
});

router.delete("/:codeID", auth, (req, res, next) => {
  const id = req.params.codeID;
  prices_repository
    .delete(id)
    .then((result) => {
      res.status(200).json({
        result: "User Deleted",
      });
    })
    .catch((err) => next(err));
});

export default router;
