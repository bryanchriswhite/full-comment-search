import express from 'express';
import { postgraphile } from 'postgraphile';

// Create a new Express application
const app = express();

// Define the PostgreSQL connection string
let pgUser = process.env["POSTGRES_USER"],
    pgPass = process.env["POSTGRES_PASSWORD"],
    pgDB = process.env["POSTGRES_DB"],
    pgHost = process.env["POSTGRES_HOST"],
    pgPort = process.env["POSTGRES_PORT"],
    isDevEnv = process.env["NODE_ENV"] === "development"
;
const pgConnection = `postgres://${pgUser}:${pgPass}@${pgHost}:${pgPort}/${pgDB}`;

// Define the PostGraphile schema name and options
const schemaName = 'public';
const postgraphileOptions = {
    watch: isDevEnv,
    graphiql: isDevEnv,
    pgDefaultRole: pgUser,
};

// Expose the PostgreSQL table as a GraphQL API
app.use(
    postgraphile(pgConnection, schemaName, postgraphileOptions)
);

// Start the server
app.listen(3000, () => {
    console.log('GraphQL API server running on port 3000');
});
