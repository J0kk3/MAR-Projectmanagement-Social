import { ChangeEvent, SyntheticEvent, useState } from "react";
import { observer } from "mobx-react-lite";
import ObjectID from "bson-objectid";
//Types & Models
import { Project } from "../../../app/models/project";
//Stores
import { useStore } from "../../../app/stores/store";
//Styles
import "./ProjectListItem.scss";

interface Props
{
    project: Project;
    onSelectProject?: ( id: ObjectID ) => void;
}

const ProjectListItem = ( { project, onSelectProject }: Props ) =>
{
    const { projectStore } = useStore();
    const { deleteProject, openForm, closeForm, editMode, editProjectId, loadProjects, updateProject } = projectStore;

    const [ editedProject, setEditedProject ] = useState<Project>( { ...project } );

    const ISO_DATE_LENGTH = 10; //YYYY-MM-DD is 10 characters long

    const handleInputChange = ( event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) =>
    {
        setEditedProject( { ...editedProject, [ event.target.name ]: event.target.value } );
    };

    const handleProjectDelete = ( e: SyntheticEvent<HTMLButtonElement>, id: ObjectID ) =>
    {
        e.preventDefault();
        e.stopPropagation();
        deleteProject( id );
    };

    const handleEdit = ( e: SyntheticEvent ) =>
    {
        e.stopPropagation();
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

    const handleCancel = ( e: SyntheticEvent ) =>
    {
        e.stopPropagation();
        closeForm();
        setEditedProject( project );
    };

    const handleSelect = () =>
    {
        if ( onSelectProject && project.id )
        {
            onSelectProject( project.id );
        }
    };


    return (
        <div onClick={ handleSelect } className="card details-click">
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
                        <li>{ "Due date: " + project.dueDate.toISOString().slice( 0, ISO_DATE_LENGTH ) }</li>
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
                    <button className="button delete" onClick={ ( e ) => project.id && handleProjectDelete( e, project.id ) }>Delete</button>
                </>
            ) }
        </div>
    );
};

export default observer( ProjectListItem );