import { useState } from "react";
import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../../app/stores/store";
//Models & Types
import { KanbanBoard, Task, TaskStatus } from "../../app/models/project";
//Components
import Modal from "../../Components/Modal/Modal";
//Styles
import "./TaskCreationForm.scss";
import agent from "../../app/api/agent";

interface Props
{
    status: TaskStatus;
    setShowAddTaskForms: ( forms: Record<TaskStatus, boolean> ) => void;
    showAddTaskForms: Record<TaskStatus, boolean>;
    setKanbanBoard: ( kanbanBoard: KanbanBoard | null ) => void;
    kanbanBoard: KanbanBoard | null;
    setAllTasks: ( tasks: Task[] ) => void;
    allTasks: Task[];
    showCancelButton: boolean;
    setDragDropKey: ( key: number ) => void;
    dragDropKey: number;
    onTaskCreated: ( task: Task ) => void;
    onCancel: () => void;
}

const TaskCreationForm = ( { allTasks, setAllTasks, status, setShowAddTaskForms, showAddTaskForms, kanbanBoard, setDragDropKey, dragDropKey, onTaskCreated }: Props ) =>
{
    const { projectStore, userStore } = useStore();
    const { createTaskInKanbanBoard, loadKanbanBoard } = projectStore;
    const { userId } = userStore;

    const [ taskName, setTaskName ] = useState<string>( "" );
    const [ isModalOpen, setIsModalOpen ] = useState( false );
    const [ dueDate, setDueDate ] = useState<Date | null>( null );

    // Length of "YYYY-MM-DD" is 10
    const ISO_DATE_LENGTH = 10;

    const handleSubmit = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();

        if ( kanbanBoard && userId )
        {
            const newTask: Task =
            {
                projectId: kanbanBoard.projectId!,
                name: taskName,
                ownerId: userId,
                description: "",
                dueDate: dueDate || new Date(),
                peopleAssigned: [],
                status: status,
            };

            try
            {
                const createdTask = await createTaskInKanbanBoard( newTask );

                if ( createdTask )
                {
                    // Fetch updated task list
                    const updatedTasks = await agent.Tasks.getTasksByProject( kanbanBoard.projectId! );
                    setAllTasks( updatedTasks );
                    setDragDropKey( dragDropKey + 1 );
                    onTaskCreated( { ...newTask, id: createdTask.id } );
                    // After the task is created, hide the form
                    setShowAddTaskForms( { ...showAddTaskForms, [ status ]: false } );
                    setIsModalOpen( false );
                }
            }
            catch ( err )
            {
                console.error( "Error creating task:", err );
            }
        }
        else
        {
            console.error( "Cannot create task: UserID or KanbanBoard is null" );
        }
    };

    return (
        <>
            <button onClick={ () => setIsModalOpen( true ) }>Add Task</button>

            <Modal show={ isModalOpen } closeModal={ () => setIsModalOpen( false ) }>
                <h2>Create a Task</h2>
                <form onSubmit={ handleSubmit }>
                    <input className="task-input" type="text" value={ taskName } onChange={ ( e ) => setTaskName( e.target.value ) } />

                    <input className="task-input" type="date" value={ dueDate ? dueDate.toISOString().substring( 0, ISO_DATE_LENGTH ) : "" } onChange={ ( e ) => setDueDate( e.target.value ? new Date( e.target.value ) : null ) } />

                    <button className="add-task-button" type="submit">Create Task</button>
                </form>
            </Modal>
        </>
    );
};

export default observer( TaskCreationForm );