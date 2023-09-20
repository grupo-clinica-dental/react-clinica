import  { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";

const url = `${API_URL}/api/pacientes`;

export const Pacientes = () => {
  const token = useAuthStore2((state) => state.token)
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    telefono: '',
    email: '',
    fecha_nacimiento: ''
  });
  const [state, setstate] = useState({
    error: null,
    success: null
  });

  const resetFormData = () => {
    setFormData({
      id: '',
      nombre: '',
      telefono: '',
      email: '',
      fecha_nacimiento: ''
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

    const response = await fetch(url,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
       );
    const responseData = await response.json();

    if (response.ok) {
      setDatos(responseData.item_paciente);
    } else {

      setDatos([]);
      resetFormData();
    }


  }
 


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
        setstate({
          ...state, success: 'Paciente creado con exito'
        });
        setTimeout(() => {
          setstate({
            ...state, success: '' 
  
          });
        }, 2000)
        getDatos();
        resetFormData();
      } else {
        const responseBody = await response.json();
        setstate({
          ...state, success: true
        });
        setTimeout(() => {
          setstate({
            ...state, success: '' 
  
          });
        }, 2000)
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
      setstate({
        ...state, error:"Error al enviar datos"
      });
      setTimeout(() => {
        setstate({
          ...state, error: '' 

        });
      }, 2000)
    }

  }

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
        const responseData = await response.json();

        getDatos();
        resetFormData();
      } else {
        const responseBody = await response.json();

      }
    } catch (error) {
      console.error("Error al enviar datos", error);
    }
  }

  async function enviarDataDelete(item) {


    try {
      const response = await fetch(url + '/' + item.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        getDatos();
        resetFormData();
      } else {
        const responseBody = await response.json();

      }
    } catch (error) {
      console.error("Error al enviar datos", error);
    }

  }

  function actualizarForm(item) {
    resetFormData(); 
  
    let arreglo = {
      id: item.id,
      nombre: item.nombre,
      telefono: item.telefono,
      email: item.email,
      fecha_nacimiento: item.fecha_nacimiento
    };
    setFormData(arreglo);
  }
  

  function actualizarForm(item) {


    let arreglo = {

      id: item.id,
      nombre: item.nombre,
      telefono: item.telefono,
      email: item.email,
      fecha_nacimiento: item.fecha_nacimiento

    }


    setFormData(arreglo);

  }
 

 


  useEffect(() => {

    console.log("Se invoco el use Effect")
    getDatos()

  }, []);



  return (
    <>
    <h2> Registro de Pacientes</h2>
      <div className="container mt-2">
        
              <div className="card-body">
                <Form onSubmit={enviarDatos}>
{state.error ? <div className="notificacion error">{state.error}</div> : null }
    {state.success ? <div className="notificacion success">Usuario creado con exito</div> : null }

                  <Form.Group>

                    <Form.Control
                      type='hidden'
                      name='nombre'
                      value={formData.id}
                      onChange={cambioData}
                    />
                  </Form.Group>



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

                  <div className="d-flex justify-content-end mt-3">
                    <Button variant='primary' type='submit'>Enviar Datos</Button>
                  </div>
                </Form>
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
                  <th colSpan={2}>Accion</th>
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
                    <td><button onClick={() => actualizarForm(item)} >Actualizar</button></td>
                    <td><button onClick={() => enviarDataDelete(item)}>Borrar</button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      
    </>

  );
}

export default Pacientes;


