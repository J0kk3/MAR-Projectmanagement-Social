import { ChangeEvent, useState } from "react";

interface Props
{
    placeholder: string;
    name: string;
    password?: string;
    label?: string;
    value?: string;
    type?: string;
    onChange: ( value: string, error: string ) => void;
}

const TextInput = ( props: Props ) =>
{
    const [ value, setValue ] = useState( props.value );
    const [ error, setError ] = useState( "" );
    const [ touched, setTouched ] = useState( false );

    const handleChange = ( e: ChangeEvent<HTMLInputElement> ) =>
    {
        setValue( e.target.value );

        let errorMessage = "";

        if ( props.name === "username" )
        {
            // Validation for username
            if ( /\s/.test( e.target.value ) )
            {
                // Validation for username
                if ( /\s/.test( e.target.value ) )
                {
                    errorMessage = "Username should not contain any spaces.";
                }
                // Check for disallowed special characters
                else if ( !/^[a-zA-Z0-9åäö_-]+$/.test( e.target.value ) )
                {
                    errorMessage = "Username can only contain letters, numbers, å, ä, ö, underscore, and dash.";
                }
            }
        }

        else if ( props.name === "email" )
        {
            // Validation for email
            if ( !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test( e.target.value ) )
            {
                errorMessage = "Please enter a valid email address.";
            }
        }
        else if ( props.name === "password" )
        {
            // Validation for password
            // Validation for password
            if ( !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+[\]{};:'",<.>/?]).{7,}/.test( e.target.value ) )
            {
                errorMessage = "Password should contain at least one digit, one uppercase letter, one lowercase letter, one special character and should be at least 7 characters long.";
            }
        }
        else if ( props.name === "confirmPassword" )
        {
            // Validation for password confirmation
            if ( e.target.value !== props.password )
            {
                errorMessage = "Passwords don't match.";
            }
        }

        setError( errorMessage );
        props.onChange( e.target.value, errorMessage );
    };

    const handleBlur = () =>
    {
        setTouched( true );
    };

    return (
        <div>
            <label>{ props.label }</label>
            <input
                { ...props }
                value={ value }
                onChange={ handleChange }
                onBlur={ handleBlur }
            />
            { touched && error ? ( <div>{ error }</div> ) : null }
        </div>
    );
};

export default TextInput;