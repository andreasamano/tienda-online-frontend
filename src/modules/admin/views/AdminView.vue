<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useSessionStore } from '@/modules/auth/stores/sessionStore'
import { useProductsStore } from '@/modules/public/stores/productsStore'

const sessionStore = useSessionStore()
const productsStore = useProductsStore()
const form = reactive({ nombre: '', categoria: '', descripcion: '', precio: 1, stock: 1, icono: '📦', destacado: false })
const formularioValido = computed(() => form.nombre.trim() !== '' && form.categoria.trim() !== '' && form.descripcion.trim() !== '' && Number(form.precio) > 0 && Number(form.stock) >= 0)

onMounted(() => productsStore.cargarProductos())

async function guardarProducto() {
  if (!formularioValido.value) return
  await productsStore.agregarProducto({ ...form, precio: Number(form.precio), stock: Number(form.stock), destacado: form.destacado ? 1 : 0, activo: 1 })
  if (!productsStore.error) {
    form.nombre = ''
    form.categoria = ''
    form.descripcion = ''
    form.precio = 1
    form.stock = 1
    form.icono = '📦'
    form.destacado = false
  }
}
</script>

<template>
  <section>
    <p class="etiqueta">Administrador</p>
    <h2>Panel de productos</h2>

    <div v-if="!sessionStore.autenticado" class="bloqueado">
      <h3>Debes iniciar sesión</h3>
      <p>Para agregar productos entra con el usuario administrador.</p>
      <RouterLink to="/login">Ir al login</RouterLink>
    </div>

    <div v-else class="panel">
      <form class="formulario" @submit.prevent="guardarProducto">
        <h3>Agregar producto</h3>
        <label>Nombre</label>
        <input v-model.trim="form.nombre" placeholder="Ej. Audífonos Bluetooth" />
        <label>Categoría</label>
        <select v-model="form.categoria">
          <option value="">Selecciona una categoría</option>
          <option v-for="categoria in productsStore.categorias" :key="categoria">{{ categoria }}</option>
        </select>
        <label>Descripción</label>
        <textarea v-model.trim="form.descripcion" placeholder="Características del producto"></textarea>
        <label>Precio</label>
        <input v-model.number="form.precio" type="number" min="1" step="0.01" />
        <label>Stock</label>
        <input v-model.number="form.stock" type="number" min="0" />
        <label>Icono</label>
        <input v-model.trim="form.icono" placeholder="📦" />
        <label class="check"><input type="checkbox" v-model="form.destacado" /> Producto destacado</label>
        <button type="submit" :disabled="!formularioValido">Guardar producto</button>
        <p v-if="productsStore.mensaje" class="ok">{{ productsStore.mensaje }}</p>
        <p v-if="productsStore.error" class="error">{{ productsStore.error }}</p>
      </form>

      <div class="tabla">
        <h3>Productos registrados</h3>
        <article v-for="producto in productsStore.productosActivos" :key="producto.id" class="fila">
          <span>{{ producto.icono }}</span>
          <div><strong>{{ producto.nombre }}</strong><small>{{ producto.categoria }}</small></div>
          <b>${{ Number(producto.precio).toFixed(2) }}</b>
          <small>Stock: {{ producto.stock }}</small>
          <button @click="productsStore.desactivarProducto(producto.id)">Ocultar</button>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.etiqueta{ color: #f97316; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
h2{ font-size: 36px; margin: 0 0 20px; }
.panel{ display: grid; grid-template-columns: 390px 1fr; gap: 22px; align-items: start; }
.formulario, .tabla, .bloqueado{ background: white; border-radius: 24px; padding: 22px; box-shadow: 0 14px 30px rgba(0,0,0,.10); }
label{ display: block; font-weight: 900; margin-bottom: 7px; }
input, select, textarea{ width: 100%; border: 2px solid #dbe3f0; border-radius: 14px; padding: 12px; margin-bottom: 12px; }
textarea{ min-height: 90px; }
.check{ display: flex; align-items: center; gap: 9px; }
.check input{ width: auto; margin: 0; }
button, a{ border: 0; border-radius: 12px; padding: 11px 14px; background: #14213d; color: white; font-weight: 900; cursor: pointer; text-decoration: none; }
button:disabled{ opacity: .5; cursor: not-allowed; }
.fila{ display: grid; grid-template-columns: 42px 1fr 100px 90px 80px; gap: 10px; align-items: center; padding: 12px; border-bottom: 1px solid #e2e8f0; }
.fila span{ font-size: 28px; }
.fila small{ display: block; color: #64748b; }
.ok{ color: #15803d; font-weight: 800; }
.error{ color: #b91c1c; font-weight: 800; }
@media(max-width: 900px){ .panel{ grid-template-columns: 1fr; } .fila{ grid-template-columns: 1fr; } }
</style>
