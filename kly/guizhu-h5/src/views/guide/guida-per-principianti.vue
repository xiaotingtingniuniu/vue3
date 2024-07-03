<template>
    <iframe
        style="width:100%;height:100vh;"
        :src="pdfBaseUrl"
        ref="pdfViewr"
        allowfullscreen
        webkitallowfullscreen
    >
    </iframe>
</template>
<script setup>
const pdfBaseUrl = '/pdfjs/web/viewer.html?file=/pdf/恒生活商品建模规范.pdf'
</script>
