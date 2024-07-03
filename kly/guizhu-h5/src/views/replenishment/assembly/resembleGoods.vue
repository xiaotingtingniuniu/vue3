<template>
    <div class="resemble-goods-page">
        <van-tabs v-model:active="activeName" @click-tab="getData()" color="#FE7E41" title-active-color="#FE7E41" title-inactive-color="#191919" v-if="props.deviceType === '20'">
            <van-tab title="左门" name="左门"></van-tab>
            <van-tab title="右门" :name="右门"></van-tab>
        </van-tabs>
        <template v-if="goodsGroup.length">
            <div class="tip tip2" v-if="props.deviceType === '20'">
                <img src="@/assets/warning.png" />
                <div>为提升识别准确度，不建议同一个设备中售卖外观相似的商品。若继续上架商品，<span>可将外观相似的商品设置为相同售价</span>以避免识别不准造成的货损。</div>
            </div>
            <div class="tip" v-else>
                <img src="@/assets/warning.png" />
                <div>为提升识别准确度，不建议同一个设备中售卖外观相似的商品。若继续上架商品，<span>可将外观相似的商品设置为相同售价</span>以避免识别不准造成的货损。</div>
            </div>
            <div class="goods-box">
                <div class="title-line van-hairline--bottom">
                    <div class="p1">商品信息</div>
                    <div class="p2">售价</div>
                </div>
                <div class="content">
                    <div class="goods-list" v-for="(goodsList, index) in goodsGroup" :key="index">
                        <div class="goods-item" v-for="(item, i) in goodsList.similarSkuInfos" :key="item.skuId">
                            <van-image :src="item.image" />
                            <div class="goods-info" :class="(i+1)!==goodsList.similarSkuInfos.length ? 'van-hairline--bottom':''">
                                <div class="goods-name">
                                    <div class="van-ellipsis">{{ item.skuName }}</div>
                                    <div class="frozen-icon" v-if="item.storageStyle === '冷冻品'"><img src="../../../assets/frozen_icon.png"></div>
                                    <div>{{ item.barcode }}</div>
                                </div>
                                <div class="price-box">
                                    <div v-if="!item.edit">¥{{ item.newPrice }}</div>
                                    <div class="input-box" v-else>¥<van-field :ref="el => {fieldRef[i] = el}" v-model="item.newPrice" @blur="item.edit=!item.edit" type="number" :formatter="formatter" format-trigger="onChange"/></div>
                                    <template v-if="authorized.check('device-good-edit-price')">
                                        <img v-if="!item.edit" @click="modifyPrice(item, i, goodsList.similarSkuInfos)" :src="require('@/assets/edit-icon.png')" alt="">
                                    </template>
                                    <div v-else class="site"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="submit-button-height" v-if="authorized.check('device-good-edit-price')" />
            <div class="submit-button" v-if="authorized.check('device-good-edit-price')">
                <van-button :class="changeGoods.length ? '' : 'gray' " @click="submitFn">改价完成</van-button>
            </div>
        </template>
        <div class="no-data" v-else-if="!goodsGroup.length && pageLoadFlag">
            <img :src="require('@/assets/verify-success.png')" alt="">
            <p>当前设备</p>
            <p>未检测出外观相似商品</p>
        </div>
    </div>
</template>
<script setup>
import { ref, onBeforeMount, nextTick, computed } from 'vue'
import { similarGoodsList, changePrice } from '@/api/scan/scan'
import { getTime } from '@/utils'
import { Toast } from 'vant'
import authorized from '@/utils/authorized'
const props = defineProps(['deviceCode', 'deviceType'])
console.log('deviceType: ' + props.deviceType)
const startTime = ref()

const activeName = ref('左门')
const pageLoadFlag = ref(false)
onBeforeMount(async () => {
    startTime.value = getTime()
    await getData()
    pageLoadFlag.value = true
})

const changeGoods = computed(() => {
    const arr = []
    goodsGroup.value.map(father => father.similarSkuInfos.map(child => {
        if (child.newPrice !== child.salePrice) {
            arr.push(child)
        }
    }))
    return arr || []
})

const formatter = (value) => {
    if (value.indexOf('.') === 0) {
        value = '0' + value
    }
    value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
    if (value.indexOf('.') < 0 && value !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        value = parseFloat(value)
    }
    return value + ''
}
const fieldRef = ref([])
const modifyPrice = (value, index, group) => {
    group.map((item) => (item.edit = false))
    value.edit = !value.edit
    nextTick(() => {
        fieldRef.value[index].focus()
    })
}

const goodsGroup = ref([])
const getData = async () => {
    const res = await similarGoodsList({
        deviceCode: props.deviceCode,
        doorType: props.deviceType === '10' ? 0 : activeName.value === '左门' ? 1 : 2
    })
    goodsGroup.value = res.data || []
    goodsGroup.value.map(item => item.similarSkuInfos.map(val => (val.newPrice = val.salePrice)))
}

const submitFn = async () => {
    const res = await changePrice({
        deviceNo: props.deviceCode,
        startTime: startTime.value,
        priceChangeList: changeGoods.value.map(item => {
            return {
                skuCode: item.skuId,
                skuName: item.skuName,
                barcodes: item.barcode,
                price: item.newPrice,
                earlyPrice: item.salePrice,
                doorType: props.deviceType === '10' ? 0 : activeName.value === '左门' ? 1 : 2
            }
        })
    })
    if (res.code === '200') {
        Toast('改价操作成功')
        startTime.value = getTime()
        getData()
    }
}

</script>
<style lang="scss" scoped>
.resemble-goods-page{
    min-height: 100vh;
    background-color: #fff;
    .van-tabs{
        font-size: 28px;
        font-weight: 400;
        color: #191919;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        border-top: 1px solid #F4F5F5;
        :deep(.van-tab__text--ellipsis){
            font-size: 28px;
        }
        .van-search{
            padding: 20px 30px;
            :deep(.van-search__field){
                height: 62px;
                padding-right: 30px;
                .van-field__left-icon{
                    width: 26px;
                    height: 24px;
                }
                .van-field__right-icon{
                    width: 32px;
                    height: 32px;
                    padding-left: 18px;
                    border-left: 2px solid #DDDDDD;
                }
                .van-image{
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }
        }
    }
    .tip2 {
        margin-top: 80px;
    }
    .tip{
        padding: 34px 30px;
        background: #F4F5F5;
        display: flex;
        img{
            width: 32px;
            height: 32px;
        }
        div{
           font-size: 24px;
            font-weight: 400;
            color: #696969;
            line-height: 32px;
            margin-left: 24px;
            span{
                color: #FF1E19;
            }
        }
    }
    .submit-button-height{
        width: 100%;
        height: 132px;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
    .submit-button{
        position: fixed;
        bottom: 20px;
        bottom: calc(20px + constant(safe-area-inset-bottom));
        bottom: calc(20px + env(safe-area-inset-bottom));
        left: 60px;
        right: 60px;
        .gray{
            background-color: #ccc !important;
        }
        .van-button{
            width: 100%;
            height: 92px;
            font-size: 30px;
            font-weight: 500;
            color: #FFFFFF;
            background: #FE7E41;
            border-radius: 46px;
        }
    }
    .goods-box{
        background-color: #ffffff;
        .title-line{
            display: flex;
            justify-content: space-between;
            font-size: 26px;
            font-weight: 500;
            color: #696969;
            padding: 20px 0;
            .p1{
                width: 0;
                flex: 1;
                text-align: center;
            }
            .p2{
                width: 164px;
                text-align: center;
            }
        }
        .content{
            .goods-list:last-child{
                border-bottom: initial;
            }
        }
        .goods-list{
            margin: 0 30px;
            border-bottom: 10px solid #EDEDED;
            .goods-item{
                padding: 40px 0 0;
                display: flex;
                .van-image{
                    width: 100px;
                    height: 100px;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .goods-info{
                    width: 0;
                    flex: 1;
                    display: flex;
                    margin-left: 16px;
                    min-height: 100px;
                    padding-bottom: 40px;
                    .goods-name{
                        div:nth-child(1){
                            width: 400px;
                            font-size: 28px;
                            font-weight: 500;
                            color: #191919;
                        }
                        div:nth-child(2){
                            font-size: 22px;
                            font-weight: 400;
                            color: #999999;
                            margin-top: 8px;
                        }
                        .frozen-icon img{
                            width: 116px;
                        }
                    }
                }
                .price-box{
                    width: 0;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    div{
                        font-size: 26px;
                        font-weight: 400;
                        color: #FF1E19;
                    }
                    .input-box{
                        display: flex;
                        align-items: center;
                        .van-field{
                            width: 100px;
                            border: initial;
                            border-bottom: 1px solid #ccc;
                            border-radius: initial;
                            padding: initial;
                        }
                    }
                    .site{
                        width: 20px;
                        height: 24px;
                    }
                    img{
                        width: 24px;
                        height: 24px;
                        margin-left: 16px;
                    }
                }
            }
        }
    }
    .no-data{
        padding-top: 30vh;
        text-align: center;
        img{
            width: 216px;
            height: 214px;
        }
        p{
            font-size: 36px;
            font-weight: 500;
            color: #191919;
            line-height: 50px;
        }
    }
}
</style>
