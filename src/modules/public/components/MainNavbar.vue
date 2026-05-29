<script setup>
import { computed } from 'vue'
import { useSessionStore } from '@/modules/auth/stores/sessionStore'
import { useCartStore } from '@/modules/public/stores/cartStore'

const sessionStore = useSessionStore()
const cartStore = useCartStore()
const nombreUsuario = computed(() => sessionStore.nombreBienvenida)
</script>

<template>
  <header class="navbar">
    <RouterLink to="/" class="brand">
      <span class="logo">🛒</span>
      <div>
        <h1>NovaMarket</h1>
        <p>Tienda en línea con Vue 3 + Flask</p>
      </div>
    </RouterLink>

    <nav class="links">
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/productos">Productos</RouterLink>
      <RouterLink to="/carrito">Carrito <b v-if="cartStore.totalArticulos">{{ cartStore.totalArticulos }}</b></RouterLink>
      <RouterLink to="/contacto">Contacto</RouterLink>
      <RouterLink v-if="sessionStore.autenticado" to="/admin">Admin</RouterLink>
      <RouterLink v-else to="/login">Login</RouterLink>
    </nav>

    <div class="user-box">
      <span>{{ nombreUsuario }}</span>
      <small>{{ sessionStore.autenticado ? 'Sesión activa' : 'Invitado' }}</small>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 1.2fr 2fr auto;
  gap: 18px;
  align-items: center;
  padding: 16px 24px;
  background: rgba(20, 33, 61, .94);
  color: white;
  box-shadow: 0 10px 28px rgba(0,0,0,.18);
  backdrop-filter: blur(12px);
}
.brand{
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo { font-size: 32px; }
.brand h1{ margin: 0; font-size: 23px; }
.brand p { margin: 2px 0 0; font-size: 13px; color: #dbeafe; }
.links { display: flex; justify-content: center; align-items: center; gap: 9px; flex-wrap: wrap; }
.links a{
  text-decoration: none;
  color: white;
  background: rgba(255,255,255,.10);
  padding: 9px 13px;
  border-radius: 999px;
  transition: .2s ease;
}
.links b{
  margin-left: 5px;
  background: #f97316;
  padding: 2px 7px;
  border-radius: 999px;
}
.links a:hover, .links a.router-link-active{ background: #f97316; }
.user-box {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 3px;
  background: rgba(255,255,255,.10);
  padding: 9px 13px;
  border-radius: 15px;
}
.user-box span { font-weight: bold; }
.user-box small { color: #cbd5e1; }
@media (max-width: 900px){
  .navbar { grid-template-columns: 1fr; text-align: center; }
  .brand, .user-box { justify-content: center; align-items: center; }
}
</style>
