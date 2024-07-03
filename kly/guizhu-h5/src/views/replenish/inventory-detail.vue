
<template>
    <div class="replenishment-detail">
        <div class="container">
            <div class="header-top">
                <van-icon name="warning" color="#FAA277"/>
                <div class="header-top-title">共盘货商品{{ skuTypeCount }}种，盘前库存{{ beforeSkuCount }}，盘后库存{{ afterSkuCount }}，<span :class="(diffCount < 0) ? 'colour-green' : 'change-color'">盘货差异{{ diffCount }}</span></div>
            </div>
            <div class="header-content">盘货日期：{{ $route.query?.changeDate?.split(' ')[0] || '--' }}</div>
            <div class="list-info">
                <div class="list-top">
                    <div class="left">商品信息</div>
                    <div class="right">实盘库存</div>
                    <div class="right">盘货差异</div>
                </div>
                <div class="list-content" v-for="(item, index) in skuList" :key="index">
                    <div class="content-left">
                        <div class="number">{{ index > 8 ? (index + 1) : '0'+ (index + 1) }}</div>
                        <div><img :src="item.skuPicUrl || require('@/assets/img-error.png')" alt=""/></div>
                    </div>
                    <div class="content-right">
                        <div class="left-info">
                            <div class="info-name">{{ item.skuName || '--' }}</div>
                            <div>{{ item.barCode || '--' }}</div>
                            <div>盘前库存：{{ item.expectNum || 0 }}</div>
                        </div>
                        <div class="right-info-price">{{ item.actualNum || 0 }}</div>
                        <div class="right-info-value" :class="(item.difference < 0) ? 'green' : ''">{{ (item.difference > 0) ? '+' : '' }}{{ item.difference || 0 }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { tallybillDetail } from '@/api/scan/scan'
import { onBeforeMount, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps(['id'])
const route = useRoute()

const { skuTypeCount, beforeSkuCount, afterSkuCount } = route.query

const diffCount = computed(() => {
    return (Number(afterSkuCount) - Number(beforeSkuCount)) || 0
})

onBeforeMount(() => {
    getData()
})

const skuList = ref([])
const getData = async () => {
    const res = await tallybillDetail({ billNo: props.id })
    skuList.value = res.data.skuList || []
}

</script>
<style lang="scss" scoped>
.replenishment-detail{
    min-height: 100vh;
    background: #F4F5F5;
    .container{
        .header-top{
            height: 100px;
            padding-left: 30px;
            background: linear-gradient(270deg, #FFFAF8 0%, #FFF4EE 100%);
            display: flex;
            align-items: center;
            .header-top-title{
                font-size: 24px;
                font-weight: 400;
                color: #696461;
                margin-left: 16px;
                .change-color{
                    color: #FE7E41;
                }
                .colour-green{
                    color: #68BD49;
                }
            }
        }
        .header-content{
            padding-left: 30px;
            height: 80px;
            font-size: 28px;
            font-weight: 400;
            color: #191919;
            line-height: 80px;
        }
        .list-info{
            background: #fff;
            .list-top{
                height: 76px;
                padding-left: 30px;
                padding-right: 30px;
                font-size: 26px;
                font-weight: 500;
                color: #696969;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 2px solid #EDEDED;
                .left{
                    width: 0;
                    flex: 1;
                    text-align: center;
                }
                .right{
                    width: 104px;
                    text-align: center;
                    margin-left: 30px;
                    word-break: keep-all;
                }
            }
            .list-content{
                display: flex;
                align-items: center;
                padding: 0 30px;
                .content-left{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .number{
                        font-size: 26px;
                        font-weight: 500;
                        color: #999999;
                    }
                    img{
                        width: 100px;
                        height: 100px;
                        border-radius: 8px;
                        padding: 0 16px;
                    }
                }
                .content-right{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    padding: 40px 0;
                    border-bottom: 2px solid #EDEDED;
                    .left-info{
                        width: 0;
                        flex: 1;
                        .info-name{
                            font-size: 28px;
                            font-weight: 500;
                            color: #191919;
                        }
                        div{
                            font-size: 22px;
                            font-weight: 400;
                            color: #999999;
                        }
                    }
                    .right-info-price{
                        color: #FF1E19;
                        width: 104px;
                        text-align: center;
                        font-size: 26px;
                        font-weight: 500;
                    }
                    .right-info-value{
                        color: #FE7E41;
                        width: 104px;
                        text-align: center;
                        font-size: 26px;
                        font-weight: 500;
                        margin-left: 30px;
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
