import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { useAuthStore2 } from '../zustand-stores/auth-store';
import { API_URL } from '../api/api.config';
import Modal from '../components/modal';

const url = `${API_URL}/api/pacientes`;

export const Pacientes = () => {
  const token = useAuthStore2((state) => state.token);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    telefono: '',
    email: '',
    fecha_nacimiento: '',
  });
  const [state, setstate] = useState({
    error: null,
    success: null,
    modalIsOpen: false,
    deleteOpen: false,
    editOpen: false,
  });

  const resetFormData = () => {
    setFormData({
      id: '',
      nombre: '',
      telefono: '',
      email: '',
      fecha_nacimiento: '',
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
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setstate({
          ...state,
          success: true,
        });
        setTimeout(() => {
          setstate({
            ...state,
            success: '',
          });
        }, 2000);
        getDatos();
        resetFormData();
      } else {
        const responseBody = await response.json();
        setstate({
          ...state,
          error: responseBody.message || 'Error al enviar datos',
        });
        setTimeout(() => {
          setstate({
            ...state,
            error: '',
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error al enviar datos', error);
      setstate({
        ...state,
        error: 'Error al enviar datos',
      });
      setTimeout(() => {
        setstate({
          ...state,
          error: '',
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
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();

        getDatos();
        resetFormData();
      } else {
        const responseBody = await response.json();
      }
    } catch (error) {
      console.error('Error al enviar datos', error);
    }
  };

  async function enviarDataDelete(item) {
    try {
      const response = await fetch(url + '/' + item.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        getDatos();
        resetFormData();
      } else {
        const responseBody = await response.json();
      }
    } catch (error) {
      console.error('Error al enviar datos', error);
    }
  }

  function actualizarForm(item) {
    resetFormData();
    let arreglo = {
      id: item.id,
      nombre: item.nombre,
      telefono: item.telefono,
      email: item.email,
      fecha_nacimiento: item.fecha_nacimiento,
    };
    setFormData(arreglo);
  }

  function handleOpenModal(modalName) {
    setstate((previous) => ({ ...previous, [modalName]: true }));
  }

  const handleCloseModal = () => {
    setstate((previous) => ({ ...previous, modalIsOpen: false, deleteOpen: false, editOpen: false }));
  };

  useEffect(() => {
    getDatos();
  }, []);

  return (
    <>
      <h2>Registro de Pacientes</h2>
      <div className="container mt-2">
        <div className="card-body">
          <Form onSubmit={enviarDatos}>
            {state.error ? <div className="notificacion error">{state.error}</div> : null}
            {state.success ? <div className="notificacion success">Usuario creado con éxito</div> : null}
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="nombre" value={formData.nombre} onChange={cambioData} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="text" name="telefono" value={formData.telefono} onChange={cambioData} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={cambioData} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={cambioData} />
            </Form.Group>

            <Button type="submit">Guardar</Button>
          </Form>
        </div>
        <div>
          <div className="mt-5">
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Fecha de Nacimiento</th>
                  <th>Eliminar</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nombre}</td>
                    <td>{item.telefono}</td>
                    <td>{item.email}</td>
                    <td>{item.fecha_nacimiento}</td>
                    <td>
                      <button onClick={() => { actualizarForm(item); handleOpenModal('editOpen'); }}>Editar</button>
                      </td>
                      <td>
                      <button onClick={() => { actualizarForm(item); handleOpenModal('deleteOpen'); }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
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


{/* Modal de Eliminar */}
<Modal showCloseButton={false} isOpen={state.deleteOpen} onClose={handleCloseModal}>
  <div className="p-4 text-center">
    <h2 className="mb-4">¿Estás seguro que deseas eliminar este usuario?</h2>
    <Button
      className="w-full mb-2"
      variant="danger"
      onClick={() => {
        enviarDataDelete(formData);
        handleCloseModal();
      }}
    >
      Eliminar
    </Button>
    <Button
      className="w-full"
      onClick={handleCloseModal}
    >
      Cancelar
    </Button>
  </div>
</Modal>


    </>
  );
};

export default Pacientes;
