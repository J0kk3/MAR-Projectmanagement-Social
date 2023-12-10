import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
//Auth
import RequireAuth from "./RequireAuth";
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
import TeamOverview from "../../views/TeamOverview/TeamOverview";

export const routes: RouteObject[] =
    [
        {
            path: "/",
            element: <App />,
            children:
                [
                    { path: "/", element: <Navigate to="/auth" replace /> },
                    { path: "auth", element: <Auth /> },
                    {
                        element: <RequireAuth />, children:
                            [
                                { path: "dashboard", element: <Dashboard /> },
                                { path: "projects", element: <ProjectOverview /> },
                                { path: "kanbanboard/:id", element: <KanbanBoard /> },
                                { path: "create-project", element: <CreateProjectForm /> },
                                { path: "teams", element: <TeamOverview /> },
                                { path: "search", element: <Search /> },
                                { path: "profile", element: <Profile /> },
                            ]
                    }
                ]
        },
        { path: "*", element: <Navigate replace to="/auth" /> },
    ];

export const Router = createBrowserRouter( routes );