
<template>
    <div class ="agreement">
        <div class="same" @click="goAgreement1">
            <p class="" >《用户注册及服务协议》</p>
            <img src="../../assets/right.png"/>
        </div>
        <div class="same" @click="goAgreement2">
            <p class="">《用户隐私协议》</p>
            <img src="../../assets/right.png"/>
        </div>
    </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
const router = useRouter()
const route = useRoute()
console.log(route)
const goAgreement1 = () => {
    router.push({
        path: '/setting/agreement1'
    })
}
const goAgreement2 = () => {
    router.push({
        path: '/setting/agreement2'
    })
}
onMounted(() => {

})

</script>

<style scoped lang="scss">
.agreement{
    min-height: 100vh;
    background: #F4F5F5;
    .same{
        height:120px;
        padding:0 30px;
        background: #fff;
        border-bottom:1px solid #F3F5F6;
        p{
            float: left;
            line-height: 120px;
        }
        img{
            float: right;
            width:14px;
            height:26px;
            margin-top:47px;
        }
    }
}
</style>
