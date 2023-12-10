import { useEffect, useState } from "react";
import { Task } from "../../../app/models/project";
import agent from "../../../app/api/agent";

interface Props
{
    task: Task;
    handleDelete: ( task: Task ) => void;
    handleEdit: ( task: Task ) => void;
}

const TaskDetails = ( { task, handleDelete, handleEdit }: Props ) =>
{
    const [ assignedUserNames, setAssignedUserNames ] = useState<string[]>( [] );

    useEffect( () =>
    {
        const fetchUserNames = async () =>
        {
            const userNames = await Promise.all(
                task.peopleAssigned.map( id =>
                    agent.Account.getUserDetails( id.toString() )
                )
            );
            setAssignedUserNames( userNames.map( user => user.userName ) );
        };

        fetchUserNames();
    }, [ task ] );

    return (
        <div>
            <h2>{ task.name }</h2>
            <p>Assigned: {assignedUserNames.join(", ")}</p>
            <p>{ task.description }</p>
            <button onClick={ () => handleEdit( task ) }>Edit</button>
            <button onClick={ () => handleDelete( task ) }>Delete</button>
        </div>
    );
};

export default TaskDetails;