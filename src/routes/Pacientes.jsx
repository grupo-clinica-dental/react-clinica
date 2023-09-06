
import React, { useState, useEffect } from 'react';
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
        
        getDatos();

      } else {
        const responseBody = await response.json();
        
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
    }
  };

  const [datos, setDatos] = useState([]);

  const getDatos = async ()=>{

    const response = await fetch(url);
    const responseData = await response.json();

    if (response.ok){
      setDatos(responseData.item_paciente);
    }else{

      setDatos([]);

    }
    

  }

  useEffect(() => {

    console.log("Se invoco el use Effect")
    getDatos()
    
  }, []);



  return (
    <>
  <div className="container mt-2">
    <div className="row">
      <div className="col-md-12">
       
      </div>
    </div>
    
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <div className="card">
          <div className="card-header">
            Formulario de Registro
          </div>
          <div className="card-body">
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
        <h1 className="mb-4">Reporte de Pacientes</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#Paciente</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Fecha de Nacimiento</th>
            </tr>
          </thead>
          <tbody>
            {datos.map(item => (
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
      </div>
    </div>
  </div>
</>

  );
}

export default Pacientes;





