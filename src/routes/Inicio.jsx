import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { useEffect, useState } from 'react'
import { API_URL } from '../api/api.config'
import { useAuthStore2 } from '../zustand-stores/auth-store'

export default function Inicio() {

  const token = useAuthStore2((state) => state.token)

  const url = `${API_URL}/api/citas`
  
  const [state, setstate] = useState({
    error: null,
    success: null,
    loading: false,
    citas: [],
  })

  const resetError = () => {
    setTimeout(() => {
      setstate((previous) => ({ ...previous, error: null }))
    }, 2000)
  }


  const resetSuccess = () => {  
    setTimeout(() => {
      setstate((previous) => ({ ...previous, success: null }))
    }, 2000)
  }

  const getCitas = async () => {

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
  
  
      if(response.ok) {
        const data = await response.json()
        setstate({
          ...state,
          citas: data.item_cita
        })
        resetSuccess()
      }else{
        setstate({
          ...state,
          error: 'Error al traer las citas'
        })
      }
    } catch (error) {
      setstate(previous => ({...previous, error: 'Ha ocurrido un error'} ))
      resetError()
    }
   
  }

  useEffect(() => {
getCitas()
  }, [])






    return (

      <>
            {state.error ? (
        <div className="notificacion error">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="notificacion success">{state.success}</div>
      ) : null}
        <FullCalendar
        weekends={false}
        events={state.citas?.map((cita) => {
          return {
            title: `Cita con ${cita.paciente.nombre}`,
            date: cita.fecha_fin,
            backgroundColor: cita.doctor.color,
          }
        })}
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
      />
      </>
      
    )
}