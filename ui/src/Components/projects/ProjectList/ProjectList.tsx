import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../../../app/stores/store";
//Components
import ProjectListItem from "../ProjectListItem/ProjectListItem";

interface Props
{
    onSelectProject?: ( id: string ) => void;
}
const ProjectList = ( { onSelectProject }: Props ) =>
{
    const { projectStore } = useStore();
    const { projectsByDate } = projectStore;

    return (
        <div>
            <h1>Projects</h1>
            <>
                { projectsByDate.map( project => (
                    <ProjectListItem key={ project.id } project={ project } onSelectProject={ onSelectProject } />
                ) ) }
            </>
        </div>
    );
};

export default observer( ProjectList );