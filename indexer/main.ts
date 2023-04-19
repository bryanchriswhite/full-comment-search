import {interpret} from "xstate";
import {newUpdateMachine} from "./fsm/machine.ts";

import {Context} from "../lib/types/indexer";

// TODO: check `NODE_ENV`
const defaults = {
    repo: "pokt-network/pocket",
    postgraphile: {url: "http://postgraphile:3000/graphql",},
    redis: {url: "http://redis:3000/graphql",},
    github: {url: "https://api.github.com/graphql"}
};
// TODO: replace with node-env
const ghAccessToken = process.env["GITHUB_CLASSIC_ACCESS_TOKEN"],
    pageSize = 100,
    ghRepo = process.env["GITHUB_REPO"] || defaults.repo,
    POSTGRAPHILE_URL = process.env["POSTGRAPHILE_URL"] || defaults.postgraphile.url,
    REDIS_URL = process.env["REDIS_URL"] || defaults.redis.url,
    GITHUB_GRAPHQL_URL = defaults.github.url
;

// TODO: parameterize
const commentablesPageSize = 3;
const commentsPageSize = 100;

// TODO: parameterize (?)
// TODO: fix paths; weird relativeness; OS-agnostic
const storingCommentablesProcessPath = `${__dirname}/queue/processes/storing_commentables.ts`,
    storingCommentsProcessPath = `${__dirname}/queue/processes/storing_comments.ts`,
    fetchCommentablesProcessPath = `${__dirname}/queue/processes/fetching_commentables.ts`,
    fetchCommentsProcessPath = `${__dirname}/queue/processes/fetching_comments.ts`,
    storingConcurrency = 2,
    fetchingConcurrency = 2
;

const [owner, name] = ghRepo.split("/")

async function run() {
    const context: Context = {
        clientConfigs: {
            github: {
                endpointURL: GITHUB_GRAPHQL_URL,
                classicAccessToken: ghAccessToken,
            },
            postgraphile: {
                endpointURL: POSTGRAPHILE_URL,
            },
        },
        queryVars: {
            owner, name,
            pageSize: {
                commentables: commentablesPageSize,
                comments: commentsPageSize,
            },
        },
        queues: {
            fetching: {
                commentables: "nextCommentables",
                comments: "nextComments",
            },
            storing: {
                commentables: "pendingCommentables",
                comments: "pendingComments",
            },
        },
        processes: {
            fetching: {
                commentables: {
                    concurrency: fetchingConcurrency / 2,
                    scriptPath: fetchCommentablesProcessPath,
                },
                comments: {
                    concurrency: fetchingConcurrency / 2,
                    scriptPath: fetchCommentablesProcessPath,
                },
            },
            storing: {
                commentables: {
                    concurrency: storingConcurrency / 2,
                    scriptPath: storingCommentablesProcessPath,
                },
                comments: {
                    concurrency: storingConcurrency / 2,
                    scriptPath: storingCommentablesProcessPath,
                },
            },
        },
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
