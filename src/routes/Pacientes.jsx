import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";

const url = `${API_URL}/api/pacientes`;

export const Pacientes = () => {
  const token = useAuthStore2((state) => state.token);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    telefono: '',
    email: '',
    fecha_nacimiento: ''
  });
  const [state, setState] = useState({
    error: null,
    success: null
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const resetFormData = () => {
    setFormData({
      id: '',
      nombre: '',
      telefono: '',
      email: '',
      fecha_nacimiento: ''
    });
  };

  const cambioData = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const enviarDatos = async (event) => {
    event.preventDefault();

    if (formData.id) {
      enviarDataPUT();
    } else {
      enviarDataPost();
    }
  };

  const [datos, setDatos] = useState([]);

  const getDatos = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const responseData = await response.json();

    if (response.ok) {
      setDatos(responseData.item_paciente);
    } else {
      setDatos([]);
      resetFormData();
    }
  };

  const enviarDataPost = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const responseData = await response.json();
        setState({
          ...state, success: true
        });
        setTimeout(() => {
          setState({
            ...state, success: ''
          });
        }, 2000);
        getDatos();
        resetFormData();
      } else {
        const responseBody = await response.json();
        setState({
          ...state, success: true
        });
        setTimeout(() => {
          setState({
            ...state, success: ''
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
      setState({
        ...state, error: "Error al enviar datos"
      });
      setTimeout(() => {
        setState({
          ...state, error: ''
        });
      }, 2000);
    }
  };

  const enviarDataPUT = async () => {
    try {
      const response = await fetch(url + '/' + formData.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const responseData = await response.json();
        getDatos();
        resetFormData();
        setShowEditModal(false); // Cerrar el modal después de la edición
      } else {
        const responseBody = await response.json();
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
    }
  };

  async function enviarDataDelete(item) {
    try {
      const response = await fetch(url + '/' + item.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        getDatos();
        resetFormData();
        setShowDeleteModal(false); // Cerrar el modal después de la eliminación
      } else {
        const responseBody = await response.json();
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
    }
  }

  function actualizarForm(item) {
    resetFormData();
    let arreglo = {
      id: item.id,
      nombre: item.nombre,
      telefono: item.telefono,
      email: item.email,
      fecha_nacimiento: item.fecha_nacimiento
    };
    setFormData(arreglo);
    setShowEditModal(true); // Mostrar el modal de edición
  }

  useEffect(() => {
    getDatos();
  }, []);

  return (
    <>
      <h2> Registro de Pacientes</h2>
      <div className="container mt-2">
        <div className="card-body">
          <Form onSubmit={enviarDatos}>
            {state.error ? <div className="notificacion error">{state.error}</div> : null}
            {state.success ? <div className="notificacion success">Usuario creado con éxito</div> : null}

            <Form.Group>
              <Form.Control
                type='hidden'
                name='nombre'
                value={formData.id}
                onChange={cambioData}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type='text'
                name='nombre'
                value={formData.nombre}
                onChange={cambioData}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type='text'
                name='telefono'
                value={formData.telefono}
                onChange={cambioData}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                name='email'
                value={formData.email}
                onChange={cambioData}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type='date'
                name='fecha_nacimiento'
                value={formData.fecha_nacimiento}
                onChange={cambioData}
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant='primary' type='submit'>Enviar Datos</Button>
            </div>
          </Form>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-12">
          <h1 className="mb-4">Reporte de Pacientes</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#Paciente</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Fecha de Nacimiento</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((item, i) => (
                <tr key={i}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>{item.telefono}</td>
                  <td>{item.email}</td>
                  <td>{item.fecha_nacimiento}</td>
                  <td>
                    <Button
                      variant='info'
                      className='me-2'
                      onClick={() => {
                        actualizarForm(item); // Mostrar el modal de edición al hacer clic en "Editar"
                      }}
                    > 
                      Editar 
                      
                    </Button>
                   </td>
                   <td>
                    <Button
                      variant='danger'
                      onClick={() => {
                        setSelectedPaciente(item);
                        setShowDeleteModal(true); // Mostrar el modal de eliminación al hacer clic en "Eliminar"
                      }}
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

      {/* Modal de Edición */}
      <Modal className='w-[80%]' show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={enviarDatos}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type='text'
                name='nombre'
                value={formData.nombre}
                onChange={cambioData}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type='text'
                name='telefono'
                value={formData.telefono}
                onChange={cambioData}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                name='email'
                value={formData.email}
                onChange={cambioData}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type='date'
                name='fecha_nacimiento'
                value={formData.fecha_nacimiento}
                onChange={cambioData}
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant='primary' type='submit'>Guardar Cambios</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar a este paciente?</p>
          <Button
            variant='danger'
            onClick={() => {
              enviarDataDelete(selectedPaciente);
            }}
          >
            Sí, Eliminar
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};


export default Pacientes;

