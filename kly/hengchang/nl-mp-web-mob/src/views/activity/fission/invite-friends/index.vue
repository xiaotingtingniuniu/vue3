<template>
    <div class="invite-friends">
        <activity-conduct
            v-if="dataState.isActivity"
            :time="dataState.time"
            :invitationCouponList="dataState.invitationCouponList"
            :invitedCouponList="dataState.invitedCouponList"
            :loading="dataState.loading"
            @btn-change="btnChange"
            @refresh="onRefresh"
            :receive-change="dataState.receiveChange"
            :invitation-coupon-desc="dataState.invitationCouponDesc"
            :promoCode="dataState.promoCode"
            :info="dataState.activityInfo"
        >
        </activity-conduct>
        <activity-end v-else></activity-end>
        <div class="fission-card recode-container">
            <h3 class="fission-card-title">奖励到账记录</h3>
            <p class="recode-total" v-if="dataState.recodeList.length">已到账：{{dataState.recodeList.length}}人</p>
            <ul class="recode-list" v-if="dataState.recodeList.length">
                <li class="fx a-l-c recode-item" v-for="recode in dataState.recodeList" :key="recode.index">
                    <van-image
                        :src="recode.portrait || require('@assets/activity/fission/fefault-pictrue.png')"
                    >
                    </van-image>
                    <div class="content fx-1">
                        <div class="name">{{recode.inviteeNickName}}</div>
                        <div class="time">{{recode.inviteTime}}</div>
                    </div>
                    <div class="status">已到账</div>
                </li>
            </ul>
            <div class="fission-empty" v-else>您还没有奖励到账记录哦<br/>快去邀请好友获得奖励吧</div>
        </div>
        <footer class="footer fx j-s-c a-l-c">
            <img :src="require('@assets/activity/fission/footer-icon.png')" alt="">
        </footer>
        <div class="empty-content" v-if="dataState.isActivity"></div>
        <div class="footer-receive" v-if="dataState.isFooterBtn">
            <div class="btn" v-if="dataState.invitationCouponList.length || dataState.invitedCouponList.length" @click="dataState.receiveChange = !dataState.receiveChange">立即邀请</div>
            <div class="btn btn-d-6" v-else>立即邀请</div>
            <div></div>
        </div>
    </div>
</template>
<script setup>
import { reactive, watch } from 'vue'
import activityConduct from './components/activity-conduct.vue'
import activityEnd from './components/activity-end.vue'
import { getInviteList, getActivityInfo } from '@api/fission'
import { useStore } from 'vuex'

const store = useStore()

const dataState = reactive({
    recodeList: [],
    isActivity: true,
    time: '',
    invitationCouponList: [],
    invitedCouponList: [],
    loading: false,
    isFooterBtn: false,
    receiveChange: false,
    activityEnd: false,
    promoCode: '',
    activityInfo: {}
})

function countDown (Time) {
    const nowTime = new Date() // 当前时间的时间戳
    const inputTime = new Date(Time) // 传进来时间的时间戳
    if (nowTime >= inputTime) {
        return {
            isEnd: true,
            time: ''
        }
    }
    const times = (inputTime - nowTime) / 1000 // times 为剩余时间 (倒计时) 秒数
    let d = parseInt(times / 60 / 60 / 24) // 倒计时多少天
    d = d < 10 ? '0' + d : d // 三元运算符判断天数是否小于 10, 小于的话在前边加个0
    let h = parseInt(times / 60 / 60 % 24) // 倒计时多少小时
    h = h < 10 ? '0' + h : h
    let m = parseInt(times / 60 % 60) // 倒计时多少分钟
    m = m < 10 ? '0' + m : m
    let s = parseInt(times % 60) // 倒计时多少秒
    s = s < 10 ? '0' + s : s
    // return d + '天' + h + '时' + m + '分' + s + '秒'
    const D = d > 0 ? `${d}天` : ''
    const H = (D && h === '00') || h > 0 ? `${h}:` : ''
    const M = m > 0 ? `${m}:` : ''

    return {
        isEnd: false,
        time: D + H + M + s
    }
}

const getTime = (time) => {
    const timer = setInterval(() => {
        const obj = countDown(time)
        if (obj.isEnd) {
            dataState.isActivity = false
            clearInterval(timer)
            dataState.activityEnd = true
            init()
        } else {
            dataState.time = obj.time
        }
    }, 1000)
}
const init = async () => {
    dataState.loading = true
    const res = await getActivityInfo()
    dataState.loading = false
    if (res.code === '200') {
        dataState.activityInfo = res.data
        dataState.promoCode = res.data.promoCode
        if (!dataState.activityEnd) {
            getTime(res.data.endTimeStamp)
        }
        dataState.invitationCouponDesc = res.data.invitationCouponDesc
        // 根据优惠券金额过滤优惠券列表
        dataState.invitationCouponList = res.data?.invitationCouponList.filter(el => {
            if (el.couponMinusViewName) {
                return el
            }
        })
        dataState.invitedCouponList = res.data?.invitedCouponList.filter(el => {
            if (el.couponMinusViewName) {
                return el
            }
        })
    }
}

const btnChange = flag => {
    dataState.isFooterBtn = flag
}

onMounted(async () => {
    watch(
        () => store.state.token,
        async () => {
            if (store.state.token) {
                init()
                // 用户邀请记录
                const recodeList = await getInviteList()
                dataState.recodeList = recodeList || []
            }
        },
        {
            immediate: true
        }
    )
})

const onRefresh = () => {
    init()
    getInviteList()
}

</script>
<style lang="scss" scoped>
.invite-friends {
    min-height: 100vh;
    background: #FE8029;
    .recode-container {
        // padding: 0 34px;
        // box-sizing: border-box;
        .recode-total {
            margin: 40px 34px 0;
            height: 40px;
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            text-indent: 30px;
            color: #7C3312;
            line-height: 40px;
        }
        .recode-list {
            margin: 25px 34px 36px;
            // margin-bottom: 36px;
            max-height: 697px;
            overflow-y: scroll;
            .recode-item {
                padding: 20px 30px;
                margin-bottom: 23px;
                background: #FFF1E8;
                border-radius: 16px;
                border: 1px solid #FFD6CF;
                &:last-child {
                    margin-bottom: unset;
                }
                .van-image {
                    width: 84px;
                    height: 82px;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .content {
                    margin: 0 20px;
                    .name {
                        height: 40px;
                        font-size: 28px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: #7F3615;
                        line-height: 40px;
                    }
                    .time {
                        margin-top: 14px;
                        height: 30px;
                        font-size: 22px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #CF6D41;
                        line-height: 30px;
                    }
                }
                .status {
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #FF464C;
                }
            }
        }
    }
    .footer {
        height: 147px;
        img {
            display: block;
            width: 200px;
            height: 47px;
        }
    }
    .footer-receive {
        position: fixed;
        left: 0;
        bottom: 0;
        transition: all .8s;
        width: 100%;
        height: 168px;
        background: #FFF5EA;
        // border-radius: 30px 30px 0 0;
        .btn {
            margin: 12px auto 0;
            width: 612px;
            height: 96px;
            background: url('~@assets/activity/fission/button-bg.png') no-repeat;
            background-size: 100% 100%;
            font-size: 38px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 96px;
            text-align: center;
        }
        .disable-btn {
            opacity: 0.6;
        }
    }
    .empty-content {
        height: 168px;
    }
}
</style>
