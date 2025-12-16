import { BipartiteNetwork } from "@/core";

import {
    createActors,
    createLinks
} from ".";

export type TestBipartiteNetworkInit = {
    schema: Required<NonNullable<ConstructorParameters<typeof BipartiteNetwork>[0]>>["schema"]
    data: Required<NonNullable<ConstructorParameters<typeof BipartiteNetwork>[0]>>["data"],
    not?: Required<NonNullable<ConstructorParameters<typeof BipartiteNetwork>[0]>>["data"]
};

const AT1 = createActors(20, (i) => i.toString());
const AT2 = createActors(5, (i) => i.toString());

export const testBipartiteNetwork: TestBipartiteNetworkInit = {
    schema: { weighted: true },
    data: {
        actors: {
            source: AT1,
            target: AT2,
        },
        links: createLinks(AT1, AT2, (s, t) => { return { add: (Number(s) > Number(t)), weight: Number(s) + Number(t) } })
    },
    not: {
        actors: {
                source: ["21", "22", "23", "a", "b", "c", "  556 ", "abcdef\n"],
                target: ["6", "7", "13", "21", "22", "23", "a", "b", "c", "  556 ", "abcdef\n"]
            },
            links: createLinks(AT1, AT2, (s, t) => { return { add: !(Number(s) > Number(t)) } })
    }
};

export const createSchemaTestBipartiteNetwork: (init: TestBipartiteNetworkInit) => BipartiteNetwork = (init) => {
    const network = new BipartiteNetwork({ schema: init.schema });
    return network;
};

export const createActorsTestBipartiteNetwork: (init: TestBipartiteNetworkInit) => BipartiteNetwork = (init) => {
    const network = createSchemaTestBipartiteNetwork(init);
    for(const actorId of init.data!.actors!.source!)
    {
        network.addSourceActor({ actorId });
    }
    for(const actorId of init.data!.actors!.target!)
    {
        network.addTargetActor({ actorId });
    }

    return network;
};

export const createFullTestBipartiteNetwork: (init: TestBipartiteNetworkInit) => BipartiteNetwork = (init) => {
    const network = createActorsTestBipartiteNetwork(init);
    for(const { sourceActorId, targetActorId, weight } of init.data!.links!)
    {
        network.addLink({ sourceActorId, targetActorId, weight });
    }

    return network;
};