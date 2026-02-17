import * as Core from "../../../core";
import {
    Algorithm
} from "../../../algorithm/utitlities";

import {
    G6Graph
} from "../graph";

export class Visualization extends G6Graph
{
    private static getUndirectedData(layer: Core.ReadonlyAdjacency): {
        nodes: Array<any>,
        edges: Array<any>
    }
    {
        const data = {
            nodes: new Array(),
            edges: new Array()
        };

        const visitedLinks: Map<string, Set<string>> = new Map(); 
        for(const [sourceId, neighbours] of layer)
        {
            data.nodes.push({ id: sourceId });

            visitedLinks.set(sourceId, new Set());
            for(const targetId of neighbours)
            {
                if(!visitedLinks.has(targetId) || !visitedLinks.get(targetId)!.has(sourceId))
                {
                    visitedLinks.get(sourceId)!.add(targetId);
                    data.edges.push({
                        source: sourceId,
                        target: targetId
                    });
                }
            }
        }

        return data;
    }

    constructor({ init = { }, layer }: { init: any, layer: Core.ReadonlyLayer })
    {
        const layerType = Algorithm.getLayerType({ layer });
        if(layerType == "Undirected")
        {
            init.data = Visualization.getUndirectedData(layer as Core.ReadonlyAdjacency);
        }
        else
        {
            throw new Error(`${layerType} is not supported`);
        }
        
        super({ init });
    }
};