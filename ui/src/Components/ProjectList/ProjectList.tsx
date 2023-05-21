import { useEffect, useState } from "react";
//API Agent
import agent from "../../app/api/agent";
//Models & Types
import { Project } from "../../app/models/project";

interface Props
{
    initialProjects: Project[];
}

const ProjectList = ( { initialProjects }: Props ) =>
{
    const [ projects, setProjects ] = useState<Project[]>( initialProjects );

    useEffect( () =>
    {
        agent.Projects.list()
            .then( res =>
            {
                setProjects( res );
            } );
    }, [] );

    return (
        <div>
            <h1>Projects</h1>
            <>
                { projects.map( project => (
                    <ul key={ project.id }>
                        <li>{ project.title }</li>
                        <li>{ project.description }</li>
                        <li>{ project.priority }</li>
                        <li>{ project.owner }</li>
                        <li>{ project.collaborators }</li>
                        <li>{ project.dueDate }</li>
                        <li>{ project.category }</li>
                        <li>{ project.tags }</li>
                        <li>{ project.visibility }</li>
                    </ul>
                ) ) }
            </>
        </div>
    );
};

export default ProjectList;