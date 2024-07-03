<template>
    <iframe :src="pdfSrc" allowfullscreen webkitallowfullscreen />
</template>
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
let file = null
file = route.query.pdfUrl.replace(/http:\/\/testrgw.hengchang6.com/, '/hcpdf').replace(/https:\/\/pbsrgw.hengchang6.com/, '/hcpdf').replace(/http:\/\/118.26.173.95/, '/fsApi').replace(/https:\/\/filesys.hengchang6.com/, '/fsApi').replace(/https:\/\/hsh-native-life-test-1309143854.cos.ap-beijing.myqcloud.com/, '/hshpdf')
const pdfSrc = `/pdfjs/web/viewer.html?file=${file}`

</script>
<style lang="scss" scoped>
iframe{
    width: 100%;
    height: 100vh;
}
</style>
