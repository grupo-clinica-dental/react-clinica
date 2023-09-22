import { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Modal from '../components/modal';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";


const url = `${API_URL}/api/doctores`;

const Doctores = () => {

  const token = useAuthStore2((state) => state.token)

  
  const [formData, setFormData] = useState({
    nombre: "",
    correo_electronico: "",
    color: "#FFFFFF",
    especialidadId: 0,
  });

  const [state, setstate] = useState({
    error: null,
    success: null,
    doctores: [],
    especialidades: [],
    modalIsOpen: false,
    selectedDoctor: {
      id: "",
      editnombre: "",
      editcorreoelectronico: "",
      editcolor: "",
      especialidadVieja: '',
      nuevaEspecialidad: '',
    },
    deleteOpen: false,
  });
  
  const handleCloseModal = () => {
    setstate(previous => ({...previous, modalIsOpen: false, deleteOpen: false}))
  }

  const changeSelectedDoctor = (item) => {
    console.log({item})

    setstate(previous => ({...previous, selectedDoctor: {
      editnombre: item.doctor_name,
      editcorreoelectronico: item.doctor_email,
      editcolor: item.doctor_color,
      especialidadVieja: item.especialidades[0].especialidad_id,
      id: item.doctor_id,
      nuevaEspecialidad: ''
    }}))


  }

  

  const resetFormData = () => {
    setFormData({
      id: "",
      nombre: "",
      correo_electronico: "",
      color: "#FFFFFF",
      especialidadId: "",
    });
  };

  const cambiodata = (event) => {
    const { name, value } = event.target;
    setFormData( previous => ({ ...previous, [name]: value }));
  };

  const Enviardatos = async (event) => {
    event.preventDefault();

    if (formData.id) {
      enviarDataPUT();
      
    }else  {
      enviarDataPost();
    }
  };

  const resetSuccess = () => {
    setTimeout(() => {
      setstate(previous => ({...previous, success: ""}));
    }, 2000);
  }

  const resetError = () => {
    setTimeout(() => {
      setstate(previous => ({...previous, error: ""}));
    }, 2000);
  }

  const enviarDataPost = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        resetFormData();
        await getDatos();
        setstate({
          ...state,
          success: 'Doctor creado con exito',
        });

        resetSuccess();

      } else {
        setstate({
          ...state,
          error: "Ha ocurrido un error",
        });
        resetError();
      }
    } catch (error) {
      setstate({
        ...state,
        error: "Error en enviar los datos.",
      });
      resetError( )
    }
  }

  const enviarDataPUT = async (e ) => {
    e.preventDefault();

    const data = {
      nombre: state.selectedDoctor.editnombre,
      correo_electronico: state.selectedDoctor.editcorreoelectronico,
      color: state.selectedDoctor.editcolor,
      especialidadVieja: state.selectedDoctor.especialidadVieja,
      nuevaEspecialidad: state.selectedDoctor.nuevaEspecialidad,
      id: state.selectedDoctor.id
    }



    try {
      const response = await fetch(url + '/' + data.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setstate(previous => ({...previous, success: 'Doctores actualizado con exito'}))
      await  getDatos();
     resetSuccess();
     handleCloseModal();
      } else {
        setstate(previous => ({...previous, error: 'Error al actualizar el doctor'}))
      resetError();
      }
    } catch (error) {
      setstate(previous => ({...previous, error: 'Error al actualizar el doctor'}))
    resetError();
    }

  }

  const enviarDataDelete = async () =>{
    const userId = state.selectedDoctor?.id;
    
      try {
        const response = await fetch(url + '/' + userId, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
          
        });
        if (response.ok) {
          setstate(previous => ({...previous, success: 'Doctor eliminado con exito'}))
          await getDatos();
          handleCloseModal();
          resetSuccess();
          
        } else {
          setstate(previous => ({...previous, error: 'Error al eliminar el doctor'}))
        }
      } catch (error) {
        
        console.error("Error en enviar los datos");
      }

  }

  

  const getDatos = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const responseData = await response.json();

    if (response.ok) {
      setstate(previous => ({...previous, doctores: responseData}));
      
    }else{
      setstate(previous => ({...previous, doctores: []}));
      resetFormData();
    }
  };

  const getEspecialidades = async () => {
    const response = await fetch(`${API_URL}/api/especialidades`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const responseData = await response.json();

    if (response.ok) {
      setstate(previous => ({...previous, especialidades: responseData}));
      
    }else{
      setstate(previous => ({...previous, especialidades: []}));
      resetFormData();
    }
  } ;

  useEffect(() => {
    getDatos();
    getEspecialidades();
  }, []);



  return (
    <>
      {state.error ? (
        <div className="notificacion error">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="notificacion success">{state.success}</div>
      ) : null}
      <Modal isOpen={state.modalIsOpen} onClose={handleCloseModal}>
        <h1>Editar Doctor</h1>
          <Form className="flex flex-col gap-y-8" onSubmit={enviarDataPUT}>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="editnombre"
              onChange={(e) => {
                setstate(previous => ({...previous, selectedDoctor: {...previous.selectedDoctor, editnombre: e.target.value}}))
              }}
              value={state.selectedDoctor.editnombre}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Correo Electronico</Form.Label>
            <Form.Control
              type="text"
              name="editcorreoelectronico"
              onChange={(e) => {
                setstate(previous => ({...previous, selectedDoctor: {...previous.selectedDoctor, editcorreoelectronico: e.target.value}}))
              }}
              value={state.selectedDoctor.editcorreoelectronico}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="Color"
              name="editcolor"
              onChange={(e) => {
                setstate(previous => ({...previous, selectedDoctor: {...previous.selectedDoctor, editcolor: e.target.value}}))
              }}
              value={state.selectedDoctor.editcolor}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Especialidad</Form.Label>
            <Form.Select
              type="text"
              name="nuevaEspecialidad"
              onChange={(e) => {
                setstate(previous => ({...previous, selectedDoctor: {...previous.selectedDoctor, nuevaEspecialidad: e.target.value}}))
              }}
              value={state.selectedDoctor.nuevaEspecialidad !== '' ? state.selectedDoctor.nuevaEspecialidad : state.selectedDoctor.especialidadVieja}
            >
              <option value="0">Seleccione una especialidad</option>
              {state.especialidades.map((item) => ( <option value={item.id} key={`${item.nombre}${item.id}`}>{item.nombre}</option>))}
            </Form.Select>
            
          </Form.Group>

          <Button variant="primary" type="submit">
              Actualizar Doctor
          </Button>

          </Form>
      </Modal>

      <Modal showCloseButton={false} isOpen={state.deleteOpen} onClose={handleCloseModal}>
        <div className="flex w-full flex-wrap gap-y-5 gap-x-5">
            <h1>Esta seguro que desea eliminar este doctor?</h1>
            <div className="flex w-[40%] grow">
              <Button className="w-full" variant="danger" onClick={() => {
                enviarDataDelete();
              }}>Eliminar</Button>
            </div> 
            <div className="flex w-[40%] grow">
              <Button className="w-full" onClick={() => {
                handleCloseModal();
              }}>Cancelar</Button>
            </div>  

        </div>
      </Modal>

      <h2> Doctores</h2>
      <Form onSubmit={Enviardatos}>
        <Form.Group>
        <Form.Control
            type="hidden"
            name="id"
            value={formData.id}
            onChange={cambiodata}
          />
        </Form.Group>


        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={cambiodata}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Correo electronico</Form.Label>
          <Form.Control
            type="email"
            name="correo_electronico"
            value={formData.correo_electronico}
            onChange={cambiodata}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Color</Form.Label>
          <Form.Control
            type="color"
            name="color"
            
            value={formData.color}
            onChange={cambiodata}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Especialidad</Form.Label>
          <Form.Select
            type="text"
            name="especialidadId"
            
            value={formData.especialidadId}
            onChange={cambiodata}
          >
            <option>Especialidades</option>
            {state.especialidades.map((item) => (
              <option value={item.id} key={`${item.nombre}${item.id}`}>{item.nombre}</option>
            ))}
            
            
          </Form.Select>
        </Form.Group>

        <br></br>
        <Button variant="primary" type="submit">
          Enviar Datos
        </Button>
      </Form>
      <h1>Reporte</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo Electronico</th>
            <th>Color</th>
            <th>Especialidad</th>
            <th></th>
            <th></th>
          </tr>
          
        </thead>
        <tbody>
          {state.doctores.map((item) => (
            <tr key={item.doctor_id + item.doctor_name}>
              <td>{item.doctor_name}</td>
              <td>{item.doctor_email}</td>
              <td style={{ backgroundColor: `${item.doctor_color}` }}> </td>
              <td>{item.especialidades.length > 0 ? item.especialidades[0].especialidad_name : 'No definido'}</td>
              
              <td>
                <button type="button" className="btn btn-warning" onClick={() => {
                  changeSelectedDoctor(item);
                  setstate(previous => ({...previous, modalIsOpen: true}))
                }}>
                  Actualizar
                </button>
              </td>
              <td>
                <button type="button" className="btn btn-danger" onClick={() => {
                  changeSelectedDoctor(item)
                  setstate(previous => ({...previous, deleteOpen: true}))
                  }}>
                  
                  
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Doctores;
