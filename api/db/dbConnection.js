import * as mongodb from 'mongodb';
const MongoClient = mongodb.default.MongoClient;
const uri =
  "mongodb+srv://dbadmin:dbadmin@cluster0.mwdek.azure.mongodb.net/<garbage_collection>?retryWrites=true&w=majority";

var _instance;
class dbconnection {
  open(callback) {
    var client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true  });
    client.connect((err,connection) => {
      if (err) return console.log(err);
      _instance = connection;
      return callback(err);
    });
  }

  getInstance(){
    return _instance;
  }

  close(){
    _instance.close();
  }
}

export default new dbconnection();
