<template>
    <div class="order_detail">
        <div class="detail_head">
            <van-nav-bar title="订单详情" left-arrow @click-left="onClickLeft"/>
        </div>
        <div class="main">
            <div class="order_info">
                <div class="order_info_title">
                    <p>华腾世纪A座</p>
                    <div class="item_statu"> <span>查看原订单</span> <img src="../../assets/title_right.png" alt=""></div>
                </div>
                <div></div>
                <div></div>
            </div>
            <div class="order_particulars">2</div>
            <div class="facility_info">3</div>
        </div>
    </div>
</template>

<script setup>
import '../../assets/title_right.png'
</script>

<style scoped lang="scss">
.order_detail{
    width: 100%;
    height: 100%;
    background: #F4F5F5;
    display: flex;
    flex-direction: column;
    .detail_head{
        width: 100%;
    }
    .main{
        width: 100%;
        flex: 1;
        padding: 20px 30px 20px 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .order_info{
            width: 100%;
            height: 870px;
            background-color: #fff;
            .order_info_title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;
                p{
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #191919;
                    line-height: 33px;
                    padding-left: 10px;
                    box-sizing: border-box;
                    border-left: solid 15px #FE7E41;
                    font-weight: 600;
                }
                .item_statu{
                    // width: 72px;
                    // height: 33px;
                    font-size: 24px;
                    font-weight: 500;
                    color: #FE7E41;
                    display: flex;
                    align-items: center;
                    img{
                        width: 24px;
                        height: 24px;
                        margin-left: 10px;
                    }
                }
            }
        }
        .order_particulars{
            width: 100%;
            height: 373px;
            border-radius: 8px;
            background-color: #fff;
            margin-top: 20px;
        }
        .facility_info{
            width: 100%;
            height: 428px;
            border-radius: 8px;
            background-color: #fff;
            margin-top: 20px;
        }
    }
}
</style>
