import { Comment } from '../search/types.ts';

// const GITHUB_GQL_URL = 'https://api.github.com/graphql';
// const accessToken = process.env.REACT_APP_GITHUB_ACCESS_TOKEN;
const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL

export async function handleSearch(searchQuery: string, dispatch: any) {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
        query {
          comment(
            where: {
              body_tsv: {
                _fts: "${searchQuery}",
                _language: "english"
              }
            }
          ) {
            id
            author
            url
            body
            created_at
            updated_at
          }
        }
      `,
        }),
    });

    const result = await response.json();
    const comments: Comment[] = result.data.comments;

    dispatch({
        type: 'search/setSearchResults',
        payload: comments,
    });
}