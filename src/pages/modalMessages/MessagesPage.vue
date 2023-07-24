<script setup lang="ts">
import { ref, toRef, watch } from 'vue'

interface Props {
    loading: {
        type: boolean,
        default: false
    },
    confirmationData?: {
        state: {
            type: boolean,
            default: false
        },
        dataModalAction: {
            title: string,
            icon: string,
            colorIcon: string,
            action: string
        }
    },
    confirmationModal?: {
        state: {
            type: boolean,
            default: false
        },
        dataModalAction: {
            title: string,
            data: '',
            icon: string,
            colorIcon: string
        }
    }

}

const emit = defineEmits(['updateStateConfirmation'])
const props = defineProps<Props>()
const visible = ref(true)
const loadingComponent = toRef(props, 'loading')
const optionsModalComponent = toRef(props, 'confirmationData')
const stateModalDataComponent = ref(false)

const modalSuccessComponent = toRef(props, 'confirmationModal')
const stateModalComponent = ref(false)

watch(() => optionsModalComponent.value?.state, () => {
    stateModalDataComponent.value = optionsModalComponent.value?.state
})
watch(() => modalSuccessComponent.value?.state, () => {
    stateModalComponent.value = modalSuccessComponent.value?.state
})
const updateStateConfirmationF = (selection: string, action: string) => {
    const dataSend = { selectionSend: selection, actionSend: action }
    emit('updateStateConfirmation', dataSend)
}
</script>
<template>
    <div class="q-pa-md q-gutter-sm" style="max-width: 450px;">
        <q-dialog v-model="loadingComponent" persistent position="top">
            <q-card style="max-width: 450px;top: 250px">
                <q-card-section class="text-white q-py-md shadow-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia iusto porro, quod exercitationem magni
                    impedit
                    fugiat quibusdam eum, id ipsam dolor labore, laboriosam quisquam autem. Dignissimos molestiae doloremque
                    asperiores! Eius! Lorem ipsum dolor, sit amet consectetur adipisicing elit. At et itaque deserunt
                    corporis.
                    Impedit voluptas quos debitis quidem temporibus autem nisi mollitia minus repellat laborum eius, nobis
                    eveniet
                    tempora architecto.
                </q-card-section>
                <q-inner-loading :showing="visible" label="Por favor aguarde..." label-class="text-dark"
                    label-style="font-size: 1.1em" size="100px" style="color:var(--brand-secondary)" />
            </q-card>
        </q-dialog>
        <q-dialog v-model="stateModalDataComponent" persistent position="top">
            <q-card class="bg-white" style=" max-width: 450px; top: 250px">
                <q-card-section class="q-py-md shadow-2">
                    <div style="font-size: 25px" align="center">
                        <q-icon :name="optionsModalComponent?.dataModalAction.icon"
                            :color="optionsModalComponent?.dataModalAction.colorIcon" size="4em" />
                        <br>
                        <div style="font-family: fantasy; color: rgb(90, 90, 105);">
                            {{ optionsModalComponent?.dataModalAction.title }}
                        </div>
                    </div>
                </q-card-section>
                <q-card-actions align="center">
                    <q-btn color="green"
                        @click="updateStateConfirmationF('check', optionsModalComponent.dataModalAction.action)"
                        label="Aceitar" />
                    <span class="q-pr-xs"></span>
                    <q-btn color="grey" @click="updateStateConfirmationF('close', '')" label="Fechar" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="stateModalComponent" persistent position="top">
            <q-card class="bg-white" style=" max-width: 510px; top: 250px">
                <q-card-section class="q-py-md shadow-2">
                    <div align="center">
                        <q-icon :name="modalSuccessComponent?.dataModalAction.icon"
                            :color="modalSuccessComponent?.dataModalAction.colorIcon" size="4em" />
                        <br>
                        <div style="font-family: fantasy; font-size: 25px; color: rgb(53, 53, 64);">
                            {{ modalSuccessComponent?.dataModalAction.title }}
                        </div>
                        <div align="center" style="font-size: 15px; color: rgb(83, 83, 99);">
                            <pre style="font-family: fantasy;">{{ modalSuccessComponent?.dataModalAction.data }}</pre>
                        </div>
                    </div>
                </q-card-section>
                <q-card-actions align="center">
                    <q-btn color="green" @click="updateStateConfirmationF('success', '')" label="Aceitar" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
