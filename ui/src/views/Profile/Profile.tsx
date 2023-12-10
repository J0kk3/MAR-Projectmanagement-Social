import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../../app/stores/store";

const Profile = () =>
{
    const { userStore } = useStore();
    const { user } = userStore;

    //get the bio from the current users profile profile the user in the store both have ObjectId

    return (
        <div>
            <h1>Profile</h1>
            <p>{user?.userName}</p>
            {/* <p>{profile bio}</p> */}
        </div>
    );
};

export default observer(Profile);