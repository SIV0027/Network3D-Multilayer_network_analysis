import type {
    LayerId,
    LayerId_args,
    PartitionId,
    PartitionId_args
} from "../../core/networkSchema/networkSchema_types";

import type {
    ActorId,
    ActorId_args,
    Adjacency,
    MultilayerConstructor,
    MultilayerIterateCallback,
    Layer,
    SourceTargetId_args,
    Weight_args,
    Directed,
    Bipartite,
    AdjacencyType_args
} from "./multilayerNetwork_types";

import { ID } from "../../utilities/id/id";
import { NetworkSchema } from "../networkSchema/networkSchema";
import {
    AlreadyExistingActorError,
    AlreadyExistingLinkError,
    NonExistingActorError,
    NonExistingLinkError
} from "./mutlilayerNetworkErrors";
import type { Optional } from "../../utilities";

export class MultilayerNetwork extends NetworkSchema
{
    // partition (actor type) ID → actor ID
    private actors: Map<PartitionId, Set<string>> = new Map();
    // layer ID → source actor ID | ((in | out) → source actor ID) → target actor IDs
    private links: Map<LayerId, Layer> = new Map();
    // layer ID → source actor ID → source actor ID) → link weight
    private weights: Map<LayerId, Map<ActorId, Map<ActorId, number>>> = new Map();

    constructor({ schema, data }: MultilayerConstructor = { })
    {
        super();

        super.init(schema);
        for(const partitionId in data?.actors)
        {
            for(const actorId of data?.actors[partitionId])
            {
                this.addActor({ partitionId, actorId });
            }
        }

        for(const layerId in data?.links)
        {
            for(const { sourceActorId, targetActorId, weight } of data?.links[layerId])
            {
                this.addLink({ layerId, sourceActorId, targetActorId, weight });
            }
        }
    }

    public override addPartition({ partitionId }: Parameters<NetworkSchema["addPartition"]>[0]): void
    {
        super.addPartition({ partitionId });
        this.actors.set(partitionId, new Set());
    }

    public override addLayer({ layerId, partitionsIds, directed, weighted }: Parameters<NetworkSchema["addLayer"]>[0]): void
    {
        super.addLayer({ layerId, partitionsIds, directed, weighted });

        const createAdjacency = (actorTypeId: string): Adjacency => {
            const adjacency = new Map();
            for(const actorId of this.actors.get(actorTypeId)!)
            {
                adjacency.set(actorId, new Set());
            }

            return adjacency;
        };

        let layer: Layer;
        // detect type of layer (unipartite/bipartite directed/undirected) & initialize it
        // unipartite & undirected
        if(typeof partitionsIds === "string"  && !directed)
        {
            layer = createAdjacency(partitionsIds);
        }
        // unipartite & directed
        else if(typeof partitionsIds === "string")
        {
            layer = {
                out: createAdjacency(partitionsIds),
                in: createAdjacency(partitionsIds)
            };
        }
        // bipartite
        else
        {
            layer = {
                source: createAdjacency(partitionsIds.source),
                target: createAdjacency(partitionsIds.target)
            };
        }

        // detect if layer is weighted → add layer to weights
        if(weighted)
        {
            const weights = new Map();
            // add all (source) actors to weight layer
            for(const actorId of this.actors.get((typeof partitionsIds === "string" ? partitionsIds : partitionsIds.source ))!)
            {
                weights.set(actorId, new Map());
            }

            this.weights.set(layerId, weights);
        }

        // add new layer
        this.links.set(layerId, layer);
    }

    public getActorsCount({ partitionId }: PartitionId_args): number
    {
        this.validatePartitionIfExists({ partitionId });
        return this.actors.get(partitionId)!.size;
    }

    
    public getLinksCount({ layerId }: LayerId_args): number
    {        
        // all links are stored twice (with both nodes that are incident with it → source and target (two Maps)), but all links of undirected unipartite layer are stored (twice) in one Map
        let linksCount = 0;
        let selfLoopsCount = 0;
        for(const [nodeId, neighbours] of this.getAdjacency({ layerId, adjacencyType: "source" }))
        {
            linksCount += neighbours.size;
            if(neighbours.has(nodeId))
            {
                selfLoopsCount++;
            }
        }

        const { directed, partitionIds } = this.getLayerSchema({ layerId });
        if(!directed && partitionIds.source == partitionIds.target)
        {
            linksCount -= selfLoopsCount;
            linksCount /= 2;
            linksCount += selfLoopsCount;
        }

        return linksCount;
    }

    public isActorExists({ partitionId, actorId }: PartitionId_args & ActorId_args): boolean
    {
        this.validatePartitionIfExists({ partitionId });
        ID.validateID({ id: actorId });

        return this.actors.get(partitionId)!.has(actorId);
    }

    public isLinkExists({ layerId, sourceActorId, targetActorId } : LayerId_args & SourceTargetId_args): boolean
    {
        const { partitionIds } = this.getLayerSchema({ layerId });
        // source actor, which does not exists in network within specific actor type → throw error
        this.validateActorIfExists({ actorId: sourceActorId, partitionId: partitionIds.source });
        // target actor, which does not exists in network within specific actor type → throw error
        this.validateActorIfExists({ actorId: targetActorId, partitionId: partitionIds.target });

        return this.getAdjacency({ layerId, adjacencyType: "source" })!.get(sourceActorId)!.has(targetActorId);
    }

    protected validateActorIfExists({ actorId, partitionId }: PartitionId_args & ActorId_args): void
    {
        if(!this.isActorExists({ actorId, partitionId }))
        {
            throw new NonExistingActorError({ actorId, partitionId });
        }
    }

    protected validateActorIfNotExists({ actorId, partitionId }: PartitionId_args & ActorId_args): void
    {
        if(this.isActorExists({ actorId, partitionId }))
        {
            throw new AlreadyExistingActorError({ actorId, partitionId });
        }
    }

    protected validateLinkIfExists({ layerId, sourceActorId, targetActorId }: LayerId_args & SourceTargetId_args): void
    {
        if(!this.isLinkExists({ layerId, sourceActorId, targetActorId }))
        {
            throw new NonExistingLinkError({ layerId, sourceActorId, targetActorId });
        }
    }

    protected validateLinkIfNotExists({ layerId, sourceActorId, targetActorId }: LayerId_args & SourceTargetId_args): void
    {
        if(this.isLinkExists({ layerId, sourceActorId, targetActorId }))
        {
            throw new AlreadyExistingLinkError({ layerId, sourceActorId, targetActorId });
        }
    }

    // help method, that return specific adjacency matrix of layer by given layer ID
    protected getAdjacency({ layerId, adjacencyType }: LayerId_args & Optional<AdjacencyType_args, "adjacencyType">): Adjacency
    {
        const { partitionIds, directed } = this.getLayerSchema({ layerId });

        let adjacency: Adjacency;
        // if layer is directed (unipartite) - "out"/"source" option → "out" Adjacency else "in" Adjacency
        if(partitionIds.source == partitionIds.target && directed)
        {
            adjacency = (this.links.get(layerId)! as Directed)[((adjacencyType === "in" || adjacencyType === "target") ? "in" : "out")];
        }
        // if layer is undirected (unipartite) → doesn't matter 
        else if(partitionIds.source == partitionIds.target)
        {
            adjacency = this.links.get(layerId)! as Adjacency;
        }
        // if layer is bipartite - "out"/"source" option → "source" Adjacency else "target" Adjacency
        else
        {
            adjacency = (this.links.get(layerId)! as Bipartite)[((adjacencyType === "in" || adjacencyType === "target") ? "target" : "source")];
        }

        return adjacency;
    }

    public addActor({ partitionId, actorId }: PartitionId_args & ActorId_args): void
    {
        // duplicate actor ID → throw error
        this.validateActorIfNotExists({ actorId, partitionId });
        
        // add actor to all layers (where is belong to by "actorTypeId") → create node
        for(const layerId of super.getLayersOfPartition({ partitionId }))
        {
            this.getAdjacency({ layerId, adjacencyType: "source" }).set(actorId, new Set());
            this.getAdjacency({ layerId, adjacencyType: "target" }).set(actorId, new Set());

            const { weighted } = this.getLayerSchema({ layerId });
            if(weighted)
            {
                this.weights.get(layerId)!.set(actorId, new Map());
            }
        }

        // add new actor
        this.actors.get(partitionId)!.add(actorId);
    }

    public getLinkWeight({ layerId, sourceActorId, targetActorId }: LayerId_args & SourceTargetId_args): number
    {
        // non weighted layer → throw error
        this.validateLayerIfWeighted({ layerId });
        // non existing link → throw error
        this.validateLinkIfExists({ layerId, sourceActorId, targetActorId });

        // for undirected & unipartite layers → source = target
        return this.weights.get(layerId)!.get(sourceActorId)!.get(targetActorId)! ?? this.weights.get(layerId)!.get(targetActorId)!.get(sourceActorId)!;
    }

    public addLink({ layerId, sourceActorId, targetActorId, weight }: LayerId_args & SourceTargetId_args & Optional<Weight_args, "weight">): void
    {
        // duplicate link between given source and target actors IDs → throw error
        this.validateLinkIfNotExists({ layerId, sourceActorId, targetActorId });
        // check if (un)given weight is corspond to network schema
        if(weight === undefined)
        {
            this.validateLayerIfNotWeighted({ layerId });
        }
        else
        {
            this.validateLayerIfWeighted({ layerId });
        }

        // add new link (source node and target node)
        this.getAdjacency({ layerId, adjacencyType: "source" }).get(sourceActorId)!.add(targetActorId);
        this.getAdjacency({ layerId, adjacencyType: "target" }).get(targetActorId)!.add(sourceActorId);

        const { weighted } = this.getLayerSchema({ layerId });
        if(weighted)
        {
            this.weights.get(layerId)!.get(sourceActorId)!.set(targetActorId, weight!);
        }
    }

    // method, that allows iterate over the network
    protected iterate({ callback }: MultilayerIterateCallback): void
    {
        callback({
            actors: this.actors,
            links: this.links,
            getAdjacency: this.getAdjacency.bind(this),
            weights: this.weights,
            validators: {
                schema: {
                    validatePartitionIfExists: this.validatePartitionIfExists.bind(this),
                    validatePartitionIfNotExists: this.validatePartitionIfNotExists.bind(this),
                    validateLayerIfExists: this.validateLayerIfExists.bind(this),
                    validateLayerIfNotExists: this.validateLayerIfNotExists.bind(this),
                    validateLayerIfWeighted: this.validateLayerIfWeighted.bind(this),
                    validateLayerIfNotWeighted: this.validateLayerIfNotWeighted.bind(this)
                },
                data: {
                    validateActorIfExists: this.validateActorIfExists.bind(this),
                    validateActorIfNotExists: this.validateActorIfNotExists.bind(this),
                    validateLinkIfExists: this.validateLinkIfExists.bind(this),
                    validateLinkIfNotExists: this.validateLinkIfNotExists.bind(this)
                }
            }
        });
    }
};