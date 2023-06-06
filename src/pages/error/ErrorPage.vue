<script setup lang="ts"></script>

<template>
  <div
    class="fullscreen bg-red-6 text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Alguma coisa correu mal</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="red"
        unelevated
        to="/"
        label="Voltar a página inicial"
        no-caps
      />
    </div>
  </div>
</template>
