<script setup lang="ts">
import { reactive, toRef, ref, onMounted } from 'vue';
import BudgetApi from './BudgetApi'

import Messages from '../../../modalMessages/MessagesPage.vue'

import { storeToRefs } from 'pinia';
import { useDataOptions } from '../../../../shared/store/modules/data-options';

const dataOptions = useDataOptions();
const { dataOptionsStore } = storeToRefs(dataOptions);

interface Props {
    dataLowerSidePage: {
        [x: string]: any;
        type: object,
        required: true
    },
}
console.log('dataOptions-/-', typeof (dataOptionsStore.value.dataSelect))
const props = defineProps<Props>()
const dataPlanForm = toRef(props, 'dataLowerSidePage')
const dataBudgetAct = reactive({
    dataSelectPlanForm: {
        year: ''
    },
    sendDataPlan: {
        year: ''
    },
    dataResponseTemp: [],
    table: {
        pagination: { rowsPerPage: 0 },
        noData: ''
    },
    dataMessages: {
        loading: false
    },
    dataPlanExcel: {
        state: false,
        title: 'Informação',
        info1: 'Os campos que constituem o cabeçalho do ficheiro CSV para a importação são:',
        info2: 'oIdDealer - Concessão - Cod_Concessão - Sub-Concessão - Mês - testNewType - COMERCIAIS - TESTESTS - PASSAGEIROS',
        info3: 'O Ficheiro deve ser editado apenas para as colunas testNewType, COMERCIAIS, TESTESTS, PASSAGEIROS, ou seja, as restantes colunas não devem ser editadas.'
    },
    dataButtons: {
        infoExcel: 'Info',
        donwloadExcel: 'Exportar Excel',
        uploadExcel: 'Importar Excel',
        close: 'Fechar'
    },
    skeletonTable: false
})
dataBudgetAct.dataSelectPlanForm.year = dataOptionsStore.value.yearActual
const dataResponse = ref([])
const dataResponseTemp = ref([])
const dataModelService = async () => {
    dataBudgetAct.skeletonTable = true
    dataBudgetAct.sendDataPlan.year = dataBudgetAct.dataSelectPlanForm.year
    dataBudgetAct.dataMessages.loading = true
    dataResponse.value.length = 0
    dataResponse.value = dataResponseTemp.value
    try {
        // dataBudgetAct.dataResponseTemp = await BudgetApi.pvmPlan(dataBudgetAct.sendDataPlan)
        if (dataBudgetAct.dataResponseTemp.car.length > 0) {
            for (const propertyL in dataBudgetAct.dataResponseTemp.car) {
                let dataUpdateTemp = {
                    name: '', jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0
                }
                dataUpdateTemp.name = dataBudgetAct.dataResponseTemp.car[propertyL].name
                for (const propertyM in dataBudgetAct.dataResponseTemp.forecast) {
                    if (dataBudgetAct.dataResponseTemp.car[propertyL].id === dataBudgetAct.dataResponseTemp.forecast[propertyM].idCarModel) {
                        switch (dataBudgetAct.dataResponseTemp.forecast[propertyM].month) {
                            case 1:
                                dataUpdateTemp.jan = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 2:
                                dataUpdateTemp.feb = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 3:
                                dataUpdateTemp.mar = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 4:
                                dataUpdateTemp.apr = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 5:
                                dataUpdateTemp.may = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 6:
                                dataUpdateTemp.jun = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 7:
                                dataUpdateTemp.jul = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 8:
                                dataUpdateTemp.aug = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 9:
                                dataUpdateTemp.sep = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 10:
                                dataUpdateTemp.oct = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 11:
                                dataUpdateTemp.nov = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 12:
                                dataUpdateTemp.dec = dataBudgetAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            default:
                                break;
                        }
                    }
                }
                Array.prototype.push.call(dataResponse.value, dataUpdateTemp)
            }
        }
    } catch (error) {
        dataBudgetAct.table.noData = 'Não há Previsões de Vendas'
    }
    dataBudgetAct.dataMessages.loading = false
    dataBudgetAct.skeletonTable = false
}
const columnsModels = [
    { name: 'modelo', align: 'center', label: 'Modelo', field: (dataResponse: { name: string }) => dataResponse.name },
    { name: 'january ', label: 'Janeiro', field: (dataResponse: { jan: string }) => dataResponse.jan },
    { name: 'february', label: 'Fevereiro', field: (dataResponse: { feb: string }) => dataResponse.feb },
    { name: 'march', label: 'Março', field: (dataResponse: { mar: string }) => dataResponse.mar },
    { name: 'april', label: 'Abril', field: (dataResponse: { apr: string }) => dataResponse.apr },
    { name: 'may ', label: 'Maio', field: (dataResponse: { may: string }) => dataResponse.may },
    { name: 'june', label: 'Junho', field: (dataResponse: { jun: string }) => dataResponse.jun },
    { name: 'july', label: 'Julho', field: (dataResponse: { jul: string }) => dataResponse.jul },
    { name: 'august', label: 'Agosto', field: (dataResponse: { aug: string }) => dataResponse.aug },
    { name: 'september ', label: 'Setembro', field: (dataResponse: { sep: string }) => dataResponse.sep },
    { name: 'octuber', label: 'Outubro', field: (dataResponse: { oct: string }) => dataResponse.oct },
    { name: 'november', label: 'Novembro', field: (dataResponse: { nov: string }) => dataResponse.nov },
    { name: 'december', label: 'Dezembro', field: (dataResponse: { dec: string }) => dataResponse.dec }
]
const updateService = async () => {
    dataModelService()
}
onMounted(() => {
    dataModelService()
})
</script>
<template>
            <q-select style="width: 200px;" outlined v-model="dataBudgetAct.dataSelectPlanForm.year"
                :options="dataOptionsStore.dataSelect.years" label="Select Year" @update:model-value="updateService()" />
            <div class="row q-pa-md" style="padding-top: 10px;">
                <div class="col-12 col-md-12">
                    <q-card flat>
                        <q-card-section v-if="dataBudgetAct.skeletonTable">
                            <div class="q-pa-md">
                                <q-markup-table>
                                    <thead>
                                        <tr>
                                            <th class="text-left" style="width: 150px">
                                                <q-skeleton animation="blink" type="text" />
                                            </th>
                                            <th class="text-right">
                                                <q-skeleton animation="blink" type="text" />
                                            </th>
                                            <th class="text-right">
                                                <q-skeleton animation="blink" type="text" />
                                            </th>
                                            <th class="text-right">
                                                <q-skeleton animation="blink" type="text" />
                                            </th>
                                            <th class="text-right">
                                                <q-skeleton animation="blink" type="text" />
                                            </th>
                                            <th class="text-right">
                                                <q-skeleton animation="blink" type="text" />
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="n in 5" :key="n">
                                            <td class="text-left">
                                                <q-skeleton animation="blink" type="text" width="85px" />
                                            </td>
                                            <td class="text-right">
                                                <q-skeleton animation="blink" type="text" width="50px" />
                                            </td>
                                            <td class="text-right">
                                                <q-skeleton animation="blink" type="text" width="35px" />
                                            </td>
                                            <td class="text-right">
                                                <q-skeleton animation="blink" type="text" width="65px" />
                                            </td>
                                            <td class="text-right">
                                                <q-skeleton animation="blink" type="text" width="25px" />
                                            </td>
                                            <td class="text-right">
                                                <q-skeleton animation="blink" type="text" width="85px" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </q-markup-table>
                            </div>
                        </q-card-section>
                        <q-card-section v-if="!dataBudgetAct.skeletonTable">
                            <q-table flat :rows="dataResponse" :columns="columnsModels" row-key="name" :rows-per-page-options="[0]"
                                :pagination=dataBudgetAct.table.pagination :no-data-label="dataBudgetAct.table.noData" />
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <div align="right">
                <div class="col" style="padding-top: 10px;">
                    <q-btn color="white" class="text-black" :label="dataBudgetAct.dataButtons.infoExcel" size="sm"
                        @click="dataBudgetAct.dataPlanExcel.state = true" text-color="blue-5" icon="info" square></q-btn>
                    <q-btn class="text-black" :label="dataBudgetAct.dataButtons.uploadExcel" size="sm" icon="timeline" square
                        text-color="green-5"></q-btn>
                    <q-btn class="text-black" :label="dataBudgetAct.dataButtons.donwloadExcel" size="sm" icon="timeline" square
                        text-color="green-5"></q-btn>
                </div>
            </div>
            <q-dialog v-model="dataBudgetAct.dataPlanExcel.state" persistent position="top">
                <q-card style="max-width: 450px;top: 150px">
                    <q-card-section class="q-py-md shadow-2 text-white bg-primary">
                        <div class="text-h6">{{ dataBudgetAct.dataPlanExcel.title }}</div>
                    </q-card-section>
                    <q-separator></q-separator>
                    <q-card-section class="q-pt-none" style="">
                        {{ dataBudgetAct.dataPlanExcel.info1 }} <br><br>
                        {{ dataBudgetAct.dataPlanExcel.info2 }} <br><br>
                        {{ dataBudgetAct.dataPlanExcel.info3 }}
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn class="text-black" :label="dataBudgetAct.dataButtons.close"
                            @click="dataBudgetAct.dataPlanExcel.state = false" icon="close" size="sm" text-color="red-5"
                            square></q-btn>
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <messages :loading="dataBudgetAct.dataMessages.loading"> </messages>
</template>
