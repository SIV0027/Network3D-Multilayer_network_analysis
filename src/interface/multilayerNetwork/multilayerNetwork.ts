import {
    HIN,
    MultilayerNetwork as Core,
    TT,
    TU
} from "../../core/index.js";

export class MultilayerNetwork<T extends TT, U extends TU<T>>
{
    protected multilayerNetwork: Core<T, U>;

    constructor(args: {
        hin: HIN<T, U>
    })
    {
        const {
            hin
        } = args;

        this.multilayerNetwork = new Core({
            hin: hin
        });
    }

    protected getNode<L extends keyof T>
    (args: {
        layerId: L
    }): T[L]["value"]
    {
        return null;
    }

    public iterate
    (): void
    {
        // poskytnout seznam všech ID uzlů ve všech vrstvách ({ [layerId: string]: Array<string> })
        // metoda na získání uzlu (ID a jeho hondoty a seznam ID s ním incidentních -> kopírovat strukturu jejich link layer ("in"/"out" struktura jen orientovaných intralink vrstvách))
    }
};