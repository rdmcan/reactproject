/**
 * Resolver:  a function that's responsible for populating the data for a single field in the schema.
 * Custom resolvers allow you to define new root-level operations
 */

import * as dbRtns from "../utilities.js";
import { coll } from "../config.js";
import { colltravel } from "../config.js";
import { loadCountries } from "../setupalerts.js";

const resolvers = {
  setupalerts: async () => {
    let result = await loadCountries();
    return { results: result };
  },
  alerts: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, coll, {}, {});
  },
  alertsforregion: async (args) => {
    let db = await dbRtns.getDBInstance();
    let results = await dbRtns.findAll(db, coll, { region: args.region });
    return results;
  },
  alertsforsubregion: async (args) => {
    let db = await dbRtns.getDBInstance();
    let results = await dbRtns.findAll(db, coll, { subregion: args.subregion });
    return results;
  },
  regions: async () => {
    let db = await dbRtns.getDBInstance();
    let result = await dbRtns.findUniqueValues(db, coll, "region");
    return result;
  },
  subregions: async () => {
    let db = await dbRtns.getDBInstance();
    let result = await dbRtns.findUniqueValues(db, coll, "subregion");
    return result;
  },
  regionamericas: async () => {
    let db = await dbRtns.getDBInstance();
    let collamericas = await dbRtns.findAll(db, coll, { region: "Americas" });
    let res = collamericas.map((country) => country.text);
    let result = [...new Set(res)];
    return result;
  },
  findAlert: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findOne(db, coll, { name: args.name });
  },
  addOneTraveller: async (args) => {
    let db = await dbRtns.getDBInstance();
    let traveller = {
      name: args.name,
      country: args.country,
      text: args.text,
      date: args.date,
    };
    let results = await dbRtns.addOne(db, colltravel, traveller);
    return results ? traveller : null;
  },
  travellersName: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, colltravel, {}, {});
  },
  travellerInfo: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, colltravel, { name: args.name });
  },
};

export { resolvers };
