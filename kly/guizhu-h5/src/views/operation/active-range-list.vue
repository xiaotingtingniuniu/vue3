<template>
    <div class="my-operation-page mine-content">
        <van-nav-bar title="允许激活合同货柜范围" fixed placeholder left-arrow @click-left="goBackN" />
        <div class="operation-box">
            <van-pull-refresh v-model="loading" success-text="刷新成功" @refresh="onRefresh">
                <div v-for="(item, index) in showOperationList" :key="'card' + index">
                    <div class="operation-card">
                        <div class="userInfo">
                            <div class="user-name">合同号：{{ item.contractCode }}</div>
                        </div>
                        <div class="operation-list" v-for="(point, index) in item.pointList" :key="'point' + index">
                            <span class="equipment-name">{{ point.pointId }}</span>
                        </div>
                    </div>
                </div>
            </van-pull-refresh>
        </div>
        <div class="button-box-add">
            <van-button color="#FE7E41" block @click="addContract()" text="添加合同货柜ID" />
        </div>
        <div class="button-box-height"></div>
    </div>
</template>
<script setup>
import { reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { agentContractQuery } from '@/api/subaccountnumber.js'

const router = useRouter()
const route = useRoute()
const state = reactive({
    showOperationList: [],
    formData: {
        enumerationclCode: ''
    }
})
const { showOperationList } = toRefs(state)

const getList = async () => {
    const params = {
        merchantSubId: route.query.merchantSubId
    }
    const { code, data } = await agentContractQuery(params)
    if (Number(code) === 200) {
        state.showOperationList = data
    }
}

getList()

// 添加合同跳转到货柜选择列表页面
const addContract = () => {
    router.push({
        path: 'active-range',
        name: 'active-range',
        query: {
            merchantSubId: route.query.merchantSubId
        }
    })
}

const goBackN = () => {
    router.back()
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
                    font-weight: 400;
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
