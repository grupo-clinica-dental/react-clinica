import {React, useState, useEffect} from 'react'
import { Form, Button, Table } from "react-bootstrap";

var url = "http://localhost:3000/api/doctores";

 const Doctores = () => {
    const [formData, useFormData] = useState({
        nombre : '',
        correo_electronico : '',
        color : ''
    });

    const cambiodata = (event) => {
        const { name , value } = event.target; 
        useFormData({...formData, [name] : value })
    }

    const Enviardatos = async (event) => {
        event.preventDefault();

        try{
            
            const response = await fetch( url , {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(formData)

            });
            if (response.ok) {
                const responsebody = await response.json()
                getDatos();
                formData.nombre = '';
                formData.correo_electronico = '';
                formData.color = '';
            }else{
                const responsebody = await response.json()
                console.log(responsebody);
            }

        }catch (error){
            console.error("Error en enviar los datos", datos);
        }
    }
    
    const [Data, useData] = useState([])

    const getDatos = async ()=>{

        const response = await fetch(url);
        const responseData = await response.json();

        if (response.ok){

            useData(responseData);

        }

    };

    useEffect( () => {
        getDatos();
    }, []);


    return (
       <>
            <h2> Doctores</h2>
            <Form onSubmit={Enviardatos}>
                <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type='text' name='nombre' value={formData.nombre} onChange={cambiodata}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Correo electronico</Form.Label>
                    <Form.Control type='email' name='correo_electronico' value={formData.correo_electronico} onChange={cambiodata}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Color</Form.Label>
                    <Form.Control type='color' name='color' value={formData.color} onChange={cambiodata}/>
                </Form.Group>

                <Button variant='primary' type='submit'>Enviar Datos</Button>

            </Form>
            <h1>Reporte</h1>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo Electronico</th>
                        <th>Color</th>
                    </tr>
                </thead>
                <tbody>
                    {Data.map(item => (
                        <tr key = {item.id}>
                           <td>{item.nombre}</td> 
                           <td>{item.correo_electronico}</td>
                           <td style={{ backgroundColor: `${item.color}` } } >   </td>
                           
                        </tr>
                    ))}
                </tbody>
            </Table>
       </>
    )
  
}

export default Doctores;