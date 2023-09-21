
import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";

const url = `${API_URL}/api/citas`;

export const Citas = () => {
  const token = useAuthStore2((state) => state.token);
  const [formData, setFormData] = useState({
    id: '',
    fecha_inicio: '',
    fecha_fin: '',
    doctor_id: '',
    paciente_id: '',
    estado_id: '',
  });
  const [state, setState] = useState({
    error: null,
    success: null,
    citas: [],
    doctores: [],
    pacientes: [],
    estadosCitas: [],
    selectedCita: {
      editid: '',
      editfecha_hora: '',
      editdoctor_id: '',
      editpaciente_id: '',
      editestado_id: '',
      editnotas: ''
    },
    showEditModal: false,
    showDeleteModal: false
  });


  const resetFormData = () => {
    setFormData({
      id: '',
      fecha_inicio: '',
      fecha_fin: '',
      doctor_id: '',
      paciente_id: '',
      estado_id: '',
    });
  };

  const resetSuccess = () => {
  setTimeout(() => {
      setState(previous => ({ ...previous, success: null }) );
  }, 2000);
  }
  const cambioData = (event) => {
    const { name, value } = event.target;
    setFormData(previous => ( {...previous, [name]: value} )  );
  };

  const cambioEditData = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      selectedCita: {
        ...state.selectedCita,
        [name]: value
      }
    });
  }

  const handleCloseModal = () => {
    setState(previous => ({
      ...previous,
      showEditModal: false,
      showDeleteModal: false
    })); // Esto limpia el state
  }

  const changeSelectedCita = (item) => {
    setState({
      ...state,
      selectedCita: {
        editid: item.id,
        editfecha_hora: item.fecha_hora,
        editdoctor_id: item.doctor_id,
        editpaciente_id: item.paciente_id,
        editestado_id: item.estado_id,
        editnotas: item.notas
      },
      showEditModal: true
    });
  }

  const enviarDatos = async (event) => {
    event.preventDefault();

    if (formData.id) {
      enviarDataPUT();
    } else {
      enviarDataPost();
    }
  };

  const resetError = () => {
setTimeout(() => {
    setState(previous => ({ ...previous, error: null }) );
}, 2000);
  }


  const getDatos = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const responseData = await response.json();

    if (response.ok) {
      setState(previous => ({
        ...previous,
        citas: responseData.item_cita
      }));
    } else {
      setState(previous => ({
        ...previous,
        error: 'Algo salio mal'
      }));
      resetFormData();
      resetError();
    }
  };

  const enviarDataPost = async (e) => {
    e.preventDefault();
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
        setState(previous => ( { ...previous, success: 'Datos enviados correctamente' } ));

       await getDatos();
        resetFormData();
        resetSuccess();
      } else {
        setState({
          ...state, error: "Error al enviar datos"
        });
        resetError( )
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
      setState({
        ...state, error: "Error al enviar datos"
      });
      resetError()
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
      await  getDatos();
        resetFormData();
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
     await  getDatos();
        resetFormData();
      } else {
        console.error("Error al eliminar datos", await response.json());
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
    }
  };

//   function actualizarForm(item) {
//     setFormData({
//       id: item.id,
//       fecha_hora: item.fecha_hora,
//       doctor_id: item.doctor_id,
//       paciente_id: item.paciente_id,
//       estado_id: item.estado_id,
//       google_calendar_event_id: item.google_calendar_event_id,
//       ubicacion: item.ubicacion,
//       descripcion: item.descripcion,
//       notas: item.notas
//     });
//     setShowEditModal(true); // Esto abrirá el modal de edición
// }


const obtenerDoctores = async () => {
  try {
      const response = await fetch(`${API_URL}/api/doctores`, {
          method: "GET",
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      const data = await response.json();
      if (response.ok) {
        setState(previous => ({ ...previous, doctores: data }));
      } else {
        setState(previous => ({ ...previous, error: 'Algo salio mal' }));
        resetError();
      }
  } catch (error) {
      console.error("Error al hacer la solicitud de doctores:", error);
  }
};
const obtenerEstadosCitas = async () => {
  try {
      const response = await fetch(`${API_URL}/api/estadoCita`, {
          method: "GET",
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      const data = await response.json();
      if (response.ok) {
      setState(previous => ({ ...previous, estadosCitas: data }));
      } else {
          console.error("Error al obtener estados de citas");
      }
  } catch (error) {
      console.error("Error al hacer la solicitud de estados de citas:", error);
  }
};
const getPacientes = async () => {
  const response = await fetch(`${API_URL}/api/pacientes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.ok) {
      const data = await response.json();
   setState(previous => ({ ...previous, pacientes: data.item_paciente }));
  } else {
      console.error("Error al obtener pacientes", await response.text());
  }
};


  useEffect(() => {
    getDatos();
      obtenerDoctores();
      obtenerEstadosCitas();
      getPacientes();
  }, []);

  return (
    <>
          {state.error ? (
        <div className="notificacion error">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="notificacion success">{state.success}</div>
      ) : null}
    <h2> Registro de Citas</h2>
    <div className="container mt-2">
        <div className="card-body">
        <Form onSubmit={enviarDataPost}>
  
    <Form.Group>
        <Form.Control type='hidden' name='id' value={formData.id} onChange={cambioData} />
    </Form.Group>

            <Form.Group>
        <Form.Label>Fecha Inicio</Form.Label>
        <Form.Control type='date' name='fecha_inicio' value={formData.fecha_inicio} onInput={cambioData} />
    </Form.Group>

    <Form.Group>
        <Form.Label>Fecha Final</Form.Label>
        <Form.Control type='date' name='fecha_fin' value={formData.fecha_fin} onInput={cambioData} />
    </Form.Group>

    <Form.Group>
    <Form.Label>Doctor ID</Form.Label>
    <Form.Control as="select" name='doctor_id'  value={formData.doctor_id} onChange={cambioData}>  <option value="">Selecciona El Doctor</option>
        {state.doctores.map(doctor => <option key={doctor.doctor_id} value={doctor.doctor_id}>  {doctor.doctor_name}</option>)}
    </Form.Control>
</Form.Group>

<Form.Group>
    <Form.Label>Paciente</Form.Label>
    <Form.Control as="select" name='paciente_id' value={formData.paciente_id} onChange={cambioData}>
        <option value="">Seleccione El Paciente</option>
        {state.pacientes && state.pacientes.map(paciente => (
            <option key={paciente.id} value={paciente.id}>
                {paciente.nombre} {paciente.apellido}
            </option>
        ))}
    </Form.Control>
</Form.Group>


<Form.Group>
    <Form.Label>Estado Cita</Form.Label>
    <Form.Control as="select" name='estado_id' value={formData.estado_id} onChange={cambioData}><option value="">Selecciona el Estado de la Cita</option>
        {state.estadosCitas.map((estado) => (
            <option key={`${estado.id}${estado.estado}`} value={estado.id}>{estado.estado}</option>
        ))}
    </Form.Control>
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
            <th>Fecha Inicio</th>
            <th>Fecha Final</th>
            <th>Doctor</th>
            <th>Paciente</th>
            <th>Estado</th>
            <th>Editar</th>
            <th>Eliminar</th>
        </tr>
    </thead>
    <tbody>
        {state.citas.map((item, i) => (
            <tr key={i}>
                <td>{item.id}</td>
                <td>{new Date(item.fecha_inicio).toLocaleString('es', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
<td>{new Date(item.fecha_fin).toLocaleString('es', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>

                <td>{item.doctor.nombre}</td>
                <td>{item.paciente.nombre}</td>
                <td>{item.estado_cita.nombre}</td>
                <td>
                    <Button
                        variant='info'
                        onClick={() => {
                           changeSelectedCita(item);
                        }}
                    >
                        Editar
                    </Button>
                </td>
                <td>
                    <Button
                        variant='danger'
                        onClick={() => {
                          changeSelectedCita(item); 
                          setState(previous => ({
                            ...previous,
                            selectedCita: {...previous.selectedCita, editid: item.id},
                            showDeleteModal: true
                          }))
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

   
    {/* <Modal show={state.showEditModal} onHide={() => handleCloseModal}>
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
    <Form.Control as="select" name='doctor_id'  value={formData.doctor_id} onChange={cambioData}>  <option value="">Selecciona El Doctor</option>
        {state.doctores.map(doctor => <option key={doctor.id} value={doctor.id}>  {doctor.nombre}</option>)}
    </Form.Control>
</Form.Group>

<Form.Group>
    <Form.Label>Paciente</Form.Label>
    <Form.Control as="select" name='paciente_id' value={formData.paciente_id} onChange={cambioData}>
        <option value="">Seleccione El Paciente</option>
        {state.pacientes && state.pacientes.map(paciente => (
            <option key={paciente.id} value={paciente.id}>
                {paciente.nombre} {paciente.apellido}
            </option>
        ))}
    </Form.Control>
</Form.Group>


<Form.Group>
    <Form.Label>Estado Cita</Form.Label>
    <Form.Control as="select" name='estado_id' value={formData.estado_id} onChange={cambioData}><option value="">Selecciona el Estado de la Cita</option>
        {state.estadosCitas.map((estado) => (
            <option key={`${estado.id}${estado.estado}`} value={estado.id}>{estado.estado}</option>
        ))}
    </Form.Control>
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
    </Modal> */}

  
    {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
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
    </Modal> */}
</>

  );
};

export default Citas;
