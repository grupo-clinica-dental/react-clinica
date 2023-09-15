import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuthStore2 } from "../zustand-stores/auth-store"

export default function LoginPage() {



  const setProfile = useAuthStore2(state => state.setProfile)

  const setToken = useAuthStore2(state => state.setToken)


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


        const url = 'http://localhost:3000/api/auth/login'

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
            } else {
              console.log({error: response})
           return  response.json().then((response) => {
            setstate(previous => ({...previous, error: response.message}))
              setTimeout(() => {
                setstate(previous => ({...previous, error: ''}))
              }, 2000);
            return Promise.reject(response)
              })
            }
        }).then((response) => {

          setstate(previous => ({...previous, success: response.welcomeMessage}))
            if (response) {
              setToken(response.token)
              setProfile(response.profile)
              setTimeout(() => {            
                navigate('/') 
              }, 2000);
            
            }
        }).catch((error) => {
            console.error(error)
            setstate(previous => ({...previous, error: 'Ha ocurrido un error'}))
        })
        }

    return (

      <>
          {state.error ? <div className="notificacion error">{state.error}</div> : null }
    {state.success ? <div className="notificacion success">{state.success}</div> : null }.
    

    <div>
  <h1>Iniciar Sesion</h1>]
  <span>{state.error ? state.error : null}</span>
      <Form onSubmit={handleSubmit}>
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

  <Form.Group>
    <Form.Label>Confirmar Contraseña</Form.Label>
    <Form.Control
      type="password"
      name="secondPassword"
      value={formData.secondPassword}
      onChange={changeFormData}
    />
  </Form.Group>

  <Button variant="primary" type="submit">
    Actualizar Usuario
  </Button>
</Form>
        </div>
      </>
    
    )
}