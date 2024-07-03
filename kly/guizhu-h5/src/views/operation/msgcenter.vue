<template>
    <div class="my-operation-page">
        {{checked}}
        <div class="operation-box">
            <van-pull-refresh
                v-model="loading"
                success-text="刷新成功"
                @refresh="onRefresh"
            >
                <div>
                    <div class="operation-card">
                        <div class="operation-list">
                            <div class="msg-box">
                                <div class="msg-top">
                                    <van-icon name="volume" color="#FE7E41" />
                                    <span>{{merchantName}}</span>
                                </div>
                                <div class="msg-bottom">
                                    <!-- 申请与您停止设备<span>{{taskId}}</span>合作 -->
                                    {{msgText}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-box-add" v-if="taskId !== ''">
                    <van-button color="#FE7E41" block @click="addUserOperation()" :text=" Number(taskStatus) === 0 ? '同意': '已同意'" :disabled=" Number(taskStatus) === 0 ? false : true" />
                </div>
                <div class="button-box-height"></div>
                <van-empty
                    v-if="taskId === ''"
                    :image="require('@/assets/no_data.png')"
                    image-size="120"
                    description="暂无消息"
                />
            </van-pull-refresh>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { Dialog, Toast } from 'vant'
import { auditUnbindApply, detailMsg } from '@/api/subaccountnumber.js'
// import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

// const store = useStore()
// const userInfoV = computed(() => store.state.token)
const route = useRoute()
const msgId = route.query.msgId
console.log(msgId)
const checked = ref('')

Toast.loading({
    message: '加载中...',
    forbidClick: true,
    duration: 0
})

// 下拉刷新
const loading = ref(false)
const onRefresh = () => {
    setTimeout(() => {
        getSubLevelList()
    }, 1000)
}

const userId = ref('') // 商户id
const taskId = ref('') // id
const accountType = ref('') // 账号类型1:主账号，2:子账号
const userType = ref('') // 用户类型 1: 代运营柜主 2: 补货员
const merchantName = ref('') // 用户名称
const msgTitle = ref('') // 消息信息
const taskStatus = ref('') // 任务状态 0待处理 1已处理
const msgText = ref('') // 消息内容
const deviceNo = ref('')// 设备编号
const getSubLevelList = async () => {
    const param = {
        msgId: msgId,
        // msgId: 57,
        busiCode: 'A1001002'
    }
    const { code, data } = await detailMsg(param)
    if (Number(code) === 200) {
        loading.value = false
        Toast.clear()
        userId.value = data.userId
        taskId.value = data.taskId
        accountType.value = data.accountType
        userType.value = data.userType
        merchantName.value = JSON.parse(data.extField).merchantName
        deviceNo.value = JSON.parse(data.extField).deviceNo
        msgTitle.value = data.msgTitle
        taskStatus.value = data.taskStatus
        msgText.value = data.msgText
        console.log(JSON.parse(data.extField), '----123--123123')
    }
}
getSubLevelList()

// 确认添加
const addUserOperation = (val) => {
    Dialog.confirm({
        message: '同意停止合作，代表后续您将无法查看并操作',
        messageAlign: 'center',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonColor: '#FE7E41',
        cancelButtonColor: '#000000'
    }).then(() => {
        console.log('确认')
        getAuditUnbindApply()
    }).catch(() => {
        console.log('取消')
    })
}

// 同意解绑
const getAuditUnbindApply = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        merchantSubId: userId.value, // 子商户id -
        merchantType: accountType.value, // 子商户类型 -
        deviceNo: deviceNo.value, // 设备编号
        merchantSubType: userType.value, // 子账号类型
        taskId: taskId.value // 任务 id
    }
    const { code } = await auditUnbindApply(params)
    if (Number(code) === 200) {
        getSubLevelList()
    }
}

</script>
<style lang="scss" scoped>
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
    min-height: 100vh;
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
                .msg-box {
                    width: 100%;
                    background: #FFFFFF;
                    padding: 30px;
                    border-radius: 8px;
                    margin-bottom: 48px;
                    box-sizing: border-box;
                    .msg-top {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        span {
                            margin-left: 16px;
                            font-size: 32px;
                            font-weight: 600;
                            color: #191919;
                        }
                    }
                    .msg-bottom {
                        box-sizing: border-box;
                        width: 100%;
                        padding-left: 48px;
                        margin-top: 16px;
                        font-size: 26px;
                        font-weight: 400;
                        color: #696969;
                    }
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
        padding: 0 60px;
        .van-button {
            height: 92px;
            border-radius: 46px;
            font-size: 30px;
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
</style>
