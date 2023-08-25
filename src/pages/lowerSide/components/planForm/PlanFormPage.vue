<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import PlanFormApi from './PlanFormApi'

import mistakeImg from 'src/assets/images/mistake.png'
import diskImg from 'src/assets/images/disk.png'
import Messages from '../../../modalMessages/MessagesPage.vue'

import { storeToRefs } from 'pinia';
import { useDataOptions } from '../../../../shared/store/modules/data-options';
import { FileUtils } from '../../../../shared/utils/FileUtils';

const dataOptions = useDataOptions();
const { dataOptionsStore } = storeToRefs(dataOptions);

const dataPlanFormAct = reactive({
    dataSelectPlanForm: {
        year: ''
    },
    sendDataPlan: {
        year: ''
    },
    sendDataPlanExcel: {
        yearPlan: ''
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
        info2: 'idModelo - Modelo - Janeiro - Fevereiro - Março - Abril - Maio - Junho - Julho - Agosto - Setembro - Outubro - Novembro - Dezembro',
        info3: 'O Ficheiro deve ser editado apenas para as colunas referentes a cada Mês, ou seja, as colunas idModelo e Modelo não devem ser editadas.'
    },
    dataButtons: {
        infoExcel: 'Info',
        donwloadExcel: 'Exportar Excel',
        uploadExcel: 'Importar Excel',
        close: 'Fechar'
    },
    skeletonTable: false,
    fileCSV: null,
    messages: {
        confirmationData: {
            state: false,
            dataModalAction: {
                title: '',
                icon: '',
                colorIcon: '',
                action: ''
            }
        },
        confirmationModal: {
            state: false,
            dataModalAction: {
                title: '',
                data: '',
                icon: '',
                colorIcon: ''
            }
        }
    },
    messagesError: {
        titleError: 'Foram detectadas as seguintes incorreções no Ficheiro:',
        messagesErrorFile: '-O tamanho do Ficheiro não pode ser superior a 1MB\n-O Ficheiro só pode ser do tipo .csv',
    },
    dataCsv: [],
    fileTemp: null,
    modalUpdateState: {
        formPlan: 'Plano Form 01',
        state: false,
        newType: 'Novo Tipo',
        return: 'Voltar',
        save: 'Guardar'

    }
})

dataPlanFormAct.dataSelectPlanForm.year = dataOptionsStore.value.yearActual
const dataResponse = ref([])
const dataResponseModalUpdate = ref([])
const dataResponseTemp = ref([])
const dataModelService = async () => {
    dataPlanFormAct.skeletonTable = true
    dataPlanFormAct.sendDataPlan.year = dataPlanFormAct.dataSelectPlanForm.year
    dataPlanFormAct.dataMessages.loading = true
    dataResponse.value.length = 0
    dataResponse.value = dataResponseTemp.value
    try {
        dataPlanFormAct.dataResponseTemp = await PlanFormApi.pvmPlan(dataPlanFormAct.sendDataPlan)
        if (dataPlanFormAct.dataResponseTemp.car.length > 0) {
            for (const propertyL in dataPlanFormAct.dataResponseTemp.car) {
                let dataUpdateTemp = {
                    id: 0, name: '', jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0
                }
                dataUpdateTemp.id = dataPlanFormAct.dataResponseTemp.car[propertyL].id
                dataUpdateTemp.name = dataPlanFormAct.dataResponseTemp.car[propertyL].name
                for (const propertyM in dataPlanFormAct.dataResponseTemp.forecast) {
                    if (dataPlanFormAct.dataResponseTemp.car[propertyL].id === dataPlanFormAct.dataResponseTemp.forecast[propertyM].idCarModel) {
                        switch (dataPlanFormAct.dataResponseTemp.forecast[propertyM].month) {
                            case 1:
                                dataUpdateTemp.jan = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 2:
                                dataUpdateTemp.feb = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 3:
                                dataUpdateTemp.mar = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 4:
                                dataUpdateTemp.apr = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 5:
                                dataUpdateTemp.may = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 6:
                                dataUpdateTemp.jun = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 7:
                                dataUpdateTemp.jul = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 8:
                                dataUpdateTemp.aug = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 9:
                                dataUpdateTemp.sep = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 10:
                                dataUpdateTemp.oct = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 11:
                                dataUpdateTemp.nov = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
                                break;
                            case 12:
                                dataUpdateTemp.dec = dataPlanFormAct.dataResponseTemp.forecast[propertyM].forecast
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
        dataPlanFormAct.table.noData = 'Não há Plano Form 01 A Processar'
    }
    dataPlanFormAct.skeletonTable = false
    dataPlanFormAct.dataMessages.loading = false
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
const downloadExcelComponent = async () => {
    dataPlanFormAct.sendDataPlanExcel.yearPlan = dataPlanFormAct.dataSelectPlanForm.year
    dataPlanFormAct.dataMessages.loading = true
    try {
        const res = await PlanFormApi.downloadCSVOne(dataPlanFormAct.sendDataPlanExcel)
        const csvData = res.trim().split('\n').map(row => row.split(','));
        const csvContent = "\uFEFF" + csvData.map(row => row.join(';')).join('\r\n');
        const blob = new Blob([s2ab(csvContent)], { type: 'text/csv;charset=ISO-8859-1;' });


        const fileRename = `PlanForm01_${dataPlanFormAct.dataSelectPlanForm.year}.csv`
        FileUtils.open({
            file: blob,
            fileName: fileRename
        })

    } catch (e) {
        console.log('error', e)
    } finally {
        dataPlanFormAct.dataMessages.loading = false
    }
    dataPlanFormAct.dataMessages.loading = false
}
// Convert string to ArrayBuffer
const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        if (s.charCodeAt(i) !== 65279) {
            view[i] = s.charCodeAt(i) & 0xff;
        }
    }
    const bufferTwo = new ArrayBuffer(buf.byteLength - 1);
    const viewTwo = new Uint8Array(bufferTwo);
    for (let i = 1; i < view.length; i++) {
        viewTwo[i - 1] = view[i];
    }
    return bufferTwo;
}
const uploadFile = async () => {
    dataPlanFormAct.dataMessages.loading = true
    try {
        await PlanFormApi.uploadCSV(dataPlanFormAct.fileTemp, dataPlanFormAct.dataSelectPlanForm.year)
        dataPlanFormAct.messages.confirmationModal.state = true
        dataPlanFormAct.messages.confirmationModal.dataModalAction.title = '¡Operação efectuada com sucesso!'
        dataPlanFormAct.messages.confirmationModal.dataModalAction.icon = 'check_circle_outline'
        dataPlanFormAct.messages.confirmationModal.dataModalAction.colorIcon = 'green'
    } catch (error) {
        dataPlanFormAct.dataMessages.loading = false
        dataPlanFormAct.messages.confirmationModal.state = true
        dataPlanFormAct.messages.confirmationModal.dataModalAction.title = 'Ocorreu um erro ao efetuar o pedido'
        dataPlanFormAct.messages.confirmationModal.dataModalAction.icon = 'close'
        dataPlanFormAct.messages.confirmationModal.dataModalAction.colorIcon = 'red'
    }
    dataPlanFormAct.dataMessages.loading = false
}
const structureDataRowsModalUpdate = async (file: any) => {
    dataPlanFormAct.fileTemp = file
    dataPlanFormAct.dataCsv = await extractDataCSV(file)
    dataResponseModalUpdate.value.length = 0
    for (const propertyDR in dataResponse.value) {
        const dataModalUpdateRows = {
            id: 0, name: '', jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0
        }
        for (const propertyDC in dataPlanFormAct.dataCsv) {
            if (propertyDC !== 0) {
                const stingCSV = dataPlanFormAct.dataCsv[propertyDC][0]
                const dataTempCSV = stingCSV.split(';')
                for (const propertyDTcsv in dataTempCSV) {
                    if (propertyDTcsv !== 1) {
                        const dataReplace = dataTempCSV[0].replace(/"/g, '')
                        const dataNumberId = parseInt(dataReplace, 10)

                        if (dataResponse.value[propertyDR].id === dataNumberId) {
                            dataModalUpdateRows.id = dataReplace
                            dataModalUpdateRows.name = dataResponse.value[propertyDR].name
                            dataModalUpdateRows.jan = dataTempCSV[2] !== null || dataTempCSV[2] !== '' ? dataTempCSV[2].replace(/"/g, '') : 0
                            dataModalUpdateRows.feb = dataTempCSV[3] !== null || dataTempCSV[3] !== '' ? dataTempCSV[3].replace(/"/g, '') : 0
                            dataModalUpdateRows.mar = dataTempCSV[4] !== null || dataTempCSV[4] !== '' ? dataTempCSV[4].replace(/"/g, '') : 0
                            dataModalUpdateRows.apr = dataTempCSV[5] !== null || dataTempCSV[5] !== '' ? dataTempCSV[5].replace(/"/g, '') : 0
                            dataModalUpdateRows.may = dataTempCSV[6] !== null || dataTempCSV[6] !== '' ? dataTempCSV[6].replace(/"/g, '') : 0
                            dataModalUpdateRows.jun = dataTempCSV[7] !== null || dataTempCSV[7] !== '' ? dataTempCSV[7].replace(/"/g, '') : 0
                            dataModalUpdateRows.jul = dataTempCSV[8] !== null || dataTempCSV[8] !== '' ? dataTempCSV[8].replace(/"/g, '') : 0
                            dataModalUpdateRows.aug = dataTempCSV[9] !== null || dataTempCSV[9] !== '' ? dataTempCSV[9].replace(/"/g, '') : 0
                            dataModalUpdateRows.sep = dataTempCSV[10] !== null || dataTempCSV[10] !== '' ? dataTempCSV[10].replace(/"/g, '') : 0
                            dataModalUpdateRows.oct = dataTempCSV[11] !== null || dataTempCSV[11] !== '' ? dataTempCSV[11].replace(/"/g, '') : 0
                            dataModalUpdateRows.nov = dataTempCSV[12] !== null || dataTempCSV[12] !== '' ? dataTempCSV[12].replace(/"/g, '') : 0
                            dataModalUpdateRows.dec = dataTempCSV[13] !== null || dataTempCSV[13] !== '' ? dataTempCSV[13].replace(/"/g, '') : 0
                        }
                    }
                }
            }
        }
        if (dataModalUpdateRows.id !== 0) {
            Array.prototype.push.call(dataResponseModalUpdate.value, dataModalUpdateRows)
        }
    }
    if (dataResponseModalUpdate.value.length > 0) {
        dataPlanFormAct.modalUpdateState.state = true
    }

}
const extractDataCSV = (file: any) => {
    return new Promise((resolve) => {
        let data = null
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const contents = e.target.result
                const lines = contents.split('\n')
                data = lines.map(line => line.split(','))
                resolve(data)
            };
            reader.readAsText(file)
        } else {
            resolve(data)
        }
    })
}
const errorFile = async () => {
    dataPlanFormAct.messages.confirmationModal.state = true
    dataPlanFormAct.messages.confirmationModal.dataModalAction.title = dataPlanFormAct.messagesError.titleError
    dataPlanFormAct.messages.confirmationModal.dataModalAction.data = dataPlanFormAct.messagesError.messagesErrorFile
    dataPlanFormAct.messages.confirmationModal.dataModalAction.icon = 'warning_amber'
    dataPlanFormAct.messages.confirmationModal.dataModalAction.colorIcon = 'amber'
}
const updateStateConfirmationBudget = async (data: object) => {
    if (data.selectionSend === 'close') {
        dataPlanFormAct.messages.confirmationData.state = false
    } else if (data.selectionSend === 'success') {
        dataPlanFormAct.messages.confirmationModal.state = false
        dataModelService()
    }
}
onMounted(() => {
    dataModelService()
})
</script>
<template>
    <q-select style="width: 200px;" outlined v-model="dataPlanFormAct.dataSelectPlanForm.year"
        :options="dataOptionsStore.dataSelect.years" label="Select Year" @update:model-value="dataModelService()" />
    <div class="row q-pa-md" style="padding-top: 10px;">
        <div class="col-12 col-md-12">
            <q-card flat>
                <q-card-section v-if="dataPlanFormAct.skeletonTable">
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
                <q-card-section v-if="!dataPlanFormAct.skeletonTable">
                    <q-table flat :rows="dataResponse" :columns="columnsModels" row-key="name" :rows-per-page-options="[0]"
                        :pagination=dataPlanFormAct.table.pagination :no-data-label="dataPlanFormAct.table.noData" />
                </q-card-section>
            </q-card>
        </div>
    </div>
    <div align="right">
        <div class="q-pa-md" align="right">
            <div class="q-gutter-md row" align="right">
                <q-space />
                <q-btn color="white" class="text-black" :label="dataPlanFormAct.dataButtons.infoExcel" size="sm"
                    @click="dataPlanFormAct.dataPlanExcel.state = true" text-color="blue-5" icon="info" square></q-btn>
                <q-btn class="text-black" :label="dataPlanFormAct.dataButtons.donwloadExcel" size="sm" icon="timeline"
                    @click="downloadExcelComponent()" text-color="green-5" style="font-size: 11px" outlined></q-btn>
                <q-file color="green-5" dense label-color="green-5" :label="dataPlanFormAct.dataButtons.uploadExcel"
                    size="xs" accept=".csv" max-file-size="1048576" @rejected="errorFile"
                    @update:model-value="structureDataRowsModalUpdate"
                    style="font-size: 10px; max-width: 200px; box-shadow:0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12)">
                    <template v-slot:prepend>
                        <q-icon name="timeline" color="green-5" />
                    </template>
                </q-file>
            </div>
        </div>
    </div>
    <q-dialog v-model="dataPlanFormAct.dataPlanExcel.state" persistent position="top">
        <q-card style="max-width: 450px;top: 150px">
            <q-card-section class="q-py-md shadow-2 text-white bg-primary">
                <div class="text-h6">{{ dataPlanFormAct.dataPlanExcel.title }}</div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section class="q-pt-none" style="">
                {{ dataPlanFormAct.dataPlanExcel.info1 }} <br><br>
                {{ dataPlanFormAct.dataPlanExcel.info2 }} <br><br>
                {{ dataPlanFormAct.dataPlanExcel.info3 }}
            </q-card-section>
            <q-card-actions align="right">
                <q-btn class="text-black" :label="dataPlanFormAct.dataButtons.close"
                    @click="dataPlanFormAct.dataPlanExcel.state = false" icon="close" size="sm" text-color="red-5"
                    square></q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
    <q-dialog v-model="dataPlanFormAct.modalUpdateState.state" persistent position="top">
        <q-card style="max-width: 1150px;top: 10px">
            <q-card-section>
                <q-separator class="background-Secondary"></q-separator>
                <div class="text-h6 brand-secondary" style="color:var(--brand-secondary)">
                    {{ dataPlanFormAct.modalUpdateState.formPlan }}
                </div>
                <q-separator class="background-Secondary"></q-separator>
                <div>&nbsp;</div>
                <q-table flat :rows="dataResponseModalUpdate" :columns="columnsModels" row-key="name"
                    :rows-per-page-options="[0]" :pagination=dataPlanFormAct.table.pagination
                    :no-data-label="dataPlanFormAct.table.noData" />
            </q-card-section>
            <q-card-actions align="right">
                <q-card-actions align="right">
                    <q-btn style="
                        border: 1px; border-style: solid; border-color:var(--brand-secondary);
                        font-size: 12px;
                        padding-left: 22px;
                        padding-right: 8px;
                        padding-top: 5px;
                        width: 80px;
                      " @click="dataPlanFormAct.modalUpdateState.state = false"
                        :label="dataPlanFormAct.modalUpdateState.return"><img :src="mistakeImg" style="
                          transform: translateY(-55%);
                          position: absolute;
                          left: 1px;
                          top: 60%;
                        " />
                    </q-btn>
                    <q-btn @click="uploadFile" style="
                        border: 1px; border-style: solid; border-color:var(--brand-secondary);
                        font-size: 12px;
                        padding-left: 22px;
                        padding-right: 8px;
                        padding-top: 5px;" :label="dataPlanFormAct.modalUpdateState.save"><img :src="diskImg" style="
                          transform: translateY(-55%);
                          position: absolute;
                          left: 2px;
                          top: 60%;
                        " />
                    </q-btn>
                </q-card-actions>
            </q-card-actions>
        </q-card>
    </q-dialog>
    <messages :loading="dataPlanFormAct.dataMessages.loading" :confirmationData="dataPlanFormAct.messages.confirmationData"
        :confirmationModal="dataPlanFormAct.messages.confirmationModal"
        @update-state-confirmation="updateStateConfirmationBudget"> </messages>
</template>
