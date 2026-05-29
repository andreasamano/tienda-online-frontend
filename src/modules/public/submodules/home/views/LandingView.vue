<script setup>
import { inject } from 'vue'
const nombreUsuarioGlobal = inject('nombreUsuarioGlobal')
const totalCarritoGlobal = inject('totalCarritoGlobal')
</script>

<template>
  <section class="hero">
    <div class="hero-text">
      <p class="bienvenida">Bienvenido a NovaMarket</p>
      <h2>Tienda en línea con productos, carrito, pedidos, sesión y contacto.</h2>
      <p>Usuario actual: <strong>{{ nombreUsuarioGlobal }}</strong></p>
      <p>Artículos en carrito: <strong>{{ totalCarritoGlobal }}</strong></p>
      <div class="botones">
        <RouterLink to="/productos" class="hero-btn">Ver productos</RouterLink>
        <RouterLink to="/contacto" class="hero-btn secundario">Contactar tienda</RouterLink>
      </div>
    </div>

    <div class="hero-card">
      <h3>Requisitos cubiertos</h3>
      <ul>
        <li>Vue 3 con componentes, slots, v-if, v-for, v-model, v-show y ref</li>
        <li>Fetch hacia Flask</li>
        <li>Login, consulta de sesión y logout</li>
        <li>MariaDB para usuarios, productos y pedidos</li>
        <li>Correo desde Flask para contacto</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hero{ display: grid; grid-template-columns: 1.45fr 1fr; gap: 24px; align-items: center; }
.bienvenida{ color: #f97316; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; font-size: 17px; }
h2{ font-size: 44px; margin: 10px 0 15px; color: #14213d; line-height: 1.08; }
.botones{ display: flex; gap: 12px; flex-wrap: wrap; margin-top: 18px; }
.hero-btn{ display: inline-block; text-decoration: none; background: #f97316; color: white; padding: 13px 20px; border-radius: 999px; font-weight: 900; }
.hero-btn.secundario{ background: #14213d; }
.hero-card{ background: white; border-radius: 24px; padding: 26px; box-shadow: 0 14px 30px rgba(15,24,44,.13); }
.hero-card li{ margin-bottom: 10px; line-height: 1.5; }
@media (max-width: 850px) { .hero { grid-template-columns: 1fr; } h2{ font-size: 32px; } }
</style>
