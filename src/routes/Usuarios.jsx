import  { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Modal from "../components/modal";
import { useAuthStore2 } from "../zustand-stores/auth-store";
import { API_URL } from "../api/api.config";

const url = `${API_URL}/api/usuarios`;

export const Usuarios = () => {
  const [data, setData] = useState([]);
  // main form data
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fecha_nacimiento: "",
    password: "",
    secondPassword: "",
  });
  // state of page modal selected user
  const [state, setstate] = useState({
    error: null,
    success: null,
    modalIsOpen: false,
    selectedUser: {
      editnombre: "",
      edittelefono: "",
      editemail: "",
      editpassword: "",
      editsecondPassword: "",
    },
    deleteOpen: false,
  });

  // token of loged user
  const token = useAuthStore2((state) => state.token)
  // handle change of main form
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
// handle change of edit form
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setstate((previous) => ({...previous, selectedUser: {...previous.selectedUser, [name]: value}}))
  }
  // open edit modal  

  const handleOpenModal = () => {
    setstate((previous) => ({...previous, modalIsOpen: true}));
  };
  // close all modals
  const handleCloseModal = () => {
    setstate( previous => ({...previous, modalIsOpen: false , deleteOpen: false }) );
  };
  // reset the main form data
  const resetFormData = () => {
    setFormData({
      nombre: "",
      telefono: "",
      email: "",
      fecha_nacimiento: "",
      password: "",
      secondPassword: "",
    })
  }
  // reset the success message
  const resetSuccess = () => {
    setTimeout(() => {
      setstate(previous => ({...previous, success: null} ))
    } , 2000)
  }
  // reset the error message
  const resetError = () => {
    setTimeout(() => {
      setstate(previous => ({...previous, error: null} ));
    }, 2000);
  }

  const changeSelectedUser = (user) => {
    setstate((previous => ({...previous, selectedUser: {
      editnombre: user.nombre,
      edittelefono: user.telefono,
      editemail: user.email,
      editfecha_nacimiento: user.fecha_nacimiento,
      editpassword: user.password,
      editsecondPassword: user.secondPassword,
      id: user.id

    } })))
  }

  console.log(state.deleteOpen)

  // load users from api
  const loadUsuarios = async ()  => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          
        },
      })
      if(response.ok) {
        const data = await response.json()
        setData(data)
      }  else{
        setstate({ ...state, error: 'Error al obtener los usuarios' });
        setData([])
        resetError()

      }
    } catch (error) {
      setstate({ ...state, error: 'Error al obtener los usuarios' });
      setData([])
      resetError()
    }


  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setstate({...state, success: 'Usuario creado con exito'})

        resetFormData()
        resetSuccess()  
      await  loadUsuarios()
   
      } else {
        const responseBody = await response.json();

      await loadUsuarios()

        setstate({...state, error: responseBody.message})
        resetError()
      }
    } catch (error) {
      setstate(previous => ({...previous, error: "Ha ocurrido un error"}) );
      resetError()
    }
  };



  const handleSubmitEdit = async (event) => {
    event.preventDefault();
  
    const userId = state.selectedUser?.id;

    const data = {
      nombre: state.selectedUser?.editnombre,
      telefono: state.selectedUser?.edittelefono,
      email: state.selectedUser?.editemail,
      password: state.selectedUser?.editpassword,
    }
  
    try {
      const response = await fetch(`${url}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        setstate(previous => ({...previous, success: "Usuario actualizado con exito", modalIsOpen: false}));
     resetFormData()
      await loadUsuarios()
        resetSuccess()
      } else {
        const responseBody = await response.json();
        setstate({ ...state, error: responseBody.message });

await loadUsuarios()
 resetError()
      }
    } catch (error) {
      setstate({ ...state, error: "Ha ocurrido un error" });
      resetError()
    }
  };
  
  const handleDeleteUser = async (userId) => {

    try {
      const response = await fetch(`${url}/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if(response.ok) {
        setstate(previous => ({...previous, success: "Usuario eliminado con exito", deleteOpen: false}));
        await loadUsuarios()  
      resetSuccess()
      }else{
        setstate({ ...state, error: "Ha ocurrido un error" });
    await loadUsuarios()
        resetError()
      }
      
    } catch (error) {
      setstate(previous => ({...previous, error: "Ha ocurrido un error"}));
   resetError()
    }
  
  }


  useEffect(() => {
    

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setData(response)
      }) 
      .catch((error) => console.error(error));
  }, []);


  return (
    <>
 <Modal isOpen={state.modalIsOpen} onClose={handleCloseModal}>
      <h1>Editar Usuario</h1>
      <Form onSubmit={handleSubmitEdit}>
  <Form.Group>
    <Form.Label>Nombre</Form.Label>
    <Form.Control
      type="text"
      name="editnombre"
      value={state.selectedUser.editnombre}
      onChange={handleEditChange}
    />
  </Form.Group>

  <Form.Group>
    <Form.Label>Teléfono</Form.Label>
    <Form.Control
      type="text"
      name="edittelefono"
      value={state.selectedUser.edittelefono}
      onChange={handleEditChange}
    />
  </Form.Group>

  <Form.Group>
    <Form.Label>Email</Form.Label>
    <Form.Control
      type="email"
      name="editemail"
      value={state.selectedUser.editemail}
      onChange={handleEditChange}
    />
  </Form.Group>


  <Form.Group>
    <Form.Label>Contraseña</Form.Label>
    <Form.Control
      type="password"
      name="editpassword"
      value={state.selectedUser.editpassword}
      onChange={handleEditChange}
    />
  </Form.Group>

  <Form.Group>
    <Form.Label>Confirmar Contraseña</Form.Label>
    <Form.Control
      type="password"
      name="editsecondPassword"
      value={state.selectedUser.editsecondPassword}
      onChange={handleEditChange}
    />
  </Form.Group>

  <Button variant="primary" type="submit">
    Actualizar Usuario
  </Button>
</Form>



    </Modal>
    {/* modal eliminar */}
    <Modal showCloseButton={false} isOpen={state.deleteOpen} onClose={handleCloseModal}>
<div className="flex w-full flex-wrap gap-y-5 gap-x-5">
  <h1>¿Estas seguro que deseas eliminar este usuario?</h1>
  <div className="flex w-[40%] grow">
  <Button className="w-full" variant="danger" onClick={() => {
    handleDeleteUser(state.selectedUser.id);
  } }>Eliminar</Button>
  </div>    
  <div className="flex w-[40%] grow">
  <Button className="w-full" onClick={() => {
    handleCloseModal();
  } }>Cancelar</Button>
  </div>    
</div>
    </Modal>

      <h1>Usuarios</h1>

      <Form onSubmit={handleSubmit}>
    {state.error ? <div className="notificacion error">{state.error}</div> : null }
    {state.success ? <div className="notificacion success">{state.success}</div> : null }

        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        
        <Form.Group>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="secondPassword"
            value={formData.secondPassword}
            onChange={(e) => {
              handleChange(e)
            }}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Enviar Datos
        </Button>
      </Form>

      <h1>Reporte</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
            {data.length > 0 ? data?.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.telefono}</td>
              <td>{item.email}</td>
              <td>{item.fecha_nacimiento}</td>
              <td>
                <Button variant="danger" onClick={() => {
                  changeSelectedUser(item);
                  setstate(previous => ({...previous, deleteOpen: true}))
                } }>Eliminar</Button>
              </td>
              <td>
                <Button onClick={() => {
            
              handleOpenModal();

              changeSelectedUser(item);

                }}>Editar</Button></td>
            </tr>
          )) : <tr><td colSpan="5">No hay datos</td></tr>}

        </tbody>
      </Table>
    </>
  );
};

export default Usuarios;
