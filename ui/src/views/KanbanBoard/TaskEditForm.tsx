import { ChangeEvent, FormEvent, useEffect, SyntheticEvent, useState } from "react";
import AsyncSelect from "react-select/async";
import { ActionMeta, MultiValue } from "react-select";
//API Agent
import agent from "../../app/api/agent";
//Types & Models
import { Task } from "../../app/models/project";
import { TaskStatusMap, TaskStatusMapInverse } from "../../app/models/enumsMap";
import ObjectID from "bson-objectid";
//Stores
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";

type TaskEditFormProps =
    {
        task: Task;
        onEdit: ( task: Task ) => void;
        closeModal: () => void;
        editTask: Task | undefined;
        setEditTask: ( task: Task | undefined ) => void;
    };

type OptionType = { label: string; value: string; };

const TaskEditForm = ( { task, onEdit, closeModal, editTask, setEditTask }: TaskEditFormProps ) =>
{
    const { userStore } = useStore();
    const { user } = userStore;

    const [ isUpdated, setIsUpdated ] = useState( false );
    const [ assignedUsers, setAssignedUsers ] = useState<{ label: string, value: string; }[]>( [] );

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

    useEffect( () =>
    {
        const fetchAssignedUsers = async () =>
        {
            const users = await Promise.all(
                task.peopleAssigned.map( id => agent.Account.getUserDetails( id.toString() ) )
            );
            setAssignedUsers( users.map( user => ( { label: user.userName, value: user.id.toString() } ) ) );
        };
        fetchAssignedUsers();
    }, [ task ] );

    const handleDateChange = ( event: ChangeEvent<HTMLInputElement> ) =>
    {
        if ( editTask )
        {
            setEditTask( { ...editTask, dueDate: new Date( event.target.value ) } );
        }
    };

    const handlePeopleAssignedChange = async (
        newValue: MultiValue<OptionType>,
        _: ActionMeta<OptionType>
    ) =>
    {
        const peopleAssignedIds = newValue.map( option => new ObjectID( option.value ) );
        if ( editTask && editTask.projectId && editTask.id )
        {
            try
            {
                await agent.Tasks.editPeopleAssigned( editTask.projectId, editTask.id, peopleAssignedIds );
                const updatedTask = { ...editTask, peopleAssigned: peopleAssignedIds };
                setEditTask( updatedTask );
            }
            catch ( error )
            {
                console.log( "handlePeopleAssignedChange: ", error );
            }
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

            const userId = user?.id;

            if ( !userId )
            {
                console.log( "User ID is undefined" );
                return;
            }
            if ( !( editTask.dueDate instanceof Date ) )
            {
                console.error( "Due date is not a valid date object." );
                return;
            }

            const updatedTaskData = (
                {
                    ...editTask,
                    peopleAssigned: editTask.peopleAssigned
                } );

            const updatedTask = await agent.Tasks.editTask( userId.toString(), editTask.projectId, editTask.id, updatedTaskData );

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

    const handleRemoveUser = ( userId: string ) =>
    {
        // Filter out the user to be removed
        const updatedUsers = assignedUsers.filter( user => user.value !== userId );
        setAssignedUsers( updatedUsers );

        // Update editTask state if editTask is available
        if ( editTask )
        {
            const updatedPeopleAssigned = editTask.peopleAssigned.filter( id => id.toString() !== userId );
            setEditTask( { ...editTask, peopleAssigned: updatedPeopleAssigned } );
        }
    };

    const handleChange = ( event: ChangeEvent<HTMLInputElement> ) =>
    {
        const { name, value } = event.target;
        if ( editTask )
        {
            setEditTask( { ...editTask, [ name ]: value } );
        }
    };

    const loadOptions = async ( inputValue: string ): Promise<OptionType[]> =>
    {
        if ( inputValue.trim().length > 0 )
        {
            const response = await agent.Account.search( inputValue );
            return response.map( profile => ( {
                label: profile.userName,
                value: profile.id.toString(),
            } ) );
        }
        return [];
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
                        <input type="date" value={ editTask && editTask.dueDate instanceof Date ? editTask.dueDate.toISOString().split( "T" )[ 0 ] : "" } onChange={ handleDateChange } />
                    </label>
                    <label>
                        People Assigned:
                        <div>
                            { assignedUsers.map( user => (
                                <p key={ user.value } onClick={ () => handleRemoveUser( user.value ) }>
                                    { user.label } (Click to remove)
                                </p>
                            ) ) }
                        </div>
                        <AsyncSelect
                            isMulti
                            cacheOptions
                            defaultOptions
                            loadOptions={ loadOptions }
                            defaultValue={ assignedUsers }
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
