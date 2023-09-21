import { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Modal from '../components/modal';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";


const url = `${API_URL}/api/doctores`;

const Doctores = () => {

  const token = useAuthStore2((state) => state.token)
  
  const [formData, useFormData] = useState({
    nombre: "",
    correo_electronico: "",
    color: "#FFFFFF",
    especialidadId: 0,
  });

  const [state, setstate] = useState({
    error: null,
    success: null,
    modalIsOpen: false,
    selectedDoctores: {
      editnombre: "",
      editcorreoelectronico: "",
      editcolor: "",
      editespecialidasID:""
    },
    deleteOpen: false,
  });

  const handleCloseModal = () => {
    setstate(previous => ({...previous, modalIsOpen: false, delteOpen: false}))
  }

  const changeSelectedDoctores = (item) => {
    setstate(previous => ({...previous, selectedDoctores: {
      editnombre: item.nombre,
      editcorreoelectronico: item.correo_electronico,
      editcolor: item.color,
      editespecialidasID: item.especialidadId,
      id: item.id

    }}))
  }

  const resetFormData = () => {
    useFormData({
      id: "",
      nombre: "",
      correo_electronico: "",
      color: "#FFFFFF",
      especialidadId: "",
    });
  };

  const cambiodata = (event) => {
    const { name, value } = event.target;
    useFormData({ ...formData, [name]: value });
  };

  const Enviardatos = async (event) => {
    event.preventDefault();

    if (formData.id) {
      enviarDataPUT();
      
    }else  {
      enviarDataPost();
    }
  };

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
        setstate({
          ...state,
          success: true,
        });
        setTimeout(() => {
          setstate({
            ...state,
            success: "",
          });
        }, 2000);
        getDatos();
        resetFormData();
        formData.nombre = "";
        formData.correo_electronico = "";
        formData.color = "#FFFFFF"
        formData.especialidadId = "";
      } else {
        setstate({
          ...state,
          error: "",
        });
        setTimeout(() => {
          setstate({
            ...state,
            error: "",
          });
        }, 2000);
      }
    } catch (error) {
      setstate({
        ...state,
        error: "Error en enviar los datos.",
      });
      setTimeout(() => {
        setstate({
          ...state,
          error: "",
        });
      }, 2000);
      console.error("Error en enviar los datos");
    }
  }

  const enviarDataPUT = async (e ) => {
    e.preventDefault();

    const data = {
      nombre: state.selectedDoctores.editnombre,
      correo_electronico: state.selectedDoctores.editcorreoelectronico,
      color: state.selectedDoctores.editcolor,
      especialidadId: state.selectedDoctores.editespecialidasID,
      id: state.selectedDoctores.id
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
        setstate(previous => ({...previous, modalIsOpen:false, success: 'Doctores actualizada con exito'}))
        getDatos();
        setTimeout(() => {
          setstate(previous => ({...previous, success: ''}))
        }, 2000);
      } else {
        setstate(previous => ({...previous, modalIsOpen:false, error: 'Error al actualizar el doctor'}))
          setTimeout(() => {
            setstate(previous => ({...previous, error: ''}))
          }, 2000);
      }
    } catch (error) {
      setstate(previous => ({...previous, modalIsOpen:false, error: 'Error al actualizar el doctor'}))
        setTimeout(() => {
          setstate(previous => ({...previous, error: ''}))
        }, 2000);
    }

  }

  const enviarDataDelete = async (e) =>{
    e.preventDefault();
    const userId = state.selectedDoctores?.id;
    
    const handleDeleteUser = async (userId) => {
      try {
        const response = await fetch(url + '/' + item.id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
          
        });
        if (response.ok) {
          const responsebody = await response.json();
  
          
          getDatos();
          resetFormData();
          formData.nombre = "";
          formData.correo_electronico = "";
          
        } else {
          
         
          
          
  
          
        }
      } catch (error) {
        
        console.error("Error en enviar los datos");
      }
    }
    
      
    

  }

  /*function actualizarForm(item){
    resetFormData();
    let arreglo = {
      id: item.id,
      nombre: item.nombre,
      correo_electronico: item.correo_electronico,
      color: item.color,
    }
    useFormData(arreglo);
  }*/

  
  const [Data, useData] = useState([]);

  const getDatos = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const responseData = await response.json();

    if (response.ok) {
      useData(responseData);
      
    }else{
      useData([]);
      resetFormData();
    }
  };

  useEffect(() => {
    getDatos();
  }, []);




  return (
    <>
      {state.error ? (
        <div className="notificacion error">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="notificacion success">Doctor creado fue un exicto</div>
      ) : null}
      <Modal isOpen={state.modalIsOpen} onClose={handleCloseModal}>
        <h1>Editar Doctores</h1>
          <Form className="flex flex-col gap-y-8" onSubmit={enviarDataPUT}>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="editnombre"
              onChange={(e) => {
                setstate(previous => ({...previous, selectedDoctores: {...previous.selectedDoctores, editnombre: e.target.value}}))
              }}
              value={state.selectedDoctores.editnombre}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Correo Electronico</Form.Label>
            <Form.Control
              type="text"
              name="editcorreoelectronico"
              onChange={(e) => {
                setstate(previous => ({...previous, selectedDoctores: {...previous.selectedDoctores, editcorreoelectronico: e.target.value}}))
              }}
              value={state.selectedDoctores.editcorreoelectronico}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="Color"
              name="editcolor"
              onChange={(e) => {
                setstate(previous => ({...previous, selectedDoctores: {...previous.selectedDoctores, editcolor: e.target.value}}))
              }}
              value={state.selectedDoctores.editcolor}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Especialidad</Form.Label>
            <Form.Select
              type="text"
              name="editespecialidasID"
              onChange={(e) => {
                setstate(previous => ({...previous, selectedDoctores: {...previous.selectedDoctores, editespecialidasID: e.target.value}}))
              }}
              value={state.selectedDoctores.editespecialidasID}
            >
              <option value="0">Seleccione una especialidad</option>
            <option value="1">Medicina General</option>
            </Form.Select>
            
          </Form.Group>

          <Button variant="primary" type="submit">
              Actualizar Doctores
          </Button>

          </Form>
      </Modal>

      <Modal showCloseButton={false} isOpen={state.deleteOpen} onClose={handleCloseModal}>
        <div className="flex w-full flex-wrap gap-y-5 gap-x-5">
            <h1>Esta seguro que desea eliminar este doctor?</h1>
            <div className="flex w-[40%] grow">
              <Button className="w-full" variant="danger" onClick={() => {
                handleDeleteUser(state.selectedDoctores.id);
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
            {Data.map((item) => (
              <option>{item.especialidadId}</option>
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
          {Data.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.correo_electronico}</td>
              <td style={{ backgroundColor: `${item.color}` }}> </td>
              <td>{item.especialidadId}</td>
              <td>
                <button type="button" class="btn btn-warning" onClick={() => {
                  changeSelectedDoctores(item);
                  setstate(previous => ({...previous, modalIsOpen:true}))
                }}>
                  Actualizar
                </button>
              </td>
              <td>
                <button type="button" class="btn btn-danger" onClick={() => {
                  changeSelectedUser(item)
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
