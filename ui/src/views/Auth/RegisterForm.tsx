import { useState, FormEvent } from "react";
import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../../app/stores/store";
//Components
import TextInput from "../../Components/Form/TextInput";
import ErrorMessage from "../../Components/Form/ErrorMessage";

const RegisterForm = () =>
{
    const { userStore } = useStore();

    const [ userName, setUserName ] = useState( "" );
    const [ email, setEmail ] = useState( "" );
    const [ password, setPassword ] = useState( "" );
    const [ confirmPassword, setConfirmPassword ] = useState( "" );

    const [ errors, setErrors ] = useState( { email: "", password: "" } );

    const handleUsernameChange = ( newUsername: string, error: string ) =>
    {
        setUserName( newUsername );
        setErrors( errors => ( { ...errors, username: error } ) );
    };

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

    const handleConfirmPasswordChange = ( value: string, error: string ) =>
    {
        setConfirmPassword( value );
    };

    const handleSubmit = ( e: FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        userStore.register( { email, password, userName } );
    };

    return (
        <form onSubmit={ handleSubmit }>
            <h1>LoginForm</h1>
            <TextInput name="Email" placeholder="Email" value={ email } onChange={ handleEmailChange } />
            <TextInput name="Password" placeholder="Password" type="password" value={ password } onChange={ handlePasswordChange } />
            <TextInput name="confirmPassword" placeholder="Confirm Password" type="password" value={ confirmPassword } onChange={ handleConfirmPasswordChange } password={ password } />
            <TextInput name="Username" placeholder="User Name" value={ userName } onChange={ handleUsernameChange } />
            <ErrorMessage errors={ errors } />
            <button type="submit" disabled={ Object.values( errors ).some( error => error !== "" ) || !email || !password || !userName || !confirmPassword }>Register</button>
        </form>
    );
};

export default observer( RegisterForm );