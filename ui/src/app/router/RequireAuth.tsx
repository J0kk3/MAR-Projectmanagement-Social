import { Navigate, Outlet, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../stores/store";

const RequireAuth = () =>
{
    const { userStore: { isLoggedIn } } = useStore();
    const location = useLocation();

    if ( !isLoggedIn )
    {
        return <Navigate to="/auth" state={ { from: location } } />;
    }

    return <Outlet />;
};

export default observer(RequireAuth);