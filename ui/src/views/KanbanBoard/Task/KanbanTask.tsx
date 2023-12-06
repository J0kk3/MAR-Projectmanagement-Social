import { observer } from "mobx-react-lite";
//Models & Types
import { Draggable } from "react-beautiful-dnd";
import { Task } from "../../../app/models/project";
import { ModalContent } from "../../../app/models/taskEnums";

interface Props
{
    task: Task;
    index: number;
    openModal: ( task: Task | null, content: ModalContent ) => void;
}

const KanbanTask = ( { task, index, openModal }: Props ) => (
    <Draggable key={ task.id?.toString() || "fallback" } draggableId={ task.id?.toString() || "fallback" } index={ index }>
        { ( provided, snapshot ) => (
            <div
                className={ `task ${ snapshot.isDragging ? "is-dragging" : "" }` }
                ref={ provided.innerRef }
                { ...provided.draggableProps }
            >
                <hr className="task-divider" />
                <div { ...provided.dragHandleProps }>
                    <div onClick={ () => openModal( task, ModalContent.TaskDetails ) }>
                        { task.name }
                    </div>
                </div>
            </div>
        ) }
    </Draggable>
);

export default observer( KanbanTask );