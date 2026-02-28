import * as Core from "../../../core";

export abstract class RandomWalk
{
    public static undirected({ adjacencies, stepsCount, actorsIds }: { adjacencies: Map<Core.LayerId, Core.ReadonlyAdjacency>, actorsIds: Array<Core.ActorId>, stepsCount?: number }): Array<{ actorId: Core.ActorId, layerId: Core.LayerId }>
    {
        const path: Array<{ actorId: Core.ActorId, layerId: Core.LayerId }> = new Array();

        const layersIds = Array.from(adjacencies.keys());

        let currentLayerId = layersIds[Math.floor(Math.random() * layersIds.length)];
        let currentActorId = actorsIds[Math.floor(Math.random() * actorsIds.length)];

        for(let _ = 0; _ < (stepsCount ?? (10 * layersIds.length * actorsIds.length)); _++)
        {
            path.push({ actorId: currentActorId, layerId: currentLayerId });

            console.log(adjacencies.get(currentLayerId), currentActorId, adjacencies.get(currentLayerId)!.get(currentActorId));
            const neighbours = Array.from(adjacencies.get(currentLayerId)!.get(currentActorId)!);
            const otherLayersIds = layersIds.filter((layerId) => (layerId != currentLayerId));

            if(neighbours.length + otherLayersIds.length == 0)
            {
                break;
            }

            const probability = Math.random();
            const probabilitySpaceCard = neighbours.length + otherLayersIds.length;
            if(probability < (otherLayersIds.length / probabilitySpaceCard))
            {
                currentLayerId = otherLayersIds[Math.floor(Math.random() * otherLayersIds.length)];
            }
            else
            {
                currentActorId = neighbours[Math.floor(Math.random() * neighbours.length)];
            }
        }

        return path;
    }
};