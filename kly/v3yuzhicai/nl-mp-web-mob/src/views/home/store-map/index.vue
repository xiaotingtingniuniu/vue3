<template>
    <div class="store-map-index-page" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow @click-left="$router.back()"/>
        <div class="store-map-search">
            <div class="common-search-bar">
                <div class="div-input" @click="searchPopVisible=true">
                    <van-icon name="search" />
                    <van-field readonly v-model="searchValue" placeholder="搜索门店" />
                </div>
            </div>
        </div>
        <div class="scroll-warp" v-if="storeInfo">
            <div class="line-title">当前已选门店</div>
            <div class="store-card">
                <div class="store-card-content">
                    <div class="title">{{ storeInfo.storeName }}</div>
                    <div class="location">
                        <div class="icon--unselect">
                            <van-icon size="1em" :name="require('@/assets/home/location-icon.png')" />
                        </div>
                        <div class="text van-ellipsis">{{ storeInfo.position || '暂无' }}</div>
                    </div>
                </div>
                <van-button>已选择</van-button>
            </div>
            <div class="line-title">附近门店</div>
            <template v-if="shopList.length">
                <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="getstoreList">
                    <div class="store-card" v-for="(item,index) in shopList" :key="index">
                        <div class="store-card-content">
                            <div class="title">{{ item.storeName }}</div>
                            <div class="location">
                                <div class="icon--unselect">
                                    <van-icon size="1em" :name="require('@/assets/home/location-icon.png')" />
                                </div>
                                <div class="text van-ellipsis">{{ item.position }}</div>
                            </div>
                        </div>
                        <van-button v-if="storeInfo&&(item.id===storeInfo.id)" class="choos-style">已选择</van-button>
                        <van-button v-else class="colour" @click="chooseStore(item)">选择</van-button>
                    </div>
                </van-list>
            </template>
        </div>
        <area-pop :visible="areaPopVisible" :currentArea="currentArea" @close="areaPopClose" @confirm="areaPopConfirm" />
        <search-pop :visible="searchPopVisible" :currentArea="currentArea" @openAreaPop="areaPopVisible=true" @close="searchPopClose" />
    </div>
</template>
<script setup>
import { shopsList } from '@/api/shops-goods'
import AreaPop from './components/Popup/AreaPop.vue'
import SearchPop from './components/Popup/SearchPop.vue'
import { isApp } from '@/utils'

const store = useStore()
const router = useRouter()
const counterInfo = computed(() => store.state.counterInfo)
const storeInfo = computed(() => store.state.storeInfo)

watch([counterInfo], () => getstoreList())
onMounted(() => {
    if (counterInfo.value && !shopList.value.length) {
        getstoreList()
    }
})

const shopList = ref([])
const pageNum = ref(1)
const pageSize = 10
const loading = ref(false)
const finished = ref(false)
const getstoreList = async () => {
    loading.value = true
    const params = {
        containerId: counterInfo.value.id,
        longitude: counterInfo.value.longitude,
        latitude: counterInfo.value.latitude,
        pageNum: pageNum.value,
        pageSize: pageSize
    }
    const { list, total } = await shopsList(params)
    if (!list) return
    if (pageNum.value === 1) {
        shopList.value = list
    } else {
        shopList.value = [...shopList.value, ...list]
    }
    if (shopList.value.length >= total) {
        finished.value = true
    }
    loading.value = false
    pageNum.value++
}

const chooseStore = (item) => {
    store.commit('updateStoreInfo', item)
    router.go(-1)
}

// 选择城市弹出窗
const areaPopVisible = ref(false)
const currentArea = ref({
    code: '110000',
    name: '北京市'
})
const areaPopClose = () => {
    areaPopVisible.value = false
}
const areaPopConfirm = result => {
    currentArea.value = result
}

// 搜索弹出窗
const searchValue = ref('')
const searchPopVisible = ref(false)
const searchPopClose = () => {
    searchPopVisible.value = false
}
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
    .scroll-warp{
        height: calc(100vh - 124px - 92px - var(--van-status-bar-height)) !important;
    }
}
.store-map-index-page{
    min-height: calc(100vh - var(--van-status-bar-height));
    background-color: #F7F7F7;
    .store-map-search{
        background: #FFFFFF;
        border-radius: 16px 16px 0px 0px;
        padding: 26px 24px;
        .div-input{
            border: initial;
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
    .scroll-warp{
        height: calc(100vh - 124px);
        overflow-y: scroll;
        .line-title{
            font-size: 28px;
            line-height: 28px;
            font-weight: 400;
            color: #999999;
            padding: 30px 24px 20px;
        }
        .store-card{
            margin: 0 24px;
            padding: 40px 28px;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 12px;
            margin-bottom: 20px;
            .store-card-content{
                .title{
                    font-size: 32px;
                    font-weight: bold;
                    color: #222222;
                    line-height: 32px;
                }
                .time{
                    font-size: 24px;
                    font-weight: 400;
                    color: #555555;
                    line-height: 24px;
                    margin-top: 20px;
                    .van-icon{
                        margin-right: 6px;
                    }
                }
                .location{
                    display: flex;
                    margin-top: 20px;
                    width: 480px;
                    .icon--unselect{
                        width: 21px;
                        font-size: 23px;
                        margin-right: 6px;
                    }
                    .text{
                        font-size: 24px;
                        font-weight: 400;
                        color: #555555;
                        line-height: 24px;
                    }
                }
            }
            .van-button{
                width: 112px;
                height: 54px;
                font-size: 24px;
                line-height: 24px;
                font-weight: 400;
                color: #C1C1C1;
                border-radius: 8px;
                background: #F7F7F7;
                padding: 15px 20px;
                height: max-content;
                border: initial;
                word-break: keep-all;
            }
            .colour{
                color: #F16542;
                border: 1px solid #F26743;
                background: #fff;
                box-sizing: border-box;
            }
            .choos-style{
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
