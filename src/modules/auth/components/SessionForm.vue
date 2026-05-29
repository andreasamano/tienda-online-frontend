<script setup>
import { reactive, computed } from 'vue'
import { useSessionStore } from '@/modules/auth/stores/sessionStore'

const sessionStore = useSessionStore()
const form = reactive({ correo: 'admin@novamarket.com', password: '12345' })
const formularioValido = computed(() => form.correo.trim() !== '' && form.password.trim() !== '')

async function enviarFormulario() {
  if (!formularioValido.value) return
  await sessionStore.iniciarSesion(form)
}
</script>

<template>
  <form class="login-form" @submit.prevent="enviarFormulario">
    <label for="correo">Correo</label>
    <input id="correo" type="email" v-model.trim="form.correo" placeholder="admin@novamarket.com" />

    <label for="password">Contraseña</label>
    <input id="password" type="password" v-model.trim="form.password" placeholder="Tu contraseña" @keyup.enter="enviarFormulario" />

    <button type="submit" :disabled="!formularioValido">Iniciar sesión</button>

    <p v-if="!formularioValido" class="warning">Completa correo y contraseña.</p>
    <p v-if="sessionStore.mensaje" class="success">{{ sessionStore.mensaje }}</p>
    <p v-if="sessionStore.error" class="warning">{{ sessionStore.error }}</p>
  </form>
</template>

<style scoped>
.login-form{
  background: white;
  border-radius: 22px;
  padding: 24px;
  max-width: 380px;
  box-shadow: 0 14px 30px rgba(15,24,43,.10);
}
label { display: block; margin-bottom: 8px; font-weight: 800; }
input, button {
  width: 100%; padding: 12px; border-radius: 12px; border: 2px solid #dbe3f0; margin-bottom: 14px;
}
button{ border: none; background: linear-gradient(90deg, #f97316, #fb923c); color: white; font-weight: 900; cursor: pointer; }
button:disabled{ opacity: .5; cursor: not-allowed; }
.warning { color: #b91c1c; font-weight: bold; }
.success{ color: #15803d; font-weight: bold; }
</style>
