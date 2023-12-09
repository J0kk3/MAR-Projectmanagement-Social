/* eslint-disable @typescript-eslint/ban-types */
import axios, { AxiosResponse } from "axios";
import ObjectID from "bson-objectid";
//Stores
import { store } from "../stores/store";
//Models & Types
import { KanbanBoard, Project, Task } from "../models/project";
import { User, UserFormValues } from "../models/user";
import { Profile } from "../models/profile";

//all requests that goes to the api

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = <T> ( response: AxiosResponse<T> ) => response.data;

axios.interceptors.request.use( config =>
{
    const token = store.commonStore.token;

    if ( token && config.headers ) config.headers.Authorization = `Bearer ${ token }`;

    return config;
} );

const requests =
{
    get: <T> ( url: string ) => axios.get<T>( url ).then( responseBody ),
    post: <T> ( url: string, body: {} ) => axios.post<T>( url, body ).then( responseBody ),
    put: <T> ( url: string, body: {} ) => axios.put<T>( url, body ).then( responseBody ),
    del: <T> ( url: string ) => axios.delete<T>( url ).then( responseBody )
};

const Projects =
{
    list: () => requests.get<Project[]>( "/projects" ),
    details: ( id: ObjectID ) => requests.get<Project>( `/projects/${ id }` ),
    create: ( project: Project ) => requests.post<void>( "/projects", project ),
    update: ( project: Project ) => requests.put<void>( `/projects/${ project.id }`, project ),
    delete: ( id: ObjectID ) => requests.del<void>( `/projects/${ id }` )
};

const KanbanBoards =
{
    get: ( projectId: string ) => requests.get<KanbanBoard>( `/projects/${ projectId }/kanbanBoard` ),
};

const Tasks =
{
    list: ( projectId: ObjectID ) => requests.get<Task[]>( `/projects/${ projectId }/tasks` ),
    addTask: ( id: ObjectID, task: Task ) => requests.post<Task>( `/projects/${ id }/tasks`, task ),
    getTask: ( projectId: ObjectID, taskId: ObjectID ) => requests.get<Task>( `/projects/${ projectId }/tasks/${ taskId }` ),
    getTasksByProject: ( projectId: ObjectID ) => requests.get<Task[]>( `/projects/${ projectId }/tasks` ),
    updateTaskStatus: ( taskId: ObjectID, newStatus: string ) => requests.put<void>( `/projects/tasks/${ taskId }`, { TaskId: taskId, NewStatus: newStatus } ),
    editPeopleAssigned: ( projectId: ObjectID, taskId: ObjectID, peopleAssignedIds: ObjectID[] ) => requests.post<void>( `/projects/${ projectId }/tasks/${ taskId }/peopleAssigned`, peopleAssignedIds ),
    editTask: ( userId: string, projectId: ObjectID, taskId: ObjectID, task: Task ) =>
        requests.put<Task>( `/projects/${ projectId }/tasks/${ taskId }/details?userId=${ userId }`, task ),
    deleteTask: ( userId: string, projectId: ObjectID, taskId: ObjectID ) =>
        requests.del<void>( `/projects/${ projectId }/tasks/${ taskId }?userId=${ userId }` ),
};

const Account =
{
    current: () => requests.get<User>( "/account" ),
    login: ( user: UserFormValues ) => requests.post<User>( "/account/login", user ),
    register: ( user: UserFormValues ) => requests.post<User>( "/account/register", user ),
    search: ( query: string ) => requests.get<Profile[]>( `/account/search/${ query }` ),
    getUserDetails: ( id: string ) => requests.get<Profile>( `/account/user/${ id }` ),
};

const agent =
{
    Projects,
    KanbanBoards,
    Tasks,
    Account
};

export default agent;