import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import Modal from '../components/modal';
import { useAuthStore2 } from '../zustand-stores/auth-store';
import { API_URL } from '../api/api.config';

const url = `${API_URL}/api/roles`;

export const Roles = () => {
  const token = useAuthStore2((state) => state.token);

  const [formData, setFormData] = useState({
    nombre: '',
  });

  const [state, setState] = useState({
    error: null,
    roles: [],
    success: null,
    modalIsOpen: false,
    deleteOpen: false,
    editOpen: false,
    selectedRol: {
      editId: '',
      editNombre: '',
    },
  });

  const resetFormData = () => {
    setFormData({
      nombre: '',
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setState((previous) => ({
      ...previous,
      selectedRol: { ...previous.selectedRol, [name]: value },
    }));
  };

  const resetError = () => {
    setTimeout(() => {
      setState((previous) => ({ ...previous, error: null }));
    }, 2000);
  };

  const resetSuccess = () => {
    setTimeout(() => {
      setState((previous) => ({ ...previous, success: null }));
    }, 2000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        setState({
          ...state,
          success: 'Rol creado con éxito',
        });
        loadData();
        resetFormData();
        resetSuccess();
      } else {
        const responseBody = await response.json();
        setState({ ...state, error: responseBody.message });
        resetError();
      }
    } catch (error) {
      setState({ ...state, error: 'Error al enviar datos' });
      resetError();
    }
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    const data = {
      id: state.selectedRol.editId,
      nombre: state.selectedRol.editNombre,
    };

    try {
      const response = await fetch(`${url}/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setState({
          ...state,
          success: 'Rol actualizado con éxito',
          editOpen: false,
        });
        loadData();
        resetSuccess();
      } else {
        const responseBody = await response.json();
        setState({ ...state, error: responseBody.message });
        resetError();
      }
    } catch (error) {
      setState({ ...state, error: 'Error al enviar datos' });
      resetError();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${url}/${state.selectedRol.editId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setState({
          ...state,
          success: 'Rol eliminado con éxito',
          deleteOpen: false,
        });
        loadData();
        resetFormData();
      } else {
        const responseBody = await response.json();
        setState({ ...state, error: responseBody.message });
        resetError();
      }
    } catch (error) {
      setState({ ...state, error: 'Error al enviar datos' });
      resetError();
    }
  };

  const loadData = async () => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setState((previous) => ({
          ...previous,
          roles: responseData,
        }));
        console.log("Datos cargados:", responseData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  console.log('Datos en state.roles:', state.roles);

  return (
    <>
      <h2>Registro de Roles</h2>
      <div className="container mt-2">
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            {state.error ? (
              <div className="notificacion error">{state.error}</div>
            ) : null}
            {state.success ? (
              <div className="notificacion success">{state.success}</div>
            ) : null}
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
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
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {state.roles && state.roles.length > 0 ? (
                  state.roles.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nombre}</td>
                      <td>
                        <button
                          onClick={() => {
                            setState((previous) => ({
                              ...previous,
                              selectedRol: {
                                editId: item.id,
                                editNombre: item.nombre,
                              },
                              editOpen: true,
                            }));
                          }}
                        >
                          Editar
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setState((previous) => ({
                              ...previous,
                              selectedRol: {
                                editId: item.id,
                                editNombre: item.nombre,
                              },
                              deleteOpen: true,
                            }));
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No hay datos disponibles</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal de Editar */}
      <Modal
        isOpen={state.editOpen}
        onClose={() => setState((previous) => ({ ...previous, editOpen: false }))}
      >
        <div className>
          <h1>Editar Rol</h1>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="editNombre"
                value={state.selectedRol.editNombre}
                onChange={handleChangeEdit}
              />
            </Form.Group>
            <div className='d-flex justify-content-end gap-3 mt-7'>
            <Button
              variant="secondary"
              onClick={() => setState((previous) => ({ ...previous, editOpen: false }))}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
            </div>
          </Form>
          
        </div>
      </Modal>

      {/* Modal de Eliminar */}
      <Modal
        showCloseButton={false}
        isOpen={state.deleteOpen}
        onClose={() => setState((previous) => ({ ...previous, deleteOpen: false }))}
      >
        <div className>
          <h5>¿Estás seguro que deseas eliminar este rol?</h5>
          <div className="d-flex justify-content-end gap-3 mt-7">
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
            <Button
              variant="secondary"
              onClick={() => setState((previous) => ({ ...previous, deleteOpen: false }))}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Roles;
