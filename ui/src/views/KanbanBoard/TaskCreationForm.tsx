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
    onCancel: () => void;
    onTaskCreated: ( task: Task ) => void;
}

const TaskCreationForm = ( { allTasks, setAllTasks, status, setShowAddTaskForms, showAddTaskForms, kanbanBoard, onTaskCreated }: Props ) =>
{
    const { projectStore } = useStore();
    const { createTaskInKanbanBoard, loadKanbanBoard } = projectStore;

    const [ taskName, setTaskName ] = useState<string>( "" );
    const [ isModalOpen, setIsModalOpen ] = useState( false );
    const [ dueDate, setDueDate ] = useState<Date | null>( null );

    // Length of "YYYY-MM-DD" is 10
    const ISO_DATE_LENGTH = 10;

    const handleSubmit = ( e: React.FormEvent ) =>
    {
        e.preventDefault();

        if ( kanbanBoard )
        {
            const newTask: Task =
            {
                projectId: kanbanBoard.projectId!,
                name: taskName,
                description: "",
                dueDate: dueDate || new Date(),
                peopleAssigned: [],
                status: status,
            };

            createTaskInKanbanBoard( newTask ).then( ( createdTask ) =>
            {
                if ( createdTask )
                {
                    // Update the state here
                    onTaskCreated( { ...newTask, id: createdTask.id } );

                    // Update allTasks
                    setAllTasks( [ ...allTasks, { ...newTask, id: createdTask.id } ] );

                    // After the task is created, hide the form again
                    setShowAddTaskForms( { ...showAddTaskForms, [ status ]: false } );
                }
            } ).catch( err =>
            {
                console.log( err );
            } );
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