import { ChangeEvent, SyntheticEvent, useState } from "react";
import { observer } from "mobx-react-lite";
//API Agent
import agent from "../../../app/api/agent";
//Types & Models
import { Project } from "../../../app/models/project";
//Stores
import { useStore } from "../../../app/stores/store";
//Styles
import "./ProjectListItem.scss";

interface Props
{
    project: Project;
}

const ProjectListItem = ( { project }: Props ) =>
{
    const { projectStore } = useStore();
    const { deleteProject, openForm, closeForm, editMode, editProjectId, loadProjects, updateProject } = projectStore;

    const [ editedProject, setEditedProject ] = useState<Project>( { ...project } );

    const handleInputChange = ( event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) =>
    {
        setEditedProject( { ...editedProject, [ event.target.name ]: event.target.value } );
    };

    const handleProjectDelete = ( e: SyntheticEvent<HTMLButtonElement>, id: string ) =>
    {
        e.preventDefault();
        deleteProject( id );
    };

    const handleEdit = () =>
    {
        if ( editMode && editProjectId === project.id )
        {
            updateProject( editedProject );
        }
        else
        {
            openForm( project.id );
            setEditedProject( project );
        }
    };

    const handleCancel = () =>
    {
        closeForm();
        setEditedProject( project );
    };

    return (
        <div className="card" key={ project.id }>
            <ul>
                { editMode && editProjectId === project.id ? (
                    <>
                        <li>
                            <input className="input-field" name="title" value={ editedProject.title } onChange={ handleInputChange } />
                        </li>
                        <li>
                            <input className="input-field" name="description" value={ editedProject.description } onChange={ handleInputChange } />
                        </li>
                        <li>
                            <input className="input-field" name="priority" value={ editedProject.priority } onChange={ handleInputChange } />
                        </li>
                        <li>
                            <input className="input-field" name="owner" value={ editedProject.owner } onChange={ handleInputChange } />
                        </li>
                        <li>
                            <input className="input-field" name="collaborators" value={ editedProject.collaborators } onChange={ handleInputChange } />
                        </li>
                        <li>
                            <input className="input-field" name="dueDate" value={ editedProject.dueDate.toISOString() } onChange={ handleInputChange } />
                        </li>
                        <li>
                            <input className="input-field" name="category" value={ editedProject.category } onChange={ handleInputChange } />
                        </li>
                        <li>
                            <input className="input-field" name="tags" value={ editedProject.tags } onChange={ handleInputChange } />
                        </li>
                        <li>
                            <input className="input-field" name="visibility" value={ editedProject.visibility } onChange={ handleInputChange } />
                        </li>
                    </>
                ) : (
                    <>
                        <li>{ "Title: " + project.title }</li>
                        <li>{ "Description: " + project.description }</li>
                        <li>{ "Priority: " + project.priority }</li>
                        <li>{ "Owner: " + project.owner }</li>
                        <li>{ "Collaborators: " + project.collaborators }</li>
                        <li>{ "Due date: " + project.dueDate }</li>
                        <li>{ "Category: " + project.category }</li>
                        <li>{ "Tags: " + project.tags }</li>
                        <li>{ "Visibility: " + project.visibility }</li>
                    </>
                ) }
            </ul>
            { editMode && editProjectId === project.id ? (
                <>
                    <button className="button save" onClick={ handleEdit }>Save</button>
                    <button className="button cancel" onClick={ handleCancel }>Cancel</button>
                </>
            ) : (
                <>
                    <button className="button edit" onClick={ handleEdit }>Edit</button>
                    <button className="button delete" onClick={ ( e ) => handleProjectDelete( e, project.id ) }>Delete</button>
                </>
            ) }
        </div>
    );
};

export default observer( ProjectListItem );