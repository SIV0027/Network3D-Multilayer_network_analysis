import { G6Graph } from "../../core";
import * as Core from "../../../core";

class SingleLayerNetworkInstance
{
    private G6Graph: G6Graph;
            
    constructor({ data, container }: { data: any, container: string | HTMLElement })
    {
        this.G6Graph = new G6Graph({
            init: {
                container,
                autoFit: "view",
                data,
                node: {
                    style: {
                        size: 10,
                    },
                    palette: {
                        field: "group",
                        color: "tableau",
                    },
                },
                layout: {
                    type: "d3-force",
                    manyBody: { },
                    x: { },
                    y: { },
                },
                behaviors: ["drag-canvas", "zoom-canvas", "drag-element"],
            }
        });
    }

    public render(): void
    {
        this.G6Graph.render();
    }
};

export class SingleLayerNetwork extends Core.SingleLayerNetwork
{
    public static create({ network, container }: { network: SingleLayerNetwork, container: string | HTMLElement }): SingleLayerNetworkInstance
    {
        const data: any = {
            nodes: [],
            edges: []
        };
        network.iterate({
            callback: ({ actors, links }) => {
                for(const actorId of actors)
                {
                    data.nodes.push({ id: actorId });
                }

                const visitedLinks: Map<string, Set<string>> = new Map(); 
                for(const [sourceId, neighbours] of links as Core.ReadonlyAdjacency)
                {
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
            }
        });

        return new SingleLayerNetworkInstance({
            container,
            data
        });
    }
};