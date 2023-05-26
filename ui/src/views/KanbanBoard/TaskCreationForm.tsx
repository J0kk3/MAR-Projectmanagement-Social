import { useState } from "react";
import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../../app/stores/store";
//Models & Types
import { KanbanBoard, Task, TaskStatus } from "../../app/models/project";
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
}

const TaskCreationForm = ( { status, setShowAddTaskForms, showAddTaskForms, setKanbanBoard, kanbanBoard, setAllTasks, allTasks, showCancelButton, onCancel }: Props ) =>
{
    const { projectStore } = useStore();
    const { createTaskInKanbanBoard, loadKanbanBoard } = projectStore;

    const [ taskName, setTaskName ] = useState<string>( "" );

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
                dueDate: new Date(),
                peopleAssigned: [],
                status: status,
                taskColumn: String( status ),
            };

            createTaskInKanbanBoard( newTask ).then( ( createdTask ) =>
            {
                if ( createdTask )
                {
                    // After the task is created, hide the form again
                    setShowAddTaskForms( { ...showAddTaskForms, [ status ]: false } );
                    // And update the kanban board's tasks
                    newTask.id = createdTask.id;
                    setKanbanBoard( { ...kanbanBoard, tasks: [ ...kanbanBoard.tasks, newTask ] } );
                    setAllTasks( [ ...allTasks, newTask ] );
                    if ( kanbanBoard && kanbanBoard.projectId )
                    {
                        loadKanbanBoard( kanbanBoard.projectId ).then( updatedKanbanBoard =>
                        {
                            setKanbanBoard( updatedKanbanBoard );
                        } );
                    }
                }
            } );
        }
    };

    return (
        <form onSubmit={ handleSubmit }>
            <div className="task-form-container">
                { showCancelButton &&
                    <button
                        className="cancel-button"
                        onClick={ onCancel }
                    >
                        Cancel
                    </button>
                }
                <input className="task-input" type="text" value={ taskName } onChange={ ( e ) => setTaskName( e.target.value ) } />
                <button className="add-task-button" type="submit">Create Task</button>
            </div>
        </form>
    );
};

export default observer( TaskCreationForm );