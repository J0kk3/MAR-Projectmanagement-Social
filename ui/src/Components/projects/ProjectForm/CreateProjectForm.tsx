import { useState, ChangeEvent, FormEvent } from "react";
import { v4 as uuid } from "uuid";
//Stores
import { useStore } from "../../../app/stores/store";
//Types & Models
import { Project, ProjectStatus, Visibility } from "../../../app/models/project";

const CreateProjectForm = () =>
{
    const { projectStore } = useStore();
    const { selectedProject, closeForm, createProject, updateProject } = projectStore;

    const projectId = uuid();
    const kanbanBoardId = uuid();
    const [ project, setProject ] = useState<Project>(
        {
            id: projectId,
            title: "",
            description: "",
            priority: 0,
            owner: "",
            collaborators: [],
            dueDate: new Date(),
            category: "",
            tags: [],
            visibility: Visibility.Public,
            status: ProjectStatus.Active,
            kanbanBoardId: kanbanBoardId,
            kanbanBoard:
            {
                id: kanbanBoardId,
                projectId: projectId,
                title: "",
                tasksToDo: [],
                tasksInProgress: [],
                tasksInReview: [],
                tasksDone: [],
            }
        } );
        // Length of "YYYY-MM-DD" is 10
        const ISO_DATE_LENGTH = 10;

    const handleInputChange = ( event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) =>
    {
        if ( event.target.name === "visibility" )
        {
            setProject( { ...project, [ event.target.name ]: Number( event.target.value ) as Visibility } );
        }
        else if ( event.target.name ==="dueDate")
        {
            setProject( { ...project, [ event.target.name ]: new Date( event.target.value ) } );
        }
        else
        {
            setProject( { ...project, [ event.target.name ]: event.target.value } );
        }
    };


    const handleSubmit = ( event: FormEvent<HTMLFormElement> ) =>
    {
        event.preventDefault();
        createProject( project );
        console.log( project );

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
                    <input name="dueDate" type="date" value={ project.dueDate.toISOString().slice(0, ISO_DATE_LENGTH) } onChange={ handleInputChange } />
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
                        <option value={ Visibility.Public }>{ Visibility[ Visibility.Public ] }</option>
                        <option value={ Visibility.Private }>{ Visibility[ Visibility.Private ] }</option>
                    </select>
                </label>
                <button type="submit">Create Project</button>
            </form>
        </div>
    );
};

export default CreateProjectForm;