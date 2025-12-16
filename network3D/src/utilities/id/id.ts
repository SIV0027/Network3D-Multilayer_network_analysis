import { InvalidIdError } from "./idErrors";

export class ID
{
    public static validateID({ id }: { id: string }): void
    {
        if(id.trim().length === 0)
        {
            throw new InvalidIdError();
        }
    }
};