import { NetworkSchema } from "@/core/networkSchema/networkSchema";
import type { TestNetworkInit } from "./testNetworkUtils";

export type TestNetworkSchemaInit = TestNetworkInit<Required<NonNullable<ConstructorParameters<typeof NetworkSchema>[0]>>, undefined>;

export const createPartitionsTestNetworkSchema: (init: TestNetworkSchemaInit) => NetworkSchema = (init) => {
    const network = new NetworkSchema();
    for(const partitionId of init.schema!.partitions)
    {
        network.addPartition({ partitionId });
    }

    return network;
};

export const createFullTestNetworkSchema: (init: TestNetworkSchemaInit) => NetworkSchema = (init) => {
    const network = createPartitionsTestNetworkSchema(init);
    for(const layerId in init.schema!.layers)
    {
        network.addLayer({ layerId, ...init.schema!.layers[layerId] });
    }

    return network;
};

export const testNetworkSchema: TestNetworkSchemaInit = {
    schema: {
        partitions: ["AT1", "AT2"],
        layers: {
            "L1:AT1->AT1": {
                partitionsIds: "AT1",
                directed: true,
                weighted: true
            },
            "L2:AT1->AT1": {
                partitionsIds: "AT1"                
            },
            "L3:AT1->AT2": {
                partitionsIds: { source: "AT1", target: "AT2" },
                directed: false,
                weighted: false
            },
            "L4:AT1->AT2": {
                partitionsIds: { source: "AT1", target: "AT2" },
                weighted: true
            },
            "L5:AT2->AT2": {
                partitionsIds: "AT2",
                weighted: true
            },
            "L6:AT2->AT1": {
                partitionsIds: { source: "AT2", target: "AT1" },
                weighted: false
            }
        }
    },
    data: undefined,
    not: {
        schema: {
            partitions: ["AT3", "AT4"],
            layers: {
                "L7:AT3->AT4": {
                    partitionsIds: { source: "AT3", target: "AT4" }
                }
            }
        },
        data: undefined
    }
};