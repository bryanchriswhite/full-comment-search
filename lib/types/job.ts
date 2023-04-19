import {Context} from "./indexer";

export interface Job<T> {
    ctx: Context;
    // TODO: something better
    [key: string]: T | Context
}