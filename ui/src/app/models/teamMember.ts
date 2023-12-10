import { Profile } from "./profile";
import { teamRolesEnums } from "./teamRolesEnums";

export interface TeamMember
{
    user: Profile;
    role: teamRolesEnums;
    isGuest: boolean; //redundant?
}