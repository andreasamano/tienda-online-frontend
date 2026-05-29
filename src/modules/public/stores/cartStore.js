import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_BASE_URL } from '@/config/api'

export const useCartStore = defineStore('carrito', () => {
  const items = ref([])
  const mensaje = ref('')
  const error = ref('')

  const totalArticulos = computed(() => items.value.reduce((acc, item) => acc + Number(item.cantidad), 0))
  const totalPagar = computed(() => items.value.reduce((acc, item) => acc + Number(item.precio) * Number(item.cantidad), 0))

  function guardarCarritoLocal() {
    localStorage.setItem('carritoNovaMarket', JSON.stringify(items.value))
  }

  function cargarCarritoLocal() {
    const datos = localStorage.getItem('carritoNovaMarket')
    items.value = datos ? JSON.parse(datos) : []
  }

  function agregarAlCarrito(producto) {
    const encontrado = items.value.find(item => item.id === producto.id)
    if (encontrado) {
      encontrado.cantidad++
    } else {
      items.value.push({ ...producto, cantidad: 1 })
    }
    guardarCarritoLocal()
  }

  function quitarDelCarrito(id) {
    items.value = items.value.filter(item => item.id !== id)
    guardarCarritoLocal()
  }

  function cambiarCantidad(id, cantidad) {
    const item = items.value.find(item => item.id === id)
    if (!item) return
    item.cantidad = Math.max(1, Number(cantidad))
    guardarCarritoLocal()
  }

  function vaciarCarrito() {
    items.value = []
    guardarCarritoLocal()
  }

  async function confirmarPedido(datosCliente) {
    mensaje.value = ''
    error.value = ''
    try {
      const respuesta = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cliente: datosCliente, productos: items.value })
      })
      const resultado = await respuesta.json()
      if (!respuesta.ok) {
        const detalle = resultado.errores ? resultado.errores.join(', ') : resultado.mensaje
        throw new Error(detalle || 'No se pudo confirmar el pedido')
      }
      mensaje.value = resultado.mensaje
      vaciarCarrito()
      return true
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  return {
    items, mensaje, error, totalArticulos, totalPagar, cargarCarritoLocal, guardarCarritoLocal,
    agregarAlCarrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito, confirmarPedido
  }
})
