import { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";
import Modal from "../components/modal";

const url = `${API_URL}/api/estadoCita`;

export const EstadosCita = () => {
  const token = useAuthStore2((state) => state.token);
  const [formData, setFormData] = useState({
    id: '',
    estado: 'Confirmada',
    activo: true
  });

  const [state, setState] = useState({
    error: null,
    estadosCita: [],
    success: null,
    modalIsOpen: false,
    deleteOpen: false,
    editOpen: false,
    selectedEstadoCita: {
      editId: '',
      editEstado: 'Confirmada',
      editActivo: true
    }
  });

  const resetFormData = () => {
    setFormData({
      id: '',
      estado: 'Confirmada',
      activo: true
    });
  };

  const cambioData = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const cambioDataEditar = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setState((previous) => ({
      ...previous,
      selectedEstadoCita: {
        ...previous.selectedEstadoCita,
        [name]: newValue,
      },
    }));
  };
  

  const resetError = () => {
    setTimeout(() => {
      setState(previous => ({ ...previous, error: '' }));
    }, 2000);
  }

  const resetSuccess = () => {
    setTimeout(() => {
      setState(previous => ({
        ...previous, success: ''
      }));
    }, 2000);
  }

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
      setDatos(responseData);
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
        setState({
          ...state, success: 'Estado de cita creado con éxito'
        });
        getDatos();
        resetFormData();
        resetSuccess();
      } else {
        setState({
          ...state, error: 'Error al enviar datos'
        });
        resetError()
      }
    } catch (error) {
      setState({
        ...state, error: "Error al enviar datos"
      });
      resetError()
    }
  };

  const enviarDataPUT = async () => {
    const data = {
      id: state.selectedEstadoCita.editId,
      estado: state.selectedEstadoCita.editEstado,
      activo: state.selectedEstadoCita.editActivo,
    };
    
  
    try {
      const response = await fetch(`${url}/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        setState(previous => ({ ...previous, success: 'Estado de cita actualizado con éxito' }));
        getDatos();
        resetSuccess();
      } else {
        setState(previous => ({ ...previous, error: 'Error al enviar datos' }));
        resetError();
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
      resetError();
    }
  };
  
  const enviarDataDelete = async () => {
    try {
      const { editId } = state.selectedEstadoCita;
      const response = await fetch(`${url}/${editId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
  
      if (response.ok) {
        // Eliminación exitosa, ahora puedes mostrar el mensaje de éxito
        setState(previous => ({ ...previous, success: 'Estado de cita eliminado con éxito' }));
        
        // Actualiza la lista de datos después de la eliminación
        const updatedDatos = datos.filter(item => item.id !== editId);
        setDatos(updatedDatos);
  
        // Cierra el modal
        handleCloseModal();
  
        // Borra el mensaje de éxito después de 2 segundos (2000 ms)
        setTimeout(() => {
          setState(previous => ({ ...previous, success: null }));
        }, 2000);
      } else {
        setState(previous => ({ ...previous, error: 'Error al enviar datos' }));
        resetError();
      }
    } catch (error) {
      setState(previous => ({ ...previous, error: 'Error al enviar datos' }));
      resetError();
    }
  }
  
  
  const handleOpenModal = (modalName) => {
    setState((previous) => ({ ...previous, [modalName]: true }));
  };

  const handleCloseModal = () => {
    setState(previous => ({
      ...previous,
      modalIsOpen: false,
      deleteOpen: false,
      editOpen: false
    }));
  };

  useEffect(() => {
    getDatos();
  }, []);

  return (
    <>
      <h2>Estados de Citas</h2>
      <div className="container mt-2">
        <div className="card-body">
          <Form onSubmit={enviarDatos}>
            {state.error ? <div className="notificacion error">{state.error}</div> : null}
            {state.success ? <div className="notificacion success">{state.success}</div> : null}
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={formData.estado}
                onChange={cambioData}
              >
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Pospuesta">Pospuesta</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Activo</Form.Label>
              <Form.Check
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={cambioData}
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
                  <th>Estado</th>
                  <th>Activo</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.estado}</td>
                    <td>{item.activo ? 'Sí' : 'No'}</td>
                    <td>
                      <button onClick={() => {
                        setState(previous => ({ ...previous, selectedEstadoCita: { ...previous.selectedEstadoCita, editId: item.id, editEstado: item.estado, editActivo: item.activo } }))
                        handleOpenModal("editOpen");
                      }}>Editar</button>
                    </td>
                    <td>
                      <button onClick={() => {
                        setState(previous => ({ ...previous, selectedEstadoCita: { ...previous.selectedEstadoCita, editId: item.id } }))
                        handleOpenModal("deleteOpen");
                      }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      <Modal isOpen={state.editOpen} onClose={handleCloseModal}>
        <div className>
          <h1>Editar Estado de Cita</h1>
          <form>
            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="editEstado"
                className="form-control"
                value={state.selectedEstadoCita.editEstado}
                onChange={cambioDataEditar}
              >
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Pospuesta">Pospuesta</option>
              </select>
            </div>
            <div className="form-group">
  <label htmlFor="activo">Activo</label>
  <input
    type="checkbox"
    id="activo"
    name="editActivo"
    checked={state.selectedEstadoCita.editActivo} // Usar el estado seleccionado
    onChange={cambioDataEditar}
  />
</div>
            <div className="d-flex justify-content-end gap-3 mt-7">
              <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
              <Button variant="primary" onClick={() => {
                enviarDataPUT();
                handleCloseModal();
              }}>Guardar Cambios</Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal de Eliminar */}
      <Modal showCloseButton={false} isOpen={state.deleteOpen} onClose={handleCloseModal}>
        <div className="d-flex justify-content-center">
          <h5>¿Estás seguro que deseas eliminar este estado de cita?</h5>
          <div className="d-flex justify-content-end gap-3 mt-7">
            <Button variant="danger" onClick={() => {
              enviarDataDelete();
              handleCloseModal();
            }}>Eliminar</Button>
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EstadosCita;


