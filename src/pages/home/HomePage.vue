<script setup lang="ts">
import { reactive } from 'vue';
import LowerSide from 'src/pages/lowerSide/LowerSidePage.vue'
const dataHomePage = reactive({
  sideOption: {
    register: {
      title: 'Registo de Previsões',
      name: 'register',
      icon: 'list_alt'
    },
    models: {
      title: 'Modelos',
      name: 'models',
      icon: 'post_add'
    },
    formPlan: {
      title: 'Plano Form 01',
      name: 'formPlan',
      icon: 'receipt_long'
    },
    budget: {
      title: 'Orçamento',
      name: 'budget',
      icon: 'analytics'
    }
  },
  dataOptionFinal: [],
  tabLeftOption: 'register',
  app: '',
  rol: '',

})
dataHomePage.app = localStorage.getItem('app')
dataHomePage.rol = localStorage.getItem('roles')
for (const key in dataHomePage.sideOption) {
  if (dataHomePage.app === 'Toyota') {
    Array.prototype.push.call(dataHomePage.dataOptionFinal, dataHomePage.sideOption[key])
  } else if (dataHomePage.app === 'Lexus' && key !== 'formPlan') {
    Array.prototype.push.call(dataHomePage.dataOptionFinal, dataHomePage.sideOption[key])
  }
  if (dataHomePage.rol === 'DEALER') {
    dataHomePage.tabLeftOption = 'register'
  }
}
</script>

<template>
  <div id="q-app" style="min-height: 100vh;">
    <div class="q-pa-sm q-gutter-sm">
      <q-card>
        <q-card-section>
          <div>
            <q-tabs v-if="dataHomePage.rol === 'TCAP'" v-model="dataHomePage.tabLeftOption" align="left" class="bg-white shadow-2">
              <q-tab v-for="option in dataHomePage.dataOptionFinal" :key="option.name" :name="option.name"
                :label="option.title" style="text-align: left" align="left" :icon="option.icon">
              </q-tab>
            </q-tabs>
            <q-tab-panels class="q-ma-xs" v-model="dataHomePage.tabLeftOption">
              <q-tab-panel :name="dataHomePage.tabLeftOption">
                <lower-side :leftOption="dataHomePage.tabLeftOption"></lower-side>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </q-card-section>
      </q-card>
    </div>

  </div>
</template>
