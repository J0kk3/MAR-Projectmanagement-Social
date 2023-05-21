export enum Visibility
{
    Public = "Public",
    Private = "Private",
}

export interface Project
{
    id: string;
    title: string;
    description: string;
    priority: number;
    owner: string;
    collaborators: string[];
    dueDate: string;
    category: string;
    tags: string[];
    visibility: Visibility;
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