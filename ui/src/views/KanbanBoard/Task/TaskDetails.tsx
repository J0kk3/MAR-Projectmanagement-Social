import { Task } from "../../../app/models/project";

interface Props
{
    task: Task;
    handleDelete: ( task: Task ) => void;
    handleEdit: ( task: Task ) => void;
}

const TaskDetails = ( { task, handleDelete, handleEdit }: Props ) =>
{
    return (
        <div>
            <h2>{ task.name }</h2>
            <p>{ task.description }</p>
            <button onClick={ () => handleEdit( task ) }>Edit</button>
            <button onClick={ () => handleDelete( task ) }>Delete</button>
        </div>
    );
};

export default TaskDetails;