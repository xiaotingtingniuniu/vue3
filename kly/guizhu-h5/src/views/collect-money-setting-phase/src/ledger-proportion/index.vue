<template>
    <div class="ledger-proportion">
        <div class="search">
            <form action="/" class="input">
                <van-search v-model="searchData" placeholder="请输入手机号或姓名" :left-icon="require('@/assets/search2.png')" @search="onSearch" />
            </form>
        </div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                class="so_list"
            >
                <van-cell class="listItem" v-for="(item, index) in listData" :key="index">
                    <div class="item_title">
                        <p>
                            <img :src="item.type === 0 ? require('@/assets/person.png') : require('@/assets/enterprise.png')" alt="" />
                            <template v-if="item.type === 0">{{item.name}}-{{item.mobile}}</template>
                            <template v-if="item.type === 1">{{item.name}}-{{item.accountNo}}</template>
                        </p>
                        <div class="item_statu">
                            <div class="rate_text">{{item.statusDesc}}</div>
                        </div>
                        <!-- <div class="item_statu" v-if="item.status === 0">
                            <div class="delay_text">未生效</div>
                        </div>
                        <div class="item_statu" v-if="item.status === 2">
                            <div class="delay_text">己失效</div>
                        </div> -->
                    </div>
                    <div class="item_content">
                        <p>
                            <span class="content_title">分账比例</span>
                            <span class="content_value">{{item.rate}}%</span>
                        </p>
                        <p>
                            <span class="content_title">关联设备</span>
                            <span class="content_value">{{item.deviceName}}-{{item.deviceNo}}</span>
                        </p>
                        <p>
                            <span class="content_title">合作状态</span>
                            <span class="content_value">{{item.deviceStatusDesc}}</span>
                            <!-- <span class="content_value" v-if="item.deviceStatus === 1">{{item.deviceStatusDesc}}</span> -->
                        </p>
                        <p>
                            <span class="content_title">平台优惠券补贴分账</span>
                            <span class="content_value">
                                {{item.subsidyStatusCheckout ? '是' : '否'}}
                                <!-- <van-switch v-model="item.subsidyStatusCheckout" disabled size="15"/> -->
                            </span>
                        </p>
                    </div>
                    <div class="item_footer">
                        <!-- 已失效的不可以编辑 -->
                        <van-button v-if="item.status !== 2 && item.deviceStatusDesc === '绑定'" @click="toEdit(item)">编辑结算</van-button>
                        <!-- <div>
                            <van-button>启用</van-button>
                        </div> -->
                    </div>
                </van-cell>
            </van-list>
        </van-pull-refresh>
        <!-- <div class="footer">
            <van-button type="primary" round :icon="require('@/assets/add2.png')" text="添加分账规则" color="#FE7E41" to="add-proportion"></van-button>
        </div> -->
        <van-popup
            v-model:show="accountPopupVisible"
            position="bottom"
            class="popup-container-person"
            :close-on-click-overlay="false"
        >

            <div class="pop-top">
                <span @click="closePop"><img src="@/assets/close.png" class="close-btn"></span>
                <span class="sure-btn" @click="toProportion">确定</span>
            </div>
            <div
                v-for="(item, index) in merchantSubList"
                :key="index"
                :class="['container-item']"
                @click="checkAccount(item, index)"
            >
                <span>{{item.name}}-{{item.phoneMobileScret}}</span>
                <span v-if="item.checked"><img src="@/assets/check-mark.png" class="checked-icon"></span>
            </div>
        </van-popup>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { subledgerRateList, getAcountListEffective } from '@/api/collect-money-setting.js'
// import { useRouter } from 'vue-router'
import { newPage } from '@/utils/composables'
import { setAppStorageFn } from '@/utils/storage'
import { Toast } from 'vant'

// const router = useRouter()
const listData = ref()
const searchData = ref('')
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const onLoad = async () => {
    const res = await subledgerRateList({ page: pageNum.value, mobileOrName: searchData.value })
    loading.value = false
    if (res.code === '200') {
        if (refreshing.value) {
            listData.value = []
            refreshing.value = false
        }
        listData.value = pageNum.value === 1 ? res.data.list : [...listData.value, ...res.data.list]
        listData.value.map(item => {
            if (item.subsidyFlag === 1) {
                item.subsidyStatusCheckout = true
            } else {
                item.subsidyStatusCheckout = false
            }
            return item
        })
        if ((res.data.total / 10) < pageNum.value) {
            finished.value = true
            return
        }
        pageNum.value++
    } else {
        finished.value = true
    }
}
const onRefresh = () => {
    finished.value = false
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true
    pageNum.value = 1
    onLoad()
}
const onSearch = () => {
    pageNum.value = 1
    onLoad()
}
const toEdit = (item) => {
    // sessionStorage.setItem('FZ_ITEM', JSON.stringify(item))
    setAppStorageFn('FZ_ITEM', JSON.stringify(item))
    newPage(`/mine/add-proportion/${item.ruleConfigId}/${item.subLedgerId}`)
    // router.push({ name: 'add-proportion', params: { configId: item.ruleConfigId } })
}

const accountPopupVisible = ref(false)
const personInfo = ref(null) // 选中分账人信息
const merchantSubList = ref([])

// 获取账户列表
const queryPersonList = async () => {
    const res = await getAcountListEffective({
        // appKey: '',
        // busiCode: '',
        // accountId: 1
        merchantSubType: 3,
        pageSize: 999,
        page: 1
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

// 添加分账规则
const addRules = () => {
    queryPersonList()
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

// 跳转分账规则页面
const toProportion = (item) => {
    if (!personInfo.value) {
        Toast('请选择分账人')
        return
    }
    accountPopupVisible.value = false
    const info = personInfo.value
    const params = {
        mobile: info.phoneMobile,
        name: info.name,
        subLedgerId: info.subLedgerId
    }
    console.log('跳转分账规则')
    newPage(`/mine/add-proportion?mobile=${params.mobile}&name=${params.name}&subLedgerId=${params.subLedgerId}`, params)
}
const closePop = () => {
    accountPopupVisible.value = false
    personInfo.value = null
}
defineExpose({
    addRules,
    onRefresh,
    loading
})
</script>
<style lang="scss" scope>
.ledger-proportion{
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    .search{
        width: 100%;
        // height: 130px;
        .van-search{
            // padding: 36px 40px 30px 40px;
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
            position: relative;
            width: 100%;
            // height: 465px;
            background-color: #fff;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            .item_title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 20px;
                box-sizing: border-box;
                border-bottom: solid 1px #F2F6F9;
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
                .item_statu{
                    width: 120px;
                    height: 33px;
                    line-height: 40px;
                    font-size: 24px;
                    text-align: right;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    .rate_text{
                        color: #FE7E41;
                    }
                    .item_become{
                        color: #B0B0B0;
                    }
                    .delay_text{
                        color: #69925A;
                    }
                    .item_refuse{
                        color: #FF2442;
                    }
                }
            }
            .item_content{
                width: 100%;
                p{
                    width: 100%;
                    height: 37px;
                    display: flex;
                    justify-content: space-between;
                    margin-top: 16px;
                    font-size: 26px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 37px;
                    .content_title{
                        // width: 690px;
                        background: #FFFFFF;
                        border-radius: 8px;
                        font-size: 26px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #999;
                    }
                    .content_value{
                        // width: 100%;
                        height: 37px;
                        text-align: right;
                        font-size: 26px;
                        font-weight: 400;
                        color: #191919;
                        line-height: 37px;
                    }
                }
            }
            .item_footer{
                width: 100%;
                display: flex;
                margin-top: 16px;
                justify-content: flex-end;
                .van-button{
                    padding: 0 32px;
                    height: 62px;
                    margin-left: 20px;
                    background: #FFFFFF;
                    border-radius: 34px;
                    border: 1px solid #FE7E41;
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
                .presionIcon{
                    width: 160px;
                    height: 62px;
                    background: #fff;
                    margin-left: 20px;
                    border-radius: 31px;
                    border: 1px solid #E0E0E0;
                }
            }
        }
    }
    .footer{
        width: 100%;
        height: 210px;
        display: flex;
        justify-content: center;
        align-content: center;
        .van-button{
            width: 630px;
            height: 92px;
            margin-top:25px;
        }
    }
    .van-popup {
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
        line-height: 100px;
        margin-left: 50px;
        padding-right: 50px;
        border-bottom: 1px solid #F4F5F5;
        .checked-icon{
            width: 30px;
            height: 24px;
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
