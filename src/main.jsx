import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import ErrorPage from "./error-page";
import Contact from "./routes/contact";
import Registro from "./routes/Registro";
import Paciente from "./routes/Pacientes";
import Root, { loader as rootLoader,   action as rootAction, } from "./routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader : rootLoader, 
    action: rootAction,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
      {
        path: "/registro",
        element: <Registro />,
        errorElement: <ErrorPage />,
        loader : rootLoader, 
        action: rootAction,
      },
      {
        path: "/Paciente",
        element: <Paciente />,
        errorElement: <ErrorPage />,
        loader : rootLoader, 
        action: rootAction,
      }
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    
  </React.StrictMode>
);




