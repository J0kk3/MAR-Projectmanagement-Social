import { Droppable } from "react-beautiful-dnd";
import { observer } from "mobx-react-lite";
//Models & Types
import { TaskStatusMap } from "../../../app/models/enumsMap";
import { Task, KanbanBoard, TaskStatus } from "../../../app/models/project";
import { ModalContent } from "../../../app/models/taskEnums";
//Components
import TaskList from "../Task/TaskList";
import TaskCreationForm from "../TaskCreationForm";

interface Props
{
    status: TaskStatus;
    getTasksByStatus: ( status: TaskStatus ) => Task[];
    getTaskStatusFromDroppableId: ( status: TaskStatus ) => string;
    showAddTaskForms: Record<TaskStatus, boolean>;
    setShowAddTaskForms: ( showAddTaskForms: Record<TaskStatus, boolean> ) => void;
    kanbanBoard: KanbanBoard | null;
    setKanbanBoard: ( kanbanBoard: KanbanBoard | null ) => void;
    allTasks: Task[];
    setAllTasks: ( allTasks: Task[] ) => void;
    onTaskCreated: ( task: Task ) => Promise<Task | undefined>;
    openModal: ( task: Task | null, content: ModalContent ) => void;
}

const KanbanColumn = ( {
    status,
    getTasksByStatus,
    getTaskStatusFromDroppableId,
    showAddTaskForms,
    setShowAddTaskForms,
    kanbanBoard,
    setKanbanBoard,
    allTasks,
    setAllTasks,
    openModal,
    onTaskCreated
}: Props ) =>
{

    const handleTaskCreated = async ( task: Task ) =>
    {
        try
        {
            const createdTask = await onTaskCreated( task );
            if ( createdTask )
            {
                // handle any post-creation logic here, if necessary
            }
        }
         catch ( error )
        {
            // handle errors here
        }
    };

    return (
        <Droppable key={ status } droppableId={ getTaskStatusFromDroppableId( status ) }>
            { ( provided, snapshot ) => (
                <div
                    className={ `kanban-column ${ snapshot.isDraggingOver ? "dragging-over" : "" }` }
                    { ...provided.droppableProps }
                    ref={ provided.innerRef }
                >
                    <h3>{ TaskStatusMap[ status ] }</h3>
                    <div className="task-list">
                        <TaskList status={ status } getTasksByStatus={ getTasksByStatus } openModal={ openModal } />
                    </div>
                    { provided.placeholder }
                        <TaskCreationForm
                            showCancelButton={ true }
                            onCancel={ () => setShowAddTaskForms( { ...showAddTaskForms, [ status ]: false } ) }
                            status={ status }
                            setShowAddTaskForms={ setShowAddTaskForms }
                            showAddTaskForms={ showAddTaskForms }
                            setKanbanBoard={ setKanbanBoard }
                            kanbanBoard={ kanbanBoard }
                            setAllTasks={ setAllTasks }
                            allTasks={ allTasks }
                            onTaskCreated={ handleTaskCreated }
                        />
                </div>
            ) }
        </Droppable>
    );
};

export default observer( KanbanColumn );