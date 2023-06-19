interface Errors
{
    email?: string;
    password?: string;
}

interface Props
{
    errors: Errors;
}

const ErrorMessage = ( { errors }: Props ) =>
{
    if ( !errors.email && !errors.password )
    {
        return null;
    }

    return (
        <div>
            { errors.email && <div>{ errors.email }</div> }
            { errors.password && <div>{ errors.password }</div> }
        </div>
    );
};

export default ErrorMessage;