import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//Types & Models
import { Project } from "../../app/models/project";
//Components
import ProjectList from "../../Components/projects/ProjectList/ProjectList";
import { useStore } from "../../app/stores/store";

const ProjectOverview = () =>
{
    //TODO: Action buttons( clear link to create a new project)
    //TODO: View a specific project
    //TODO: All Upcoming Milestones on all projects?
    //TODO: list all projects(<ProjectList/>)
    //TODO: list the team members? or seperate view?
    //TODO: progress bar or chart (visual representation of how much of the project has been completed)
    //TODO: Discussion or comments section?

    const [ initialProjects, setInitialProjects ] = useState<Project[]>( [] );

    const { projectStore } = useStore();
    const { deleteProject } = projectStore;

    useEffect( () =>
    {
        projectStore.loadProjects();
    }, [ projectStore ] );

    const navigate = useNavigate();

    // Fetch initial projects data
    // useEffect( () =>
    // {
    //     axios.get<Project[]>( "http://localhost:5000/api/projects" )
    //         .then( res =>
    //         {
    //             setInitialProjects( res.data );
    //         } );
    // }, [] );

    // Placeholder function for creating a new project
    const createNewProject = () =>
    {
        // TODO: Implement create new project functionality
        navigate( "/create-project" );
    };

    return (
        <div className="project-overview">
            <h1>Project Overview</h1>

            <div className="action-buttons">
                {/* TODO: Implement action button functionality */ }
                <button onClick={ createNewProject }>Create New Project</button>
            </div>

            <div className="project-list">
                {/* TODO: Fetch and list all projects */ }
                <ProjectList />
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

export default ProjectOverview;