<template>
    <div class="goods-item--3">
        <div class="item_title">
            <div class="titleBox">
                <div class="titleImg">
                    <img src="../../../assets/replenishmentImg/grouping2x.png" alt="">
                    {{goods.deviceInfo?goods.deviceInfo.deviceName:''}}
                </div>
            </div>
            <div class="item_statu" >
                <div  :class="{
                    orang_color: goods.workOrderStatus === '待支付'|| goods.workOrderStatus === '退款待处理',
                    grancy_color: goods.workOrderStatus === '已完成'||goods.workOrderStatus === '退款完成',
                    green_color: goods.workOrderStatus === '退款处理中',
                    red_color: goods.workOrderStatus === '退款拒绝'
                }">{{goods.workOrderStatus}}</div>
            </div>
        </div>
        <div class="item_content">
            <div class="goods-item-img" v-if="goods.goodsList.length>0">
                <div class="item_img" v-for="(subItem,index) in goods.goodsList" :key="index">
                    <img class="img" :src="subItem.skuImgUrl" alt="" v-if="subItem.skuImgUrl"/>
                </div>
            </div>
            <div class="goods-item-img" v-else>
                <img class="img" src="../../../assets/default.png" alt=""  />
            </div>
            <div class="item_count">共<span>{{goods.skuCount}}</span>件</div>
        </div>
        <div class="item_footer">
            <p>{{goods.createTime}}</p>
            <div>合计：
                <img src="../../../assets/replenishmentImg/Group@2x.png" alt="" class="moneyBox">
                <span class="total-price">{{(goods.totalAmount/100).toFixed(2)}}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
    goods: {
        type: Object,
        default: () => {}
    }
})
const goods = ref(props.goods)
watch(() => [props.goods], (newVal, oldVal) => {
    goods.value = newVal[0]
})

</script>
<style lang="scss" scoped>
.goods-item--3{
    margin: 20px 30px 0 30px;
    padding: 30px 30px 27px 30px;
    background: #FFFFFF;
    border-radius: 8px;
    .item_title{
        display: flex;
        justify-content: space-between;
        justify-items: center;
        .titleBox{
            .titleImg{
                img{
                   width: 30px;
                   height: 28px;
                }
            font-size: 28px;
            font-weight: 500;
            color: #696969;
            }
        }
        .item_statu{
            font-size: 24px;
            font-weight: 500;
            color: #FE7E41;
            line-height: 33px;
        }
    }
    .item_content{
        display: flex;
        justify-content: space-between;
        justify-items: center;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #F4F5F5;
        .goods-item-img{
            .item-img{
                img{
                width: 120px;
                height: 120px;
            }
            }

            img{
                width: 120px;
                height: 120px;
            }
        }
        .item_count{
            font-size: 20px;
            font-weight: 400;
            color: #494849;
            letter-spacing: 1px;
        }
    }
    .item_footer{
        display: flex;
        justify-content: space-between;
        justify-items: center;
        align-items: center;
        font-size: 22px;
        font-weight: 400;
        color: #B0B0B0;
        margin-top: 27px;
        .total-price{
            font-size: 28px;
            font-weight: 400;
            color: #FE7E41;
        }
        .moneyBox{
            width: 12px;
            height: 14px;
            margin-right: 5px;
            margin-top: 5px;
        }
    }
}
</style>
