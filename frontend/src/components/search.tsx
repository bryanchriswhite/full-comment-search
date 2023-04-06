import { Comment } from '../search/types.ts';
import {GraphQLClient} from "graphql-request";
import {gql} from "graphql-request";

// const GITHUB_GQL_URL = 'https://api.github.com/graphql';
// const accessToken = process.env.REACT_APP_GITHUB_ACCESS_TOKEN;
const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL

const client = new GraphQLClient(GRAPHQL_URL);

export async function handleSearch(searchQuery: string, dispatch: any) {
    // TODO: refactor
    const response = await client.request(gql`
        query($query: String!) {
            comments(filter: {bodyTsv: {matches: $query}}, orderBy: BODY_TSV_RANK_DESC) {
                nodes {
                    id
                    author
                    url
                    body
                }
            }
        }
    `)

    const result = await response.;
    const comments: Comment[] = result.data.comments;

    dispatch({
        type: 'search/setSearchResults',
        payload: comments,
    });
}