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
const dataPlanForm = toRef(props, 'dataLowerSidePage')
const dataPlanFormAct = reactive({
    yearActual: ''
})
const formatterY = new Intl.DateTimeFormat('pt-PT', { year: 'numeric' })
dataPlanFormAct.yearActual = formatterY.format(new Date())
</script>
<template>
    <q-select style="width: 200px;" outlined v-model="dataPlanFormAct.yearActual"
        :options="dataLowerSidePage.dataSelect.years" label="Select Year" />
</template>
