<script setup>
    import { reactive, computed, onMounted, ref } from 'vue'
    import { useRecordsStore } from '@/modules/public/stores/recordsStore';
    import ItemCard from '@/modules/public/components/ItemCard.vue';
    
    const recordsStore = useRecordsStore()
    const form = reactive({
        nombre: '', categoria: '', descripcion: '', precio:1, destacado:false
    })

    const cargando = ref(false)
    const guardando = ref(false)
    const errorCarga = ref('')
    const mensajeEnvio = ref('')
    const eliminando = ref(false)
    const registroEliminando = ref('')

    const formularioValido = computed(() => {
        return (form.nombre.trim() !== '' && form.categoria.trim() !== '' && form.descripcion.trim() !== '' &&
          Number(form.precio) > 0) })
  
   async function agregarRegistro() {
      if (!formularioValido.value) {
        return
      }

      guardando.value = true
      errorCarga.value = ''
      mensajeEnvio.value = ''
      const nuevoRegistro = {
        nombre: form.nombre,
        categoria: form.categoria,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        activo: 1,
        destacado: form.destacado ? 1 : 0
      }
      try {
        await recordsStore.agregarRegistro(nuevoRegistro)

        if (recordsStore.error) {
          errorCarga.value = recordsStore.error
          return
        }

        mensajeEnvio.value = recordsStore.mensaje
        form.nombre = ''
        form.categoria = ''
        form.descripcion = ''
        form.precio = 1
        form.destacado = false

        sessionStorage.setItem('ultimaVista', 'registros')
      }
      finally {
        guardando.value = false
      }
  }

    onMounted(() => {
      recordsStore.cargarRegistros()
    })

  // async function confirmarEliminacion(item) {
  //   const confirmar = window.confirm(
  //     `¿Seguro que deseas quitar el registro "${item.nombre}"?`
  //   )

  //   if (!confirmar) return

  //   eliminando.value = true
  //   registroEliminando.value = item.nombre

  //   try {
  //     await recordsStore.eliminarRegistro(item.id)
  //   } finally {
  //     eliminando.value = false
  //     registroEliminando.value = ''
  //   }
  // }

  async function confirmarDesactivacion(item) {
    const confirmar = window.confirm(
      `¿Seguro que deseas quitar el registro "${item.nombre}"?`
    )

    if (!confirmar) return

    eliminando.value = true
    registroEliminando.value = item.nombre

    try {
      await recordsStore.desactivarRegistro(item.id)
    } finally {
      eliminando.value = false
      registroEliminando.value = ''
    }
  }
</script>

<template>
    <section>
        <h2>Registros del Negocio</h2>
        <p v-if="cargando" class="aviso">Cargando registros</p>
        <p v-else-if="errorCarga" class="aviso"> {{ errorCarga }}</p>

        <div class="resumen">         
            <div class="dato">
            <span>Total Registrados </span>
            <strong> {{ recordsStore.totalElementos }}</strong>
            </div>
            <div class="dato">
            <span>Destacados: </span>
            <strong> {{recordsStore.totalDestacados }}</strong>
            </div>
            <div class="dato">
            <span>Valor promedio </span>
            <strong> {{ recordsStore.promedioValor }}</strong>
            </div>
        </div>
        <form class="formulario" @submit.prevent ="agregarRegistro">
            <h2>Agregar registro</h2>
            <label for="nombre"> Nombre</label>
            <input type="text" id="nombre" v-model="form.nombre" placeholder="Ejemplo: Servicio, producto o cita" @keyup.enter="agregarRegistro">
            
            <label for="categoria" class="categoria">Categoría</label>
            <select id="categoria" v-model="form.categoria">
            <option value="">Selecciona una categoría</option>
            <option v-for="item in recordsStore.categorias" :key="item" :value="item"> {{ item }}</option>
            </select>
            
            <label for="descripcion" class="descripcion">Descripción</label>
            <textarea id="descripcion" v-model="form.descripcion" placeholder="Describe el registro" 
            class="textarea-descripcion"></textarea>

            <label for="precio" class="precio"> Precio</label>
            <input type="number" id="precio" v-model="form.precio" min="1">
            
            <label class="check">
            <input type="checkbox" v-model="form.destacado"> Marcar como destacado
            </label>
            <button type="submit">Agregar registro</button>
            <p v-if="!formularioValido" class="aviso">   Completa correctamente el nombre, categoría, descripción y precio.</p>
            <p v-else class="correcto"> El formulario está listo para enviarse </p>

            <p v-show="form.destacado" class="previo-destacado" > Este registro se agregará como destacado</p>
            <p v-if="mensajeEnvio" class="correcto"> {{ mensajeEnvio }}</p>
        </form>

        <div v-if="recordsStore.registrosActivos.length > 0" class="lista">
            <ItemCard v-for="item in recordsStore.registrosActivos" :key="item.id" :destacado="item.destacado == 1" 
            @eliminar="confirmarDesactivacion(item)">
            <template #titulo>
              <h2>{{ item.nombre }}</h2> 
            </template> 
            <p> <strong>Categoría: </strong> {{ item.categoria }}</p>
            <p> <strong>Descripcion: </strong> {{ item.descripcion }}</p>
            <p> <strong>Precio: </strong> {{ item.precio }}</p>
            <p v-if="item.precio >= 120"> Registro de valor alto. </p>
            <p v-else-if="item.precio >= 45"> Registro de valor medio. </p>
            <p v-else> Registro de valor bajo. </p>
            </ItemCard>

          <div v-if="guardando" class="overlay-guardando">
            <div class="modal-guardando">
              <div class="loader-guardar"></div>
              <h3>Guardando registro</h3>
              <p>Procesando información en el servidor...</p>
            </div>
          </div>

          <div v-if="eliminando" class="overlay-eliminando">
            <div class="modal-eliminando">
              <div class="loader"></div>
              <h3>Ocultando registro</h3>
              <small>Actualizando estado del registro en el servidor...</small>
            </div>
          </div>
        </div>
    <div v-else class="sin-contenido"><p>No hay registros que mostrar</p></div>
    </section>
</template> 

<style scoped>
.contenedor {
  max-width: 1024px;
  margin: 30px auto;
  padding: 20px;
  background: linear-gradient(180deg, #f5f5fb 0%, #eef2f9 100%);
  border-color: blue;
}

h1{
  text-align: center;
  margin-bottom: 10px;
  color: darkblue;
}

.resumen{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.dato{
  background: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,.2);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dato span{
  color: #220939;
  font-size: 18px;
}

.dato strong{
  font-size: 24px;
  color: darkmagenta;
}

.formulario {
  background: white;
  border-radius: 18px;
  padding: 22px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,.2);
}

.formulario h2{
  margin-top: 0;
  color: rgb(71, 16, 102);
}

label {
  display: block;
  margin-top: 10px;
  margin-bottom: 6px;
  font-weight: bold;
  color: rgb(22, 108, 5);
}

input, select, button {
  width: 33%;
  padding: 12px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 2px solid rgb(8, 101, 195);
  font-size: 14px;
}

input:focus, select:focus {
  outline: none;
  border-color: #3d6df4;
  box-shadow: 0 0 0 3px rgba(61, 110, 240, .20);
} 

button {
  border: none;
  background: linear-gradient(90deg, #26ec79, #165614);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.20 ease, opacity 0.20 ease;
}

button:hover{
  transform: translate(15px);
  opacity: 0.85;
}

.check{
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: bold;
}

.check input {
  width: auto;
  margin: 0;
}

.aviso {
  color: #b22222;
  font-weight: bold;
}

.correcto {
  color: #5c0467;
  font-weight: bold;
}

.previo-destacado {
  color: #b8860b;
  font-style: italic;
}

.lista{ 
  display: grid;
  gap: 16px;
}

.sin-contenido {
  background: white;
  padding: 22px;
  border-radius: 14px;
  text-align: center;
  color: #666;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.10);
} 

.textarea-descripcion {
  width: 70%;
  min-height: 120px;
  resize: vertical;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid rgb(8, 101, 195);
  font-size: 14px;
  box-sizing: border-box;
}

.overlay-eliminando {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(4px);
}

.modal-eliminando {
  background: white;
  width: 360px;
  max-width: 90%;
  padding: 28px;
  border-radius: 18px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.25);
  animation: aparecerModal 0.25s ease;
}

.modal-eliminando h3 {
  margin: 14px 0 8px;
  color: #0f172a;
}

.modal-eliminando p {
  margin: 0 0 8px;
  font-weight: bold;
  color: #dc2626;
}

.modal-eliminando small {
  color: #64748b;
}

.overlay-guardando {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(4px);
}

.modal-guardando {
  background: white;
  width: 360px;
  max-width: 90%;
  padding: 28px;
  border-radius: 18px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.25);
}

.loader-guardar {
  width: 48px;
  height: 48px;
  border: 5px solid #e2e8f0;
  border-top: 5px solid #16a34a;
  border-radius: 50%;
  margin: 0 auto;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #e2e8f0;
  border-top: 5px solid #dc2626;
  border-radius: 50%;
  margin: 0 auto;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes aparecerModal {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>