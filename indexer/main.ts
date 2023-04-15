import Queue from "bull";
import {GraphQLClient} from 'graphql-request';
import {interpret} from "xstate";
import {newUpdateMachine} from "./fsm/machine.js";
import {Context} from "./fsm/types.js";
import {Comment, Commentable, CommentablesPage, CommentsPage} from "../lib/types/index.js";

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
const storingCommentablesProcessPath = "./proceses/storing_commentables.js",
    storingCommentsProcessPath = "./processes/storing_comments.js",
    fetchCommentablesProcessPath = "./proceses/fetch_commentables.js",
    fetchCommentsProcessPath = "./processes/fetch_comments.js",
    storingConcurrency = 2,
    fetchingConcurrency = 2
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
const pgClient = new GraphQLClient(POSTGRAPHILE_URL);

// TODO: replace with `Bull` queues
const storingCommentablesQueue = new Queue("pendingCommentables");
const storingCommentsQueue = new Queue("pendingComments");
const fetchingCommentablesQueue = new Queue("nextCommentables");
const fetchingCommentsQueue = new Queue("nextComments");

async function run() {
    const context: Context = {
        clients: {
            github: ghClient,
            postgraphile: pgClient,
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
                commentables: fetchingCommentablesQueue,
                comments: fetchingCommentsQueue,
            },
            storing: {
                commentables: storingCommentablesQueue,
                comments: storingCommentsQueue,
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
