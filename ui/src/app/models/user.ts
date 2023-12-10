import ObjectID from "bson-objectid";
import { Team } from "./team";

export interface User
{
    id: ObjectID;
    userName: string;
    token: string;
    image?: string;
    teams?: Team[];
}

export interface UserFormValues
{
    email: string;
    password: string;
    userName?: string;
}