import {Comment} from '../search/types.ts';
import {GraphQLClient} from "graphql-request";
import {gql} from "graphql-request";

// const GITHUB_GQL_URL = 'https://api.github.com/graphql';
// const accessToken = process.env.REACT_APP_GITHUB_ACCESS_TOKEN;
const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL

const client = new GraphQLClient(GRAPHQL_URL);

// TODO: move & de-dup
interface CommentSearchResult {
    id: number,
    author: string,
    url: string,
    body: string,
}

// TODO: move
interface CommentsSearchResultsResponse {
    commentsSearchResults: {
        nodes: CommentSearchResult[]
    }
}

export async function handleSearch(query: string, maxResults: number, dispatch: any) {
    // TODO: refactor
    const response: CommentsSearchResultsResponse = await client.request(gql`
        query($query: String!, $maxResults: Int!) {
            commentsSearchResults(first: $maxResults, query: $query) {
                nodes {
                    id
                    author
                    url
                    body
                }
            }
        }
    `, {
        query,
        maxResults,
    })

    const {nodes: comments} = response.commentsSearchResults;

    dispatch({
        type: 'search/setSearchResults',
        payload: comments,
    });
}