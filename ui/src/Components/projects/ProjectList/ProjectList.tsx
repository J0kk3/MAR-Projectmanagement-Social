import { observer } from "mobx-react-lite";
import ObjectID from "bson-objectid";
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
                { projectsByDate.map( project =>
                {
                    // Check if project.id is defined and not null
                    if ( project.id )
                    {
                        return <ProjectListItem key={ project.id.toString() } project={ project } onSelectProject={ onSelectProject } />;
                    }

                    return null;
                } ) }
            </>
        </div>
    );
};

export default observer( ProjectList );