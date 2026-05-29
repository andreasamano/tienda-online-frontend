<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ producto: { type: Object, required: true } })
const emit = defineEmits(['agregar', 'desactivar'])
const expandido = ref(false)
const textoBoton = computed(() => expandido.value ? 'Ver menos' : 'Ver detalles')
</script>

<template>
  <article :class="['tarjeta', { destacado: producto.destacado == 1 }]" v-show="producto.activo == 1">
    <div class="imagen">{{ producto.icono || '📦' }}</div>
    <div class="contenido">
      <slot name="titulo">
        <h3>{{ producto.nombre }}</h3>
      </slot>
      <p class="categoria">{{ producto.categoria }}</p>
      <p class="precio">${{ Number(producto.precio).toFixed(2) }}</p>
      <p :class="Number(producto.stock) > 0 ? 'stock-ok' : 'stock-mal'">
        Stock: {{ producto.stock }} unidades
      </p>
      <p v-if="producto.destacado == 1" class="destacado-label">⭐ Producto destacado</p>
      <div v-if="expandido" class="descripcion">
        <slot>{{ producto.descripcion }}</slot>
      </div>
      <div class="acciones">
        <button class="secundario" @click="expandido = !expandido">{{ textoBoton }}</button>
        <button class="principal" :disabled="Number(producto.stock) <= 0" @click="emit('agregar', producto)">Agregar</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.tarjeta{
  background: white;
  border: 2px solid #edf2f7;
  border-radius: 24px;
  padding: 18px;
  display: grid;
  grid-template-columns: 76px 1fr;
  gap: 14px;
  box-shadow: 0 12px 26px rgba(15,23,42,.08);
  transition: .2s ease;
}
.tarjeta:hover{ transform: translateY(-4px); }
.destacado{ border-color: #fed7aa; background: linear-gradient(180deg, #fff7ed, #ffffff); }
.imagen{ height: 76px; border-radius: 20px; background: #eef2ff; display: grid; place-items: center; font-size: 36px; }
h3{ margin: 0; color: #14213d; }
.categoria{ margin: 4px 0; color: #64748b; font-weight: 700; }
.precio{ margin: 5px 0; font-size: 24px; color: #f97316; font-weight: 900; }
.stock-ok{ color: #15803d; font-weight: 800; }
.stock-mal{ color: #b91c1c; font-weight: 800; }
.destacado-label{ color: #92400e; font-weight: 800; }
.descripcion{ background: #f8fafc; padding: 12px; border-radius: 14px; margin: 10px 0; }
.acciones{ display: flex; gap: 10px; flex-wrap: wrap; }
button{ border: 0; border-radius: 12px; padding: 10px 14px; font-weight: 900; cursor: pointer; }
.principal{ background: #f97316; color: white; }
.secundario{ background: #e2e8f0; color: #14213d; }
button:disabled{ opacity: .5; cursor: not-allowed; }
</style>
