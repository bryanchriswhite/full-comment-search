import {GraphQLClient} from 'graphql-request';
import {fetchNext} from "./lib/fetch.js";

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
    // const prResponse = await client.request(pullRequestCommentsQuery, { owner, name, pageSize }) as any;
    // const issueResponse = await client.request(issueCommentsQuery, { owner, name, pageSize }) as any;
    //
    // const comments: Comment[] = prResponse.repository.pullRequests.nodes
    //     .concat(issueResponse.repository.issues.nodes)
    //     .flatMap((node: any) => node.comments.nodes)
    //     .map((comment: ResponseComment) => ({
    //         id: comment.id,
    //         author: comment.author.login,
    //         body: comment.body,
    //         url: comment.url,
    //     }));
    //
    // console.log('Found comments:', comments);

    const comments = await fetchNext(client, {
        owner,
        name,
        PRs: {max: 3, comments: {max: 100}},
        issues: {max: 3, comments: {max: 100}},
    })

    // console.log(`Fetched comments: ${comments}`)
    console.log(comments)
}

function handleError(error: any) {
    console.error(`Fatal error: ${error.name}: ${error.message};\n${error.stack}`)
    process.exit(1)
}

await run().catch(handleError);
