<template>
    <div class="counter-map-choose" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow @click-left="$router.back()"/>
        <div class="map">
            <div class="container" id="container"></div>
            <van-button class="icon-box" @click="panToCenter" type="primary">
                <div class="button-content">
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/home/get-location-icon.png')" />
                    </div>
                </div>
            </van-button>
        </div>
        <div class="counter-area">
            <div class="counter-area-search">
                <div class="common-search-bar">
                    <div class="button-content" @click="areaPopVisible=true">
                        <div class="text">{{ currentArea.name }}</div>
                        <div class="icon--unselect">
                            <van-icon size="1em" :name="require('@/assets/home/arrow-down.png')" />
                        </div>
                    </div>
                    <div class="div-input" @click="searchPopVisible=true">
                        <van-icon name="search" />
                        <van-field readonly v-model="searchValue" placeholder="请输入地址/货柜名称" />
                    </div>
                </div>
                <div v-if="!locationPermission" class="no-permission">
                    <div class="tip">建议开启位置定位，快速选择自提柜</div>
                    <van-button @click="getCurrenLocationFn" block color="linear-gradient(270deg, #F16542 0%, #E35A37 100%)" type="primary">
                        立即开启
                    </van-button>
                </div>
                <template v-else>
                    <div v-if="!counterInfo" class="no-current">当前位置无可用自提柜，请选择其他位置自提柜</div>
                    <div v-if="counterInfo" class="current-state">
                        <div class="current-state--title">当前已选自提柜</div>
                        <div class="current-state-cell">
                            <div class="cell-content">
                                <div class="location-main--counter" @click="panTo({latitude: counterInfo.latitude, longitude: counterInfo.longitude})">
                                    <div class="title van-ellipsis">{{ counterInfo.name }}</div>
                                    <div class="state" v-if="counterInfo.statusDesc === '在线'">{{ counterInfo.statusDesc }}</div>
                                    <div class="nostate" v-else>{{ counterInfo.statusDesc }}</div>
                                </div>
                                <div class="location-main--address">
                                    <div class="text van-multi-ellipsis--l3">
                                        <div class="icon--unselect">
                                            <van-icon size="1em" :name="require('@/assets/home/location-icon.png')" />
                                        </div>
                                        <span>距我{{ formatDistance(counterInfo.distance) }}m</span>{{ counterInfo.address }}
                                    </div>
                                </div>
                            </div>
                            <div class="cell-middle" @click="routePlan(counterInfo.name, `${counterInfo.latitude},${counterInfo.longitude}`, counterInfo.address)">
                                <div class="icon--unselect">
                                    <van-icon size="1em" :name="require('@/assets/home/navigation-icon2.png')" />
                                </div>
                            </div>
                            <!-- <div class="cell-operate">重新定位</div> -->
                            <div class="cell-end">已选择</div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="counter-area-list" v-if="container.length">
                <div class="current-state--title">当前城市可用自提柜</div>
                <div v-for="(item, index) in container" :key="index" :class="index === 0 ? 'top16' : ''" class="current-state-cell van-hairline--bottom">
                    <div class="cell-content">
                        <div class="location-main--counter" @click="panTo(item)">
                            <div class="title van-ellipsis">{{item.name}}</div>
                            <div class="state" v-if="item.statusDesc === '在线'">{{ item.statusDesc }}</div>
                            <div class="nostate" v-else>{{ item.statusDesc }}</div>
                        </div>
                        <div class="location-main--address">
                            <div class="text">
                                <div class="icon--unselect">
                                    <van-icon size="1em" :name="require('@/assets/home/location-icon.png')" />
                                </div>
                                <span>距我{{ formatDistance(item.distance) }}m</span>{{item.address}}
                            </div>
                        </div>
                    </div>
                    <div class="cell-middle" @click="routePlan(item.name, `${item.latitude},${item.longitude}`, item.address)">
                        <div class="icon--unselect">
                            <van-icon size="1em" :name="require('@/assets/home/navigation-icon2.png')" />
                        </div>
                    </div>
                    <div v-if="counterInfo&&(item.id===counterInfo.id)" class="cell-end choos-style">已选择</div>
                    <div v-else class="cell-end" @click="chooseCounter(item)">选择</div>
                </div>
            </div>
        </div>
        <area-pop :visible="areaPopVisible" :currentArea="currentArea" @close="areaPopClose" @confirm="areaPopConfirm" />
        <search-pop :visible="searchPopVisible" :currentArea="currentArea" @openAreaPop="areaPopVisible=true" @close="searchPopClose" />
    </div>
</template>
<script setup>
import AreaPop from './components/Popup/AreaPop.vue'
import SearchPop from './components/Popup/SearchPop.vue'
import { getCurrenLocation } from '@/utils/location'
import { formatDistance, isApp } from '@/utils'
import { counterInfoList } from '@/api/home'
import { routePlan } from '@/utils/composables'
import myLocation from '@/assets/home/map-my-location.png'
import counterLocation from '@/assets/home/map-counter-location.png'

const router = useRouter()
const store = useStore()

const locationPermission = computed(() => store.state.locationPermission)
const counterInfo = computed(() => store.state.counterInfo)
const lat = computed(() => store.state.lat)
const lng = computed(() => store.state.lng)
const province = computed(() => store.state.province)
const adcode = computed(() => store.state.adcode)

onMounted(async () => {
    setCenter()
    if (!container.value.length) {
        await getcounterInfoList()
    }
})

const panToCenter = () => {
    panTo({
        latitude: lat.value,
        longitude: lng.value
    })
}

// 获取当前最新位置
const getCurrenLocationFn = async () => {
    await getCurrenLocation()
    panTo({
        latitude: lat.value,
        longitude: lng.value
    })
}

const geometries = ref([])
const container = ref([])
const getcounterInfoList = async () => {
    const res = await counterInfoList({
        province: currentArea.value.name,
        longitude: lng.value || null,
        latitude: lat.value || null
    })
    container.value = res.list
    for (let i = 0; i < container.value.length; i++) {
        if (container.value[i].id === counterInfo.value.id) {
            store.dispatch('updateCounter', container.value[i])
        }
    }
    geometries.value = res.list.map(item => {
        return {
            styleId: 'counterStyle',
            position: new TMap.LatLng(item.latitude, item.longitude),
            properties: {
                title: 'marker'
            }
        }
    })
    removeMarker()
    addMarker()
}
const chooseCounter = (item) => {
    store.dispatch('updateCounter', item)
    router.go(-1)
}

// 设置中心点坐标 初始化地图
const marker = ref()
const map = ref()
const setCenter = () => {
    const center = new TMap.LatLng(lat.value || 39.911888, lng.value || 116.510323)
    map.value = new TMap.Map('container', {
        zoom: 17,
        center: center,
        viewMode: '2D'
    })
    watch([lat, lng], async () => {
        await getcounterInfoList()
        panTo({ latitude: lat.value, longitude: lng.value })
        removeMarker()
        addMarker()
    })
}
const pointStyle = {
    mineStyle: new TMap.MarkerStyle({
        width: 18,
        height: 21,
        anchor: { x: 16, y: 32 },
        src: myLocation
    }),
    counterStyle: new TMap.MarkerStyle({
        width: 37,
        height: 42,
        anchor: { x: 16, y: 32 },
        src: counterLocation
    })
}
// 初始化marker
const addMarker = () => {
    marker.value = new TMap.MultiMarker({
        map: map.value,
        styles: pointStyle,
        geometries: [...geometries.value, {
            styleId: 'mineStyle',
            position: new TMap.LatLng(lat.value, lng.value),
            properties: {
                title: 'marker'
            }
        }]
    })
}
// 移除marker
const removeMarker = () => {
    if (marker.value) {
        marker.value.setMap(null)
        marker.value = null
    }
}
const panTo = (item) => map.value.panTo(new TMap.LatLng(item.latitude, item.longitude))

// 选择城市弹出窗
const areaPopVisible = ref(false)
const currentArea = ref({
    code: adcode.value.toString(),
    name: province.value
})
const areaPopClose = () => {
    areaPopVisible.value = false
}
const areaPopConfirm = async result => {
    currentArea.value = result
    store.commit('changeAdcode', result)
    await getcounterInfoList()
}

// 搜索弹出窗
const searchPopVisible = ref(false)
const searchPopClose = () => {
    searchPopVisible.value = false
}
const searchValue = ref('')
</script>
<style lang="scss" scoped>
.status-bar-height{
    .van-nav-bar__placeholder{
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
    // .counter-area{
    //     height: calc(100vh - 528px - 92px - var(--van-status-bar-height)) !important;
    // }
    // .counter-area-list{
    //     height: calc(100vh - 528px - 318px - 20px - 92px - var(--van-status-bar-height)) !important;;
    // }
}
.counter-map-choose{
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
    .map{
        width: 100%;
        height: 528px;
        position: relative;
        :deep(.container){
            .tmap-scale-control{
                display: none;
            }
            .logo-text{
                display: none;
            }
            a{
                display: none;
            }
            .rotate-circle{
                display: none;
            }
            .tmap-zoom-control{
                display: none;
            }
        }
        .container{
            width: 100%;
            height: 528px;
        }
        .icon-box{
            width: 50px;
            height: 50px;
            background: #FFFFFF;
            box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.19);
            border-radius: 8px;
            position: absolute;
            z-index: 1001;
            right: 24px;
            bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            .icon--unselect{
                font-size: 32px;
            }
        }
    }
    .counter-area{
        background-color: #F7F7F7;
        height: calc(100vh - 528px);
        .counter-area-search{
            background: #FFFFFF;
            border-radius: 16px 16px 0px 0px;
            padding: 24px;
            // height: 270px;
            .no-permission{
                .tip{
                    font-size: 26px;
                    color: #222222;
                    letter-spacing: 0;
                    font-weight: bold;
                    text-align: center;
                    margin-top: 30px;
                }
                .van-button{
                    width: -webkit-fill-available;
                    margin: 30px 24px 0;
                    height: 88px;
                    border-radius: 16px;
                    background: linear-gradient(270deg, #F16542 0%, #E35A37 100%);
                }
            }
            .no-current{
                font-size: 26px;
                color: #222222;
                letter-spacing: 0;
                font-weight: bold;
                text-align: center;
                margin-top: 85px;
            }
            .current-state{
                margin-top: 40px;
                .current-state--title{
                    font-size: 28px;
                    font-weight: 400;
                    color: #999999;
                }
            }
        }
        .counter-area-list{
            margin-top: 20px;
            background: #FFFFFF;
            padding: 0 24px;
            .current-state--title{
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                padding-top: 30px;
            }
            .top16{
                padding-top: 16px !important;
            }
            .current-state-cell{
                padding: 24px 0;
                .cell-end{
                    color: #F16542;
                    border: 1px solid #F26743;
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
        .current-state-cell{
            display: flex;
            align-items: center;
            .cell-content{
                flex: 1;
                .location-main--counter{
                    display: flex;
                    align-items: center;
                    .title{
                        max-width: 350px;
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
                    .nostate{
                        width: 60px;
                        height: 34px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        font-weight: bold;
                        color: #AAAAAA;
                        border-radius: 6px;
                        border: 1px solid #AAAAAA;
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
                        font-size: 21px;
                        margin-right: 6px;
                        display: inline-block;
                        height: 23px;
                        position: relative;
                        top: 1px;
                    }
                    .text{
                        margin-right: 24px;
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
            .cell-operate{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #F16542;
            }
            .cell-end{
                width: 112px;
                height: 54px;
                display: flex;
                word-break: keep-all;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: 400;
                color: #C1C1C1;
                background: #F7F7F7;
                border-radius: 8px;
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
                word-break: keep-all;
            }
        }
    }
}
</style>
