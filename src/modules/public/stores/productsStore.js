import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_BASE_URL } from '@/config/api'

export const useProductsStore = defineStore('productos', () => {
  const categorias = ref(['Tecnología', 'Ropa', 'Hogar', 'Accesorios', 'Gaming'])
  const productos = ref([])
  const mensaje = ref('')
  const error = ref('')
  const cargando = ref(false)

  const productosActivos = computed(() => productos.value.filter(item => item.activo == 1))
  const totalProductos = computed(() => productosActivos.value.length)
  const totalDestacados = computed(() => productosActivos.value.filter(item => item.destacado == 1).length)
  const inventarioTotal = computed(() => productosActivos.value.reduce((acc, item) => acc + Number(item.stock || 0), 0))

  async function cargarProductos() {
    cargando.value = true
    error.value = ''
    try {
      const respuesta = await fetch(`${API_BASE_URL}/productos`)
      const datos = await respuesta.json()
      if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudieron cargar los productos')
      productos.value = datos
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

  async function agregarProducto(nuevoProducto) {
    mensaje.value = ''
    error.value = ''
    try {
      const respuesta = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(nuevoProducto)
      })
      const resultado = await respuesta.json()
      if (!respuesta.ok) {
        const detalle = resultado.errores ? resultado.errores.join(', ') : resultado.mensaje
        throw new Error(detalle || 'No se pudo agregar el producto')
      }
      mensaje.value = resultado.mensaje
      await cargarProductos()
    } catch (err) {
      error.value = err.message
    }
  }

  async function desactivarProducto(id) {
    mensaje.value = ''
    error.value = ''
    try {
      const respuesta = await fetch(`${API_BASE_URL}/productos/${id}/desactivar`, {
        method: 'PUT',
        credentials: 'include'
      })
      const resultado = await respuesta.json()
      if (!respuesta.ok) throw new Error(resultado.mensaje || 'No se pudo desactivar el producto')
      mensaje.value = resultado.mensaje
      await cargarProductos()
    } catch (err) {
      error.value = err.message
    }
  }

  return {
    categorias, productos, productosActivos, totalProductos, totalDestacados, inventarioTotal,
    mensaje, error, cargando, cargarProductos, agregarProducto, desactivarProducto
  }
})
