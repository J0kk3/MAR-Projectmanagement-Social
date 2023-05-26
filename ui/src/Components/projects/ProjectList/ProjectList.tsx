import { observer } from "mobx-react-lite";
import ObjectID from "bson-objectid";
import { v4 as uuid } from "uuid";
//Stores
import { useStore } from "../../../app/stores/store";
//Components
import ProjectListItem from "../ProjectListItem/ProjectListItem";

interface Props
{
    onSelectProject?: ( id: ObjectID ) => void;
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
                    <ProjectListItem key={ uuid() } project={ project } onSelectProject={ onSelectProject } />
                ) ) }
            </>
        </div>
    );
};

export default observer( ProjectList );