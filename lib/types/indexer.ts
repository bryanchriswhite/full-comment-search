import Queue from "bull";
import {QueryVars} from "./query";

export interface GitHubGQLConfig {
    endpointURL: string;
    classicAccessToken: string;
}

export interface PostgraphileGQLConfig {
    endpointURL: string;
}

// TODO: consolidate w/ lib/types (?)
// Context MUST be serializable (included in Bull job objects)
export interface Context {
    clientConfigs: {
        github: GitHubGQLConfig;
        postgraphile: PostgraphileGQLConfig;
    }
    queryVars: QueryVars
    queues: {
        fetching: {
            commentables: string;
            comments: string;
        },
        storing: {
            commentables: string;
            comments: string;
        }
    }
    processes: {
        fetching: {
            commentables: ProcessConfig;
            comments: ProcessConfig;
        },
        storing: {
            commentables: ProcessConfig;
            comments: ProcessConfig;
        }
    }
}

export interface ProcessConfig {
    concurrency: number;
    scriptPath: string;
}