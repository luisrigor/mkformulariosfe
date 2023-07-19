<script setup lang="ts">
import { reactive, ref, toRef, onMounted } from 'vue';
import addImg from 'src/assets/images/add.gif'
import mistakeImg from 'src/assets/images/mistake.png'
import diskImg from 'src/assets/images/disk.png'
import ModelApi from './ModelApi'
// import HttpService from '../../../shared/services/HttpService'
import { ModelSendType } from './interfaces/Model';

interface Props {
    dataLowerSidePage: {
        [x: string]: any;
        type: object,
        required: true
    },
}
const props = defineProps<Props>()
const dataModel = toRef(props, 'dataLowerSidePage')
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
                selectType: "Selecione o tipo 12"

            }
        },
        dataSelectType: [],
        dataForm: {
            model: ref<string>(''),
            type: '',
            otherTypeOption: false,
            otherType: '',
            sinceDate: '',
            tillDate: ''
        }
    },
    formNew: false,
    showFilterComponent: true,
    sendDataModel: ref<ModelSendType>()

})
const columnsModels = [
    { name: 'calories', align: 'center', label: 'Modelo', field: 'calories' },
    { name: 'fat', label: 'Tipo', field: 'fat' },
    { name: 'carbs', label: 'Ativo deste', field: 'carbs' },
    { name: 'protein', label: 'Ativo até', field: 'protein' },
    { name: 'sodium', label: 'Ordem exportação', field: 'sodium' }
]
const dataModelService = async () => {
    dataModelAct.sendDataModel.idModel = -1
    dataModelAct.sendDataModel.isDetail = false
    dataModelAct.sendDataModel.year = 2022
    // try {
    //     const response = await ModelApi.pvmModel()

    // } catch (error) {

    // }
}
onMounted(() => {
    console.log('MOdelPage')
    dataModelService()
}) 
</script>
<template>
    <q-btn
        style="border: 1px; border-style: solid; border-color:var(--brand-secondary);font-size: 12px; padding-left: 18px;padding-right: 8px;padding-top: 5px;"
        @click="dataModelAct.formNew = true" label="Novo Modelo"><img :src="addImg" style="transform: translateY(-55%);position: absolute;left: 1px;top: 50%;
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
                                <div>&nbsp;</div>
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
                                            <div class="col-6">{{ dataModelAct.dataModel.pageTitles.since }}
                                                <div class="row">
                                                    <div class="col-6">
                                                        <q-input v-model="dataModelAct.dataModel.dataForm.otherType"
                                                            style="padding-right: 5px; border-color:var(--brand-secondary);"
                                                            dense outlined maxlength="100" hint-color="orange"
                                                            label-color="var(--brand-secondary)"
                                                            color="var(--brand-secondary)"></q-input>
                                                    </div>
                                                    <div class="col-6">
                                                        <q-btn icon="event" round color="primary">
                                                            <q-popup-proxy @before-show="updateProxy" cover
                                                                transition-show="scale" transition-hide="scale">
                                                                <q-date v-model="dataModelAct.dataModel.dataForm.sinceDate"
                                                                    today-btn>
                                                                    <div class="row items-center justify-end q-gutter-sm">
                                                                        <q-btn label="Cancel" color="primary" flat
                                                                            v-close-popup />
                                                                        <q-btn label="OK" color="primary" flat @click="save"
                                                                            v-close-popup />
                                                                    </div>
                                                                </q-date>
                                                            </q-popup-proxy>
                                                        </q-btn>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-6">{{ dataModelAct.dataModel.pageTitles.till }}
                                                <div class="row">
                                                    <div class="col-6">
                                                        <q-input v-model="dataModelAct.dataModel.dataForm.otherType"
                                                            style="padding-right: 5px; border-color:var(--brand-secondary);"
                                                            dense outlined maxlength="100" hint-color="orange"
                                                            label-color="var(--brand-secondary)"
                                                            color="var(--brand-secondary)"></q-input>
                                                    </div>
                                                    <div class="col-6">
                                                        <q-btn icon="event" round color="primary">
                                                            <q-popup-proxy @before-show="updateProxy" cover
                                                                transition-show="scale" transition-hide="scale">
                                                                <q-date v-model="dataModelAct.dataModel.dataForm.tillDate"
                                                                    today-btn>
                                                                    <div class="row items-center justify-end q-gutter-sm">
                                                                        <q-btn label="Cancel" color="primary" flat
                                                                            v-close-popup />
                                                                        <q-btn label="OK" color="primary" flat @click="save"
                                                                            v-close-popup />
                                                                    </div>
                                                                </q-date>
                                                            </q-popup-proxy>
                                                        </q-btn>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row text-h7" style="color: var(--brand-secondary);">
                                            <div class="col-6">{{ dataModelAct.dataModel.pageTitles.order }}
                                                <q-input v-model="dataModelAct.dataModel.dataForm.otherType"
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
                <q-btn style="
                        border: 1px; border-style: solid; border-color:var(--brand-secondary);
                        font-size: 12px;
                        padding-left: 22px;
                        padding-right: 8px;
                        padding-top: 5px;
                      " @click="dataModelAct.formNew = true"
                    :label="dataModelAct.dataModel.pageTitles.buttons.save"><img :src="diskImg" style="
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
                <q-card-section>
                    <q-table flat :rows="rows" :columns="columnsModels" row-key="name" />
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>