import { gql } from 'graphql-request';

export const pullRequestCommentsQuery = gql`
    query PullRequestComments(
        $owner: String!,
        $name: String!,
        $maxPRs: Int!,
        $maxComments: Int!,
        $afterPR: String,
        $beforePR: String,
        $afterComment: String,
        $beforeComment: String
    ) {
        repository(owner: $owner, name: $name) {
            pullRequests(first: $maxPRs, after: $afterPR, before: $beforePR) {
                pageInfo {
                    hasNextPage
                    endCursor
                }
                nodes {
                    createdAt
                    updatedAt
                    comments(first: $maxComments, after: $afterComment, before: $beforeComment) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            id
                            author {
                                login
                            }
                            body
                            url
                            createdAt
                            updatedAt
                        }
                    }
                }
            }
        }
    }
`;

export const issueCommentsQuery = gql`
    query IssueComments(
        $owner: String!,
        $name: String!,
        $maxIssues: Int!,
        $afterIssue: String,
        $beforeIssue: String,
        $maxComments: Int!,
        $afterComment: String,
        $beforeComment: String
    ) {
        repository(owner: $owner, name: $name) {
            issues(first: $maxIssues, after: $afterIssue, before: $beforeIssue) {
                pageInfo {
                    hasNextPage
                    endCursor
                }
                nodes {
                    createdAt
                    updatedAt
                    comments(first: $maxComments, after: $afterComment, before: $beforeComment) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            id
                            author {
                                login
                            }
                            body
                            url
                            createdAt
                            updatedAt
                        }
                    }
                }
            }
        }
    }
`;
