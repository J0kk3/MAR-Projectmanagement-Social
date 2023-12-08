import { makeAutoObservable, runInAction } from "mobx";
//Router
import { Router } from "../router/Routes";
//Stores
import { store } from "./store";
import agent from "../api/agent";
//Types & Models
import { User, UserFormValues } from "../models/user";
import ObjectID from "bson-objectid";

export default class UserStore
{
    user: User | null = null;
    userId: ObjectID | null = null;

    constructor ()
    {
        makeAutoObservable( this );
    }

    get isLoggedIn ()
    {
        return !!this.user;
    }

    login = async ( creds: UserFormValues ) =>
    {
        try
        {
            const user = await agent.Account.login( creds );
            store.commonStore.setToken( user.token );
            //Set the user in the store
            runInAction( () =>
            {
                this.user = user;
                this.userId = user.id;
            } );
            Router.navigate( "/dashboard" );
        }
        catch ( err )
        {
            console.log( err );
        }
    };

    register = async ( creds: UserFormValues ) =>
    {
        try
        {
            const user = await agent.Account.register( creds );
            store.commonStore.setToken( user.token );
            //Set the user in the store
            runInAction( () =>
            {
                this.user = user;
                this.userId = user.id;
            } );
            Router.navigate( "/dashboard" );
        }
        catch ( err )
        {
            console.log( err );
        }
    };


    logout = () =>
    {
        store.commonStore.setToken( null );
        this.user = null;
        this.userId = null;
        Router.navigate( "/auth" );
    };

    getUser = async () =>
    {
        try
        {
            const user = await agent.Account.current();
            store.commonStore.setToken( user.token );
            runInAction( () =>
            {
                this.user = user;
                this.userId = user.id;
            } );
        }
        catch ( err )
        {
            console.log( err );
        }
    };
}