<template>
    <div class="add-goods-order">
        <div class="add-goods-title">
            <van-notice-bar color="#191919" left-icon="info-o">
                请输入订单金额和描述，手动创建订单
            </van-notice-bar>
        </div>
        <div class="add-goods-content">
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                        v-model="username"
                        name="订单金额（元）"
                        label="订单金额（元）"
                        placeholder="请输入该订单需要支付的金额"
                        :rules="[{ required: true, message: '请填写用户名' }]"
                    />
                    <van-field
                        v-model="password"
                        type="textarea"
                        name="订单描述"
                        label="订单描述"
                        placeholder="请输入订单描述（商品名称、价格，或补扣原因）"
                        :rules="[{ required: true, message: '请填写密码' }]"
                    />
                </van-cell-group>
            </van-form>
        </div>
        <div class="goods-btn">
            <van-button class="onlineservice" round  color="#FE7E41" @click="gotoAddGoods()">确定</van-button>
        </div>
    </div>
</template>
<script setup>
// import { reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// const Data = reactive({
//     listData: {}
// })

const gotoAddGoods = () => {
    router.push({
        path: '/addOrder',
        name: 'addOrder'
    })
}
</script>
<style lang="scss">
.add-goods-order{
    margin-top: 20px;
    .add-goods-title{
        padding: 30px;
        font-size: 30px;
    }
    .goods-btn{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        width: 630px;
        margin: 0 auto;
        margin-bottom: 41px;
        .onlineservice{
            width: 630px;
            height: 92px;

        }
    }
}
</style>
