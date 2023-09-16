//   import React, { useState, useEffect } from 'react';
//   import { Form, Button, Table } from 'react-bootstrap';

//   const url = "http://localhost:3000/api/doctoresEspecialidades";
//   const urlDoctores = "http://localhost:3000/api/doctores";
//   const urlEspecialidades = "http://localhost:3000/api/especialidades";

//   export const DoctoresEspecialidades = () => {
//     const [formData, setFormData] = useState({
//       doctor_id: '',
//       especialidad_id: '',
//     });
//     const [state, setstate] = useState({
//       error: null,
//       success: null
//     });

//     const [relaciones, setRelaciones] = useState([]);
//     const [doctores, setDoctores] = useState([]);
//     const [especialidades, setEspecialidades] = useState([]);

//     const cambioData = (event) => {
//       const { name, value } = event.target;
//       setFormData({ ...formData, [name]: value });
//     };

//     const obtenerDatos = async () => {
//       try {
//           const response = await fetch(url);
//           const data = await response.json();
//           if (data.exito) {
//               setRelaciones(data.item_doctor_especialidad);
//           } else {
//               console.error("Error obteniendo relaciones:", data.mensaje.join(', '));
//               setRelaciones([]);
//           }
//       } catch (error) {
//           console.error("Error de red:", error);
//           setRelaciones([]);
//       }
//   };

//     useEffect(() => {
//       const fetchDoctores = async () => {
//         try {
//           const response = await fetch(urlDoctores);
//           if (response.ok) {
//             const data = await response.json();
//             setDoctores(data);
//           } else {
//             console.error("Error obteniendo doctores");
//           }
//         } catch (error) {
//           console.error("Error de red:", error);
//         }
//       };

//       const fetchEspecialidades = async () => {
//         try {
//           const response = await fetch(urlEspecialidades);
//           if (response.ok) {
//             const data = await response.json();
//             setEspecialidades(data);
//           } else {
//             console.error("Error obteniendo especialidades");
//           }
//         } catch (error) {
//           console.error("Error de red:", error);
//         }
//       };

//       obtenerDatos();
//       fetchDoctores();
//       fetchEspecialidades();
//     }, []);

//     const enviarDataPost = async (event) => {
//       event.preventDefault();

//       try {
      
//         const response = await fetch(url, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(formData) 
//         });

        
//         if (response.ok) {
//           setstate({
//             ...state, success: true
//           });
//           setTimeout(() => {
//             setstate({
//               ...state, success: '' 
    
//             });
//           }, 2000)
//           setFormData({
//             doctor_id: '',
//             especialidad_id: '',
            
     
//           });

        

//         } else {
//           const responseBody = await response.json();
//           setstate({
//             ...state, success: true
//           });
//           setTimeout(() => {
//             setstate({
//               ...state, success: '' 
    
//             });
//           }, 2000)
          
//         }
//       } catch (error) {
//         console.error("Error al enviar datos", error);
//         setstate({
//           ...state, error:"Error al enviar datos"
//         });
//         setTimeout(() => {
//           setstate({
//             ...state, error: '' 
  
//           });
//         }, 2000)
//       }
//   }


//     return (
//       <>
// <h2 > Registro Relacion Doctor y Especialidad</h2>
//       <div className="container mt-2">
//         <Form onSubmit={enviarDataPost}>
//         {state.error ? <div className="notificacion error">{state.error}</div> : null }
//     {state.success ? <div className="notificacion success">Usuario creado con exito</div> : null }

//           <Form.Group>
//             <Form.Label>Doctor</Form.Label>
//             <Form.Control as="select" name='doctor_id' value={formData.doctor_id} onChange={cambioData} required>
//               <option value=''>Seleccione un doctor</option>
//               {doctores.map(doctor => <option key={doctor.id} value={doctor.id}>{doctor.nombre}</option>)}
//             </Form.Control>
//           </Form.Group>

//           <Form.Group>
//             <Form.Label>Especialidad</Form.Label>
//             <Form.Control as="select" name='especialidad_id' value={formData.especialidad_id} onChange={cambioData} required>
//               <option value=''>Seleccione una especialidad</option>
//               {especialidades.map(especialidad => <option key={especialidad.id} value={especialidad.id}>{especialidad.nombre}</option>)}
//             </Form.Control>
//           </Form.Group>

//           <div className="d-flex justify-content-end mt-3">
//             <Button variant='primary' type='submit'>Insertar Registro</Button>
//           </div>
//         </Form>
//         <div className="row mt-5">
//                 <div className="col-md-12">
//                     <h1 className="mb-4">Relaciones de Doctores y Especialidades</h1>
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Doctor ID</th>
//                                 <th>Especialidad ID</th>
                               
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {relaciones.map((relacion, index) => (
//                                 <tr key={index}>
//                                     <td>{relacion.doctor_id}</td>
//                                     <td>{relacion.especialidad_id}</td>
                                   
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </div>
//             </div>
//       </div>
//       </>
//     );
//   }

//   export default DoctoresEspecialidades;

import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const url = "http://localhost:3000/api/doctoresEspecialidades";

export const DoctoresEspecialidades = () => {
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

  const enviarDatos = event => {
    event.preventDefault();
    formData.id ? enviarDataPUT() : enviarDataPost();
  };

  const [datos, setDatos] = useState([]);

  const getDatos = async () => {
    try {
      const response = await fetch(url);
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setState(prev => ({ ...prev, success: true }));
        setTimeout(() => setState(prev => ({ ...prev, success: '' })), 2000);
        getDatos();
        resetFormData();
      } else {
        const responseBody = await response.json();
        setState(prev => ({ ...prev, error: responseBody.message }));
        setTimeout(() => setState(prev => ({ ...prev, error: '' })), 2000);
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
      setState(prev => ({ ...prev, error: "Error al enviar datos" }));
      setTimeout(() => setState(prev => ({ ...prev, error: '' })), 2000);
    }
  };

  const enviarDataPUT = async () => {
    try {
      const response = await fetch(url + '/' + formData.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
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
        method: 'DELETE'
      });
  
      const responseBody = await response.json();
  
      if (response.ok) {
        console.log('Registro eliminado con éxito:', responseBody);
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
            <Form.Control type='hidden' name='id' value={formData.id} onChange={cambioData} />
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

  
