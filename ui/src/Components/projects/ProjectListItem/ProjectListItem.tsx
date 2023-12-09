import { ChangeEvent, SyntheticEvent, useState } from "react";
import { observer } from "mobx-react-lite";
import ObjectID from "bson-objectid";
//Types & Models
import { Project } from "../../../app/models/project";
import { Profile } from "../../../app/models/profile";
//Stores
import agent from "../../../app/api/agent";
import { useStore } from "../../../app/stores/store";
//Components
import CollaboratorSelection from "../ProjectForm/CollaboratorSelection";
//Styles
import "./ProjectListItem.scss";

type OptionType =
    {
        label: string;
        value: string;
    };

const profileToOptionType = ( profile: Profile ): OptionType => (
    {
        label: profile.userName,
        value: profile.id.toString(), // convert the id to string
    } );

interface Props
{
    project: Project;
    onSelectProject?: ( id: ObjectID ) => void;
}

const ProjectListItem = ( { project, onSelectProject }: Props ) =>
{
    const { projectStore, commonStore } = useStore();
    const { deleteProject, openForm, closeForm, editMode, editProjectId, loadProjects, updateProject } = projectStore;
    const { appLoaded } = commonStore;

    const [ editedProject, setEditedProject ] = useState<Project>( { ...project } );


    const ISO_DATE_LENGTH = 10; //YYYY-MM-DD is 10 characters long

    // const handleInputChange = ( event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) =>
    // {
    //     setEditedProject( { ...editedProject, [ event.target.name ]: event.target.value } );
    // };
    const handleInputChange = ( event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) =>
    {
        // Exclude 'owner' from being updated directly
        if ( event.target.name !== "owner" )
        {
            setEditedProject( { ...editedProject, [ event.target.name ]: event.target.value } );
        }
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

    const handleCollaboratorsChange = async ( newCollaborators: readonly OptionType[] | null | undefined ) =>
    {
        if ( newCollaborators )
        {
            const collaboratorProfiles: Profile[] = await Promise.all( newCollaborators.map( async ( collab ) =>
            {
                return await agent.Account.getUserDetails( collab.value );
            } ) );
            setEditedProject( { ...editedProject, collaborators: collaboratorProfiles } );
        }
        else
        {
            setEditedProject( { ...editedProject, collaborators: [] } );
        }
    };

    const loadOptions = async ( inputValue: string ): Promise<OptionType[]> =>
    {
        const profiles: Profile[] = await agent.Account.search( inputValue );
        return profiles.map( profileToOptionType );
    };

    if ( !appLoaded )
    {
        return <div>Loading Projects...</div>;
    }

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
                            <p className="display-field">{ "Owner: " + ( editedProject.owner ? editedProject.owner.userName : "No owner assigned" ) }</p>
                        </li>
                        <li>
                            <CollaboratorSelection
                                value={ editedProject.collaborators.map( profileToOptionType ) }
                                onChange={ handleCollaboratorsChange }
                                loadOptions={ loadOptions }
                            />
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
                        <li>{ "Owner: " + ( project.owner ? project.owner.userName : "No owner assigned" ) }</li>
                        <li> { "Collaborators: " + ( project.collaborators ? project.collaborators.map( c => c.userName ).join( ", " ) : "None" ) } </li>
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