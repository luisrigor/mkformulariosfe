<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import downImg from 'src/assets/images/down.gif'
import upImg from 'src/assets/images/up.gif'
import mistakeImg from 'src/assets/images/mistake.png'
import diskImg from 'src/assets/images/disk.png'
import iconSearch from 'src/assets/images/icon_search.gif'
import addImg from 'src/assets/images/add.gif'

import Messages from '../../../modalMessages/MessagesPage.vue'
import SalesForecastsApi from './SalesForecastsApi'

import { storeToRefs } from 'pinia';
import { useDataOptions } from '../../../../shared/store/modules/data-options';
import { FileUtils } from '../../../../shared/utils/FileUtils';

const dataOptions = useDataOptions();
const { dataOptionsStore } = storeToRefs(dataOptions);
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
            save: 'Guardar',
            modalPVM: {
                save: 'Guardar PVM',
                send: 'Enviar PVM',
            }

        },
        titleModalPvm: 'Registo de Previsões',
        captionModalPvmFinal: '',
        captionModalPvmDealer: '(*) - Por vendas entende-se facturação.',
        captionModalPvmTcap: 'NOTA: Incluir sempre as viaturas de demonstração (tanto de lançamento como as restantes) considerando que cada viatura corresponde sempre a uma venda e uma matrícula'
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
        newPVm: {
            title: 'Novo PVM',
            amount: 0,
        },
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
    roles: null,
    app: '',
    modalPVM: false,
    tablePvm: {
        pagination: { rowsPerPage: 0 },
        noData: '',
        dataColumn: { name: '', align: '', label: '', field: '' },
        colspanSize: 0,
        separator: 'cell',
        dataHeaderOne: ['Vendas', 'Matrículas', 'VD/VC'],
        dataMonths: [],
        dataHeaderInitialToyota: ['Tipo', 'Modelo', 'Prev-2', 'Prev-1', 'Prev', 'Prev-1', 'Prev', 'Prev', 'VD/VC-2', 'VD/VC-1', 'VD/VC'],
        dataHeaderInitialLexusTcap: ['Tipo', 'Modelo', 'Contratos', 'Vendas (*)', 'Orçamentos', 'Matriculas'],
        dataHeaderInitialLexusDealer: ['Tipo', 'Modelo', 'Contratos', 'Vendas (*)', 'Orçamentos', 'Matriculas', 'VDVC']
    },
    dataPvm: {},
    dataResponseDetailTemp: [],
    idPVM: 0,
    modaPVMButton: false,
    columnsInitial: [],
    stateActionCloseModalPVM: false,
    stateActionSendModalPVM: false,
    size: ''
})
dataSalesForecastsAct.yearActual = dataOptionsStore.value.yearActual
dataSalesForecastsAct.monthActual = dataOptionsStore.value.monthActual
dataSalesForecastsAct.roles = localStorage.getItem('roles')
dataSalesForecastsAct.app = localStorage.getItem('app')
const dataResponseBoardOne = ref([])
const dataResponseBoardTwo = ref([])
const dataResponseDetail = ref([])
const dataSendDetail = ref([])
const columnsInitialTcap = [
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
const columnsInitialDealer = [
    { name: 'num', align: 'center', label: '#', field: 'num' },
    { name: 'cod', label: 'Cod', field: 'cod' },
    { name: 'dealer', label: 'Concessionário', field: 'dealer' },
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
    if (dataSalesForecastsAct.imgFilter === '/fe/src/assets/images/down.gif') {
        dataSalesForecastsAct.imgFilter = upImg
        dataSalesForecastsAct.showFilterComponent = false
    } else {
        dataSalesForecastsAct.imgFilter = downImg
        dataSalesForecastsAct.showFilterComponent = true
    }
}
const dataInitial = async () => {
    dataSalesForecastsAct.stateActionCloseModalPVM = false
    dataSalesForecastsAct.stateActionSendModalPVM = false
    dataResponseBoardTwo.value.length = 0
    dataResponseBoardOne.value.length = 0
    dataSalesForecastsAct.dataSendInitial.year = parseInt(dataSalesForecastsAct.yearActual, 10)
    dataSalesForecastsAct.dataSendInitial.month = dataOptionsStore.value.dataSelect.months.indexOf(dataSalesForecastsAct.monthActual) + 1
    dataSalesForecastsAct.dataMessages.loading = true
    dataSalesForecastsAct.pageTitles.modalDelete.titleFinal = ''
    dataSalesForecastsAct.pageTitles.modalDelete.captionFinal = ''
    if (dataSalesForecastsAct.roles === 'TCAP') {
        dataSalesForecastsAct.size = '1100px'
        dataSalesForecastsAct.pageTitles.modalDelete.titleFinal = dataSalesForecastsAct.pageTitles.modalDelete.titleInitialTcap
        dataSalesForecastsAct.pageTitles.modalDelete.captionFinal = dataSalesForecastsAct.pageTitles.modalDelete.captionTcap
        dataSalesForecastsAct.columnsInitial = columnsInitialTcap
    } else if (dataSalesForecastsAct.roles === 'DEALER') {
        dataSalesForecastsAct.size = '1220px'
        dataSalesForecastsAct.pageTitles.modalDelete.titleFinal = dataSalesForecastsAct.pageTitles.modalDelete.titleInitialDealer
        dataSalesForecastsAct.pageTitles.modalDelete.captionFinal = dataSalesForecastsAct.pageTitles.modalDelete.captionDealer
        dataSalesForecastsAct.columnsInitial = columnsInitialDealer
    }
    if (dataSalesForecastsAct.app === 'Toyota') {
        dataSalesForecastsAct.pageTitles.captionModalPvmFinal = dataSalesForecastsAct.pageTitles.captionModalPvmTcap
    } else if (dataSalesForecastsAct.app === 'Lexus') {
        dataSalesForecastsAct.pageTitles.captionModalPvmFinal = dataSalesForecastsAct.pageTitles.captionModalPvmDealer
    }
    try {
        dataSalesForecastsAct.responseDataInitalTemp = await SalesForecastsApi.pvmDataInitial(dataSalesForecastsAct.dataSendInitial)
        if (dataSalesForecastsAct.responseDataInitalTemp.notSendPVM.length > 0) {
            for (const propertyL in dataSalesForecastsAct.responseDataInitalTemp.notSendPVM) {
                const dataFinal = {
                    idDealer: dataSalesForecastsAct.responseDataInitalTemp.notSendPVM[propertyL].dealer.ivDealerCode !== '' ? dataSalesForecastsAct.responseDataInitalTemp.notSendPVM[propertyL].dealer.ivDealerCode : '00',
                    dealer: dataSalesForecastsAct.responseDataInitalTemp.notSendPVM[propertyL].dealer.ivDesig
                }
                Array.prototype.push.call(dataResponseBoardOne.value, dataFinal)
            }

        }
        if (dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports.length > 0) {
            for (const propertyH in dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports) {
                const areaTemp = ref('')
                if (dataSalesForecastsAct.roles === 'TCAP') {
                    areaTemp.value = dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].subDealer === 1 ? 'Frotas Sul' : dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].subDealer === 2 ? 'Imobilizado (Gaia)' : dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].subDealer === 3 ? 'Frotas Gaia' : dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].subDealer === 4 ? 'Exportação (Ovar)' : ''
                }
                const keyInitial = dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].oidDealer
                const codTemp = ref('')
                const dealerTemp = ref('')
                const dateTemp = ref('')
                if (dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].hasOwnProperty('dtAvailability')) {
                    dateTemp.value = dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].dtAvailability.date.year + '-' +
                        ((dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].dtAvailability.date.month >= 10) ?
                            dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].dtAvailability.date.month :
                            '0' + dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].dtAvailability.date.month)
                        + '-' +
                        ((dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].dtAvailability.date.day >= 10) ?
                            dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].dtAvailability.date.day :
                            '0' + dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].dtAvailability.date.day)
                }
                for (const propertyMD in dataSalesForecastsAct.responseDataInitalTemp.mapDealers) {
                    if (keyInitial === dataSalesForecastsAct.responseDataInitalTemp.mapDealers[propertyMD].key) {
                        codTemp.value = dataSalesForecastsAct.responseDataInitalTemp.mapDealers[propertyMD].dealer.ivDealerCode
                        dealerTemp.value = dataSalesForecastsAct.responseDataInitalTemp.mapDealers[propertyMD].dealer.ivDesig
                    }
                }
                const dataFinalInitial = {
                    num: dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].id,
                    cod: codTemp.value,
                    dealer: dealerTemp.value,
                    area: areaTemp,
                    date: dateTemp.value,
                    subDealer: dataSalesForecastsAct.responseDataInitalTemp.pvmMonthlyReports[propertyH].subDealer
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
    dataSalesForecastsAct.dataSendDelete.cancelReasons = ''
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
    dataSalesForecastsAct.dataMessages.loading = true
    if (dataSalesForecastsAct.roles === 'TCAP') {
        try {
            await SalesForecastsApi.pvmProvideDealer(dataSalesForecastsAct.dataSendDelete)
            dataSalesForecastsAct.modalDelete = false
            dataSalesForecastsAct.dataMessages.loading = false
            dataSalesForecastsAct.messages.confirmationModal.state = true
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.title = '¡Operação efectuada com sucesso!'
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.icon = 'check_circle_outline'
            dataSalesForecastsAct.messages.confirmationModal.dataModalAction.colorIcon = 'green'
            dataInitial()
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
            dataInitial()
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
        if (dataSalesForecastsAct.stateActionCloseModalPVM) {
            dataSalesForecastsAct.modalPVM = false
            dataInitial()
        } else if (dataSalesForecastsAct.stateActionSendModalPVM) {
            sendReport()
        }
        dataSalesForecastsAct.dataMessages.loading = true
    } else if (data.selectionSend === 'success') {
        dataSalesForecastsAct.messages.confirmationModal.state = false
    }
}
const optionEdit = async (data: object) => {

    dataSalesForecastsAct.modaPVMButton = false
    dataSalesForecastsAct.idPVM = 0
    dataSalesForecastsAct.idPVM = data.num
    dataSalesForecastsAct.dataMessages.loading = true
    try {
        dataSalesForecastsAct.dataResponseDetailTemp = await SalesForecastsApi.pvmDetail(data.num)
        editDataDetail(dataSalesForecastsAct.dataResponseDetailTemp)
        dataSalesForecastsAct.dataPvm = data
        dataSalesForecastsAct.modalPVM = true
        const positionMontAct = dataOptionsStore.value.dataSelect.months.indexOf(dataSalesForecastsAct.monthActual)
        Array.prototype.push.call(dataSalesForecastsAct.tablePvm.dataMonths, dataOptionsStore.value.dataSelect.months[positionMontAct])
        Array.prototype.push.call(dataSalesForecastsAct.tablePvm.dataMonths, dataOptionsStore.value.dataSelect.months[positionMontAct + 1])
        Array.prototype.push.call(dataSalesForecastsAct.tablePvm.dataMonths, dataOptionsStore.value.dataSelect.months[positionMontAct + 2])
    } catch (e) {
        console.log('error', e)
    } finally {
        dataSalesForecastsAct.dataMessages.loading = false
    }
    dataSalesForecastsAct.dataMessages.loading = false
}
const newPVM = async (id: number) => {
    dataSalesForecastsAct.modaPVMButton = true
    let exists = false
    dataSalesForecastsAct.idPVM = 0
    for (const propertyRTwo in dataResponseBoardTwo.value) {
        if (dataResponseBoardTwo.value[propertyRTwo].subDealer === id) {
            exists = true
        }
    }
    if ((dataSalesForecastsAct.monthActual !== dataOptionsStore.value.monthActual) || (dataSalesForecastsAct.yearActual !== dataOptionsStore.value.yearActual)) {
        dataSalesForecastsAct.messages.confirmationModal.state = true
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.title = 'PVM já criado para o mês actual'
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.icon = 'warning_amber'
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.colorIcon = 'amber'
    } else if (exists) {
        dataSalesForecastsAct.messages.confirmationModal.state = true
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.title = 'PVM já criado para o mês actual'
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.icon = 'warning_amber'
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.colorIcon = 'amber'
    } else {

        dataSalesForecastsAct.dataMessages.loading = true
        try {
            dataSalesForecastsAct.idPVM = await SalesForecastsApi.pvmNew(id)
            dataSalesForecastsAct.dataResponseDetailTemp = await SalesForecastsApi.pvmDetail(dataSalesForecastsAct.idPVM)
            editDataDetail(dataSalesForecastsAct.dataResponseDetailTemp)
            const positionMontAct = dataOptionsStore.value.dataSelect.months.indexOf(dataSalesForecastsAct.monthActual)
            Array.prototype.push.call(dataSalesForecastsAct.tablePvm.dataMonths, dataOptionsStore.value.dataSelect.months[positionMontAct])
            Array.prototype.push.call(dataSalesForecastsAct.tablePvm.dataMonths, dataOptionsStore.value.dataSelect.months[positionMontAct + 1])
            Array.prototype.push.call(dataSalesForecastsAct.tablePvm.dataMonths, dataOptionsStore.value.dataSelect.months[positionMontAct + 2])
            dataSalesForecastsAct.dataMessages.loading = false
            dataSalesForecastsAct.modalPVM = true
        } catch (e) {
            console.log('error', e)
        } finally {
            dataSalesForecastsAct.dataMessages.loading = false
        }
        dataSalesForecastsAct.dataMessages.loading = false

    }
}
const editDataDetail = async (data: object) => {
    const typeTemp: string | any[] = []
    dataSendDetail.value.length = 0
    dataResponseDetail.value.length = 0
    for (const propertyRTwo in data.car) {
        if (!typeTemp.includes(data.car[propertyRTwo].type)) {
            Array.prototype.push.call(typeTemp, data.car[propertyRTwo].type)
        }
    }
    for (const propertyT in typeTemp) {
        const dataFinalDetail = {
            [typeTemp[propertyT]]: []
        }
        for (const propertyR in data) {
            if (propertyR === 'car') {
                for (const propertyC in data[propertyR]) {
                    if (data[propertyR][propertyC].type === typeTemp[propertyT]) {
                        const objectTemp = {
                            id: data[propertyR][propertyC].id,
                            name: data[propertyR][propertyC].name
                        }
                        for (const propertyRTwo in data) {
                            if (propertyRTwo === 'salesAndPlates') {
                                for (const propertySP in data[propertyRTwo]) {
                                    if (data[propertyRTwo][propertySP].brandId === objectTemp.id) {
                                        if (dataSalesForecastsAct.app === 'Toyota') {
                                            const dataSendTemp = {
                                                idModel: data[propertyR][propertyC].id,
                                                p1: data[propertyRTwo][propertySP].platesValue === null ? 0 : data[propertyRTwo][propertySP].platesValue,
                                                p2: data[propertyRTwo][propertySP].platesValue2 === null ? 0 : data[propertyRTwo][propertySP].platesValue2,
                                                p3: data[propertyRTwo][propertySP].platesValue3 === null ? 0 : data[propertyRTwo][propertySP].platesValue3,
                                                s1: data[propertyRTwo][propertySP].salesValue === null ? 0 : data[propertyRTwo][propertySP].salesValue,
                                                s2: data[propertyRTwo][propertySP].salesValue2 === null ? 0 : data[propertyRTwo][propertySP].salesValue2,
                                                s3: data[propertyRTwo][propertySP].salesValue3 === null ? 0 : data[propertyRTwo][propertySP].salesValue3,
                                                v1: data[propertyRTwo][propertySP].vdvc === null ? 0 : data[propertyRTwo][propertySP].vdvc,
                                                v2: data[propertyRTwo][propertySP].vdvc2 === null ? 0 : data[propertyRTwo][propertySP].vdvc2,
                                                v3: data[propertyRTwo][propertySP].vdvc3 === null ? 0 : data[propertyRTwo][propertySP].vdvc3,
                                            }
                                            objectTemp['SVP2'] = data[propertyRTwo][propertySP].salesValuep2 === null ? 0 : data[propertyRTwo][propertySP].salesValuep2
                                            objectTemp['SVP1'] = data[propertyRTwo][propertySP].salesValuep1 === null ? 0 : data[propertyRTwo][propertySP].salesValuep1
                                            objectTemp['SV'] = data[propertyRTwo][propertySP].salesValue === null ? 0 : data[propertyRTwo][propertySP].salesValue
                                            objectTemp['SVP3'] = data[propertyRTwo][propertySP].salesValuep3 === null ? 0 : data[propertyRTwo][propertySP].salesValuep3
                                            objectTemp['SV2'] = data[propertyRTwo][propertySP].salesValue2 === null ? 0 : data[propertyRTwo][propertySP].salesValue2
                                            objectTemp['SV3'] = data[propertyRTwo][propertySP].salesValue3 === null ? 0 : data[propertyRTwo][propertySP].salesValue3
                                            objectTemp['PVP2'] = data[propertyRTwo][propertySP].platesValuep2 === null ? 0 : data[propertyRTwo][propertySP].platesValuep2
                                            objectTemp['PVP1'] = data[propertyRTwo][propertySP].platesValuep1 === null ? 0 : data[propertyRTwo][propertySP].platesValuep1
                                            objectTemp['PV'] = data[propertyRTwo][propertySP].platesValue === null ? 0 : data[propertyRTwo][propertySP].platesValue
                                            objectTemp['PVP3'] = data[propertyRTwo][propertySP].platesValuep3 === null ? 0 : data[propertyRTwo][propertySP].platesValuep3
                                            objectTemp['PV2'] = data[propertyRTwo][propertySP].platesValue2 === null ? 0 : data[propertyRTwo][propertySP].platesValue2
                                            objectTemp['PV3'] = data[propertyRTwo][propertySP].platesValue3 === null ? 0 : data[propertyRTwo][propertySP].platesValue3
                                            objectTemp['PV3'] = data[propertyRTwo][propertySP].platesValue3 === null ? 0 : data[propertyRTwo][propertySP].platesValue3
                                            objectTemp['V1'] = data[propertyRTwo][propertySP].vdvc === null ? 0 : data[propertyRTwo][propertySP].vdvc
                                            objectTemp['V2'] = data[propertyRTwo][propertySP].vdvc3 === null ? 0 : data[propertyRTwo][propertySP].vdvc3
                                            objectTemp['V3'] = data[propertyRTwo][propertySP].vdvc2 === null ? 0 : data[propertyRTwo][propertySP].vdvc2
                                            objectTemp['VC1'] = data[propertyRTwo][propertySP].vdvcp1 === null ? 0 : data[propertyRTwo][propertySP].vdvcp1
                                            objectTemp['VC2'] = data[propertyRTwo][propertySP].vdvcp2 === null ? 0 : data[propertyRTwo][propertySP].vdvcp2
                                            objectTemp['VC3'] = data[propertyRTwo][propertySP].vdvcp3 === null ? 0 : data[propertyRTwo][propertySP].vdvcp3
                                            Array.prototype.push.call(dataSendDetail.value, dataSendTemp)
                                        }
                                        if (dataSalesForecastsAct.app === 'Lexus') {
                                            const dataSendTemp = {
                                                idModel: data[propertyR][propertyC].id,
                                                p1: data[propertyRTwo][propertySP].contracts === null ? 0 : data[propertyRTwo][propertySP].contracts,
                                                p2: data[propertyRTwo][propertySP].salesValue === null ? 0 : data[propertyRTwo][propertySP].salesValue,
                                                p3: data[propertyRTwo][propertySP].platesValue === null ? 0 : data[propertyRTwo][propertySP].platesValue,
                                                s1: data[propertyRTwo][propertySP].salesValue === null ? 0 : data[propertyRTwo][propertySP].vdvc,
                                            }
                                            objectTemp['SVP2'] = data[propertyRTwo][propertySP].salesValuep2 === null ? 0 : data[propertyRTwo][propertySP].salesValuep2
                                            objectTemp['SVP1'] = data[propertyRTwo][propertySP].salesValuep1 === null ? 0 : data[propertyRTwo][propertySP].salesValuep1
                                            objectTemp['SV'] = data[propertyRTwo][propertySP].salesValue === null ? 0 : data[propertyRTwo][propertySP].salesValue
                                            objectTemp['SVP3'] = data[propertyRTwo][propertySP].salesValuep3 === null ? 0 : data[propertyRTwo][propertySP].salesValuep3
                                            objectTemp['SV2'] = data[propertyRTwo][propertySP].salesValue2 === null ? 0 : data[propertyRTwo][propertySP].salesValue2
                                            objectTemp['SV3'] = data[propertyRTwo][propertySP].salesValue3 === null ? 0 : data[propertyRTwo][propertySP].salesValue3
                                            objectTemp['PVP2'] = data[propertyRTwo][propertySP].platesValuep2 === null ? 0 : data[propertyRTwo][propertySP].platesValuep2
                                            objectTemp['PVP1'] = data[propertyRTwo][propertySP].platesValuep1 === null ? 0 : data[propertyRTwo][propertySP].platesValuep1
                                            objectTemp['PV'] = data[propertyRTwo][propertySP].platesValue === null ? 0 : data[propertyRTwo][propertySP].platesValue
                                            objectTemp['PVP3'] = data[propertyRTwo][propertySP].platesValuep3 === null ? 0 : data[propertyRTwo][propertySP].platesValuep3
                                            objectTemp['PV2'] = data[propertyRTwo][propertySP].platesValue2 === null ? 0 : data[propertyRTwo][propertySP].platesValue2
                                            objectTemp['PV3'] = data[propertyRTwo][propertySP].platesValue3 === null ? 0 : data[propertyRTwo][propertySP].platesValue3
                                            Array.prototype.push.call(dataSendDetail.value, dataSendTemp)
                                        }
                                    }
                                }
                            }
                        }
                        dataFinalDetail[typeTemp[propertyT]].push(objectTemp)
                    }
                }

            }
        }
        Array.prototype.push.call(dataResponseDetail.value, dataFinalDetail)
    }
}
const getKey = (item: any) => {
    return Object.keys(item)[0]
}
const getFirstPropertyName = (item: any) => {
    return Object.keys(item)[0]
}
const getModelInput = (itemOne: any, indexR: string) => {
    for (const propertySD in dataSendDetail.value) {
        if (itemOne === parseInt(dataSendDetail.value[propertySD].idModel, 10)) {
            for (const propertySDTwo in dataSendDetail.value[propertySD]) {
                if (propertySDTwo === indexR) {
                    return dataSendDetail.value[propertySD][propertySDTwo]
                }
            }
        }
    }
}
const updateModelInput = (itemOne: any, indexR: string, datoupdate: number) => {
    for (const propertySD in dataSendDetail.value) {
        if (itemOne === parseInt(dataSendDetail.value[propertySD].idModel, 10)) {
            for (const propertySDTwo in dataSendDetail.value[propertySD]) {
                if (propertySDTwo === indexR) {
                    dataSendDetail.value[propertySD][propertySDTwo] = datoupdate
                }
            }
        }
    }
}
const closeModalPvm = async () => {
    if (dataSalesForecastsAct.dataPvm.date === '' || dataSalesForecastsAct.modaPVMButton) {
        dataSalesForecastsAct.stateActionCloseModalPVM = true
        dataSalesForecastsAct.messages.confirmationData.state = true
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.title = '¿Deseja saír sem Gravar?'
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.icon = 'reply'
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.colorIcon = 'red'
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.action = 'send'
    } else {
        dataSalesForecastsAct.modalPVM = false
    }
}
const validationModalPvm = async (action: string) => {
    dataSalesForecastsAct.stateActionSendModalPVM = true
    if (action === 'save') {
        dataSalesForecastsAct.messages.confirmationData.state = true
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.title = '¿Deseja enviar após gravar?'
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.icon = 'outbound'
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.colorIcon = 'blue'
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.action = 'send'
    } else if (action === 'send') {
        dataSalesForecastsAct.messages.confirmationData.state = true
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.title = '¿Tem a certeza que deseja enviar este relatório?'
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.icon = 'outbound'
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.colorIcon = 'blue'
        dataSalesForecastsAct.messages.confirmationData.dataModalAction.action = 'send'
    }
}
const sendReport = async () => {
    dataSalesForecastsAct.dataMessages.loading = true
    try {
        await SalesForecastsApi.pvmSendReport(dataSendDetail.value, dataSalesForecastsAct.idPVM)
        dataSalesForecastsAct.modalDelete = false
        dataSalesForecastsAct.dataMessages.loading = false
        dataSalesForecastsAct.messages.confirmationModal.state = true
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.title = '¡Operação efectuada com sucesso!'
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.icon = 'check_circle_outline'
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.colorIcon = 'green'
        dataSalesForecastsAct.modalPVM = false
        dataInitial()
    } catch (error) {
        dataSalesForecastsAct.dataMessages.loading = false
        dataSalesForecastsAct.messages.confirmationModal.state = true
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.title = 'Ocorreu um erro ao efetuar o pedido'
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.icon = 'close'
        dataSalesForecastsAct.messages.confirmationModal.dataModalAction.colorIcon = 'red'
        dataSalesForecastsAct.modalPVM = false
    }
    dataSalesForecastsAct.modalPVM = false
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
    <div v-if="dataSalesForecastsAct.roles === 'TCAP'">
        <div class="row">
            <div class="col-12 col-md-3" style="width: 200px">
                <q-btn-group push>
                    <q-btn push :label="dataSalesForecastsAct.dataDownloadExcel.oneMonth.title" icon="timeline"
                        style="width: 200px;" color="green-5" flat square @click="downloadExcelComponent(1)" />
                    <q-btn v-if="dataSalesForecastsAct.app === 'Toyota'" push
                        :label="dataSalesForecastsAct.dataDownloadExcel.threeMonths.title" icon="timeline"
                        style="width: 250px;" color="green-5" flat square @click="downloadExcelComponent(3)" />
                </q-btn-group>
            </div>
            <div class="col-12 col-md-3">
            </div>
        </div>
        <div class="row" style="padding-top: 10px;">
            <q-btn-group push>
                <q-btn push :label="dataSalesForecastsAct.dataNovo.frotasSul.title" icon="add_task"
                    style="width: 250px;color:var(--brand-secondary)" flat square @click="newPVM(1)" />
                <q-btn push :label="dataSalesForecastsAct.dataNovo.iMobilizado.title" icon="add_task"
                    style="width: 250px;color:var(--brand-secondary)" flat square @click="newPVM(2)" />
                <q-btn push :label="dataSalesForecastsAct.dataNovo.frotasGaia.title" icon="add_task"
                    style="width: 250px;color:var(--brand-secondary)" flat square @click="newPVM(3)" />
                <q-btn push :label="dataSalesForecastsAct.dataNovo.export.title" icon="add_task"
                    style="width: 250px;color:var(--brand-secondary)" flat square @click="newPVM(4)" />
            </q-btn-group>
        </div>
    </div>
    <div v-if="dataSalesForecastsAct.roles === 'DEALER'">
        <div class="row" style="padding-top: 10px;">
            <q-btn-group push>
                <q-btn push :label="dataSalesForecastsAct.dataNovo.newPVm.title" icon="add_task"
                    style="width: 250px;color:var(--brand-secondary)" flat square @click="newPVM(0)" />
            </q-btn-group>
        </div>
    </div>
    <div class="row q-pa-md" style="padding-top: 10px;">
        <div class="col-12 col-md-12">
            <q-card flat>
                <q-card-section>
                    <q-table flat :rows="dataResponseBoardTwo" :columns="dataSalesForecastsAct.columnsInitial"
                        row-key="name" :rows-per-page-options="[0]" :pagination=dataSalesForecastsAct.table.pagination>
                        <template v-slot:body-cell-action="props">
                            <q-td v-if="props.row.date !== ''" :props="props">
                                <q-btn icon="search" flat round color="amber" @click="optionEdit(props.row)"><q-tooltip
                                        anchor="center right" self="center left" :offset="[10, 10]">
                                        <strong>Consultar Detalhe</strong>
                                    </q-tooltip></q-btn>
                                <q-btn v-if="dataSalesForecastsAct.roles === 'TCAP'" icon="delete" flat round color="red"
                                    @click="optionDelete(props.row)"><q-tooltip anchor="center right" self="center left"
                                        :offset="[10, 10]">
                                        <strong>Devolver</strong>
                                    </q-tooltip></q-btn>
                                <q-btn v-if="dataSalesForecastsAct.roles === 'DEALER'" icon="keyboard_return" flat round
                                    color="red" @click="optionDelete(props.row)"><q-tooltip anchor="center right"
                                        self="center left" :offset="[10, 10]">
                                        <strong>Pedir devolução</strong>
                                    </q-tooltip></q-btn>
                            </q-td>
                            <q-td v-else :props="props">
                                <q-btn icon="search" flat round color="amber" @click="optionEdit(props.row)"><q-tooltip
                                        anchor="center right" self="center left" :offset="[10, 10]">
                                        <strong>Consultar Detalhe</strong>
                                    </q-tooltip></q-btn>
                            </q-td>
                        </template>
                    </q-table>
                    <q-table v-if="dataSalesForecastsAct.roles === 'TCAP'" title="Concessionários em Atraso"
                        :rows="dataResponseBoardOne" :columns="columnsDealers" row-key="name" :rows-per-page-options="[0]"
                        :pagination=dataSalesForecastsAct.table.pagination />
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

    <q-dialog v-model="dataSalesForecastsAct.modalPVM" persistent>
        <q-card :style="{'max-width': dataSalesForecastsAct.size, 'width': dataSalesForecastsAct.size, 'border': '5px solid var(--brand-secondary)' }">
            <q-card-section class="q-py-md shadow-2">
                <div class="q" style="padding-left: 15px;">
                    <div class="q-gutter-md  items-start ">
                        <div class="text-h6 brand-secondary" style="color:var(--brand-secondary)">
                            {{ dataSalesForecastsAct.pageTitles.titleModalPvm }}
                        </div>
                        <q-separator class="background-Secondary"></q-separator>
                        <q-card class="q-ma-md" style="padding-left: 14px;">
                            <q-card-section v-if="dataSalesForecastsAct.app === 'Toyota'">
                                <table style="width: 961px;">
                                    <tr style="background-color: var(--brand-primary);color: var(--brand-secondary)">
                                        <th colspan="2" style="color:white; background-color: white;">0</th>
                                        <th colspan="6">{{ dataSalesForecastsAct.tablePvm.dataHeaderOne[0] }}</th>
                                        <th colspan="6">{{ dataSalesForecastsAct.tablePvm.dataHeaderOne[1] }}</th>
                                        <th v-if="dataSalesForecastsAct.roles === 'DEALER'" colspan="6">{{
                                            dataSalesForecastsAct.tablePvm.dataHeaderOne[2] }}</th>
                                    </tr>
                                    <tr style="background-color: var(--brand-primary);color: var(--brand-secondary)">
                                        <th colspan="2" style="color:white; background-color: white;">0</th>
                                        <th colspan="3">
                                            {{ dataSalesForecastsAct.tablePvm.dataMonths[0] }}
                                        </th>
                                        <th colspan="2">
                                            {{ dataSalesForecastsAct.tablePvm.dataMonths[1] }}
                                        </th>
                                        <th colspan="1">
                                            {{ dataSalesForecastsAct.tablePvm.dataMonths[2] }}
                                        </th>
                                        <th colspan="3">
                                            {{ dataSalesForecastsAct.tablePvm.dataMonths[0] }}
                                        </th>
                                        <th colspan="2">
                                            {{ dataSalesForecastsAct.tablePvm.dataMonths[1] }}
                                        </th>
                                        <th colspan="1">
                                            {{ dataSalesForecastsAct.tablePvm.dataMonths[2] }}
                                        </th>

                                        <th v-if="dataSalesForecastsAct.roles === 'DEALER'" colspan="3">
                                            {{ dataSalesForecastsAct.tablePvm.dataMonths[0] }}
                                        </th>
                                        <th v-if="dataSalesForecastsAct.roles === 'DEALER'" colspan="2">
                                            {{ dataSalesForecastsAct.tablePvm.dataMonths[1] }}
                                        </th>
                                        <th v-if="dataSalesForecastsAct.roles === 'DEALER'" colspan="1">
                                            {{ dataSalesForecastsAct.tablePvm.dataMonths[2] }}
                                        </th>
                                    </tr>
                                    <tr style="background-color: var(--brand-primary);color: var(--brand-secondary)">
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[0] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[1] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[2] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[3] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[4] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[5] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[6] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[7] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[2] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[3] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[4] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[5] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[6] }}</th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[7] }}</th>
                                        <th v-if="dataSalesForecastsAct.roles === 'DEALER'" colspan="1">{{
                                            dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[8] }}</th>
                                        <th v-if="dataSalesForecastsAct.roles === 'DEALER'" colspan="1">{{
                                            dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[9] }}</th>
                                        <th v-if="dataSalesForecastsAct.roles === 'DEALER'" colspan="1">{{
                                            dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[10] }}</th>
                                        <th v-if="dataSalesForecastsAct.roles === 'DEALER'" colspan="1">{{
                                            dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[9] }}</th>
                                        <th v-if="dataSalesForecastsAct.roles === 'DEALER'" colspan="1">{{
                                            dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[10] }}</th>
                                        <th v-if="dataSalesForecastsAct.roles === 'DEALER'" colspan="1">{{
                                            dataSalesForecastsAct.tablePvm.dataHeaderInitialToyota[10] }}</th>
                                    </tr>
                                    <tr v-for="(item, index) in dataResponseDetail" :key="index"
                                        style="color: var(--brand-secondary)">
                                        <td class="tdTable">
                                            <p style="background-color: var(--brand-primary);color: var(--brand-secondary)">
                                                {{ getKey(item) }}
                                            </p>
                                    <tr>
                                        <td style="color: black; background-color: #CAC8E8; width: 133px;">
                                            <b>
                                                Total de
                                            </b>
                                        </td>
                                    </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.name }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr style="width: 49px;">
                                            <td style="width: 133px; color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    {{ getKey(item) }}
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.SVP2 }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.SVP1 }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 's1', $event.target.value)"
                                                :value="getModelInput(entry.id, 's1')"
                                                style="width: 49px;margin-bottom: 10px;">
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.SVP3 }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 's2', $event.target.value)"
                                                :value="getModelInput(entry.id, 's2')"
                                                style="width: 49px;margin-bottom: 10px;">
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 's3', $event.target.value)"
                                                :value="getModelInput(entry.id, 's3')"
                                                style="width: 49px;margin-bottom: 10px;">
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.PVP2 }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.PVP1 }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 'p1', $event.target.value)"
                                                :value="getModelInput(entry.id, 'p1')"
                                                style="width: 49px;margin-bottom: 10px;">
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.PVP3 }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 'p2', $event.target.value)"
                                                :value="getModelInput(entry.id, 'p2')"
                                                style="width: 49px;margin-bottom: 10px;">
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="ptm-data-odd" style="width: 49px;">
                                        <span class="ptm-data-odd"
                                            v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 'p3', $event.target.value)"
                                                :value="getModelInput(entry.id, 'p3')"
                                                style="width: 49px;margin-bottom: 10px;">
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>
                                        </tr>
                                    </td>
                                    <td v-if="dataSalesForecastsAct.roles === 'DEALER'" class="tdTable"
                                        style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.VC1 }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>
                                        </tr>
                                    </td>
                                    <td v-if="dataSalesForecastsAct.roles === 'DEALER'" class="tdTable"
                                        style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.VC2 }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>
                                        </tr>
                                    </td>
                                    <td v-if="dataSalesForecastsAct.roles === 'DEALER'" class="ptm-data-odd"
                                        style="width: 49px;">
                                        <span class="ptm-data-odd"
                                            v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 'v1', $event.target.value)"
                                                :value="getModelInput(entry.id, 'v1')"
                                                style="width: 49px;margin-bottom: 10px;">
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>
                                        </tr>
                                    </td>
                                    <td v-if="dataSalesForecastsAct.roles === 'DEALER'" class="tdTable"
                                        style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.VC3 }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>
                                        </tr>
                                    </td>
                                    <td v-if="dataSalesForecastsAct.roles === 'DEALER'" class="ptm-data-odd"
                                        style="width: 49px;">
                                        <span class="ptm-data-odd"
                                            v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 'v2', $event.target.value)"
                                                :value="getModelInput(entry.id, 'v2')"
                                                style="width: 49px;margin-bottom: 10px;">
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>
                                        </tr>
                                    </td>
                                    <td v-if="dataSalesForecastsAct.roles === 'DEALER'" class="ptm-data-odd"
                                        style="width: 49px;">
                                        <span class="ptm-data-odd"
                                            v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 'v3', $event.target.value)"
                                                :value="getModelInput(entry.id, 'v3')"
                                                style="width: 49px;margin-bottom: 10px;">
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>
                                        </tr>
                                    </td>
                                    </tr>
                                </table>
                            </q-card-section>
                            <q-card-section v-if="dataSalesForecastsAct.app === 'Lexus'">
                                <table style="width: 961px;" align="center">
                                    <tr v-if="dataSalesForecastsAct.roles === 'TCAP'"
                                        style="background-color: var(--brand-primary);color: var(--brand-secondary)">
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusTcap[0] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusTcap[1] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusTcap[2] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusTcap[3] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusTcap[4] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusTcap[5] }}
                                        </th>
                                    </tr>
                                    <tr v-if="dataSalesForecastsAct.roles === 'DEALER'"
                                        style="background-color: var(--brand-primary);color: var(--brand-secondary)">
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusDealer[0] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusDealer[1] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusDealer[2] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusDealer[3] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusDealer[4] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusDealer[5] }}
                                        </th>
                                        <th colspan="1">{{ dataSalesForecastsAct.tablePvm.dataHeaderInitialLexusDealer[6] }}
                                        </th>
                                    </tr>
                                    <tr v-for="(item, index) in dataResponseDetail" :key="index"
                                        style="color: var(--brand-secondary)">
                                        <td class="tdTable">
                                            <p style="background-color: var(--brand-primary);color: var(--brand-secondary)">
                                                {{ getKey(item) }}
                                            </p>
                                            <tr>
                                        <td style="color: black; background-color: #CAC8E8; width: 212px;">
                                            <b>
                                                Total de
                                            </b>
                                        </td>
                                    </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                            <p class="pTable">
                                                {{ entry.name }}
                                            </p>
                                            <br />
                                        </span>
                                        <tr style="width: 49px;">
                                            <td style="width: 212px; color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    {{ getKey(item) }}
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 'p1', $event.target.value)"
                                                :value="getModelInput(entry.id, 'p1')"
                                                style="width: 49px;margin-bottom: 10px;">
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable"
                                                style="width: 180px;color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                        style="height: 1px;padding-bottom: 10px;">
                                        <input @input="updateModelInput(entry.id, 'p2', $event.target.value)"
                                        :value="getModelInput(entry.id, 'p2')"
                                        style="width: 49px;margin-bottom: 10px;">
                                        <br />
                                    </span>
                                    <tr>
                                        <td class="tdTable"
                                        style="width: 180px;color: black; background-color: #CAC8E8 ">
                                        <b style="color: black">
                                            0
                                        </b>
                                    </td>
                                    
                                </tr>
                            </td>
                            <td class="tdTable">
                                <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index">
                                    <p class="pTable">
                                        {{ entry.PVP3 }}
                                    </p>
                                    <br />
                                </span>
                                <tr>
                                    <td class="tdTable"
                                        style="width: 180px; color: black; background-color: #CAC8E8 ">
                                        <b style="color: black">
                                            0
                                        </b>
                                    </td>

                                </tr>
                            </td>
                                    <td class="tdTable" style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px;">
                                            <input @input="updateModelInput(entry.id, 'p3', $event.target.value)"
                                                :value="getModelInput(entry.id, 'p3')"
                                                style="width: 49px;margin-bottom: 10px;">
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable"
                                                style="width: 180px;color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>
                                        </tr>
                                    </td>
                                    <td v-if="dataSalesForecastsAct.roles === 'DEALER'" class="tdTable"
                                        style="width: 49px;">
                                        <span v-for="(entry, index) in item[getFirstPropertyName(item)]" :key="index"
                                            style="height: 1px;padding-bottom: 10px; cursor:pointer">
                                            <input @input="updateModelInput(entry.id, 's1', $event.target.value)"
                                                :value="getModelInput(entry.id, 's1')"
                                                style="width: 49px;margin-bottom: 10px;">
                                            <br />
                                        </span>
                                        <tr>
                                            <td class="tdTable" style="color: black; background-color: #CAC8E8 ">
                                                <b style="color: black">
                                                    0
                                                </b>
                                            </td>

                                        </tr>
                                    </td>

                                    </tr>
                                </table>
                            </q-card-section>
                        </q-card>
                        {{ dataSalesForecastsAct.pageTitles.captionModalPvmFinal }}
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
                        width: 80px;" @click="closeModalPvm"
                    :label="dataSalesForecastsAct.pageTitles.buttons.return"><img :src="mistakeImg" style="
                          transform: translateY(-55%);
                          position: absolute;
                          left: 1px;
                          top: 60%;
                        " />
                </q-btn>
                <q-btn v-if="dataSalesForecastsAct.dataPvm.date === '' || dataSalesForecastsAct.modaPVMButton"
                    @click="validationModalPvm('save')" style="
                        border: 1px; border-style: solid; border-color:var(--brand-secondary);
                        font-size: 12px;
                        padding-left: 22px;
                        padding-right: 8px;
                        padding-top: 5px;" :label="dataSalesForecastsAct.pageTitles.buttons.modalPVM.save"><img
                        :src="diskImg" style="
                          transform: translateY(-55%);
                          position: absolute;
                          left: 2px;
                          top: 60%;
                        " />
                </q-btn>
                <q-btn v-if="dataSalesForecastsAct.dataPvm.date === '' || dataSalesForecastsAct.modaPVMButton"
                    @click="validationModalPvm('send')" style="
                        border: 1px; border-style: solid; border-color:var(--brand-secondary);
                        font-size: 12px;
                        padding-left: 22px;
                        padding-right: 8px;
                        padding-top: 5px;" :label="dataSalesForecastsAct.pageTitles.buttons.modalPVM.send"><img
                        :src="addImg" style="
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
    @update-state-confirmation="updateStateConfirmationModel"> </messages></template>
