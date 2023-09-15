import { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Modal from './../components/modal'

const urlEstadosCita = "http://localhost:3000/api/estadoCita";

export const EstadosCita = () => {
  const [formData, setFormData] = useState({
    estado: "",
    activo: true,
  });

  const [state, setState] = useState({
    error: null,
    success: null,
    modalIsOpen: false,
    selectedEstado: {
      editnombre: "",
    }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setState((previous) => ({...previous, selectedEstado: {...previous.selectedEstado, [name]: value}}))
  }

  const handleOpenModal = () => {
    setState((previous) => ({...previous, modalIsOpen: true}));
  };

  const handleCloseModal = () => {
    setState( previous => ({...previous, modalIsOpen: false}) );
  };


 const changeSelectedEstado = (estado) => {
    setState((previous => ({...previous, selectedEstado: {
      editnombre: estado.estado,
    } })))
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(urlEstadosCita, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setState({ ...state, success: 'Estado de cita creado con exito' });

        setFormData({
          estado: "",
          activo: true,
          fecha_borrado: ""
        });

        setTimeout(() => {
          setState({ ...state, success: null });
        }, 2000);

      loadData()
      } else {
        const responseBody = await response.json();
        setState({ ...state, error: responseBody.message });
        setTimeout(() => {
          setState({ ...state, error: null });
        }, 2000);
      }
    } catch (error) {
      setState({ ...state, error: 'Ha ocurrido un error' });
    }
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();
  
    const estadoId = state.selectedEstado?.id;

    const data = {
      estado: state.selectedEstado?.editnombre,
 
    }

  
    try {
      const response = await fetch(`${urlEstadosCita}/${estadoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        setState(previous => ({...previous, success: "Estado actualizado con exito"}));
        handleCloseModal();
        setFormData({
          nombre: "",
          telefono: "",
          email: "",
          fecha_nacimiento: "",
          password: "",
          secondPassword: "",
        });
        fetch(urlEstadosCita, {
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

  const loadData = ()  => {
    fetch(urlEstadosCita, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => setData(response.data))
        .catch((error) => console.error(error));
  }

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
      value={state.selectedEstado.editnombre}
      onChange={handleEditChange}
    />
  </Form.Group>

  
  <Button variant="primary" type="submit">
    Actualizar Estado Cita
  </Button>
</Form>

    </Modal>

   {state.error ? (
        <div className="notificacion error">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="notificacion success">{state.success}</div>
      ) : null}
      <h1>Estados de Cita</h1>
      
      <Form onSubmit={handleSubmit} className="py-5">
       

        <Form.Group className="mt-2">
          <Form.Label>Estado</Form.Label>
          <Form.Control
            type="text"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          />
        </Form.Group>


        <Button className="mt-5" variant="primary" type="submit">
          Enviar Datos
        </Button>
      </Form>

      <h1>Reporte</h1>

      {!data === 0 && (
            <div>
              <span colSpan="4" style={{color: 'black'}}>No hay datos</span>
            </div>
          )
          }

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Estado</th>
            <th>Activo</th>
            <th>Fecha de Borrado</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.estado}</td>
              <td>{item.activo ? "Sí" : "No"}</td>
              <td>{item.fecha_borrado ? new Date(item.fecha_borrado).toLocaleDateString('es-hn', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }) : null}</td>
                  <td>
                <Button onClick={() => {
            
              handleOpenModal();

              changeSelectedEstado(item);

                }}>Editar</Button></td>
            </tr>
          ))}
       
        </tbody>
      </Table>
    </>
  );
};

export default EstadosCita;
