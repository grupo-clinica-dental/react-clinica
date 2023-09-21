import {  useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Modal from '../components/modal';
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";

var url = `${API_URL}/api/especialidades`;

const Especialidades = () => {
  const token = useAuthStore2((state) => state.token)
  const [formData, setFormData] = useState({
    nombre: "",
  });

  const [state, setstate] = useState({
    error: null,
    success: null,
    modalIsOpen: false,
    selectedEspecialidad: {
      editnombre: "",
    },
    deleteOpen: false,
  });

  const handleCloseModal = ()  => {
    setstate(previous => ({...previous, modalIsOpen:false, deleteOpen: false}))
  }

  const changeSelectedEspecialidad = (item) => {
    setstate(previous => ({...previous, selectedEspecialidad:  {
      editnombre: item.nombre,
      id: item.id
    } }))
  }

  const resetFormData = () => {
    setFormData({
        id: "",
        nombre: "",
    })
  }

  const cambiodata = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const Enviardatos = async (event) => {
    event.preventDefault();

    if (formData.id) {
        enviarDataPUT();
      }else{
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
        formData.nombre = "";
      } else {
        setstate({
            ...state,
            error: "habia un error",
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
        nombre: state.selectedEspecialidad.editnombre,
        id: state.selectedEspecialidad.id
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
          setstate(previous => ({...previous, modalIsOpen:false, success: 'Especialidad actualizada con exito'}))
          getDatos();
          setTimeout(() => {
            setstate(previous => ({...previous, success: ''}))
          }, 2000);
        } else{
          setstate(previous => ({...previous, modalIsOpen:false, error: 'Error al actualizar la especialidad'}))
          setTimeout(() => {
            setstate(previous => ({...previous, error: ''}))
          }, 2000);
        }
      } catch (error) {
          setstate(previous => ({...previous, modalIsOpen:false, error: 'Error al actualizar la especialidad'}))
          setTimeout(() => {
            setstate(previous => ({...previous, error: ''}))
          }, 2000);
        console.log(error)
      }

  }


  async function enviarDataDelete(item){
    try {
        const response = await fetch(url + '/' + item.id, {
          method: 'DELETE',
          headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`,
          }
          
        });

        if (response.ok) {
          
          getDatos();
          resetFormData();
          
        } 
      } catch (error) {
          
        console.error("Error en enviar los datos");
      }
  }

  // const  actualizarForm = (item) =>  {
  //   resetFormData();
  //   let arreglo = {
  //       id: item.id,
  //       nombre: item.nombre
  //   }
  //   setFormData(arreglo);
  // }



  const [Data, setData] = useState([]);

  const getDatos = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const responseData = await response.json();

    if (response.ok) {
      setData(responseData);
    }else{
      setData([]);
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
        <div className="notificacion success">{state.success}</div>
      ) : null}

  <Modal isOpen={state.modalIsOpen} onClose={handleCloseModal}>
  <h1>Editar Especialidad</h1>
      <Form className="flex flex-col gap-y-8" onSubmit={enviarDataPUT} >
  <Form.Group>
    <Form.Label>Nombre</Form.Label>
    <Form.Control
      type="text"
      name="editnombre"
      onChange={(e) => {
        setstate(previous => ({...previous, selectedEspecialidad: {...previous.selectedEspecialidad, editnombre: e.target.value}}))
      }}
      value={state.selectedEspecialidad.editnombre}
    />
  </Form.Group>

  <Button variant="primary" type="submit">
    Actualizar Especialidad
  </Button>
  </Form>
  </Modal>

      <h2> Especialidades</h2>
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
          <Form.Label>Nombre Especialidad</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={cambiodata}
          />
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
            <th>Nombre Especialidad</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Data.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>
                <button type="button" className="btn btn-warning" onClick={() => {
                    changeSelectedEspecialidad(item);
                  setstate(previous => ({...previous, modalIsOpen:true}))
              }}>
                  Actualizar
                </button>
              </td>
              <td>
                <button type="button" className="btn btn-danger" onClick={() => enviarDataDelete(item)}>
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

export default Especialidades;
