import ObjectID from "bson-objectid";

export interface User
{
    id: ObjectID;
    userName: string;
    token: string;
    image?: string;
}

export interface UserFormValues
{
    email: string;
    password: string;
    userName?: string;
}