import { 
    ARGS_LayerId,
    ARGS_NodeId
} from "../../args_items.js";

// Help class, which provides the basic parts of error messages
export class Errors
{
    // Message about node and its ID
    protected static node<ARGS extends ARGS_NodeId<string>>
    (args: ARGS): string
    {
        const {
            nodeId
        } = args;

        return `node (with ID) "${nodeId}"`;
    }

    // Add information that node is source node
    protected static sourceNode<ARGS extends ARGS_NodeId<string>>
    (args: ARGS): string
    {
        const {
            nodeId
        } = args;
        
        const sourceNodeMsg: string = this.node({
            nodeId: nodeId
        });
        
        return `${sourceNodeMsg} (source node)`;
    }

    // Add information that node is target node
    protected static targetNode<ARGS extends ARGS_NodeId<string>>
    (args: ARGS): string
    {
        const {
            nodeId
        } = args;

        const targetNodeMsg: string = this.node({
            nodeId: nodeId
        });

        return `${targetNodeMsg} (target node)`;
    }

    // Message about layer where error was occured
    protected static inLayer<ARGS extends ARGS_LayerId<string>>
    (args: ARGS): string
    {
        const {
            layerId
        } = args;

        return `in layer (with ID) "${layerId}"`;
    }
};