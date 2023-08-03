<script setup lang="ts">
import { reactive, onMounted } from 'vue'

import SalesForecasts from './components/salesForecasts/SalesForecastsPage.vue'
import Model from './components/model/ModelPage.vue'
import PlanForm from './components/planForm/PlanFormPage.vue'
import Budget from './components/budget/BudgetPage.vue'

interface Props {
  leftOption: string
}
const props = defineProps<Props>()
const dataLowerSidePage = reactive({
  titleOptions: {
    register: 'Registo de Previsões',
    models: 'Modelos',
    formPlan: 'Plano Form 01',
    budget: 'Previsões de Vendas',
  },
  dataSelect: {
    years: [],
    months: []
  },
  pageTitles: {
    mainTitle: '',
  },
  yearActual: ''
})
const formatterY = new Intl.DateTimeFormat('pt-PT', { year: 'numeric' })
dataLowerSidePage.yearActual = formatterY.format(new Date())
const generateDataSelect = async () => {
  let tempNum = 0
  const date = new Date()
  let tempYear = 2009
  let tempYearActual = parseInt(dataLowerSidePage.yearActual, 10)
  while (tempYear <= tempYearActual) {
    dataLowerSidePage.dataSelect.years.push(tempYearActual.toString())
    tempYearActual--
    tempNum++
  }
  tempNum = 0
  while (tempNum < 12) {
    date.setMonth(tempNum)
    dataLowerSidePage.dataSelect.months[tempNum] = date.toLocaleString('pt-PT', { month: 'long' })
    tempNum++
  }
  date.toLocaleString('pt-PT', { year: 'numeric' })

}
onMounted(async () => {
  switch (props.leftOption) {
    case 'register':
      dataLowerSidePage.pageTitles.mainTitle =
        dataLowerSidePage.titleOptions.register
      break
    case 'models':
      dataLowerSidePage.pageTitles.mainTitle =
        dataLowerSidePage.titleOptions.models
      break
    case 'formPlan':
      dataLowerSidePage.pageTitles.mainTitle =
        dataLowerSidePage.titleOptions.formPlan
      break
    case 'budget':
      dataLowerSidePage.pageTitles.mainTitle =
        dataLowerSidePage.titleOptions.budget
      break
    default:
      dataLowerSidePage.pageTitles.mainTitle = props.leftOption
      break
  }
  await generateDataSelect()
})
</script>
<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 brand-secondary" style="color:var(--brand-secondary)">
        {{ dataLowerSidePage.pageTitles.mainTitle }}
      </div>
      <q-separator class="background-Secondary"></q-separator>
      <div>&nbsp;</div>
      <div v-if="props.leftOption == 'register'">
        <sales-forecasts ></sales-forecasts>
      </div>
      <div v-if="props.leftOption == 'models'">
        <model ></model>
      </div>
      <div v-if="props.leftOption == 'formPlan'">
        <plan-form ></plan-form>
      </div>
      <div v-if="props.leftOption == 'budget'">
        <budget ></budget>
      </div>
    </q-card-section>
  </q-card>
</template>
