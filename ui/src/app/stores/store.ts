import { createContext, useContext } from "react";
//stores
import ProjectStore from "./projectStore";

interface Store
{
    projectStore: ProjectStore;
}

export const store: Store =
{
    projectStore: new ProjectStore(),
};

export const StoreContext = createContext( store );

export function useStore ()
{
    return useContext( StoreContext );
}