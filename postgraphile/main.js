import express from 'express';
import cors from 'cors';
import { postgraphile } from 'postgraphile';
import PostGraphileConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import PostGraphileFulltextFilterPlugin from 'postgraphile-plugin-fulltext-filter';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';

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
    enhanceGraphiql: isDevEnv,
    pgDefaultRole: pgUser,
    appendPlugins: [
        PostGraphileConnectionFilterPlugin,
        PostGraphileFulltextFilterPlugin,
        // TODO: figure out why this isn't working
        PgSimplifyInflectorPlugin,
    ],
};

// Enable CORS support for all domains
app.use(cors());

// Expose the PostgreSQL table as a GraphQL API
app.use(
    postgraphile(pgConnection, schemaName, postgraphileOptions)
);

// Start the server
app.listen(3000, () => {
    console.log('GraphQL API server running on port 3000');
});
