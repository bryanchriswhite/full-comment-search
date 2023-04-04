export const searchQuery = `
  query search($query: String!, $repo: String!) {
    search(query: $query, type: ISSUE, first: 50) {
      edges {
        node {
          ... on Issue {
            id
            title
            number
            url
            body
            author {
              login
            }
            createdAt
            updatedAt
            comments(first: 50) {
              nodes {
                id
                body
                author {
                  login
                }
                createdAt
                updatedAt
              }
            }
          }
          ... on PullRequest {
            id
            title
            number
            url
            body
            author {
              login
            }
            createdAt
            updatedAt
            comments(first: 50) {
              nodes {
                id
                body
                author {
                  login
                }
                createdAt
                updatedAt
              }
            }
          }
        }
      }
    }
  }
`;
