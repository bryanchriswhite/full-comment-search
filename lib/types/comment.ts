export enum CommentableType {
    ISSUE = "issue",
    PR = "pull_request",
}

// TODO: deduplicate with frontend types
export interface Comment {
    id: string;
    // TODO: add
    // githubId: string;
    // commentableId: string;
    author: string;
    url: string;
    body: string;
    createdAt: string;
    updatedAt: string;
}

// TODO: update
export interface Commentable {
    id: string;
    type: CommentableType,
}

export interface CommentsPage {
    commentableType: CommentableType;
    commentableId: string;
    afterComment: string;
}

export interface CommentablesPage {
    commentableType: CommentableType;
    after: string;
}