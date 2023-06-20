import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../../app/stores/store";
//Components
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const Auth = () =>
{
    // const { userStore, commonStore } = useStore();

    const [ isRegistering, setIsRegistering ] = useState( false );

    const toggleForm = () =>
    {
        setIsRegistering( !isRegistering );
    };

    // useEffect( () =>
    // {
    //     if ( commonStore.token )
    //     {
    //         userStore.getUser().finally( () => commonStore.setAppLoaded() );
    //     }
    //     else
    //     {
    //         commonStore.setAppLoaded();
    //     }
    // }, [ commonStore, userStore ] );

    return (
        <>
            <h1>Welcome to Project Managment!</h1>
            { isRegistering ? <RegisterForm /> : <LoginForm /> }
            <button onClick={ toggleForm }>{ isRegistering ? "Go to Login" : "Go to Register" }</button>
        </>
    );
};

export default observer( Auth );