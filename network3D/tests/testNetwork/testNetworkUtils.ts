import type { ActorId, MultilayerNetwork } from "@/core";

export type TestNetworkInit<T, U> = {
    schema: T,
    data: U,
    not?: {
        schema: T,
        data: U
    }
};

export const createActors = (n: number, callback: (i: number) => ActorId): Array<ActorId> => Array.from({ length: n }, (_, i) => callback(i));
export const createLinks = (sourceActors: Array<ActorId>,
                            targetActors: Array<ActorId>,
                            condition: (source: string, target: string) => { add: boolean, weight?: number }):
Array<Omit<Parameters<typeof MultilayerNetwork.prototype["addLink"]>[0], "layerId">> => {
    const links: Array<Omit<Parameters<typeof MultilayerNetwork.prototype["addLink"]>[0], "layerId">> = [];
    for(const sourceActorId of sourceActors)
    {
        for(const targetActorId of targetActors)
        {
            const { add, weight } = condition(sourceActorId, targetActorId);
            if(add)
            {
                links.push({ sourceActorId, targetActorId, weight });
            }
        }
    }

    return links;
};