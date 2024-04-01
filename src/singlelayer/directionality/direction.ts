import Link from "../components/link.js";
import Node from "../components/node.js";
import { Id_ARGS, Value_ARGS } from "../network/networkArgsTypes.js";
import { Link_ARGS, SourceTargetNodes_ARGS } from "./directionArgsTypes.js";

export default abstract class Direction<NODE_ID_TYPE extends Object,
                                        NODE_VALUE_TYPE,
                                        LINK_VALUE_TYPE>
{
    //----------------------------------------------------------------
    //----------------------------STATIC------------------------------
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //---------------------------INSTANCE-----------------------------
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //-----------------------------HELP-------------------------------

    //----------------------------------------------------------------
    //----------------------------ADDERS------------------------------   

    //----------------------------------------------------------------
    // addLinkBetweenNodes(...) - add given link between given nodes
    public abstract addLinkBetweenNodes<ARGS extends SourceTargetNodes_ARGS<Node<NODE_ID_TYPE,
                                                                                 NODE_VALUE_TYPE,
                                                                                 LINK_VALUE_TYPE>> &
                                                     Link_ARGS<Link<LINK_VALUE_TYPE,
                                                                    NODE_ID_TYPE,
                                                                    NODE_VALUE_TYPE>>>
    (args: ARGS): void;

    //----------------------------------------------------------------
    //----------------------------GETTERS-----------------------------

    //----------------------------------------------------------------
    //----------------------------OTHERS------------------------------

    //----------------------------------------------------------------
    // createNode(...) - create concrete node and return its abstract 
    // supertype (Node)
    public abstract createNode<ARGS extends Id_ARGS<NODE_ID_TYPE> &
                                            Value_ARGS<NODE_VALUE_TYPE>>
    (args: ARGS): Node<NODE_ID_TYPE,
                       NODE_VALUE_TYPE,
                       LINK_VALUE_TYPE>;
};