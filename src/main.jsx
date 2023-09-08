import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import ErrorPage from "./error-page";
import Contact from "./routes/contact";
import Doctores from "./routes/Doctores";
import Paciente from "./routes/Pacientes";
import Citas from "./routes/Citas";
import Especialidades from "./routes/Especialidades";
import Root, { loader as rootLoader,   action as rootAction, } from "./routes/root";
import Usuarios from "./routes/Usuarios";
import Roles from "./routes/Roles";
import Rutas from "./routes/Ruta";
import Permisos from "./routes/Permisos1";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    name:'Inicio',
    errorElement: <ErrorPage />,
    loader : rootLoader, 
    action: rootAction,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
      {
        path: "/Doctores",
        element: <Doctores />,
        name:'Doctores',
        errorElement: <ErrorPage />,
        loader : rootLoader, 
        action: rootAction,
      },
      {
        path: "/Paciente",
        element: <Paciente />,
        name:'Paciente',
        errorElement: <ErrorPage />,
        loader : rootLoader, 
        action: rootAction,
      },
      {
        path: "/Citas",
        element: < Citas/>,
        name:'Citas',
        errorElement: <ErrorPage />,
        loader : rootLoader, 
        action: rootAction,
      },
      {
        path: "/Usuarios",
        element: < Usuarios/>,
        errorElement: <ErrorPage />,        
        name:'Usuarios',
        loader : rootLoader, 
        action: rootAction,
      },
     {
        path: "/Usuarios",
        element: < Roles/>,        
        name:'Citas',
        errorElement: <ErrorPage />,
        loader : rootLoader, 
        action: rootAction,
      },
      {
        path: "/Rutas", 
        element: <Rutas />, 
        name: 'Rutas', 
        errorElement: <ErrorPage />,
        loader: rootLoader,
        action: rootAction,
      },
      {
        path: "/Permisos", 
        element: <Permisos />, 
        name: 'Permisos', 
        errorElement: <ErrorPage />,
        loader: rootLoader,
        action: rootAction,
      },
      {
        path: "/Especialidades", 
        element: <Especialidades />, 
        name: 'Especialidades', 
        errorElement: <ErrorPage />,
        loader: rootLoader,
        action: rootAction,
      },

      
      
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    
  </React.StrictMode>
);




