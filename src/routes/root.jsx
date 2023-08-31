import { Link, Outlet,  useLoaderData, Form } from "react-router-dom";
import { createContact, getContacts } from "../contacts";
import { router } from "../main";


export async function action() {
    const contact = await createContact();
    return { contact };
  }


export default function Root() {
    const { contacts } = useLoaderData();
    return (
      <>
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
                  <Link to={`/`}>
                    Inicio
                  </Link>
                </li>

                <li key={router.path}>
                  <Link to={`/registro`}>
                    Registro
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
                
            </ul>
          </nav>
        </div>
        <div id="detail">
            <Outlet></Outlet>
        </div>
      </>
    );
  }


export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}