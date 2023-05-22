
import { observer } from "mobx-react-lite";
//API Agent
import agent from "../../../app/api/agent";
//Stores
import { useStore } from "../../../app/stores/store";
//Models & Types

const ProjectList = () =>
{
    const { projectStore } = useStore();
    const { projects, deleteProject } = projectStore;

    return (
        <div>
            <h1>Projects</h1>
            <>
                { projects.map( project => (
                    <div key={ project.id }>
                        <ul>
                            <li>{ "Title: " + project.title }</li>
                            <li>{ "Description: " + project.description }</li>
                            <li>{ "Priority: " + project.priority }</li>
                            <li>{ "Owner: " + project.owner }</li>
                            <li>{ "Collaborators: " + project.collaborators }</li>
                            <li>{ "Due date: " + project.dueDate }</li>
                            <li>{ "Category: " + project.category }</li>
                            <li>{ "Tags: " + project.tags }</li>
                            <li>{ "Visibility: " + project.visibility }</li>
                        </ul>
                    </div>
                ) ) }
            </>
        </div>
    );
};

export default observer( ProjectList );