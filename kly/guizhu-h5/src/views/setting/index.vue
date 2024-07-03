
<template>
    <div class ="setting">
        <div class="same">
            <p class="">修改手机号</p>
            <img src="../../assets/right.png"/>
            <p style="float:right;margin-right:10px;">987654345678</p>

        </div>
        <div class="same" @click="goAgreement">
            <p class="">用户协议</p>
            <img src="../../assets/right.png"/>
        </div>
        <div class="same" @click="goCancellation">
            <p class="">注销账户</p>
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
const goCancellation = () => {
    router.push({
        path: '/setting/cancellation'
    })
}
const goAgreement = () => {
    router.push({
        path: '/setting/agreement'
    })
}
onMounted(() => {

})

</script>

<style scoped lang="scss">
.setting{
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
