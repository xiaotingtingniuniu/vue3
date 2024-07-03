<template>
    <div class="ledger-manage mine-content">
        <van-pull-refresh class="drop-down" v-model="refreshing" @refresh="onRefresh">
            <div class="ledger-title">绑定收款账户</div>
            <div class="so_list">
                <van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
                    <van-cell class="listItem" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
                        <div class="item_title">
                            <div class="info_box">
                                <div class="title">
                                    <div class="title-top">{{item.name}}</div>
                                    <span class="item_statu item_paid" v-if="item.statusDesc === '未生效'">未生效</span>
                                    <span class="item_statu item_become" v-if="item.statusDesc === '已生效'">已生效</span>
                                    <span class="item_statu item_become" v-if="item.statusDesc === '已邀请'">已邀请</span>
                                </div>
                                <div v-if="item.mobile" class="mobile-tit">{{'手机号'}} {{item.mobileScret}}</div>
                                <div v-if="item.accountNo && item.type !== 0" class="accountNo-tit">商户号 {{item.accountNo}}</div>
                                <div class="mobile-tit" v-if="item.statusDesc === '已生效' && roleName === '柜主'">{{'合作状态'}} {{item.cooperationStatusDesc}}</div>
                            </div>
                            <div class="showPopupBtn"><van-button class="btn" v-if="item.statusDesc === '未生效' && item.isOwnerSelf" @click.stop="toChangeAccount(item)">开通收款</van-button></div>
                            <div class="showPopupBtn"><van-button class="btn" v-if="item.statusDesc === '未生效' && !item.isOwnerSelf" @click.stop="invite(item)">邀请成为收款人</van-button></div>
                            <div class="showPopupBtn"><van-button class="btn" v-if="item.statusDesc === '已生效' && item.isOwnerSelf" @click.stop="toChangeAccount(item)">更换收款账户</van-button></div>
                        </div>
                    </van-cell>
                </van-list>
            </div>
            <van-empty v-if="!list.length" :image="require('@/assets/no_data.png')" image-size="120" description="暂无收款账号"/>
        </van-pull-refresh>
        <!-- <div class="footer">
            <van-button type="primary" round :icon="require('@/assets/add2.png')" text="添加" color="#FE7E41" @click="addPersonPhase"></van-button>
        </div> -->
        <van-popup v-model:show="accountPopupVisible" position="bottom" class="popup-container-person" :close-on-click-overlay="false">
            <div class="pop-top">
                <span @click="closePop"><img src="@/assets/close.png" class="close-btn"></span>
                <span class="sure-btn" @click="gotoPerson">确定</span>
            </div>
            <div v-for="(item, index) in merchantSubList" :key="index" :class="['container-item']" @click="checkAccount(item, index)">
                <span class="info">
                    <span class="name">{{item.merchantSubName}}</span>
                    <span class="moblie">-{{item.phoneMobileScret}}</span>
                </span>
                <span v-if="item.checked"><img src="@/assets/check-mark.png" class="checked-icon"></span>
            </div>
        </van-popup>
    </div>
</template>
<script setup>
import { ref, computed, reactive } from 'vue'
import { subledgerList, getAcountList2, queryInvite } from '@/api/collect-money-setting.js' // querySubledgerPayee
import { useStore } from 'vuex'
import { newPage } from '@/utils/composables'
import { Toast } from 'vant'

const store = useStore()
const roleName = computed(() => store.state.roleName)
const token = computed(() => store.state.token)
const list = ref([])
const merchantSubList = ref([])
const searchData = ref('')
const loading = ref(false)
const finished = ref(false)
const accountPopupVisible = ref(false)
const personInfo = ref(null) // 选中分账人信息
const refreshing = ref(false)

const entityUserId = computed(() => store.state.userInfo.merchantId)

const goDetail = (item) => {
    if (item.statusDesc !== '未生效' && !item.isOwnerSelf && roleName.value === '柜主') {
        newPage(`/mine/collect-money-detail/${item.subLedgerId}?name=${item.name}&mobileScret=${item.mobileScret}`, {
            name: item.name,
            mobileScret: item.mobileScret
        })
    }
}

// 更换绑定
const toChangeAccount = (item) => {
    const params = {
        mobile: item.mobile,
        mobileScret: item.mobileScret,
        name: item.name,
        accountNo: item.accountNo,
        merchantSubId: item.subLedgerId,
        merchantType: item.type, // roleType:1柜主，2子账号,子账号身份只能是个人，柜主身份可能是个人，可能是企业；merchantType： 1企业，0个人
        merchantSubType: item.merchantSubType || ''
    }
    // newPage(`/change-account?mobileScret=${params.mobileScret}&mobile=${params.mobile}&name=${params.name}&accountNo=${params.accountNo}&merchantSubId=${params.merchantSubId}&merchantType=${params.merchantType}`, params)
    newPage(`/payment-method?mobileScret=${params.mobileScret}&mobile=${params.mobile}&name=${params.name}&accountNo=${params.accountNo}&merchantSubId=${params.merchantSubId}&merchantType=${params.merchantType}&merchantSubType=${params.merchantSubType}`, params)
}
// 邀请成为收款人
const invite = async (item) => {
    const res = await queryInvite({ subLedgerId: item.subLedgerId, entityUserId: entityUserId.value })
    if (res.code === '200') {
        Toast('邀请成功')
        onRefresh()
    }
}
const pageInfo = reactive({
    pageNo: 1,
    pageSize: 10
})
const onRefresh = () => {
    finished.value = false
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true
    pageInfo.pageNo = 1
    onLoad()
}

const finishedText = ref('') // 没有更多数据提示
const onLoad = async () => {
    loading.value = true
    const params = {
        pageSize: pageInfo.pageSize,
        page: pageInfo.pageNo,
        mobileOrName: searchData.value,
        functionType: 1
    }
    const res = await subledgerList(params)
    if (res.code === '200') {
        refreshing.value = false
        if (pageInfo.pageNo === 1) {
            list.value = res.data.list
        } else {
            list.value = list.value.concat(res.data.list)
        }
        geTel()
        if (list.value.length >= res.data.total) {
            finishedText.value = '没有更多了'
        } else {
            finishedText.value = ''
        }
        if (list.value.length === (pageInfo.pageNo * pageInfo.pageSize)) {
            pageInfo.pageNo++
        }
        loading.value = false
        // 数据全部加载完成
        if (list.value.length >= res.data.total) {
            finished.value = true
        }
    } else {
        finished.value = true
        loading.value = false
    }
}

const geTel = () => {
    list.value.map(tel => {
        tel.mobile = tel.mobile?.replace(/(\d{3})(\d*)/, ($, $1, $2) => $1 + ' ' + $2.replace(/\d{4}|\d+/g, $ => $ + ' ').trim()).trim()
    })
}
// 添加收款人
const addPersonPhase = () => {
    queryPersonList()
}
// 获取账户列表
const queryPersonList = async () => {
    const res = await getAcountList2({
        appKey: '',
        busiCode: '',
        accountId: 1
    })
    if (res.code === '200') {
        if (res.data.length > 0) {
            accountPopupVisible.value = true
            merchantSubList.value = res.data
        } else {
            Toast('当前无可添加分账方')
        }
    } else {
        Toast(res.msg)
    }
}

// 选择账户
const checkAccount = async (info, index) => {
    personInfo.value = info
    merchantSubList.value.forEach((item, subIndex) => {
        item.checked = false
        if (subIndex === index) {
            merchantSubList.value[index].checked = true
        } else {
            item.checked = false
        }
    })
}

// 跳转分账人页面
const gotoPerson = () => {
    if (!personInfo.value) {
        Toast('请选择分账人')
        return
    }
    accountPopupVisible.value = false
    const info = personInfo.value
    const params = {
        mobile: info.phoneMobile,
        mobileScret: info.phoneMobileScret,
        name: info.merchantSubName,
        accountNo: info.idCard,
        merchantSubId: info.merchantSubId,
        merchantType: info.roleType === 2 ? 2 : info.merchantType, // roleType:1柜主，2子账号,子账号身份只能是个人，柜主身份可能是个人，可能是企业；merchantType： 1企业，2个人
        showNavbar: 0,
        merchantSubType: info.merchantSubType
    }
    newPage(`/add-routing-person-phase?mobileScret=${params.mobileScret}&mobile=${params.mobile}&name=${params.name}&accountNo=${params.accountNo}&merchantSubId=${params.merchantSubId}&merchantType=${params.merchantType}&merchantSubType=${params.merchantSubType}`, params)
}

// // 跳转设备管理
// const toDevice = (val) => {
//     router.push({
//         name: 'operation-account',
//         params: {
//             merchantSubId: val?.subLedgerId ?? 'emty',
//             merchantSubType: val?.merchantSubType ?? 'emty',
//             phoneMobile: val?.mobile ?? 'emty',
//             merchantSubName: val?.name ?? 'emty',
//             realRight: val?.realRight ?? 'emty',
//             canAdd: 1
//         }
//     })
// }

const closePop = () => {
    accountPopupVisible.value = false
    personInfo.value = null
}
// 监听h5页面后台运行 再打开后刷新当前数据
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && token.value) {
        onLoad()
    }
})
defineExpose({
    addPersonPhase,
    onRefresh,
    loading
})
</script>
<style lang="scss" scoped>
.mine-content{
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #FE7E41;
    --van-nav-bar-title-font-size: 34px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
        .van-hairline--bottom:after{
            border-bottom-width: 0;
        }
    }
}

::v-deep(.van-nav-bar__title) {
    font-size: 34px;
    font-weight: bold;
}
::v-deep(.van-nav-bar .van-icon) {
    font-size: 35px;
    color: #000;
    font-weight: bold;
}
.drop-down {
    overflow: visible;
}
.ledger-title {
    width: 100%;
    padding: 24px 30px 0 30px;
    box-sizing: border-box;
    font-size: 30px;
    font-weight: 500;
    color: #323340;
    line-height: 42px;
}
.qrcode {
    width: 250px !important;
    height: 250px !important;
}
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.van-field__error-message {
    text-align: right !important;
}
.block {
    width: 120px;
    height: 120px;
    background-color: #fff;
}
.or-code-box{
    margin-top: 56px;
    // width: 100%;
    // height: 100%;
    width: 548px;
    height: 523px;
    border-radius: 8px;
    display:flex ;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    .or-code-img{
        width: 240px;
        height: 240px;
        background-color: #fff;
        border-radius: 30px;
        border: 8px solid rgba($color: #000000, $alpha: 0.05);
        display:flex ;
        justify-content: center;
        align-items: center;
        padding: 40px;
        img{
            width: 288px;
            height: 288px;
            background-color: #ccc;
        }
    }
    .p-top {
        margin-bottom: 20px;
        font-size: 30px;
        text-align: center;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000;
        line-height: 45px;
    }
    .p-bottom {
        margin-top: 30px;
        font-size: 26px;
        text-align: center;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000;
        line-height: 45px;
        padding: 0 40px;
    }
}

.wx-box-popup {
    width: 548px;
    height: 523px;

}
.ledger-manage{
    // width: 100%;
    // display: flex;
    // flex-direction: column;
    // height: 100%;
    .search{
        width: 100%;
        height: 130px;
        .van-search{
            padding: 36px 40px 30px 40px;
            .van-search__content{
                border-radius: 100px;
            }
            .van-field__left-icon{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 20px;
            }
        }
    }
    .so_list{
        width: 100%;
        padding: 20px 30px;
        box-sizing: border-box;
        padding-bottom: 120px;
        .listItem{
            padding: 34px 30px;
            position: relative;
            width: 690px;
            background-color: #fff;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            .item_title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
                .info_box{
                    flex: 1;
                }
                .showPopupBtn {
                    // width: 200px;
                    align-items: center;
                    .btn {
                        margin: 0!important;
                        font-weight: 400;
                        color: #FE7E41;
                        line-height: 33px;
                        font-size: 24px;
                        width: 180px;
                        height: 62px;
                        background: #FFFFFF;
                        border-radius: 34px;
                        border: 1px solid #FE7E41;
                    }
                }
                .mobile-tit {
                        margin-top: 16px;
                        font-size: 24px;
                        font-weight: 400;
                        color: #A2A7B0;
                        line-height: 33px;
                    }
                    .accountNo-tit {
                        margin-top: 8px;
                        height: 33px;
                        font-size: 24px;
                        font-weight: 400;
                        color: #A2A7B0;
                        line-height: 33px;
                    }
                    .accountNo-container{
                        font-size: 24px;
                        color: #10aeff;
                    }
                p{
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    display: flex;
                    justify-content: center;
                    color: #2E2E4D;
                    line-height: 40px;
                    img{
                    width: 32px;
                    height: 32px;
                    margin-top: 3px;
                    margin-right: 15px;
                    }
                }

                .title {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #191919;
                    line-height: 40px;
                    .title-top {
                        display:block;
                        width: max-content;
                        max-width:250px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: 28px;
                        font-weight: 500;
                        color: #191919;
                        line-height: 40px;
                    }
                    .item_statu{
                        display: inline-block;
                        margin-left: 12px;
                        text-align: center;
                        width: 83px;
                        height: 34px;
                        line-height: 34px;
                        text-align: center;
                        border-radius: 19px;
                        font-size: 20px;
                        font-family: PingFangSC-Regular, PingFang SC;
                    }
                    .item_paid{
                        color: #999;
                        background: #f5f5f5;
                    }
                    .item_become{
                        color: #69925A;
                        background: #E5F7DF;
                    }
                }
                .van-button{
                    padding: 0;
                    width: 160px;
                    height: 62px;
                    background: #FFFFFF;
                    border-radius: 34px;
                    border: 1px solid #FE7E41;
                    font-size: 24px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .van-button__content{
                        .van-button__text{
                            height: 33px;
                            font-size: 24px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #FE7E41;
                            line-height: 33px;
                        }
                    }
                }
            }
            .item_content{
                width: 100%;
                .content_item{
                    display: flex;
                    justify-content:space-between ;
                    align-items: center;
                    margin-top: 10px;
                    .content_title{
                        color: #999999;
                        padding: 10px 0;
                        box-sizing: border-box;
                    }
                }

            }
        }
    }
    .footer{
        position: fixed;
        padding: 0 60px;
        width: calc(100vw - 120px);
        bottom: 20px;
        bottom: calc(20px + constant(safe-area-inset-bottom));
        bottom: calc(20px + env(safe-area-inset-bottom));
        // width: 100%;
        // height: 210px;
        // display: flex;
        // bottom: 80px;
        // justify-content: center;
        // align-content: center;
        // position: fixed;
        // bottom: 0;
        .van-button{
            width: 630px;
            height: 92px;
            margin-top:75px;
        }
    }
    ::v-deep .or-code-box{
        width: 100%;
        height: 100%;
    }
    ::v-deep(.van-popup) {
        max-height: 70%;
        min-height: 572px;
    }
    .van-popup__close-icon {
        position: relative;
        left: 50%;
        top: 100px;
        transform: translate(-50%, 0);
        background: red;
    }
}
.popup-container-person{
    .container-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100px;
        // line-height: 100px;
        margin-left: 50px;
        padding-right: 50px;
        border-bottom: 1px solid #F4F5F5;
        .checked-icon{
            width: 30px;
            height: 24px;
        }
        .info{
            .name{
                display: inline-block;
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .moblie{
                display: inline-block;
                overflow: hidden;
            }
        }
    }
    .pop-top{
        height: 130px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #E7E7E7;
        padding: 0 50px;
        .close-btn{
            height: 46px;
            width: 46px;
        }
        .sure-btn{
            color: #FE7E41;
            font-size: 30px;
        }
    }
}
</style>
<style lang="scss">
    .wx-box-popup-scope {
        position: absolute;
        overflow-y: visible!important;;
    }
    .wx-box-popup-scope .van-popup__close-icon {
        position: relative;
        left: 50%;
        top: 100px;
        transform: translate(-50%, 0);
    }
</style>
