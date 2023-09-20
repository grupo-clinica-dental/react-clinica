/* eslint-disable no-unused-vars */
import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuthStore2 } from "../zustand-stores/auth-store"
import { API_URL } from "../api/api.config"

export default function LoginPage() {


  console.log(API_URL)

  const setProfile = useAuthStore2(state => state.setProfile)

  const { setToken } = useAuthStore2();


    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        secondPassword: '',
    })


    const changeFormData = (event) => {
        const { name, value } = event.target
        setFormData(previous => ({...previous, [name]: value}))
    }

const [state, setstate] = useState({
    error: '',
    success: '',
    modalIsOpen: false,
})

    const handleSubmit = async (event) => {
        event.preventDefault()


        try {
          const url = `${API_URL}/api/auth/login`

          const response = await  fetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
              'Content-Type': 'application/json'
            }
          })
    
          if(response.ok) {
            const newResponse = await response.json()
            setstate(previous => ({...previous, success: newResponse.data.welcomeMessage}))
            setToken(newResponse.data.token)
            setProfile(newResponse.data.profile)
            setTimeout(() => {
              navigate('/Inicio')
            }, 500);
          }
    
    
          if(!response.ok) {
            const otherResponse = await response.json()
            setstate(previous => ({...previous, error: otherResponse.data.message}))
            setTimeout(() => {
              setstate(previous => ({...previous, error: ''}))
            }, 2000);
          }
        
          
        } catch (error) {
          console.log(error)
          setstate(previous => ({...previous, error: 'Ha ocurrido un error al iniciar sesion'}))
        }
      }
    return (

      <div className="w-full">
          {state.error ? <div className="notificacion error">{state.error}</div> : null }
    {state.success ? <div className="notificacion success">{state.success}</div> : null }.
    

    <div className="login-page">
  <span>{state.error ? state.error : null}</span>
      <Form onSubmit={handleSubmit}>
  <h1>Iniciar Sesion</h1>

  <Form.Group>
    <Form.Label>Email</Form.Label>
    <Form.Control
      type="text"
      name="email"
      value={formData.email}
      onChange={changeFormData}
    />
  </Form.Group>

 



  <Form.Group>
    <Form.Label>Contraseña</Form.Label>
    <Form.Control
      type="password"
      name="password"
      value={formData.password}
      onChange={changeFormData}
    />
  </Form.Group>



  <Button variant="primary" type="submit">
    Iniciar Sesion
  </Button>
</Form>
        </div>
      </div>
    
    )
}