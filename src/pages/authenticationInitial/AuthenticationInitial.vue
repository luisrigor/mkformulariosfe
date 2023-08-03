import { onMounted, ref, toRef } from 'vue';
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UtilCookies from '../../shared/utils/Cookies'
import Messages from '../modalMessages/MessagesPage.vue'
import { COOKIE_NAME_TOYOTA, COOKIE_NAME_LEXUS } from '../../shared/constants/Global'
import { LexusTheme, ToyotaTheme } from '../../shared/styles/colors/Colors';
import '../../shared/styles/stylesGlobal.css'
import AuthenticationInitialApi from './AuthenticationInitialApi';
import HttpService from '../../shared/services/HttpService';


const loadingAuth = ref(false)
const initiateAuthentication = async () => {
    const token = 'tcap1@tpo||eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbl9wb3J0YWwiOiJ0Y2FwMUB0cG8iLCJwd2RfcG9ydGFsIjoidGVzdGU0NTYifQ.FStiuViSMxYNHf1F7zuU7kwLgIfvYDWrU4zuSgRTR0M'
    if (import.meta.env.MODE === 'development') {
        const cookie = 'tcap1@tpo||eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbl9wb3J0YWwiOiJ0Y2FwMUB0cG8iLCJwd2RfcG9ydGFsIjoidGVzdGU0NTYifQ.FStiuViSMxYNHf1F7zuU7kwLgIfvYDWrU4zuSgRTR0M'
    }
    // amgoncalves@C@CeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbl9wb3J0YWwiOiJhbWdvbmNhbHZlcyIsInB3ZF9wb3J0YWwiOiJ0ZXN0ZTQ1NiJ9.rl7Ivm6GzVaoXrOcpoXU-oFC3rGiJr9RBTJ1M8xjb3k
    const urlActual = window.location
    const cookie = urlActual.hostname.includes('lexus') ? COOKIE_NAME_LEXUS : COOKIE_NAME_TOYOTA
    const brand = cookie === COOKIE_NAME_LEXUS ? 'lexus' : 'toyota'
    const root = document.documentElement;
    if (brand === 'toyota') {
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
        const response = await AuthenticationInitialApi.login(token)
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
}
onMounted(() => {
    initiateAuthentication()
}) 
</script>

<template>
    <div>
    </div>
    <messages :loading="loadingAuth"> </messages>
    <slot>
    </slot>
</template>
