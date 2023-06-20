interface Errors
{
    username?: string;
    email?: string;
    password?: string;
}

interface Props
{
    errors: Errors;
}

const ErrorMessage = ( { errors }: Props ) =>
{
    if ( !errors.email && !errors.password && !errors.username )
    {
        return null;
    }

    return (
        <div>
            { errors.email && <div>{ errors.email }</div> }
            { errors.password && <div>{ errors.password }</div> }
            { errors.username && <div>{ errors.username }</div> }
        </div>
    );
};

export default ErrorMessage;