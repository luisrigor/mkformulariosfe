import { onMounted, ref, toRef } from 'vue';
<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import UtilCookies from '../../shared/utils/Cookies'
import Messages from '../modalMessages/MessagesPage.vue'
import { COOKIE_NAME_TOYOTA, COOKIE_NAME_LEXUS } from '../../shared/constants/Global'
import { LexusTheme, ToyotaTheme } from '../../shared/styles/colors/Colors';
import '../../shared/styles/stylesGlobal.css'
import AuthenticationInitialApi from './AuthenticationInitialApi';
import HttpService from '../../shared/services/HttpService';


const loadingAuth = ref(false)
const dataAuth = reactive({
    brand: '',
    token: '',
    viewFinal: false,
    title: ''
})
const initiateAuthentication = async () => {
    // if (import.meta.env.MODE === 'development') {
    //     const cookie = 'tcap1@tpo||eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbl9wb3J0YWwiOiJ0Y2FwMUB0cG8iLCJwd2RfcG9ydGFsIjoidGVzdGU0NTYifQ.FStiuViSMxYNHf1F7zuU7kwLgIfvYDWrU4zuSgRTR0M'
    // }
    const urlActual = window.location
    const cookie = urlActual.hostname.includes('lexus') ? COOKIE_NAME_LEXUS : COOKIE_NAME_TOYOTA
    // const brand = cookie === COOKIE_NAME_LEXUS ? 'toyota' : 'lexus'
    const root = document.documentElement;
    // if (brand === 'toyota') {
    if (dataAuth.brand === 'toyota') {
        localStorage.setItem('app', 'Toyota')
        console.log('is toyota')
        if (root) {
            localStorage.setItem('Current', '33')
            root.style.setProperty('--brand-primary', ToyotaTheme.primary)
            root.style.setProperty('--brand-secondary', ToyotaTheme.secondary)
            root.style.setProperty('--brand-fg', ToyotaTheme.fg)
            root.style.setProperty('--q-primary', ToyotaTheme.secondary)
        }
    } else {
        localStorage.setItem('app', 'Lexus')
        console.log('is Lexus')
        if (root) {
            localStorage.setItem('Current', '10010')
            root.style.setProperty('--brand-primary', LexusTheme.primary)
            root.style.setProperty('--brand-secondary', LexusTheme.secondary)
            root.style.setProperty('--brand-fg', LexusTheme.fg)
            root.style.setProperty('--q-primary', LexusTheme.secondary)
        }
    }
    const currentCookie = UtilCookies.getCookie(cookie)
    if (!currentCookie) {
        // this.hasAuth = false
        // this.isLoading = false
        // return
    }
    try {
        loadingAuth.value = true
        const response = await AuthenticationInitialApi.login(dataAuth.token)
        HttpService.accessToken = response.token
        loadingAuth.value = false
        localStorage.setItem('roles', response.roles)
    } catch (e: any) {
        if (e.statusCode !== 200) {
            loadingAuth.value = false
            console.log('error', e.statusCode)
        }
    } finally {
        loadingAuth.value = false
    }
    setTimeout(() => {
        dataAuth.viewFinal = true
    }, 1000)
}
const updateData = async (app: string, usar: number, title: string) => {
    dataAuth.title = title
    HttpService.accessToken = ''
    dataAuth.viewFinal = false
    dataAuth.brand = app
    const importador = 'tcap1@tpo||eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbl9wb3J0YWwiOiJ0Y2FwMUB0cG8iLCJwd2RfcG9ydGFsIjoidGVzdGU0NTYifQ.FStiuViSMxYNHf1F7zuU7kwLgIfvYDWrU4zuSgRTR0M'
    const Concesionario = 'salesview_gc_porto@tpo.sccaporto.circunvalacao||eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbl9wb3J0YWwiOiJzYWxlc3ZpZXdfZ2NfcG9ydG9AdHBvLnNjY2Fwb3J0by5jaXJjdW52YWxhY2FvIiwicHdkX3BvcnRhbCI6ImdjX2xpc2JvYTIifQ.R_KLDvtBep1_RC83UvW_J_MOZUE-L0d9w3mtrB7wR7M'
    dataAuth.token = usar === 1 ? importador : Concesionario
    initiateAuthentication()
}
onMounted(() => {
    // initiateAuthentication()
}) 
</script>

<template>
    <div>
        <q-btn color="red" label="Toyota-Importador" @click="updateData('toyota', 1, 'Toyota-Importador')" />
        <q-btn color="red" label="Toyota-Concesionario" @click="updateData('toyota', 2, 'Toyota-Concesionario')" />
        <q-btn color="grey" label="Lexus-Importador" @click="updateData('lexus', 1, 'Lexus-Importador')" />
        <q-btn color="grey" label="Lexus-Concesionario" @click="updateData('lexus', 2, 'Lexus-Concesionario')" />
        <h4 style="
    margin-top: 1px;
    margin-bottom: 1px;
">
            {{ dataAuth.title }}
        </h4>
    </div>
    <messages :loading="loadingAuth"> </messages>
    <slot v-if="dataAuth.viewFinal">
    </slot>
</template>
