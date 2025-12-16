export abstract class Network3DError extends Error
{    
    protected static readonly nonExistMsg: string = "does not exist";
    protected static readonly alreadyExistMsg: string = "already exists";
    protected static readonly withIdMsg: string = "(with ID)";
    protected static readonly withinMsg: string = "within";
    protected static readonly cannotBeMsg: string = "cannot be";

    public static remapExceptions({ callback, mapFunction }: { callback: () => void, mapFunction: Map<string, Function> }): void
    {
        try
        {
            callback();
        }
        catch(e: any)
        {
            if(!mapFunction.has(e.name))
            {
                throw e;
            }
            else
            {
                throw mapFunction.get(e.name)!(e);
            }
        }
    }

    public data: any;

    constructor(message: string, data: any)
    {
        super(`${message[0].toUpperCase() + message.slice(1)}.`);
        this.data = data;
        this.name = new.target.name;
    }
};
