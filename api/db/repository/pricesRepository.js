import dbconnection from "../dbconnection.js";
import * as mongodb from "mongodb";

const ObjectId = mongodb.default.ObjectID;

var mongoCollectionName = "prices";
var mongodbName = "garbage_collection";

class pricesRepository {
  open() {
    return new Promise((resolve, reject) => {
      dbconnection.open(function (err, client) {
        if (err) console.log(err);
        var db = dbconnection.getInstance().db(mongodbName);
        resolve(db.collection(mongoCollectionName));
      });
    });
  }

   getAll() {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.find().toArray((err, results) => {
          if (err) throw err;
          dbconnection.close();
          resolve(results);
        });
      }).catch((err)=>{reject(err)});
    });
  } 
  
  
  getById(id) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.findOne(ObjectId(id), (err, result) => {
          if (err) throw err;
          if(!result) throw new Error("Register not found");         
          dbconnection.close();
          resolve(result);
        });
      }).catch((err)=>{reject(err)});
    });
  }

  getByFilter(query) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.find(query).toArray((err, result) => {
          if (err) throw err;
          dbconnection.close();
          resolve(result);
        });
      }).catch((err)=>{reject(err)});
    });
  }

  add(pricedata) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.insertOne(pricedata, function (err, result) {
          if (err) throw err;
          console.log("1 document inserted");
          dbconnection.close();
          resolve(result);
        });
      }).catch((err)=>{reject(err)});
    });
  }

  update(pricedata) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        var query = { _id: ObjectId(pricedata._id) };
        delete pricedata._id;
        var newValues = { $set: pricedata };
        db.updateOne(query, newValues, (err, result) => {
          if (err) throw err;
          console.log("Registro atualizado da base!");
          dbconnection.close();
          resolve(result);
        });
      }).catch((err)=>{reject(err)});
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.deleteOne({ _id: ObjectId(id) }, (err, result) => {
          if (err) throw err;
          console.log("Registro deletado da base!");
          dbconnection.close();
          resolve(result);
        });
      }).catch((err)=>{reject(err)});
    });
  }
}

export default pricesRepository;
