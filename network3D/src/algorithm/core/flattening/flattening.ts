import * as Core from "../../../core";

export abstract class Flattening
{
    public static undirected({ adjacencies, callback }: { adjacencies: Array<Core.ReadonlyAdjacency>, callback: ({ }: { sourceActorId: string, targetActorId: string }) => void }): void
    {
        for(const adjacency of adjacencies)
        {            
            for(const [nodeId, neighbours] of adjacency)
            {
                for(const neighbourId of neighbours)
                {
                    callback({ sourceActorId: nodeId, targetActorId: neighbourId });
                }
            }
        }
    }
};