import { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import Modal from './../components/modal'


const urlRoles = 'http://localhost:3000/api/roles';

export const Roles = () => {
  const [formData, setFormData] = useState({
    nombre: '',
  });

  const [state, setState] = useState({
    error: null,
    success: null,
    modalIsOpen: false,
    selectedRol: {
      editnombre: "",
    }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setState((previous) => ({...previous, selectedRol: {...previous.selectedRol, [name]: value}}))
  }

  const handleOpenModal = () => {
    setState((previous) => ({...previous, modalIsOpen: true}));
  };

  const handleCloseModal = () => {
    setState( previous => ({...previous, modalIsOpen: false}) );
  };


  const changeSelectedRol = (rol) => {
    setState((previous => ({...previous, selectedRol: {
      editnombre: rol.nombre,
    } })))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(urlRoles, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setState({ ...state, success: responseData.message });

        setFormData({
          nombre: '',
        });

        setTimeout(() => {
          setState({ ...state, success: 'Rol Creado con exito' });
        }, 2000);

        loadData();
      } else {
        const responseBody = await response.json();
        setState({ ...state, error: responseBody.message });
      }
    } catch (error) {
      setState({ ...state, error: 'Ha ocurrido un error' });
    }
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();
  
    const rolId = state.selectedRol?.id;

    const data = {
      nombre: state.selectedRol?.editnombre,
    }

  
    try {
      const response = await fetch(`${urlRoles}/${rolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        setState(previous => ({...previous, success: "Rol actualizado con exito"}));
        handleCloseModal();
        setFormData({
          nombre: "",
          telefono: "",
          email: "",
          fecha_nacimiento: "",
          password: "",
          secondPassword: "",
        });
        fetch(urlRoles, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((response) => {
            console.log(response)
            setData(response.data)
          }) 
          .catch((error) => console.error(error));

          setTimeout(() => {
            setState(  previous => ({...previous, success: null}));
          }, 2000);


      } else {
        const responseBody = await response.json();
        setState({ ...state, error: responseBody.message });

        setTimeout(() => {
          setState({ ...state, error: null });
        }, 2000);
      }
    } catch (error) {
      setState({ ...state, error: "Ha ocurrido un error" });
    }
  };
  

  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const response = await fetch(urlRoles);
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
  <Modal isOpen={state.modalIsOpen} onClose={handleCloseModal}>
      <h1>Editar Usuario</h1>
      <Form onSubmit={handleSubmitEdit}>
  <Form.Group>
    <Form.Label>Nuevo nombre rol</Form.Label>
    <Form.Control
      type="text"
      name="editnombre"
      value={state.selectedRol.editnombre}
      onChange={handleEditChange}
    />
  </Form.Group>

  
  <Button variant="primary" type="submit">
    Actualizar Rol
  </Button>
</Form>

    </Modal>

      {state.error ? (
        <div className="notificacion error">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="notificacion success">{state.success}</div>
      ) : null}

      <h1>Roles</h1>
      <Form onSubmit={handleSubmit} className="py-5">
        <Form.Group className="mt-2">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </Form.Group>

        <Button className="mt-5" variant="primary" type="submit">
          Enviar Datos
        </Button>
      </Form>

      <h1>Reporte</h1>
      {data.length === 0 && (
        <div>
          <span style={{ color: 'black' }}>No hay datos</span>
        </div>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>
                <Button onClick={() => {
            
              handleOpenModal();

              changeSelectedRol(item);

                }}>Editar</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Roles;
