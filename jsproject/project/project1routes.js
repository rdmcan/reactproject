import * as dbRtns from "./utilities.js";
// import { coll } from "./config.js";
import { loadCountries } from "./setupalerts.js";
import express from "express";
const router = express.Router();

// define a default route to retrieve all users
router.get("/", async (req, res) => {
  try {
    let db = await dbRtns.getDBInstance();
    const getResult = await loadCountries();
    res.status(200).send({ results: getResult });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get all countries failed - internal server error");
  }
});

export { router };
