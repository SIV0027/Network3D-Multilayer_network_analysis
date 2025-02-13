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
                const a: Extract<keyof Node_Links<U[keyof U]["source"], T, U>, string> = this.layerId as Extract<keyof Node_Links<U[keyof U]["source"], T, U>, string>;
                const linksOfNodeInLayer = node.getLinks()[a] as Map<string, Link<typeof this.layerId, T, U>>;
                res.set(nodeId, linksOfNodeInLayer.size);
            }
        };

        this.iterate({
            callback
        });

        return res;
    }

    public distributionDegreeCentrality
    ()
    {

    }

    public closenessCentrality
    ()
    {
        
    }

    public distributionclosenessCentrality
    ()
    {
        
    }

    public betweennessCentrality
    ()
    {
        
    }

    public distributionbetweennessCentrality
    ()
    {

    }

    public communities
    ()
    {

    }
};