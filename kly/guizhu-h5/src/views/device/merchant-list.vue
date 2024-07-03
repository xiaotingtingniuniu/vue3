<template>
    <van-nav-bar title="点位" left-arrow right-text="新增">
        <template #left>
            <!-- <van-icon
                :name="require('@assets/return.png')"
                size="20"
                @click-left="onClickLeft"
            /> -->
        </template>
        <template #right>
            <div class="nav-right-icon" @click="showAddPopup">新增</div>
        </template>
    </van-nav-bar>
    <div class="salesDevices">

        <div class="so_main">
            <div class="so_tab">
                <van-tabs v-model:active="active" color="#FE7E41">

                    <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                        class="so_list"
                    >
                        <van-cell
                            class="listItem"
                            v-for="(item, index) in firmList"
                            :key="index"
                        >
                            <div class="item_title">
                                <div class="titleBox">
                                    <p class="title-name flx">
                                        {{ item.deviceName }}
                                    </p>
                                    <div class="title-number flx">
                                        <span class="title-style"
                                        >设备编号</span
                                        ><span>：{{ item.deviceNo }}</span
                                        ><span></span>
                                    </div>
                                    <div class="title-model flx">
                                        <span class="title-style"
                                        >设备型号：</span
                                        ><span>{{ item.deviceModelName }}</span
                                        ><span></span>
                                    </div>
                                    <div class="title-status flx">
                                        <span class="title-style"
                                        >设备状态：</span
                                        >
                                        <span>{{
                                            item.activeState===0?'在线':'离线'
                                        }}</span>

                                        <span></span>
                                    </div>

                                    <div class="title-number flx">
                                        <span class="title-style"
                                        >厂商设备编号</span
                                        ><span>：{{ item.manufacturerDeviceCode }}</span
                                        ><span></span>
                                    </div>
                                    <div class="title-number flx">
                                        <span class="title-style"
                                        >在线状态</span
                                        ><span>：{{ item.activeState===0?'在线':'离线' }}</span
                                        ><span></span>
                                    </div>
                                </div>
                            </div>
                        </van-cell>
                    </van-list>

                </van-tabs>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import { getFirmList } from '@/api/device'
import { useStore } from 'vuex'

const store = useStore()
console.log(store.state.userInfo)
// const router = useRouter()
const active = ref('orderList')
// const onClickLeft = () => history.back()
// 加载状态
const loading = ref(false)
const finished = ref(false)
const firmList = ref([])

const onLoad = () => {
    loading.value = false
}

onMounted(() => {
    getFirmLists()
})
// 新增 判断设备是否已激活 如果未激活跳转到激活页面
const showAddPopup = () => {
    // router.push({
    //     path: '/device/device-activation'
    // })
}
// 设备列表
const getFirmLists = async () => {
    const params = {
        busiCode: 'A1001022',
        appKey: 'A1001001',
        page: 1,
        pageSize: 20
    }
    const { list, code } = await getFirmList(params)
    if (Number(code) === 200) {
        firmList.value = list
    }
}

</script>
<style lang="scss">
@mixin flex {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.flx {
    display: flex;
    align-content: center;
}
$color999: #999;
$color19: #191919;
.salesDevices {
    width: 100%;
    height: 100%;
    background: #f4f5f5;
    display: flex;
    flex-direction: column;
    .so_head {
        width: 100%;
    }

    .so_main {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;

        .so_filter {
            width: 100%;
            // position: relative;
            .badgeBox {
                position: absolute;
                top: 20px;
                right: 30px;
            }
            .van-badge--top-right {
                min-width: 45px;
                height: 30px;
                transform: none;
                border-radius: 10px;
                top: -25px;
                right: -40px;
                line-height: 24px;
            }
            .van-tab--active {
                width: 152px;
                height: 62px;
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #fe7e41 !important;
                color: #fe7e41 !important;
            }
            .van-tabs__wrap {
                height: 112px;
                line-height: 112px;
            }
            .van-tabs__nav {
                border: none;
                background: #f4f5f5;
                margin-top: 25px;
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #696969;
                margin-left: 10px;
            }
            .van-tab--card {
                color: #696969;
                border: none;
                width: 152px;
                height: 62px;
                border-radius: 8px;
                border: 1px solid #bbbbbb;
                margin-left: 20px;
            }
        }
        .so_filters {
            width: 100%;
            .van-badge--top-right {
                width: 50px;
                height: 30px;
                transform: none;
                border-radius: 10px;
                // margin-top: -25px;
                // margin-left: 10px;
                top: -25px;
                right: -60px;
            }
            .van-tab--active {
                width: 152px;
                height: 62px;
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #fe7e41 !important;
                color: #fe7e41 !important;
            }
            .van-tabs__wrap {
                width: 50%;
                margin: auto;
                height: 112px;
                line-height: 112px;
            }
            .van-tabs__nav {
                border: none;
                background: #f4f5f5;
                margin-top: 25px;
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #696969;
                margin-left: 10px;
            }
            .van-tab--card {
                color: #696969;
                border: none;
                width: 152px;
                height: 62px;
                border-radius: 8px;
                border: 1px solid #bbbbbb;
                margin-left: 20px;
            }
        }
        // .searchList{
        //     width: 100%;
        //     height: 102px;
        //     background-color: #fff;
        //     display: flex;
        //     align-items: center;
        //     .search_date{
        //         border-radius: 8px;
        //         // margin-left: -10px;
        //         box-sizing: border-box;
        //         font-size: 24px;
        //         color: #BBBBBB;
        //         text-indent: 20px;
        //         width: 210px;
        //         .van-field{
        //             background: #F4F5F5;
        //             width: 210px;
        //             height: 62px;
        //             line-height: 59px;
        //             border-radius: 8px;
        //         }
        //         .van-field__control{
        //             margin-top: -15px;
        //         }
        //         .van-field__clear{
        //             margin-top: -23px;
        //         }
        //     }
        //     .searchTitle{
        //         height: 62px;
        //         background: #FE7E41;
        //         font-size: 13px;
        //         color:#fff;
        //         border-radius: 8px;
        //         border: 1px solid #FE7E41;
        //         line-height: 62px;
        //         font-size: 24px;
        //         font-family: PingFangSC-Regular, PingFang SC;
        //         font-weight: 400;
        //         // margin-right: 30px;
        //         margin-left: 20px;
        //     }
        // }
        .equipmentBox{
            width: 690px;
            height: 428px;
            background: #fff;
            margin-top: 20px;
            margin-left: 30px;
            margin-bottom: 30px;
            .outside{
                display: flex;
                justify-content: space-between;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                margin-top: 20px;
                .withinLeft{
                    color: #999999;
                    margin-left: 30px;
                }
                .withinRight{
                    width: 470px;
                    color: #191919;
                    margin-right: 30px;
                    text-align: right;
                }
            }
        }
        .so_search {
            width: 100%;
            height: 102px;
            background-color: #fff;
            display: flex;
            // justify-content: space-around;
            align-items: center;
            .search_date {
                border-radius: 8px;
                // margin-left: -20px;
                box-sizing: border-box;
                font-size: 24px;
                color: #bbbbbb;
                text-indent: 20px;
                width: 210px;
                .van-field {
                    background: #f4f5f5;
                    width: 210px;
                    height: 62px;
                    line-height: 59px;
                    border-radius: 8px;
                }
                .van-field__control {
                    margin-top: -15px;
                }
                .van-field__clear {
                    margin-top: -23px;
                }
            }
            .searchTitle {
                height: 62px;
                background: #fe7e41;
                font-size: 13px;
                color: #fff;
                border-radius: 8px;
                border: 1px solid #fe7e41;
                line-height: 62px;
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                margin-right: 30px;
            }
        }
        .so_list {
            width: 100%;
            flex: 1;
            padding: 20px 30px;
            box-sizing: border-box;
            .listItems {
                position: relative;
                width: 690px;
                // height: 331px;
                background-color: #fff;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                margin-bottom: 20px;
                padding: 0px;
                .item_title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    // padding: 20px;
                    box-sizing: border-box;
                    margin-top: 30px;
                    padding-left: 45px;
                    padding-right: 30px;
                    .titleBox {
                        .titleImg {
                            display: flex;
                            img {
                                width: 30px;
                                height: 30px;
                                margin-left: -15px;
                                margin-top: 5px;
                            }
                        }
                        p {
                            font-size: 28px;
                            font-family: PingFangSC-Medium, PingFang SC;
                            font-weight: 500;
                            color: #696969;
                            line-height: 33px;
                            margin-left: 25px;
                            margin-top: -29px;
                        }
                    }
                    // p{
                    //     font-size: 28px;
                    //     font-family: PingFangSC-Medium, PingFang SC;
                    //     font-weight: 500;
                    //     color: #696969;
                    //     line-height: 33px;
                    // }
                    .item_statu {
                        width: 120px;
                        height: 33px;
                        font-size: 24px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        text-align: right;
                        .item_paid {
                            color: #fe7e41;
                        }
                        .item_become {
                            color: #b0b0b0;
                        }
                        .item_handle {
                            color: #69925a;
                        }
                        .item_refuse {
                            color: #ff2442;
                        }
                    }
                }
                .item_content {
                    //    position: relative;
                    // border: 1px solid #000;
                    overflow: hidden;
                    // width: 100%;
                    font-size: 20px;
                    font-weight: 400;
                    color: #494849;
                    line-height: 28px;
                    letter-spacing: 1px;
                    // padding: 20px;
                    box-sizing: border-box;
                    flex: 1;
                    display: flex;
                    padding-right: 110px;
                    margin-top: 30px;
                    margin-left: 30px;
                    .item_img {
                        display: flex;
                        align-content: space-around;
                        align-items: center;
                        .img {
                            width: 120px;
                            height: 120px;
                            padding: 5px;
                            margin-right: 10px;
                            display: inline-block;
                        }
                    }
                    .item_imgs {
                        display: flex;
                        align-content: space-around;
                        align-items: center;
                        .img {
                            width: 124px;
                            height: 124px;
                            padding: 5px;
                            margin-right: 10px;
                            display: inline-block;
                        }
                    }
                    .item_count {
                        position: absolute;
                        right: 0;
                        width: 110px;
                        height: 136px;
                        line-height: 136px;
                        text-align: center;
                        // background: rgba(255, 255, 255, 0.5);
                        background: #fff;
                        color: #000;
                    }
                }
                .item_footer {
                    display: flex;
                    font-size: 22px;
                    font-weight: 400;
                    color: #b0b0b0;
                    line-height: 30px;
                    justify-content: space-between;
                    align-items: center;
                    // padding: 20px;
                    box-sizing: border-box;
                    border-top: solid 1px #f4f5f5;
                    margin-top: 10px;
                    padding: 30px 28px 20px 30px;
                    span {
                        width: 94px;
                        height: 40px;
                        font-size: 24px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 600;
                        color: #fe7e41;
                        line-height: 28px;
                    }
                }
            }
            .listItem {
                position: relative;
                width: 690px;
                height: 331px;
                background-color: #fff;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                margin-bottom: 20px;
                padding: 0px;
                .item_title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    // padding: 20px;
                    box-sizing: border-box;
                    margin-top: 30px;
                    .titleBox {
                        margin-left: 32px;
                        padding-left: 20px;
                        .titleImg {
                            display: flex;
                            img {
                                width: 30px;
                                height: 28px;
                                margin-left: -20px;
                                // margin-top: 10px;
                            }
                        }
                        p {
                            font-size: 28px;
                            font-family: PingFangSC-Medium, PingFang SC;
                            font-weight: 500;
                            color: #696969;
                            line-height: 33px;
                            margin-left: 20px;
                            margin-top: -30px;
                        }
                    }
                    .item_statu {
                        width: 120px;
                        height: 33px;
                        font-size: 24px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        text-align: right;
                        margin-right: 30px;
                        .item_paid {
                            color: #fe7e41;
                        }
                        .item_become {
                            color: #b0b0b0;
                        }
                        .item_handle {
                            color: #69925a;
                        }
                        .item_refuse {
                            color: #ff2442;
                        }
                    }
                }
                .slide {
                    overflow-x: scroll;
                    display: flex;
                }
                .slideBox {
                    overflow-x: scroll;
                    display: flex;
                }
                .item_content {
                    position: relative;
                    // border: 1px solid #000;
                    overflow: hidden;
                    // width: 100%;
                    font-size: 20px;
                    font-weight: 400;
                    color: #494849;
                    line-height: 28px;
                    letter-spacing: 1px;
                    // padding: 20px;
                    box-sizing: border-box;
                    flex: 1;
                    display: flex;
                    padding-right: 110px;
                    margin-top: 30px;
                    margin-left: 30px;
                    .item_img {
                        display: flex;
                        align-content: space-around;
                        align-items: center;
                        .img {
                            width: 120px;
                            height: 120px;
                            padding: 5px;
                            margin-right: 10px;
                            display: inline-block;
                        }
                    }
                    .item_imgs {
                        display: flex;
                        align-content: space-around;
                        align-items: center;
                        .img {
                            width: 124px;
                            height: 124px;
                            padding: 5px;
                            margin-right: 10px;
                            display: inline-block;
                        }
                    }
                    .item_count {
                        position: absolute;
                        right: 0;
                        width: 110px;
                        height: 136px;
                        line-height: 136px;
                        text-align: center;
                        // background: rgba(255, 255, 255, 0.5);
                        background: #fff;
                        color: #000;
                    }
                }
                .item_footer {
                    display: flex;
                    font-size: 22px;
                    font-weight: 400;
                    color: #b0b0b0;
                    line-height: 30px;
                    justify-content: space-between;
                    align-items: center;
                    // padding: 20px;
                    box-sizing: border-box;
                    border-top: solid 1px #f4f5f5;
                    margin-top: 10px;
                    // padding-top: 27px;
                    padding: 35px 30px 20px 30px;
                    span {
                        width: 94px;
                        height: 40px;
                        font-size: 24px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 610;
                        color: #fe7e41;
                        line-height: 28px;
                        margin-top: 27px;
                    }
                }
            }
        }
        .title-number {
            display: inline-block;
            color: $color19;
            .title-style {
                color: $color999;
            }
        }
    }
    .van_tab_line {
        color: #fe7e41;
    }
    .input {
        width: 365px;
        height: 62px;
        background: #f4f5f5;
        border-radius: 8px;
        margin-left: 8px;
        // float: left;
    }
    .van-search {
        margin-top: -10px;
        height: 78px;
        width: 365px;
    }
    .van-haptics-feedback {
        color: #fe7e41;
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
    }
    .van-picker__cancel {
        color: #000;
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
    }
    .van-ellipsis {
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191919;
    }
    .van-tab--active {
        color: #fe7e41;
    }
    .moneyBox {
        width: 12px;
        height: 14px;
        margin-right: 5px;
        margin-top: 5px;
    }
    .van-field__left-icon {
        width: 24px;
        height: 24px;
        background: url('../../assets/replenishmentImg/search2x.png');
        background-size: 24px 24px;
        margin-top: 9px;
    }
    .van-icon-search:before {
        display: none;
    }
    .fieldClose {
        width: 210px;
        position: relative;
        .closeImg {
            width: 30px;
            height: 30px;
            position: absolute;
            top: 18px;
            right: 10px;
        }
    }
    .van-badge--dot {
        margin-top: 15px;
        margin-right: -13px !important;
    }
    .van-search__content {
        padding-left: 16px;
        padding-top: -1px;
        margin-top: 2px;
        height: 62px;
        border-radius: 8px;
    }
    .van-popup--bottom {
        height: 45% !important;
    }
}
</style>
