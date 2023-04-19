
export interface paginatedQueryArgs {
    after?: string,
    before?: string,
}

export interface QueryVars {
    owner: string;
    name: string;
    pageSize: {
        commentables: number;
        comments: number;
    }
    pageVars?: {
        commentables?: paginatedQueryArgs;
        comments?: paginatedQueryArgs;
    };
}
