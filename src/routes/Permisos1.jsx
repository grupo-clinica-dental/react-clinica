import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';

const apiUrl = "http://localhost:3000/api/permisos";
const rolesUrl = "http://localhost:3000/api/roles";
const rutasUrl = "http://localhost:3000/api/rutas";

const Permisos = () => {
  const [envio, setEnvio] = useState(0);

  const [formData, setFormData] = useState({
    id_rol: '',
    id_ruta: '',
    activa: true,
    fecha_borrado: null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [permisoIdToEdit, setPermisoIdToEdit] = useState(null);

  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(null);

  const mostrarMensaje = (mensaje, tipo) => {
    setMensaje(mensaje);
    setTipoMensaje(tipo);

    // Borra el mensaje después de unos segundos (opcional)
    setTimeout(() => {
      setMensaje(null);
      setTipoMensaje(null);
    }, 5000); // Muestra el mensaje durante 5 segundos (puedes ajustarlo según tus preferencias)
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
        console.log("Datos de Permiso Enviados");
        setEnvio(envio + 1);
        setModalVisible(false);

        // Mostrar mensaje de éxito
        mostrarMensaje("Datos de Permiso Enviados con éxito", "success");
      } else {
        const responseBody = await response.json();
        console.log("Error al enviar datos de permiso");
        console.log(responseBody);

        // Mostrar mensaje de error
        mostrarMensaje("Error al enviar datos de permiso", "error");
      }
    } catch (error) {
      console.error("Error al enviar datos de permiso", error);

      // Mostrar mensaje de error
      mostrarMensaje("Error al enviar datos de permiso", "error");
    }
  };

  const cargarDatos = () => {
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
  };

  useEffect(() => {
    // Cargar datos iniciales
    cargarDatos();

    // Obtener datos de roles desde la API
    fetch(rolesUrl)
      .then((response) => response.json())
      .then((data) => setRoles(data))
      .catch((error) => console.error(error));

    // Obtener datos de rutas desde la API
    fetch(rutasUrl)
      .then((response) => response.json())
      .then((data) => setRutas(data))
      .catch((error) => console.error(error));
  }, [envio]);

  const abrirModalEditar = (permisoId) => {
    // Buscar el permiso por ID
    const permiso = data.find((item) => item.id === permisoId);
    if (permiso) {
      setPermisoIdToEdit(permisoId);
      setFormData({
        id_rol: permiso.id_rol,
        id_ruta: permiso.id_ruta,
        activa: permiso.activa,
        fecha_borrado: permiso.fecha_borrado,
      });
      setModalVisible(true);
    }
  };

  const editarPermiso = async () => {
    try {
      const response = await fetch(`${apiUrl}/${permisoIdToEdit}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Permiso editado exitosamente");
        setEnvio(envio + 1);
        setModalVisible(false);

        // Mostrar mensaje de éxito
        mostrarMensaje("Permiso editado exitosamente", "success");
      } else {
        const responseBody = await response.json();
        console.log("Error al editar permiso");
        console.log(responseBody);

        // Mostrar mensaje de error
        mostrarMensaje("Error al editar permiso", "error");
      }
    } catch (error) {
      console.error("Error al editar permiso", error);

      // Mostrar mensaje de error
      mostrarMensaje("Error al editar permiso", "error");
    }
  };

  const eliminarPermiso = async (permisoId) => {
    // Mostrar una confirmación antes de eliminar
    const confirmarEliminacion = window.confirm("¿Estás seguro de que deseas eliminar este permiso?");
    
    if (confirmarEliminacion) {
      try {
        const response = await fetch(`${apiUrl}/${permisoId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log("Permiso eliminado exitosamente");
          setEnvio(envio + 1);

          // Mostrar mensaje de éxito
          mostrarMensaje("Permiso eliminado exitosamente", "success");
        } else {
          const responseBody = await response.json();
          console.log("Error al eliminar permiso");
          console.log(responseBody);

          // Mostrar mensaje de error
          mostrarMensaje("Error al eliminar permiso", "error");
        }
      } catch (error) {
        console.error("Error al eliminar permiso", error);

        // Mostrar mensaje de error
        mostrarMensaje("Error al eliminar permiso", "error");
      }
    }
  };

  const cambioData = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  return (
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
                    {Array.isArray(rutas) && rutas.map((ruta) => (
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
                    name="id_rol"
                    value={formData.id_rol}
                    onChange={cambioData}
                  >
                    <option value="">Selecciona un Rol</option>
                    {Array.isArray(roles) &&
                      roles.map((rol) => (
                        <option key={rol.id_rol} value={rol.id_rol}>
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
                    onChange={cambioData}
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

      <div className="row mt-4">
        <div className="col-md-12">
          <h2>Lista de Permisos</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ruta</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) &&
                data.map((permiso) => (
                  <tr key={permiso.id}>
                    <td>{permiso.id}</td>
                    <td>{permiso.id_ruta}</td>
                    <td>{permiso.id_rol}</td>
                    <td>{permiso.activa ? 'Sí' : 'No'}</td>
                    <td>
                      <Button
                        variant="info"
                        className="mr-2"
                        onClick={() => abrirModalEditar(permiso.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => eliminarPermiso(permiso.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal para editar */}
      <Modal show={modalVisible && permisoIdToEdit} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Permiso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Campos de edición */}
            <Form.Group>
              <Form.Label>Ruta</Form.Label>
              <Form.Control
                as="select"
                name="id_ruta"
                value={formData.id_ruta}
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
                name="id_rol"
                value={formData.id_rol}
                onChange={cambioData}
              >
                <option value="">Selecciona un Rol</option>
                {Array.isArray(roles) &&
                  roles.map((rol) => (
                    <option key={rol.id_rol} value={rol.id_rol}>
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
                onChange={() =>
                  setFormData({
                    ...formData,
                    activa: !formData.activa,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalVisible(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={editarPermiso}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Componente de Mensaje */}
      <Mensaje mensaje={mensaje} tipo={tipoMensaje} />
    </div>
  );
};

const Mensaje = ({ mensaje, tipo }) => {
  if (!mensaje) return null;

  let className;
  if (tipo === "success") {
    className = "alert alert-success";
  } else if (tipo === "error") {
    className = "alert alert-danger";
  }

  return <div className={className}>{mensaje}</div>;
};

export default Permisos;
