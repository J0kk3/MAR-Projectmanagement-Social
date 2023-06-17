//Models & Types
import { TaskStatus } from "./project";

export const TaskStatusMap =
{
    [ TaskStatus.ToDo ]: "To Do",
    [ TaskStatus.InProgress ]: "In Progress",
    [ TaskStatus.InReview ]: "Review",
    [ TaskStatus.Done ]: "Done",
};

export const TaskStatusMapInverse =
{
    "To Do": TaskStatus.ToDo,
    "In Progress": TaskStatus.InProgress,
    "Review": TaskStatus.InReview,
    "Done": TaskStatus.Done,
};

interface IDroppableIdToTaskStatus
{
    [ key: string ]: TaskStatus | undefined;
}

export const DroppableIdToTaskStatus: IDroppableIdToTaskStatus =
{
    "to-do": TaskStatus.ToDo,
    "in-progress": TaskStatus.InProgress,
    "in-review": TaskStatus.InReview,
    "done": TaskStatus.Done,
};

export const TaskStatusToDroppableId: { [ status in TaskStatus ]: string } =
{
    [ TaskStatus.ToDo ]: "to-do",
    [ TaskStatus.InProgress ]: "in-progress",
    [ TaskStatus.InReview ]: "in-review",
    [ TaskStatus.Done ]: "done",
};