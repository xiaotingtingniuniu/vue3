<template>
    <div class="device-management"></div>
</template>

<script setup>
import { pageRedirect } from '@/utils/composables'
const search = location.search.slice(1)
const jumpUrl = search
function splitPrams() {
    const arr = jumpUrl.split('?')[1].split('&')
    const obj = {}
    for (let i = 0; i < arr.length; i++) {
        const str = arr[i].split('=')
        obj[str[0]] = str[1]
    }
    return obj
}
const pramsObj = splitPrams()
if (pramsObj?.deviceFirstType === '20') {
    const url = `${window.location.origin}/multi-type-device/select-device-door?showNavbar=0&pageType=${pramsObj.pageType}&deviceName=${pramsObj.deviceName}&deviceCode=${pramsObj.deviceCode}&isNeedOpen=1`
    pageRedirect(url)
} else {
    pageRedirect(jumpUrl.replace('jumpUrl=', ''))
}
</script>
<style lang="scss" scoped>
.device-management {
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #fe7e41;
    --van-nav-bar-title-font-size: 34px;
    .van-nav-bar__placeholder {
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
    }
    .my-device {
        :deep(.van-tabs) {
            width: 100%;
            margin-top: 24px;
            .van-tabs__wrap {
                height: max-content;
                padding-bottom: 5px;
            }
            .van-tab--active {
                width: 152px;
                height: 62px;
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #fe7e41 !important;
                color: #fe7e41 !important;
            }
            .van-tabs__nav {
                border: none;
                background: #f4f5f5;
                font-size: 24px;
                font-weight: 400;
                color: #696969;
                margin-left: 10px;
                height: max-content;
            }
            .van-tab--card {
                color: #696969;
                border: none;
                width: 152px;
                height: 62px;
                border-radius: 8px;
                border: 1px solid #bbbbbb;
                margin-left: 20px;
                box-sizing: border-box;
            }
        }
        .van-pull-refresh {
            min-height: calc(100vh - 92px - 88px - 108px - 100px - var(--van-status-bar-height));
            .van-list {
                .cell-item {
                    margin: 20px 30px 0;
                    padding: 40px 30px;
                    background: #ffffff;
                    border-radius: 8px;
                    .device-name {
                        display: flex;
                        align-items: center;
                        margin-bottom: 28px;
                        font-size: 30px;
                        font-weight: 500;
                        color: #191919;
                        img {
                            width: 32px;
                            height: 34px;
                            margin-right: 14px;
                        }
                    }
                    .device-desc {
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        margin-top: 12px;
                        span {
                            color: #191919;
                        }
                        .signal {
                            color: #69925a;
                        }
                        .color0 {
                            color: #ff2442;
                        }
                        .updateTime {
                            font-size: 24px;
                            color: #999999;
                            margin-left: 40px;
                        }
                    }
                }
            }
        }
    }
    .approve-list {
        .van-pull-refresh {
            .van-list {
                .cell-item {
                    margin: 20px 30px;
                    background-color: #fff;
                    border-radius: 8px;
                    .item-title {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 22px 30px;
                        .item-title--text {
                            font-size: 28px;
                            font-weight: 400;
                            color: #191919;
                        }
                        .item-title--state {
                            font-size: 24px;
                            font-weight: 400;
                            color: #ff2442;
                        }
                        .state0 {
                            color: #fe7e41;
                        }
                        .state1 {
                            color: #69925a;
                        }
                    }
                    .item-content {
                        padding: 8px 30px 30px;
                        .outside {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-top: 16px;
                            .withinLeft {
                                font-size: 26px;
                                font-weight: 400;
                                color: #b0b0b0;
                            }
                            .withinRight {
                                font-size: 26px;
                                font-weight: 400;
                                color: #191919;
                            }
                        }
                    }
                }
            }
        }
    }
    .empty {
        text-align: center;
        margin-top: 204px;
        img {
            width: 64%;
        }
        .no-data {
            display: block;
            font-size: 30px;
            color: #999999;
        }
    }
}
</style>
