import { MultiplexNetwork } from "@/core";

import {
    createActors,
    createLinks
} from ".";

export type TestMultiplexNetworkInit = {
    schema: Required<NonNullable<ConstructorParameters<typeof MultiplexNetwork>[0]>["schema"]>,
    data: Required<NonNullable<ConstructorParameters<typeof MultiplexNetwork>[0]>["data"]>,
    not?: {
        schema: Required<NonNullable<ConstructorParameters<typeof MultiplexNetwork>[0]>["schema"]>,
        data: Required<NonNullable<ConstructorParameters<typeof MultiplexNetwork>[0]>["data"]>
    }
};

const AT = createActors(20, (i) => i.toString());

export const testMultiplexNetwork: TestMultiplexNetworkInit = {
    schema: { 
        "L1": {
            directed: true,
            weighted: true
        },
        "L2": { },
        "L3": {
            directed: true,
            weighted: false
        },
        "L4": {
            directed: false,
            weighted: true
        }
    },
    data: {
        actors: AT,
        links: {
            "L1": createLinks(AT, AT, (s, t) => { return { add: (Number(s) > Number(t)), weight: Number(s) } }),
            "L2": createLinks(AT, AT, (s, t) => { return { add: (Number(s) > Number(t)) } }),
            "L3": createLinks(AT, AT, () => { return { add: true } }),
            "L4": createLinks(AT, AT, (s, t) => { return { add: (Number(s) > Number(t)), weight: Math.max(Number(s), Number(t)) } })
        }
    },
    not: {
        schema: ["L0", "L5", "L6", "Non existing layer"],
        data: {
            actors: ["21", "22", "23", "a", "b", "c", "  556 ", "abcdef\n"],
            links: {
                "L1": createLinks(AT, AT, (s, t) => { return { add: !(Number(s) > Number(t)), weight: Number(s) } }),
                "L2": createLinks(AT, AT, (s, t) => { return { add: (s == t) } }),
                "L3": createLinks(AT, AT, () => { return { add: false } }),
                "L4": createLinks(AT, AT, (s, t) => { return { add: (s == t), weight: Math.max(Number(s), Number(t)) } })
            }
        }
    }
};

export const createSchemaTestMultiplexNetwork: (init: TestMultiplexNetworkInit) => MultiplexNetwork = (init) => {
    const network = new MultiplexNetwork();
    if(init?.schema instanceof Array)
    {        
        for(const layerId of init!.schema)
        {
            network.addLayer({ layerId });
        }
    }
    else if(init?.schema !== undefined)
    {
        for(const layerId in init!.schema)
        {
            network.addLayer({ layerId, ...init!.schema[layerId] });
        }
    }

    return network;
};

export const createActorsTestMultiplexNetwork: (init: TestMultiplexNetworkInit) => MultiplexNetwork = (init) => {
    const network = createSchemaTestMultiplexNetwork(init);
    for(const actorId of init.data!.actors)
    {
        network.addActor({ actorId });
    }

    return network;
};

export const createFullTestMultiplexNetwork: (init: TestMultiplexNetworkInit) => MultiplexNetwork = (init) => {
    const network = createActorsTestMultiplexNetwork(init);
    for(const layerId in init.data!.links)
    {
        for(const { sourceActorId, targetActorId, weight } of init.data!.links[layerId])
        {
            network.addLink({ layerId, sourceActorId, targetActorId, weight });
        }
    }

    return network;
};