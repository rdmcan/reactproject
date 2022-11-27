import dotenv from "dotenv";

dotenv.config();

const gocalerts = process.env.GOCALERTS;
const isocountries = process.env.ISOCOUNTRIES;
const atlas = process.env.DBURL;
const appdb = process.env.DB;
const port = process.env.PORT;
const coll = process.env.COLLECTION;
const colltravel = process.env.COLLECTRAVEL;
const graphql = process.env.GRAPHQLURL;

export {
  gocalerts,
  isocountries,
  atlas,
  appdb,
  port,
  coll,
  graphql,
  colltravel,
};
