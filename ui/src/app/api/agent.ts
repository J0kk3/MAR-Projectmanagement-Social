/* eslint-disable @typescript-eslint/ban-types */
import axios, { AxiosResponse } from "axios";
import ObjectID from "bson-objectid";
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
    details: ( id: ObjectID ) => requests.get<Project>( `/projects/${ id }` ),
    create: ( project: Project ) => requests.post<void>( "/projects", project ),
    update: ( project: Project ) => requests.put<void>( `/projects/${ project.id }`, project ),
    delete: ( id: ObjectID ) => requests.del<void>( `/projects/${ id }` )
};

const kanbanBoards =
{
    get: ( projectId: string ) => requests.get<KanbanBoard>( `/projects/${ projectId }/kanbanBoard` ),
};

const tasks =
{
    list: ( projectId: ObjectID ) => requests.get<Task[]>( `/projects/${ projectId }/tasks` ),
    addTask: ( id: ObjectID, task: Task ) => requests.post<Task>( `/projects/${ id }/tasks`, task ),
    getTask: (projectId: ObjectID, taskId: ObjectID) => requests.get<Task>(`/projects/${projectId}/tasks/${taskId}`),
    getTasksByProject: ( projectId: ObjectID ) => requests.get<Task[]>( `/projects/${ projectId }/tasks` ),
    updateTaskStatus: ( taskId: string, newStatus: string ) => requests.put<void>( `/projects/tasks/${ taskId }`, { TaskId: taskId, NewStatus: newStatus } ),
    editTask: ( projectId: ObjectID, taskId: ObjectID, task: Task ) => requests.put<Task>( `/projects/${ projectId }/tasks/${ taskId }/details`, task ),
};

const agent =
{
    projects,
    kanbanBoards,
    tasks
};

export default agent;