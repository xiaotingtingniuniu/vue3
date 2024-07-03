<template>
    <div v-if="dataList.length" class="invalid-goods-page">
        <transition name="van-fade">
            <div v-show="tipsVisible" class="tips">
                <span>温馨提示：</span>清除失效商品可提升货柜商品运营效率，若失效商品是柜中在售商品，请尽快与您的销售经理联系。
                <van-image @click="tipsVisible=false" :src="require('@/assets/guide/close.png')" />
            </div>
        </transition>
        <div class="title-box">
            <van-checkbox-group v-model="checkAll" @change="checkAllChange">
                <van-checkbox name="checkAll" ref="checkAllRef">
                    全选
                    <template #icon="props">
                        <img :src="props.checked ? activeIcon : inactiveIcon" />
                    </template>
                </van-checkbox>
            </van-checkbox-group>
            <van-button @click="outskuClearFn" :disabled="!checkGroup.length">清除</van-button>
        </div>
        <div class="goodsList">
            <van-checkbox-group v-model="checkGroup" ref="checkboxGroupRef" @change="checkChange">
                <van-checkbox :name="item.skuId" v-for="(item, index) in dataList" :key="index">
                    <div class="goods-cell">
                        <div class="number">{{ index + 1 }}</div>
                        <van-image :src="item.skuPic ? item.skuPic : require('@/assets/img-error.png')" />
                        <div class="goods-content">
                            <div class="title">{{ item.skuName }}</div>
                            <div class="text">{{ item.barcode }}</div>
                            <div class="bottom-line">
                                <div class="price"><span>¥</span>{{ (item.skuPrice / 100).toFixed(2) }}</div>
                                <div class="state">失效</div>
                            </div>
                        </div>
                    </div>
                    <template #icon="props">
                        <img :src="props.checked ? activeIcon : inactiveIcon" />
                    </template>
                </van-checkbox>
            </van-checkbox-group>
        </div>
    </div>
    <div class="empty" v-if="!dataList.length">
        <img src="@/assets/empty@2x.png">
        <div class="tip">已无失效商品，请您返回设备商品列表，查看所有设备商品</div>
    </div>
</template>
<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import activeIcon from '@/assets/check.png'
import inactiveIcon from '@/assets/Unchecked.png'
import { outskuInvalidList, outskuClear } from '@/api/goods-transfer'
import { useStore } from 'vuex'

const tipsVisible = ref(true)
const checkAll = ref([])
const checkboxGroupRef = ref(null)
const checkAllRef = ref(null)
const checkGroup = ref([])
// 点击全选 影响子选项
const checkAllChange = (name) => checkboxGroupRef.value.toggleAll(!!name.length)
// 点击子选项 影响全选按钮
const checkChange = (name) => checkAllRef.value.toggle(!!(name.length === dataList.value.length && dataList.value.length > 0))

const dataList = ref([])

const store = useStore()
const props = defineProps(['deviceCode'])
const merchantId = computed(() => store.state.userInfo.merchantId)

onBeforeMount(() => {
    outskuInvalidListFn()
})

// 查询失效商品列表
const outskuInvalidListFn = async () => {
    const res = await outskuInvalidList({
        merchantId: merchantId.value,
        secondChannelId: props.deviceCode
    })
    if (res.code !== '200') return false
    dataList.value = res.list
}

// 清除失效的商品
const outskuClearFn = async () => {
    const list = dataList.value.filter(father => checkGroup.value.filter(child => father.skuId === child))
    const res = await outskuClear({
        list: list.map(item => {
            return {
                merchantId: merchantId.value,
                secondChannelId: props.deviceCode,
                outSkuId: item.outSkuId
            }
        })
    })
    if (res.code === '200') {
        outskuInvalidListFn()
    }
}

</script>
<style lang="scss" scoped>
.empty{
    width: 100%;
    height: calc(100vh - 20px);
    background-color: #fff;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
        width: 420px;
        height: 314px;
        margin-top: 284px;
    }
    .tip{
        width: 464px;
        font-size: 30px;
        font-weight: 400;
        color: #696969;
        line-height: 42px;
    }
}
.invalid-goods-page{
    .tips{
        font-size: 26px;
        font-weight: 500;
        color: #FE7E41;
        background: linear-gradient(270deg, #FFFAF8 0%, #FFF4EE 100%);
        padding: 24px 68px 24px 30px;
        position: relative;
        span{
            font-weight: 600;
        }
        .van-image{
            position: absolute;
            width: 32px;
            height: 32px;
            top: 10px;
            right: 10px;
            z-index: 1;
        }
    }
    .title-box{
        padding: 26px 30px;
        display: flex;
        align-items: center;
        .van-checkbox-group{
            width: 0;
            flex: 1;
            img{
                width: 36px;
                height: 36px;
                margin-top: 1px;
            }
            :deep(.van-checkbox__label){
                font-size: 26px;
                font-weight: 400;
                color: #191919;
            }
        }
        .van-button{
            width: 152px;
            height: 62px;
            border-radius: 31px;
            border: 1px solid #FE7E41;
            font-size: 24px;
            font-weight: 400;
            color: #FE7E41;
            background-color: transparent;
            word-break: keep-all;
            line-height: 62px;
        }
    }
    .goodsList{
        padding: 0 30px;
        background-color: #fff;
        :deep(.van-checkbox__icon){
            img{
                width: 36px;
                height: 36px;
                margin-top: 1px;
            }
        }
        :deep(.van-checkbox__label){
            width: 100%;
            .goods-cell{
                flex: 1;
                display: flex;
                align-items: center;
                padding: 40px 0;
                .number{
                    font-size: 26px;
                    font-weight: 400;
                    color: #191919;
                }
                .van-image{
                    width: 144px;
                    height: 144px;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-left: 16px;
                }
                .goods-content{
                    width: 0;
                    flex: 1;
                    margin-left: 12px;
                    .title{
                        font-size: 26px;
                        font-weight: 500;
                        color: #191919;
                    }
                    .text{
                        margin-top: 6px;
                        font-size: 22px;
                        font-weight: 400;
                        color: #B0B0B0;
                        padding-bottom: 20px;
                    }
                    .bottom-line{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .price{
                            font-size: 28px;
                            font-weight: 500;
                            color: #FE7E41;
                            span{
                                font-size: 22px;
                            }
                        }
                        .state{
                            font-size: 26px;
                            font-weight: 400;
                            color: #FF2442;
                        }
                    }
                }
            }
        }
    }
}
</style>
