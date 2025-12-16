import { SingleLayerNetwork } from "@/core";

import {
    createActors,
    createLinks
} from ".";

export type TestSingleLayerNetworkInit = {
    schema: Required<NonNullable<ConstructorParameters<typeof SingleLayerNetwork>[0]>["schema"]>,
    data: Required<NonNullable<ConstructorParameters<typeof SingleLayerNetwork>[0]>["data"]>,
    not?: Required<NonNullable<ConstructorParameters<typeof SingleLayerNetwork>[0]>["data"]>
};

const AT = createActors(20, (i) => i.toString());

// použít generický init
export const testSingleLayerNetwork: TestSingleLayerNetworkInit = {
    schema: {
        directed: true,
        weighted: true
    },
    data: {
        actors: AT,
        links: createLinks(AT, AT, (s, t) => { return { add: (Number(s) > Number(t)), weight: Number(s) } })
    },
    not: {
        actors: ["21", "22", "23", "a", "b", "c", "  556 ", "abcdef\n"],
        links: createLinks(AT, AT, (s, t) => { return { add: !(Number(s) > Number(t)), weight: Number(s) } })
    }
};

export const createSchemaTestSingleLayerNetwork: (init: TestSingleLayerNetworkInit) => SingleLayerNetwork = (init) => {
    const network = new SingleLayerNetwork({ schema: init.schema });
    return network;
};

export const createActorsTestSingleLayerNetwork: (init: TestSingleLayerNetworkInit) => SingleLayerNetwork = (init) => {
    const network = createSchemaTestSingleLayerNetwork(init);
    for(const actorId of init.data!.actors)
    {
        network.addActor({ actorId });
    }

    return network;
};

export const createFullTestSingleLayerNetwork: (init: TestSingleLayerNetworkInit) => SingleLayerNetwork = (init) => {
    const network = createActorsTestSingleLayerNetwork(init);
    for(const { sourceActorId, targetActorId, weight } of init.data!.links)
    {
        network.addLink({ sourceActorId, targetActorId, weight });
    }

    return network;
};