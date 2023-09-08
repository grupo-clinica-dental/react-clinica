import {React, useState, useEffect} from 'react'
import { Form, Button, Table } from "react-bootstrap";

var url = "http://localhost:3000/api/especialidades";

 const especialidades = () => {
    const [formData, useFormData] = useState({
        nombre : ''
        
        
        
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
            }else{
                const responsebody = await response.json()
                
            }

        }catch (error){
            console.error("Error en enviar los datos", datos)
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
            <h2> Especialidades</h2>
            <Form onSubmit={Enviardatos}>
                <Form.Group>
                    <Form.Label>Nombre Especialidad</Form.Label>
                    <Form.Control type='text' name='nombre' value={formData.nombre} onChange={cambiodata}/>
                </Form.Group>
                <br></br>
                <Button variant='primary' type='submit'>Enviar Datos</Button>

            </Form>
            <h1>Reporte</h1>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre Especialidad</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {Data.map( item => (
                        <tr key = {item.id}>
                           <td>{item.nombre}</td> 
                           
                        </tr>
                    ))}
                </tbody>
            </Table>
       </>
    )
  
}

export default especialidades;