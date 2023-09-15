import  { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Modal from "../components/modal";
import { useAuthStore2 } from "../zustand-stores/auth-store";

const url = "http://localhost:3000/api/usuarios";

export const Usuarios = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fecha_nacimiento: "",
    password: "",
    secondPassword: "",
  });

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
    }
  });


  const token = useAuthStore2((state) => state.token)



  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setstate((previous) => ({...previous, selectedUser: {...previous.selectedUser, [name]: value}}))
  }
  

  
  const handleOpenModal = () => {
    setstate((previous) => ({...previous, modalIsOpen: true}));
  };

  const handleCloseModal = () => {
    setstate( previous => ({...previous, modalIsOpen: false}) );
  };


  
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


  const handleSubmit = async (event) => {
    event.preventDefault();



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
        setstate({...state, success: 'Usuario creado con exito'})

        setFormData({
          nombre: "",
          telefono: "",
          email: "",
          fecha_nacimiento: "",
          password: "",
          secondPassword: "",
        })

        setTimeout(() => {
          setstate({...state, success:null})
        } , 2000)

        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((response) => setData(response)) 
          .catch((error) => console.error(error));
      } else {
        const responseBody = await response.json();

        setstate({...state, error: responseBody.message})
        setTimeout(() => {
          setstate(  previous => ({...previous, error: null}) );
        }, 2000);
      }
    } catch (error) {
      setstate(previous => ({...previous, error: "Ha ocurrido un error"}) );
    }
  };

  const [data, setData] = useState([]);


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
        },
        body: JSON.stringify(data),
        Authorization: `Bearer ${token}`,
      });
  
      if (response.ok) {
        setstate(previous => ({...previous, success: "Usuario actualizado con exito"}));
        handleCloseModal();
        setFormData({
          nombre: "",
          telefono: "",
          email: "",
          fecha_nacimiento: "",
          password: "",
          secondPassword: "",
        });
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((response) => {
          
            setData(response)
          }) 
          .catch((error) => console.error(error));

          setTimeout(() => {
            setstate(  previous => ({...previous, success: null}));
          }, 2000);


      } else {
        const responseBody = await response.json();
        setstate({ ...state, error: responseBody.message });

        setData([])

        setTimeout(() => {
          setstate({ ...state, error: null });
        }, 2000);
      }
    } catch (error) {
      setstate({ ...state, error: "Ha ocurrido un error" });
    }
  };
  


  useEffect(() => {
    

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
            <th>Fecha de Nacimiento</th>
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
