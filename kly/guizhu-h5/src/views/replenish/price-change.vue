
<template>
    <div class="price-change-detail">
        <div class="page-tip">
            <van-icon name="warning" color="#FAA277"/>
            <div class="text">共改价商品{{ changeNum }}种</div>
        </div>
        <div class="page-date">改价日期：{{ $route.query.changeDate || '--' }}</div>
        <div class="list-box">
            <div class="list-title">
                <div class="label label-1">商品信息</div>
                <div class="label label-2">改后价格</div>
                <div class="label label-3">差值</div>
            </div>
            <div class="cell-item" v-for="(item, index) in dataList" :key="index">
                <div class="number-box">{{ (index > 8 ? '' : '0') + (index + 1) }}</div>
                <van-image :src="item?.goodsMediaInfo?.mediaUrl"/>
                <div class="goods-info van-hairline--bottom">
                    <div class="sku-name">{{ item.skuName }}</div>
                    <div class="flex-box">
                        <div class="flex-left">
                            <div class="barcode">{{ item.barcodes }}</div>
                            <div class="stock">改前价格: ¥ {{ item.earlyPrice }}</div>
                        </div>
                        <div class="flex-middle">¥{{ item.price }}</div>
                        <div class="flex-right" :class="item.gapPrice < 0 ? 'green' : ''">{{ item.gapPrice > 0 ? '+' : '-' }} {{ '¥' + item.gapPrice.replace('-', '') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { priceRecordDetail } from '@/api/scan/scan.js'

const props = defineProps(['id'])
const dataList = ref([])
const changeNum = ref('--')

onBeforeMount(() => {
    getData()
})

const getData = async () => {
    const res = await priceRecordDetail({
        orderNo: props.id
    })
    changeNum.value = res.list.length
    dataList.value = res.list
}

</script>
<style lang="scss" scoped>
.price-change-detail{
    min-height: 100vh;
    .page-tip{
        height: 100px;
        padding-left: 30px;
        background: linear-gradient(270deg, #FFFAF8 0%, #FFF4EE 100%);
        display: flex;
        align-items: center;
        .text{
            font-size: 24px;
            font-weight: 400;
            color: #696461;
            margin-left: 16px;
        }
    }
    .page-date{
        font-size: 28px;
        font-weight: 400;
        color: #191919;
        padding: 20px 30px;
        background: #F4F5F5;
    }
    .list-box{
        background-color: #fff;
        .list-title{
            padding: 20px 30px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #F4F5F5;
            color: #696969;
            .label{
                color: #696969;
                font-size: 26px;
                text-align: center;
            }
            .label-1{
                width: 0;
                flex: 1;
            }
            .label-2{
                width: 150px;
            }
            .label-3{
                width: 104px;
            }
        }
        .cell-item{
            box-sizing: border-box;
            display: flex;
            align-items: flex-start;
            padding: 40px 30px 0;
            .number-box{
                width: 36px;
                text-align: center;
                line-height: 100px;
                color: #999999;
                font-size: 26px;
                font-weight: 400;
            }
            &>.van-image{
                width: 100px;
                height: 100px;
                margin-left: 16px;
                border-radius: 8px;
                overflow: hidden;
            }
            .goods-info{
                width: 0;
                flex: 1;
                margin-left: 16px;
                padding-bottom: 40px;
                .sku-name{
                    word-break: break-all;
                    word-wrap: break-word;
                    font-size: 28px;
                    font-weight: 500;
                    color: #191919;
                    line-height: 36px;
                }
                .flex-box{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .flex-left{
                        width: 0;
                        flex: 1;
                        .barcode{
                            margin-top: 8px;
                            font-size: 22px;
                            font-weight: 400;
                            color: #999999;
                            line-height: 30px;
                        }
                        .stock{
                            font-size: 22px;
                            font-weight: 400;
                            color: #999999;
                            margin-top: 6px;
                            display: flex;
                            align-items: center;
                        }
                    }
                    .flex-middle{
                        width: 150px;
                        text-align: center;
                        font-size: 26px;
                        font-weight: 500;
                        color: #FF1E19;
                    }
                    .flex-right{
                        width: 104px;
                        font-size: 26px;
                        font-weight: 500;
                        color: #FE7E41;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .green{
                        color: #68BD49;
                    }
                }
            }
        }
    }
}
</style>
