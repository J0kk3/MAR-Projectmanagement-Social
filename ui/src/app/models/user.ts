export interface User
{
    id: number;
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