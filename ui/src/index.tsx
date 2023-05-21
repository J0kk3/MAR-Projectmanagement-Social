import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
//Types & Models
import { Router } from "./app/router/Routes";
//Styles
import "./layout/Styles.scss";

const root = ReactDOM.createRoot(
  document.getElementById( "root" ) as HTMLElement
);
root.render(
  <React.StrictMode>
      <RouterProvider router={ Router } />
  </React.StrictMode>
);