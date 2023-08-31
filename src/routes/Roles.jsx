import  { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const url = "http://localhost:3000/api/roles";

export const Roles = () => {

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
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
        console.log("Error al enviar datos");
        console.log(responseBody);
      }

    } catch (error) {
      console.error("Error al enviar datos", error);
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
      .then(data => setData(data.roles))  
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      <h1>Roles</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nombre del Rol</Form.Label>
          <Form.Control type='text' name='nombre' value={formData.nombre} onChange={handleChange} />
        </Form.Group>
        
        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control type='text' name='descripcion' value={formData.descripcion} onChange={handleChange} />
        </Form.Group>

        <Button variant='primary' type='submit'>Enviar Datos</Button>
      </Form>

      <h1>Reporte</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre del Rol</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Roles;
