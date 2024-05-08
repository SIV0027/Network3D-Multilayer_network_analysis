import Network from "../network/network";
import MultiplexNode from "./components/node/multiplexNode";

export namespace Core
{
    export class MultiplexNetwork<NODE_ID_TYPE extends Object,
                                  NODE_VALUE_TYPE,
                                  LAYER_ID_TYPE extends Object>
    extends Network
    {
        //----------------------------------------------------------------
        //----------------------------STATIC------------------------------
        //----------------------------------------------------------------

        //----------------------------------------------------------------
        //---------------------------INSTANCE-----------------------------
        //----------------------------------------------------------------

        protected nodes: Map<NODE_ID_TYPE,
                             MultiplexNode<NODE_ID_TYPE,
                                           NODE_VALUE_TYPE,
                                           undefined,
                                           LAYER_ID_TYPE>>;

        constructor()
        {
            super();

            this.nodes = new Map<NODE_ID_TYPE,
                                 MultiplexNode<NODE_ID_TYPE,
                                               NODE_VALUE_TYPE,
                                               undefined,
                                               LAYER_ID_TYPE>>();
        }

        //----------------------------------------------------------------
        //-----------------------------HELP-------------------------------

        //----------------------------------------------------------------
        //----------------------------ADDERS------------------------------

        //----------------------------------------------------------------
        public addLayer
        (args: Object)
        {

        }

        //----------------------------------------------------------------
        public override addNode
        (args: Object)
        {
            throw new Error("Method not implemented.");
        }

        //----------------------------------------------------------------
        public override addLink
        (args: Object)
        {
            throw new Error("Method not implemented.");
        }


        //----------------------------------------------------------------
        //----------------------------GETTERS-----------------------------

        //----------------------------------------------------------------
        public override getNode
        (args: Object)
        {
            throw new Error("Method not implemented.");
        }

        //----------------------------------------------------------------
        public override getLink
        (args: Object)
        {
            throw new Error("Method not implemented.");
        }

        //----------------------------------------------------------------
        public override getNodesCount
        (args: Object)
        {
            throw new Error("Method not implemented.");
        }

        //----------------------------------------------------------------
        public override getLinksCount
        (args: Object)
        {
            throw new Error("Method not implemented.");
        }

        //----------------------------------------------------------------
        //----------------------------OTHERS------------------------------

    };
};