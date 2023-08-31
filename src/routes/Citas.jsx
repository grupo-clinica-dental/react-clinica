import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const url = "http://localhost:3000/api/citas";

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
        console.log(JSON.stringify(responseData));
      } else {
        const responseBody = await response.json();
        console.log("Error en enviar datos");
        console.log(responseBody);
      }

    } catch (error) {
      console.error("Error en enviar datos", error);
    }
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setData(data))  
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      <h1>Citas</h1>

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
            type='number' 
            name='doctor_id'
            value={formData.doctor_id}
            onChange={cambioData}
        />
    </Form.Group>

    <Form.Group>
        <Form.Label>Paciente ID</Form.Label>
        <Form.Control 
            type='number' 
            name='paciente_id'
            value={formData.paciente_id}
            onChange={cambioData}
        />
    </Form.Group>

    <Form.Group>
        <Form.Label>Estado ID</Form.Label>
        <Form.Control 
            type='number' 
            name='estado_id'
            value={formData.estado_id}
            onChange={cambioData}
        />
    </Form.Group>

    <Form.Group>
        <Form.Label>Google Calendar Event ID</Form.Label>
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

    <Button variant='primary' type='submit'>Enviar Datos</Button>
</Form>

      
      </Form>

      <h1>Reporte</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Doctor ID</th>
            <th>Paciente ID</th>
          
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.fecha_hora}</td>
              <td>{item.doctor_id}</td>
              <td>{item.paciente_id}</td>
             
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Citas;
