import {
    ARGS_Callback,
    ARGS_NodeId
} from "../../args_items.js";

import {
    Network
} from "../network/network.js";

import {
    GetLinksCount,
    GetNodesCount,
    Degree,
    DegreeSequence,
    AverageDegree,
    DegreeDistribution,
    ClusteringCoefficient
} from "../network/network_types.js";

import {
    IterateCallback,
    Link_Types,
    Multi,
    Node_Types,
    Orientation,
    Orientation_Dir,
    Orientation_Undir_Dir,
    Iterate
} from "../../interface/index.js";



// Metrics for single layer network
// It receives (generics) type of node, type of link, type of orerientation (Directed or Undirected) and Multi type (Singlelinks or Multilinks)
export class SingleLayerNetwork<T, U, V extends keyof Orientation, W extends keyof Multi>
extends Network<Node_Types<T>, Link_Types<U, V, W>>
implements GetNodesCount, GetLinksCount, Degree, DegreeSequence, AverageDegree, DegreeDistribution/* , ClusteringCoefficient */
{
    // SingleLayerNetwork is initialized by its network
    constructor(args: {
        iterate: Iterate<ARGS_Callback<IterateCallback<Node_Types<T>, Link_Types<U, V, W>>>, Node_Types<T>, Link_Types<U, V, W>>
    })
    {
        const {
            iterate
        } = args;

        super({
            iterate: iterate
        });
    }

    // Nodes count
    getNodesCount
    (): number
    {
        // Return variable
        let nodesCount: number = 0;

        // Callback for network
        const callback: IterateCallback<Node_Types<T>, Link_Types<U, V, W>> = (args) =>
        {
            const {
                nodeLayers
            } = args;
            
            // Set return variable to value of size of given layer
            nodesCount = nodeLayers["default"].size;
        };
            
        // Let callback iterate through network
        this.iterate({
            callback: callback
        });

        return nodesCount;
    }

    // Links count
    getLinksCount
    (): number
    {        
        // Return variable
        let linkCount = 0;

        const callback: IterateCallback<Node_Types<T>, Link_Types<U, V, W>> = (args) =>
        {
            const {
                hin,
                linkLayers
            } = args;

            // Through the nodes of link layers
            for(const [_, node] of linkLayers["default"][0])
            {
                // Get link layer from data structure of current node
                const nodeLinkLayer = node.getLinks()["default"];
                // Add number of degree of current node to sum
                linkCount += (nodeLinkLayer instanceof Map) ? nodeLinkLayer.size : nodeLinkLayer.out.size;
            }

            // Get information about link layer
            const layerOrientationMulti = hin.getOrientationMulti({
                layerId: "default"
            });

            // If given link layer is interlayer (source type == target layer), everey link is count twice => linkCount /= 2
            if(layerOrientationMulti.orientation == "Undirected")
            {
                linkCount /= 2;
            }
        }

        this.iterate({
            callback: callback
        });
    
        return linkCount;
    }

    // Degree of given node
    degree<ARGS extends ARGS_NodeId<string>>
    (args: ARGS): Orientation_Undir_Dir<V, number>
    {
        const {
            nodeId
        } = args;

        // Return variable
        let degree: Orientation_Undir_Dir<V, number> = 0 as Orientation_Undir_Dir<V, number>;

        // Callback for iterate the network
        const callback: IterateCallback<Node_Types<T>, Link_Types<U, V, W>> = (args) =>
        {
            const {
                getNode
            } = args;

            // Get node by given node ID
            const node = getNode({
                layerId: "default",
                nodeId: nodeId
            });

            // Get all link of node
            const links = node.getLinks()["default"];
            // Is unoriented?
            if(links instanceof Map)
            {
                degree = links.size as Orientation_Undir_Dir<V, number>;
            }
            else
            {
                degree = {
                    in: links.in.size,
                    out: links.out.size
                } as Orientation_Undir_Dir<V, number>;
            }
        };

        // Iterate the network
        this.iterate({
            callback: callback
        });

        return degree;
    }

    // Degree sequence
    public degreeSequence
    (): Orientation_Undir_Dir<V, Array<number>>
    {
        // Return variable, which initialize by default value -> it is overwritten in the iterate callback
        let degreeSequence: Orientation_Undir_Dir<V, Array<number>> = new Array<number>() as Orientation_Undir_Dir<V, Array<number>>;

        // Callback to iterate the network
        const callback: IterateCallback<Node_Types<T>, Link_Types<U, V, W>> = (args) =>
        {
            const {
                nodeLayers,
                hin
            } = args;

            // Bool value which determines if network is undirected
            const isNetworkUndirected = hin.getOrientationMulti({
                layerId: "default"
            }).orientation == "Undirected";

            degreeSequence = ((isNetworkUndirected) ? new Array<number>() : { in: new Array<number>(), out: new Array<number>() }) as Orientation_Undir_Dir<V, Array<number>>;

            // Through the all nodes of network (it has just one layer)
            for(const [_, node] of nodeLayers["default"])
            {
                // Get all links of current node
                const links = node.getLinks()["default"];
                // Is network udnirected?
                if(links instanceof Map)
                {
                    (degreeSequence as Array<number>).push(links.size);
                }
                else
                {
                    (degreeSequence as Orientation_Dir<Array<number>>).in.push(links.in.size);
                    (degreeSequence as Orientation_Dir<Array<number>>).out.push(links.out.size);
                }
            }

            // Sort the sequence(s)
            if(isNetworkUndirected)
            {
                // Default sorting in javascript is lexicographic (even on numbers)
                (degreeSequence as Array<number>).sort((a, b) => a - b);
            }
            else
            {
                (degreeSequence as Orientation_Dir<Array<number>>).in.sort((a, b) => a - b);
                (degreeSequence as Orientation_Dir<Array<number>>).out.sort((a, b) => a - b);
            }
        };

        // Iterate the network
        this.iterate({
            callback: callback
        });

        return degreeSequence;
    }

    // Average degree
    public averageDegree
    (): number
    {
        // Bool value which determines if network is undirected, it is intialized to true and overwritten in the iterate callback
        let isNetworkUndirected: boolean = true;

        // Implementation of the iterate callback
        const callback: IterateCallback<Node_Types<T>, Link_Types<U, V, W>> = (args) =>
        {
            const {
                hin
            } = args;

            isNetworkUndirected = hin.getOrientationMulti({
                layerId: "default"
            }).orientation == "Undirected";
        };

        // Iterate through the network
        this.iterate({
            callback: callback
        });

        // Get count of nodes
        const N: number = this.getNodesCount();
        // Get count of links (if network is undirected, then 2 * number of links)
        const M: number = (isNetworkUndirected ? 2 : 1) * this.getLinksCount();

        return (M / N);
    }

    // Degree distribution
    public degreeDistribution
    (): Orientation_Undir_Dir<V, Array<number>>
    {
        // Bool value which determines if network is undirected, which is initalized to true and its overwritten in iterate callback
        let isNetworkUndirected: boolean = true;

        // Implementation of the iterate callback
        const callback: IterateCallback<Node_Types<T>, Link_Types<U, V, W>> = (args) =>
        {
            const {
                hin
            } = args;

            isNetworkUndirected = hin.getOrientationMulti({
                layerId: "default"
            }).orientation == "Undirected";
        };

        // Iterate through the network
        this.iterate({
            callback: callback
        });

        // Get degree sequence (by degree sequence is degree distribution calculated)
        const degreeSequence = this.degreeSequence();
        // Transform degree sequence to array ({ in, out } => Array) -> unified computation (undirected/directed)
        let degreeSequenceIterate: Array<Array<number>> = [];
        if(isNetworkUndirected)
        {
            degreeSequenceIterate.push(degreeSequence as Array<number>);
        }
        else
        {
            degreeSequenceIterate.push((degreeSequence as Orientation_Dir<Array<number>>).in);
            degreeSequenceIterate.push((degreeSequence as Orientation_Dir<Array<number>>).out);
        }

        // Return variable
        let degreeDistribution: Orientation_Undir_Dir<V, Array<number>> = ((isNetworkUndirected) ? new Array<number>(): { in: new Array<number>(), out: new Array<number>() }) as Orientation_Undir_Dir<V, Array<number>>;
        // Through the degree seuquences (for undirected network just one degree sequence => "degreeSequenceIterate" have just one item)
        for(const [index, degreeSequenceIterateItem] of degreeSequenceIterate.entries())
        {
            // Result degree distribution for current degree sequence
            const degreeSequenceResult: Array<number> = new Array<number>();
            // Degree distribution have to be 'continuous' (in context of non-negative natural numbers)
            let degreeContinuous: number = 0;
            // Through the single degree sequence
            for(const degree of degreeSequenceIterateItem)
            {
                // If there is no node with some degree => value of this degree in degree distribution have to be equal to "0" 
                while(degreeContinuous <= degree)
                {
                    degreeSequenceResult[degreeContinuous++] = 0;
                }
                // Increment value of current degre in degree distribution
                degreeSequenceResult[degree]++;
            }

            // If network is undirected => result have just one degree distribution; oteherwise => 2 (in/out) distributions
            if(isNetworkUndirected)
            {
                degreeDistribution = degreeSequenceResult as Orientation_Undir_Dir<V, Array<number>>;
            }
            else
            {
                (degreeDistribution as Orientation_Dir<Array<number>>)[((index == 0) ? "in" : "out")] = degreeSequenceResult;
            }
        }

        return degreeDistribution;
    }

    // Clustering coefficient - Zjistit implementaci pro orientované sítě
    /* clusteringCoefficient<ARGS extends ARGS_NodeId<string>>
    (args: ARGS): number
    {
        const {
            nodeId
        } = args;

        const callback: IterateCallback<Node_Types<T>, Link_Types<U, V, W>> = (args) =>
        {
            const {
                getNode
            } = args;

            const node = getNode({
                layerId: "default",
                nodeId: nodeId
            });

            for(const [key, neighbour] of node.getLinks()["default"])
            {

            }
        };
    } */
};