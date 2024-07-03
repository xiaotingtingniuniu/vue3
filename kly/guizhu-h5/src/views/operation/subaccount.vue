<template>
    <div class="my-operation-page mine-content">
        <van-nav-bar title="用户设备管理" fixed placeholder left-arrow @click-left="goBackN" />
        <div class="operation-box">
            <van-pull-refresh v-model="loading" success-text="刷新成功" @refresh="onRefresh">
                <div>
                    <div class="operation-card">
                        <div class="right-account">
                            <div class="right-accountBox">
                                <img :src="labelw" alt="" />
                                <div class="account-text" v-if="Number(props.merchantSubType) === 1">代运营商</div>
                                <div class="account-text" v-if="Number(props.merchantSubType) === 2">补货员</div>
                                <div class="account-text" v-if="Number(props.merchantSubType) === 3">分账人</div>
                            </div>
                        </div>
                        <div class="userInfo">
                            <div class="user-name">{{ props.merchantSubName }}</div>
                            <div class="user-mobile">
                                <img :src="phonefill" alt="" />
                                <span>{{ props.phoneMobile.replace(/^\s+|\s+$|\s+/g, '') }}</span>
                            </div>
                        </div>
                        <div class="operation-list" v-for="(item, index) in showOperationList" :key="index">
                            <span class="equipment-name">{{ item.deviceCode }}</span>
                            <div class="operation-btn">
                                <span @click="unBind(item)" class="unbind">{{ item.bindStatusDesc }}</span>
                                <span @click="openDetails(item)" class="op-details">查看详情</span>
                            </div>
                        </div>
                    </div>
                </div>
            </van-pull-refresh>
            <div class="operation-card">
                <div class="userInfo active-range">
                    <div class="tip">允许激活合同货柜范围</div>
                    <div class="tip" @click="addDevicePoint"><img src="../../assets/device/add.png" /></div>
                </div>
                <div class="operation-list">
                    <div class="equipment-name active-range-tip"><span class="tip">说明：</span>如果代运营商该范围为空，代运营无法激活设备，但不影响您给代运营商直接绑定设备。</div>
                </div>
            </div>
        </div>
        <div class="button-box-add" v-if="props.canAdd !== '1'">
            <van-button color="#FE7E41" block @click="addUserOperation()" text="添加设备" />
        </div>
        <div class="button-box-height"></div>
        <van-popup v-model:show="classification" position="bottom">
            <van-picker item-height="40px" title="请选择货柜后续运营计划" cancel-button-text="下一步" confirm-button-text="下一步" :columns="enumerationcl" @confirm="onEnumerationcl($event)" @cancel="classification = false" />
        </van-popup>
    </div>
</template>
<script setup>
import { computed, reactive, ref, toRefs } from 'vue'
import { Dialog, Toast } from 'vant'
import { useRouter } from 'vue-router'
import { getBindDeviceList, getUnbindDeviceList, unbindDevice, getMerchantCollectAbility, agentContractQuery } from '@/api/subaccountnumber.js'
import { useStore } from 'vuex'
import labelw from '@/assets/labelw.png'
import phonefill from '@/assets/phonefill.png'
import { newPage } from '@/utils/composables'

const store = useStore()
const userInfoV = computed(() => store.state.token)
const router = useRouter()
const props = defineProps(['merchantSubName', 'merchantSubType', 'realRight', 'merchantSubId', 'phoneMobile', 'canAdd'])

const state = reactive({
    showOperationList: [],
    formData: {
        enumerationclCode: ''
    }
})
const { showOperationList } = toRefs(state)

// 解除绑定
const checked = ref('') // 设备id
const contractNo = ref('') // 合同编号
const pointId = ref() // 点位id
const classification = ref(false)
const unBind = (val) => {
    checked.value = val.deviceCode
    contractNo.value = val.contractNo
    pointId.value = val.pointId
    if (Number(props.merchantSubType) === 1) {
        // 代运营商
        classification.value = true // 没物权
    } else if (Number(props.merchantSubType) === 2) {
        // 补货员
        Dialog.confirm({
            message: '确认补货员没有正在进行的任务，以免影响设备操作',
            messageAlign: 'center',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            confirmButtonColor: '#FE7E41',
            cancelButtonColor: '#000000'
        }).then(() => {
            getUnbindDeviceReplenishman()
        })
    } else {
        // 3-分账人
        Dialog.confirm({
            message: '确认分账人没有正在进行的任务，以免影响设备操作',
            messageAlign: 'center',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            confirmButtonColor: '#FE7E41',
            cancelButtonColor: '#000000'
        }).then(() => {
            getUnbindDeviceReplenishman()
        })
    }
}
const enumerationcl = [
    { text: '柜主继续运营', code: 1 },
    { text: '换绑其他运营商', code: 2 },
    { text: '停止货柜运营', code: 3 }
]

// 下一步
const operationQ = ref('')
const onEnumerationcl = async (val) => {
    operationQ.value = val.code
    state.formData.enumerationclCode = val.code
    if (state.formData.enumerationclCode === 1) {
        const { code } = await getMerchantCollectAbility()
        if (code === 'ST0001') {
            Dialog.confirm({
                message: '请您先开通收款能力',
                messageAlign: 'center',
                confirmButtonText: '去开通',
                cancelButtonText: '继续解绑',
                confirmButtonColor: '#FE7E41',
                cancelButtonColor: '#000000',
                closeOnClickOverlay: true
            })
                .then(() => {
                    router.push({ name: 'collect-money-setting' })
                })
                .catch(() => {
                    getUnbindDevice()
                })
        } else {
            getUnbindDevice()
        }
    } else if (state.formData.enumerationclCode === 2) {
        router.push({ name: 'agentoperator-list', params: { merchantSubId: props.merchantSubId, deviceNo: checked.value } })
    } else if (state.formData.enumerationclCode === 3) {
        Dialog.alert({
            message: '货柜将被锁定，无法交易，后续可在设备管理中解锁设备',
            confirmButtonColor: '#FE7E41'
        }).then(() => {
            getUnbindDevice()
            classification.value = false
        })
    } else {
        classification.value = false
    }
}

// 下拉刷新
const loading = ref(false)
const onRefresh = () => {
    getSubLevelList()
}

const getSubLevelList = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        token: userInfoV.value ?? '',
        merchantSubId: props.merchantSubId,
        merchantType: 2,
        merchantSubType: Number(props.merchantSubType)
    }
    const { data, code } = await getBindDeviceList(params)
    if (Number(code) === 200) {
        Toast.clear()
        state.showOperationList = data.devices
    } else {
        Toast.fail({
            duration: 300,
            message: '加载失败'
        })
    }
    loading.value = false
}
getSubLevelList()

// 添加设备
const addUserOperation = () => {
    getDetails()
}
// 是否为分账人
const getDetails = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        token: userInfoV.value ?? '',
        merchantSubId: props.merchantSubId,
        merchantType: 2,
        merchantSubType: Number(props.merchantSubType)
    }
    const { code } = await getUnbindDeviceList(params)
    if (code === 'ST0001') {
        Dialog.confirm({
            message: '请先添加该子账号为分账人',
            messageAlign: 'center',
            confirmButtonText: '去添加分账人',
            cancelButtonText: '取消',
            confirmButtonColor: '#FE7E41',
            cancelButtonColor: '#000000'
        }).then(() => {
            router.push({ name: 'collect-money-setting', params: {} })
        })
    } else if (code === 'ST0002') {
        Dialog.confirm({
            message: '请该子账号注册收款人',
            messageAlign: 'center',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            confirmButtonColor: '#FE7E41',
            cancelButtonColor: '#000000'
        })
    } else {
        router.push({
            name: 'operation-account-add',
            params: {
                merchantSubId: props.merchantSubId,
                merchantSubType: props.merchantSubType
            }
        })
    }
}

// 解绑操作
const getUnbindDevice = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        token: userInfoV.value ?? '',
        merchantSubId: props.merchantSubId,
        merchantType: 2,
        deviceNo: checked.value, // 设备编码
        unBindType: operationQ.value,
        merchantSubType: Number(props.merchantSubType)
    }
    const { code, message } = await unbindDevice(params)
    if (operationQ.value === 1) {
        if (Number(code) === 200) {
            Dialog.alert({
                message: '解绑成功，货柜后续将由您继续运营',
                confirmButtonColor: '#FE7E41'
            }).then(() => {
                classification.value = false
            })
            getSubLevelList()
        } else if (code === 'ST0001') {
            Toast(message)
        }
    } else {
        if (Number(code) === 200) {
            Toast('解绑设备成功')
            getSubLevelList()
        }
    }
}
// 补货员解绑操作
const getUnbindDeviceReplenishman = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        token: userInfoV.value ?? '',
        merchantSubId: props.merchantSubId,
        merchantType: 2,
        deviceNo: checked.value, // 设备编码
        unBindType: 4,
        merchantSubType: Number(props.merchantSubType)
    }
    const { code } = await unbindDevice(params)
    if (Number(code) === 200) {
        Toast('解绑设备成功')
        getSubLevelList()
    }
}

// 设备详情
const openDetails = async (val) => {
    newPage(`/device/device-detail?index=${val.deviceCode}&target=detail&type=sonaccount&showNavbar=0`, {
        index: val.deviceCode,
        target: 'detail',
        type: 'sonaccount'
    })
}
const goBackN = () => {
    router.back()
}

// 设备范围
const addDevicePoint = async () => {
    const params = {
        merchantSubId: props.merchantSubId
    }
    const { code, data } = await agentContractQuery(params)
    if (Number(code) === 200) {
        if (data.length) {
            router.push({
                path: 'active-range-list',
                name: 'active-range-list',
                query: {
                    merchantSubId: props.merchantSubId
                }
            })
        } else {
            router.push({
                path: 'active-range',
                name: 'active-range',
                query: {
                    merchantSubId: props.merchantSubId
                }
            })
        }
    }
}
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

:deep(.van-nav-bar .van-icon) {
    font-size: 35px;
    color: #000;
    font-weight: bold;
}
:deep(.van-nav-bar__text) {
    font-size: 30px;
    color: #fe7e41;
    font-weight: 400;
}
:deep(.van-nav-bar .van-icon) {
    font-size: 35px;
    color: #000;
    font-weight: bold;
}
:deep(.van-nav-bar__text) {
    font-size: 30px;
    color: #fe7e41;
    font-weight: 400;
}
.my-operation-page {
    min-height: 100vh;
    background: #f7f7f7;
    .operation-box {
        :deep(.van-nav-bar .van-icon) {
            color: #000000;
        }

        :deep(.van-nav-bar__content) {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            height: 88px;
            background: #fff;
            font-weight: 600;
            color: #000000;
            line-height: 48px;
        }

        .top-box {
            width: 100%;
            font-size: 34px;
            font-weight: 600;
            color: #000000;
            height: 88px;
        }

        .operation-card {
            background: #ffffff;
            border-radius: 8px;
            margin: 20px 24px 0;
            overflow: hidden;
            position: relative;
            .userInfo {
                width: 100%;
                height: 82px;
                box-sizing: border-box;
                padding: 0 30px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .user-name {
                    font-size: 30px;
                    font-weight: 700;
                    color: #191919;
                }
                .user-mobile {
                    margin-left: 20px;
                    width: 180px;
                    height: 30px;
                    background: #ededed;
                    border-radius: 200px 6px 6px 6px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                    padding-left: 10px;
                    img {
                        width: 10px;
                        height: 10px;
                        margin-right: 10px;
                    }
                    span {
                        font-size: 20px;
                        color: #999990;
                    }
                }
            }

            .active-range {
                display: flex;
                justify-content: space-between;
                color: #fe8a52;
                font-size: 26px;
                .tip {
                    img {
                        padding-top: 10px;
                        width: 32px;
                        height: 32px;
                    }
                }
            }

            .operation-list {
                padding: 34px 30px;
                width: 100%;
                box-sizing: border-box;
                border-top: 1px solid #f4f5f5;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .equipment-name {
                    font-size: 28px;
                    font-weight: 400;
                    color: #191919;
                }
                .active-range-tip {
                    font-size: 22px;
                    color: #696969;
                    .tip {
                        color: #fe8a52;
                    }
                }
                .operation-btn {
                    width: max-content;
                    .unbind {
                        padding: 6px 16px;
                        border-radius: 8px;
                        font-size: 22px;
                        color: #fe8a52;
                        border: 1px solid #fe8a52;
                        box-sizing: border-box;
                    }
                    .unbind-in {
                        width: 128px;
                        height: 48px;
                        color: #ff1e19;
                        font-size: 28px;
                    }
                    .op-details {
                        padding: 6px 16px;
                        border-radius: 8px;
                        font-size: 22px;
                        color: #696969;
                        border: 1px solid #696969;
                        box-sizing: border-box;
                        margin-left: 20px;
                    }
                }
            }
            .btn-equipment {
                margin-top: 6px;
                border-top: 1px solid #f4f5f5;
                box-sizing: border-box;
                width: 100%;
                padding: 10px 32px;
                display: flex;
                justify-content: flex-end;
                :deep(.van-button--block) {
                    padding: 0;
                    width: 116px;
                    height: 48px;
                    font-size: 22px;
                    border-radius: 46px;
                }
            }
            .btn-no {
                width: 100%;
                height: 32px;
            }
            .operation-card-box {
                box-sizing: border-box;
                width: 100%;
                padding: 0 32px;
            }
            .right-account {
                position: absolute;
                top: 0;
                right: 0;
                width: 118px;
                height: 36px;
                .right-accountBox {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    .account-text {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 118px;
                        height: 36px;
                        line-height: 36px;
                        text-align: center;
                        font-size: 20px;
                        display: inline;
                        color: #ffffff;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .operation-state1 {
                padding: 0 12px;
                height: 34px;
                line-height: 34px;
                color: #fe7e41;
                background: #ffe8dd;
                border-radius: 19px;
                font-size: 20px;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .operation-state2 {
                padding: 0 12px;
                height: 34px;
                line-height: 34px;
                color: #69925a;
                background: #e5f7df;
                border-radius: 19px;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .operation-state3 {
                padding: 0 12px;
                height: 34px;
                line-height: 34px;
                color: #ff2442;
                background: #ffd9de;
                border-radius: 19px;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .operation-state4 {
                padding: 0 12px;
                height: 34px;
                line-height: 34px;
                color: #a2a7b0;
                background: #ededed;
                border-radius: 19px;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .btn-three-fun {
                display: flex;
                justify-content: space-between;
                margin-top: 13px;
                align-items: baseline;
                .user-phone {
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #a2a7b0;
                }
                .btn-three-right {
                    width: max-content;
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                }
            }

            .icon-box:first-child {
                margin-left: 0;
            }

            .icon-box {
                width: max-content;
                display: flex;
                align-items: center;
                margin-left: 40px;

                .edit {
                    width: 27px;
                    height: 27px;
                    margin-right: 6px;
                }

                .list-text {
                    color: #a2a7b0;
                    font-size: 22px;
                    width: max-content;
                }
            }

            .operation-card-left {
                width: max-content;

                .operation-card-bottom {
                    width: max-content;
                    height: 40px;
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #191919;
                    line-height: 40px;
                    display: flex;

                    .user-names {
                        width: max-content;
                        margin-right: 20px;
                        font-size: 28px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 700;
                        color: #191919;
                    }
                }
            }

            .operation-card-right {
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                display: flex;
                align-items: center;
                padding: 0 var(--van-padding-md);
                font-size: var(--van-font-size-md);
            }
        }
    }

    .no-data {
        // display: flex;
        // flex-direction: column;
        // align-items: center;
        .van-image {
            width: max-content;
            height: 196px;
            margin-top: 220px;
        }

        .no-data-tip {
            font-size: 32px;
            font-weight: 400;
            color: #666666;
            margin-top: 34px;
        }
    }

    .button-box-add {
        // background-color: #fff;
        padding: 16px 60px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding-bottom: calc(16px + constant(safe-area-inset-bottom));
        padding-bottom: calc(16px + env(safe-area-inset-bottom));

        .van-button {
            height: 92px;
            border-radius: 46px;
            font-size: 32px;
            font-weight: 500;
            color: #ffffff;
        }
    }

    .bottom-btn-edit {
        background-color: #fff;
        padding: 16px 40px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding-bottom: calc(16px + constant(safe-area-inset-bottom));
        padding-bottom: calc(16px + env(safe-area-inset-bottom));

        .edit-left {
            display: inline-block;
            font-size: var(--van-font-size-md);

            .edit {
                width: 36px;
                height: 36px;
                margin-left: 24px;
            }

            .edit-left-text {
                font-size: 32px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 600;
                color: #222222;
                line-height: 44px;
                display: inline-block;
                margin-left: 16px;
                margin-right: 300px;
            }
        }

        .edit-right {
            font-size: 32px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #222222;
            line-height: 44px;
            border-radius: 40px;
            border: 1px solid #999999;
            display: inline-block;
            right: 0;
            padding: 18px 68px;
            bottom: 36px;
        }

        .no-checked {
            color: #b0b0b0;
            border: 1px solid #b0b0b0;
        }
    }

    .button-box-height {
        width: 100%;
        height: 112px;
        padding-bottom: 16px;
        padding-bottom: calc(16px + constant(safe-area-inset-bottom));
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
    }
}

:deep(.van-nav-bar__title) {
    font-size: 34px;
    font-weight: 600;
    color: #000000;
    height: 88px;
    line-height: 88px;
}

:deep(.van-icon-arrow-left:before) {
    font-size: 35px;
}
:deep(.van-pull-refresh) {
    overflow: visible;
}
// 弹出框
:deep(.van-picker__toolbar) {
    height: 130px;
    border-bottom: 1px solid #e7e7e7;
    box-sizing: border-box;
    position: relative;
}
:deep(.van-picker__confirm) {
    color: #fe7e41;
    font-size: 30px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 400;
}
:deep(.van-picker-column) {
    position: relative;
}
:deep(.van-picker-column::after) {
    position: absolute;
    top: 50%;
    right: 46px;
    transform: translate(0, -50%);
    display: block;
    content: '';
    width: 30px;
    height: 24px;
    background: url('../../assets/check-mark.png') no-repeat;
    background-size: 100% 100%;
}

:deep(.van-picker-column__item) {
    font-size: 34px;
}
:deep(.van-picker-column__item--selected) {
    color: #fe7e41;
}
:deep(.van-picker__title) {
    font-size: 32px;
    font-weight: 700;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #191919;
}

:deep(.van-picker__cancel) {
    color: #ffffff;
    position: relative;
}
:deep(.van-picker__cancel::after) {
    position: absolute;
    top: 50%;
    left: 30px;
    transform: translate(0, -50%);
    display: block;
    content: '';
    width: 46px;
    height: 46px;
    background: url('../../assets/close.png') no-repeat;
    background-size: 100% 100%;
}
</style>
