import * as Network3D from "../../src";

export class Visualization extends Network3D.Visualization.G6Graph
{
    protected static getUndirectedData({ sourceNodes, targetNodes, links } : { sourceNodes: ReadonlySet<Network3D.Core.ActorId>, targetNodes: ReadonlySet<Network3D.Core.ActorId>, links: Network3D.Core.ReadonlyAdjacency }): {
        nodes: Array<any>,
        edges: Array<any>
    }
    {
        const data = {
            nodes: new Array(),
            edges: new Array()
        };

        for(const actorId of sourceNodes)
        {
            data.nodes.push({ id: `source${actorId}`, "label": actorId, group: "source" });
        }
        
        for(const actorId of targetNodes)
        {
            data.nodes.push({ id: `target${actorId}`, "label": actorId, group: "target" });
        }

        const visitedLinks: Map<string, Set<string>> = new Map();
        for(const [sourceId, neighbours] of links)
        {
            visitedLinks.set(sourceId, new Set());
            for(const targetId of neighbours)
            {
                if(!visitedLinks.has(targetId) || !visitedLinks.get(targetId)!.has(sourceId))
                {
                    visitedLinks.get(sourceId)!.add(targetId);
                    data.edges.push({
                        source: `source${sourceId}`,
                        target: `target${targetId}`
                    });
                }
            }
        }

        return data;
    }

    constructor({ init = { }, sourceNodes, targetNodes, links }: { init: any, sourceNodes: ReadonlySet<Network3D.Core.ActorId>, targetNodes: ReadonlySet<Network3D.Core.ActorId>, links: Network3D.Core.ReadonlyAdjacency })
    {
        init.data = Visualization.getUndirectedData({
            sourceNodes,
            targetNodes,
            links
        });
        super({ init });
    }
};