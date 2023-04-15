import Queue from "bull";
import {processNextCommentablesFactory} from "../handlers";
import {Context} from "../../fsm/types";

async function run(ctx: Context): Promise<void> {
    processNextCommentablesFactory(ctx)
}

export default run;
