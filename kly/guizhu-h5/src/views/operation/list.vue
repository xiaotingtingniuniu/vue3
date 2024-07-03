<template>
    <div class="my-operation-page mine-content">
        <van-nav-bar title="用户列表" right-text="添加" fixed placeholder left-arrow @click-left="closePage" @click-right="addUserOperation"> </van-nav-bar>
        <div class="operation-box">
            <!-- <van-nav-bar title="代运营商子账号" left-arrow @click-left="onClickLeft" /> -->
            <van-pull-refresh v-model="loading" success-text="刷新成功" @refresh="onRefresh">
                <div v-if="showOperationList.length">
                    <div class="operation-card" v-for="(item, index) in showOperationList" :key="index">
                        <div class="operation-card-box">
                            <div class="btn-three-fun">
                                <div class="btn-three-left">
                                    <div class="user-names">{{ item.merchantSubName }}</div>
                                    <div class="user-phone">{{ item.phoneMobile }}</div>
                                </div>
                                <div class="btn-three-right">
                                    <div @click="toDetailOperationEdit(item)" class="icon-box" v-if="Number(item.status) === 3">
                                        <van-image class="icon--unselect edit list-img" :src="require('@/assets/edit.png')" />
                                        <span class="list-text">修改</span>
                                    </div>
                                    <div @click="toDetailOperation(item)" class="icon-box" v-if="Number(item.status) === 1 || Number(item.status) === 2">
                                        <van-image class="icon--unselect edit list-img" :src="require('@/assets/bianji_1.png')" />
                                        <span class="list-text">详情</span>
                                    </div>
                                    <div @click="Deactivate(item)" class="icon-box" v-if="Number(item.status) === 2">
                                        <van-image class="icon--unselect edit list-img" :src="require('@/assets/stop.png')" />
                                        <span class="list-text">终止</span>
                                    </div>
                                </div>
                            </div>
                            <div class="operation-tags">
                                <div class="operation-tag operation-status">
                                    <template v-if="Number(item.status) === 1">待审核</template>
                                    <template v-if="Number(item.status) === 2">已审核</template>
                                    <template v-if="Number(item.status) === 3">已驳回</template>
                                    <template v-if="Number(item.status) === 4">已终止</template>
                                </div>
                                <div class="operation-tag operation-account">
                                    <template v-if="Number(item.merchantSubType) === 1">代运营商</template>
                                    <template v-if="Number(item.merchantSubType) === 2">补货员</template>
                                    <template v-if="Number(item.merchantSubType) === 3">分账人</template>
                                </div>
                            </div>
                        </div>
                        <div v-if="Number(item.status) === 2" class="btn-equipment">
                            <van-button color="linear-gradient(to right, #FE7E41, #FF5D0F, #FF5C0E)" block @click="subaccount(item)" text="设备管理" />
                        </div>
                        <div v-else class="btn-no"></div>
                    </div>
                </div>
                <van-empty v-if="!showOperationList.length" :image="require('@/assets/no_data.png')" image-size="120" description="暂无代运营商账户" />
            </van-pull-refresh>
        </div>
        <!-- <div class="button-box-add">
            <van-button color="#FE7E41" icon="add-o" block @click="addUserOperation" text="添加" />
        </div> -->
        <div class="button-box-height"></div>
    </div>
</template>
<script setup>
import { computed, reactive, ref, toRefs } from 'vue'
import { Dialog, Toast } from 'vant'
import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { subLevelList, endisable } from '@/api/subaccountnumber.js'
import { useStore } from 'vuex'
import { closePage } from '@/utils/composables'
// import labelw from '@/assets/labelw.png'

const store = useStore()
const userInfoV = computed(() => store.state.token)
const accountName = computed(() => store.state.accountName)
const router = useRouter()

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
    // setTimeout(() => {
    getSubLevelList()
    // }, 1000)
}

const getSubLevelList = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        token: userInfoV.value ?? ''
    }
    const { data, code } = await subLevelList(params)
    if (Number(code) === 200) {
        loading.value = false
        Toast.clear()
        state.showOperationList = data || []
        geTel()
    } else {
        loading.value = false
        Toast.fail({
            duration: 300,
            message: '加载失败'
        })
    }
}
getSubLevelList()

const geTel = () => {
    state.showOperationList.length &&
        state.showOperationList.map((tel) => {
            tel.phoneMobile = tel.phoneMobile.replace(/(\d{3})(\d*)/, ($, $1, $2) => $1 + ' ' + $2.replace(/\d{4}|\d+/g, ($) => $ + ' ').trim()).trim()
        })
}
// 编辑
const toDetailOperationEdit = async (val) => {
    router.push({ name: 'operation-form', params: { busiMerchantId: val?.busiMerchantId ?? 'emty', merchantSubId: val?.merchantSubId ?? 'emty', merchantSubType: val?.merchantSubType ?? 'emty' } })
}
// const toDetailOperationEdit = async (val) => {
//     router.push({ name: 'operation-edit', params: { busiMerchantId: val?.busiMerchantId ?? 'emty', merchantSubId: val?.merchantSubId ?? 'emty', merchantSubType: val?.merchantSubType ?? 'emty' } })
// }
// 详情
const toDetailOperation = async (val) => {
    router.push({ name: 'operation-detail', params: { busiMerchantId: val?.busiMerchantId ?? 'emty', merchantSubId: val?.merchantSubId ?? 'emty', merchantSubType: val?.merchantSubType ?? 'emty' } })
}
// 新增
const addUserOperation = (val) => {
    // newPage('/operation/operation-add')
    router.push({ name: 'operation-form' })
}

// 终止
const Deactivate = (val) => {
    if (val.merchantSubType === 1) {
        Dialog.confirm({
            message: '确认终止与运营商合作',
            messageAlign: 'center',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            confirmButtonColor: '#FE7E41',
            cancelButtonColor: '#000000'
        })
            .then(() => {
                console.log('确认')
                getEndisable(val)
            })
            .catch(() => {
                console.log('取消')
            })
    } else {
        Dialog.confirm({
            message: '请确认补货员没有正在进行的任务，以免影响设备操作',
            messageAlign: 'center',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            confirmButtonColor: '#FE7E41',
            cancelButtonColor: '#000000'
        })
            .then(() => {
                console.log('确认')
                getEndisable(val)
            })
            .catch(() => {
                console.log('取消')
            })
    }
}

// 设备管理
const subaccount = (val) => {
    router.push({
        name: 'operation-account',
        params: {
            merchantSubId: val?.merchantSubId ?? 'emty',
            merchantSubType: val?.merchantSubType ?? 'emty',
            phoneMobile: val?.phoneMobile ?? 'emty',
            merchantSubName: val?.merchantSubName ?? 'emty',
            realRight: val?.realRight ?? 'emty',
            canAdd: val?.canAdd ?? 'emty'
        }
    })
    // newPage(`/operation/operation-account?merchantSubId=${val?.merchantSubId}&merchantSubType=${val?.merchantSubType}&phoneMobile=${val?.phoneMobile}&merchantSubName=${val?.merchantSubName}&realRight=${val?.realRight}`)
}

// 停用
const getEndisable = async (val) => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        merchantSubId: val.merchantSubId,
        operator: accountName?.value ?? '',
        busiMerchantId: val.busiMerchantId,
        token: userInfoV.value ?? '',
        account: val.merchantSubId,
        mobile: val.phoneMobile.replace(/^\s+|\s+$|\s+/g, ''),
        state: 0,
        merchantSubType: val.merchantSubType
    }
    const { code } = await endisable(params)
    console.log(code, 'code')
    if (Number(code) === 200) {
        // state.showOperationList = data
        Toast('解绑成功')
        setTimeout(() => {
            getSubLevelList()
        }, 1000)
    } else {
        Dialog.confirm({
            message: '请解绑该用户的所有设备',
            messageAlign: 'center',
            confirmButtonText: '去解绑',
            cancelButtonText: '取消',
            confirmButtonColor: '#FE7E41',
            cancelButtonColor: '#000000'
        })
            .then(() => {
                console.log('去解绑')
                // newPage(`/operation/operation-account?merchantSubId=${val?.merchantSubId}&merchantSubType=${val?.merchantSubType}&phoneMobile=${val?.phoneMobile}&merchantSubName=${val?.merchantSubName}&realRight=${val?.realRight}`)
                router.push({
                    name: 'operation-account',
                    params: {
                        merchantSubId: val?.merchantSubId ?? 'emty',
                        merchantSubType: val?.merchantSubType ?? 'emty',
                        phoneMobile: val?.phoneMobile ?? 'emty',
                        merchantSubName: val?.merchantSubName ?? 'emty',
                        realRight: val?.realRight ?? 'emty',
                        canAdd: val?.canAdd ?? 'emty'
                    }
                })
            })
            .catch(() => {
                console.log('取消')
            })
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
.my-operation-page {
    // min-height: 100vh;
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
            padding: 32px 0 0 0;
            margin: 20px 24px 0;
            overflow: hidden;
            position: relative;
            .btn-equipment {
                margin-top: 6px;
                border-top: 1px solid #f4f5f5;
                box-sizing: border-box;
                width: 100%;
                padding: 20px 32px;
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
                padding: 0 30px;
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
                color: #ffffff;
                background: #696969;
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
                // margin-top: 13px;
                align-items: baseline;
                .btn-three-left {
                    display: flex;
                    height: 40px;
                    line-height: 40px;
                    .user-names {
                        // height: 40px;
                        font-size: 28px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: #191919;
                        // line-height: 40px;
                    }
                    .user-phone {
                        padding: 0 10px 0 20px;
                        margin-top: 5px;
                        margin-left: 16px;
                        height: 30px;
                        line-height: 30px;
                        background: #ededed;
                        border-radius: 200px 6px 6px 6px;
                        font-size: 22px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #a2a7b0;
                        &::before {
                            content: '';
                            margin-right: 10px;
                            display: inline-block;
                            background: url('~@/assets/phone-icon.png') no-repeat;
                            width: 14px;
                            height: 14px;
                        }
                    }
                }
                .btn-three-right {
                    width: max-content;
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                }
            }
            .operation-tags {
                display: flex;
                padding: 16px 0;
                .operation-tag {
                    padding: 0 8px;
                    height: 32px;
                    line-height: 32px;
                    border-radius: 4px;
                    font-size: 20px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                }
                .operation-status {
                    border: 1px solid #999999;
                    color: #999999;
                }
                .operation-account {
                    margin-left: 8px;
                    border: 1px solid #fe7e41;
                    color: #fe7e41;
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
                    // height: 40px;
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
                        max-width: 420px;
                        word-wrap: break-word;
                        word-break: break-all;
                        // overflow: hidden;
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
</style>
