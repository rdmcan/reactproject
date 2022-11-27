/**
 * schema: a JSON object that defines the the structure and data content.
 * These include primitives, as well as structural types,
 */

import { buildSchema } from "graphql";

const schema = buildSchema(`
type Query {
    setupalerts:res,
    alerts: [alert],
    alertsforregion(region: String): [alert],
    alertsforsubregion(subregion: String): [alert],
    regions: [String],
    subregions: [String],
    regionamericas: [String],
    findAlert(name: String): alert,
    travellersName: [Traveller],
    travellerInfo(name: String): [Traveller]
}

type res {
    results: String
}

type alert {
    country: String
    name: String
    text: String
    date: String
    region: String
    subregion: String
    }

type Traveller {
    _id: String
    name: String
    country: String
    text: String
    date: String
}

type Mutation {
        addOneTraveller(name: String, country: String, text: String, date: String): Traveller
}
`);

export { schema };
