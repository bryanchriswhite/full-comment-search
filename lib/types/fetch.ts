import {CommentsPage, Comment, CommentablesPage, Commentable} from "./comment";

export interface FetchResult {
    commentables: Commentable[];
    comments: Comment[];
    next: {
        commentables?: CommentablesPage,
        comments?: CommentsPage[],
    };
}