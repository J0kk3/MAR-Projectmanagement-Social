/* eslint-disable no-magic-numbers */
export enum Visibility
{
    Public = 0,
    Private = 1,
}

export enum ProjectStatus
{
    Active,
    Paused,
}

export enum TaskStatus
{
    ToDo = 0,
    InProgress = 1,
    InReview = 2,
    Done = 3,
}

type ObjectId = string;

export interface Project
{
    id: ObjectId;
    title: string;
    description: string;
    priority: number;
    owner: string;
    collaborators: string[];
    dueDate: Date;
    category: string;
    tags: string[];
    visibility: Visibility;
    status: ProjectStatus;
    kanbanBoardId: ObjectId;
    kanbanBoard: KanbanBoard;
}

export interface KanbanBoard
{
    id: ObjectId;
    projectId: ObjectId;
    title: string;
    tasks: Task[];
}

export interface Task
{
    id?: string;
    projectId: ObjectId;
    name: string;
    description: string;
    dueDate: Date;
    peopleAssigned: string[];
    status: TaskStatus;
    taskColumn: string;
}