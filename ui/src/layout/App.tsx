import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
//Stores
import { useStore } from "../app/stores/store";
//Layout
import Layout from "./Layout";
//Views
import Auth from "../views/Auth/Auth";

const App = () =>
{
  const { commonStore, userStore } = useStore();
  const location = useLocation();

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

  return location.pathname === "/" ? <Auth /> : <Layout><Outlet /></Layout>;
};

export default observer( App );