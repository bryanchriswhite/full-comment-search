import { gql, GraphQLClient } from 'graphql-request';
import {Comment} from "../lib/types/index.js";

interface CreateCommentInput {
    author: string;
    url: string;
    body: string;
    created_at: string;
    updated_at: string;
}

interface CreateCommentPayload {
    createComment: {
        comment: Comment;
    };
}

async function addCommentsToDatabase(client: GraphQLClient, comments: Comment[]): Promise<void> {
    const mutation = gql`
        mutation CreateComment($input: CreateCommentInput!) {
            createComment(input: $input) {
                comment {
                    id
                }
            }
        }
    `;

    const variables = comments.map((comment) => ({
        input: {
            author: comment.author,
            url: comment.url,
            body: comment.body,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
        },
    }));

    try {
        for (const variable of variables) {
            const { createComment } = await client.request<CreateCommentPayload>(mutation, variable);
            console.log(`Comment ${createComment.comment.id} created`);
        }
    } catch (error) {
        console.error(`Error adding comments to database: ${error.message}`);
    }
}
