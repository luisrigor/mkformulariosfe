<script setup lang="ts">
import { reactive, toRef } from 'vue'
interface Props {
    dataLowerSidePage: {
        [x: string]: any;
        type: object,
        required: true
    },
}
const props = defineProps<Props>()
const dataBudget = toRef(props, 'dataLowerSidePage')
const dataBudgetAct = reactive({
    yearActual: ''
})
const formatterY = new Intl.DateTimeFormat('pt-PT', { year: 'numeric' })
dataBudgetAct.yearActual = formatterY.format(new Date())
</script>
<template>
    <q-select style="width: 200px;" outlined v-model="dataBudgetAct.yearActual"
        :options="dataLowerSidePage.dataSelect.years" label="Select Year" />
</template>
