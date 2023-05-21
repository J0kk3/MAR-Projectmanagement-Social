/* eslint-disable @typescript-eslint/ban-types */
import axios, { AxiosResponse } from "axios";
//Models & Types
import { Project } from "../models/project";

//all requests that goes to the api

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = <T> ( response: AxiosResponse<T> ) => response.data;

const requests =
{
    get: <T> ( url: string ) => axios.get<T>( url ).then( responseBody ),
    post: <T> ( url: string, body: {} ) => axios.post<T>( url, body ).then( responseBody ),
    put: <T> ( url: string, body: {} ) => axios.put<T>( url, body ).then( responseBody ), //note replaced {} with Record<string, unknown>
    del: <T> ( url: string ) => axios.delete<T>( url ).then( responseBody )
};

const Projects =
{
    list: () => requests.get<Project[]>( "/projects" ),
    details: ( id: string ) => requests.get<Project>( `/projects/${ id }` ),
    create: ( project: Project ) => requests.post<void>( "/projects", project ),
    update: ( project: Project ) => requests.put<void>( `/projects/${ project.id }`, project ),
    delete: ( id: string ) => requests.del<void>( `/projects/${ id }` )
};

const agent =
{
    Projects
};

export default agent;