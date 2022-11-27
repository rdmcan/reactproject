/**
 * create an async method that loads the ISO Countries into an array using
 * the utilities module and then loads the GOCALERTS information into a variable
 * (alertJson shown below).
 */

import * as dbRtns from "./utilities.js";
import { isocountries, gocalerts } from "./config.js";

const sortCountries = (array) => {
  array.sort((a, b) => {
    const nameA = a.country.toUpperCase();
    const nameB = b.country.toUpperCase();

    // sort in an ascending order
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    } // names must be equal
    return 0;
  });
};

// find data in the ISO countries array
const findDataIso = (arr, prop, country) => {
  const arrCountry = arr.find((d) => country == d["alpha-2"]);
  switch (prop) {
    case "name":
      return arrCountry.name;
      break;
    case "region":
      return arrCountry.region;
      break;
    case "sub-region":
      return arrCountry["sub-region"];
      break;
  }
};

// load alerts and iso Countries
const loadCountries = async () => {
  const alertArr = [];
  const noAlertArr = [];
  let results = "";
  try {
    // get db instance
    let db = await dbRtns.getDBInstance();

    // delete all documents from alerts db
    let resultDel = await dbRtns.deleteAll(db, "alerts");
    results += `Deleted ${resultDel.deletedCount} existing documents from alerts collection. `;

    // Retrieved Alert JSON
    const alertJson = await dbRtns.getJsonFromWWWPromise(gocalerts);
    const aJsonCtry = Object.values(alertJson.data);
    results += `Retrieved Alert JSON from remote web site. `;

    // Retrieved Country JSON from remote
    const isoArr = await dbRtns.getJsonFromWWWPromise(isocountries);
    const ctryArr = isoArr.map((item) => {
      return item["alpha-2"];
    });
    results += `Retrieved Country JSON from remote web site. `;

    // Create alert and no alert arrays
    ctryArr.map((country) => {
      const result = aJsonCtry.some((item) => country == item["country-iso"]);
      if (result) {
        aJsonCtry.find((item) => {
          const resCtry = country == item["country-iso"];
          if (resCtry) {
            alertArr.push(
              Object.fromEntries([
                ["country", country],
                ["name", findDataIso(isoArr, "name", country)],
                ["text", item.eng["advisory-text"]],
                ["date", item["date-published"].date],
                ["region", findDataIso(isoArr, "region", country)],
                ["subregion", findDataIso(isoArr, "sub-region", country)],
              ])
            );
          }
        });
      } else {
        isoArr.find((iso) => {
          const resIso = iso["alpha-2"] == country;
          if (resIso) {
            noAlertArr.push(
              Object.fromEntries([
                ["country", iso["alpha-2"]],
                ["name", iso.name],
                ["text", "No travel alerts"],
                ["date", ""],
                ["region", iso.region],
                ["subregion", iso["sub-region"]],
              ])
            );
          }
        });
      }
    });

    // join countries with alerts and no alerts
    const compoundArr = [...alertArr, ...noAlertArr];

    // sort compoundArr by country alpha-2 code
    sortCountries(compoundArr);

    // send compoundArr to Mongo db
    let resultArray = await Promise.allSettled(
      compoundArr.map((user) => {
        return dbRtns.addOne(db, "alerts", user);
      })
    );
    let allDbAlerts = await dbRtns.findAll(db, "alerts", {}, {});
    results += `Added approximately ${allDbAlerts.length} new documents to alerts collection.`;
  } catch (err) {
    console.log(`Error ==> ${err}`);
    process.exit(1, err);
  } finally {
    // process.exit();
    return results;
  }
};

// loadCountries();
export { loadCountries };
