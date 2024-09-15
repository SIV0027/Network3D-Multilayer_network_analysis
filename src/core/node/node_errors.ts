import { ARGS_LayerId, ARGS_NodeId, ARGS_SourceNodeId, ARGS_TargetNodeId } from "../../args_items.js";
import {
    Errors
} from "../errors/errors.js";

// Class that provides errors for Node class
export class NodeErrors extends Errors
{
    // Error raises message that specific link do not exists
    public static nonExistingLink<ARGS extends ARGS_LayerId<string> &
                                               ARGS_SourceNodeId<string> &
                                               ARGS_TargetNodeId<string>>
    (args: ARGS): Error
    {
        const {
            layerId,
            sourceNodeId,
            targetNodeId
        } = args;

        const sourceNodeMsg: string = this.sourceNode({ 
            nodeId: sourceNodeId
        });
        const targetNodeMsg: string = this.targetNode({
            nodeId: targetNodeId
        });
        const inLayerMsg: string = this.inLayer({
            layerId: layerId
        });
        const errorMsg: string = `there is no link between ${sourceNodeMsg} and ${targetNodeMsg} ${inLayerMsg}`;

        return new Error(errorMsg);
    }

    // Error raises message that specific link and specific node is not incident to each other
    public static nonIncident<ARGS extends ARGS_NodeId<string> &
                                           ARGS_LayerId<string> &
                                           ARGS_SourceNodeId<string> &
                                           ARGS_TargetNodeId<string>>
    (args: ARGS): Error
    {
        const {
            nodeId,
            layerId,
            sourceNodeId,
            targetNodeId
        } = args;

        const nodeMsg: string = this.node({
            nodeId: nodeId
        });
        const sourceNodeMsg: string = this.sourceNode({
            nodeId: sourceNodeId
        });
        const targetNodeMsg: string = this.targetNode({
            nodeId: targetNodeId
        });
        const inLayerMsg: string = this.inLayer({
            layerId: layerId
        });
        const errorMsg: string = `given link is not incident with ${nodeMsg} because is incident with ${sourceNodeMsg} and ${targetNodeMsg} ${inLayerMsg}`;

        return new Error(errorMsg);
    }

    // Error raises message that specific link already exists
    public static alreadyExistLink<ARGS extends ARGS_SourceNodeId<string> &
                                                ARGS_TargetNodeId<string> &
                                                ARGS_LayerId<string>>
    (args: ARGS): Error
    {
        const {
            layerId,
            sourceNodeId,
            targetNodeId
        } = args;

        const sourceNodeMsg: string = this.sourceNode({
            nodeId: sourceNodeId
        });
        const targetNodeMsg: string = this.targetNode({
            nodeId: targetNodeId
        });
        const inLayerMsg: string = this.inLayer({
            layerId: layerId
        });
        const errorMsg: string = `link between ${sourceNodeMsg} and ${targetNodeMsg} already exists ${inLayerMsg}`;

        return new Error(errorMsg);
    }
};