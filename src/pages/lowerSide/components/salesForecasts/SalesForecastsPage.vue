<script setup lang="ts">
import { reactive, toRef, onMounted, ref } from 'vue';
import downImg from 'src/assets/images/down.gif'
import upImg from 'src/assets/images/up.gif'
import mistakeImg from 'src/assets/images/mistake.png'
import diskImg from 'src/assets/images/disk.png'
import iconSearch from 'src/assets/images/icon_search.gif'

import Messages from '../../../modalMessages/MessagesPage.vue'
import SalesForecastsApi from './SalesForecastsApi'

import { storeToRefs } from 'pinia';
import { useDataOptions } from '../../../../shared/store/modules/data-options';
import { FileUtils } from '../../../../shared/utils/FileUtils';

const dataOptions = useDataOptions();
const { dataOptionsStore } = storeToRefs(dataOptions);
interface Props {
    dataLowerSidePage: {
        [x: string]: any;
        type: object,
        required: true
    }
}
const props = defineProps<Props>()
const dataSalesForecasts = toRef(props, 'dataLowerSidePage')
const dataSalesForecastsAct = reactive({
    yearActual: '',
    monthActual: '',
    imgFilter: downImg,
    showFilterComponent: true,
    dataMessages: {
        loading: false
    },
    pageTitles: {
        mainTitle: '',
        year: 'Ano',
        month: 'Mês',
        modalDelete: {
            titleInitialTcap: 'Devolver Previsão de Vendas Mensais',
            titleInitialDealer: 'Devolução de Previsão de Vendas Mensais',
            captionTcap: 'Indicar aviso de disponibilidade',
            captionDealer: 'Indique o motivo da devolução',
            titleFinal: '',
            captionFinal: '',
            maxLength: 2000
        },
        buttons: {
            return: 'Fechar',
            save: 'Guardar'
        },
    },
    dataDownloadExcel: {
        oneMonth: {
            title: 'Exportar Excel (1 Mes)',
            amount: 1,
        },
        threeMonths: {
            title: 'Exportar Excel (3 Meses)',
            amount: 3,
        },
    },
    dataNovo: {
        frotasSul: {
            title: 'Novo PVM Frotas Sul (75)',
            amount: 0,
        },
        iMobilizado: {
            title: 'Novo PVM IMobilizado (99)',
            amount: 0,
        },
        frotasGaia: {
            title: 'Novo PVM Frotas Gaia (40)',
            amount: 0,
        },
        export: {
            title: 'Novo PVM Exportação (32)',
            amount: 0,
        },
    },
    dataSendInitial: {
        month: 0,
        year: 0,
    },
    dataSendExcel: {
        month: 'MONTH',
        data: {
            month: 0,
            oidNet: '',
            year: 0,
        }
    },
    table: {
        pagination: { rowsPerPage: 0 },
        noData: ''
    },
    responseDataInitalTemp: [],
    modalDelete: false,
    dataSendDelete: {
        cancelReasons: '',
        idPVM: 0,
    },
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
        titleDataEmpty: 'Foram detectadas as seguintes incorreções no preenchimento do formulário:',
        messagesOneEmpty: '-O campo Indique o motivo da devolução é de preenchimento obrigatório!\n',
    },
    roles: null
})
dataSalesForecastsAct.yearActual = dataOptionsStore.value.yearActual
dataSalesForecastsAct.monthActual = dataOptionsStore.value.monthActual
dataSalesForecastsAct.roles = localStorage.getItem('roles')
const dataResponseBoardOne = ref([])
const dataResponseBoardTwo = ref([])
const columnsInitial = [
    { name: 'num', align: 'center', label: '#', field: 'num' },
    { name: 'cod', label: 'Cod', field: 'cod' },
    { name: 'dealer', label: 'Concessionário', field: 'dealer' },
    { name: 'area', label: 'Área', field: 'area' },
    { name: 'date', label: 'Data Disponibilização', field: 'date' },
    {
        name: 'action',
        align: 'center',
        field: ''
    }
]
const columnsDealers = [
    { name: 'null1', align: 'center', label: '', field: '' },
    { name: 'null2', align: 'center', label: '', field: '' },
    { name: 'idDealer', align: 'center', label: '', field: 'idDealer' },
    { name: 'dealer', align: 'center', label: '', field: 'dealer' },
    { name: 'null3', align: 'center', label: '', field: '' },
    { name: 'null4', align: 'center', label: '', field: '' },
]

const showFilter = async () => {
    if (dataSalesForecastsAct.imgFilter === '/src/assets/images/down.gif') {
        dataSalesForecastsAct.imgFilter = upImg
        dataSalesForecastsAct.showFilterComponent = false
    } else {
        dataSalesForecastsAct.imgFilter = downImg
        dataSalesForecastsAct.showFilterComponent = true
    }
}
const dataInitial = async () => {
    dataSalesForecastsAct.dataSendInitial.year = parseInt(dataSalesForecastsAct.yearActual, 10)
    dataSalesForecastsAct.dataSendInitial.month = dataOptionsStore.value.dataSelect.months.indexOf(dataSalesForecastsAct.monthActual) + 1
    dataSalesForecastsAct.dataMessages.loading = true
    dataSalesForecastsAct.pageTitles.modalDelete.titleFinal = ''
    dataSalesForecastsAct.pageTitles.modalDelete.captionFinal = ''
    if (dataSalesForecastsAct.roles === 'TCAP') {
        dataSalesForecastsAct.pageTitles.modalDelete.titleFinal = dataSalesForecastsAct.pageTitles.modalDelete.titleInitialTcap
        dataSalesForecastsAct.pageTitles.modalDelete.captionFinal = dataSalesForecastsAct.pageTitles.modalDelete.captionTcap
    } else if (dataSalesForecastsAct.roles === 'DEALER') {
        dataSalesForecastsAct.pageTitles.modalDelete.titleFinal = dataSalesForecastsAct.pageTitles.modalDelete.titleInitialDealer
        dataSalesForecastsAct.pageTitles.modalDelete.captionFinal = dataSalesForecastsAct.pageTitles.modalDelete.captionDealer
    }
    try {
        dataSalesForecastsAct.responseDataInital = await SalesForecastsApi.pvmDataInitial(dataSalesForecastsAct.dataSendInitial)
        if (dataSalesForecastsAct.responseDataInital.notSendPVM.length > 0) {
            dataResponseBoardOne.value.length = 0
            for (const propertyL in dataSalesForecastsAct.responseDataInital.notSendPVM) {
                const dataFinal = {
                    idDealer: dataSalesForecastsAct.responseDataInital.notSendPVM[propertyL].dealer.ivDealerCode,
                    dealer: dataSalesForecastsAct.responseDataInital.notSendPVM[propertyL].dealer.ivDesig
                }
                Array.prototype.push.call(dataResponseBoardOne.value, dataFinal)
            }

        }
        if (dataSalesForecastsAct.responseDataInital.pvmMonthlyReports.length > 0) {
            dataResponseBoardTwo.value.length = 0
            for (const propertyH in dataSalesForecastsAct.responseDataInital.pvmMonthlyReports) {
                const areaTemp = ref('')
                if (dataSalesForecastsAct.roles === 'TCAP') {
                    areaTemp.value = dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].subDealer === 1 ? 'Frotas Sul' : dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].subDealer === 2 ? 'Imobilizado (Gaia)' : dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].subDealer === 3 ? 'Frotas Gaia' : dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].subDealer === 4 ? 'Exportação (Ovar)' : ''
                }
                const keyInitial = dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].oidDealer
                const codTemp = ref('')
                const dealerTemp = ref('')
                const dateTemp = ref('')
                if (dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].hasOwnProperty('dtAvailability')) {
                    dateTemp.value = dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].dtAvailability.date.year + '-' +
                        ((dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].dtAvailability.date.month >= 10) ?
                            dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].dtAvailability.date.month :
                            '0' + dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].dtAvailability.date.month)
                        + '-' +
                        ((dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].dtAvailability.date.day >= 10) ?
                            dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].dtAvailability.date.day :
                            '0' + dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].dtAvailability.date.day)
                }
                for (const propertyMD in dataSalesForecastsAct.responseDataInital.mapDealers) {
                    if (keyInitial === dataSalesForecastsAct.responseDataInital.mapDealers[propertyMD].key) {
                        codTemp.value = dataSalesForecastsAct.responseDataInital.mapDealers[propertyMD].dealer.ivDealerCode
                        dealerTemp.value = dataSalesForecastsAct.responseDataInital.mapDealers[propertyMD].dealer.ivDesig
                    }
                }
                const dataFinalInitial = {
                    num: dataSalesForecastsAct.responseDataInital.pvmMonthlyReports[propertyH].id,
                    cod: codTemp.value,
                    dealer: dealerTemp.value,
                    area: areaTemp,
                    date: dateTemp.value
                }
                Array.prototype.push.call(dataResponseBoardTwo.value, dataFinalInitial)
            }
        }
    } catch (e) {
        console.log('error', e)
    } finally {
        dataSalesForecastsAct.dataMessages.loading = false
    }
    dataSalesForecastsAct.dataMessages.loading = false
}
const downloadExcelComponent = async (selectedMonth: number) => {
    dataSalesForecastsAct.dataSendExcel.data.year = parseInt(dataSalesForecastsAct.yearActual, 10)
    dataSalesForecastsAct.dataSendExcel.data.month = dataOptionsStore.value.dataSelect.months.indexOf(dataSalesForecastsAct.monthActual) + 1
    const monthSend = selectedMonth + dataSalesForecastsAct.dataSendExcel.month
    dataSalesForecastsAct.dataMessages.loading = true
    try {
        dataSalesForecastsAct.dataSendExcel.data.oidNet = await SalesForecastsApi.pvmOidNet()
        const res = await SalesForecastsApi.downloadExcel(monthSend, dataSalesForecastsAct.dataSendExcel.data)
        const blob = new Blob([res], { type: 'application/octet-stream' })
        const fileRename = `Previsão_de_Vendas_e_Matrículas_(${dataSalesForecastsAct.monthActual}).xls`
        FileUtils.open({
            file: blob,
            fileName: fileRename
        })

    } catch (e) {
        console.log('error', e)
    } finally {
        dataSalesForecastsAct.dataMessages.loading = false
    }
    dataSalesForecastsAct.dataMessages.loading = false
}
const optionDelete = async (data: any) => {
    dataSalesForecastsAct.dataSendDelete.idPVM = 0
    dataSalesForecastsAct.dataSendDelete.cancelReasons === ''
    dataSalesForecastsAct.modalDelete = true
    dataSalesForecastsAct.dataSendDelete.idPVM = data.num
}
const optionValidateSend = async () => {
    if (dataSalesForecastsAct.dataSendDelete.cancelReasons === '' || dataSalesForecastsAct.dataSendDelete.cancelReasons === null) {
        dataSalesForecastsAct.messages.confirmationModal.state = true
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.title = dataSalesForecastsAct.messagesError.titleDataEmpty
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.data = dataSalesForecastsAct.messagesError.messagesOneEmpty
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.icon = 'warning_amber'
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.colorIcon = 'amber'
    } else {
        optionDeleteSend()
    }
}
const optionDeleteSend = async () => {
    if (dataSalesForecastsAct.roles === 'TCAP') {
        try {
            await SalesForecastsApi.pvmProvideDealer(dataSalesForecastsAct.dataSendDelete)
            dataSalesForecastsAct.modalDelete = false
            dataSalesForecastsAct.dataMessages.loading = false
            dataSalesForecastsAct.messages.confirmationModal.state = true
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.title = '¡Operação efectuada com sucesso!'
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.icon = 'check_circle_outline'
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.colorIcon = 'green'
        } catch (error) {
            dataSalesForecastsAct.dataMessages.loading = false
            dataSalesForecastsAct.messages.confirmationModal.state = true
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.title = 'Ocorreu um erro ao efetuar o pedido'
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.icon = 'close'
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.colorIcon = 'red'
        }
    } else if (dataSalesForecastsAct.roles === 'DEALER') {
        try {
            await SalesForecastsApi.pvmRequestChange(dataSalesForecastsAct.dataSendDelete)
            dataSalesForecastsAct.modalDelete = false
            dataSalesForecastsAct.dataMessages.loading = false
            dataSalesForecastsAct.messages.confirmationModal.state = true
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.title = '¡Operação efectuada com sucesso!'
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.icon = 'check_circle_outline'
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.colorIcon = 'green'
        } catch (error) {
            dataSalesForecastsAct.dataMessages.loading = false
            dataSalesForecastsAct.messages.confirmationModal.state = true
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.title = 'Ocorreu um erro ao efetuar o pedido'
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.icon = 'close'
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.colorIcon = 'red'
        }
    }
    dataSalesForecastsAct.roles
}
const updateStateConfirmationModel = async (data: object) => {
    if (data.selectionSend === 'close') {
        dataSalesForecastsAct.messages.confirmationData.state = false
    } else if (data.selectionSend === 'check') {
        dataSalesForecastsAct.messages.confirmationData.state = false
        dataSalesForecastsAct.dataMessages.loading = true
    } else if (data.selectionSend === 'success') {
        dataSalesForecastsAct.messages.confirmationModal.state = false
        dataInitial()
    }
}
onMounted(() => {
    dataInitial()
})
</script>
<template>
    <div class="background-Primary" style="border: 2px; border-style: solid; border-color:var(--brand-secondary);">
        <span class="text-h7" style="padding-left: 5px; color:var(--brand-secondary)">
            Filtro
        </span>
        <img style="float: right; padding-top: 4px; padding-right: 10px" :src="dataSalesForecastsAct.imgFilter"
            @click="showFilter" />
        <div class="bg-white q-pa-md example-row-column-width" v-if="dataSalesForecastsAct.showFilterComponent">
            <div class="row text-h6" style="color:var(--brand-secondary)">
                <div class="col-2">{{ dataSalesForecastsAct.pageTitles.year }}</div>
                <div class="col-2" style="padding-left: 30px;">{{ dataSalesForecastsAct.pageTitles.month }}</div>
            </div>

            <div class="row">
                <div class="col-2">
                    <q-select style="width: 200px;" outlined v-model="dataSalesForecastsAct.yearActual"
                        :options="dataOptionsStore.dataSelect.years" label="Select Year" />

                </div>
                <div class="col-2" style="padding-left: 30px;">
                    <q-select style="width: 200px;" outlined v-model="dataSalesForecastsAct.monthActual"
                        :options="dataOptionsStore.dataSelect.months" label="Select Mont" />
                </div>
                <div class="col-3" style="padding-left: 50px; padding-top: 12px;">
                    <q-btn style="
                    border: 1px; border-style: solid; border-color:var(--brand-secondary);
                    font-size: 12px;
                    padding-left: 18px;
                    padding-right: 8px;
                    padding-top: 5px;
                  " @click="dataInitial()" label="Pesquisar"><img :src="iconSearch" style="
                      transform: translateY(-55%);
                      position: absolute;
                      left: 1px;
                      top: 50%;
                    " />
                    </q-btn>
                </div>
            </div>
        </div>
    </div>
    <br /><br />
    <div class="row">
        <div class="col-12 col-md-3" style="width: 200px">
            <q-btn-group push>
                <q-btn push :label="dataSalesForecastsAct.dataDownloadExcel.oneMonth.title" icon="timeline"
                    style="width: 200px;" color="green-5" flat square @click="downloadExcelComponent(1)" />
                <q-btn push :label="dataSalesForecastsAct.dataDownloadExcel.threeMonths.title" icon="timeline"
                    style="width: 250px;" color="green-5" flat square @click="downloadExcelComponent(3)" />
            </q-btn-group>
        </div>
        <div class="col-12 col-md-3">
        </div>
    </div>
    <div class="row" style="padding-top: 10px;">
        <q-btn-group push>
            <q-btn push :label="dataSalesForecastsAct.dataNovo.frotasSul.title" icon="add_task"
                style="width: 250px;color:var(--brand-secondary)" flat square />
            <q-btn push :label="dataSalesForecastsAct.dataNovo.iMobilizado.title" icon="add_task"
                style="width: 250px;color:var(--brand-secondary)" flat square />
            <q-btn push :label="dataSalesForecastsAct.dataNovo.frotasGaia.title" icon="add_task"
                style="width: 250px;color:var(--brand-secondary)" flat square />
            <q-btn push :label="dataSalesForecastsAct.dataNovo.export.title" icon="add_task"
                style="width: 250px;color:var(--brand-secondary)" flat square />
        </q-btn-group>
    </div>
    <div class="row q-pa-md" style="padding-top: 10px;">
        <div class="col-12 col-md-12">
            <q-card flat>
                <q-card-section>
                    <q-table flat :rows="dataResponseBoardTwo" :columns="columnsInitial" row-key="name"
                        :rows-per-page-options="[0]" :pagination=dataSalesForecastsAct.table.pagination>
                        <template #body-cell-action="props">
                            <q-space />
                            <q-tr :props="props">
                                <q-td v-if="props.row.date !== ''">
                                    <q-btn icon="search" flat round color="amber" @click="optionEdit(props.row)"><q-tooltip
                                            anchor="center right" self="center left" :offset="[10, 10]">
                                            <strong>Consultar Detalhe</strong>
                                        </q-tooltip></q-btn>
                                    <q-btn icon="delete" flat round color="red" @click="optionDelete(props.row)"><q-tooltip
                                            anchor="center right" self="center left" :offset="[10, 10]">
                                            <strong>Devolver</strong>
                                        </q-tooltip></q-btn>
                                </q-td>
                                <q-td v-else>
                                    <q-btn icon="search" flat round color="amber" @click="optionEdit(props.row)"><q-tooltip
                                            anchor="center right" self="center left" :offset="[10, 10]">
                                            <strong>Consultar Detalhe</strong>
                                        </q-tooltip></q-btn>
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                    <q-table title="Concessionários em Atraso" :rows="dataResponseBoardOne" :columns="columnsDealers"
                        row-key="name" :rows-per-page-options="[0]" :pagination=dataSalesForecastsAct.table.pagination />
                </q-card-section>
            </q-card>
        </div>
    </div>
    <q-dialog v-model="dataSalesForecastsAct.modalDelete" persistent>
        <q-card
            style="max-width: 910px; width: 910px; border: 5px; border-style: solid; border-color:var(--brand-secondary);">
            <q-card-section class="q-py-md shadow-2">
                <div class="q" style="padding-left: 15px;">
                    <div class="q-gutter-md  items-start ">

                        <q-card class="q-ma-md" style="padding-left: 15px;">
                            <q-card-section>
                                <div class="text-h6"
                                    style="padding-left: 15px; text-align: left; color: var(--brand-secondary);">
                                    <b style="color: var(--brand-secondary);">
                                        {{ dataSalesForecastsAct.pageTitles.modalDelete.titleFinal }}
                                    </b>
                                </div>
                                <q-separator class="background-Secondary" inset></q-separator>
                                <div>&nbsp;</div>
                                <div class="text-h7"
                                    style="padding-left: 15px; text-align: left; color: var(--brand-secondary);">
                                    <b style="color: var(--brand-secondary);">
                                        {{ dataSalesForecastsAct.pageTitles.modalDelete.captionFinal }}
                                    </b>
                                </div>
                                <q-input v-model="dataSalesForecastsAct.dataSendDelete.cancelReasons" outlined autogrow
                                    clearable counter :maxlength="dataSalesForecastsAct.pageTitles.modalDelete.maxLength" />
                            </q-card-section>
                        </q-card>
                    </div>
                </div>

            </q-card-section>
            <q-separator />

            <q-card-actions align="right">
                <q-btn style="
                        border: 1px; border-style: solid; border-color:var(--brand-secondary);
                        font-size: 12px;
                        padding-left: 22px;
                        padding-right: 8px;
                        padding-top: 5px;
                        width: 80px;" @click="dataSalesForecastsAct.modalDelete = false"
                    :label="dataSalesForecastsAct.pageTitles.buttons.return"><img :src="mistakeImg" style="
                          transform: translateY(-55%);
                          position: absolute;
                          left: 1px;
                          top: 60%;
                        " />
                </q-btn>
                <q-btn @click="optionValidateSend" style="
                        border: 1px; border-style: solid; border-color:var(--brand-secondary);
                        font-size: 12px;
                        padding-left: 22px;
                        padding-right: 8px;
                        padding-top: 5px;" :label="dataSalesForecastsAct.pageTitles.buttons.save"><img :src="diskImg"
                        style="
                          transform: translateY(-55%);
                          position: absolute;
                          left: 2px;
                          top: 60%;
                        " />
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
    <messages :loading="dataSalesForecastsAct.dataMessages.loading"
        :confirmationData="dataSalesForecastsAct.messages.confirmationData"
        :confirmationModal="dataSalesForecastsAct.messages.confirmationModal"
        @update-state-confirmation="updateStateConfirmationModel"> </messages>
</template>
