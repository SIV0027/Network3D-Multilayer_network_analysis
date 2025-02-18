import { 
    ARGS_Callback
} from "../../args_items.js";

import {
    Link,
    Node_Links,
    TT,
    TU
} from "../../core/index.js";

import {
    Iterate,
    IterateCallback
} from "../../interface/index.js";

export class Layer<T extends TT, U extends TU<T>>
{
    private layerId: keyof U;
    private iterate: Iterate<ARGS_Callback<IterateCallback<T, U>>, T, U>;

    constructor(args: {
        layerId: keyof U,
        iterate: Iterate<ARGS_Callback<IterateCallback<T, U>>, T, U>
    })
    {
        const {
            layerId,
            iterate
        } = args;
        
        this.layerId = layerId;
        this.iterate = iterate;
    }

    public nodesCount
    (): number
    {
        let res = 0;

        const callback: IterateCallback<T, U> = (args) => {

            const {
                hin,
                nodeLayers
            } = args;

            const sourceNodeLayer = hin.getSourceTarget({
                layerId: this.layerId
            }).source;

            res = nodeLayers[sourceNodeLayer].size;
        };

        this.iterate({
            callback
        });

        return res;
    }

    // Undirected
    public linksCount
    (): number
    {
        let res = 0;

        const callback: IterateCallback<T, U> = (args) => {

            const {
                hin,
                nodeLayers
            } = args;

            const sourceNodeLayer = hin.getSourceTarget({
                layerId: this.layerId
            }).source;

            const nodes = nodeLayers[sourceNodeLayer];
            for(const [_, node] of nodes)
            {
                const layer: Extract<keyof Node_Links<U[keyof U]["source"], T, U>, string> = this.layerId as Extract<keyof Node_Links<U[keyof U]["source"], T, U>, string>;
                const linksOfNodeInLayer = node.getLinks()[layer] as Map<string, Link<typeof this.layerId, T, U>>;
                res += linksOfNodeInLayer.size;
            }
        };

        this.iterate({
            callback
        });

        res /= 2;

        return res;
    }

    // Undirected
    public degree
    (): { 
        nodes: Map<string, number>,
        distribution: Array<number>,
        average: number
    }
    {
        const res: { 
            nodes: Map<string, number>,
            distribution: Array<number>,
            average: number
        } = {
            nodes: new Map(),
            distribution: new Array(),
            average: 0
        };

        const callback: IterateCallback<T, U> = (args) => {

            const {
                 hin,
                 nodeLayers
            } = args;

            // undirected singlelinks single layer => bipartite type is not assumed
            const sourceNodeLayer = hin.getSourceTarget({
                layerId: this.layerId
            }).source;

            for(const [nodeId, node] of nodeLayers[sourceNodeLayer])
            {
                const layer: Extract<keyof Node_Links<U[keyof U]["source"], T, U>, string> = this.layerId as Extract<keyof Node_Links<U[keyof U]["source"], T, U>, string>;
                const linksOfNodeInLayer = node.getLinks()[layer] as Map<string, Link<typeof this.layerId, T, U>>;
                const degree = linksOfNodeInLayer.size;
                res.nodes.set(nodeId, degree);
                if(res.distribution[degree] == undefined)
                {
                    for(let i = 0; i <= degree; i++)
                    {
                        if(res.distribution[i] == undefined)
                        {
                            res.distribution[i] = 0;
                        }
                    }
                }
                res.distribution[degree]++;
                res.average += degree;
            }
        };

        this.iterate({
            callback
        });

        res.average /= this.nodesCount();

        return res;
    }

    /* // Undirected - Možná ponechat? (z výkonových důvodů)
    public averageDegreeCentrality
    (): number
    {
        const nodesCount = this.nodesCount();
        const linksCount = this.linksCount();
        const res = (2 * linksCount) / nodesCount;

        return res;
    } */

    // Undirected
    public clusteringCoefficient
    (): { 
        nodes: Map<string, number>,
        distribution: { [cc: number]: number },
        average: number
    }
    {
        const res: { 
            nodes: Map<string, number>,
            distribution: { [cc: number]: number },
            average: number
        } = {
            nodes: new Map(),
            distribution: { },
            average: 0
        };

        const callback: IterateCallback<T, U> = (args) => {

            const {
                hin,
                nodeLayers,
                getNode
           } = args;

           // undirected singlelinks single layer => bipartite type is not assumed
           const sourceNodeLayer = hin.getSourceTarget({
               layerId: this.layerId
           }).source;

           for(const [nodeId, node] of nodeLayers[sourceNodeLayer])
           {
               const layer: Extract<keyof Node_Links<U[keyof U]["source"], T, U>, string> = this.layerId as Extract<keyof Node_Links<U[keyof U]["source"], T, U>, string>;
               const linksOfNodeInLayer = node.getLinks()[layer] as Map<string, Link<typeof this.layerId, T, U>>;
               
               let neighboursLinksCount = 0;
               const maxNeighboursLinksCount = linksOfNodeInLayer.size * (linksOfNodeInLayer.size - 1);

               if(linksOfNodeInLayer.size > 1)
               {
                    const neighbours = Array.from(linksOfNodeInLayer.keys());
                    for(let i = 0; i < neighbours.length; i++)
                    {
                        for(let ii = i + 1; ii < neighbours.length; ii++)
                        {
                            const neighbourX = getNode({
                                layerId: sourceNodeLayer,
                                nodeId: neighbours[i]
                            });
                            const neighbourY = getNode({
                                layerId: sourceNodeLayer,
                                nodeId: neighbours[ii]
                            });

                            try
                            {
                                neighbourX.getLink({
                                    layerId: layer,
                                    targetNeighbourId: neighbourY.getId()
                                });
                                neighboursLinksCount++;
                            }
                            catch(_)
                            { }
                        }
                    }
               }

               const clusteringCoefficient = (2 * neighboursLinksCount) / Math.max(maxNeighboursLinksCount, 1);

               res.nodes.set(nodeId, clusteringCoefficient);

               if(res.distribution[clusteringCoefficient] == undefined)
               {
                    res.distribution[clusteringCoefficient] = 0;
               }
               res.distribution[clusteringCoefficient]++;
               res.average += clusteringCoefficient;
           }
        };

        this.iterate({
            callback
        });

        res.average /= this.nodesCount();

        return res;
    }

    public closeness
    (): void
    {
        
    }

    public betweenness
    (): void
    {
        
    }

    public communities
    (): void
    {

    }
};