<script setup>
import { reactive, computed } from 'vue'
import { useCartStore } from '@/modules/public/stores/cartStore'

const cartStore = useCartStore()
const cliente = reactive({ nombre: '', correo: '', direccion: '' })
const formularioValido = computed(() => cliente.nombre.trim() !== '' && cliente.correo.trim() !== '' && cliente.direccion.trim() !== '' && cartStore.items.length > 0)

async function confirmarPedido() {
  if (!formularioValido.value) return
  const ok = await cartStore.confirmarPedido(cliente)
  if (ok) {
    cliente.nombre = ''
    cliente.correo = ''
    cliente.direccion = ''
  }
}
</script>

<template>
  <section>
    <p class="etiqueta">Carrito</p>
    <h2>Resumen de compra</h2>

    <div v-if="cartStore.items.length > 0" class="layout">
      <div class="items">
        <article v-for="item in cartStore.items" :key="item.id" class="item">
          <div class="icono">{{ item.icono || '📦' }}</div>
          <div>
            <h3>{{ item.nombre }}</h3>
            <p>${{ Number(item.precio).toFixed(2) }} c/u</p>
          </div>
          <input type="number" min="1" :value="item.cantidad" @input="cartStore.cambiarCantidad(item.id, $event.target.value)" />
          <strong>${{ (Number(item.precio) * Number(item.cantidad)).toFixed(2) }}</strong>
          <button @click="cartStore.quitarDelCarrito(item.id)">Quitar</button>
        </article>
      </div>

      <form class="checkout" @submit.prevent="confirmarPedido">
        <h3>Datos para envío</h3>
        <label>Nombre completo</label>
        <input v-model.trim="cliente.nombre" placeholder="Tu nombre" />
        <label>Correo</label>
        <input v-model.trim="cliente.correo" type="email" placeholder="correo@ejemplo.com" />
        <label>Dirección</label>
        <textarea v-model.trim="cliente.direccion" placeholder="Calle, número, colonia, ciudad"></textarea>
        <div class="total">
          <span>Total:</span>
          <strong>${{ cartStore.totalPagar.toFixed(2) }}</strong>
        </div>
        <button type="submit" :disabled="!formularioValido">Confirmar pedido</button>
        <p v-if="!formularioValido" class="aviso">Completa los datos y agrega productos.</p>
        <p v-if="cartStore.mensaje" class="ok">{{ cartStore.mensaje }}</p>
        <p v-if="cartStore.error" class="error">{{ cartStore.error }}</p>
      </form>
    </div>

    <div v-else class="vacio">
      <h3>Tu carrito está vacío</h3>
      <RouterLink to="/productos">Ir al catálogo</RouterLink>
      <p v-if="cartStore.mensaje" class="ok">{{ cartStore.mensaje }}</p>
    </div>
  </section>
</template>

<style scoped>
.etiqueta{ color: #f97316; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
h2{ font-size: 34px; margin: 0 0 20px; }
.layout{ display: grid; grid-template-columns: 1fr 360px; gap: 20px; align-items: start; }
.items{ display: grid; gap: 12px; }
.item{ background: white; border-radius: 20px; padding: 14px; display: grid; grid-template-columns: 58px 1fr 80px 100px 80px; align-items: center; gap: 12px; box-shadow: 0 8px 18px rgba(0,0,0,.08); }
.icono{ width: 58px; height: 58px; border-radius: 16px; background: #eef2ff; display: grid; place-items: center; font-size: 28px; }
h3{ margin: 0; }
input, textarea{ width: 100%; border: 2px solid #dbe3f0; border-radius: 14px; padding: 12px; margin-bottom: 12px; }
textarea{ min-height: 90px; resize: vertical; }
button, a{ border: 0; border-radius: 12px; padding: 11px 14px; background: #f97316; color: white; font-weight: 900; cursor: pointer; text-decoration: none; display: inline-block; text-align: center; }
button:disabled{ opacity: .5; cursor: not-allowed; }
.checkout, .vacio{ background: white; border-radius: 22px; padding: 20px; box-shadow: 0 12px 26px rgba(0,0,0,.10); }
.total{ display: flex; justify-content: space-between; align-items: center; margin: 12px 0; font-size: 20px; }
.ok{ color: #15803d; font-weight: 800; }
.error, .aviso{ color: #b91c1c; font-weight: 800; }
@media(max-width: 900px){ .layout{ grid-template-columns: 1fr; } .item{ grid-template-columns: 58px 1fr; } .item input, .item strong, .item button{ grid-column: span 2; width: 100%; } }
</style>
