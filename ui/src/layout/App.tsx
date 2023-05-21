import { Outlet } from "react-router-dom";
import Layout from "./Layout";

const App = () =>
{
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default App;