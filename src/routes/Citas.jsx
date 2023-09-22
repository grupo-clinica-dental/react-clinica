
import  { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";
import Modal from '../components/modal'

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
      edit_fecha_inicio: '',
      edit_fecha_fin: '',
      editdoctor_id: '',
      editpaciente_id: '',
      editestado_id: '',
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

  const handleOpenModal = (modalToOpen) => {
    setState(previous => ({
      ...previous,
      [modalToOpen]: true
    }));
  }

  const changeSelectedCita = (item) => {
    setState({
      ...state,
      selectedCita: {
        editid: item.id,
        edit_fecha_inicio: item.fecha_inicio,
        edit_fecha_fin: item.fecha_fin,
        editdoctor_id: item.doctor.id,
        editpaciente_id: item.paciente.id,
        editestado_id: item.estado_cita.id,
      },
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
        const newRepsonse = await response.json();
        setState({
          ...state, error: newRepsonse.message
        });
        await getDatos();
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

  const enviarDataPUT = async (e) => {

    e.preventDefault();
    

    try {

      const data ={ 
        fecha_fin : state.selectedCita.edit_fecha_fin,
        fecha_inicio : state.selectedCita.edit_fecha_inicio,
        doctor_id : state.selectedCita.editdoctor_id,
        paciente_id : state.selectedCita.editpaciente_id,
        estado_id : state.selectedCita.editestado_id,
        id : state.selectedCita.editid
      }

      const response = await fetch(url + '/' + data.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });


      console.log(response)

      if (response.ok) {
        setState(previous => ({ ...previous, success: 'Datos enviados correctamente', showEditModal: false }) );
        resetSuccess();
      await  getDatos();
        resetFormData();
      } else {
        setState(previous => ({ ...previous, error: 'Error al enviar datos' }) );
        resetError();
      }
    } catch (error) {
      resetError();

    }
  };

  const enviarDataDelete = async () => {
    try {
      const response = await fetch(url + '/' + state.selectedCita.editid, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {

        setState(previous => ({ ...previous, success: 'Cita eliminada con éxito', showDeleteModal: false }) )
        resetSuccess();
     await  getDatos();
        resetFormData();
      } else {
        setState(previous => ({ ...previous, error: 'Error al eliminar la cita' }) );
        resetError();
      }
    } catch (error) {
      setState(previous => ({ ...previous, error: 'Error al eliminar la cita' }) );
      resetError();
    }
  };




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
        setState(previous => ({ ...previous, error: 'Algo salio mal en doctores' }));
        resetError();
      }
  } catch (error) {
    setState(previous => ({ ...previous, error: 'Algo salio mal doctores' }));
    resetError();
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
        setState(previous => ({ ...previous, error: 'Algo salio mal en estados citas' }));
    resetError();

      }
  } catch (error) {
    setState(previous => ({ ...previous, error: 'Algo salio mal en estados citas' }));
    resetError();

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
    setState(previous => ({ ...previous, error: 'Algo salio mal' }));
    resetError();
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
                          handleOpenModal('showEditModal');
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

<Modal isOpen={state.showEditModal} onClose={handleCloseModal}>
          <h1>Editar Cita</h1>
                        {/* // copilot creame el formulario con los name que te pongo en el state.selectedCita */}

                        <Form onSubmit={enviarDataPUT}>
      <Form.Group>
        <Form.Label>Fecha Inicio</Form.Label>
        <Form.Control
          type='date'
          name='edit_fecha_inicio'
          value={state.selectedCita.edit_fecha_inicio}
          onChange={cambioEditData}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Fecha Fin</Form.Label>
        <Form.Control
          type='date'
          name='edit_fecha_fin'
          value={state.selectedCita.edit_fecha_fin}
          onChange={cambioEditData}
        />
      </Form.Group>
      <Form.Group>
    <Form.Label>Doctor ID</Form.Label>
    <Form.Control as="select" name='editdoctor_id'  value={state.selectedCita.editdoctor_id} onChange={cambioEditData}>  <option value="">Selecciona El Doctor</option>
        {state.doctores.map(doctor => <option key={doctor.doctor_id} value={doctor.doctor_id}>  {doctor.doctor_name}</option>)}
    </Form.Control>
</Form.Group>

      <Form.Group>
    <Form.Label>Paciente</Form.Label>
    <Form.Control as="select" name='editpaciente_id' value={state.selectedCita.editpaciente_id} onChange={cambioEditData}>
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
    <Form.Control as="select" name='editestado_id' value={state.selectedCita.editestado_id} onChange={cambioEditData}><option value="">Selecciona el Estado de la Cita</option>
        {state.estadosCitas.map((estado) => (
            <option key={`${estado.id}${estado.estado}`} value={estado.id}>{estado.estado}</option>
        ))}
    </Form.Control>
</Form.Group>

      <Button variant="primary" type="submit">
        Enviar
      </Button>
    </Form>
</Modal>

<Modal >

  <h1>Editar Cita</h1>
</Modal>


      {/* Modal de Eliminar */}
      <Modal
      isOpen={state.showDeleteModal} 
      onClose={handleCloseModal}
        showCloseButton={false}
      >
        <div className>
          <h5>¿Estás seguro que deseas eliminar esta Cita?</h5>
          <div className="d-flex justify-content-end gap-3 mt-7">
            <Button variant="danger" onClick={() => {
              enviarDataDelete();
            }}>
              Eliminar
            </Button>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

   
   
</>

  );
};

export default Citas;
