import { Network3DError } from "../network3DError/network3DError";

export class InvalidIdError extends Network3DError
{
    constructor()
    {
        super(`an empty string or a string consisting only of white space and line terminator characters is considered invalid`, { });
    }
};