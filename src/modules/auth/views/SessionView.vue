<script setup>
import { useSessionStore } from '@/modules/auth/stores/sessionStore'
import SessionForm from '@/modules/auth/components/SessionForm.vue'
const sessionStore = useSessionStore()
</script>

<template>
  <section class="login-page">
    <div>
      <p class="etiqueta">Acceso administrativo</p>
      <h2>Inicia sesión para administrar productos</h2>
      <p>La sesión se consulta desde Flask usando cookies y respuestas JSON.</p>
      <div v-if="sessionStore.autenticado" class="estado-box">
        <p><strong>Usuario:</strong> {{ sessionStore.nombreUsuario }}</p>
        <p><strong>Correo:</strong> {{ sessionStore.correo }}</p>
        <button @click="sessionStore.cerrarSesion">Cerrar sesión</button>
      </div>
    </div>
    <SessionForm v-if="!sessionStore.autenticado" />
  </section>
</template>

<style scoped>
.login-page{ display: grid; grid-template-columns: 1fr 420px; gap: 24px; align-items: start; }
.etiqueta{ color: #f97316; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
h2{ font-size: 34px; margin: 6px 0 10px; color: #14213d; }
.estado-box{ margin-top: 18px; background: white; border-radius: 20px; padding: 20px; box-shadow: 0 10px 24px rgba(0,0,0,.10); }
button{ border: 0; border-radius: 12px; padding: 12px 18px; background: #14213d; color: white; font-weight: bold; cursor: pointer; }
@media(max-width: 850px){ .login-page{ grid-template-columns: 1fr; } }
</style>
