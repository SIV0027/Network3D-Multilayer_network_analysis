import type { ActorId } from "@/core";
import {
    createActors,
    createLinks,
    type TestNetworkInit
} from ".";

import { MultilayerNetwork } from "@/core/multilayerNetwork/multilayerNetwork";

import { testNetworkSchema } from "./testNetworkSchema";

const AT1: Array<ActorId> = createActors(20, (i) => (i + 1).toString());
const AT2: Array<ActorId> = createActors(20,  (i) => (i + 1).toString());

export type TestMultilayerNetworkInit = TestNetworkInit<
    Required<NonNullable<ConstructorParameters<typeof MultilayerNetwork>[0]>["schema"]>,
    Required<NonNullable<ConstructorParameters<typeof MultilayerNetwork>[0]>["data"]>
>;

export const testMultilayerNetwork: TestMultilayerNetworkInit = {
    schema: testNetworkSchema.schema,
    data: {
        actors: {
            AT1,
            AT2
        },
        links: {
            "L1:AT1->AT1": createLinks(AT1, AT1, (s, t) => { return { add: (Number(s) > Number(t)), weight: Number(s) } }),
            "L2:AT1->AT1": createLinks(AT1, AT1, (s, t) => { return { add: (Number(s) > Number(t)) } }),
            "L3:AT1->AT2": createLinks(AT1, AT2, (s, t) => { return { add: (Number(s) > Number(t)) } }),
            "L4:AT1->AT2": createLinks(AT1, AT2, (s, t) => { return { add: (Number(s) > Number(t)), weight: (Number(s) + Number(t)) } }),
            "L5:AT2->AT2": createLinks(AT2, AT2, (s, t) => { return { add: (Number(s) > Number(t)), weight: Math.max(Number(s), Number(t)) } }),
            "L6:AT2->AT1": createLinks(AT2, AT1, (s, t) => { return { add: (Number(s) > Number(t)) } })
        }
    },
    not: {
        schema: testNetworkSchema.not!.schema,
        data: {
            actors: {
                "AT1": ["21", "22", "23", "a", "b", "c"],
                "AT2": [" 6", "27", "8 ", "  556 ", "abcdef\n"]
            },
            links: {
                "L1:AT1->AT1": createLinks(AT1, AT1, (s, t) => { return { add: !(Number(s) > Number(t)), weight: Number(s) } }),
                "L2:AT1->AT1": createLinks(AT1, AT1, (s, t) => { return { add: (s == t) } }),
                "L3:AT1->AT2": createLinks(AT1, AT2, (s, t) => { return { add: !(Number(s) > Number(t)) } }),
                "L4:AT1->AT2": createLinks(AT1, AT2, (s, t) => { return { add: (s == t) } }),
                "L5:AT2->AT2": createLinks(AT2, AT2, (s, t) => { return { add: (s == t), weight: Math.max(Number(s), Number(t)) } }),
                "L6:AT2->AT1": createLinks(AT2, AT1, (s, t) => { return { add: (s == t) } })
            }
        }
    }
};

export const createSchemaTestMultilayerNetwork: (init: TestMultilayerNetworkInit) => MultilayerNetwork = (init) => {
    const network = new MultilayerNetwork();
    for(const partitionId of init.schema!.partitions)
    {
        network.addPartition({ partitionId });
    }
    for(const layerId in init.schema!.layers)
    {
        network.addLayer({ layerId, ...init.schema!.layers[layerId] });
    }

    return network;
};

export const createActorsTestMultilayerNetwork: (init: TestMultilayerNetworkInit) => MultilayerNetwork = (init) => {
    const network = createSchemaTestMultilayerNetwork(init);
    for(const partitionId in init.data!.actors)
    {
        for(const actorId of init.data!.actors[partitionId])
        {
            network.addActor({ partitionId, actorId });
        }
    }

    return network;
};

export const createFullTestMultilayerNetwork: (init: TestMultilayerNetworkInit) => MultilayerNetwork = (init) => {
    const network = createActorsTestMultilayerNetwork(init);
    for(const layerId in init.data!.links)
    {
        for(const { sourceActorId, targetActorId, weight } of init.data!.links[layerId])
        {
            network.addLink({ layerId, sourceActorId, targetActorId, weight });
        }
    }

    return network;
};