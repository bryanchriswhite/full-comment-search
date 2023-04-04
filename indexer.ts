import { GraphQLClient } from 'graphql-request';
import { searchQuery } from './lib/queries';
import { URLSearchParams } from 'url';

const endpoint = 'https://api.github.com/graphql';

const client = new GraphQLClient(endpoint, {
    headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`,
    },
});

async function run() {
    const queryVariables = new URLSearchParams({
        q: 'repo:facebook/react is:issue is:open sort:updated-desc',
        type: 'issue',
    });

    const { search } = await client.request(searchQuery, {
        q: queryVariables.toString(),
        first: 5,
    });

    const comments = search.nodes.flatMap((issue: any) => issue.comments.nodes);

    const mutation = /* GraphQL */ `
        mutation AddComments($comments: [AddCommentInput!]!) {
            addComments(input: { comments: $comments }) {
                clientMutationId
            }
        }
    `;

    const variables = {
        comments: comments.map((comment: any) => ({
            author: comment.author.login,
            body: comment.body,
            url: comment.url,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        })),
    };

    try {
        await client.request(mutation, variables);
        console.log('Comments added successfully');
    } catch (error) {
        console.error('Failed to add comments:', error.response.errors);
    }
}

function handleError(error: Error) {
    console.error(`Fatal error: ${error.name}: ${error.message};\n${error.stack}`)
    process.exit(1)
}

await run().catch(handleError);
