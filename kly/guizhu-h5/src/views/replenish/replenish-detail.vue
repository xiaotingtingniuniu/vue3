
<template>
    <div class="replenishment-detail">
        <div class="container">
            <div class="header-top">
                <van-icon name="warning" color="#FAA277"/>
                <div class="header-top-title">共补货商品{{ $route.query.skuTypeCount || 0 }}种，补货数量{{ $route.query.skuCount || 0 }}，补货后库存{{ $route.query.afterSkuCount || '--' }}</div>
            </div>
            <div class="header-content">补货日期：{{ $route.query?.changeDate?.split(' ')[0] }}</div>
            <div class="list-info">
                <div class="list-top">
                    <div class="left">商品信息</div>
                    <div class="right">补货数量</div>
                    <div class="right">补后库存</div>
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
                            <div>补前库存：{{ item.expectNum || 0 }}</div>
                        </div>
                        <div class="right-info">{{ item.difference || 0 }}</div>
                        <div class="right-info">{{ item.actualNum || 0 }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { replenishmentDetail } from '@/api/scan/scan.js'

const props = defineProps(['id'])

onBeforeMount(() => {
    getData()
})

const skuList = ref([])
const getData = async () => {
    const res = await replenishmentDetail({ billNo: props.id })
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
                color: #FE7E41;
                margin-left: 16px;
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
                    .right-info{
                        width: 104px;
                        text-align: center;
                        font-size: 26px;
                        font-weight: 500;
                        margin-left: 30px;
                    }
                }

            }
        }
    }
}
</style>
