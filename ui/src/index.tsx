import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
//Types & Models
import { Router } from "./app/router/Routes";
//Stores
import { StoreContext, store } from "./app/stores/store";
//Styles
import "./layout/Styles.scss";

const root = ReactDOM.createRoot(
  document.getElementById( "root" ) as HTMLElement
);
root.render(
  <StoreContext.Provider value={ store }>
    <RouterProvider router={ Router } />
  </StoreContext.Provider>
);