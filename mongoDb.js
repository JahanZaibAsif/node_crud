const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";

const database = "crud";

const client = new MongoClient(url);

let dbConnect = async () => {
  let result = await client.connect();
  let db = result.db(database);
  return (collection = db.collection("product"));
}

module.exports=dbConnect;
