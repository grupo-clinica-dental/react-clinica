import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import Modal from '../components/modal'; // Asegúrate de importar tu modal si lo tienes
import { useAuthStore2 } from '../zustand-stores/auth-store';
import { API_URL } from '../api/api.config';

const url = `${API_URL}/api/rutas`;

export const Rutas = () => {
  const [formData, setFormData] = useState({
    nombre_ruta: '',
    activa: true,
  });

  const [state, setState] = useState({
    error: null,
    success: null,
    modalIsOpen: false,
    selectedRuta: {
      editnombre_ruta: '',
      editactiva: true,
    },
  });

  const token = useAuthStore2((state) => state.token);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setState((previous) => ({
      ...previous,
      selectedRuta: { ...previous.selectedRuta, [name]: value },
    }));
  };

  const handleOpenModal = () => {
    setState((previous) => ({ ...previous, modalIsOpen: true }));
  };

  const handleCloseModal = () => {
    setState((previous) => ({ ...previous, modalIsOpen: false }));
  };

  const changeSelectedRuta = (ruta) => {
    setState((previous) => ({
      ...previous,
      selectedRuta: {
        editnombre_ruta: ruta.nombre_ruta,
        editactiva: ruta.activa,
        id: ruta.id,
      },
    }));
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
        setState({ ...state, success: 'Ruta creada con éxito' });

        setFormData({
          nombre_ruta: '',
          activa: true,
        });

        setTimeout(() => {
          setState({ ...state, success: null });
        }, 2000);

        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((response) => setData(response))
          .catch((error) => console.error(error));
      } else {
        const responseBody = await response.json();

        setState({ ...state, error: responseBody.message });
        setTimeout(() => {
          setState((previous) => ({ ...previous, error: null }));
        }, 2000);
      }
    } catch (error) {
      setState((previous) => ({ ...previous, error: 'Ha ocurrido un error' }));
    }
  };

  const [data, setData] = useState([]);

  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    const rutaId = state.selectedRuta?.id;

    const data = {
      nombre_ruta: state.selectedRuta?.editnombre_ruta,
      activa: state.selectedRuta?.editactiva,
    };

    try {
      const response = await fetch(`${url}/${rutaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setState((previous) => ({
          ...previous,
          success: 'Ruta actualizada con éxito',
        }));
        handleCloseModal();
        setFormData({
          nombre_ruta: '',
          activa: true,
        });
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((response) => {
            setData(response);
          })
          .catch((error) => console.error(error));

        setTimeout(() => {
          setState((previous) => ({ ...previous, success: null }));
        }, 2000);
      } else {
        const responseBody = await response.json();
        setState({ ...state, error: responseBody.message });

        setData([]);

        setTimeout(() => {
          setState({ ...state, error: null });
        }, 2000);
      }
    } catch (error) {
      setState({ ...state, error: 'Ha ocurrido un error' });
    }
  };

  useEffect(() => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setData(response);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Modal isOpen={state.modalIsOpen} onClose={handleCloseModal}>
        <h1>Editar Ruta</h1>
        <Form onSubmit={handleSubmitEdit}>
          <Form.Group>
            <Form.Label>Nombre de Ruta</Form.Label>
            <Form.Control
              type="text"
              name="editnombre_ruta"
              value={state.selectedRuta.editnombre_ruta}
              onChange={handleEditChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Ruta Activa</Form.Label>
            <Form.Check
              type="checkbox"
              name="editactiva"
              checked={state.selectedRuta.editactiva}
              onChange={handleEditChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Actualizar Ruta
          </Button>
        </Form>
      </Modal>
      <h1>Rutas</h1>

      <Form onSubmit={handleSubmit}>
        {state.error ? (
          <div className="notificacion error">{state.error}</div>
        ) : null}
        {state.success ? (
          <div className="notificacion success">{state.success}</div>
        ) : null}

        <Form.Group>
          <Form.Label>Nombre de Ruta</Form.Label>
          <Form.Control
            type="text"
            name="nombre_ruta"
            value={formData.nombre_ruta}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Ruta Activa</Form.Label>
          <Form.Check
            type="checkbox"
            name="activa"
            checked={formData.activa}
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Enviar Datos
        </Button>
      </Form>

      <h1>Reporte</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre de Ruta</th>
            <th>Ruta Activa</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nombre_ruta}</td>
                <td>{item.activa ? 'Sí' : 'No'}</td>
                <td>
                  <Button
                    onClick={() => {
                      handleOpenModal();
                      changeSelectedRuta(item);
                    }}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay datos</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default Rutas;
