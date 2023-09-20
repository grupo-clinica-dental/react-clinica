import { Link, Outlet,   Form } from "react-router-dom";
import { ProtectedRoute } from "../main";
import { router } from "../main";




  



export default function Root() {



  

    return (
      <>
      <ProtectedRoute >
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={true}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </form>
            <Form method="post">
            <button type="submit">New</button>
          </Form>
          </div>
          <nav>
          <ul>
                <li key={router.path}>
                  <Link to={`/Inicio`}>
                    Inicio
                  </Link>
                </li>

                <li key={router.path}>
                  <Link to={`/Doctores`}>
                    Doctores
                  </Link>
                </li>
                
                <li key={router.path}>
                  <Link to={`/Especialidades`}>
                    Especialidades
                  </Link>
                </li>

                <li key={router.path}>
                  <Link to={`/Paciente`}>
                  Paciente
                  </Link>
                </li>

                <li key={router.path}>
                  <Link to={`/Citas`}>
                  Citas
                  </Link>
                </li>

                <li key={router.path}>
                  <Link to={`/Usuarios`}>
                  Usuarios
                  </Link>
                </li>

                <li key={router.path}>
                  <Link to={`/Permisos`}>
                  permisos
                  </Link>
                </li>

                <li key={router.path}>
                  <Link to={`/Rutas`}>
                  Rutas
                  </Link>
                </li>

                <li key={router.path}>
                  <Link to={`/DoctoresEspecialidades`}>
                  Doctores Especialidades
                  </Link>
                </li>
                <li key={'/EstadosCita'}>
                  <Link to={`/EstadosCita`}>
                  Estados Cita
                  </Link>
                </li>
                <li key={'/Roles'}>
                  <Link to={`/Roles`}>
                  Roles
                  </Link>
                </li>
            </ul>
          </nav>
        </div>
        <div id="detail">
          
            <Outlet></Outlet>
        </div>
        </ProtectedRoute>
      </>
    );
  }



