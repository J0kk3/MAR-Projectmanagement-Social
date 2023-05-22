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

export interface Project
{
    id: string;
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
    kanbanBoardId: string;
    kanbanBoard: KanbanBoard;
}

export interface KanbanBoard
{
    id: string;
    projectId: string;
    title: string;
    tasksToDo: Task[];
    tasksInProgress: Task[];
    tasksInReview: Task[];
    tasksDone: Task[];
}

export interface Task
{
    id: string;
    name: string;
    description: string;
    peopleAssigned: string[];
    status: "todo" | "inProgress" | "inReview" | "done";
}