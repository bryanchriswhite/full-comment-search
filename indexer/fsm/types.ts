import {Queue} from "bull";
import {GraphQLClient} from "graphql-request";

// TODO: consolidate w/ lib/types (?)
export interface Context {
    clients: {
        github: GraphQLClient,
        postgraphile: GraphQLClient,
    }
    queryVars: {
        owner: string;
        name: string;
        pageSize: {
            commentables: number,
            comments: number,
        }
    }
    queues: {
        fetching: {
            commentables: Queue,
            comments: Queue,
        },
        storing: {
            commentables: Queue,
            comments: Queue,
        }
    }
    processes: {
        fetching: {
            commentables: ProcessConfig,
            comments: ProcessConfig,
        },
        storing: {
            commentables: ProcessConfig,
            comments: ProcessConfig,
        }
    }
}

export interface ProcessConfig {
    concurrency: number;
    scriptPath: string;
}