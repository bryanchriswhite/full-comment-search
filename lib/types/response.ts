export interface IssueCommentsResponse {
    repository: {
        issues: {
            nodes: ResponseIssue[];
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
            };
        };
    };
}

// ResponseIssue is the interface of the GitHub graphql Issue object.
export interface ResponseIssue {
    id: string;
    title: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    comments: {
        nodes: ResponseComment[];
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string;
        };
    };
}

// ResponseComment is the interface of the GitHub graphql Comment object.
export interface ResponseComment {
    id: string;
    author: {
        login: string;
    };
    body: string;
    url: string;
    createdAt: String;
    updatedAt: String;
}