import {GraphQLClient} from 'graphql-request';
import {fetchNext} from "./fetch.js";
import {addCommentsToDatabase} from "./store.js";

const DefaultRepo = "pokt-network/pocket"
const ghAccessToken = process.env["GITHUB_CLASSIC_ACCESS_TOKEN"],
    ghRepo = process.env["GITHUB_REPO"] || DefaultRepo,
    pageSize = 100
;

const [owner, name] = ghRepo.split("/")

const endpoint = 'https://api.github.com/graphql';

const client = new GraphQLClient(endpoint, {
    headers: {
        Authorization: `Bearer ${ghAccessToken}`,
    },
});

async function run() {
    const comments = await fetchNext(client, {
        owner,
        name,
        PRs: {max: 3, comments: {max: 100}},
        issues: {max: 3, comments: {max: 100}},
    })

    console.log(comments)

    await addCommentsToDatabase(client, comments);
}

function handleError(error: any) {
    console.error(`Fatal error: ${error.name}: ${error.message};\n${error.stack}`)
    process.exit(1)
}

await run().catch(handleError);
