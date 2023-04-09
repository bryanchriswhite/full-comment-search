// TODO: deduplicate with frontend types
export interface Comment {
    id: string;
    author: string;
    url: string;
    body: string;
    createdAt: string;
    updatedAt: string;
}

// TODO: update
export interface Commentable {
    id: string;
    comments: any[];
}