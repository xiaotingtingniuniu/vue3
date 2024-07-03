<template>
    <div class="approval-detail mine-content">
        <van-nav-bar title="审批单详情" fixed placeholder left-arrow @click-left="goBack" />

        <!-- 申请详情 -->
        <div class="equipmentBox">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    审批单单号：{{ extField ? extField?.applicationId : route?.query?.index?route?.query?.index:''}}
                </div>
            </div>
            <div class="transverse"></div>
            <div class="outside">
                <div class="withinLeft">审批单类型</div>
                <div class="withinRight">{{approvalLists.applyType===1?'申请绑定':approvalLists.applyType===2?'解绑申请':'error'}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">审批状态</div>
                <div class="withinRight">{{approvalLists.approvalState===0?'待处理':approvalLists.approvalState===1?'已通过 ':approvalLists.approvalState===2?'已拒绝':''}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">申请时间</div>
                <div class="withinRight">{{approvalLists.approvalTime}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">设备编号</div>
                <div class="withinRight">{{approvalLists.deviceCode}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">设备名称</div>
                <div class="withinRight">{{approvalLists.deviceName}}</div>
            </div>

            <div class="outside">
                <div class="withinLeft">设备型号</div>
                <div class="withinRight">{{approvalLists.modelName}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">合同编码</div>
                <div class="withinRight">{{approvalLists.contractCode}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">合同货柜编号</div>
                <div class="withinRight">{{approvalLists.pointCode}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">点位名称</div>
                <div class="withinRight">{{approvalLists.locationName}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">点位场景</div>
                <div class="withinRight">{{approvalLists.firstScenesName}}{{approvalLists.secondScenesName}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">点位地址</div>
                <div class="withinRight withinRightAdress">{{approvalLists.provinceName}}{{approvalLists.cityName}}{{approvalLists.districtName}} {{approvalLists.address}} {{approvalLists.placement}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">审批时间</div>
                <div class="withinRight">{{approvalLists.approvalTime}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">审批备注</div>
                <div class="withinRight">{{approvalLists.remark}}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApproveDetail } from '@/api/device'
import { msgIdGetDetailId } from '@/api/order'
import { closePage } from '@/utils/composables'

const route = useRoute()
const router = useRouter()

const approvalLists = ref('')
const msgId = route.query.msgId
const extField = ref(null)
onMounted(() => {
    // getListData()
})
const getopenDoorDetail = async () => {
    console.log(extField.value.applicationId, 'getopenDoorDetail-extField-')
    const param = {
        applicationId: extField.value ? extField.value.applicationId : '',
        busiCode: 'A1001022',
        appKey: 'A1001001'
    }

    console.log(extField.value.applicationId, '000')
    console.log(param, 'param===')

    await getListData(param)

    // if (res.code === '200') {
    //     list.value = res.data || []
    // }

    // init(param, paramsObj)
}

const getListData = async (params) => {
    console.log('--getListData-', params)
    const res = await getApproveDetail(params)
    if (res.code === '200') {
        const { data } = res
        approvalLists.value = data
    }
}
const queryDetailId = async () => {
    const param = {
        msgId: msgId,
        busiCode: 'A1001002'
    }
    const res = await msgIdGetDetailId(param)
    console.log(res)
    if (res.code === '200') {
        extField.value = JSON.parse(res.data.extField)
        getopenDoorDetail()
    }
}
if (msgId) {
    console.log('消息中台跳转')
    queryDetailId()
} else {
    getListData({
        applicationId: route?.query?.index ?? ''
    })
}
const goBack = () => {
    if (msgId) {
        closePage()
    } else {
        router.go(-1)
    }

    // router.replace({
    //     path: '/device/device-list'
    // })
}

</script>
<style lang="scss" scoped>
.mine-content {
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #fe7e41;
    --van-nav-bar-title-font-size: 34px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    .van-nav-bar__placeholder {
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
        .van-hairline--bottom:after {
            border-bottom-width: 0;
        }
    }
}
    .informationTitle {
        padding: 20px 30px 20px 30px;
        box-sizing: border-box;
        border-bottom: 1px solid #F4F5F5;
    }
    .approval-detail{

        .equipmentBox{
            width: 690px;
            // height: 428px;
            background: #fff;
            margin-top: 20px;
            margin-left: 30px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            .outside{
                display: flex;
                justify-content: space-between;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                margin-top: 20px;
                .withinLeft{
                    color: #999999;
                    margin-left: 30px;
                }
                .withinRight{
                    max-width: 320px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: #191919;
                    margin-right: 30px;
                    text-align: right;
                }
                .withinRightAdress {
                    white-space: normal;
                    text-overflow: clip;
                    word-break: break-all;
                    word-wrap: break-word;
               }
            }
            .outside:nth-child(5) {
                margin-bottom: 35px;
            }
            .outside:nth-child(8) {
                margin-bottom: 35px;
            }
            .outside:nth-child(10) {
                margin-bottom: 35px;
            }
            .outside:nth-child(13) {
                margin-bottom: 65px;
            }
        }

    }

</style>
