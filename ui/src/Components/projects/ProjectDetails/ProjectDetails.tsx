import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../../../app/stores/store";

const ProjectDetails = () =>
{
    const { projectStore } = useStore();
    const { selectedProject, openForm, cancelSelectedProject } = projectStore;

    if ( !selectedProject ) return null;

    return (
        <div>
            <h1>Project Details</h1>
        </div>
    );
};

export default observer(ProjectDetails);