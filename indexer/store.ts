import {GraphQLClient} from 'graphql-request';
import {Comment} from "../lib/types/index.ts";
import {createCommentsMutation} from "./mutations.ts";

// TODO: move (?)
interface CreateCommentPayload {
    createComment: {
        comment: Comment;
    };
}

export async function addCommentsToDatabase(client: GraphQLClient, comments: Comment[]): Promise<void> {
    const commentInputs = comments.map((comment) => ({
        input: {
            comment: {
                author: comment.author,
                url: comment.url,
                body: comment.body,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            }
        },
    }));

    try {
        for (const commentInput of commentInputs) {
            const { createComment } = await client.request<CreateCommentPayload>(createCommentsMutation, commentInput);
            console.log(`Comment ${createComment.comment.id} created`);
        }
    } catch (error) {
        console.error("Error adding comments to database", error);
    }
}
