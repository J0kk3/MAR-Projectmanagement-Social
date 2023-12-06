//Models & Types
import { observer } from "mobx-react-lite";
import { Task, TaskStatus } from "../../../app/models/project";
import { ModalContent  } from "../../../app/models/taskEnums";
//Components
import KanbanTask from "./KanbanTask";

interface Props
{
    status: TaskStatus;
    getTasksByStatus: ( status: TaskStatus ) => Task[];
    openModal: ( task: Task | null, content: ModalContent ) => void;
}

const TaskList = ( { status, getTasksByStatus, openModal }: Props ) => (
    <>
        { getTasksByStatus( status ).map( ( task: Task, index: number ) => (
            <KanbanTask key={ task.id?.toString() || "fallback" } task={ task } index={ index } openModal={ openModal } />
        ) ) }
    </>
);

export default observer(TaskList);