import {gql} from 'graphql-request';

export const createCommentsMutation = gql`
    mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
            comment {
                id
            }
        }
    }
`;