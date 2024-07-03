<template>
    <div>
        health
        <button @click="getAuthCode"> getAuthCode </button>
    </div>
</template>
<script setup>

const getAuthCode = () => {
    window.location.href = 'alipays://platformapi/startapp?appId=2021003143673386&url=https%3A%2F%2Fopenauth.alipay.com%2Foauth2%2FpublicAppAuthorize.htm%3Fapp_id%3D2021003143673386%26scope%3Dauth_user%26redirect_uri%3Dhttp%3A%2F%2F172.23.45.244%3A8060%2Fhealth'
    // https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=APPID&scope=SCOPE&redirect_uri=ENCODED_URL
    // const url = encodeURIComponent(`https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021003143673386&scope=auth_user&redirect_uri=${window.location.href}`)
    // window.location.href = `alipays://platformapi/startapp?appId=2021003143673386&url=${url}`
    // window.location.href = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021003143673386&scope=auth_user&redirect_uri=${window.location.href}`
    // console.log(`https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021003143673386&scope=auth_user&redirect_uri=UrlEncode(${window.location.href})`)
    // window.location.href = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021003143673386&scope=auth_user&redirect_uri=UrlEncode(${window.location.href})`
}
</script>
