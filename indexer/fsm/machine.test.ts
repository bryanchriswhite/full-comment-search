import {interpret} from "xstate";
import newUpdateMachine from "./machine";
import {Context} from "./types";
import {GraphQLClient} from "graphql-request";
import DoneCallback = jest.DoneCallback;

jest.mock<GraphQLClient>('graphql-request');

const ghClient = new GraphQLClient("")
const pgClient = new GraphQLClient("")
// @ts-ignore
ghClient.request.mockResolvedValue()
pgClient.request.mockResolvedValue()

const mockContext: Context = {
    ghClient,
    pgClient,
    owner: "owner",
    name: "name",
    storeCommentablesQueue: [],
    storeCommentsQueue: [],
    fetchCommentablesQueue: [],
    fetchCommentsQueue: [],
};

const mockServices = {
    queueAll: jest.fn(),
    upsertAll: jest.fn(),
    logError: jest.fn(),
    logUpdated: jest.fn(),
};

for (const service of Object.values(mockServices)) {
    service.mockResolvedValue(undefined);
}

describe("newUpdateMachine", () => {
    it("should call the service functions after UPDATE event is sent", (done: DoneCallback) => {
        const updateMachine = newUpdateMachine(mockContext).withConfig({
            services: mockServices,
        });

        const service = interpret(updateMachine).start();

        service.send("UPDATE");

        service.onDone(() => {
            expect(mockServices.queueAll).toHaveBeenCalled();
            expect(mockServices.upsertAll).toHaveBeenCalled();
            expect(mockServices.logUpdated).toHaveBeenCalled();
            done()
        });

    });
});
