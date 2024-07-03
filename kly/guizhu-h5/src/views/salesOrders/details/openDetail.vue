<template>
    <div class="orderDetailsBox">
        <van-nav-bar fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="closePage">
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="box">
            <div class="orderDetailsTop">
                <div class="informationBox">
                    <span class="line"></span>
                    <div class="informationTitle">
                        开门信息
                    </div>
                </div>
                <div class="transverse"></div>
                <div class="order">
                    <div class="orderLeft">
                        开门记录状态
                    </div>
                    <div class="orderRight">
                        {{info.openDoorStatus}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        开门记录编号
                    </div>
                    <div class="orderNum">
                        {{info.openDoorNo}}
                        <van-button class="copyBox" @click="copyText(info.openDoorNo)">复制</van-button>
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        开门时间
                    </div>
                    <div class="orderRight">
                        {{info.openDoorTime}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        用户手机号
                    </div>
                    <div class="orderRight">
                        {{openDetail.consumerMobile}}
                        <!-- {{info.consumerMobile}} -->
                    </div>
                </div>
                <div class="video">
                    购物视频
                </div>
                <div class="videoContent">
                    <div class="shoppingVideo" v-for="(item,index) in info.buyVideoUrls" :key="index">
                        <video class="videxBox" :src="item" controls='controls'></video>
                    </div>
                </div>
            </div>
            <div class="orderDetailsMiddle">
                <div class="informationBox">
                    <span class="line"></span>
                    <div class="informationTitle">
                        设备信息
                    </div>
                </div>
                <div class="transverse"></div>
                <div class="order">
                    <div class="orderLeft">
                        设备编号
                    </div>
                    <div class="orderRight">
                        {{openDetail.deviceInfo?openDetail.deviceInfo.deviceCode:''}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        设备类型
                    </div>
                    <div class="orderNum">
                        {{openDetail.deviceInfo?openDetail.deviceInfo.deviceType:''}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        设备地址
                    </div>
                    <div class="orderRights">
                        {{openDetail.deviceInfo?openDetail.deviceInfo.deviceAddr:''}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        原厂设备ID
                    </div>
                    <div class="orderRight">
                        {{openDetail.deviceInfo?openDetail.deviceInfo.merchantEqId:''}}
                    </div>
                </div>
                <!-- <div class="bottom-border">

                </div> -->
            </div>
        </div>
        <!-- <div class="button-box" v-if="dataList[0].state!=1" @click="gotoadd">
            <span>手动创建订单</span>
        </div> -->
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Toast } from 'vant'
import { openDoorDetail } from '@/api/order.js'
import { closePage } from '@/utils/composables'
import { getAppStorageFn } from '@/utils/storage'

const route = useRoute()
// const router = useRouter()
// 返回上一级
const listKey = ref()
// const onClickLeft = () => history.back()
const props = defineProps(['openDoorNo', 'consumerId', 'detaileInfo'])

const info = ref({})
const detailData = reactive({
    dataList: [],
    openDetail: {}
})
const { openDetail } = toRefs(detailData)
const getList = () => {
    listKey.value = route.params
    const arr = [
        { state: '0', openbh: 153268956, time: '2000-06-16 12:23:33', phone: 13466846832, unitbh: 1001, unitType: 'xc_436', unitName: '华腾世纪E1', unitAddress: '中国广东省深圳市南山区粤海街道高新南一街15', unitID: '13455' }
    ]
    detailData.dataList = arr
}
getList()
// 复制
const copyText = (text) => {
    const input = document.createElement('input')
    input.style.position = 'fixed'
    input.style.top = 0
    input.style.left = 0
    input.style.width = '2em'
    input.style.height = '2em'
    input.style.padding = 0
    input.style.border = 'none'
    input.style.outline = 'none'
    input.style.boxShadow = 'none'
    input.style.background = 'transparent'
    input.value = text
    document.body.appendChild(input)
    input.select()
    try {
        document.execCommand('copy')
        Toast('复制成功')
    } catch (err) {
        Toast('复制失败')
    }
    document.body.removeChild(input)
}
// const gotoadd = () => {
//     router.push({
//         path: '/addOrder',
//         name: 'addOrder'
//     })
// }
// 合计
// const totalNum = ref(500)
// totalNum.value = () => {
//     const totalPrice = 0
//     for (let i = 0; i < orderListData.value.length; i++) {
//         totalPrice.value += orderListData.value[i].price * orderListData.value[i].quantity
//     }
// }

const getopenDoorDetail = async () => {
    const param = {
        consumerId: props.consumerId,
        deviceCode: props.openDoorNo
    }
    const res = await openDoorDetail(param)
    Object.assign(detailData.openDetail, res.data)
}
getopenDoorDetail()

onMounted(() => {
    getAppStorageFn('openDetails', (val) => {
        if (val) {
            Object.assign(info.value, JSON.parse(val))
        }
    })
})

</script>
<style lang="scss" scoped>
.orderDetailsBox{
    background: #F4F5F5;
    height: 100vh;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            .icon--unselect{
                .van-image{
                    width: 19px;
                    height: 31px;
                }
            }
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
    .box{
        margin-left: 30px;
        margin-right: 30px;
    }
    .orderDetailsTitle{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 750px;
        height: 128px;
        background: #ffffff;
        font-size: 34px;
        text-align: center;
        line-height: 140px;
        .equipment{
            width: 204px;
            height: 48px;
            font-size: 34px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #000000;
            line-height: 48px;
        }
        .back{
            color: #000;
            float: left;
            margin-left:20px;
            margin-top: 50px;
        }
    }
    .informationBox{
        display: flex;
        padding-top: 26px;
    }
    .informationTitle{
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191919;
        margin-left: 20px;
    }
    .line{
        width: 10px;
        height: 28px;
        background: #FE7E41;
        display: block;
        margin-top: 6px;
    }
    .originalBox{
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FE7E41;
        margin-left: 346px;
    }
    .transverse{
        width: 631px;
        height: 2px;
        margin-left: 30px;
        background: #F2F6F9;
        margin-top: 17px;
    }
    .orderDetailsTop{
        // width: 690px;
        // height: 741px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        .informationTitle{
            font-size: 30px;
            font-weight: 500;
            color: #191919;
            margin-left: 20px;
        }
        .order{
            display: flex;
            justify-content:space-between;
            margin-top: 25px;
            .orderLeft{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                margin-left: 30px;
            }
            .orderRight{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
                text-align:right;
            }
            .orderNum{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
                display: flex;
                .copyBox{
                    width: 70px;
                    height: 34px;
                    background: #FFF5F0;
                    border-radius: 17px;
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FE7E41;
                    line-height: 33px;
                    margin-left: 10px;
                }
                .van-button--normal{
                    padding: 0px !important;
                }
            }
        }
        .video{
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            margin-left: 30px;
            margin-top: 25px;
        }
        .videoContent{
            overflow: hidden;
            overflow-x: scroll;
            display: flex;
            .shoppingVideo{
                width: 600px;
                height: 300px;
                // border: 1px solid #000;
                margin-left: 30px;
                margin-top: 20px;
                .videxBox{
                    width: 600px;
                    height: 300px;
                    object-fit: fill;
                }
            }
        }
    }
    .orderDetailsMiddle{
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        padding-bottom: 30px;
        .informationTitle{
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #191919;
            margin-left: 20px;
        }
        .order{
            display: flex;
            justify-content:space-between;
            margin-top: 25px;
            .orderLeft{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                margin-left: 30px;
            }
            .orderRight{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
                text-align:right;
            }
            .orderRights{
                width: 418px;
                // max-height: 74px;
                font-size: 26px;
                font-weight: 400;
                color: #191919;
                line-height: 37px;
                margin-right: 30px;
                text-align:right;
            }
            .orderNum{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
                display: flex;
                .van-button--normal{
                    padding: 0px !important;
                }
            }
        }
    }
}
.button-box{
        width: 630px;
        height: 92px;
        background: #FE7E41;
        border-radius: 46px;
        position: absolute;
        bottom:41px;
        left:60px;
        text-align:center;
        line-height: 92px;
        span{
            font-size: 30px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
        }
    }
</style>
