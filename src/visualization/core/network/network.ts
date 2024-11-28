import {
    ARGS_
} from "../../../args_items";

export abstract class Network
{
    public abstract create
    (args: ARGS_): any;

    public abstract visualize
    (args: ARGS_): any;
};