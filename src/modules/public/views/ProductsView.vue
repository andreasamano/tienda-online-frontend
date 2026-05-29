<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProductsStore } from '@/modules/public/stores/productsStore'
import { useCartStore } from '@/modules/public/stores/cartStore'
import ProductCard from '@/modules/public/components/ProductCard.vue'

const productsStore = useProductsStore()
const cartStore = useCartStore()
const busqueda = ref('')
const categoriaSeleccionada = ref('Todas')

const productosFiltrados = computed(() => {
  return productsStore.productosActivos.filter(producto => {
    const coincideTexto = producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) || producto.descripcion.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideCategoria = categoriaSeleccionada.value === 'Todas' || producto.categoria === categoriaSeleccionada.value
    return coincideTexto && coincideCategoria
  })
})

onMounted(() => productsStore.cargarProductos())
</script>

<template>
  <section>
    <div class="encabezado">
      <div>
        <p class="etiqueta">Catálogo</p>
        <h2>Productos disponibles</h2>
      </div>
      <div class="resumen">
        <div><span>Total</span><strong>{{ productsStore.totalProductos }}</strong></div>
        <div><span>Destacados</span><strong>{{ productsStore.totalDestacados }}</strong></div>
        <div><span>Inventario</span><strong>{{ productsStore.inventarioTotal }}</strong></div>
      </div>
    </div>

    <div class="filtros">
      <input v-model.trim="busqueda" type="search" placeholder="Buscar producto..." />
      <select v-model="categoriaSeleccionada">
        <option>Todas</option>
        <option v-for="categoria in productsStore.categorias" :key="categoria">{{ categoria }}</option>
      </select>
    </div>

    <p v-if="productsStore.cargando" class="aviso">Cargando productos desde Flask...</p>
    <p v-else-if="productsStore.error" class="error">{{ productsStore.error }}</p>

    <div v-if="productosFiltrados.length > 0" class="grid-productos">
      <ProductCard v-for="producto in productosFiltrados" :key="producto.id" :producto="producto" @agregar="cartStore.agregarAlCarrito">
        <template #titulo>
          <h3>{{ producto.nombre }}</h3>
        </template>
        <p>{{ producto.descripcion }}</p>
      </ProductCard>
    </div>
    <div v-else class="sin-contenido">No hay productos con ese filtro.</div>
  </section>
</template>

<style scoped>
.encabezado{ display: flex; justify-content: space-between; gap: 18px; align-items: end; margin-bottom: 20px; }
.etiqueta{ color: #f97316; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
h2{ margin: 0; font-size: 34px; }
.resumen{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.resumen div{ background: white; border-radius: 18px; padding: 14px 18px; min-width: 120px; box-shadow: 0 8px 18px rgba(0,0,0,.08); }
.resumen span{ display: block; color: #64748b; font-size: 13px; }
.resumen strong{ font-size: 24px; }
.filtros{ display: grid; grid-template-columns: 1fr 240px; gap: 12px; margin-bottom: 20px; }
input, select{ border: 2px solid #dbe3f0; border-radius: 16px; padding: 13px; background: white; }
.grid-productos{ display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 18px; }
.aviso, .sin-contenido, .error{ background: white; border-radius: 18px; padding: 18px; font-weight: 800; }
.error{ color: #b91c1c; }
@media(max-width: 850px){ .encabezado{ display: block; } .resumen, .filtros{ grid-template-columns: 1fr; } }
</style>
