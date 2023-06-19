import { ChangeEvent, FormEvent, useEffect, SyntheticEvent, useState } from "react";
//API Agent
import agent from "../../app/api/agent";
//Types & Models
import { Task, TaskStatus } from "../../app/models/project";
import { TaskStatusMap, TaskStatusMapInverse } from "../../app/models/enumsMap";
//Stores
import { observer } from "mobx-react-lite";

type TaskEditFormProps =
    {
        task: Task;
        onEdit: ( task: Task ) => void;
        closeModal: () => void;
        editTask: Task | undefined;
        setEditTask: ( task: Task | undefined ) => void;
    };

const TaskEditForm = ( { task, onEdit, closeModal, editTask, setEditTask }: TaskEditFormProps ) =>
{

    const [ isUpdated, setIsUpdated ] = useState( false );

    const stringToTaskStatus = ( status: string ): TaskStatus =>
    {
        switch ( status )
        {
            case "ToDo": return TaskStatus.ToDo;
            case "InProgress": return TaskStatus.InProgress;
            case "InReview": return TaskStatus.InReview;
            case "Done": return TaskStatus.Done;
            default: throw new Error( "Invalid TaskStatus: " + status );
        }
    };

    useEffect( () =>
    {
        if ( task && !isUpdated )
        {
            setEditTask(
                {
                    ...task,
                    dueDate: new Date( task.dueDate ),
                } );
            setIsUpdated( true );
        }
    }, [ task, setEditTask, isUpdated ] );

    const handleDateChange = ( event: ChangeEvent<HTMLInputElement> ) =>
    {
        if ( editTask )
        {
            setEditTask( { ...editTask, dueDate: new Date( event.target.value ) } );
        }
    };

    const handlePeopleAssignedChange = ( event: React.ChangeEvent<HTMLInputElement> ) =>
    {
        const people = event.target.value.split( "," ).map( person => person.trim() );
        if ( editTask )
        {
            const updatedTask =
            {
                ...editTask,
                peopleAssigned: people
            };
            setEditTask( updatedTask );
        }
    };

    const handleStatusChange = ( event: ChangeEvent<HTMLSelectElement> ) =>
    {
        if ( editTask )
        {
            setEditTask( { ...editTask, status: TaskStatusMapInverse[ event.target.value as keyof typeof TaskStatusMapInverse ] } );
        }
    };

    const handleCancel = ( event: SyntheticEvent ) =>
    {
        event.preventDefault();
        closeModal();
    };

    const handleSubmit = async ( event: FormEvent<HTMLFormElement> ) =>
    {
        event.preventDefault();

        if ( editTask && editTask.projectId && editTask.id )
        {
            console.log( "editTask", editTask );
            const updatedTask = await agent.Tasks.editTask( editTask.projectId, editTask.id, editTask );

            if ( updatedTask )
            {
                // re-fetch the task from the server after the edit
                const fetchedTask = await agent.Tasks.getTask( editTask.projectId, editTask.id );

                if ( fetchedTask )
                {
                    onEdit( fetchedTask );
                    setIsUpdated( false );
                }
                else
                {
                    // handle error case when the task could not be fetched
                }
            }
        }

        closeModal();
    };

    const handleChange = ( event: ChangeEvent<HTMLInputElement> ) =>
    {
        const { name, value } = event.target;
        if ( editTask )
        {
            setEditTask( { ...editTask, [ name ]: value } );
        }
    };

    return (
        <form onSubmit={ handleSubmit }>
            { editTask &&
                <>
                    <label>
                        Name:
                        <input name="name" value={ editTask.name } onChange={ handleChange } />
                    </label>
                    <label>
                        Description:
                        <input name="description" value={ editTask.description } onChange={ handleChange } />
                    </label>
                    <label>
                        Due Date:
                        <input type="date" value={ editTask.dueDate.toISOString().split( "T" )[ 0 ] } onChange={ handleDateChange } />
                    </label>
                    <label>
                        People Assigned:
                        <input
                            type="text"
                            value={ editTask.peopleAssigned.join( ", " ) }
                            onChange={ handlePeopleAssignedChange }
                        />
                    </label>
                    <label>
                        Status:
                        <select value={ TaskStatusMap[ editTask.status ] } onChange={ handleStatusChange }>
                            { Object.values( TaskStatusMap ).map( ( status, index ) =>
                                <option key={ index } value={ status }>{ status }</option>
                            ) }
                        </select>
                    </label>
                </>
            }
            <input type="submit" value="Edit Task" />
            <button onClick={ handleCancel }>Cancel</button>
        </form>
    );
};

export default observer( TaskEditForm );
