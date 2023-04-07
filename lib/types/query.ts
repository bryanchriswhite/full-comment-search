
export interface paginatedQueryArgs {
    max: number,
    after?: string,
    before?: string,
}

export interface commentsQueryArgs extends paginatedQueryArgs {
    comments: paginatedQueryArgs
}
export interface nextQueryArgs {
    owner: string,
    // TODO: rename to `repo` (?)
    name: string,
    PRs: commentsQueryArgs,
    issues: commentsQueryArgs,
}
