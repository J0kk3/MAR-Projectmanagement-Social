import ObjectID from "bson-objectid";

export interface Profile
{
    id: ObjectID;
    userName: string;
    image?: string;
    bio?: string;
}