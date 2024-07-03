<template>
    <div class="cancellation-agreement" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="pageBack">
                    <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="setting-title">
            <span class="agre-weight" v-if="!isApp">用户注销协议</span>
        </div>
        <div class="setting-change--details">
            <p class="text-indent">在您注销您的恒生活账号之前，请充分阅读、理解并同意下列事项：</p>
            <p class="text-indent">在此善意地提醒您，您注销本恒生活账号的行为，将导致我们终止对您提供本服务，也会给您的售后维权带来诸多不便。注销成功后，我们将删除您的个人信息，使其保持不可被检索、访问的状态，或对其进行匿名化处理。您知晓并理解，依据相关法律法规规定或双方约定，我们仅会在实现法律规定或双方约定目的所必须的最短时间内留存您的相关个人信息。</p>
            <br>
            <p class="agre-weight text-indent">1、如果您仍执意注销本恒生活账号，您的恒生活账号需同时满足以下条件:</p>
            <p class="agre-weight">（1）账号内无资产、无欠款；</p>
            <p class="agre-weight">（2）账号内无未完成的订单、已提供服务但未支付的订单；</p>
            <p class="agre-weight">（3）账号无任何纠纷，包括投诉举报或被投诉举报；</p>
            <p class="agre-weight">（4）账号可正常使用中且无任何被限制的记录；</p>
            <p class="agre-weight">（5）账号对应的恒生活支付账户已注销，且已妥善处理了恒生活支付账户下的所有问题。</p>
            <br>
            <p class="text-indent">2、在恒生活账号注销期间，如果您的恒生活账号涉及争议纠纷，包括但不限于投诉、举报、诉讼、仲裁、国家有权机关调查等，我们有权自行终止恒生活账号的注销而无需另行得到您的同意。</p>
            <br>
            <p class="agre-weight text-indent">3、恒生活账号一旦被注销将不可恢复，请您在操作之前自行备份恒生活账号相关的所有信息和数据。注销恒生活账号，您将无法再使用恒生活账号，也将无法找回您恒生活账号内所有历史记录信息（即使您使用相同的手机号码再次注册并使用），包括但不限于:</p>
            <p>（1）您将无法登录、使用恒生活账号；</p>
            <p>（2）恒生活账号的个人资料和历史信息(包括但不限于用户名、昵称、头像、订单记录等)都将无法找回；</p>
            <p>（3）您通过恒生活账号进行登录的恒生活旗下各网站/App所有记录将无法找回。您将无法再登录、使用前述服务，您曾获得的优惠券、积分、及其他卡券等视为您自行放弃，将无法继续使用。您理解并同意，恒生活无法协助您重新恢复前述服务。</p>
            <br>
            <p class="agre-weight text-indent">4、注销本恒生活账号并不代表本恒生活账号注销前的账号行为和相关责任得到豁免或减轻。</p>
        </div>
    </div>
</template>
<script setup>
import { isApp } from '@/utils'
import { pageBack } from '@/utils/composables'

</script>
<style lang="scss" scoped>
.status-bar-height{
    .van-nav-bar__placeholder{
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            .icon--unselect{
                .van-image{
                    width: 19px;
                    height: 31px;
                }
            }
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
}
.cancellation-agreement{
    background-color: white;
    padding-bottom: 100px;
    .setting-title{
        font-size: 32px;
        color: #222222;
        text-align: center;
        margin-top: 42px;
        margin-bottom: 26px;
    }
    .setting-change--details{
        width: 650px;
        margin: 0 auto;
        align-items: center;
        font-size: PingFangSC-Regular;
        font-size: 26px;
        color: #2C343E;
        p{
            line-height: 44px;
        }
    }
    .agre-weight{
        font-weight: bold;
    }
    .text-indent{
        text-indent: 48px;
    }
}
</style>
