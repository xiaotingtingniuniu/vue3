<template>
    <div class="menu-page">
        <div @click="pageGo('/menu-pop')">
            <van-search :class="isApp ? 'status-bar-height' : ''" v-model="searchValue" readonly shape="round" placeholder="请输入关键词">
                <template #left-icon>
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/menu/搜索@2x.png')" />
                    </div>
                </template>
            </van-search>
        </div>
        <div class="shop-info van-hairline--bottom">
            <div class="shop-info-name" @click="chooseStore">
                <div class="icon--unselect shop-icon">
                    <van-icon size="1em" :name="require('@/assets/menu/shop-icon.png')" />
                </div>
                <div v-if="storeInfo" class="text">{{ storeInfo.storeName }}</div>
                <div class="icon--unselect arrow">
                    <van-image width="5" height="8" :src="require('@/assets/shopping-cart/形状结合@2x.png')"/>
                </div>
            </div>
            <div class="buy-mode">到柜取货</div>
        </div>
        <div class="sidebar" v-if="category.length" :class="isApp ? 'status-bar' : ''">
            <van-sidebar class="first-level" v-model="active" @change="changeCategory">
                <van-sidebar-item v-for="(item,index) in category" :name="item.id" :key="index" :title="item.className.length > 5 ? (item.className.substring(0, 4) + '...') : item.className " />
            </van-sidebar>
            <div class="sidebar-content" ref="scrollDiv">
                <van-tabs class="second-level" :ellipsis="true" shrink v-if="categoryChildren.length" offset-top="87px" v-model:active="active2" @click-tab="changeCatchild">
                    <van-tab v-for="sub in categoryChildren" :key="sub.className" :name="sub.id">
                        <template #title>
                            <van-button class="tab-title-slot">{{ sub.className }}</van-button>
                        </template>
                        <van-list v-if="goodsList.length" v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="skuSearchFn">
                            <template v-for="(item,index) in goodsList" :key="index">
                                <goods-item-for-menu @addToCart="addToCart" :goodsInfo="item" :class="index === 0 ? '' : 'van-hairline--top'" />
                            </template>
                        </van-list>
                        <div class="no-data" v-else>
                            <div class="no-data-bg"></div>
                            <div class="no-data-tip">暂时没有商品哦～</div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
    </div>
</template>
<script setup>
import { Toast } from 'vant'
import { isApp } from '@/utils'
import { onBeforeRouteLeave } from 'vue-router'
import { cartAdd } from '@/api/shopping-cart'
import { skuSearch, categoryList } from '@/api/home'
import GoodsItemForMenu from '@/components/Goods/GoodsItemForMenu.vue'
import { appBridge } from '@/utils/bridge'
import { pageGo } from '@/utils/composables'
const router = useRouter()
const route = useRoute()
const store = useStore()

// 菜单当前激活内容
const active = ref(0)
const active2 = ref(0)
const storeInfo = computed(() => store.state.storeInfo)
const keepAliveId = ref(null)
// 记录滚动位置
const scrollDiv = ref(null)
const scrollTop = ref(0)

onMounted(() => {
    if (isApp && storeInfo.value) {
        getcategoryList()
    } else {
        watch([storeInfo], () => {
            if (isApp && storeInfo.value) {
                getcategoryList()
            }
        })
    }
})

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        getcategoryList()
    }
})

const chooseStore = () => {
    if (isApp) {
        appBridge('goSelectShop')
    } else {
        router.push({ name: 'store-map-index' })
    }
}

onActivated(() => {
    if (!isApp) {
        if (!storeInfo.value) router.push({ name: 'home' })
        if (keepAliveId.value !== storeInfo.value.id || !route.meta.goBack) {
            active.value = null
            active2.value = 0
            keepAliveId.value = storeInfo.value.id
            getcategoryList()
        } else if (scrollDiv.value) {
            scrollDiv.value.scrollTop = scrollTop.value
        }
    }
})

onBeforeRouteLeave((to) => {
    scrollTop.value = scrollDiv.value.scrollTop
})

const searchValue = ref('')

const category = ref([])
const categoryChildren = ref([])
const getcategoryList = async () => {
    const res = await categoryList()
    if (JSON.stringify(category.value) !== JSON.stringify(res)) {
        active.value = null
        category.value = res
        categoryChildren.value = res[0].subList || []
        if (res[0].subList[0]) {
            active2.value = res[0].subList[0].id
        }
    }
    pageNum.value = 1
    finished.value = false
    skuSearchFn()
}

const goodsList = ref([])
const pageNum = ref(1)
const pageSize = 10
const loading = ref(false)
const finished = ref(false)
const skuSearchFn = async () => {
    loading.value = true
    const params = {
        storeId: storeInfo.value.id,
        classId: active2.value,
        pageNum: pageNum.value,
        pageSize: pageSize
    }
    const res = await skuSearch(params)
    if (pageNum.value === 1) {
        goodsList.value = res.list || []
    } else {
        goodsList.value = [...goodsList.value, ...res.list]
    }
    if (goodsList.value.length >= res.total) (finished.value = true)
    loading.value = false
    pageNum.value++
}

const changeCategory = (index) => {
    const subList = category.value[index].subList
    categoryChildren.value = subList
    if (subList[0]) {
        active2.value = subList[0].id
    }
    pageNum.value = 1
    finished.value = false
    skuSearchFn()
}

const changeCatchild = (item) => {
    active2.value = item.name
    pageNum.value = 1
    finished.value = false
    skuSearchFn()
}

const addToCart = (id, quantity) => {
    if (quantity === 99) return Toast('已经是最大可购买数量了')
    getcartAdd(id)
}

const getcartAdd = async (skuId) => {
    const code = await cartAdd({
        storeId: storeInfo.value.id,
        skuId: skuId,
        quantity: 1
    })
    if (code === 200) return Toast('添加成功')
    if (code === 509) return Toast('已经是最大可购买数量了')
}
</script>
<style lang="scss" scoped>
.menu-page{
    .van-hairline--top:after{
        --van-border-color: #F4F5F5;
    }
    .van-search{
        padding: 12px 24px;
        :deep(.van-search__content){
            padding-left: 36px;
            .van-field__left-icon{
                display: flex;
                align-items: center;
                margin-right: 14px;
                .icon--unselect{
                    font-size: 26px;
                }
            }
            .van-search__field{
                height: 72px;
                padding: initial;
                display: flex;
                align-items: center;
            }
        }
    }
    :deep(.van-search){
        .van-search__action{
            font-size: 26px;
            font-weight: 400;
            color: #222222;
        }
        .van-field__control{
            font-size: 26px;
            font-weight: 400;
        }
    }
    .van-search.status-bar-height{
        padding-top: calc(12px + var(--van-status-bar-height))
    }
    .shop-info{
        display: flex;
        padding: 19px 24px 30px 27px;
        justify-content: space-between;
        background-color: #fff;
        .shop-info-name{
            display: flex;
            align-items: center;
            height: 28px;
            .shop-icon{
                font-size: 30px;
                height: 28px;
                margin-right: 8px;
            }
            .text{
                font-size: 24px;
                font-weight: bold;
                color: #555555;
                margin-right: 12px;
            }
        }
        .buy-mode{
            height: 28px;
            font-size: 24px;
            font-weight: 400;
            color: #AAAAAA;
        }
    }
    .status-bar{
        .first-level{
            height: calc(100vh - 88px - 86px - var(--van-status-bar-height)) !important;
        }
        .sidebar-content{
            height: calc(100vh - 88px - 86px - var(--van-status-bar-height)) !important;
        }
    }
    .sidebar{
        display: flex;
        background-color: #fff;
        .first-level{
            width: 180px;
            height: calc(100vh - 98px - 88px - 86px);
            background-color: #f7f8fa;
            :deep(.van-badge__wrapper){
                display: flex;
                flex-direction: column;
                font-size: 24px;
                line-height: 33px;
                font-weight: bold;
                color: #0D0D0D;
                width: 140px;
                white-space: nowrap;
            }
            :deep(.van-sidebar-item){
                width: 100%;
                padding: 29px 24px;
                .van-sidebar-item__text{
                    font-size: 24px;
                    font-weight: 400;
                    color: #0D0D0D;
                    letter-spacing: 1px;
                }
            }
            :deep(.van-sidebar-item--select:before){
                background-color: #FF7C40;
            }
            :deep(.van-sidebar-item--select){
                .van-sidebar-item__text{
                    color: #0D0D0D;
                    font-size: 26px;
                    line-height: 37px;
                    font-weight: 700;
                }
            }
        }
        .sidebar-content{
            height: calc(100vh - 88px - 86px);
            flex: 1;
            overflow-y: scroll;
            background-color: #fff;
            padding: 0 30px;
            .second-level{
                :deep(.van-tabs__content){
                    padding-bottom: 98px;
                }
                :deep(.van-tab){
                    padding: 0 12px;
                }
                :deep(.van-tabs__wrap){
                    height: 95px;
                }
                :deep(.van-tab--active){
                    .van-tab__text{
                        .van-button{
                            font-size: 26px;
                            color: #F16542;
                            background-color: rgba(241, 101, 66, 0.11);
                            border-radius: 6px;
                        }
                    }
                }
                :deep(.van-tab__text){
                    .van-button{
                        border-color: transparent;
                        width: max-content;
                        height: max-content;
                        font-size: 26px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #0D0D0D;
                        padding: 0 11px;
                        display: flex;
                        align-items: center;
                        height: 45px;
                        line-height: 45px;
                    }
                    .van-button:active:before {
                        opacity: initial;
                    }
                    .van-button:before {
                        content: initial;
                    }
                }
                :deep(.van-tabs__line){
                    display: none;
                }
                .no-data{
                    width: max-content;
                    text-align: center;
                    margin: 234px auto 0;
                    .no-data-bg{
                        width: 250px;
                        height: 168px;
                        background-image: url('../../assets/menu/编组 8@1.5x.png');
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                    }
                    .no-data-tip{
                        font-size: 26px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #222222;
                        margin-top: 48px;
                    }
                }
            }
        }
    }
}
</style>
