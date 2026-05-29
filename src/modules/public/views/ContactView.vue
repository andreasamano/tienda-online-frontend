<script setup>
import { reactive, ref, computed } from 'vue'
import { API_BASE_URL } from '@/config/api'
const form = reactive({ nombre: '', correo: '', mensaje: '' })
const enviando = ref(false)
const respuesta = ref('')
const error = ref('')
const formularioValido = computed(() => form.nombre.trim() !== '' && form.correo.trim() !== '' && form.mensaje.trim() !== '')

async function enviarContacto() {
  if (!formularioValido.value) return
  enviando.value = true
  respuesta.value = ''
  error.value = ''
  try {
    const res = await fetch(`${API_BASE_URL}/contacto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const datos = await res.json()
    if (!res.ok) {
      const detalle = datos.errores ? datos.errores.join(', ') : datos.mensaje
      throw new Error(detalle || 'No se pudo enviar el mensaje')
    }
    respuesta.value = datos.mensaje
    form.nombre = ''
    form.correo = ''
    form.mensaje = ''
  } catch (err) {
    error.value = err.message
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="contacto">
    <div>
      <p class="etiqueta">Contacto</p>
      <h2>Envíanos un mensaje</h2>
      <p>Este formulario usa <strong>POST /contacto</strong> en Flask y puede mandar un correo al administrador.</p>
    </div>

    <form class="formulario" @submit.prevent="enviarContacto">
      <label>Nombre</label>
      <input v-model.trim="form.nombre" placeholder="Tu nombre" />
      <label>Correo</label>
      <input v-model.trim="form.correo" type="email" placeholder="correo@ejemplo.com" />
      <label>Mensaje</label>
      <textarea v-model.trim="form.mensaje" placeholder="Escribe tu duda o solicitud"></textarea>
      <button type="submit" :disabled="!formularioValido || enviando">{{ enviando ? 'Enviando...' : 'Enviar correo' }}</button>
      <p v-if="!formularioValido" class="aviso">Todos los campos son obligatorios.</p>
      <p v-if="respuesta" class="ok">{{ respuesta }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </section>
</template>

<style scoped>
.contacto{ display: grid; grid-template-columns: 1fr 430px; gap: 24px; align-items: start; }
.etiqueta{ color: #f97316; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
h2{ font-size: 38px; margin: 0 0 12px; }
.formulario{ background: white; border-radius: 24px; padding: 22px; box-shadow: 0 14px 30px rgba(0,0,0,.10); }
label{ display: block; font-weight: 900; margin-bottom: 8px; }
input, textarea{ width: 100%; border: 2px solid #dbe3f0; border-radius: 14px; padding: 12px; margin-bottom: 12px; }
textarea{ min-height: 130px; resize: vertical; }
button{ width: 100%; border: 0; border-radius: 14px; padding: 13px; background: #f97316; color: white; font-weight: 900; cursor: pointer; }
button:disabled{ opacity: .5; cursor: not-allowed; }
.ok{ color: #15803d; font-weight: 800; }
.error, .aviso{ color: #b91c1c; font-weight: 800; }
@media(max-width: 850px){ .contacto{ grid-template-columns: 1fr; } }
</style>
