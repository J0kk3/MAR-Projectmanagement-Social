import { createContext, useContext } from "react";
//stores
import CommonStore from "./commonStore";
import ProjectStore from "./projectStore";
import UserStore from "./userStore";

interface Store
{
    commonStore: CommonStore;
    projectStore: ProjectStore;
    userStore: UserStore;
}

export const store: Store =
{
    commonStore: new CommonStore(),
    projectStore: new ProjectStore(),
    userStore: new UserStore()
};

export const StoreContext = createContext( store );

export function useStore ()
{
    return useContext( StoreContext );
}