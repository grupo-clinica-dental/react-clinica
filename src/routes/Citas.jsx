
import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";

const url = `${API_URL}/api/citas`;

export const Citas = () => {
  const token = useAuthStore2((state) => state.token);
  const [formData, setFormData] = useState({
    id: '',
    fecha_hora: '',
    doctor_id: '',
    paciente_id: '',
    estado_id: '',
    google_calendar_event_id: '',
    ubicacion: '',
    descripcion: '',
    notas: ''
  });
  const [state, setState] = useState({
    error: null,
    success: null
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);

  const resetFormData = () => {
    setFormData({
      id: '',
      fecha_hora: '',
      doctor_id: '',
      paciente_id: '',
      estado_id: '',
      google_calendar_event_id: '',
      ubicacion: '',
      descripcion: '',
      notas: ''
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
      setDatos(responseData.item_cita);
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
        setState({
          ...state, error: "Error al enviar datos"
        });
        setTimeout(() => {
          setState({
            ...state, error: ''
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
        getDatos();
        resetFormData();
        setShowEditModal(false); 
      } else {
        console.error("Error al actualizar datos", await response.json());
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
    }
  };

  const enviarDataDelete = async (item) => {
    try {
      const response = await fetch(url + '/' + item.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        getDatos();
        resetFormData();
        setShowDeleteModal(false); 
      } else {
        console.error("Error al eliminar datos", await response.json());
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
    }
  };
  function actualizarForm(item) {
    setFormData({
      id: item.id,
      fecha_hora: item.fecha_hora,
      doctor_id: item.doctor_id,
      paciente_id: item.paciente_id,
      estado_id: item.estado_id,
      google_calendar_event_id: item.google_calendar_event_id,
      ubicacion: item.ubicacion,
      descripcion: item.descripcion,
      notas: item.notas
    });
    setShowEditModal(true); // Esto abrirá el modal de edición
}


  useEffect(() => {
    getDatos();
  }, []);

  return (
    <>
    <h2> Registro de Citas</h2>
    <div className="container mt-2">
        <div className="card-body">
        <Form onSubmit={enviarDatos}>
  
    <Form.Group>
        <Form.Control type='hidden' name='id' value={formData.id} onChange={cambioData} />
    </Form.Group>

            <Form.Group>
        <Form.Label>Fecha y Hora</Form.Label>
        <Form.Control type='datetime-local' name='fecha_hora' value={formData.fecha_hora} onChange={cambioData} />
    </Form.Group>

    <Form.Group>
        <Form.Label>Doctor ID</Form.Label>
        <Form.Control type='text' name='doctor_id' value={formData.doctor_id} onChange={cambioData} />
    </Form.Group>

    <Form.Group>
        <Form.Label>Paciente ID</Form.Label>
        <Form.Control type='text' name='paciente_id' value={formData.paciente_id} onChange={cambioData} />
    </Form.Group>

    <Form.Group>
        <Form.Label>Estado ID</Form.Label>
        <Form.Control type='text' name='estado_id' value={formData.estado_id} onChange={cambioData} />
    </Form.Group>

    <Form.Group>
        <Form.Label>ID de Evento en Google Calendar</Form.Label>
        <Form.Control type='text' name='google_calendar_event_id' value={formData.google_calendar_event_id} onChange={cambioData} />
    </Form.Group>

    <Form.Group>
        <Form.Label>Ubicación</Form.Label>
        <Form.Control type='text' name='ubicacion' value={formData.ubicacion} onChange={cambioData} />
    </Form.Group>

    <Form.Group>
        <Form.Label>Descripción</Form.Label>
        <Form.Control type='text' name='descripcion' value={formData.descripcion} onChange={cambioData} />
    </Form.Group>

    <Form.Group>
        <Form.Label>Notas</Form.Label>
        <Form.Control type='text' name='notas' value={formData.notas} onChange={cambioData} />
    </Form.Group>

    <div className="d-flex justify-content-end mt-3">
        <Button variant='primary' type='submit'>Enviar Datos</Button>
    </div>
</Form>
        </div>
    </div>

    <div className="row mt-5">
        <div className="col-md-12">
            <h1 className="mb-4">Reporte de Citas</h1>
            <Table striped bordered hover>
    <thead>
        <tr>
            <th>ID</th>
            <th>Fecha y Hora</th>
            <th>Doctor ID</th>
            <th>Paciente ID</th>
            <th>Estado ID</th>
            <th>ID de Evento en Google Calendar</th>
            <th>Ubicación</th>
            <th>Descripción</th>
            <th>Notas</th>
            <th>Editar</th>
            <th>Eliminar</th>
        </tr>
    </thead>
    <tbody>
        {datos.map((item, i) => (
            <tr key={i}>
                <td>{item.id}</td>
                <td>{item.fecha_hora}</td>
                <td>{item.doctor_id}</td>
                <td>{item.paciente_id}</td>
                <td>{item.estado_id}</td>
                <td>{item.google_calendar_event_id}</td>
                <td>{item.ubicacion}</td>
                <td>{item.descripcion}</td>
                <td>{item.notas}</td>
                <td>
                    <Button
                        variant='info'
                        onClick={() => {
                           
                            actualizarForm(item);
                        }}
                    >
                        Editar
                    </Button>
                </td>
                <td>
                    <Button
                        variant='danger'
                        onClick={() => {
                            setSelectedCita(item); 
                            setShowDeleteModal(true); 
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
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Editar Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={enviarDatos}>
                <Form.Group>
                    <Form.Label>Fecha y Hora</Form.Label>
                    <Form.Control
                        type='datetime-local'
                        name='fecha_hora'
                        value={formData.fecha_hora}
                        onChange={cambioData}
                    />
                </Form.Group>
                <Form.Group>
    <Form.Label>Doctor ID</Form.Label>
    <Form.Control
        type='text'
        name='doctor_id'
        value={formData.doctor_id}
        onChange={cambioData}
    />
</Form.Group>

<Form.Group>
    <Form.Label>Paciente ID</Form.Label>
    <Form.Control
        type='text'
        name='paciente_id'
        value={formData.paciente_id}
        onChange={cambioData}
    />
</Form.Group>

<Form.Group>
    <Form.Label>Estado ID</Form.Label>
    <Form.Control
        type='text'
        name='estado_id'
        value={formData.estado_id}
        onChange={cambioData}
    />
</Form.Group>

<Form.Group>
    <Form.Label>ID de Evento en Google Calendar</Form.Label>
    <Form.Control
        type='text'
        name='google_calendar_event_id'
        value={formData.google_calendar_event_id}
        onChange={cambioData}
    />
</Form.Group>

<Form.Group>
    <Form.Label>Ubicación</Form.Label>
    <Form.Control
        type='text'
        name='ubicacion'
        value={formData.ubicacion}
        onChange={cambioData}
    />
</Form.Group>

<Form.Group>
    <Form.Label>Descripción</Form.Label>
    <Form.Control
        type='textarea'
        name='descripcion'
        value={formData.descripcion}
        onChange={cambioData}
    />
</Form.Group>

<Form.Group>
    <Form.Label>Notas</Form.Label>
    <Form.Control
        type='textarea'
        name='notas'
        value={formData.notas}
        onChange={cambioData}
    />
</Form.Group>



                <div className="d-flex justify-content-end mt-3">
                    <Button variant='primary' type='submit'>Guardar Cambios</Button>
                </div>
            </Form>
        </Modal.Body>
    </Modal>

  
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Eliminar Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>¿Estás seguro de que deseas eliminar esta cita?</p>
            <Button
                variant='danger'
                onClick={() => {
                    enviarDataDelete(selectedCita);
                }}
            >
                Sí, Eliminar
            </Button>
        </Modal.Body>
    </Modal>
</>

  );
};

export default Citas;
