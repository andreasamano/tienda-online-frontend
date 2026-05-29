import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_BASE_URL } from '@/config/api'

export const useSessionStore = defineStore('session', () => {
  const nombreUsuario = ref('Invitado')
  const correo = ref(null)
  const autenticado = ref(false)
  const mensaje = ref('')
  const error = ref('')

  const nombreBienvenida = computed(() => nombreUsuario.value || 'Invitado')

  async function consultarSesion() {
    try {
      const respuesta = await fetch(`${API_BASE_URL}/sesion`, { credentials: 'include' })
      const datos = await respuesta.json()
      nombreUsuario.value = datos.nombreUsuario || 'Invitado'
      correo.value = datos.correo || null
      autenticado.value = datos.autenticado === true
    } catch {
      nombreUsuario.value = 'Invitado'
      correo.value = null
      autenticado.value = false
    }
  }

  async function iniciarSesion(datosLogin) {
    mensaje.value = ''
    error.value = ''
    try {
      const respuesta = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(datosLogin)
      })
      const resultado = await respuesta.json()
      if (!respuesta.ok) {
        const detalle = resultado.errores ? resultado.errores.join(', ') : resultado.mensaje
        throw new Error(detalle || 'No se pudo iniciar sesión')
      }
      nombreUsuario.value = resultado.sesion.nombreUsuario
      correo.value = resultado.sesion.correo
      autenticado.value = true
      mensaje.value = resultado.mensaje
      return true
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  async function cerrarSesion() {
    await fetch(`${API_BASE_URL}/logout`, { method: 'POST', credentials: 'include' })
    nombreUsuario.value = 'Invitado'
    correo.value = null
    autenticado.value = false
  }

  return { nombreUsuario, correo, autenticado, mensaje, error, nombreBienvenida, consultarSesion, iniciarSesion, cerrarSesion }
})
