import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
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
    const { deleteProject, selectProject, selectedProject } = projectStore;

    const ISO_DATE_LENGTH = 10; //YYYY-MM-DD is 10 characters long

    useEffect( () =>
    {
        projectStore.loadProjects();
    }, [ projectStore ] );

    const navigate = useNavigate();

    const createNewProject = () =>
    {
        navigate( "/create-project" );
    };

    const onSelectProject = ( project: Project ) =>
    {
        selectProject( project.id );
    };

    return (
        <div className="project-overview">
            <h1>Project Overview</h1>

            <div className="action-buttons">
                <button onClick={ createNewProject }>Create New Project</button>
            </div>

            <div className="project-list">
                <ProjectList />
            </div>

            <div className="project-details">
                {/* Display details of selected project */ }
                { selectedProject && (
                    <div>
                        <h2>{ selectedProject.title }</h2>
                        <p>{ selectedProject.description }</p>
                        <p>{ selectedProject.priority }</p>
                        <p>{ selectedProject.owner }</p>
                        <p>{ selectedProject.collaborators }</p>
                        <p>{ selectedProject.dueDate.toISOString().slice( 0, ISO_DATE_LENGTH ) }</p>
                        <p>{ selectedProject.category }</p>
                        <p>{ selectedProject.tags }</p>
                        <p>{ selectedProject.visibility }</p>
                        <p>{ selectedProject.status }</p>
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