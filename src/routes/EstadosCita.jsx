import { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";

const urlEstadosCita = "http://localhost:3000/api/estadoCita";

export const EstadosCita = () => {
  const [formData, setFormData] = useState({
    estado: "",
    activo: true,
    fecha_borrado: ""
  });

  const [state, setState] = useState({
    error: null,
    success: null
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

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
        const responseData = await response.json();
        setState({ ...state, success: responseData.message });

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

  const [data, setData] = useState([]);

  const loadData = ()  => {
    fetch(urlEstadosCita, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => setData(response))
        .catch((error) => console.error(error));
  }

  useEffect(() => {
  loadData();
  }, []);

  return (
    <>
   {state.error ? (
        <div className="notificacion error">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="notificacion success">Doctor creado fue un exicto</div>
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
              <td>{item.fecha_borrado ? new Date(item.fecha_borrado).toDateString('es') : null}</td>
            </tr>
          ))}
       
        </tbody>
      </Table>
    </>
  );
};

export default EstadosCita;
