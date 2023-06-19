import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../app/stores/store";
//Layout
import Layout from "./Layout";

const App = () =>
{
  const { commonStore, userStore } = useStore();

  useEffect( () =>
  {
    if ( commonStore.token )
    {
      userStore.getUser().finally( () => commonStore.setAppLoaded() );
    }
    else
    {
      commonStore.setAppLoaded();
    }
  }, [ commonStore, userStore ] );

  if ( !commonStore.appLoaded ) return <h1>Loading App...</h1>;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default observer( App );