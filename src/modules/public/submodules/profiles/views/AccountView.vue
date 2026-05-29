<script setup>
    import { useSessionStore } from '@/modules/auth/stores/sessionStore';
    import { inject} from 'vue';

    const sessionStore = useSessionStore()
    const nombreUsuarioGlobal = inject('nombreUsuarioGlobal')
    const tipoPlanGlobal = inject ('tipoPlanGlobal')
</script>

<template>
    <section class ="perfil">
        <h2>Perfil del Usuario</h2>
        <div class="perfil-box">
            <p><strong>Usuario Global:</strong> {{ nombreUsuarioGlobal }}</p>
            <p><strong>Plan Global:</strong> {{ tipoPlanGlobal }}</p>
            <p><strong>Autenticado:</strong> {{ sessionStore.autenticado ? 'Si': 'No' }}</p>
            <p><strong>Usuario Premium?</strong> {{ sessionStore.esPremium ? 'Si' : 'No' }}</p>
        </div>
    </section>
</template>

<style scoped>
    .perfil-box {
        background: white;
        border-radius: 20px;
        padding: 18px;
         box-shadow: 0 8px 18px rgba(15,24, 44, .20);
    }
</style>