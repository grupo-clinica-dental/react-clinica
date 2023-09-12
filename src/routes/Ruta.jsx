import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';

const apiUrl = "http://localhost:3000/api/rutas";

export const Rutas = () => {
  const [envio, setEnvio] = useState(0);
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(null);

  const [formData, setFormData] = useState({
    string_ruta: '',
    activa: true,
    fecha_borrado: null,
  });

  const [rutaSeleccionadaId, setRutaSeleccionadaId] = useState(null);
  const [rutaSeleccionada, setRutaSeleccionada] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const cambioData = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const cambioData1 = (event) => {
    const { name, value } = event.target;
    setRutaSeleccionada({ ...rutaSeleccionada, [name]: value });
  };

  const mostrarMensaje = (mensaje, tipo) => {
    setMensaje(mensaje);
    setTipoMensaje(tipo);

    // Borra el mensaje después de unos segundos (opcional)
    setTimeout(() => {
      setMensaje(null);
      setTipoMensaje(null);
    }, 5000); // Muestra el mensaje durante 5 segundos (puedes ajustarlo según tus preferencias)
  };

  const handleEditarClick = async (id) => {
    setRutaSeleccionadaId(id);

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setRutaSeleccionada(responseData.ruta);
        setModalVisible(true);
      } else {
        const responseBody = await response.json();
        console.error("Error al obtener detalles de la ruta", responseBody);
      }
    } catch (error) {
      console.error("Error al obtener detalles de la ruta", error);
    }
  };

  const handleCancelarEdicion = () => {
    setModalVisible(false);
  };

  const actualizarRuta = async () => {
    try {
      const response = await fetch(`${apiUrl}/${rutaSeleccionadaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rutaSeleccionada),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Ruta actualizada exitosamente", responseData);
        setModalVisible(false);
        setEnvio(envio + 1);

        // Mostrar mensaje de éxito
        mostrarMensaje("Ruta actualizada exitosamente", "success");
      } else {
        const responseBody = await response.json();
        console.error("Error al actualizar la ruta", responseBody);

        // Mostrar mensaje de error
        mostrarMensaje("Error al actualizar la ruta", "error");
      }
    } catch (error) {
      console.error("Error al actualizar la ruta", error);

      // Mostrar mensaje de error
      mostrarMensaje("Error al actualizar la ruta", "error");
    }
  };

  const handleEliminarClick = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
      try {
        const response = await fetch(`${apiUrl}/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log("Ruta eliminada exitosamente");
          setEnvio(envio + 1);

          // Mostrar mensaje de éxito
          mostrarMensaje("Ruta eliminada exitosamente", "success");
        } else {
          console.error("Error al eliminar la ruta:", response.statusText);

          // Mostrar mensaje de error
          mostrarMensaje("Error al eliminar la ruta", "error");
        }
      } catch (error) {
        console.error("Error al eliminar la ruta", error);

        // Mostrar mensaje de error
        mostrarMensaje("Error al eliminar la ruta", "error");
      }
    }
  };

  const crearRuta = async () => {
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
        console.log("Ruta creada exitosamente", responseData);
        setEnvio(envio + 1);
        setModalVisible(false);

        // Mostrar mensaje de éxito
        mostrarMensaje("Ruta creada exitosamente", "success");
      } else {
        const responseBody = await response.json();
        console.error("Error al crear la ruta", responseBody);

        // Mostrar mensaje de error
        mostrarMensaje("Error al crear la ruta", "error");
      }
    } catch (error) {
      console.error("Error al crear la ruta", error);

      // Mostrar mensaje de error
      mostrarMensaje("Error al crear la ruta", "error");
    }
  };

  const obtenerRutas = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setRutas(responseData.rutas);
      } else {
        const responseBody = await response.json();
        console.error("Error al obtener las rutas", responseBody);

        // Mostrar mensaje de error
        mostrarMensaje("Error al obtener las rutas", "error");
      }
    } catch (error) {
      console.error("Error al obtener las rutas", error);

      // Mostrar mensaje de error
      mostrarMensaje("Error al obtener las rutas", "error");
    }
  };

  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    obtenerRutas();
  }, [envio]);

  return (
    <>
      {/* Formulario de Creación */}
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-header">
                Formulario de Creación de Ruta
              </div>
              <div className="card-body">
                <Form>
                  <Form.Group>
                    <Form.Label>Nombre de Ruta</Form.Label>
                    <Form.Control
                      type='text'
                      name='string_ruta'
                      value={formData.string_ruta}
                      onChange={cambioData}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Ruta Activa</Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="activa"
                      checked={formData.activa}
                      onChange={() => setFormData({ ...formData, activa: !formData.activa })}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" onClick={crearRuta}>
                      Crear Ruta
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Rutas */}
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-12">
            <h1 className="mb-4">Lista de Rutas</h1>
            {mensaje && (
              <Mensaje mensaje={mensaje} tipo={tipoMensaje} />
            )}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre de Ruta</th>
                  <th>Ruta Activa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rutas.map((ruta) => (
                  <tr key={ruta.id}>
                    <td>{ruta.id}</td>
                    <td>{ruta.nombre_ruta}</td>
                    <td>{ruta.activa ? 'Sí' : 'No'}</td>
                    <td>
                      <Button variant="info" onClick={() => handleEditarClick(ruta.id)}>Editar</Button>{' '}
                      <Button variant="danger" onClick={() => handleEliminarClick(ruta.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      <Modal show={modalVisible} onHide={handleCancelarEdicion}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Ruta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre de Ruta</Form.Label>
              <Form.Control
                type='text'
                name='string_ruta'
                value={rutaSeleccionada ? rutaSeleccionada.string_ruta : ''}
                onChange={cambioData1}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Ruta Activa</Form.Label>
              <Form.Check
                type="checkbox"
                name="activa"
                checked={rutaSeleccionada.activa || false}
                onChange={() => setRutaSeleccionada({ ...rutaSeleccionada, activa: !rutaSeleccionada.activa })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelarEdicion}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={actualizarRuta}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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

export default Rutas;
