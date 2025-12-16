import { expect, describe, it } from "vitest";

import { NetworkSchema } from "@/core/networkSchema/networkSchema";
import {
    AlreadyExistingPartitionError,
    AlreadyExistingLayerError,
    NonExistingPartitionError,
    NonExistingLayerError
} from "@/core/networkSchema/networkSchemaErrors";

import {
    testNetworkSchema,
    createFullTestNetworkSchema,
    invalidIds,
    createPartitionsTestNetworkSchema
} from "../testNetwork";
import { InvalidIdError } from "@/utilities/id/idErrors";

describe("NetworkSchema", () => {

    describe("addPartition", () => {

        it("ok", () => {
            const schema = new NetworkSchema();

            for(const partitionId of testNetworkSchema.schema!.partitions)
            {
                expect(() => schema.addPartition({ partitionId })).not.toThrow();
            }
        });

        it("error, when partition already exists", () => {
            const schema = createPartitionsTestNetworkSchema(testNetworkSchema);

            for(const partitionId of testNetworkSchema.schema!.partitions)
            {
                expect(() => schema.addPartition({ partitionId }))
                    .toThrow(AlreadyExistingPartitionError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const schema = new NetworkSchema();

            for(const invalidId of invalidIds)
            {
                expect(() => schema.addPartition({ partitionId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("isPartitionExists", () => {

        it("ok", () => {
            const schema = createPartitionsTestNetworkSchema(testNetworkSchema);

            for(const partitionId of testNetworkSchema.schema!.partitions)
            {
                expect(schema.isPartitionExists({ partitionId })).toBe(true);
            }
        });

        it("not found", () => {
            const schema = createPartitionsTestNetworkSchema(testNetworkSchema);

            for(const partitionId of testNetworkSchema.not!.schema!.partitions)
            {
                expect(schema.isPartitionExists({ partitionId })).toBe(false);
            }
        });
        
        it("error, when invalid IDs are passed", () => {
            const schema = new NetworkSchema();

            for(const invalidId of invalidIds)
            {
                expect(() => schema.isPartitionExists({ partitionId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("getPartitionsCount", () => {

        it("ok", () => {
            const schema = createPartitionsTestNetworkSchema(testNetworkSchema);

            expect(schema.getPartitionsCount()).toBe(testNetworkSchema.schema!.partitions.length);
        });

        it("ok - empty", () => {
            const schema = new NetworkSchema();

            expect(schema.getPartitionsCount()).toBe(0);
        });
    });

    describe("getPartitionsList", () => {

        it("ok", () => {
            const schema = createPartitionsTestNetworkSchema(testNetworkSchema);

            expect(schema.getPartitionsList()).toStrictEqual(testNetworkSchema.schema!.partitions);
        });

        it("ok - empty", () => {
            const schema = new NetworkSchema();

            expect(schema.getPartitionsList()).toStrictEqual([]);
        });
    });

    describe("addLayer", () => {

        it("ok", () => {
            const schema = createPartitionsTestNetworkSchema(testNetworkSchema);

            for(const layerId in testNetworkSchema.schema!.layers)
            {
                expect(() => schema.addLayer({ layerId, ...testNetworkSchema.schema!.layers[layerId] })).
                    not.toThrow();
            }
        });

        it("error, when layer (it's ID) already exists", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            for(const layerId in testNetworkSchema.schema!.layers)
            {
                expect(() => schema.addLayer({ layerId, ...testNetworkSchema.schema!.layers[layerId] }))
                    .toThrow(AlreadyExistingLayerError);
            }
        });

        it("error, when partition does not exist", () => {
            const schema = createPartitionsTestNetworkSchema(testNetworkSchema);

            const layerId = Object.keys(testNetworkSchema.schema!.layers)[0];
            const existingPartitionId = testNetworkSchema.schema!.partitions[0];
            for(const nonExistingPartitionId of testNetworkSchema.not!.schema!.partitions)
            {
                expect(() => schema.addLayer({ layerId, partitionsIds: nonExistingPartitionId }))
                    .toThrow(NonExistingPartitionError);
                expect(() => schema.addLayer({ layerId, partitionsIds: { source: nonExistingPartitionId, target: existingPartitionId } }))
                    .toThrow(NonExistingPartitionError);
                expect(() => schema.addLayer({ layerId, partitionsIds: { source: existingPartitionId, target: nonExistingPartitionId } }))
                    .toThrow(NonExistingPartitionError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const schema = createPartitionsTestNetworkSchema(testNetworkSchema);

            const layerId = Object.keys(testNetworkSchema.schema!.layers)[0];
            const existingPartitionId = testNetworkSchema.schema!.partitions[0];
            for(const invalidId of invalidIds)
            {                    
                expect(() => schema.addLayer({ layerId: invalidId, partitionsIds: existingPartitionId }))
                    .toThrow(InvalidIdError);
                expect(() => schema.addLayer({ layerId, partitionsIds: invalidId }))
                    .toThrow(InvalidIdError);
                expect(() => schema.addLayer({ layerId, partitionsIds: { source: invalidId, target: existingPartitionId } }))
                    .toThrow(InvalidIdError);
                expect(() => schema.addLayer({ layerId, partitionsIds: { source: existingPartitionId, target: invalidId } }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("isLayerExists", () => {

        it("ok", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            for(const layerId in testNetworkSchema.schema!.layers)
            {
                expect(schema.isLayerExists({ layerId })).toBe(true);
            }
        });

        it("not found", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            for(const layerId in testNetworkSchema.not!.schema!.layers)
            {
                expect(schema.isLayerExists({ layerId })).toBe(false);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            for(const invalidId of invalidIds)
            {
                expect(() => schema.isLayerExists({ layerId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("getLayersCount", () => {
        
        it("ok", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            expect(schema.getLayersCount()).toBe(Object.keys(testNetworkSchema.schema!.layers).length);
        });

        it("ok - empty", () => {
            const schema = new NetworkSchema();

            expect(schema.getLayersCount()).toBe(0);
        });
    });

    describe("getLayersList", () => {

        it("ok", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            expect(schema.getLayersList()).toStrictEqual(Object.keys(testNetworkSchema.schema!.layers));
        });

        it("ok - empty", () => {
            const schema = new NetworkSchema();
            
            expect(schema.getLayersList()).toStrictEqual([]);
        });
    });

    describe("getLayersOfPartition", () => {

        it("ok", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            for(const partitionId of testNetworkSchema.schema!.partitions)
            {
                const layersIds = schema.getLayersOfPartition({ partitionId });
                for(const layerId in testNetworkSchema.schema!.layers)
                {
                    const { partitionsIds } = testNetworkSchema.schema!.layers[layerId];
                    if(partitionsIds instanceof Array && (partitionsIds[0] == partitionId || partitionsIds[1] == partitionId) || partitionsIds == partitionId)
                    {
                        let test: boolean = false;
                        for(const _layerId of layersIds)
                        {
                            test ||= _layerId == layerId;
                        }
                        expect(test).toBe(true);
                    }
                }
            }
        });

        it("error, when partition does not exist", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            for(const partitionId of testNetworkSchema.not!.schema!.partitions)
            {
                expect(() => schema.getLayersOfPartition({ partitionId }))
                    .toThrow(NonExistingPartitionError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            for(const invalidId of invalidIds)
            {
                expect(() => schema.getLayersOfPartition({ partitionId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    
    describe("getLayerSchema", () => {

        it("ok", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            for(const layerId in testNetworkSchema.schema!.layers)
            {
                const { partitionsIds, directed, weighted } = testNetworkSchema.schema!.layers[layerId];
                const layerSchema = schema.getLayerSchema({ layerId });
                expect(layerSchema).toStrictEqual({
                    partitionIds: {
                        source: (typeof partitionsIds === "string") ? partitionsIds : partitionsIds.source,
                        target: (typeof partitionsIds === "string") ? partitionsIds : partitionsIds.target,
                    },
                    directed: directed ?? false,
                    weighted: weighted ?? false
                });
            }
        });

        it("error, when layer does not exist", () => {
            const schema = createPartitionsTestNetworkSchema(testNetworkSchema);

            for(const layerId in testNetworkSchema.not!.schema!.layers)
            {
                expect(() => schema.getLayerSchema({ layerId }))
                    .toThrow(NonExistingLayerError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const schema = createFullTestNetworkSchema(testNetworkSchema);

            for(const invalidId of invalidIds)
            {
                expect(() => schema.getLayerSchema({ layerId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("constructor", () => {

        it("ok", () => {
            let schema: NetworkSchema;
            expect(() => schema = new NetworkSchema(testNetworkSchema.schema)).not.toThrow();

            expect(schema!.getPartitionsCount()).toBe(testNetworkSchema.schema!.partitions.length);
            expect(schema!.getLayersCount()).toBe(Object.keys(testNetworkSchema.schema!.layers).length);
        });

        it("ok - partitions only", () => {
            let schema: NetworkSchema; 
            expect(() => schema = new NetworkSchema({
                partitions: testNetworkSchema.schema!.partitions
            })).not.toThrow();

            expect(schema!.getPartitionsCount()).toBe(testNetworkSchema.schema!.partitions.length);
            expect(schema!.getLayersCount()).toBe(0);
        });

        it("ok - empty JSON", () => {
            let schema: NetworkSchema; 
            expect(() => schema = new NetworkSchema({ })).not.toThrow();

            expect(schema!.getPartitionsCount()).toBe(0);
            expect(schema!.getLayersCount()).toBe(0);
        });

        it("error, when partition does not exist", () => {
            expect(() => new NetworkSchema({
                partitions: ["AT1"],
                layers: {
                    "L1:AT2->AT1": {
                        partitionsIds: "AT2"
                    }
                }
            })).toThrow(NonExistingPartitionError);

            expect(() => new NetworkSchema({
                partitions: ["AT1"],
                layers: {
                    "L1:AT2->AT1": {
                        partitionsIds: { source: "AT2", target: "AT1" }
                    }
                }
            })).toThrow(NonExistingPartitionError);

            expect(() => new NetworkSchema({
                partitions: ["AT1"],
                layers: {
                    "L1:AT2->AT1": {
                        partitionsIds: { source: "AT1", target: "AT2" }
                    }
                }
            })).toThrow(NonExistingPartitionError);
        });

        it("error, when partition already exists", () => {
            expect(() => new NetworkSchema({
                partitions: ["AT1", "AT1"]
            })).toThrow(AlreadyExistingPartitionError);
        });

        it("error, when invalid IDs are passed", () => {
            for(const invalidId of  invalidIds)
            {
                expect(() => new NetworkSchema({
                    partitions: [invalidId]
                })).toThrow(InvalidIdError);

                expect(() => new NetworkSchema({                
                    partitions: testNetworkSchema.schema!.partitions,
                    layers: {
                        [invalidId]: {
                            partitionsIds: testNetworkSchema.schema!.partitions[0]
                        }
                    }
                })).toThrow(InvalidIdError);

                expect(() => new NetworkSchema({
                    partitions: testNetworkSchema.schema!.partitions,
                    layers: {
                        "layer with invalid partitions IDs": {
                            partitionsIds: { source: invalidId, target: invalidId }
                        }
                    }
                })).toThrow(InvalidIdError);

                expect(() => new NetworkSchema({
                    partitions: testNetworkSchema.schema!.partitions,
                    layers: {
                        "layer with invalid first partition ID": {
                            partitionsIds: { source: "AT1", target: invalidId }
                        }
                    }
                })).toThrow(InvalidIdError);

                expect(() => new NetworkSchema({
                    partitions: testNetworkSchema.schema!.partitions,
                    layers: {
                        "layer with invalid second partition ID": {
                            partitionsIds: { source: invalidId, target: "AT1" }
                        }
                    }
                })).toThrow(InvalidIdError);
            }
        });
    });
});