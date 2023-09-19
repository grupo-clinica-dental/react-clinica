
// import React, { useState, useEffect } from 'react';
// import { Form, Button, Table } from 'react-bootstrap';
// import { useAuthStore2 } from "../zustand-stores/auth-store";
// import { API_URL } from "../api/api.config";

// const url = `${API_URL}/api/doctoresEspecialidades`;

// export const DoctoresEspecialidades = () => {
//   const token = useAuthStore2((state) => state.token)

//   const [formData, setFormData] = useState({
//     id: '',
//     doctor_id: '',
//     especialidad_id: ''
//   });

//   const [state, setState] = useState({
//     error: null,
//     success: null
//   });

//   const resetFormData = () => {
//     setFormData({
//       id: '',
//       doctor_id: '',
//       especialidad_id: ''
//     });
//   };

//   const cambioData = (event) => {
//     const { name, value } = event.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const enviarDatos = event => {
//     event.preventDefault();
//     formData.id ? enviarDataPUT() : enviarDataPost();
//   };

//   const [datos, setDatos] = useState([]);

//   const getDatos = async () => {
//     try {
//       const response = await fetch(url,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//       const responseData = await response.json();

//       if (response.ok) {
//         setDatos(responseData.item_doctor_especialidad);
//       } else {
//         setDatos([]);
//         resetFormData();
//       }
//     } catch (error) {
//       console.error("Error al obtener datos", error);
//     }
//   };

//   const enviarDataPost = async () => {
//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         setState(prev => ({ ...prev, success: true }));
//         setTimeout(() => setState(prev => ({ ...prev, success: '' })), 2000);
//         getDatos();
//         resetFormData();
//       } else {
//         const responseBody = await response.json();
//         setState(prev => ({ ...prev, error: responseBody.message }));
//         setTimeout(() => setState(prev => ({ ...prev, error: '' })), 2000);
//       }
//     } catch (error) {
//       console.error("Error al enviar datos", error);
//       setState(prev => ({ ...prev, error: "Error al enviar datos" }));
//       setTimeout(() => setState(prev => ({ ...prev, error: '' })), 2000);
//     }
//   };

//   const enviarDataPUT = async () => {
//     try {
//       const response = await fetch(url + '/' + formData.id, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         getDatos();
//         resetFormData();
//       } else {
//         const responseBody = await response.json();
//         console.error(responseBody.message);
//       }
//     } catch (error) {
//       console.error("Error al actualizar datos", error);
//     }
//   };

//   const enviarDataDelete = async item => {
//     try {
//       const response = await fetch(`${url}/${item.id}`, {
//         method: 'DELETE'
//       });
  
//       const responseBody = await response.json();
  
//       if (response.ok) {
//         console.log('Registro eliminado con éxito:', responseBody);
//         getDatos();
//         resetFormData();
//       } else {
//         console.error('Error en la respuesta del servidor:', responseBody);
//       }
//     } catch (error) {
//       console.error("Error al enviar solicitud DELETE:", error);
//     }
//   };
  

//   const actualizarForm = item => {
//     setFormData({
//       id: item.id,
//       doctor_id: item.doctor_id,
//       especialidad_id: item.especialidad_id
//     });
//   };

//   useEffect(() => {
//     getDatos();
//   }, []);

//   return (
//     <>
//       <h2> Registro de Doctor-Especialidad</h2>
//       <div className="container mt-2">
//         <Form onSubmit={enviarDatos}>
//           {state.error ? <div className="notificacion error">{state.error}</div> : null}
//           {state.success ? <div className="notificacion success">Operación exitosa</div> : null}
//           <Form.Group>
//             <Form.Control type='hidden' name='id' value={formData.id} onChange={cambioData} />
//           </Form.Group>
//           <Form.Group>
//             <Form.Label>Doctor ID</Form.Label>
//             <Form.Control type='text' name='doctor_id' value={formData.doctor_id} onChange={cambioData} />
//           </Form.Group>
//           <Form.Group>
//             <Form.Label>Especialidad ID</Form.Label>
//             <Form.Control type='text' name='especialidad_id' value={formData.especialidad_id} onChange={cambioData} />
//           </Form.Group>
//           <div className="d-flex justify-content-end mt-3">
//             <Button variant='primary' type='submit'>Enviar Datos</Button>
//           </div>
//         </Form>
//       </div>

//       <div className="row mt-5">
//         <div className="col-md-12">
//           <h1 className="mb-4">Reporte de Doctor-Especialidad</h1>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>#ID</th>
//                 <th>Doctor ID</th>
//                 <th>Especialidad ID</th>
//                 <th colSpan={2}>Acción</th>
//               </tr>
//             </thead>
//             <tbody>
//               {datos.map(item => (
//                 <tr key={item.id}>
//                   <td>{item.id}</td>
//                   <td>{item.doctor_id}</td>
//                   <td>{item.especialidad_id}</td>
//                   <td><button onClick={() => actualizarForm(item)}>Actualizar</button></td>
//                   <td><button onClick={() => enviarDataDelete(item)}>Borrar</button></td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       </div>
//     </>
//   );
// }

// export default DoctoresEspecialidades;

import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";

const url = `${API_URL}/api/doctoresEspecialidades`;

export const DoctoresEspecialidades = () => {
  const token = useAuthStore2((state) => state.token)

  const [formData, setFormData] = useState({
    id: '',
    doctor_id: '',
    especialidad_id: ''
  });

  const [state, setState] = useState({
    error: null,
    success: null
  });

  const resetFormData = () => {
    setFormData({
      id: '',
      doctor_id: '',
      especialidad_id: ''
    });
  };

  const cambioData = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const enviarDatos = async (event) => {
    event.preventDefault();
    formData.id ? enviarDataPUT() : enviarDataPost();
  };

  const [datos, setDatos] = useState([]);

  const getDatos = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const responseData = await response.json();
      if (response.ok) {
        setDatos(responseData.item_doctor_especialidad);
      } else {
        setDatos([]);
        resetFormData();
      }
    } catch (error) {
      console.error("Error al obtener datos", error);
    }
  };

  const enviarDataPost = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const responseBody = await response.json();

      if (response.ok) {
        setState({ ...state, success: true });
        setTimeout(() => setState({ ...state, success: '' }), 2000);
        getDatos();
        resetFormData();
      } else {
        setState({ ...state, error: responseBody.message });
        setTimeout(() => setState({ ...state, error: '' }), 2000);
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
      setState({ ...state, error: "Error al enviar datos" });
      setTimeout(() => setState({ ...state, error: '' }), 2000);
    }
  };

  const enviarDataPUT = async () => {
    try {
        const response = await fetch(`${url}/${formData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            getDatos();
            resetFormData();
        } else {
            const responseBody = await response.json();
            console.error(responseBody.message);
        }
    } catch (error) {
        console.error("Error al actualizar datos", error);
    }
};


const enviarDataDelete = async item => {
  try {
      const response = await fetch(`${url}/${item.id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
          }
      });

      const responseBody = await response.json();

      if (response.ok) {
          console.log('Registro desactivado con éxito:', responseBody);
          getDatos();
          resetFormData();
      } else {
          console.error('Error en la respuesta del servidor:', responseBody);
      }
  } catch (error) {
      console.error("Error al enviar solicitud DELETE:", error);
  }
};



  const actualizarForm = item => {
    resetFormData();
    setFormData({
      id: item.id,
      doctor_id: item.doctor_id,
      especialidad_id: item.especialidad_id
    });
  };

  useEffect(() => {
    getDatos();
  }, []);

  return (
    <>
      <h2> Registro de Doctor-Especialidad</h2>
      <div className="container mt-2">
        <Form onSubmit={enviarDatos}>
          {state.error ? <div className="notificacion error">{state.error}</div> : null}
          {state.success ? <div className="notificacion success">Operación exitosa</div> : null}
          <Form.Group>
    <Form.Label>ID</Form.Label>
    <Form.Control type='text' name='id' value={formData.id} onChange={cambioData} placeholder="ID de la especialidad" />
</Form.Group>

          <Form.Group>
            <Form.Label>Doctor ID</Form.Label>
            <Form.Control type='text' name='doctor_id' value={formData.doctor_id} onChange={cambioData} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Especialidad ID</Form.Label>
            <Form.Control type='text' name='especialidad_id' value={formData.especialidad_id} onChange={cambioData} />
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button variant='primary' type='submit'>Enviar Datos</Button>
          </div>
        </Form>
      </div>

      <div className="row mt-5">
        <div className="col-md-12">
          <h1 className="mb-4">Reporte de Doctor-Especialidad</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#ID</th>
                <th>Doctor ID</th>
                <th>Especialidad ID</th>
                <th colSpan={2}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {datos.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.doctor_id}</td>
                  <td>{item.especialidad_id}</td>
                  <td><button onClick={() => actualizarForm(item)}>Actualizar</button></td>
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

export default DoctoresEspecialidades;

