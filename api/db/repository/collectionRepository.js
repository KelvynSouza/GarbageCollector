import dbconnection from "../dbConnection.js";
import * as mongodb from "mongodb";

const ObjectId = mongodb.default.ObjectID;

var mongoCollectionName = "collection";
var mongodbName = "garbage_collection";

class collectionRepository {
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

  getByUser(user) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.findOne({user}, (err, result) => {
          if (err) throw err;
          dbconnection.close();
          resolve(result);
        });
      }).catch((err)=>{reject(err)});
    });
  }


  add(userdata) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.insertOne(userdata, function (err, result) {
          if (err) throw err;
          console.log("1 document inserted");
          dbconnection.close();
          resolve(result);
        });
      }).catch((err)=>{reject(err)});
    });
  }

  update(userdata) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        var query = { _id: ObjectId(userdata._id) };
        delete userdata._id;

        var newValues = 
        {
          $set:{
          user:userdata.user          
          },
          $inc:{            
            'collected_garbage.glass':userdata.collected_garbage.glass,
            'collected_garbage.plastic':userdata.collected_garbage.plastic,
            'collected_garbage.metal':userdata.collected_garbage.metal,
            'collected_garbage.paper':userdata.collected_garbage.paper
              
          }
        }
        
        db.findOneAndUpdate(query, newValues, (err, result) => {
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

export default collectionRepository;
