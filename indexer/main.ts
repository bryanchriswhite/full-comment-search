import {GraphQLClient} from 'graphql-request';
import commentableMachine from "./fsm/machine.js";
import {interpret} from "xstate";

const defaults = {
    repo: "pokt-network/pocket",
    postgraphile: { endpoint: "http://postgraphile:3000/graphql", },
    github: { endpoint: "https://api.github.com/graphql" }
};
// TODO: replace with node-env
const ghAccessToken = process.env["GITHUB_CLASSIC_ACCESS_TOKEN"],
    pageSize = 100,
    ghRepo = process.env["GITHUB_REPO"] || defaults.repo,
    POSTGRAPHILE_ENDPOINT = process.env["POSTGRAPHILE_ENDPOINT"] || defaults.postgraphile.endpoint,
    GITHUB_GRAPHQL_ENDPOINT = defaults.github.endpoint
;

const [owner, name] = ghRepo.split("/")


// github graphql client
const ghClient = new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, {
    headers: {
        Authorization: `Bearer ${ghAccessToken}`,
    },
});

// postgraphile graphql client
const pgClient = new GraphQLClient(POSTGRAPHILE_ENDPOINT, {
    // headers: {
    //     Authorization: `Bearer ${ghAccessToken}`,
    // },
});

async function run() {
    const stateMachine = interpret(commentableMachine).start();

    stateMachine.send('FETCH_COMMENTABLES');
}

function handleError(error: any) {
    console.error(`Fatal error: ${error.name}: ${error.message};\n${error.stack}`)
    process.exit(1)
}

await run().catch(handleError);
