import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue';

export const useDataOptions = defineStore('dataOptions', () => {
    const dataOptionsStore = reactive({
        tempYear: ref<number>(2014),
        yearActual: ref<string>(''),
        monthActual: ref<string>(''),
        dataSelect: {
            years: [],
            months: []
        },


    })
    const formatterY = new Intl.DateTimeFormat('pt-PT', { year: 'numeric' })
    dataOptionsStore.yearActual = formatterY.format(new Date())
    const formatterM = new Intl.DateTimeFormat('pt-PT', { month: 'long' })
    dataOptionsStore.monthActual = formatterM.format(new Date())
    const generateDataSelect = async () => {
        let tempNum = 0
        const date = new Date()
        let tempYearActual = parseInt(dataOptionsStore.yearActual, 10)
        while (dataOptionsStore.tempYear <= tempYearActual) {
            dataOptionsStore.dataSelect.years.push(tempYearActual.toString())
            tempYearActual--
            tempNum++
        }
        tempNum = 0
        while (tempNum < 12) {
            date.setMonth(tempNum)
            dataOptionsStore.dataSelect.months[tempNum] = date.toLocaleString('pt-PT', { month: 'long' })
            tempNum++
        }
        date.toLocaleString('pt-PT', { year: 'numeric' })

    }
    generateDataSelect()
    return {
        // State Properties
        dataOptionsStore,
        // Getters
        // // userAsing: computed(() => user.value * user.value),
        // Actions
        // asingListDealer: () => asingListDealerBy({ uno: 1 }),
        generateDataSelect

    }
});
