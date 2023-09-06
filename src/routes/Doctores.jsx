import {React, useState, useEffect} from 'react'
import { Form, Button, Table } from "react-bootstrap";

var url = "http://localhost:3000/api/doctores";

 const Doctores = () => {
    const [formData, useFormData] = useState({
        usuario_id : '',
        fecha_borrado : '',
        color : ''
    });

    const cambiodata = (event) => {
        const { name , value } = event.target; 
        useFormData({...formData, [name] : value })
    }

    const Enviardatos = async () => {
        event.preventDefault();

        try{
            
            const response = await fetch( url , {
                method : 'POST',
                headers : {
                    'Content-Type' : 'aplication/json'
                },
                body : JSON.stringify(formData)

            });
            if (response.ok) {
                const responsebody = await response.json()
                getDatos()
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
                    <Form.Label>Usuario_id</Form.Label>
                    <Form.Control type='text' name='usuario_id' value={formData.usuario_id} onChange={cambiodata}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Fecha Borrado</Form.Label>
                    <Form.Control type='text' name='fecha_borrado' value={formData.fecha_borrado} onChange={cambiodata}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Color</Form.Label>
                    <Form.Control type='text' name='color' value={formData.color} onChange={cambiodata}/>
                </Form.Group>

                <Button variant='primary' type='submit'>Enviar Datos</Button>

            </Form>
            <h1>Reporte</h1>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Usuario_id</th>
                        <th>Fecha Borrado</th>
                        <th>Color</th>
                    </tr>
                </thead>
                <tbody>
                    {Data.map( item => (
                        <tr key = {item.id}>
                           <td>{item.usuario_id}</td> 
                           <td>{item.fecha_borrado}</td>
                           <td>{item.color}</td>
                           
                        </tr>
                    ))}
                </tbody>
            </Table>
       </>
    )
  
}

export default Doctores;