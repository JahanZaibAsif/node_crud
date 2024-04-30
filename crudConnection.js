const {MongoClient} = require('mongodb');

const { Collection } = require("mongoose");

const url = "mongodb://localhost:27017";

const database = "crud_node";

const client = new MongoClient(url);


const crudConnection = async () => {
    let connection = await client.connect();
    let db = await connection.db(database);
    return (Collection = db.Collection('student'))
  } 
  module.exports=crudConnection;