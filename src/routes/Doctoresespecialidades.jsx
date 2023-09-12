import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const url = "http://localhost:3000/api/doctor_especialidades";
const urlDoctores = "http://localhost:3000/api/doctores";
const urlEspecialidades = "http://localhost:3000/api/especialidades";

export const DoctoresEspecialidades = () => {
  const [formData, setFormData] = useState({
    doctor_id: '',
    especialidad_id: '',
  });

  
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  const cambioData = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const response = await fetch(urlDoctores);
        if (response.ok) {
          const data = await response.json();
          setDoctores(data);
        } else {
          console.error("Error obteniendo doctores");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    const fetchEspecialidades = async () => {
      try {
        const response = await fetch(urlEspecialidades);
        if (response.ok) {
          const data = await response.json();
          setEspecialidades(data);
        } else {
          console.error("Error obteniendo especialidades");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

   
    fetchDoctores();
    fetchEspecialidades();
  }, []);

  const enviarDataPost = async (event) => {
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
        alert("Registro insertado con éxito");
        setFormData({
          doctor_id: '',
          especialidad_id: '',
        });
      } else {
        const responseBody = await response.json();
        alert("Error al insertar: " + responseBody.message);
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
      alert("Error al enviar datos");
    }
}


  return (
    <div className="container mt-2">
      <Form onSubmit={enviarDataPost}>
        <Form.Group>
          <Form.Label>Doctor</Form.Label>
          <Form.Control as="select" name='doctor_id' value={formData.doctor_id} onChange={cambioData} required>
            <option value=''>Seleccione un doctor</option>
            {doctores.map(doctor => <option key={doctor.id} value={doctor.id}>{doctor.nombre}</option>)}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Especialidad</Form.Label>
          <Form.Control as="select" name='especialidad_id' value={formData.especialidad_id} onChange={cambioData} required>
            <option value=''>Seleccione una especialidad</option>
            {especialidades.map(especialidad => <option key={especialidad.id} value={especialidad.id}>{especialidad.nombre}</option>)}
          </Form.Control>
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant='primary' type='submit'>Insertar Registro</Button>
        </div>
      </Form>
    </div>
  );
}

export default DoctoresEspecialidades;




