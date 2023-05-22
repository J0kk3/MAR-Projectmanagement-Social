import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../../../app/stores/store";
//Components
import ProjectListItem from "../ProjectListItem/ProjectListItem";

const ProjectList = () =>
{
    const { projectStore } = useStore();
    const { projectsByDate } = projectStore;

    return (
        <div>
            <h1>Projects</h1>
            <>
                { projectsByDate.map( project => (
                    <ProjectListItem key={ project.id } project={ project } />
                ) ) }
            </>
        </div>
    );
};

export default observer( ProjectList );