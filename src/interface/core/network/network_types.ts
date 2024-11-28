import {
    ARGS_Callback
} from "../../../args_items.js";

import {
    TT,
    TU
} from "../../index.js";

import {
    IterateCallback
} from "../index.js";

export interface Iterate<T extends TT, U extends TU<T>>
{
    iterate<ARGS extends ARGS_Callback<IterateCallback<T, U>>>
    (args: ARGS): void
};