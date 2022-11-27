import { port, graphql } from "./config.js";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { resolvers } from "./graphql/resolvers.js";
import { schema } from "./graphql/schema.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Application middleware
app.use((req, res, next) => {
  console.log("Time:", new Date() + 3600000 * -5.0); // GMT-->EST
  next();
});

// parse application/json
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// error message
app.use((err, req, res, next) => {
  // Do logging and user-friendly error message display
  console.error(err);
  res.status(500).send("internal server error");
});

// synchronize the react routes with the express routes
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "public/index.html")));
app.use(express.static("public"));

// graphql setup // cors(),
app.use(graphql, graphqlHTTP({ schema, rootValue: resolvers, graphiql: true }));

app.listen(port);
// console.log(`Server ready on localhost:${port}${graphql}`); // ${server}
console.log(`Server ready on port ${port}${graphql} - ${process.env.NODE_ENV}`);
