import { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Modal from '../components/modal';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";

const url = `${API_URL}/api/especialidades`;

const Especialidades = () => {
  const token = useAuthStore2((state) => state.token);
  const [formData, setFormData] = useState({
    nombre: "",
  });

  const [state, setState] = useState({
    error: null,
    success: null,
    modalIsOpen: false,
    selectedEspecialidad: {
      editnombre: "",
      id: "",
    },
    deleteOpen: false,
    itemToDelete: null,
  });

  const handleCloseModal = () => {
    setState((previous) => ({ ...previous, modalIsOpen: false, deleteOpen: false }));
  }

  const changeSelectedEspecialidad = (item) => {
    setState((previous) => ({
      ...previous,
      selectedEspecialidad: {
        editnombre: item.nombre,
        id: item.id
      }
    }));
  }

  const resetFormData = () => {
    setFormData({
      id: "",
      nombre: "",
    });
  }

  const cambiodata = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const Enviardatos = async (event) => {
    event.preventDefault();

    if (formData.id) {
      enviarDataPUT();
    } else {
      enviarDataPost();
    }
  };

  const enviarDataPost = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setState((previous) => ({
          ...previous,
          success: 'Especialidad creada con éxito',
        }));
        getDatos();
        resetFormData();
        setTimeout(() => {
          setState((previous) => ({ ...previous, success: '' }));
        }, 2000);
      } else {
        setState((previous) => ({
          ...previous,
          error: 'Error al crear la especialidad',
        }));
        setTimeout(() => {
          setState((previous) => ({ ...previous, error: '' }));
        }, 2000);
      }
    } catch (error) {
      setState((previous) => ({
        ...previous,
        error: 'Error al enviar los datos.',
      }));
      setTimeout(() => {
        setState((previous) => ({ ...previous, error: '' }));
      }, 2000);
      console.error("Error al enviar los datos");
    }
  }

  const enviarDataPUT = async (e) => {
    e.preventDefault();

    const data = {
      nombre: state.selectedEspecialidad.editnombre,
      id: state.selectedEspecialidad.id
    }

    try {
      const response = await fetch(`${url}/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setState((previous) => ({
          ...previous,
          modalIsOpen: false,
          success: 'Especialidad actualizada con éxito',
        }));
        getDatos();
        setTimeout(() => {
          setState((previous) => ({ ...previous, success: '' }))
        }, 2000);
      } else {
        setState((previous) => ({
          ...previous,
          modalIsOpen: false,
          error: 'Error al actualizar la especialidad',
        }));
        setTimeout(() => {
          setState((previous) => ({ ...previous, error: '' }));
        }, 2000);
      }
    } catch (error) {
      setState((previous) => ({
        ...previous,
        modalIsOpen: false,
        error: 'Error al actualizar la especialidad',
      }));
      setTimeout(() => {
        setState((previous) => ({ ...previous, error: '' }));
      }, 2000);
      console.error(error);
    }
  }

  const enviarDataDelete = async (item) => {
    try {
      setState((previous) => ({
        ...previous,
        deleteOpen: true,
        itemToDelete: item,
      }));
    } catch (error) {
      console.error("Error al enviar los datos");
    }
  }

  const confirmarEliminar = async () => {
    const item = state.itemToDelete;
    try {
      const response = await fetch(`${url}/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setState((previous) => ({
          ...previous,
          deleteOpen: false,
          success: 'Especialidad eliminada con éxito',
        }));
        getDatos();
        resetFormData();
      } else {
        setState((previous) => ({
          ...previous,
          deleteOpen: false,
          error: 'Error al eliminar la especialidad',
        }));
      }

      setState((previous) => ({
        ...previous,
        itemToDelete: null,
      }));

      setTimeout(() => {
        setState((previous) => ({
          ...previous,
          success: null,
          error: null,
        }));
      }, 2000);
    } catch (error) {
      console.error("Error al enviar los datos");
    }
  }

  const [Data, setData] = useState([]);

  const getDatos = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const responseData = await response.json();

    if (response.ok) {
      setData(responseData);
    } else {
      setData([]);
      resetFormData();
    }
  };

  useEffect(() => {
    getDatos();
  }, []);

  return (
    <>
      {state.error ? (
        <div className="notificacion error">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="notificacion success">{state.success}</div>
      ) : null}

      <Modal isOpen={state.modalIsOpen} onClose={handleCloseModal}>
        <h1>Editar Especialidad</h1>
        <Form className="flex flex-col gap-y-8" onSubmit={enviarDataPUT}>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="editnombre"
              onChange={(e) => {
                setState((previous) => ({
                  ...previous,
                  selectedEspecialidad: { ...previous.selectedEspecialidad, editnombre: e.target.value }
                }))
              }}
              value={state.selectedEspecialidad.editnombre}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Actualizar Especialidad
          </Button>
        </Form>
      </Modal>

      <h2> Especialidades</h2>
      <Form onSubmit={Enviardatos}>
        <Form.Group>
          <Form.Control
            type="hidden"
            name="id"
            value={formData.id}
            onChange={cambiodata}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Nombre Especialidad</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={cambiodata}
          />
        </Form.Group>
        <br />
        <Button variant="primary" type="submit">
          Enviar Datos
        </Button>
      </Form>
      <h1>Reporte</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre Especialidad</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Data.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>
                <button type="button" className="btn btn-warning" onClick={() => {
                  changeSelectedEspecialidad(item);
                  setState((previous) => ({ ...previous, modalIsOpen: true }));
                }}>
                  Actualizar
                </button>
              </td>
              <td>
                <button type="button" className="btn btn-danger" onClick={() => enviarDataDelete(item)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Modal de Eliminación */}
      <Modal isOpen={state.deleteOpen} onClose={() => setState((previous) => ({ ...previous, deleteOpen: false }))}>
        <h1>Eliminar Especialidad</h1>
        <p>¿Estás seguro que deseas eliminar esta especialidad?</p>
        <div className="d-flex justify-content-end gap-3 mt-7">
          <Button variant="danger" onClick={confirmarEliminar}>
            Eliminar
          </Button>
          <Button variant="secondary" onClick={() => setState((previous) => ({ ...previous, deleteOpen: false }))}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Especialidades;
