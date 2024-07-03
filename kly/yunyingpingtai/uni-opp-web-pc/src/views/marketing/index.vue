<template>
    <div class="marketing-home">
        <div>
            <h4>优惠券</h4>
            <el-row :gutter="100">
                <el-col :span="8" v-for="(item,index) in couponList" :key="index">
                    <div class="flex-container">
                        <div class="left">
                            <h4>{{item.title}}</h4>
                            <span style="font-size:12px">{{item.text}}</span>
                        </div>
                        <el-button type="primary" class="right" @click="goCoupon(item.type,item.couponType)">立即创建</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top:10px;">
            <h4>用户增长</h4>
            <el-row :gutter="100">
                <el-col :span="8" v-for="(item,index) in userAdd" :key="index">
                    <div class="flex-container">
                        <div class="left">
                            <h4>{{item.title}}</h4>
                            <span style="font-size:12px">{{item.text}}</span>
                        </div>
                        <el-button type="primary" class="right" @click="goactiveCoupon(item)">立即创建</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const dataState = reactive({
    couponList: [
        { title: '立减券', text: '享受优惠的商品可在原价基础上直接立减，立减金额不能超过订单或商品原价。', type: 'add', couponType: 1 },
        { title: '满减券', text: '享受满足门槛交易金额条件的优惠的商品，可在原价基础上立减。', type: 'add', couponType: 2 },
        { title: '折扣券', text: '享受优惠的商品可在原价基础上直接折扣，支持限时限量.', type: 'add', couponType: 3 }
    ],
    userAdd: [
        { title: '拉新有礼', text: '支持对 推荐人/被推荐人 做优惠券，积分等奖励，奖励支持阶梯形式，支持注册新用户/会员用户/注册新用户消费 等多种场景', type: 'add' },
        { title: '秒杀', text: '支持限定时长/数量/活动时间段的优惠形式', type: 'add' }
    ]
})
const { couponList, userAdd } = toRefs(dataState)
const goCoupon = (type, couponType) => {
    router.push({ name: 'coupon-batch-handle', params: { handleType: type, couponType } })
}
const goactiveCoupon = (item) => {
    if (item.title === '拉新有礼') {
        router.push({ name: 'apply-active', params: { handleType: item.type } })
    } else if (item.title === '秒杀') {
        router.push({ name: 'apply-active-seckill', params: { handleType: item.type } })
    }
}

</script>
<style lang="scss" scope>
.marketing-home{
    h4{
        line-height:40px;
    }
    .flex-container{
            border:1px solid #ccc;
            padding:20px;
            height: 120px;
            display:flex;
            align-items:center;
            justify-content:flex-end
            .left{
                flex:1;
            }
            .right{
                margin-left:5px;
            }
        }
}
</style>
