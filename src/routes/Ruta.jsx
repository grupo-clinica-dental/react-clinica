import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const apiUrl = "http://localhost:3000/api/rutas";

export const Rutas = () => {
  const [envio, setEnvio] = useState(0);

  const [formData, setFormData] = useState({
    string_ruta: '',
    activa: true,
    fecha_borrado: null,
  });

  const cambioData = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const enviarDatos = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Datos de Ruta Enviados");
        console.log(responseData);

        setEnvio(envio + 1);
      } else {
        const responseBody = await response.json();
        console.log("Error al enviar datos de ruta");
        console.log(responseBody);
      }
    } catch (error) {
      console.error("Error al enviar datos de ruta", error);
    }
  };

  const [data, setData] = useState([]);

  const obtenerDatos = () => {
    fetch("http://localhost:3000/api/rutas", { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.rutas) {
          setData(data.rutas);
        } else {
          console.error("No se recibieron datos de rutas desde la API");
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    obtenerDatos(); // Llama a la función para obtener los datos cuando se monta el componente.
  }, []);

  return (
    <>
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-12">
          </div>
        </div>

        <div className="row">
          <div className="col-md-10 offset-md-1">
            <div className="card">
              <div className="card-header">
                Formulario de Registro de Ruta
              </div>
              <div className="card-body">
                <Form onSubmit={enviarDatos}>
                  <Form.Group>
                    <Form.Label>Nombre de Ruta</Form.Label>
                    <Form.Control
                      type='text'
                      name='string_ruta'
                      value={formData.string_ruta}
                      onChange={cambioData}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Ruta Activa</Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="activa"
                      checked={formData.activa}
                      onChange={() => setFormData({ ...formData, activa: !formData.activa })}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button variant='primary' type='submit'>Enviar Datos de Ruta</Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12">
            <h1 className="mb-4">Reporte de Rutas</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#Ruta</th>
                  <th>Nombre de Ruta</th>
                  <th>Ruta Activa</th>
                  <th>Fecha de Borrado</th>
                </tr>
              </thead>
              <tbody>
                {data ? (
                  data.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.string_ruta}</td>
                      <td>{item.activa ? 'Sí' : 'No'}</td>
                      <td>{item.fecha_borrado ? item.fecha_borrado : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Cargando data...</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rutas;

