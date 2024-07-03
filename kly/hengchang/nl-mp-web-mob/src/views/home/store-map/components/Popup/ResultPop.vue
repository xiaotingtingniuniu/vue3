<template>
    <!-- <van-popup v-model:show="show" position="right" :style="{ width: '100%', height: '100%' }"> -->
    <div v-show="show" class="result-page">
        <div class="search-box" :class="isApp ? 'status-bar-height' : ''">
            <div class="common-search-bar">
                <!-- <div class="button-content" @click="openAreaPop">
                        <div class="text">{{ currentArea.name }}</div>
                        <div class="icon--unselect">
                            <van-icon size="1em" :name="require('@/assets/home/arrow-down.png')" />
                        </div>
                    </div> -->
                <div v-if="show" class="div-input" @click="close">
                    <van-icon name="search" />
                    <van-field disabled v-model="searchValue" autofocus placeholder="搜索门店" />
                </div>
            </div>
            <div class="cancel" @click="close">取消</div>
        </div>
        <div v-if="shopList.length" class="scroll-warp">
            <div class="store-card" v-for="(item,index) in shopList" :key="index">
                <div class="store-card-content">
                    <div class="title">{{item.storeName}}</div>
                    <div class="location">
                        <div class="icon--unselect">
                            <van-icon size="1em" :name="require('@/assets/home/location-icon.png')" />
                        </div>
                        <div class="text van-ellipsis">{{item.position}}</div>
                    </div>
                </div>
                <van-button v-if="storeInfo&&(item.id===storeInfo.id)" class="choos-style">已选择</van-button>
                <van-button v-else class="colour" @click="chooseStore(item)">选择</van-button>
            </div>
        </div>
        <div v-else class="nodata">
            <div class="nodata-bg"></div>
            <div class="nodata-tip">抱歉，没有找到符合条件的信息哦～</div>
            <van-button class="nodata-button" @click="close"  type="primary">立即返回</van-button>
        </div>
    </div>
    <!-- </van-popup> -->
</template>
<script setup>
import { shopsList } from '@/api/shops-goods'
import { isApp } from '@/utils'
const props = defineProps(['visible', 'currentArea', 'searchVal'])
const emit = defineEmits(['close', 'confirm'])

const router = useRouter()
const store = useStore()
const storeInfo = computed(() => store.state.storeInfo)
const counterInfo = computed(() => store.state.counterInfo)
const show = ref(false)
const currentArea = ref()
const searchValue = ref()
// const openAreaPop = () => emit('openAreaPop')
const close = () => emit('close')

const shopList = ref([])
const getstoreList = async () => {
    const params = {
        containerId: counterInfo.value.id,
        longitude: counterInfo.value.longitude,
        latitude: counterInfo.value.latitude,
        storeName: searchValue.value ? searchValue.value : null,
        pageNum: '1',
        pageSize: '100'
    }
    const { list } = await shopsList(params)
    shopList.value = list || []
}

const chooseStore = (item) => {
    store.commit('updateStoreInfo', item)
    router.go(-1)
}

watchEffect(() => {
    show.value = props.visible
    currentArea.value = props.currentArea
    searchValue.value = props.searchVal
    if (show.value) {
        getstoreList()
    }
})

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
            .div-input{
                border: initial;
            }
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
    .scroll-warp{
        height: calc(100vh - 124px);
        overflow-y: scroll;
        .store-card{
            margin: 20px 24px;
            padding: 40px 28px;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 12px;
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
                font-size: 24px;
                line-height: 24px;
                font-weight: 400;
                color: #C1C1C1;
                border-radius: 8px;
                background: #F7F7F7;
                padding: 15px 20px;
                height: max-content;
                border: initial;
            }
            .colour{
                color: #F16542;
                border: 1px solid #F26743;
                background: #fff;
                box-sizing: border-box;
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
