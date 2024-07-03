<template>
    <div class="largeBox">
        <el-card shadow="always">
            <div class="top">
                <div class="left">
                    <h2>账户中心</h2>
                    <h3>提现手续费账户</h3>
                    <p>可提现
                        <el-tooltip class="box-item" effect="dark" placement="right" >
                            <template #content>
                                <!-- <span>可提现最大金额为{{(user.subAvailableAmount*0.01).toFixed(2)}}元</span> -->
                                <span>批发商提现手续费</span>
                            </template>
                            <el-icon :size="20"><QuestionFilled /></el-icon>
                        </el-tooltip>
                    </p>
                    <div>{{user.currency=="CNY"?'￥':'$'}}{{(user.subAvailableAmount*0.01).toFixed(2)}}</div>
                    <!-- <el-tooltip class="box-item" effect="dark" placement="right" >
                        <template #content>
                            <span>提现功能升级中,敬请期待</span>
                        </template>
                        @click="isShow=true"
                        <el-button type="info" @click="isShow=true">提现</el-button>
                    </el-tooltip> -->
                    <el-button type="primary" @click="isShow=true">提现</el-button>
                </div>
                <div class="right">
                    <ul>
                        <!-- <li>绑卡信息<el-icon @click="cardEdit(user)" :size="20"><Edit /></el-icon></li>
                        <li>{{user.bankNumber}}</li> -->
                        <li>绑卡信息<el-icon @click="cardEdit(user)" :size="20"><Edit /></el-icon></li>
                        <li v-if="!user.bankNumber">{{user.bankNumber}}</li>
                        <li v-else>{{user.bankNumber.replace(/\d+(?=\d{3})/,"**** **** **** ")}}</li>
                        <li>{{user.bankAcctName}}</li>
                        <li>{{user.openBank}}</li>
                    </ul>
                </div>
            </div>
            <div class="main">
                <div class="detail">
                    <el-button type='primary' @click="ondetail(user.subAcctId)" link>动账明细</el-button>
                    <span style="margin-left:15px">
                        {{transTypeKeyValue[user.transactionInfo?.transType]?transTypeKeyValue[user.transactionInfo?.transType]:'无最新记录'}}
                        {{user.transactionInfo?.transType?user.currency=="CNY"?'￥':'$':''}}{{user.transactionInfo?.transType?(user.transactionInfo?.transAmount*0.01).toFixed(2):''}}
                        {{user.transactionInfo?.transType?user.transactionInfo?.transTime:''}}
                    </span>
                </div>
                <div class="record">
                    <el-button type='primary' @click="onrecord(user.subAcctId)" link>提现记录</el-button>
                    <span style="margin-left:15px">
                        {{statusKeyValue[user.withdrawInfo?.status]?statusKeyValue[user.withdrawInfo?.status]:'无最新记录'}}
                        {{user.withdrawInfo?.status?user.currency=="CNY"?'￥':'$':''}}{{user.withdrawInfo?.status?(user.withdrawInfo?.transAmount*0.01).toFixed(2):''}}
                        {{user.withdrawInfo?.status?user.withdrawInfo?.transTime:''}}
                    </span>
                </div>
            </div>
        </el-card>
        <div class="bottom" v-if="isShow">
            <div class="bottom-left">
                <el-form style="margin-top:20px" :inline="true" label-position="right" label-width="100px" >
                    <div class="input-box">
                        <el-form-item label="提现金额">
                            <div class="input">
                                <input type="text"  v-model="upMoney" placeholder="请输入提现金额～">
                                <el-button @click="assignment" class="warp-btn" link>全部</el-button>
                            </div>
                            <div style="margin-left:5px;">
                                元
                            </div>
                            <div class="span">
                                <span>当前余额<strong>{{user.currency=="CNY"?'￥':'$'}}{{(user.subAvailableAmount*0.01).toFixed(2)}}</strong></span>
                            </div>
                        </el-form-item>
                        <div class="button">
                            <el-button type="primary" @click="withdrawal(upMoney)">
                                提现
                            </el-button>
                            <el-button @click="close">
                                取消
                            </el-button>
                        </div>
                    </div>
                </el-form>
            </div>
            <div class="bottom-right">
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// import { getUserInfo, withdrawalApi } from '@/api/capital'
import { publicRequest } from '@/api/common/index.js'
import { ElMessage } from 'element-plus'
const store = useStore()
const router = useRouter()
const upMoney = ref(null)
const isShow = ref(false)

const assignment = () => {
    upMoney.value = (user.value.subAvailableAmount * 0.01).toFixed(2)
}
const getloginOrgRole = () => {
    if (store.state.loginOrgRole && typeof store.state.loginOrgRole !== 'object') {
        return JSON.parse(store.state.loginOrgRole)
    } else {
        return store.state.loginOrgRole
    }
}
const loginOrgRole = getloginOrgRole()
const statusKeyValue = ref({ 0: '处理中', 1: '提现成功', 2: '提现失败', 3: '处理中', 4: '处理中', 5: '待处理' })
const transTypeKeyValue = ref({ 1: '充值', 2: '收入', 3: '消费', 4: '退款', 5: '提现', 6: '分佣', 7: '结算', 8: '提现手续费' })
const user = ref({})
const getInfo = async () => {
    const params = {
        subAcctType: '08',
        isBase: 0 // 你直接这么传就行
    }
    const res = await publicRequest({ key: 'FINANCE_CORE_CAPITAL_INFO', body: params })
    if (res.code === '200') {
        user.value = res.data
        console.log(user.value, 'value')
    }
    // const res = await getUserInfo(param)
    // if (res.code === '200') {
    //     user.value = res.data
    // }
}
getInfo()
const close = () => {
    isShow.value = false
    upMoney.value = null
}
const cardEdit = (id) => {
    router.push({ name: 'capital-card', params: { id: JSON.stringify(id) } })
}
const ondetail = (id) => {
    if (!id) return ElMessage.warning('没有子账单ID!')
    router.push({ name: 'capital-detail', params: { id } })
}
const onrecord = (id) => {
    if (!id) return ElMessage.warning('没有子账单ID!')
    router.push({ name: 'capital-record', params: { id } })
}
function getRandom () {
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    var num = ''
    for (var i = 0; i < 32; i++) {
        num += arr[parseInt(Math.random() * 36)]
    }
    return num
}
// const getrequestNo = getRandom()
const withdrawal = async (upMoney) => {
    console.log(upMoney)
    if (!upMoney || upMoney === '0') return ElMessage.warning('提现金额不能为空/0')
    if (!/^\d+(.\d{1,2})?$/.test(upMoney)) return ElMessage.warning('提现金额小数点不能超过两位')
    if ((user.value.subAvailableAmount / 100) < upMoney) return ElMessage.warning('提现金额超过当前余额')
    const params = {
        subAcctId: user.value.subAcctId,
        payType: 3,
        busiType: 3,
        requestNo: getRandom(),
        transAmount: upMoney * 100
    }
    const res = await publicRequest({ key: 'FINANCE_CORE_CAPITAL_CASHOUT', body: params })
    console.log(res, 'res')
    getInfo()
    if (res.code === '200') {
        ElMessage.success('操作成功')
    }
}
</script>
<style lang="scss" scoped>
.largeBox{
    :deep(.el-dialog__body){
        max-height: 600px;
        overflow-y: scroll;
    }
    .top{
        display:flex;
        flex-direction: row;
        width:80%;
        border-bottom:2px solid #ccc;
        .left{
            width:50%;
            height:220px;
            margin:20px;
            border-right:2px solid #ccc;
            h2{
                margin-left:24px;
                margin-top:10px;
            }
            h3{
                margin-left:30px;
                margin-top:10px;
            }
            p{
                margin-left:36px;
                margin-top:10px;
                .el-icon{
                    margin-left:5px;
                }
            }
            div{
                margin-left:30px;
                margin-top:10px;
            }
            .el-button{
                margin-left:30px;
                margin-top:10px;
            }
        }
        .right{
            width:50%;
            height:220px;
            margin:20px;
            ul li{
                height:30px;
                line-height:30px;
                list-style-type:none;
                .el-icon{
                    margin-left:5px;
                }
            }
        }
    }
    .main{
        width:100%;
        margin-top:20px;
        .detail{
            margin-left:20px;
        }
        .record{
            margin-left:20px;
        }
    }
    .bottom{
        width:100%;
        height:240px;
        margin-top:20px;
        border:1px dashed #ccc;
        display:flex;
        justify-content:space-between;
        align-items:center;
        .bottom-left, .bottom-right {
            width: 48%;
            ul, li {
                list-style: none;
            }
        }
        .input-box{
            .input{
                width:80%;
                height:26px;
                line-height:26px;
                border:1px solid #ccc;
                display: flex;
                justify-content:space-between;
                input{
                    width:80%;
                    border:none;
                    outline:none;
                    background:#fff;
                    padding-left:8px;
                }
                .warp-btn{
                    color:green;
                }
            }
        }
        .button{
            margin-left:25%;
        }
    }
}
</style>
