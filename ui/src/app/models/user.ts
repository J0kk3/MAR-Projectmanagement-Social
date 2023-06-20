export interface User
{
    id: string;
    userName: string;
    token: string;
    image?: string;
}

export interface UserFormValues
{
    email: string;
    password: string;
    userName?: string;
}