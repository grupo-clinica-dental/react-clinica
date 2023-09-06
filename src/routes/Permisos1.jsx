import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const apiUrl = "http://localhost:3000/api/permisos"; 
const rolesUrl = "http://localhost:3000/api/roles";
const rutasUrl = "http://localhost:3000/api/rutas"; // Nueva URL para obtener nombres de rutas

export const Permisos = () => {
  const [envio, setEnvio] = useState(0);

  const [formData, setFormData] = useState({
    id_ruta: '', // Cambiamos el campo a "id_ruta"
    nombre_rol: '',
    activa: true,
    fecha_borrado: null,
  });

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

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
  const [rutas, setRutas] = useState([]); // Estado para almacenar los nombres de las rutas

  useEffect(() => {
    fetch(rolesUrl)
      .then((response) => response.json())
      .then((data) => setRoles(data.roles.map((rol) => rol.Nombre)))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // Realiza una solicitud para obtener solo los nombres de las rutas desde tu API
    fetch(rutasUrl)
      .then((response) => response.json())
      .then((data) => setRutas(data.rutas.map((ruta) => ruta.Nombre))) // Extrae los nombres de las rutas
      .catch((error) => console.error(error));
  }, []); // Se ejecuta una vez al montar el componente

  useEffect(() => {
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
                      name="id_ruta"
                      value={formData.id_ruta}
                      onChange={cambioData}
                    >
                      <option value="">Selecciona una Ruta</option>
                      {rutas.map((nombreRuta, index) => (
                        <option key={index} value={nombreRuta}>
                          {nombreRuta}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Nombre del Rol</Form.Label>
                    <Form.Control
                      as="select"
                      name="nombre_rol"
                      value={formData.nombre_rol}
                      onChange={cambioData}
                    >
                      <option value="">Selecciona un Rol</option>
                      {roles.map((nombreRol, index) => (
                        <option key={index} value={nombreRol}>
                          {nombreRol}
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
                    <Button variant='primary' type='submit'>Enviar Datos de Permiso</Button>
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
                {data.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.id_ruta}</td>
                    <td>{item.nombre_rol}</td>
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

