import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
//Layout
import Layout from "./Layout";
//Stores
import { useStore } from "../app/stores/store";

const App = () =>
{
  const { projectStore } = useStore();

  useEffect( () =>
  {
    projectStore.loadProjects();
  }, [ projectStore ] );

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default observer( App );