<template>
    <div v-show="show" class="result-page">
        <div class="search-box" :class="isApp ? 'status-bar-height' : ''">
            <div class="common-search-bar">
                <div class="button-content" @click="openAreaPop">
                    <div class="text">{{ currentArea.name }}</div>
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/home/arrow-down.png')" />
                    </div>
                </div>
                <div v-if="show" class="div-input" @click="close">
                    <van-icon name="search" />
                    <van-field disabled v-model="searchValue" autofocus placeholder="请输入地址/货柜名称" />
                </div>
            </div>
            <div class="cancel" @click="close">取消</div>
        </div>
        <div v-if="container.length" class="counter-area-list">
            <div v-for="(item,index) in container" :key="index" class="current-state-cell">
                <div class="cell-content">
                    <div class="location-main--counter">
                        <div class="title van-ellipsis">{{item.name}}</div>
                        <div class="state">{{item.statusDesc}}</div>
                    </div>
                    <div class="location-main--address">
                        <div class="text">
                            <div class="icon--unselect">
                                <van-icon size="1em" :name="require('@/assets/home/location-icon.png')" />
                            </div>
                            <span>{{ formatDistance(item.distance) }}m</span>{{item.address}}
                        </div>
                    </div>
                </div>
                <div class="cell-middle">
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/home/navigation-icon2.png')" />
                    </div>
                </div>
                <div v-if="counterInfo&&(item.id===counterInfo.id)" class="cell-end choos-style">已选择</div>
                <div v-else class="cell-end" @click="chooseCounter(item)">选择</div>
            </div>
        </div>
        <div v-else class="nodata">
            <div class="nodata-bg"></div>
            <div class="nodata-tip">抱歉，没有找到符合条件的信息哦～</div>
            <van-button class="nodata-button" @click="closePop"  type="primary">立即返回</van-button>
        </div>
    </div>
</template>
<script setup>
import { counterInfoList } from '@/api/home'
import { isApp, formatDistance } from '@/utils'
import { onBeforeRouteLeave } from 'vue-router'

const store = useStore()
const counterInfo = computed(() => store.state.counterInfo)
const props = defineProps(['visible', 'currentArea', 'searchVal'])
const emit = defineEmits(['close', 'closePop', 'closePage', 'confirm', 'openAreaPop'])

// 页面回退的标记
const pageBackFlag = ref(false)
const show = ref(false)
// 关闭当前pop
const close = () => emit('close')
// 关闭当前pop 和 搜索pop
const closePop = () => emit('closePop')
const closePage = () => {
    pageBackFlag.value = true
    emit('closePage')
}

const currentArea = ref()
const searchValue = ref()
const openAreaPop = () => emit('openAreaPop')

const lat = computed(() => store.state.lat)
const lng = computed(() => store.state.lng)
const container = ref([])
const getcounterInfoList = async () => {
    const res = await counterInfoList({
        name: searchValue.value,
        province: currentArea.value.name,
        longitude: lng.value,
        latitude: lat.value
    })
    container.value = res.list
}
watchEffect(() => {
    show.value = props.visible
    currentArea.value = props.currentArea
    searchValue.value = props.searchVal
    if (show.value) {
        getcounterInfoList()
    }
})

onBeforeRouteLeave(() => {
    if (show.value && !pageBackFlag.value) {
        closePop()
        return false
    }
})
const chooseCounter = (item) => {
    store.dispatch('updateCounter', item)
    closePage()
}
</script>
<style lang="scss" scoped>
.result-page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    min-height: 100vh;
    background-color: #F7F7F7;
    .search-box.status-bar-height{
        padding-top: var(--van-status-bar-height)
    }
    .search-box{
        display: flex;
        align-items: center;
        padding: 26px 24px;
        background-color: #fff;
        .common-search-bar{
            flex: 1;
            margin-right: 22px;
            margin-top: 0;
        }
        .cancel{
            font-size: 26px;
            color: #222222;
            letter-spacing: 0;
            font-weight: 400;
        }
        .van-field{
            font-size: 26px;
            font-weight: 400;
            background-color: transparent;
            padding: initial;
            :deep(.van-field__control){
                height: 32px !important;
                line-height: 32px !important;
            }
        }
    }
    .counter-area-list{
        padding: 30px 24px;
        height: calc(100vh - 184px);
        overflow-y: scroll;
        .current-state-cell{
            background-color: #fff;
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 24px 28px;
            .cell-content{
                flex: 1;
                .location-main--counter{
                    display: flex;
                    align-items: center;
                    .title{
                        max-width: 320px;
                        width: max-content;
                        font-size: 34px;
                        font-weight: bold;
                        color: #222222;
                        margin-right: 10px;
                    }
                    .state{
                        width: 60px;
                        height: 34px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        font-weight: bold;
                        color: #F16542;
                        border-radius: 6px;
                        border: 1px solid #F16542;
                        margin-right: 16px;
                    }
                    .icon--unselect{
                        font-size: 14px;
                    }
                }
                .location-main--address{
                    display: flex;
                    align-items: center;
                    color: #828080;
                    margin-top: 5px;
                    .icon--unselect{
                        font-size: 23px;
                        margin-right: 6px;
                        display: inline-block;
                        height: 23px;
                    }
                    .text{
                        width: 380px;
                        font-size: 24px;
                        span{
                            margin-right: 10px;
                        }
                    }
                }
            }
            .cell-middle{
                margin-right: 50px;
                .icon--unselect{
                    font-size: 54px;
                }
            }
            .cell-end{
                width: 112px;
                height: 54px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: 400;
                border-radius: 8px;
                color: #F16542;
                border: 1px solid #F26743;
                background-color: #fff;
                box-sizing: border-box;
            }
            .cell-end.choos-style{
                width: 112px;
                height: 54px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: 400;
                color: #C1C1C1;
                background: #F7F7F7;
                border-radius: 8px;
                border: initial;
            }
        }
    }
    .nodata{
        text-align: center;
        .nodata-bg{
            width: 301px;
            height: 202px;
            margin: 165px auto 0;
            background-image: url('../../../../../assets/menu/menu-search-nodata.png');
            background-size: 100% 100%;
        }
        .nodata-tip{
            font-size: 26px;
            font-weight: 400;
            color: #222222;
            margin-top: 77px;
        }
        .van-button{
            margin-top: 40px;
            width: 312px;
            height: 88px;
            background: linear-gradient(270deg, #F16542 0%, #E35A37 100%);
            border-radius: 12px;
        }
    }
}
</style>
