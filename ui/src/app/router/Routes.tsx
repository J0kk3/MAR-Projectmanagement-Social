import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
//layout
import App from "../../layout/App";
//pages
import Auth from "../../views/Auth/Auth";
import Dashboard from "../../views/Dashboard/Dashboard";
import ProjectOverview from "../../views/ProjectOverview/ProjectOverview";
import Search from "../../views/Search/Search";
import Profile from "../../views/Profile/Profile";
import CreateProjectForm from "../../Components/projects/ProjectForm/CreateProjectForm";
import KanbanBoard from "../../views/KanbanBoard/KanbanBoard";

export const routes: RouteObject[] =
    [
        {
            path: "/",
            element: <App />,
            children:
                [
                    { path: "", element: <Auth /> },
                    { path: "dashboard", element: <Dashboard /> },
                    { path: "projects", element: <ProjectOverview /> },
                    { path: "kanbanboard/:id", element: <KanbanBoard /> },
                    { path: "create-project", element: <CreateProjectForm /> },
                    { path: "search", element: <Search /> },
                    { path: "profile", element: <Profile /> },
                ]
        },
        { path: "*", element: <Navigate replace to="/" /> },
    ];

export const Router = createBrowserRouter( routes );