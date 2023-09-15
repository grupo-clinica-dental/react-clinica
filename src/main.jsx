/* eslint-disable react/prop-types */
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
import DoctoresEspecialidades from "./routes/Doctoresespecialidades";
import Root from "./routes/root";
import Usuarios from "./routes/Usuarios";
import Roles from "./routes/Roles";
import Rutas from "./routes/Ruta";
import Permisos from "./routes/Permisos1";
import EstadosCita from "./routes/EstadosCita";
import LoginPage from "./routes/Login";

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore2 } from "./zustand-stores/auth-store";


export const ProtectedRoute = ({
  children,
  redirectTo = "/login",
}) => {
  const isAuth = useAuthStore2 (state => state.isAuth)

  if (!isAuth) return <Navigate to={redirectTo} />;
  return children ? children : <Outlet />;
};

export const router = createBrowserRouter([
  
  {
    path: '/login',
    element: <LoginPage />,
    name: 'Login',
    },
  {
    path: "/",
    element: <Root />,
    name:'Inicio',
    errorElement: <ErrorPage />,
    children: [
      {
        path: "contacts/:contactId",
        element: <ProtectedRoute> <Contact /> </ProtectedRoute>,
      },
      {
        path: "/Doctores",
        element: <ProtectedRoute> <Doctores /> </ProtectedRoute>,
        name:'Doctores',
        errorElement: <ErrorPage />,
      },
      {
        path: "/Paciente",
        element: <ProtectedRoute> <Paciente /> </ProtectedRoute>,
        name:'Paciente',
        errorElement: <ErrorPage />,
      },
      {
        path: "/Citas",
        element: <ProtectedRoute> < Citas/> </ProtectedRoute>, 
        name:'Citas',
        errorElement: <ErrorPage />,
      },
      {
        path: "/Usuarios",
        element: <ProtectedRoute> < Usuarios/> </ProtectedRoute>,
        errorElement: <ErrorPage />,        
        name:'Usuarios',
      },
     {
        path: "/Roles",
        element: <ProtectedRoute> < Roles/> </ProtectedRoute>,        
        name:'Roles',
        errorElement: <ErrorPage />,
      },
      {
        path: "/Rutas", 
        element: <ProtectedRoute> <Rutas /> </ProtectedRoute>, 
        name: 'Rutas', 
        errorElement: <ErrorPage />,
      },
      {
        path: "/Permisos", 
        element: <ProtectedRoute> <Permisos /> </ProtectedRoute>, 
        name: 'Permisos', 
        errorElement: <ErrorPage />,
      },
      {
        path: "/Especialidades", 
        element: <ProtectedRoute> <Especialidades /> </ProtectedRoute>, 
        name: 'Especialidades', 
        errorElement: <ErrorPage />,
      },
      {
        path: "/DoctoresEspecialidades", 
        element: <ProtectedRoute> <DoctoresEspecialidades /> </ProtectedRoute>, 
        name: 'DoctoresEspecialidades', 
        errorElement: <ErrorPage />,
      },
      {
        path: '/EstadosCita',
        element: <ProtectedRoute> <EstadosCita/> </ProtectedRoute>,
        name:'EstadosCitas',
        errorElement: <ErrorPage />,
      }

      
      
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    
  </React.StrictMode>
);




