
import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const url = "http://localhost:3000/api/citas";
const urlPacientes = "http://localhost:3000/api/pacientes";
const urlDoctores = "http://localhost:3000/api/doctores";


export const Citas = () => {
  const [formData, setFormData] = useState({
    fecha_hora: '',
    doctor_id: '',
    paciente_id: '',
    estado_id: '',
    google_calendar_event_id: '',
    ubicacion: '',
    descripcion: '',
    notas: ''
  });

  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);

  const cambioData = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const enviarDatos = async (event) => {
        event.preventDefault();
    
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
    
          if (response.ok) {
            const responseData = await response.json();
            console.log("Datos Enviados");
            console.log(responseData);
            getCitas(); 
          } else {
            const responseBody = await response.json();
            console.log("Error al enviar datos");
            console.log(responseBody);
          }
        } catch (error) {
          console.error("Error al enviar datos", error);
        }
      };

  const cargarPacientes = async () => {
    try {
      const response = await fetch(urlPacientes);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.item_paciente)) {
          setPacientes(data.item_paciente);
        } else {
          console.error("La respuesta no contiene el array esperado:", data);
        }
      } else {
        console.error("Error al cargar pacientes");
      }
    } catch (error) {
      console.error("Error al cargar pacientes", error);
    }
  };
  
  const cargarDoctores = async () => {
    try {
      const response = await fetch(urlDoctores);
      if (response.ok) {
        const data = await response.json();
        setDoctores(data);  
      } else {
        console.error("Error al cargar doctores");
      }
    } catch (error) {
      console.error("Error al cargar doctores", error);
    }
};

  const [data, setData] = useState([]);

  const getCitas = async () => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseData = await response.json();

    if (response.ok && responseData.item_cita) {
      setData(responseData.item_cita);
    } else {
      setData([]);
    }
  };


  useEffect(() => {
    cargarPacientes();
    getCitas();
    cargarDoctores();
  }, []);

  return (
    <>
  
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-12"></div>
        </div>
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <div className="card">
              <div className="card-header">Registrar Cita</div>
              <div className="card-body">
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
                    <Form.Label>ID del Paciente</Form.Label>
                    <Form.Control
                      as="select"
                      name='paciente_id'
                      value={formData.paciente_id}
                      onChange={cambioData}
                    >
                      <option value="" disabled>Seleccione un paciente</option>
                      {pacientes.map(paciente => (
                        <option key={paciente.id} value={paciente.id}>{paciente.nombre} - {paciente.id}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                <Form.Label>ID del Doctor</Form.Label>
               
                <Form.Control
    as="select"
    name='doctor_id' 
    value={formData.doctor_id}
    onChange={cambioData}
>
    <option value="" disabled>Seleccione un doctor</option>
    {doctores.map(doctor => (
        <option key={doctor.id} value={doctor.id}>{doctor.nombre} - {doctor.id}</option>
    ))}
</Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>ID del Estado</Form.Label>
                <Form.Control 
                  type='number' 
                  name='estado_id'
                  value={formData.estado_id}
                  onChange={cambioData}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>ID del Evento en Google Calendar</Form.Label>
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
                  as='textarea' 
                  name='descripcion'
                  value={formData.descripcion}
                  onChange={cambioData}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Notas</Form.Label>
                <Form.Control 
                  as='textarea' 
                  name='notas'
                  value={formData.notas}
                  onChange={cambioData}
                />
              </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button variant='primary' type='submit'>Enviar Datos</Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
       <div className="col-md-12">
         <h1 className="mb-4">Reporte de Citas</h1>
         <Table striped bordered hover>
           <thead>
           <tr>
               <th>#Cita</th>
              <th>Fecha y Hora</th>
              <th>Doctor</th>
           <th>Paciente</th>
             <th>Estado</th>
             
              <th>Ubicación</th>
              <th>Descripción</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.fecha_hora}</td>
                <td>{item.doctor_id}</td>
                <td>{item.paciente_id}</td>
                <td>{item.estado_id}</td>
               
                <td>{item.ubicacion}</td>
                <td>{item.descripcion}</td>
                <td>{item.notas}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
      </div>
    </>
  );
}

export default Citas;

