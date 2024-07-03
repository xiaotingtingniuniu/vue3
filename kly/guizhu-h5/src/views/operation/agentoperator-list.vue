<template>
    <div class="my-operation-page mine-content">
        <van-nav-bar
            title="选择代运营商"
            fixed
            placeholder
            left-arrow
            @click-left="goBackN"
        >
        </van-nav-bar>
        <div class="operation-box">
            <van-pull-refresh
                v-model="loading"
                success-text="刷新成功"
                @refresh="onRefresh"
            >
                <div class="warning">
                    <img :src="warning" alt="">
                    <span>此列表仅提供有收款能力的代运营商</span>
                </div>
                <div>
                    <div class="operation-card">
                        <div class="operation-list">
                            <van-radio-group v-model="checked">
                                <van-radio :name="item.subLedgerId" v-for="(item, index) in showOperationList" :key="index">
                                    <div class="op-details">
                                        {{item.name}}
                                    </div>
                                    <template #icon="props">
                                        <div class="group-left">
                                            <span class="equipment-name">{{ item.phoneMobile.replace(/(\d{3})(\d*)/, ($, $1, $2) => $1 + ' ' + $2.replace(/\d{4}|\d+/g, $ => $ + ' ').trim()).trim() }}</span>
                                            <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                        </div>
                                    </template>

                                </van-radio>
                            </van-radio-group>
                        </div>
                    </div>
                </div>
                <van-empty
                    v-if="!showOperationList.length"
                    :image="require('@/assets/no_data.png')"
                    image-size="120"
                    description="暂无设备列表"
                />
            </van-pull-refresh>
        </div>
        <div class="button-box-add">
            <van-button :color="checked === '' ? '#CCCCCC': '#FE7E41'" :disabled="checked === ''" block @click="addUserOperation()" text="确认添加" />
        </div>
        <div class="button-box-height"></div>
    </div>
</template>
<script setup>
import { computed, reactive, ref, toRefs } from 'vue'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { haveCollectOperator, unbindDevice } from '@/api/subaccountnumber.js'
import { useStore } from 'vuex'
const activeIcon = require('@/assets/mine/icon-checked.png')
const inactiveIcon = require('@/assets/mine/icon-check.png')
const warning = require('@/assets/warning.png')

const store = useStore()
const userInfoV = computed(() => store.state.token)
// const accountName = computed(() => store.state.accountName)
const router = useRouter()
const props = defineProps(['merchantSubId', 'deviceNo'])
console.log(props.deviceNo)
const checked = ref('')
const state = reactive({
    showOperationList: []
})
const { showOperationList } = toRefs(state)

// Toast.loading({
//     message: '加载中...',
//     forbidClick: true,
//     duration: 0
// })

// 下拉刷新
const loading = ref(false)
const onRefresh = () => {
    setTimeout(() => {
        getSubLevelList()
    }, 1000)
}

const getSubLevelList = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        merchantSubType: 1,
        token: userInfoV.value ?? '',
        merchantSubId: props.merchantSubId
    }
    const { data, code } = await haveCollectOperator(params)
    if (Number(code) === 200) {
        loading.value = false
        Toast.clear()
        state.showOperationList = data
    } else {
        loading.value = false
        Toast.fail({
            duration: 300,
            message: '加载失败'
        })
    }
}
getSubLevelList()

// 确认添加
const addUserOperation = (val) => {
    getUnbindDevice()
}
// 解绑操作
const getUnbindDevice = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        token: userInfoV.value ?? '',
        merchantType: 2,
        merchantSubId: props.merchantSubId,
        deviceNo: props.deviceNo, // 设备编码
        changeMerchantId: checked.value,
        unBindType: 2,
        merchantSubType: Number(props.merchantSubType)
    }
    const { code } = await unbindDevice(params)
    if (Number(code) === 200) {
        Toast('换绑成功')
        router.back()
    }
}
const goBackN = () => {
    router.back()
}
</script>
<style lang="scss" scoped>
.mine-content{
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #FE7E41;
    --van-nav-bar-title-font-size: 34px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
        .van-hairline--bottom:after{
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
    color: #FE7E41;
    font-weight: 400;
}
:deep(.van-nav-bar .van-icon) {
    font-size: 35px;
    color: #000;
    font-weight: bold;
}
:deep(.van-nav-bar__text) {
    font-size: 30px;
    color: #FE7E41;
    font-weight: 400;
}
.my-operation-page {
    // min-height: 100vh;
    background: #F7F7F7;
    .operation-box {
        .warning {
            width: 100%;
            box-sizing: border-box;
            padding: 0 30px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 34px;
            img {
                width: 32px;
                height: 32px;
                margin-right: 24px;
            }
            span {
                font-size: 24px;
                font-weight: 400;
                color: #696969;
            }
        }
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
            background: #F4F5F5;
            border-radius: 8px;
            margin: 34px 24px 0;
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
                    background: #EDEDED;
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
            .operation-list {
                width: 100%;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .group-left {
                    margin-top: 10px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-content: center;
                    box-sizing: border-box;
                    .img-icon {
                        width: 32px;
                        height: 32px;
                    }
                }
                .equipment-name {
                    font-size: 28px;
                    font-weight: 400;
                    color: #A2A7B0;
                }
                .op-details {
                    font-size: 28px;
                    font-weight: 700;
                    color: #191919;
                }
            }
            .btn-equipment {
                margin-top: 6px;
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
                color: #FE7E41;
                background: #FFE8DD;
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
                color: #69925A;
                background: #E5F7DF;
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
                color: #FF2442;
                background: #FFD9DE;
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
                color: #A2A7B0;
                background: #EDEDED;
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
                        color: #A2A7B0;
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
                    color: #A2A7B0;
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
            color: #FFFFFF;
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
            color: #B0B0B0;
            border: 1px solid #B0B0B0;
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
// 单选
:deep(.van-cell-group) {
    margin: 0;
}
:deep(.van-radio-group) {
    width: 100%;
    box-sizing: border-box;
}
:deep(.van-radio-group .van-radio) {
    width: 100%;
    padding: 30px 34px;
    box-sizing: border-box;
    flex-direction: column-reverse;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    border-radius: 8px;
    background: #ffffff;
}
:deep(.van-radio-group .van-radio .van-radio__label) {
    margin-left: 0;
}

:deep(.van-radio__icon) {
    width: 100%;
}
</style>
