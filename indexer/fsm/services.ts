import {Context} from "./types.js";
import {addCommentsToDatabase} from "../store.js";

export const fetchCommentables = async (context: Context, event: any) => {
    // const response = await fetch('/api/commentables');
    // const commentables = await response.json();

    // const comments = await fetchNext(ghClient, {
    //     owner,
    //     name,
    //     PRs: {max: 3, comments: {max: 100}},
    //     issues: {max: 3, comments: {max: 100}},
    // })
    //
    // console.log(comments)
    //
    // await addCommentsToDatabase(pgClient, comments);

    console.log("fetchCommentables called")

    return {
        type: 'COMMENTABLES_UPDATED',
        commentables: [],
    };
};

export const paginateComments = async (context: Context, event: any) => {
    // const commentableIds = context.commentables.map((commentable) => commentable.id);
    //
    // for (const id of commentableIds) {
    //     const commentable = context.commentables.find((commentable) => commentable.id === id);
    //
    //     const response = await fetch(`/api/commentables/${id}/comments?page=${commentable.comments.length + 1}`);
    //     const comments = await response.json();
    //
    //     commentable.comments = [...commentable.comments, ...comments];
    // }

    return {
        type: 'COMMENTABLES_UPDATED',
        // commentables: context.commentables,
        commentables: [],
    };
};
