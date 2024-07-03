<template>
    <div class="setting" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="$router.replace({name: 'agreement-privacy'})">
                    <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="setting-change--details">
            <p>为保障恒生活的稳定运行或实现相关功能，我们可能会接入由第三方提供的软件开发包 （SDK）实现前述目的。我们会对合作方获取个人信息的行为进行严格的安全监测，以保护 您的个人信息安全。</p>
            <p>我们对接入的相关第三方 SDK 及其他第三方主体收集信息的情况在以下目录中列明：</p>
            <p class="agre-weight">1.支付宝支付 SDK</p>
            <p class="agre-weight">信息获取：设备信息（mac 地址、serialnumber、SubscriberId）、交易信息（交易金额、交 易对象、交易商品、交易时间）、网络信息（IP 地址，WiFi 信息，基站信息信息）</p>
            <p class="agre-weight">使用目的：支付</p>
            <p class="agre-weight">隐私政策：<a class="agree" href="https://render.alipay.com/p/c/k2cx0tg8">https://render.alipay.com/p/c/k2cx0tg8</a></p>
            <p class="agre-weight">2.微信支付 SDK</p>
            <p class="agre-weight">信息获取：IMEI、IMSI、Android ID、IDFV、MAC 地址、IP 地址、WIFI 信息、基站信息、 位置信息、OAID、设备型号、设备类型、操作系统信息、交易信息（交易金额、交易对象、 交易商品、交易时间）</p>
            <p class="agre-weight">使用目的：支付</p>
            <p class="agre-weight">隐私政策：<a class="agree" style="word-wrap:break-word" href="https://www.tenpay.com/v3/helpcenter/low/privacy.shtml">https://www.tenpay.com/v3/helpcenter/low/privacy.shtml</a></p>
            <p class="agre-weight">3.微信分享 SDK</p>
            <p class="agre-weight">信息获取：网络状态，wifi 状态，手机状态，剪贴板</p>
            <p class="agre-weight">使用目的：社交平台分享</p>
            <p class="agre-weight">隐私政策：<a class="agree" href="https://privacy.qq.com">https://privacy.qq.com</a></p>
            <p class="agre-weight">4.个推推送 SDK</p>
            <p class="agre-weight">信息获取：设备标识符（IMEI、IDFA、Android ID、MAC、OAID、serialnumber、SubscriberId）、 应用信息（应用崩溃信息、通知开关状态、软件列表信息）、设备参数及系统信息（设备类 型、设备型号、操作系统及硬件信息），网络信息（IP 地址，WiFi 信息，基站信息信息）， 位置信息</p>
            <p class="agre-weight">使用目的：用于识别用户，优化推送通道资源，保证消息推送的精准送达、为开发者提高消 息送达率，为开发者提供智能标签以及展示业务统计信息的服务；优化 SDK 与个推服务器 的网络连接请求，保证服务的稳定性和连续性。</p>
            <p class="agre-weight">5.百度定位 SDK</p>
            <p class="agre-weight">信息获取：设备标识符、IP 地址、GPS 以及能够提供相关信息的其它传感器（比如可能会 为百度提供附近设备、WLAN 接入点和基站的信息）、设备参数及系统信息（设备类型， 设备型号，操作系统及硬件相关信息）</p>
            <p class="agre-weight">使用目的：经纬度定位，为用户提供位置相关的最优配比推荐服务</p>
            <p class="agre-weight">隐私政策：<a class="agree" href="https://map.baidu.com/zt/client/privacy">https://map.baidu.com/zt/client/privacy</a></p>
            <p class="agre-weight">6.腾讯 Location SDK：</p>
            <p class="agre-weight">信息获取：设备标识符（IMEI、IDFA、Android ID、MAC、OAID、serialnumber、SubscriberId）、 IP 地址、GPS</p>
            <p class="agre-weight">使用目的：首页推荐定位</p>
            <p class="agre-weight">隐私政策：<a class="agree" href="https://privacy.qq.com">https://privacy.qq.com</a></p>
            <p class="agre-weight">7.腾讯 TBS SDK：</p>
            <p class="agre-weight">信息获取：用户的国际设备识别码（IMEI）、国际移动用户识别码（IMSI）、Mac 地址、 Android ID、deviceid、serialnumber、用户机型、屏幕尺寸、操作系统版本号、目标 API、网 络类型、网络变化监听广播及 WIFI 的 mac 地址</p>
            <p class="agre-weight">使用目的：提供浏览服务 X5 内核</p>
            <p class="agre-weight">隐私政策：<a class="agree" href="https://www.tencent.com/zh-cn/privacy-policy.html">https://www.tencent.com/zh-cn/privacy-policy.html</a></p>
            <p class="agre-weight">8.bugly SDK：</p>
            <p class="agre-weight">信息获取：设备标识符（IMEI、IDFA、Android ID、MAC、OAID、serialnumber、SubscriberId）、应用信息（应用崩溃信息、通知开关状态、软件列表信息）、设备参数及系统信息（设备类型、设备型号、操作系统及硬件信息），网络信息（IP地址，WiFi信息，基站信息信息），位置信息</p>
            <p class="agre-weight">使用目的：用来统计线上崩溃异常日志，保证服务的稳定性和连续性。</p>
            <p class="agre-weight">隐私政策：<a class="agree" href="https://bugly.qq.com/docs/user-guide/instruction-manual-privacy/">https://bugly.qq.com/docs/user-guide/instruction-manual-privacy/</a></p>
        </div>
        <!-- <div class="bg-img">
            <div class="explain">1、iOS系统权限调用说明</div>
            <van-image :src="require('@/assets/mine/ios-agreement.png')"/>
            <div class="explain">2、Android系统权限调用说明</div>
            <van-image :src="require('@/assets/mine/android-agreement.png')"/>
        </div> -->
    </div>
</template>
<script setup>
import { isApp } from '@/utils'
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
.setting{
    background-color: white;
    .setting-change--details{
        width: 650px;
        margin: 0 auto;
        align-items: center;
        font-size: 26px;
        margin-top: 42px;
        margin-bottom: 26px;
    }
    .explain{
        height: 100px;
        line-height: 100px;
    }
    .agre-right{
        text-align: right;
    }
    .agre-weight{
        font-weight: bold;
    }
    .agreline{
        text-decoration: underline;
        color: #222222;
    }
    .agree{
        text-decoration: underline;
        color: #0975c2;
    }
}
</style>
