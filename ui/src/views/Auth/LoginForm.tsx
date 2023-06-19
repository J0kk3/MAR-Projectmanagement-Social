import { useState, FormEvent } from "react";
//Stores
import { useStore } from "../../app/stores/store";
//Components
import TextInput from "../../Components/Form/TextInput";
import { observer } from "mobx-react-lite";
import ErrorMessage from "../../Components/Form/ErrorMessage";

const LoginForm = () =>
{
    const { userStore } = useStore();

    const [ email, setEmail ] = useState( "" );
    const [ password, setPassword ] = useState( "" );

    const [ errors, setErrors ] = useState( { email: "", password: "" } );


    const handleEmailChange = ( newEmail: string, error: string ) =>
    {
        setEmail( newEmail );
        setErrors( errors => ( { ...errors, email: error } ) );
    };

    const handlePasswordChange = ( newPassword: string, error: string ) =>
    {
        setPassword( newPassword );
        setErrors( errors => ( { ...errors, password: error } ) );
    };

    const handleSubmit = ( e: FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        userStore.login( { email, password } );
    };

    return (
        <form onSubmit={ handleSubmit }>
            <h1>LoginForm</h1>
            <TextInput name="Email" placeholder="Email" value={ email } onChange={ handleEmailChange } />
            <TextInput name="Password" placeholder="Password" type="password" value={ password } onChange={ handlePasswordChange } />
            <ErrorMessage errors={ errors } />
            <button type="submit">Login</button>
        </form>
    );
};

export default observer( LoginForm );