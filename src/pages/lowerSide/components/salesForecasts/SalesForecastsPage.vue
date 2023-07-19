<script setup lang="ts">
import { reactive, toRef } from 'vue'
import downImg from 'src/assets/images/down.gif'
import upImg from 'src/assets/images/up.gif'
import iconSearch from 'src/assets/images/icon_search.gif'

interface Props {
    dataLowerSidePage: {
        [x: string]: any;
        type: object,
        required: true
    },
}
const props = defineProps<Props>()
const dataSalesForecasts = toRef(props, 'dataLowerSidePage')
const formatterM = new Intl.DateTimeFormat('pt-PT', { month: 'long' })
const monthActual = formatterM.format(new Date())
const dataSalesForecastsAct = reactive({
    yearActual: '',
    imgFilter: downImg,
    showFilterComponent: true
})
const formatterY = new Intl.DateTimeFormat('pt-PT', { year: 'numeric' })
dataSalesForecastsAct.yearActual = formatterY.format(new Date())

const columnsInitial = [
    { name: 'calories', align: 'center', label: '#', field: 'calories' },
    { name: 'fat', label: 'Cod', field: 'fat' },
    { name: 'carbs', label: 'Concessionário', field: 'carbs' },
    { name: 'protein', label: 'Área', field: 'protein' },
    { name: 'sodium', label: 'Data Disponibilização	 ', field: 'sodium' }
]
const columnsDealers = [
    { name: 'calories', align: 'center', field: 'calories' },
    { name: 'fat', field: 'fat' },
    { name: 'carbs', field: 'carbs' },
    { name: 'protein', field: 'protein' },
    { name: 'sodium', field: 'sodium' }
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
                <div class="col-2">{{ props.dataLowerSidePage.pageTitles.year }}</div>
                <div class="col-2" style="padding-left: 30px;">{{ props.dataLowerSidePage.pageTitles.month }}</div>
            </div>

            <div class="row">
                <div class="col-2">
                    <q-select style="width: 200px;" outlined v-model="dataSalesForecastsAct.yearActual"
                        :options="props.dataLowerSidePage.dataSelect.years" label="Select Year" />

                </div>
                <div class="col-2" style="padding-left: 30px;">
                    <q-select style="width: 200px;" outlined v-model="monthActual"
                        :options="props.dataLowerSidePage.dataSelect.months" label="Select Mont" />
                </div>
                <div class="col-3" style="padding-left: 50px; padding-top: 12px;">
                    <q-btn style="
                    border: 1px; border-style: solid; border-color:var(--brand-secondary);
                    font-size: 12px;
                    padding-left: 18px;
                    padding-right: 8px;
                    padding-top: 5px;
                  " @click="downloadExcel(1)" label="Pesquisar"><img :src="iconSearch" style="
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
                <q-btn push :label="props.dataLowerSidePage.dataDownloadExcel.oneMonth.title" icon="timeline"
                    style="width: 200px;" color="green-5" flat square />
                <q-btn push :label="props.dataLowerSidePage.dataDownloadExcel.threeMonths.title" icon="timeline"
                    style="width: 250px;" color="green-5" flat square />
            </q-btn-group>
        </div>
        <div class="col-12 col-md-3">
        </div>
    </div>
    <div class="row" style="padding-top: 10px;">
        <q-btn-group push>
            <q-btn push :label="props.dataLowerSidePage.dataNovo.frotasSul.title" icon="add_task"
                style="width: 250px;color:var(--brand-secondary)" flat square />
            <q-btn push :label="props.dataLowerSidePage.dataNovo.iMobilizado.title" icon="add_task"
                style="width: 250px;color:var(--brand-secondary)" flat square />
            <q-btn push :label="props.dataLowerSidePage.dataNovo.frotasGaia.title" icon="add_task"
                style="width: 250px;color:var(--brand-secondary)" flat square />
            <q-btn push :label="props.dataLowerSidePage.dataNovo.export.title" icon="add_task"
                style="width: 250px;color:var(--brand-secondary)" flat square />
        </q-btn-group>
    </div>
    <div class="row q-pa-md" style="padding-top: 10px;">
        <div class="col-12 col-md-12">
            <q-card flat>
                <q-card-section>
                    <q-table flat :rows="rows" :columns="columnsInitial" row-key="name" />
                </q-card-section>
            </q-card>
        </div>
    </div>
    <div class="row q-pa-md" style="padding-top: 10px;">
        <div class="col-12 col-md-12">
            <q-card flat>
                <q-card-section>
                    <q-table title="Concessionários em Atraso" :rows="rows" :columns="columnsDealers" row-key="name" />
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>
