import { React, useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";

var url = "http://localhost:3000/api/doctores";

const Doctores = () => {
  const [formData, useFormData] = useState({
    nombre: "",
    correo_electronico: "",
    color: "",
  });

  const [state, setstate] = useState({
    error: null,
    success: null,
  });

  const resetFormData = () => {
    useFormData({
      id: "",
      nombre: "",
      correo_electronico: "",
      color: "",
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
  const enviarDataPost = async (event) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const responsebody = await response.json();

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
        formData.color = "";
      } else {
        const responsebody = await response.json();
       
        setstate({
          ...state,
          error: "habia un error.",
        });
        setTimeout(() => {
          setstate({
            ...state,
            error: "",
          });
        }, 2000);

        console.log(responsebody);
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
      console.error("Error en enviar los datos", datos);
    }
  }

  const enviarDataPUT = async () => {
    try {
      const response = await fetch(url + '/' + formData.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const responsebody = await response.json();

        
        getDatos();
        resetFormData();
        formData.nombre = "";
        formData.correo_electronico = "";
        formData.color = "";
      } else {
        const responsebody = await response.json();
       
        

        console.log(responsebody);
      }
    } catch (error) {
      
      console.error("Error en enviar los datos", datos);
    }

  }

  async function enviarDataDelete(item){
    try {
      const response = await fetch(url + '/' + item.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
        
      });
      if (response.ok) {
        const responsebody = await response.json();

        
        getDatos();
        resetFormData();
        formData.nombre = "";
        formData.correo_electronico = "";
        formData.color = "";
      } else {
        const responsebody = await response.json();
       
        setstate({
          ...state,
          error: "habia un error.",
        });
        

        console.log(responsebody);
      }
    } catch (error) {
      
      console.error("Error en enviar los datos", datos);
    }

  }

  function actualizarForm(item){
    resetFormData();
    let arreglo = {
      id: item.id,
      nombre: item.nombre,
      correo_electronico: item.correo_electronico,
      color: item.color,
    }
    useFormData(arreglo);
  }

  function actualizarForm(item){
    resetFormData();
    let arreglo = {
      id: item.id,
      nombre: item.nombre,
      correo_electronico: item.correo_electronico,
      color: item.color,
    }
    useFormData(arreglo);
  }
  const [Data, useData] = useState([]);

  const getDatos = async () => {
    const response = await fetch(url);
    const responseData = await response.json();

    if (response.ok) {
      useData(responseData);
      
    }else{
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
              <td>
                <button type="button" class="btn btn-warning" onClick={() => actualizarForm(item)}>
                  Actualizar
                </button>
              </td>
              <td>
                <button type="button" class="btn btn-danger" onClick={() => enviarDataDelete(item)}>
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
