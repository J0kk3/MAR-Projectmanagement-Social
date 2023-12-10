import ObjectID from "bson-objectid";
import { TeamMember } from "./teamMember";

export interface Team
{
    id: ObjectID;
    name: string;
    members: TeamMember[];
}