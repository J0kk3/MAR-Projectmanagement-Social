import { NavLink, Link } from "react-router-dom";
//Styles
import "./NavBar.scss";

const NavBar = () =>
{
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
                </ul>
            </nav>
        </header>
    );
};

export default NavBar;