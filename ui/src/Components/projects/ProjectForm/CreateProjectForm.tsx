import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ObjectID from "bson-objectid";
import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../../../app/stores/store";
import agent from "../../../app/api/agent";
//Types & Models
import { Project, ProjectStatus, Visibility } from "../../../app/models/project";
import { Profile } from "../../../app/models/profile";
//Components
import CollaboratorSelection from "./CollaboratorSelection";

type OptionType =
    {
        label: string;
        value: string;
    };


const CreateProjectForm = () =>
{
    const { projectStore, userStore } = useStore();
    const { createProject } = projectStore;
    const { user, getUser } = userStore;
    const [ collaborators, setCollaborators ] = useState<Profile[]>( [] );


    const navigate = useNavigate();

    const [ project, setProject ] = useState<Project>(
        {
            title: "",
            description: "",
            priority: 0,
            owner:
            {
                id: user!.id!,
                userName: user!.userName!
            },
            collaborators: [],
            dueDate: new Date(),
            category: "",
            tags: [],
            visibility: Visibility.Public,
            status: ProjectStatus.Active,
            kanbanBoard:
            {
                title: "",
                tasks: [],
            }
        } );

    useEffect( () =>
    {
        getUser();
    }, [ getUser ] );

    // Length of "YYYY-MM-DD" is 10
    const ISO_DATE_LENGTH = 10;

    const handleInputChange = ( event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) =>
    {
        if ( event.target.name === "dueDate" )
        {
            const newDate = new Date( event.target.value );
            if ( !isNaN( newDate.getTime() ) )
            {
                // Check if the date is valid
                setProject( { ...project, dueDate: newDate } );
            }
        }
        else
        {
            setProject( { ...project, [ event.target.name ]: event.target.value } );
        }
    };

    const handleSubmit = async ( event: FormEvent<HTMLFormElement> ) =>
    {
        event.preventDefault();

        // const newProject = { ...project, kanbanBoard: { ...project.kanbanBoard } };
        // const newProject = { ...project, owner: user!.id, kanbanBoard: { ...project.kanbanBoard } };

        // Extract ownerId from the user profile and other project properties
        const ownerId = user!.id;
        const projectData =
        {
            ...project,
            ownerId,
            kanbanBoard: { ...project.kanbanBoard },
        };

        try
        {
            // Create project using API call
            await createProject( projectData );
            console.log( "Project created successfully:", projectData );

            // Re-fetch projects list
            await projectStore.loadProjects();

            // After creating the project, fetch its details
            navigate( "/projects" );
        }
        catch ( error )
        {
            console.error( "Failed to create project:", error );
        }
    };

    const loadOptions = async ( inputValue: string ) =>
    {
        const response: Profile[] = await agent.Account.search( inputValue );

        const options: OptionType[] = response.map( profile => (
            {
                label: profile.userName,
                value: profile.id.toString(),
            } ) );

        return options;
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
                    <p>{ "Owner: " + user!.userName.toString() }</p>
                </label>
                <label>
                    Collaborators:
                    <CollaboratorSelection
                        loadOptions={ loadOptions }
                        onChange={ async ( selected ) =>
                        {
                            if ( selected )
                            {
                                // Fetch the complete Profile data for the selected collaborators
                                const selectedProfiles = await Promise.all(
                                    selected.map( ( option ) => agent.Account.getUserDetails( option.value ) )
                                );

                                // update state
                                setCollaborators( selectedProfiles );

                                setProject(
                                    {
                                        ...project,
                                        collaborators: selectedProfiles,
                                    } );
                            }
                            else
                            {
                                // update state
                                setCollaborators( [] );

                                setProject( { ...project, collaborators: [] } );
                            }
                        } }
                        value={ project.collaborators.map( ( collab: any ) =>
                        (
                            {
                                label: collab.userName,
                                value: collab.id.toString(),
                            } ) ) }
                    />
                </label>
                <label>
                    Due date:
                    <input name="dueDate" type="date" value={ project.dueDate instanceof Date ? project.dueDate.toISOString().slice( 0, ISO_DATE_LENGTH ) : "" } onChange={ handleInputChange } />
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

export default observer( CreateProjectForm );