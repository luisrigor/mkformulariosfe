<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import BudgetApi from './BudgetApi'

import mistakeImg from 'src/assets/images/mistake.png'
import diskImg from 'src/assets/images/disk.png'
import Messages from '../../../modalMessages/MessagesPage.vue'
import { FileUtils } from '../../../../shared/utils/FileUtils';

import { storeToRefs } from 'pinia';
import { useDataOptions } from '../../../../shared/store/modules/data-options';

const dataOptions = useDataOptions();
const { dataOptionsStore } = storeToRefs(dataOptions);

const dataBudgetAct = reactive({
    dataSelectBudgetForm: {
        year: ''
    },
    sendDataBudget: {
        year: ''
    },
    sendDataBudgetExcel: {
        yearBudget: ''
    },
    dataResponseTemp: [],
    table: {
        pagination: { rowsPerPage: 0 },
        noData: '',
        dataColumn: { name: '', align: '', label: '', field: '' },
        colspanSize: 0,
        separator: 'cell'
    },
    dataMessages: {
        loading: false
    },
    dataBudgetExcel: {
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
        buget: 'Previsão de Vendas - ',
        state: false,
        newType: 'Novo Tipo',
        return: 'Voltar',
        save: 'Guardar',
        bugetTemp: 'Previsão de Vendas - '
    },
    dataTypes: [],
    dataCSV: null,
    dataListTypeOriginal: null,
    dataListTypeCSV: null,
    dataTempUlt: null

})
dataBudgetAct.dataSelectBudgetForm.year = dataOptionsStore.value.yearActual
const dataResponse = ref([])
const dataResponseTempModal = ref([])
const dataResponseModalUpdate = ref([])
const dataTypesCSV = ref([])
const columnsModels = [
    {
        name: 'concession',
        required: true,
        label: 'Concessão',
        align: 'left',
        field: 'name'
    }
]
const dataModelService = async () => {
    dataBudgetAct.skeletonTable = true
    dataBudgetAct.modalUpdateState.buget = dataBudgetAct.modalUpdateState.bugetTemp + dataBudgetAct.dataSelectBudgetForm.year
    dataBudgetAct.sendDataBudget.year = dataBudgetAct.dataSelectBudgetForm.year
    dataBudgetAct.dataMessages.loading = true
    dataResponse.value.length = 0
    try {
        dataBudgetAct.dataResponseTemp = await BudgetApi.pvmBudget(dataBudgetAct.sendDataBudget)
        for (const propertyBD in dataBudgetAct.dataResponseTemp.carTypes) {
            Array.prototype.push.call(dataBudgetAct.dataTypes, dataBudgetAct.dataResponseTemp.carTypes[propertyBD].type)
        }
        if (dataBudgetAct.dataResponseTemp.carTypes.length > 0) {
            dataBudgetAct.table.colspanSize = dataBudgetAct.dataResponseTemp.carTypes.length
            let monthTempCol = 1
            while (monthTempCol <= 12) {
                for (const propertyCT_C in dataBudgetAct.dataResponseTemp.carTypes) {
                    const dataTempCol = {
                        id: 0,
                        name: '',
                        label: '',
                        align: '',
                        field: ''
                    }
                    dataTempCol.id = dataBudgetAct.dataResponseTemp.carTypes[propertyCT_C].id
                    dataTempCol.name = dataBudgetAct.dataResponseTemp.carTypes[propertyCT_C].type + '-' + monthTempCol
                    dataTempCol.label = dataBudgetAct.dataResponseTemp.carTypes[propertyCT_C].type.substr(0, 3)
                    dataTempCol.align = 'center'
                    dataTempCol.field = dataBudgetAct.dataResponseTemp.carTypes[propertyCT_C].type + '-' + monthTempCol
                    Array.prototype.push.call(columnsModels, dataTempCol)
                }
                monthTempCol += 1
            }

            for (const propertyBD in dataBudgetAct.dataResponseTemp.budgetDealers) {
                // Data Dealer
                let dataTemp = {}
                const codDealer = dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[0]
                const name = dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[1] === '-Auto Meli (Teste A2D2)' ? '00' + dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[1] : dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[1]
                const id = dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[2] !== '' ? dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[2] : '00'
                const subDealer = parseInt(dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[3], 10)
                dataTemp = {
                    codDealer, name, id, subDealer
                }
                for (const propertyCT in dataBudgetAct.dataResponseTemp.carTypes) {
                    let monthTempRow = 1
                    while (monthTempRow <= 12) {
                        dataTemp[dataBudgetAct.dataResponseTemp.carTypes[propertyCT].type + '-' + monthTempRow] = 0
                        if (dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets.length > 0) {
                            for (const propertyBD_B in dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets) {
                                if (dataTemp.codDealer === dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets[propertyBD_B].oidDealer
                                    && monthTempRow === dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets[propertyBD_B].month
                                    && dataBudgetAct.dataResponseTemp.carTypes[propertyCT].id === dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets[propertyBD_B].idPvmCarModel
                                    && dataTemp.subDealer === dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets[propertyBD_B].subDealer) {
                                    dataTemp[dataBudgetAct.dataResponseTemp.carTypes[propertyCT].type + '-' + monthTempRow] = dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets[propertyBD_B].plates
                                }
                            }
                        }
                        monthTempRow += 1
                    }
                }
                Array.prototype.push.call(dataResponse.value, dataTemp)
            }
        }
    } catch (error) {
        dataBudgetAct.table.noData = 'Não há Previsões de Vendas'
    }
    dataBudgetAct.dataMessages.loading = false
    dataBudgetAct.skeletonTable = false

}
const dataModelServiceTempModal = async () => {
    dataBudgetAct.dataMessages.loading = true
    dataResponseTempModal.value.length = 0
    try {
        dataBudgetAct.dataResponseTemp = await BudgetApi.pvmBudget(dataBudgetAct.sendDataBudget)
        for (const propertyBD in dataBudgetAct.dataResponseTemp.carTypes) {
            Array.prototype.push.call(dataBudgetAct.dataTypes, dataBudgetAct.dataResponseTemp.carTypes[propertyBD].type)
        }
        if (dataBudgetAct.dataResponseTemp.carTypes.length > 0) {
            dataBudgetAct.table.colspanSize = dataBudgetAct.dataResponseTemp.carTypes.length
            let monthTempCol = 1
            while (monthTempCol <= 12) {
                for (const propertyCT_C in dataBudgetAct.dataResponseTemp.carTypes) {
                    const dataTempCol = {
                        id: 0,
                        name: '',
                        label: '',
                        align: '',
                        field: ''
                    }
                    dataTempCol.id = dataBudgetAct.dataResponseTemp.carTypes[propertyCT_C].id
                    dataTempCol.name = dataBudgetAct.dataResponseTemp.carTypes[propertyCT_C].type + '-' + monthTempCol
                    dataTempCol.label = dataBudgetAct.dataResponseTemp.carTypes[propertyCT_C].type.substr(0, 3)
                    dataTempCol.align = 'center'
                    dataTempCol.field = dataBudgetAct.dataResponseTemp.carTypes[propertyCT_C].type + '-' + monthTempCol
                    Array.prototype.push.call(columnsModels, dataTempCol)
                }
                monthTempCol += 1
            }

            for (const propertyBD in dataBudgetAct.dataResponseTemp.budgetDealers) {
                // Data Dealer
                let dataTemp = {}
                const codDealer = dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[0]
                const name = dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[1] === '-Auto Meli (Teste A2D2)' ? '00' + dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[1] : dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[1]
                const id = dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[2] !== '' ? dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[2] : '00'
                const subDealer = parseInt(dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].dealers[3], 10)
                dataTemp = {
                    codDealer, name, id, subDealer
                }
                for (const propertyCT in dataBudgetAct.dataResponseTemp.carTypes) {
                    let monthTempRow = 1
                    while (monthTempRow <= 12) {
                        dataTemp[dataBudgetAct.dataResponseTemp.carTypes[propertyCT].type + '-' + monthTempRow] = 0
                        if (dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets.length > 0) {
                            for (const propertyBD_B in dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets) {
                                if (dataTemp.codDealer === dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets[propertyBD_B].oidDealer
                                    && monthTempRow === dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets[propertyBD_B].month
                                    && dataBudgetAct.dataResponseTemp.carTypes[propertyCT].id === dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets[propertyBD_B].idPvmCarModel
                                    && dataTemp.subDealer === dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets[propertyBD_B].subDealer) {
                                    dataTemp[dataBudgetAct.dataResponseTemp.carTypes[propertyCT].type + '-' + monthTempRow] = dataBudgetAct.dataResponseTemp.budgetDealers[propertyBD].budgets[propertyBD_B].plates
                                }
                            }
                        }
                        monthTempRow += 1
                    }
                }
                Array.prototype.push.call(dataResponseTempModal.value, dataTemp);
            }
        }
    } catch (error) {
        dataBudgetAct.table.noData = 'Não há Previsões de Vendas'
    }
    dataBudgetAct.dataMessages.loading = false

}
const updateService = async () => {
    dataModelService()
}
const downloadExcelComponent = async () => {
    dataBudgetAct.sendDataBudgetExcel.yearBudget = dataBudgetAct.dataSelectBudgetForm.year
    dataBudgetAct.dataMessages.loading = true
    try {
        const res = await BudgetApi.downloadCSVOne(dataBudgetAct.sendDataBudgetExcel)
        const csvData = res.trim().split('\n').map((row: string) => row.split(','));
        const csvContent = "\uFEFF" + csvData.map((row: any[]) => row.join(';')).join('\r\n');

        const blob = new Blob([s2ab(csvContent)], { type: 'text/csv;charset=ISO-8859-1;' });
        const fileRename = `Orcamento_${dataBudgetAct.dataSelectBudgetForm.year}.csv`
        FileUtils.open({
            file: blob,
            fileName: fileRename
        })

    } catch (e) {
        console.log('error', e)
    } finally {
        dataBudgetAct.dataMessages.loading = false
    }
    dataBudgetAct.dataMessages.loading = false
}
// Convert string to ArrayBuffer
const s2ab = (s: string) => {
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
    dataBudgetAct.dataMessages.loading = true
    try {
        await BudgetApi.uploadCSV(dataBudgetAct.fileTemp, dataBudgetAct.dataSelectBudgetForm.year)
        dataBudgetAct.dataMessages.loading = false
        dataBudgetAct.messages.confirmationModal.state = true
        dataBudgetAct.messages.confirmationModal.dataModalAction.title = '¡Operação efectuada com sucesso!'
        dataBudgetAct.messages.confirmationModal.dataModalAction.icon = 'check_circle_outline'
        dataBudgetAct.messages.confirmationModal.dataModalAction.colorIcon = 'green'
    } catch (error) {
        dataBudgetAct.dataMessages.loading = false
        dataBudgetAct.messages.confirmationModal.state = true
        dataBudgetAct.messages.confirmationModal.dataModalAction.title = 'Ocorreu um erro ao efetuar o pedido'
        dataBudgetAct.messages.confirmationModal.dataModalAction.icon = 'close'
        dataBudgetAct.messages.confirmationModal.dataModalAction.colorIcon = 'red'
    }
    dataBudgetAct.dataMessages.loading = false
}
const structureDataRowsModalUpdate = async (file: any) => {
    await dataModelServiceTempModal()
    dataBudgetAct.dataMessages.loading = true
    dataBudgetAct.modalUpdateState.state = false
    dataBudgetAct.fileTemp = file
    dataBudgetAct.dataCsv = await extractDataCSV(file)
    dataResponseModalUpdate.value.length = 0
    dataTypesCSV.value.length = 0
    // ListTypesCsv
    for (const propertyTypeCSV in dataBudgetAct.dataCsv) {
        if (propertyTypeCSV === '0') {
            const dataTypeTemp = dataBudgetAct.dataCsv[propertyTypeCSV][0].split(';')
            for (const propertyTypeCSV_Type in dataTypeTemp) {
                if (propertyTypeCSV_Type !== '0' && propertyTypeCSV_Type !== '1') {
                    dataTypesCSV.value[propertyTypeCSV_Type] = dataTypeTemp[propertyTypeCSV_Type]
                }
            }
        }
    }
    dataBudgetAct.dataCSV = dataBudgetAct.dataCsv
    dataBudgetAct.dataListTypeCSV = dataTypesCSV.value
    dataBudgetAct.dataListTypeCSV = dataBudgetAct.dataListTypeCSV.map((item: string) => item.replace(/\r/g, ''))

    const dataArray = [];
    for (let rowIndex = 1; rowIndex < Object.keys(dataBudgetAct.dataCSV).length; rowIndex++) {
        const rowData = dataBudgetAct.dataCSV[rowIndex][0].split(";").map((item: string) => item.trim());
        const resultObject = {
            id: rowData[0] !== '=' ? rowData[0] : '00'
        };

        for (let dataTypeIndex = 2; dataTypeIndex < dataBudgetAct.dataListTypeCSV.length; dataTypeIndex++) {
            const dataType = dataBudgetAct.dataListTypeCSV[dataTypeIndex];

            if (dataType) {
                const columnIndex = dataBudgetAct.dataTypes.indexOf(dataType);

                if (columnIndex >= 0) {
                    for (let i = 1; i <= 12; i++) {
                        const arrayKey = `${dataType}-${i}`
                        const monthValue = rowData[1] == i ? parseInt(rowData[columnIndex + 2]) : 0
                        resultObject[arrayKey] = isNaN(monthValue) ? 0 : monthValue
                    }
                }
            }
        }
        dataArray.push(resultObject);
    }
    dataBudgetAct.dataTempUlt = dataArray
    const dataTempDataResponseUpdateDataModalFinal = await updateDataModalFinal(dataArray, dataResponseTempModal.value)

    dataResponseModalUpdate.value = dataTempDataResponseUpdateDataModalFinal
    if (dataResponseModalUpdate.value.length > 0) {
        dataBudgetAct.modalUpdateState.state = true
    }

    dataBudgetAct.dataMessages.loading = false

}
const updateDataModalFinal = async (dataArray: any, dataReponseTemp: any) => {
    const dataTempDataResponse = dataReponseTemp;
    for (let i = 0; i < dataArray.length; i++) {
        const record = dataArray[i];

        const matchingIndex = dataTempDataResponse.findIndex(item => item.id === record.id);

        if (matchingIndex !== -1) {
            for (const key in record) {
                if (key !== 'id' && record[key] !== 0) {
                    dataTempDataResponse[matchingIndex][key] = record[key];
                }
            }
        }
    }
    dataResponse.value = dataReponseTemp
    return dataTempDataResponse;
}
const extractDataCSV = (file: any) => {
    return new Promise((resolve) => {
        let data = null
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const contents = e.target.result
                const lines = contents.split('\n')
                data = lines.map((line: string) => line.split(','))
                resolve(data)
            };
            reader.readAsText(file)
        } else {
            resolve(data)
        }
    })
}
const errorFile = async () => {
    dataBudgetAct.messages.confirmationModal.state = true
    dataBudgetAct.messages.confirmationModal.dataModalAction.title = dataBudgetAct.messagesError.titleError
    dataBudgetAct.messages.confirmationModal.dataModalAction.data = dataBudgetAct.messagesError.messagesErrorFile
    dataBudgetAct.messages.confirmationModal.dataModalAction.icon = 'warning_amber'
    dataBudgetAct.messages.confirmationModal.dataModalAction.colorIcon = 'amber'
}
const updateStateConfirmationBudget = async (data: object) => {
    if (data.selectionSend === 'close') {
        dataBudgetAct.messages.confirmationData.state = false
    } else if (data.selectionSend === 'success') {
        if (dataBudgetAct.modalUpdateState.state) {
            dataBudgetAct.modalUpdateState.state = false
        }
        dataBudgetAct.messages.confirmationModal.state = false
        dataModelService()
    }
}
onMounted(() => {
    dataModelService()
})
</script>
<template>
    <q-select style="width: 200px;" outlined v-model="dataBudgetAct.dataSelectBudgetForm.year"
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
                    <q-table flat :rows="dataResponse" :columns="columnsModels" :rows-per-page-options="[0]"
                        :pagination=dataBudgetAct.table.pagination :no-data-label="dataBudgetAct.table.noData" bordered
                        :separator="dataBudgetAct.table.separator">
                        <template v-slot:header="props">
                            <q-tr>
                                <q-th colspan="1" style="color:var(--brand-primary);">{{ props.cols.length }}</q-th>
                                <q-th :colspan=dataBudgetAct.table.colspanSize
                                    v-for="months in dataOptionsStore.dataSelect.months" :key="months">
                                    {{ months }}
                                </q-th>
                            </q-tr>
                            <q-th v-for="col in props.cols" :key="col.name" :props="props">
                                {{ col.label }}
                            </q-th>
                        </template>
                    </q-table>
                </q-card-section>
            </q-card>
        </div>
    </div>
    <div align="right">
        <div class="q-pa-md" align="right">
            <div class="q-gutter-md row" align="right">
                <q-space />
                <q-btn color="white" class="text-black" :label="dataBudgetAct.dataButtons.infoExcel" size="sm"
                    @click="dataBudgetAct.dataBudgetExcel.state = true" text-color="blue-5" icon="info"
                    style="font-size: 11px"></q-btn>
                <q-btn class="text-black" :label="dataBudgetAct.dataButtons.donwloadExcel" size="sm" icon="timeline"
                    @click="downloadExcelComponent()" text-color="green-5" style="font-size: 11px" outlined></q-btn>
                <q-file color="green-5" dense label-color="green-5" :label="dataBudgetAct.dataButtons.uploadExcel" size="xs"
                    accept=".csv" max-file-size="1048576" @rejected="errorFile"
                    @update:model-value="structureDataRowsModalUpdate"
                    style="font-size: 10px; max-width: 200px; box-shadow:0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12)">
                    <template v-slot:prepend>
                        <q-icon name="timeline" color="green-5" />
                    </template>
                </q-file>
            </div>
        </div>
    </div>
    <q-dialog v-model="dataBudgetAct.dataBudgetExcel.state" persistent position="top">
        <q-card style="max-width: 450px;top: 150px">
            <q-card-section class="q-py-md shadow-2 text-white bg-primary">
                <div class="text-h6">{{ dataBudgetAct.dataBudgetExcel.title }}</div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section class="q-pt-none" style="">
                {{ dataBudgetAct.dataBudgetExcel.info1 }} <br><br>
                {{ dataBudgetAct.dataBudgetExcel.info2 }} <br><br>
                {{ dataBudgetAct.dataBudgetExcel.info3 }}
            </q-card-section>
            <q-card-actions align="right">
                <q-btn class="text-black" :label="dataBudgetAct.dataButtons.close"
                    @click="dataBudgetAct.dataBudgetExcel.state = false" icon="close" size="sm" text-color="red-5"
                    square></q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
    <q-dialog v-model="dataBudgetAct.modalUpdateState.state" persistent position="top">
        <q-card style="max-width: 1150px;top: 10px">
            <q-card-section>
               <q-separator class="background-Secondary"></q-separator>
                <div class="text-h6 brand-secondary" style="color:var(--brand-secondary)">
                    {{ dataBudgetAct.modalUpdateState.buget }}
                </div>
                <q-separator class="background-Secondary"></q-separator>
                <div>&nbsp;</div>
                <q-table flat :rows="dataResponseModalUpdate" :columns="columnsModels" :rows-per-page-options="[0]"
                    :pagination=dataBudgetAct.table.pagination :no-data-label="dataBudgetAct.table.noData" bordered
                    :separator="dataBudgetAct.table.separator">
                    <template v-slot:header="props">
                        <q-tr>
                            <q-th colspan="1" style="color:var(--brand-primary);">{{ props.cols.length }}</q-th>
                            <q-th :colspan=dataBudgetAct.table.colspanSize
                                v-for="months in dataOptionsStore.dataSelect.months" :key="months">
                                {{ months }}
                            </q-th>
                        </q-tr>
                        <q-th v-for="col in props.cols" :key="col.name" :props="props">
                            {{ col.label }}
                        </q-th>
                    </template>
                </q-table>
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
                      " @click="dataBudgetAct.modalUpdateState.state = false"
                        :label="dataBudgetAct.modalUpdateState.return"><img :src="mistakeImg" style="
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
                        padding-top: 5px;" :label="dataBudgetAct.modalUpdateState.save"><img :src="diskImg" style="
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
    <messages :loading="dataBudgetAct.dataMessages.loading" :confirmationData="dataBudgetAct.messages.confirmationData"
        :confirmationModal="dataBudgetAct.messages.confirmationModal"
        @update-state-confirmation="updateStateConfirmationBudget"> </messages>
</template>
