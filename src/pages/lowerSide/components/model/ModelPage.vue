<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import addImg from 'src/assets/images/add.gif'
import mistakeImg from 'src/assets/images/mistake.png'
import diskImg from 'src/assets/images/disk.png'
import ModelApi from './ModelApi'

import Messages from '../../../modalMessages/MessagesPage.vue'
const dataModelAct = reactive({
    dataModel: {
        pageTitles: {
            model: 'Modelo*',
            type: 'Tipo*',
            since: 'Ativo deste*',
            till: '	Ativo até',
            order: 'Ordem Exportação*',
            titleNewType: 'Por favor introduza um tipo',
            buttons: {
                newType: 'Novo Tipo',
                return: 'Voltar',
                save: 'Grabar Modelo'
            },
            label: {
                selectType: 'Selecione o tipo 12'

            }
        },
        dataSelectType: [],
        dataTypeSelect: [],
        dataForm: {
            model: '',
            type: '',
            otherTypeOption: false,
            otherType: '',
            sinceDate: '',
            tillDate: '',
            exportOrder: 0

        },
        dataSendFinal: {
            from: '',
            model: '',
            order: 0,
            to: '',
            type: ''
        },
        idModel: 0
    },
    formNew: false,
    showFilterComponent: true,
    sendDataModel: {
        idModel: 0,
        isDetail: false,
        year: 0,
    },
    dataResponseTemp: [],
    table: {
        pagination: { rowsPerPage: 0 },
        noData: ''
    },
    dataMessages: {
        loading: false
    },
    dataDate: {
        since: {
            dateSince: '',
            mask: '####-##-##'
        },
        till: {
            dateTill: '',
            mask: '####-##-##'

        }
    },
    skeletonTable: false,
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
        messagesOneEmpty: '-O campo Modelo é de preenchimento obrigatório!\n-O campo Tipo é de preenchimento obrigatório!\n-O campo Ativo deste é de preenchimento obrigatório!\n-O campo Ordem Exportação é de preenchimento obrigatório!\n',
    }
})
const dataResponse = ref([])
const dataModelService = async () => {

    dataModelAct.skeletonTable = true
    dataModelAct.sendDataModel.idModel = -1
    dataModelAct.sendDataModel.isDetail = false
    dataModelAct.sendDataModel.year = 2022
    dataModelAct.dataMessages.loading = true
    try {
        dataModelAct.dataResponseTemp = await ModelApi.pvmModel(dataModelAct.sendDataModel)
        if (dataModelAct.dataResponseTemp.car.length > 0) {
            for (const propertyL in dataModelAct.dataResponseTemp.car) {
                if (!dataModelAct.dataModel.dataTypeSelect.includes(dataModelAct.dataResponseTemp.car[propertyL].type)) {
                    Array.prototype.push.call(dataModelAct.dataModel.dataTypeSelect, dataModelAct.dataResponseTemp.car[propertyL].type)
                }
                Array.prototype.push.call(dataResponse.value, dataModelAct.dataResponseTemp.car[propertyL])
            }
        }
    } catch (error) {
        dataModelAct.table.noData = 'Não há Modelos A Processar'
    }
    dataModelAct.dataMessages.loading = false
    dataModelAct.skeletonTable = false
}
const columnsModels = [
    { name: 'modelo', align: 'center', label: 'Modelo', field: (dataResponse: { name: string }) => dataResponse.name },
    { name: 'tipo', label: 'Tipo', field: (dataResponse: { type: string }) => dataResponse.type },
    { name: 'activeSince', label: 'Ativo deste', field: (dataResponse: { dtFrom: string }) => dataResponse.dtFrom },
    { name: 'activeUntil', label: 'Ativo até', field: (dataResponse: { dtTo: string }) => dataResponse.dtTo },
    { name: 'exportOrder', label: 'Ordem exportação', field: (dataResponse: { exportOrder: string }) => dataResponse.exportOrder },
    {
        name: 'action',
        align: 'center',
        field: ''
    }
]
const optionEdit = async (data: any) => {
    dataModelAct.dataModel.dataForm.otherTypeOption = false
    dataModelAct.dataModel.dataForm.type = data.type
    dataModelAct.dataModel.idModel = data.id
    dataModelAct.dataModel.dataForm.model = data.name
    dataModelAct.dataModel.dataForm.sinceDate = data.dtFrom
    dataModelAct.dataModel.dataForm.tillDate = data.dtTo
    dataModelAct.dataModel.dataForm.exportOrder = data.exportOrder
    dataModelAct.formNew = true
}
const updateProxySince = async () => {

    dataModelAct.dataDate.since.dateSince = dataModelAct.dataModel.dataForm.sinceDate
    dataModelAct.dataModel.dataForm.sinceDate = dataModelAct.dataDate.since.dateSince
}
const saveSince = async () => {
    dataModelAct.dataDate.since.dateSince = dataModelAct.dataModel.dataForm.sinceDate
}
const updateProxyTill = async () => {

    dataModelAct.dataDate.till.dateTill = dataModelAct.dataModel.dataForm.tillDate
    dataModelAct.dataModel.dataForm.tillDate = dataModelAct.dataDate.till.dateTill
}
const saveTill = async () => {
    dataModelAct.dataDate.till.dateTill = dataModelAct.dataModel.dataForm.tillDate
}
const openNewModel = async () => {
    dataModelAct.dataModel.idModel = 0
    dataModelAct.dataModel.dataForm.model = ''
    dataModelAct.dataModel.dataForm.type = ''
    dataModelAct.dataModel.dataForm.otherTypeOption = false
    dataModelAct.dataModel.dataForm.otherType = ''
    dataModelAct.dataModel.dataForm.sinceDate = ''
    dataModelAct.dataModel.dataForm.tillDate = ''
    dataModelAct.dataModel.dataForm.exportOrder = 0
    dataModelAct.formNew = true
}
const optionSend = async () => {
    dataModelAct.messages.confirmationData.state = true
    dataModelAct.messages.confirmationData.dataModalAction.title = '¿Tem certeza de que deseja salvar o modelo?'
    dataModelAct.messages.confirmationData.dataModalAction.icon = 'outbound'
    dataModelAct.messages.confirmationData.dataModalAction.colorIcon = 'blue'
    dataModelAct.messages.confirmationData.dataModalAction.action = 'send'
}
const saveModel = async () => {
    dataModelAct.dataModel.dataSendFinal.model = dataModelAct.dataModel.dataForm.model
    dataModelAct.dataModel.dataSendFinal.order = dataModelAct.dataModel.dataForm.exportOrder
    dataModelAct.dataModel.dataSendFinal.to = dataModelAct.dataModel.dataForm.tillDate
    dataModelAct.dataModel.dataSendFinal.from = dataModelAct.dataModel.dataForm.sinceDate
    dataModelAct.dataModel.dataSendFinal.type = dataModelAct.dataModel.dataForm.type !== '' ? dataModelAct.dataModel.dataForm.type : dataModelAct.dataModel.dataForm.otherType
    try {
        await ModelApi.pvmNewModel(dataModelAct.dataModel.dataSendFinal, dataModelAct.dataModel.idModel)
        dataResponse.value.length = 0
        dataModelService()
        dataModelAct.formNew = false
    } catch (error) {
        console.log('error', error)
    }
}
const validateDataModelSend = async () => {
    if ((dataModelAct.dataModel.dataForm.model === '' || dataModelAct.dataModel.dataForm.sinceDate === '' || dataModelAct.dataModel.dataForm.exportOrder === 0) ||
        (dataModelAct.dataModel.dataForm.type === '' && dataModelAct.dataModel.dataForm.otherType === '')
    ) {
        dataModelAct.messages.confirmationModal.state = true
        dataModelAct.messages.confirmationModal.dataModalAction.title = dataModelAct.messagesError.titleDataEmpty
        dataModelAct.messages.confirmationModal.dataModalAction.data = dataModelAct.messagesError.messagesOneEmpty
        dataModelAct.messages.confirmationModal.dataModalAction.icon = 'warning_amber'
        dataModelAct.messages.confirmationModal.dataModalAction.colorIcon = 'amber'
    } else {
        optionSend()
    }
}
const updateStateConfirmationModel = async (data: object) => {
    if (data.selectionSend === 'close') {
        dataModelAct.messages.confirmationData.state = false
    } else if (data.selectionSend === 'check') {
        dataModelAct.messages.confirmationData.state = false
        saveModel()
        dataModelAct.dataMessages.loading = true
    } else if (data.selectionSend === 'success') {
        dataModelAct.messages.confirmationModal.state = false
    }
}
onMounted(() => {
    dataModelService()
}) 
</script>
<template>
    <q-btn
        style="border: 1px; border-style: solid; border-color:var(--brand-secondary);font-size: 12px; padding-left: 18px;padding-right: 8px;padding-top: 5px;"
        @click="openNewModel" label="Novo Modelo"><img :src="addImg" style="transform: translateY(-55%);position: absolute;left: 1px;top: 50%;
                        " />
    </q-btn>
    <q-dialog v-model="dataModelAct.formNew" persistent>
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
                                        Novo Modelo
                                    </b>
                                </div>
                                <q-separator class="background-Secondary" inset></q-separator>
                                <div >&nbsp;</div>
                                <div class="background-Primary"
                                    style="border: 2px; border-style: solid; border-color:var(--brand-secondary);">
                                    <span class="text-h7" style="padding-left: 5px; color: var(--brand-secondary);">
                                        Inserir Modelos
                                    </span>
                                    <div class="bg-white q-pa-md example-row-column-width"
                                        v-if="dataModelAct.showFilterComponent">
                                        <div class="row text-h7" style="color: var(--brand-secondary);">
                                            <div class="col-5">{{ dataModelAct.dataModel.pageTitles.model }}</div>
                                            <div class="col-7">{{ dataModelAct.dataModel.pageTitles.type }}</div>
                                        </div>

                                        <div class="row">
                                            <div class="col-5 ">
                                                <q-input class="q-xs" v-model="dataModelAct.dataModel.dataForm.model"
                                                    style="padding-right: 5px;" outlined dense>
                                                </q-input>
                                            </div>
                                            <div class="col-3">
                                                <q-select style="width: 200px;" outlined
                                                    v-model="dataModelAct.dataModel.dataForm.type"
                                                    :options="dataModelAct.dataModel.dataTypeSelect"
                                                    :label="dataModelAct.dataModel.pageTitles.label.selectType"
                                                    :disable="dataModelAct.dataModel.dataForm.otherTypeOption" dense />
                                            </div>
                                            <div class="col-4">
                                                <div class="row">
                                                    <div class="col-12 col-md-5">
                                                        <q-checkbox
                                                            v-model="dataModelAct.dataModel.dataForm.otherTypeOption"
                                                            style="padding-left: 15px;color: var(--brand-secondary);"
                                                            :label="dataModelAct.dataModel.pageTitles.buttons.newType" dense
                                                            @click="dataModelAct.dataModel.dataForm.otherType = '', dataModelAct.dataModel.dataForm.type = ''" />
                                                    </div>
                                                    <div class="col-12 col-md-7">
                                                        <q-input v-if="dataModelAct.dataModel.dataForm.otherTypeOption"
                                                            v-model="dataModelAct.dataModel.dataForm.otherType"
                                                            style="padding-right: 5px; border-color:var(--brand-secondary);"
                                                            dense outlined maxlength="100" hint-color="orange"
                                                            label-color="var(--brand-secondary)"
                                                            color="var(--brand-secondary)"
                                                            :hint="dataModelAct.dataModel.pageTitles.titleNewType"></q-input>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row text-h7" style="color: var(--brand-secondary);">
                                            <div class="col-5">{{ dataModelAct.dataModel.pageTitles.since }}
                                                <div class="row">
                                                    <div class="col-6">
                                                        <q-input v-model="dataModelAct.dataModel.dataForm.sinceDate"
                                                            style="padding-right: 5px; border-color:var(--brand-secondary);"
                                                            dense outlined maxlength="100" hint-color="orange"
                                                            label-color="var(--brand-secondary)"
                                                            color="var(--brand-secondary)"
                                                            :mask="dataModelAct.dataDate.since.mask"></q-input>
                                                    </div>
                                                    <div class="col-6">
                                                        <q-btn icon="event" round color="primary">
                                                            <q-popup-proxy @before-show="updateProxySince" cover
                                                                transition-show="scale" transition-hide="scale">
                                                                <q-date v-model="dataModelAct.dataModel.dataForm.sinceDate"
                                                                    mask="YYYY-MM-DD" today-btn>
                                                                    <div class="row items-center justify-end q-gutter-sm">
                                                                        <q-btn label="Cancel" color="primary" flat
                                                                            v-close-popup />
                                                                        <q-btn label="OK" color="primary" flat
                                                                            @click="saveSince" v-close-popup />
                                                                    </div>
                                                                </q-date>
                                                            </q-popup-proxy>
                                                        </q-btn>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-5">{{ dataModelAct.dataModel.pageTitles.till }}
                                                <div class="row">
                                                    <div class="col-6">
                                                        <q-input v-model="dataModelAct.dataModel.dataForm.tillDate"
                                                            style="padding-right: 5px; border-color:var(--brand-secondary);"
                                                            dense outlined maxlength="100" hint-color="orange"
                                                            label-color="var(--brand-secondary)"
                                                            color="var(--brand-secondary)"
                                                            :mask="dataModelAct.dataDate.till.mask"></q-input>
                                                    </div>
                                                    <div class="col-6">
                                                        <q-btn icon="event" round color="primary">
                                                            <q-popup-proxy @before-show="updateProxyTill" cover
                                                                transition-show="scale" transition-hide="scale">
                                                                <q-date v-model="dataModelAct.dataModel.dataForm.tillDate"
                                                                    mask="YYYY-MM-DD" today-btn>
                                                                    <div class="row items-center justify-end q-gutter-sm">
                                                                        <q-btn label="Cancel" color="primary" flat
                                                                            v-close-popup />
                                                                        <q-btn label="OK" color="primary" flat
                                                                            @click="saveTill" v-close-popup />
                                                                    </div>
                                                                </q-date>
                                                            </q-popup-proxy>
                                                        </q-btn>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row text-h7" style="color: var(--brand-secondary);">
                                            <div class="col-2">{{ dataModelAct.dataModel.pageTitles.order }}
                                                <q-input v-model="dataModelAct.dataModel.dataForm.exportOrder"
                                                    style="padding-right: 5px; border-color:var(--brand-secondary);" dense
                                                    outlined maxlength="100" hint-color="orange"
                                                    label-color="var(--brand-secondary)"
                                                    color="var(--brand-secondary)"></q-input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                        width: 80px;
                      " @click="dataModelAct.formNew = false"
                    :label="dataModelAct.dataModel.pageTitles.buttons.return"><img :src="mistakeImg" style="
                          transform: translateY(-55%);
                          position: absolute;
                          left: 1px;
                          top: 60%;
                        " />
                </q-btn>
                <q-btn @click="validateDataModelSend" style="
                        border: 1px; border-style: solid; border-color:var(--brand-secondary);
                        font-size: 12px;
                        padding-left: 22px;
                        padding-right: 8px;
                        padding-top: 5px;" :label="dataModelAct.dataModel.pageTitles.buttons.save"><img :src="diskImg"
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
    <div class="row q-pa-md" style="padding-top: 10px;">
        <div class="col-12 col-md-12">
            <q-card flat>
                <q-card-section v-if="dataModelAct.skeletonTable">
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
                <q-card-section v-if="!dataModelAct.skeletonTable">
                    <q-table :rows="dataResponse" :columns="columnsModels" row-key="name" :rows-per-page-options="[0]"
                        :pagination=dataModelAct.table.pagination :no-data-label="dataModelAct.table.noData">
                        <template #body-cell-action="props">
                            <q-td :props="props">
                                <q-btn icon="edit" dense flat round color="amber" @click="optionEdit(props.row)"><q-tooltip
                                        anchor="center right" self="center left" :offset="[10, 10]">
                                        <strong>Editar</strong>
                                    </q-tooltip></q-btn>
                            </q-td>
                        </template>
                    </q-table>
                </q-card-section>
            </q-card>
        </div>
    </div>
    <messages :loading="dataModelAct.dataMessages.loading" :confirmationData="dataModelAct.messages.confirmationData"
        :confirmationModal="dataModelAct.messages.confirmationModal"
        @update-state-confirmation="updateStateConfirmationModel"> </messages>
</template>
