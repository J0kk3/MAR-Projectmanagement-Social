import { ChangeEvent, useState } from "react";

interface Props
{
    placeholder: string;
    name: string;
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

        if ( props.name === "email" )
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
            if ( !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{7,}/.test( e.target.value ) )
            {
                errorMessage = "Password should contain at least one digit, one uppercase letter, one lowercase letter, one special character and should be at least 7 characters long.";
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
        <form>
            <label>{ props.label }</label>
            <input
                { ...props }
                value={ value }
                onChange={ handleChange }
                onBlur={ handleBlur }
            />
            { touched && error ? ( <div>{ error }</div> ) : null }
        </form>
    );
};

export default TextInput;