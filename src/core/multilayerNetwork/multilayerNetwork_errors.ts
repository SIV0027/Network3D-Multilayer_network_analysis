import {
    ARGS_LayerId,
    ARGS_NodeId
} from "../../args_items.js";

import {
    Errors
} from "./../errors/errors.js";

// Class that provides errors for MultilayerNetwork class
export class MultilayerNetworkErrors extends Errors
{
    // Error raises message that node with given ID in given node layer already exists
    public static alreadyExistsNode<ARGS extends ARGS_NodeId<string> &
                                                 ARGS_LayerId<string>>
    (args: ARGS): Error
    {
        const {
            layerId,
            nodeId
        } = args;

        const nodeMsg: string = this.node({
            nodeId: nodeId
        });
        const inLayerMsg: string = this.inLayer({
            layerId: layerId
        });
        const errorMsg: string = `${nodeMsg} already exists ${inLayerMsg}`;

        return new Error(errorMsg);
    }

    // Error raises message that node with given ID in given node layer do not exists
    public static nonExistingNode<ARGS extends ARGS_NodeId<string> &
                                               ARGS_LayerId<string>>
    (args: ARGS): Error
    {
        const {
            layerId,
            nodeId
        } = args;

        const nodeMsg: string = this.node({
            nodeId: nodeId
        });
        const inLayerMsg: string = this.inLayer({
            layerId: layerId
        });
        const errorMsg: string = `${nodeMsg} does not exists ${inLayerMsg}`;

        return new Error(errorMsg);
    }
};