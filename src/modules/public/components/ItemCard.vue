<script setup>
  import {ref, computed} from 'vue'
  const props = defineProps({ destacado : Boolean})
  const emit = defineEmits(['eliminar'])
  const expandido = ref(false)
  const textoBoton = computed (() => {
    return expandido.value ? 'Compactar' : 'Expandir'; 
  })

  function alternarVista(){
    expandido.value = !expandido.value;
  }

  function eliminarTarjeta(){
    emit('eliminar')
  }
</script>

<template>
  <article :class="['tarjeta', { destacado: props.destacado }]">
    <div class="encabezado">
      <div class="titulo">
        <slot name="titulo">
          <h2>Sin Titulo </h2>
        </slot>
      </div>

      <div class="acciones">
        <button class="alternar" @click="alternarVista">{{ textoBoton }}</button>
        <button class="eliminar" @click="eliminarTarjeta">Eliminar</button>
      </div>
    </div>

    <p v-if="props.destacado" class = "marca-destacado">⭐ Registro destacado ⭐ </p>
    <p v-else class="marca-normal">Registro normal</p>

    <div v-if="expandido" class="contenido">
      <slot>
        <p>No se proporcionó información </p>
      </slot>
    </div>

    <div v-else class="compacto">
      <p>Haz clic en el botón Expandir para consultar más detalles </p>
    </div>
  </article>
</template>

<style scoped>
  .tarjeta{
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 8px 18px rgba(15,23,42, 0.1);
    transition: 0.2s ease;
  }

  .tarjeta:hover{
    transform: translateY(-5px);
  }
  .destacado{
    border-color: #f4f430;
    background: linear-gradient(180deg, #fffdf2 0%, #fff8d6 100%);
  }

  .encabezado{
   display: flex;
   justify-content: space-between;
   align-items: start;
   gap: 14px; 
  }

  .titulo h2{
    margin: 0;
    font-size: 22px;
    color: #1e293b;
  }

  .acciones{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  button {
    border: none;
    border-radius: 10px;
    padding: 10px 12px;
    color: white;
    cursor: pointer;
    font-weight: bold;
  }
  .alternar{
    background: #475569;
  }
  
  .alternar:hover{
    background: #334155;
  }

  .eliminar{
    background: #dc2626;
  }
  .eliminar:hover{
    background: #570c0c;
  }
  .marca-destacado {
    margin-top: 12px;
    color: #b8860b;
    font-weight: bold;
  } 

  .marca-normal{
    margin-top: 12px;
    color: #aeda1c;
  }
  .contenido{
     margin-top: 14px;
     padding-top: 12px;
    border-top: 2px solid #e2e8f0;
  }
  .compacto {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 2px solid #096df0;
    color: #64748b;
    font-style: italic;
  } 
</style>