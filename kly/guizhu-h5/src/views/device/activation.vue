<template>
    <div class="device-active mine-content">
        <van-nav-bar title="设备激活" fixed placeholder left-arrow @click-left="closePage"> </van-nav-bar>
        <van-form @submit="onSubmit">
            <div class="open-type">
                <div class="merchant-container card">
                    <van-cell-group class="guizhu-cell-group">
                        <van-field class="guizhu-field" label="设备编号" v-model="merchantInfo.deviceCode" name="deviceCode" input-align="right" placeholder="请输入设备编号" readonly />
                        <van-field v-if="accountCode" class="guizhu-field" label="设备型号" v-model="accountCode" name="accountCode" input-align="right" placeholder="请输入设备型号" readonly />
                        <van-field class="guizhu-field" label="设备名称" required v-model="merchantInfo.deviceName" name="deviceName" input-align="right" placeholder="方便记忆的简称，例如*D座2层大厅" :rules="[{ required: true, message: '请输入设备名称' }]" error-message-align="right" />
                        <!-- <van-field style="display: none" label="柜主id" v-model="merchantInfo.ownerId" name="ownerId" input-align="right"/> -->
                        <van-field class="guizhu-field" label="柜主" readonly required placeholder="请选择柜主" input-align="right" v-model="merchantInfo.ownerName" name="ownerName" error-message-align="right" />
                        <!-- <template v-else>
                            <van-field class="guizhu-field" label="柜主" readonly required placeholder="请选择柜主" input-align="right" v-model="merchantInfo.ownerName" name="ownerName" is-link @click="showLocationPopup" :rules="[{ required: true, message: '请选择柜主' }]" error-message-align="right"/>
                            <van-popup v-model:show="locationShow" position="bottom">
                                <van-picker title="柜主" v-if="list" :columns="list" value-key="merchantName" @confirm="onConfirm" @cancel="locationShow = false"/>
                            </van-popup>
                        </template> -->
                        <!-- 这是柜主1结束 -->
                        <van-field class="guizhu-field" style="display: none" label="合同编号id" readonly input-align="right" v-model="merchantInfo.operationModel" name="operationModel" />
                        <van-field
                            class="guizhu-field"
                            :class="{ contract: contractData.contractNo }"
                            label="合同编号"
                            readonly
                            required
                            placeholder="请选择合同编号"
                            input-align="right"
                            v-model="merchantInfo.contractCode"
                            name="contractCode"
                            is-link
                            @click="showLocationPopups(val)"
                            :rules="[{ required: true, message: '请选择合同编号' }]"
                            error-message-align="right"></van-field>
                        <div :class="{ contractTip: contractData.contractNo }" v-if="contractData.contractNo">
                            <div class="arrow-tip"></div>
                            <div class="contract-desc">
                                <div class="item">
                                    <span class="label">订单编号</span><span class="val">{{ contractData.orderNo }}</span>
                                </div>
                                <div class="item">
                                    <span class="label">订单状态</span><span class="val">{{ contractData.statusName }}</span>
                                </div>
                                <div class="collapse" v-show="isOpen">
                                    <div class="item">
                                        <span class="label">合同类型</span><span class="val">{{ contractData.contractTypeName }}</span>
                                    </div>
                                    <div class="item">
                                        <span class="label">签约设备数</span><span class="val">{{ contractData.deviceNum }}</span>
                                    </div>
                                    <div class="item">
                                        <span class="label">已绑定设备数</span><span class="val">{{ contractData.deviceBindNum }}</span>
                                    </div>
                                    <div class="item">
                                        <span class="label">签约时间</span><span class="val">{{ contractData.date }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="collapse-arrow" @click="collapse">
                                <img :src="isOpen ? closeIcon : openIcon" />
                            </div>
                            <div class="divider"></div>
                        </div>
                        <van-field
                            class="guizhu-field"
                            label="合同货柜编号"
                            style="white-space: nowrap"
                            readonly
                            required
                            placeholder="请选择合同货柜编号"
                            v-model="merchantInfo.pointCode"
                            name="pointCode"
                            input-align="right"
                            is-link
                            :rules="[{ required: true, message: '请选择合同货柜编号' }]"
                            error-message-align="right"
                            @click="pointShowsPopups(val)" />
                        <!-- <van-field class="guizhu-field" label="点位位置" required v-model="merchantInfo.pointPosition" name="pointPosition" input-align="right" placeholder="请输入点位位置" error-message-align="right" :rules="[{ required: true, message: '请输入点位位置' }]"/> -->
                        <van-field
                            class="guizhu-field"
                            label="点位"
                            required
                            readonly
                            placeholder="请选择点位"
                            input-align="right"
                            name="locationName"
                            is-link
                            v-model="merchantInfo.locationName"
                            @click="showLocationPopupsPostion(val)"
                            :rules="[{ required: true, message: '请选择点位' }]"
                            error-message-align="right">
                            <template #input>
                                <span class="slot">
                                    <span class="device-seat-span-wrap">
                                        <span class="device-seat-span">{{ merchantInfo.locationName }} </span>
                                        <span class="device-seat-span">
                                            {{ merchantInfo.deviceAdress }}
                                        </span>
                                    </span>
                                </span>
                            </template>
                        </van-field>
                    </van-cell-group>
                </div>
            </div>
            <div class="tip">
                <span class="title">什么是合同货柜编号？</span>
                <ul>
                    <li>1、“合同货柜编号”是系统根据合同生成的唯一编号。</li>
                    <li>2、系统根据合同签约的“设备数量”生成对应数量的“合同货柜编号”。</li>
                    <li>3、一个“合同货柜编号”只能同时激活绑定一台设备，“合同货柜编号”不会因所绑定设备更换产生变化。</li>
                </ul>
                <div class="point"><span class="exp">例如</span><span>合同签约5台设备，则系统创建5个合同货柜编号。同一时刻，因为每个合同货柜编号只能绑定一台设备，所以此合同最多能激活绑定5台设备。</span></div>
                <span class="change">如何切换当前柜主？</span>
                <div class="path">提示：在 首页-我的->当前商户->切换 可以切换当前柜主。</div>
            </div>

            <div class="sub-btn" v-show="state.hideshow">
                <van-row class="sub-btn-row">
                    <van-col span="12"> <van-button block color="#FE7E41" plain type="primary" @click="goout" style="border: 0"> 关闭 </van-button></van-col>
                    <van-col span="12"> <van-button block color="#FE7E41" type="primary" native-type="submit"> 提交 </van-button></van-col>
                </van-row>
            </div>
        </van-form>
    </div>
</template>

<script setup>
import { Toast } from 'vant'
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { getDeviceBind } from '@/api/device'
import { closePage } from '@/utils/composables'
import { getAppStorageFn } from '@/utils/storage'
import { useStore } from 'vuex'
const store = useStore()
const openIcon = require('@/assets/device/open.png')
const closeIcon = require('@/assets/device/close.png')
const router = useRouter()
const route = useRoute()
// const locationShow = ref(false)
// const list = ref([])
const accountCode = route.query.name ? route.query.name : sessionStorage.getItem('accountCode')
// 运营模式
const roles = computed(() => store.state.roleName)
//  柜主的手机号
// 角色是柜主的名字
// const name = route.query.operatorName ? route.query.operatorName : sessionStorage.getItem('operatorName')
// const mobile = route.query.tel ? route.query.tel : sessionStorage.getItem('operatorPhone')
const isOpen = ref(false)
const { contractData, pointData, pointAddress } = store.state

console.log(pointData, 'pointData')
const merchantInfo = reactive({
    appKey: 'A1001022', // 系统编码
    busiCode: 'A1001001', // 业务线编号
    contractCode: contractData.contractNo, // 合同编号
    deviceCode: route.query.key ? route.query.key : sessionStorage.getItem('devicecode'), // 设备编号
    deviceName: sessionStorage.getItem('deviceName') || '', // 设备名称
    address: pointAddress.address || '',
    locationName: pointAddress.locationName || '',
    locationCode: '', // 位置编号
    operationModel: contractData.operationModel, // 运营模式 1-自营 2-分期 0-租赁
    operatorId: sessionStorage.getItem('operatorId'),
    operatorName: sessionStorage.getItem('operatorName'),
    ownerId: null,
    // 柜主编号 如果登陆人是柜主，柜主编号取merchantId，名字取name，待运营商不传；
    // 如果登陆人是待运营商，待运营商编号取merchantId，待运营商名字取name，柜主的编号取柜主列表参数中busmmerchantId
    // 如果登陆人是待运营商，待运营商编号取merchantId，带运营商名字取name，柜主的编号取柜主列表参数中busiMerchantId，柜主的名字取柜主列表中的merchantSubName
    // 柜主的姓名取如果登陆人是待运营商，待运营商编号取merchantId，带运营商名字取name，柜主的编号取柜主列表参数中merchantName
    ownerName: null, // 柜主名称
    pointCode: pointData.pointId, // 合同货柜编号
    pointPosition: pointData.poiAddress, // 点位位置
    agentOperatorId: roles.value === '柜主' ? '' : sessionStorage.getItem('merchantId'), // 代运营商编号  如果当前登录人柜主为空，如果当前
    agentOperatorName: roles.value === '柜主' ? '' : sessionStorage.getItem('operatorName') // 代运营商名字
})
if (route.query.key) sessionStorage.setItem('devicecode', route.query.key)
if (route.query.name) sessionStorage.setItem('accountCode', route.query.name)
getAppStorageFn('managerInfo', (val) => {
    val = JSON.parse(val)
    merchantInfo.ownerName = val.merchantName
    merchantInfo.ownerId = val.merchantId
})
const customerMobile = ref(null)
onMounted(() => {
    getAppStorageFn('installList', async (val) => {
        const installList = JSON.parse(val || '{}') || {}
        const device = JSON.parse(sessionStorage.getItem('device')) || {} // 回显示 安装位置 选择之前填入的数据
        device.pointCode = pointData.pointId
        device.contractCode = contractData.contractNo
        device.operationModel = contractData.operationModel
        Object.assign(merchantInfo, { ...device })
        merchantInfo.deviceName = sessionStorage.getItem('deviceName')

        merchantInfo.locationCode = pointData.locationCode ? pointData.locationCode : route.query.locationCode
        // merchantInfo.locationCode = pointData.locationName ? pointData.locationName : route.query.locationName

        if (Object.keys(installList).length > 0) {
            // Object.assign(merchantInfo, { deviceAdress: `${installList.address}` })
            // Object.assign(merchantInfo, { locationName: `${installList.locationName}` })
            // Object.assign(merchantInfo, { locationCode: `${installList.locationCode}` })
        }

        // merchantInfo.deviceAdress = pointAddress.address
        merchantInfo.locationName = pointAddress.locationName

        if (pointData.address) {
            merchantInfo.deviceAdress = pointData.address
        }
        if (pointData.locationName && pointData.locationCode) {
            merchantInfo.locationName = pointData.locationName
            device.addCode = pointData.locationCode

            sessionStorage.setItem('device', JSON.stringify(device))
        }

        // if (roles.value === '柜主') {
        //     merchantInfo.ownerName = name
        //     await getAgreementListData()
        // } else {
        //     // d代运营商
        //     // await getMerchantData()
        // }
    })
    getAppStorageFn('masterPhoneMobile', (val) => {
        customerMobile.value = val
    })
    // 进入页面前判断是否是从 安装位置 回退回来的，如果是，则可能缓存中有数据
})

onBeforeRouteLeave((to, from) => {
    if (to.path === '/device/device-list') {
        sessionStorage.removeItem('device') // TODO 缓存清空
    }
})

const collapse = () => {
    isOpen.value = !isOpen.value
}

// 控制选择合同编号的弹窗 代运营商身份时 柜主必须要有值才能弹窗
const showLocationPopups = () => {
    if (merchantInfo.deviceName) sessionStorage.setItem('deviceName', merchantInfo.deviceName)
    // 跳转到
    if (!merchantInfo.ownerName) {
        Toast('请先选择柜主')
    } else {
        router.push({
            path: '/device/device-contract',
            query: {
                customerMobile: customerMobile.value
            }
        })
    }
}
const showLocationPopupsPostion = () => {
    sessionStorage.setItem('device', JSON.stringify(merchantInfo))
    router.push({
        path: '/device/device-seat',
        query: {
            target: 'activation',
            index: route.query.key ? route.query.key : sessionStorage.getItem('devicecode'),
            showNavbar: 0
        }
    })
}
// 选择点位
const pointShowsPopups = () => {
    if (!merchantInfo.contractCode) {
        Toast(' 请先选择合同编号')
    } else {
        router.push({
            path: '/device/device-point',
            query: {
                orderNo: contractData.orderNo,
                contractNo: contractData.contractNo,
                operationModel: contractData.operationModel,
                customerMobile: customerMobile.value
            }
        })
    }
}
// 柜主
// const onConfirm = async (value) => {
//     locationShow.value = false
//     Object.assign(merchantInfo, { ownerName: value.merchantName })
//     Object.assign(merchantInfo, { ownerId: value.busiMerchantId })
//     if (roles.value === '柜主') {
//         await getAgreementListData()
//     } else {
//         await getAgreementListData('4', value.phoneMobile)
//     }
// }

// 提交
const onSubmit = async (values, a) => {
    const res = await getDeviceBind(merchantInfo)
    if (res.code === '200') {
        Toast('操作成功！')
        router.push({
            path: '/device/device-list'
        })
    }
}
// // 返回上一级
const goout = async () => {
    router.push({
        path: '/device/device-list'
    })
    // router.back()
}

// 提交按钮隐藏
const state = reactive({
    oldHeight: document.documentElement.clientHeight,
    docmHeight: document.documentElement.clientHeight,
    hideshow: true
})
window.onresize = () => {
    return (() => {
        state.docmHeight = document.body.clientHeight
    })()
}
watch(
    () => state.docmHeight,
    (newValue) => {
        if (newValue < state.oldHeight) {
            state.hideshow = false
        } else {
            state.hideshow = true
        }
    },
    { deep: true }
)
</script>
<style lang="scss" scoped>
.mine-content {
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #fe7e41;
    --van-nav-bar-title-font-size: 34px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    .van-nav-bar__placeholder {
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
        .van-hairline--bottom:after {
            border-bottom-width: 0;
        }
    }
}
</style>
<style lang="scss" scoped>
.device-seat-span {
    width: 100%;
    display: block;
}

.device-active {
    padding-bottom: 200px;
    .open-type {
        background: #fff;
    }
    .sub-btn {
        // margin-top: 282px;
        height: 92px;
        // border-radius: 46px;
        padding: 16px 0;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 10px;
        padding-bottom: calc(16px + constant(safe-area-inset-bottom));
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
        background: #f7f7f7;
    }
    .tip {
        padding: 32px 30px;
        font-size: 24px;
        .title {
            color: #191919;
        }
        ul {
            color: #696969;
        }
        .point {
            margin-top: 30px;
            margin-bottom: 15px;
            color: #696969;
            .exp {
                color: #fe7e41;
                padding-right: 10px;
            }
        }
        .change {
            padding-top: 15px;
            color: #191919;
        }
        .path {
            color: #696969;
        }
    }
}
.merchant-container {
    .open-type {
        background: #fff;
    }
    padding: 0 30px;
    :deep(.van-cell) {
        height: 112px;
        box-sizing: border-box;
        border-bottom: 1px solid #f4f5f5;
        padding-left: 0;
        padding-right: 0;
        display: flex;
        align-items: center;
        position: initial;
    }
    :deep(.van-cell__title) {
        font-size: 30px;

        color: #191919;
    }
    :deep(.van-cell__value),
    :deep(.field__control) {
        color: #191919;
        font-size: 30px;
    }
    :deep(.contract) {
        border-bottom: 0;
        position: initial;
    }

    :deep(.contractTip) {
        margin-top: -10px;
    }

    .contract-desc {
        background: #ededed;
        padding: 4px 30px 20px 30px;
        font-size: 24px;
        border-radius: 8px;
        .item {
            display: flex;
            justify-content: space-between;
            padding-top: 16px;
            .label {
                color: #696969;
            }
            .val {
                color: #191919;
            }
        }
    }

    .arrow-tip {
        width: 0;
        height: 0;
        border-right: 20px solid transparent;
        border-bottom: 20px solid #ededed;
        border-left: 20px solid transparent;
        margin-left: 54px;
    }

    .collapse-arrow {
        background: #f4f4f4;
        border-radius: 0px 0px 4px 4px;
        text-align: center;
        img {
            width: 22px;
            height: 12px;
        }
    }

    .divider {
        margin-top: 18px;
        border-bottom: 1px solid #f4f5f5;
    }
}
</style>
