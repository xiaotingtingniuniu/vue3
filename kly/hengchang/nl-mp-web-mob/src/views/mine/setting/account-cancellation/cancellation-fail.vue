<template>
    <div class="cancellation-fail">
        <div class="icon--unselect">
            <van-image :src="require('@/assets/mine/编组 3@2x.png')"/>
        </div>
        <div class="account-tips">抱歉，由于以下原因，账号无法注销</div>
        <div class="card">
            <router-link :to="{name: 'order-list'}" custom v-slot="{ navigate }">
                <div class="card-item" @click="navigate">
                    <div class="text">
                        <div>账号内存在未完成订单</div>
                        <div>订单完成或取消</div>
                    </div>
                    <div class="icon--unselect">
                        <van-image :src="require('@/assets/mine/形状结合备份 26@2x.png')"/>
                    </div>
                </div>
            </router-link>
        </div>
        <div class="page-tip">如对以上内容疑问，请联系客服400-8585858</div>
    </div>
</template>
<style lang="scss" scoped>
.cancellation-fail{
    &>.icon--unselect{
        padding-top: 39px;
        .van-image{
            width: 108px;
            height: 108px;
        }
    }
    .account-tips{
        font-size: 34px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #222222;
        text-align: center;
        margin-top: 53px;
    }
    .card{
        margin: 44px 24px;
        padding: 7px 30px;
        background: #FFFFFF;
        border-radius: 16px;
        .card-item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            .text{
                div:nth-child(1){
                    font-size: 26px;
                    font-weight: bold;
                    color: #666666;
                }
                div:nth-child(2){
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    margin-top: 6px;
                }
            }
            .icon--unselect{
                width: 9px;
                height: 15px;
                .van-image{
                    width: 9px;
                    height: 15px;
                }
            }
        }
    }
    .page-tip{
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #B8B7B7;
        text-align: center;
        position: fixed;
        bottom: 93px;
        left: 0;
        right: 0;
    }
}
</style>
