import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ObjectID from "bson-objectid";
//Types & Models
import { Project } from "../../app/models/project";
//Components
import ProjectList from "../../Components/projects/ProjectList/ProjectList";
import { useStore } from "../../app/stores/store";
//Styles
import "./ProjectOverview.scss";

const ProjectOverview = () =>
{
    //TODO: Action buttons( clear link to create a new project)
    //TODO: View a specific project
    //TODO: All Upcoming Milestones on all projects?
    //TODO: list all projects(<ProjectList/>)
    //TODO: list the team members? or seperate view?
    //TODO: progress bar or chart (visual representation of how much of the project has been completed)
    //TODO: Discussion or comments section?

    const { projectStore } = useStore();
    const { loadProjects } = projectStore;

    const [ localSelectedProject, setLocalSelectedProject ] = useState<Project | undefined>( undefined );


    const ISO_DATE_LENGTH = 10; //YYYY-MM-DD is 10 characters long

    useEffect( () =>
    {
        loadProjects();
    }, [ loadProjects ] );

    const navigate = useNavigate();

    const createNewProject = () =>
    {
        navigate( "/create-project" );
    };

    const onSelectProject = ( id: ObjectID ) =>
    {
        const project = projectStore.projectsByDate.find( project => project.id === id );
        setLocalSelectedProject( project );
    };

    const deselectProject = () =>
    {
        setLocalSelectedProject( undefined );
    };

    return (
        <div className="project-overview">
            <h1>Project Overview</h1>

            <div className="action-buttons">
                <button onClick={ createNewProject }>Create New Project</button>
            </div>

            <div className="project-list">
                <ProjectList onSelectProject={ onSelectProject } />
            </div>

            <div className={ `project-details card ${ localSelectedProject ? "active" : "" }` }>
                { localSelectedProject && (
                    <div>
                        <h2>{ localSelectedProject.title }</h2>
                        <p>{ localSelectedProject.description }</p>
                        <p>{ localSelectedProject.priority }</p>
                        <p>{ localSelectedProject.owner }</p>
                        <p>{ localSelectedProject.collaborators }</p>
                        <p>{ localSelectedProject.dueDate.toISOString().slice( 0, ISO_DATE_LENGTH ) }</p>
                        <p>{ localSelectedProject.category }</p>
                        <p>{ localSelectedProject.tags }</p>
                        <p>{ localSelectedProject.visibility }</p>
                        <p>{ localSelectedProject.status }</p>
                        <button className="button cancel" onClick={ deselectProject }>Deselect</button>
                        <Link className="kanban-link" to={ `/kanbanboard/${ localSelectedProject.id }` }><button>Go to Kanban</button></Link>
                    </div>
                ) }
            </div>

            <div className="upcoming-milestones">
                {/* TODO: Fetch and display upcoming milestones */ }
                <p>Placeholder for Upcoming Milestones</p>
            </div>

            <div className="team-members">
                {/* TODO: Fetch and list team members */ }
                <p>Placeholder for Team Members</p>
            </div>

            <div className="project-progress">
                {/* TODO: Fetch and display project progress */ }
                <p>Placeholder for Project Progress</p>
            </div>

            <div className="project-discussion">
                {/* TODO: Implement discussion or comments section */ }
                <p>Placeholder for Project Discussion</p>
            </div>
        </div>
    );
};

export default observer( ProjectOverview );