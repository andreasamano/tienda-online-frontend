<script setup>
import { provide, computed, onMounted } from 'vue'
import { useSessionStore } from '@/modules/auth/stores/sessionStore'
import { useCartStore } from '@/modules/public/stores/cartStore'
import MainNavbar from '@/modules/public/components/MainNavbar.vue'

const sessionStore = useSessionStore()
const cartStore = useCartStore()

onMounted(() => {
  sessionStore.consultarSesion()
  cartStore.cargarCarritoLocal()
})

provide('nombreUsuarioGlobal', computed(() => sessionStore.nombreBienvenida))
provide('totalCarritoGlobal', computed(() => cartStore.totalArticulos))
</script>

<template>
  <div class="app-shell">
    <MainNavbar />
    <main class="contenedor-pagina">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell{
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 122, 0, .14), transparent 34%),
    radial-gradient(circle at bottom right, rgba(59, 130, 246, .14), transparent 34%),
    linear-gradient(180deg, #fffaf4 0%, #eef5ff 100%);
}
.contenedor-pagina {
  max-width: 1120px;
  margin: 0 auto;
  padding: 30px 20px 46px;
}
</style>
