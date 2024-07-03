<template>
    <div class="menu-result-page">
        <div class="search-box">
            <van-search :class="isApp ? 'status-bar-height' : ''" @click-input="$router.back()" @cancel="closePage" readonly v-model="searchValue" show-action shape="round" placeholder="请输入关键词">
                <template #left>
                    <div class="icon--unselect back-icon" @click="$router.back()">
                        <van-icon size="1em" :name="require('@/assets/menu/路径 7@2x.png')" />
                    </div>
                </template>
                <template #left-icon>
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/menu/搜索@2x.png')" />
                    </div>
                </template>
            </van-search>
        </div>
        <div v-if="goodsList.length" class="goods-box">
            <template v-for="(item,index) in goodsList" :key="index">
                <goods-item-for-menu @addToCart="getcartAdd" :goodsInfo="item" :class="index === 0 ? '' : 'van-hairline--top'" />
            </template>
        </div>
        <div v-else class="nodata">
            <div class="nodata-bg"></div>
            <div class="nodata-tip">抱歉，没有找到符合条件的信息哦～</div>
            <van-button class="nodata-button" @click="closePage" type="primary">立即返回</van-button>
        </div>
    </div>
</template>
<script setup>
import { Toast } from 'vant'
import { skuSearch } from '@/api/home'
import { cartAdd } from '@/api/shopping-cart'
import GoodsItemForMenu from '@/components/Goods/GoodsItemForMenu.vue'
import { isApp } from '@/utils'
import { pageBack } from '@/utils/composables'
const store = useStore()
const router = useRouter()

const menuSearchVal = computed(() => store.state.menuSearchVal)
const storeInfo = computed(() => store.state.storeInfo)
const searchValue = ref('')
const carChoose = computed(() => store.state.carChoose)

// 初始化
onActivated(() => {
    searchValue.value = menuSearchVal.value
    if (storeInfo.value) {
        getskuSearch()
    } else {
        router.push({ name: 'home' })
    }
})

// 回退
const closePage = () => {
    if (isApp) {
        pageBack()
    } else {
        router.go(-2)
    }
}

// 搜索结果列表
const goodsList = ref([])
const getskuSearch = async () => {
    const res = await skuSearch({
        storeId: storeInfo.value.id,
        skuName: searchValue.value,
        pageNum: 1,
        pageSize: 100
    })
    goodsList.value = res.list || []
}

// 添加到购物车
const getcartAdd = async (skuId, quantity) => {
    if (quantity === 99) return Toast('已经是最大可购买数量了')
    const code = await cartAdd({
        storeId: storeInfo.value.id,
        skuId: skuId,
        quantity: 1
    })
    if (code === 200) {
        Toast('添加成功')
        store.commit('setcarChoose', [...carChoose.value, skuId])
    } else if (code === 509) {
        Toast('已经是最大可购买数量了')
    }
}
</script>

<style lang="scss" scoped>
.menu-result-page{
    width: 100%;
    height: 100vh;
    background-color: #F7F7F7;
    .van-search.status-bar-height{
        padding-top: calc(14px + var(--van-status-bar-height));
    }
    .back-icon{
        font-size: 28px;
        height: 28px;
        margin-right: 16px;
    }
    :deep(.van-search){
        padding: 14px 24px;
        .van-search__action{
            font-size: 26px;
            font-weight: 400;
            color: #222222;
            padding: initial;
            margin-left: 22px;
        }
        .van-field__control{
            font-size: 26px;
            font-weight: 400;
        }
        .van-search__content{
            .van-field__left-icon{
                display: flex;
                align-items: center;
                margin-right: 14px;
                .icon--unselect{
                    font-size: 26px;
                }
            }
            .van-search__field{
                height: 60px;
                padding: initial;
                display: flex;
                align-items: center;
            }
        }
    }
    .goods-box{
        max-height: calc(100vh - 108px);
        margin: 20px 24px;
        padding: 0 24px;
        background-color: #fff;
        border-radius: 12px;
        overflow-y: scroll;
    }
    .nodata{
        text-align: center;
        .nodata-bg{
            width: 301px;
            height: 202px;
            margin: 165px auto 0;
            background-image: url('../../../assets/menu/编组\ 8@1.5x.png');
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
