import express from "express";
import pkg from "celebrate";
const { celebrate } = pkg;

import { auth } from "../../middleware/auth.js";

import {
  postPricesValidator,
  putPricesValidator,
} from "../validator/pricesValidator.js";

import pricesRepository from "../../db/repository/pricesRepository.js";
import collectionRepository from "../../db/repository/collectionRepository.js";

const prices_repository = new pricesRepository();
const collection_repository = new collectionRepository();
const router = express.Router();

router.get("/", auth, (req, res, next) => {
  prices_repository
    .getAll()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => next(err));
});

router.get("/:Name", auth, (req, res, next) => {
  const item = { item: req.params.Name };
  if (!item) return res.status(404).send("Please, inform a user!");

  prices_repository
    .getByName(item)
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

router.get("/User/:Name", auth, (req, res, next) => {
  const user = req.params.Name;
  if (!user) return res.status(404).send("Please, inform a user!");

  collection_repository
    .getByUser(user)
    .then((userinfo) => {
      CalculateTotalEarned(userinfo).then(result=>{
        res.status(200).json(result);
      });  
    })
    .catch((err) => next(err));
});

//Helpers

function CalculateTotalEarned(userinfo) {
  return new Promise((resolve, reject) =>{
    prices_repository
    .getAll()
    .then((all_garbage_info) => {
      const glass_info = all_garbage_info.find(
        (garbage) => (garbage.item = "glass")
      );
      const plastic_info = all_garbage_info.find(
        (garbage) => (garbage.item = "plastic")
      );
      const metal_info = all_garbage_info.find(
        (garbage) => (garbage.item = "metal")
      );
      const paper_info = all_garbage_info.find(
        (garbage) => (garbage.item = "apper")
      );

      const user_collected_glass = userinfo.collected_garbage.glass;
      const user_collected_plastic = userinfo.collected_garbage.plastic;
      const user_collected_metal = userinfo.collected_garbage.metal;
      const user_collected_paper = userinfo.collected_garbage.paper;

      var user_total_recicled =
        user_collected_glass +
        user_collected_plastic +
        user_collected_metal +
        user_collected_paper;

      var glass_total = {
        energy_spent: glass_info.info.energy * user_collected_glass,
        total_earned: glass_info.info.price * user_collected_glass,
      };

      var plastic_total = {
        energy_spent: plastic_info.info.energy * user_collected_plastic,
        total_earned: plastic_info.info.price * user_collected_plastic,
      };

      var metal_total = {
        energy_spent: metal_info.info.energy * user_collected_metal,
        total_earned: metal_info.info.price * user_collected_metal,
      };

      var paper_total = {
        energy_spent: paper_info.info.energy * user_collected_paper,
        total_earned: paper_info.info.price * user_collected_paper,
      };

      var user_energy_spent =
        glass_total.energy_spent +
        plastic_total.energy_spent +
        metal_total.energy_spent +
        paper_total.energy_spent;

      var user_total_earned =
        glass_total.total_earned +
        plastic_total.total_earned +
        metal_total.total_earned +
        paper_total.total_earned;

      resolve( {
        energy_spent: user_energy_spent,
        total_earned: user_total_earned,
        total_recicled: user_total_recicled,
      })
    })
    .catch((err)=>{reject(err)});
  })
}

export default router;
