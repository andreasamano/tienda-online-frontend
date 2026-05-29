import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_BASE_URL } from '@/config/api'

export const useRecordsStore = defineStore('registros', () => {
    const categorias = ref(['Servicios', 'Productos', 'Citas', 'Clientes', 'Inventario', 'Soporte']);
    const tipos = ref(['General', 'Preventivo', 'Correctivo', 'Venta', 'Reservación', 'Consulta']);

    const registros = ref([])
    const mensaje = ref("")
    const error = ref("")
    const cargando = ref(false)

    const totalElementos = computed(() => registrosActivos.value.length)
    const totalDestacados = computed(() => {
    return registrosActivos.value.filter(item => item.destacado == 1 || item.destacado === true).length
  })

const promedioValor = computed(() => {
    if (registrosActivos.value.length === 0) return 0

    const suma = registrosActivos.value.reduce((acumulado, item) => {
        return acumulado + Number(item.precio)
    }, 0)

    return (suma / registrosActivos.value.length).toFixed(1)
    })
   
const registrosActivos = computed(() => {
    return registros.value.filter(item => item.activo == 1)
})
    
async function cargarRegistros() {
    cargando.value = true
    error.value = ""

    try {
    const respuesta = await fetch(`${API_BASE_URL}/registros`)
    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudieron cargar los registros")
    }

    registros.value = datos
    } 
    
    catch (err) {
    error.value = err.message
    } 
    
    finally {
    cargando.value = false
    }
}

async function agregarRegistro(nuevoRegistro) {
    mensaje.value = ""
    error.value = ""

    try {
        const respuesta = await fetch(`${API_BASE_URL}/registros`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nuevoRegistro.nombre,
                categoria: nuevoRegistro.categoria,
                descripcion: nuevoRegistro.descripcion,
                precio: Number(nuevoRegistro.precio),
                activo: nuevoRegistro.activo ? 1 : 0,
                destacado: nuevoRegistro.destacado ? 1 : 0
            })
        })

        const resultado = await respuesta.json()

        if (!respuesta.ok) {
        const detalle = resultado.errores ? resultado.errores.join(', ') : resultado.mensaje || 'No se pudo agregar el registro'
            throw new Error(detalle)
        }

        mensaje.value = resultado.mensaje
        await cargarRegistros()
        } 
    catch (err) {
    error.value = err.message
    }
}

async function desactivarRegistro(id) {
    mensaje.value = ''
    error.value = ''

    try {
        const respuesta = await fetch(`${API_BASE_URL}/registros/${id}/desactivar`, {
        method: 'PUT'
        })

        const resultado = await respuesta.json()

        if (!respuesta.ok) {
        const detalle = resultado.errores ? resultado.errores.join(', ') : resultado.mensaje || 'No se pudo desactivar el registro'
            throw new Error(detalle)
        }

        mensaje.value = resultado.mensaje
        await cargarRegistros()
    } 
    catch (err) {
        error.value = err.message
    }
}

async function eliminarRegistro(id) {
        mensaje.value = ""
        error.value = ""

        try {
        const respuesta = await fetch(`${API_BASE_URL}/registros/${id}`, {
            method: "DELETE"
        })

        const resultado = await respuesta.json()

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "No se pudo eliminar el registro")
        }

        mensaje.value = resultado.mensaje
        await cargarRegistros()
        } catch (err) {
        error.value = err.message
        }
    }
 
function reemplazarRegistros(datos){
    registros.value= datos.map(item => ({
        id: item.id ?? Date.now() + Math.random(), ...item
    }))
}

return {
        categorias, tipos, registros, totalElementos, totalDestacados, promedioValor, registrosActivos, mensaje, error, cargando,cargarRegistros,
        agregarRegistro, eliminarRegistro, desactivarRegistro, reemplazarRegistros
    }
})