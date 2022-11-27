/**
 *  utilities mongo db
 */
import got from "got";
import { MongoClient } from "mongodb";
import { atlas, appdb } from "./config.js";

const getJsonFromWWWPromise = (URL) => {
  return new Promise((resolve, reject) => {
    got(URL, { responseType: "json" })
      .then((response) => {
        resolve(response.body);
      })
      .catch((err) => {
        console.log(`Error ==> ${err}`);
        reject(err);
      });
  });
};

let db;
const getDBInstance = async () => {
  if (db) {
    console.log("using established connection to Atlas");
    return db;
  }
  try {
    console.log("establishing new connection to Atlas");
    const conn = await MongoClient.connect(atlas, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = conn.db(appdb);
  } catch (err) {
    console.log(err);
  }
  return db;
};

// Delete the collection’s contents before loading any data
const deleteAll = (db, coll) => db.collection(coll).deleteMany({});

// Delete one document from the collection
const deleteOne = (db, coll, doc) => db.collection(coll).deleteMany(doc);

// Add one document to the collection
const addOne = (db, coll, doc) => db.collection(coll).insertOne(doc);

// find one document
const findOne = (db, coll, doc) => db.collection(coll).findOne(doc);

// find all documents
const findAll = (db, coll, criteria, projection) =>
  db.collection(coll).find(criteria).project(projection).toArray();

// search a collection and find unique values
const findUniqueValues = (db, coll, field) =>
  db.collection(coll).distinct(field);

export {
  getJsonFromWWWPromise,
  getDBInstance,
  deleteAll,
  deleteOne,
  addOne,
  findOne,
  findAll,
  findUniqueValues,
};
