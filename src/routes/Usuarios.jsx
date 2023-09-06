import  { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";

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
    error: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
<<<<<<< Updated upstream
        getDatos();
=======
        console.log("Datos Enviados");
        console.log(JSON.stringify(responseData));
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => setData(data)) 
          .catch((error) => console.error(error));
>>>>>>> Stashed changes
      } else {
        const responseBody = await response.json();
        console.log("Error al enviar datos");
        console.log(responseBody);

        setstate({...state, error: responseBody.message})
        setTimeout(() => {
          setstate({...state, error: ''})
        }, 2000);
      }
    } catch (error) {
      console.error("Error al enviar datos", error);
    }
  };

  const [data, setData] = useState([]);

  const getDatos = async ()=>{

    const response = await fetch(url);
    const responseData = await response.json();
    if (response.ok){

      setData(responseData);

    }

  }

  useEffect(() => {
<<<<<<< Updated upstream
    
    getDatos();

=======
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data)) // Asegúrate de que este sea el campo correcto
      .catch((error) => console.error(error));
>>>>>>> Stashed changes
  }, []);

  return (
    <>
      <h1>Usuarios</h1>

      <Form onSubmit={handleSubmit}>
    {state.error ? <div className="notificacion">{state.error}</div> : null }

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
          <Form.Label>Fecha de Nacimiento</Form.Label>
          <Form.Control
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
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
          {data?.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.telefono}</td>
              <td>{item.email}</td>
              <td>{item.fecha_nacimiento}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Usuarios;
