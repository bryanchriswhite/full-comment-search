import {gql} from 'graphql-request';

// TODO: figure out `CreateCommentInput!` doesn't work
export const createCommentsMutation = gql`
    mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
            comment {
                id
            }
        }
    }
`;