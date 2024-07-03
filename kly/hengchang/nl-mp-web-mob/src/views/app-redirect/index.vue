<template>
    <div></div>
</template>
<script setup>
import { isApp } from '@/utils'
import { Toast } from 'vant'
import { cashierDoPay, scenePayCashierDoPay, containerPayCashierDoPay } from '@/utils/order'

const route = useRoute()
Toast.loading({
    message: '加载中...',
    forbidClick: true,
    duration: 0
})
if (isApp) {
    if (route.query.url) window.location.replace(`${window.location.origin}/${route.query.url}?isApp=1`)
} else {
    watch([isApp], () => {
        if (route.query.url) window.location.replace(`${window.location.origin}/${route.query.url}?isApp=1`)
    })
}
if (route.query.orderNumber && route.query.payFn === 'scenePay') {
    scenePayCashierDoPay(route.query.orderNumber, Number(route.query.payAmount))
} else if (route.query.orderNumber && route.query.payFn === 'containerPay') {
    containerPayCashierDoPay(route.query.orderNumber, Number(route.query.payAmount), route.query.appKey, route.query.busiCode)
} else if (route.query.orderNumber && route.query.payAmount) {
    cashierDoPay(route.query.orderNumber, Number(route.query.payAmount))
}
</script>
