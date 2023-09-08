import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const apiUrl = "http://localhost:3000/api/permisos";
const rolesUrl = "http://localhost:3000/api/roles";
const rutasUrl = "http://localhost:3000/api/rutas";

const Permisos = () => {
  const [envio, setEnvio] = useState(0);

  const [formData, setFormData] = useState({
    rol_id: '', // Cambiar a rol_id en lugar de nombre_rol
    ruta_id: '', // Cambiar a ruta_id en lugar de nombre_ruta
    activa: false,
    fecha_borrado: null,
  });

  const cambioData = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const enviarDatos = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Datos de Permiso Enviados");
        console.log(responseData);

        setEnvio(envio + 1);
      } else {
        const responseBody = await response.json();
        console.log("Error al enviar datos de permiso");
        console.log(responseBody);
      }
    } catch (error) {
      console.error("Error al enviar datos de permiso", error);
    }
  };

  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    // Obtener datos de roles desde la API
    fetch(rolesUrl)
      .then((response) => response.json())
      .then((data) => setRoles(data)) // Roles ahora es un arreglo
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // Obtener datos de rutas desde la API
    fetch(rutasUrl)
      .then((response) => response.json())
      .then((data) => setRutas(data)) // Rutas ahora es un arreglo
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // Obtener datos de permisos desde la API
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data.permisos))
      .catch((error) => console.error(error));
  }, [envio]);

  return (
    <>
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-12">
          </div>
        </div>

        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-header">
                Formulario de Registro de Permiso
              </div>
              <div className="card-body">
                <Form onSubmit={enviarDatos}>
                  <Form.Group>
                    <Form.Label>Ruta</Form.Label>
                    <Form.Control
                      as="select"
                      name="ruta_id"
                      value={formData.ruta_id}
                      onChange={cambioData}
                    >
                      <option value="">Selecciona una Ruta</option>
                      {Array.isArray(rutas) &&
                        rutas.map((ruta) => (
                          <option key={ruta.id} value={ruta.id}>
                            {ruta.nombre_ruta}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Nombre del Rol</Form.Label>
                    <Form.Control
                      as="select"
                      name="rol_id"
                      value={formData.rol_id}
                      onChange={cambioData}
                    >
                      <option value="">Selecciona un Rol</option>
                      {Array.isArray(roles) &&
                        roles.map((rol) => (
                          <option key={rol.id} value={rol.id}>
                            {rol.nombre_rol}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Permiso Activo</Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="activa"
                      checked={formData.activa}
                      onChange={() => setFormData({ ...formData, activa: !formData.activa })}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button variant="primary" type="submit">
                      Enviar Datos de Permiso
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12">
            <h1 className="mb-4">Reporte de Permisos</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#Permiso</th>
                  <th>Ruta</th>
                  <th>Nombre del Rol</th>
                  <th>Permiso Activo</th>
                  <th>Fecha de Borrado</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.id_ruta}</td>
                    <td>{item.id_rol}</td>
                    <td>{item.activa ? 'Sí' : 'No'}</td>
                    <td>{item.fecha_borrado ? item.fecha_borrado : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Permisos;
