<template>
    <div class="withdrawal-record-detail-page">
        <div class="title">提现金额</div>
        <div class="content" v-if="$route.query.status === '0'">{{ Number($route.query.amount).toFixed(2) }}</div>
        <div class="content" v-else>{{ Number($route.query.amount) > 0 ? `+${Number($route.query.amount).toFixed(2)}` : Number($route.query.amount).toFixed(2) }}</div>
        <div class="order" v-if="$route.query.status !== '0'">
            <div>
                <div>时间</div>
                <div>{{ $route.query.busiTime }}</div>
            </div>
            <div>
                <div>订单号</div>
                <div>{{ $route.query.serialNo }}</div>
            </div>
            <div>
                <div>余额</div>
                <div>￥{{ Number($route.query.balanceAmount).toFixed(2) }}</div>
            </div>
        </div>
        <div class="step" v-else>
            <div class="step-title">处理进度</div>
            <van-steps direction="vertical" :active="0">
                <van-step>
                    <div class="text-30">提现申请</div>
                    <div class="text-24">{{ $route.query.busiTime }}</div>
                    <template #active-icon>
                        <van-image :src="require('@/assets/check.png')"/>
                    </template>
                    <template #inactive-icon>
                        <van-image :src="require('@/assets/check.png')"/>
                    </template>
                </van-step>
                <van-step>
                    <div class="text-30">处理中</div>
                    <div class="text-24" v-if="$route.query.status === '2'">{{ $route.query.digest }}</div>
                    <div class="text-24" v-else>{{ $route.query.busiTime }}</div>
                    <template #active-icon>
                        <van-image :src="require('@/assets/check.png')"/>
                    </template>
                    <template #inactive-icon>
                        <van-image :src="require('@/assets/check.png')"/>
                    </template>
                </van-step>
            </van-steps>
        </div>
    </div>
</template>
<script setup>
</script>
<style lang="scss" scoped>
.withdrawal-record-detail-page{
    background-color: #fff;
    padding-bottom: 20px;
    .title{
        font-size: 30px;
        font-weight: 400;
        color: #191919;
        text-align: center;
        padding-top: 98px;
    }
    .content{
        margin: 60px 50px 0;
        font-size: 64px;
        font-weight: 500;
        color: #191919;
        text-align: center;
        padding-bottom: 98px;
        border-bottom: 1px solid #F4F5F5;
    }
    .order{
        padding: 40px 50px;
        &>div:nth-child(1){
            margin-top: initial;
        }
        &>div{
            display: flex;
            justify-content: space-between;
            margin-top: 16px;
            div:nth-child(1){
                font-size: 26px;
                font-weight: 400;
                color: #999999;
            }
            div{
                font-size: 26px;
                font-weight: 400;
                color: #191919;
            }
        }
    }
    .step{
        margin-top: 40px;
        .step-title{
            padding: 0 50px;
            font-size: 26px;
            font-weight: 400;
            color: #999999;
        }
        .van-steps{
            padding-left: 100px;
            .van-image{
                width: 32px;
                height: 32px;
            }
            .text-30{
                margin-left: 20px;
                font-size: 30px;
                font-weight: 400;
                color: #191919;
            }
            .text-24{
                font-size: 24px;
                font-weight: 400;
                color: #999999;
                margin-top: 8px;
                margin-left: 20px;
            }
        }
        .footer{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 36px 0;
            margin: 58px 50px 0;
            border-top: 1px solid #F4F5F5;
            div{
                font-size: 30px;
                font-weight: 400;
                color: #191919;
            }
            .bank-card{
                display: flex;
                align-items: center;
                font-size: 30px;
                font-weight: 400;
                color: #191919;
                .van-image{
                    width: 40px;
                    height: 40px;
                    margin-right: 16px;
                }
            }
        }
    }
    .result{
        padding-top: 20px;
        .cell{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 50px 10px;
            background: #FFFFFF;
            .left{
                font-size: 13px;
                color: #999999
            }
            .right{
                font-size: 13px;
                color: #191919
            }
        }
    }
}
</style>
