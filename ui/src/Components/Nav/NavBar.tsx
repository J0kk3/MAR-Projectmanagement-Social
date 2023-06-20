import { NavLink, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../../app/stores/store";
//Styles
import "./NavBar.scss";

const NavBar = () =>
{
    const { userStore: { user, logout } } = useStore();

    if ( !user ) return null;

    return (
        <header>
            <section>
                <Link to="/" className="padding" >
                    <img className="logo" src="/favicon.svg" alt="logo" />
                </Link>
                <h1>Project Management</h1>
            </section>
            <nav>
                <ul>
                    <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                    <li><NavLink to="/profile">Profile</NavLink></li>
                    <li><NavLink to="/projects">Projects Overview</NavLink></li>
                    <li><NavLink to="/search">Search</NavLink></li>
                    <li><button onClick={ logout }>Logout</button></li>
                </ul>
            </nav>
        </header>
    );
};

export default observer( NavBar );