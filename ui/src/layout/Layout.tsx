import { ReactNode } from "react";
//Components
import NavBar from "../Components/Nav/NavBar";

interface LayoutProps
{
    children: ReactNode;
}

const Layout = ( { children }: LayoutProps ) =>
{
    return (
        <div>
            <NavBar />
            <main>{ children }</main>
        </div>
    );
};

export default Layout;