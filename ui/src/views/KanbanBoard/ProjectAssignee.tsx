import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
//Models & Types
import { Profile } from "../../app/models/profile";

interface Props
{
    assignees: Profile[];
}

const ProjectAssignee = ( { assignees = [] }: Props ) =>
{
    const navigate = useNavigate();

    const handleNavigateToUserProfile = ( userName: string ) =>
    {
        navigate( `/profile/${ userName }` );
    };

    return (
        <div className="project-assignee">
            { assignees.map( assignee => (
                <div key={ assignee.userName } onClick={ () => handleNavigateToUserProfile(assignee.userName) } className="project-assignee__item">
                    <p>{ assignee.userName }</p>
                </div>
            ) ) }
        </div>
    );
};

export default observer( ProjectAssignee );