import {GraphQLClient} from 'graphql-request';
import {newUpdateMachine} from "./fsm/machine";
import {interpret} from "xstate";
import {Context} from "./fsm/types";
import {Comment, Commentable} from "../lib/types";

// TODO: check `NODE_ENV`
const defaults = {
    repo: "pokt-network/pocket",
    postgraphile: { url: "http://postgraphile:3000/graphql", },
    redis: { url: "http://redis:3000/graphql", },
    github: { url: "https://api.github.com/graphql" }
};
// TODO: replace with node-env
const ghAccessToken = process.env["GITHUB_CLASSIC_ACCESS_TOKEN"],
    pageSize = 100,
    ghRepo = process.env["GITHUB_REPO"] || defaults.repo,
    POSTGRAPHILE_URL = process.env["POSTGRAPHILE_URL"] || defaults.postgraphile.url,
    REDIS_URL = process.env["REDIS_URL"] || defaults.redis.url,
    GITHUB_GRAPHQL_URL = defaults.github.url
;

const [owner, name] = ghRepo.split("/")


// github graphql client
const ghClient = new GraphQLClient(GITHUB_GRAPHQL_URL, {
    headers: {
        Authorization: `Bearer ${ghAccessToken}`,
    },
});

// TODO: add authentication
// postgraphile graphql client
const gqlClient = new GraphQLClient(POSTGRAPHILE_URL);

// TODO: replace with `Bull` queues
const commentablesQueue: Commentable[] = [];
const commentsQueue: Comment[] = [];

async function run() {
    const context: Context = {
        gqlClient,
        owner,
        name,
        commentablesQueue,
        commentsQueue,
    }
    const stateMachine = interpret(newUpdateMachine(context)).start();

    // TODO: moove 'UPDATE' to const
    stateMachine.send({type: 'UPDATE'});
}

function handleError(error: any) {
    console.error(`Fatal error: ${error.name}: ${error.message};\n${error.stack}`)
    process.exit(1)
}

await run().catch(handleError);
