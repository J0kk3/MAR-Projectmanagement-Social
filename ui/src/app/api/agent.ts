/* eslint-disable @typescript-eslint/ban-types */
import axios, { AxiosResponse } from "axios";
//Models & Types
import { KanbanBoard, Project, Task } from "../models/project";

//all requests that goes to the api

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = <T> ( response: AxiosResponse<T> ) => response.data;

const requests =
{
    get: <T> ( url: string ) => axios.get<T>( url ).then( responseBody ),
    post: <T> ( url: string, body: {} ) => axios.post<T>( url, body ).then( responseBody ),
    put: <T> ( url: string, body: {} ) => axios.put<T>( url, body ).then( responseBody ),
    del: <T> ( url: string ) => axios.delete<T>( url ).then( responseBody )
};

const projects =
{
    list: () => requests.get<Project[]>( "/projects" ),
    details: ( id: string ) => requests.get<Project>( `/projects/${ id }` ),
    create: ( project: Project ) => requests.post<void>( "/projects", project ),
    update: ( project: Project ) => requests.put<void>( `/projects/${ project.id }`, project ),
    delete: ( id: string ) => requests.del<void>( `/projects/${ id }` )
};

const kanbanBoards =
{
    get: ( projectId: string ) => requests.get<KanbanBoard>( `/projects/${ projectId }/kanbanBoard` ),
};

const tasks =
{
    list: () => requests.get<Task[]>( "/projects/tasks" ),
    updateTask: ( task: Task ) => requests.put<void>( `/kanbanBoards/tasks/${ task.id }`, task ),
    getTask: ( id: string ) => requests.get<Task>( `/tasks/${ id }` ),
    addTask: ( id: string, task: Task ) => requests.post<Task>( `/projects/${ id }/tasks`, task ),
};

const agent =
{
    projects,
    kanbanBoards,
    tasks
};

export default agent;