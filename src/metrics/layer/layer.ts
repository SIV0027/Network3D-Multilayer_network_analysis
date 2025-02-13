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
    public degreeCentrality
    (): Map<string, number>
    {
        const res: Map<string, number> = new Map();

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
                res.set(nodeId, linksOfNodeInLayer.size);
            }
        };

        this.iterate({
            callback
        });

        return res;
    }

    public distributionDegreeCentrality
    (): void
    {

    }

    // Undirected
    public averageDegreeCentrality
    (): number
    {
        const nodesCount = this.nodesCount();
        const linksCount = this.linksCount();
        const res = (2 * linksCount) / nodesCount;

        return res;
    }

    // Undirected
    public clusteringCoefficientCentrality
    (): Map<string, number>
    {
        const res: Map<string, number> = new Map();

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

               res.set(nodeId, clusteringCoefficient);
           }
        };

        this.iterate({
            callback
        });

        return res;
    }

    public averageClusteringCoefficientCentrality
    (): void
    {

    }

    public closenessCentrality
    (): void
    {
        
    }

    public distributionclosenessCentrality
    (): void
    {
        
    }

    public betweennessCentrality
    (): void
    {
        
    }

    public distributionbetweennessCentrality
    (): void
    {

    }

    public communities
    (): void
    {

    }
};