import { useState, ChangeEvent, FormEvent } from "react";
import { v4 as uuid } from "uuid";
//API Agent
import agent from "../../app/api/agent";
import { Project, Visibility } from "../../app/models/project";

const CreateProjectForm = () =>
{
    const [ project, setProject ] = useState<Project>(
        {
            id: uuid(),
            title: "",
            description: "",
            priority: 0,
            owner: "",
            collaborators: [],
            dueDate: "",
            category: "",
            tags: [],
            visibility: Visibility.Public,
            kanbanBoard:
            {
                id: uuid(),
                projectId: uuid(),
                title: "",
                tasksToDo: [],
                tasksInProgress: [],
                tasksInReview: [],
                tasksDone: [],
            }
        } );

    const handleInputChange = ( event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) =>
    {
        if ( event.target.name === "visibility" )
        {
            setProject( { ...project, [ event.target.name ]: event.target.value as Visibility } );
        }
        else
        {
            setProject( { ...project, [ event.target.name ]: event.target.value } );
        }
    };


    const handleSubmit = ( event: FormEvent<HTMLFormElement> ) =>
    {
        event.preventDefault();
        const newProject = { ...project, id: uuid() };
        agent.Projects.create( newProject );
        console.log( newProject );
    };

    return (
        <div>
            <form onSubmit={ handleSubmit }>
                <label>
                    Title:
                    <input name="title" type="text" value={ project.title } onChange={ handleInputChange } />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={ project.description } onChange={ handleInputChange } />
                </label>
                <label>
                    Priority:
                    <input name="priority" type="number" value={ project.priority } onChange={ ( e ) => setProject( { ...project, priority: parseInt( e.target.value ) } ) } />
                </label>
                <label>
                    Owner:
                    <input name="owner" type="text" value={ project.owner } onChange={ handleInputChange } />
                </label>
                <label>
                    Collaborators:
                    <input name="collaborators" type="text" value={ project.collaborators.join( ", " ) } onChange={ ( e ) => setProject( { ...project, collaborators: e.target.value.split( ", " ) } ) } />
                </label>
                <label>
                    Due date:
                    <input name="dueDate" type="date" value={ project.dueDate } onChange={ handleInputChange } />
                </label>
                <label>
                    Category:
                    <input name="category" type="text" value={ project.category } onChange={ handleInputChange } />
                </label>
                <label>
                    Tags:
                    <input name="tags" type="text" value={ project.tags.join( ", " ) } onChange={ ( e ) => setProject( { ...project, tags: e.target.value.split( ", " ) } ) } />
                </label>
                <label>
                    Visibility:
                    <select name="visibility" value={ project.visibility } onChange={ handleInputChange }>
                        <option value={ Visibility.Public }>Public</option>
                        <option value={ Visibility.Private }>Private</option>
                    </select>
                </label>
                <button type="submit">Create Project</button>
            </form>
        </div>
    );
};

export default CreateProjectForm;