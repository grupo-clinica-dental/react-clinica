
import React, { Component, useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const url = "http://localhost:3000/api/pacientes"; 
export const Pacientes = () => {

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    fecha_nacimiento: ''
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
      .then(data => setData(data.item_paciente))  
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      <h1>Pacientes</h1>

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

        <Button variant='primary' type='submit'>Enviar Datos</Button>
      </Form>

      <h1>Reporte</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Fecha de Nacimiento</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.telefono}</td>
              <td>{item.email}</td>
              <td>{item.fecha_nacimiento}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Pacientes