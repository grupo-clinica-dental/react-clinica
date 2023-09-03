import {React, useState, useEffect} from 'react'
import { Form, Button, Table } from "react-bootstrap";

var url = "http://localhost:3000/api/especialidades";

 const especialidades = () => {
    const [formData, useFormData] = useState({
        nombre : '',
        fecha_borrado : '',
        
        
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
                console.log("DATOS ENVIADOS");
                console.log(response);
            }else{
                const responsebody = await response.json()
                console.log("Error en enviar los datos")
                console.log(response);
            }

        }catch (error){
            console.error("Error en enviar los datos", datos)
        }
    }
    
    const [Data, useData] = useState([])

    useEffect( () => {

        fetch(url, {

            method: 'GET',
            headers: {

                'Content-Type' : 'aplication/json'
            }
        })
        .then(response => {

            return response.json();
        })
        .then( Data => {

            useData(Data) 

        })
        .catch((error) => {
            console.error(error);
        })

    }, []);


    return (
       <>
            <h2> Especialidades</h2>
            <Form onSubmit={Enviardatos}>
                <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type='text' name='nombre' value={formData.nombre} onChange={cambiodata}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Fecha Borrado</Form.Label>
                    <Form.Control type='text' name='fecha_borrado' value={formData.fecha_borrado} onChange={cambiodata}/>
                </Form.Group>
                <Button variant='primary' type='submit'>Enviar Datos</Button>

            </Form>
            <h1>Reporte</h1>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha Borrado</th>
                       
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </Table>
       </>
    )
  
}

export default especialidades;