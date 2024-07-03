<template>
    <div class="product-examine-manage">
        <el-form label-position="right" label-width="auto">
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="审批编号">
                        {{ detailInfo.approvalCode }}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="审核状态">
                        {{ customRenderStatus(detailInfo.approveStatus) }}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请时间">
                        {{ detailInfo.applyTime }}

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="审批时间">
                        {{ detailInfo.approveTime }}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="审批人">
                        {{ detailInfo.approver }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24"> </el-row>
        </el-form>
        <div class="apply-active-box">
            <el-form label-position="right">
                <h4 class="mt20 mb20">商品基础信息</h4>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="商品名称">
                            <el-input v-model="detailInfo.skuName" class="form-action-item-50w" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品原价">
                            <el-input v-model="detailInfo.channelPrice" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="商品分类">
                            <el-input v-model="busiCates" class="form-action-item-50w" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="适用店铺">
                            <el-input v-model="detailInfo.secondChannelName" class="form-action-item-50w" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品库存">
                            <el-input v-model="detailInfo.stock" class="form-action-item-50w" disabled/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-form label-position="right">
                <h4 class="mt20 mb20">购买须知</h4>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="使用有效期">
                            <el-date-picker
                                v-model="detailInfo.date"
                                value-format="YYYY-MM-DD"
                                format="YYYY-MM-DD"
                                type="daterange"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                disabled
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="使用要求">
                            <el-input v-model="detailInfo.requirement" disabled :rows="3" type="textarea" placeholder="请输入在1000字以内" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="退款须知">
                            <el-input v-model="detailInfo.refundTips" :rows="3" type="textarea" placeholder="请输入在1000字以内" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <h4 class="mt20 mb20">费用说明</h4>
            <el-row>
                <h5>费用说明（套餐内所包含的商品明细，包括：商品名称，单价、份数、金额，仅做APP展示，实际金额以商品所配置的活动价格为准）</h5>
                <el-form-item label="费用说明" prop="textarea">
                    <el-table :data="detailInfo.feeList" border show-summary :summary-method="getSummaries" style="width: 100%">
                        <el-table-column type="index" width="50" />
                        <el-table-column prop="productName" label="商品名称" width="180" >
                            <template  #default="scope">
                                <el-input v-model="scope.row.productName" disabled />
                            </template>
                        </el-table-column>
                        <el-table-column prop="price" label="原价-单价（¥）" >
                            <template  #default="scope">
                                <el-input v-model="scope.row.price" disabled />
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="份数" >
                            <template #default="scope">
                                <el-input v-model="scope.row.amount" disabled/>
                            </template>
                        </el-table-column>
                        <el-table-column prop="totalAmount" label="金额小计（¥）" >
                            <template #default="scope">
                                {{ Number(scope.row.amount * scope.row.price) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="opertion"  label="操作" width="200" >
                            <template  #default="scope">
                                <el-button type="primary" text disabled>添加商品</el-button>
                                <el-button type="primary" text @click="delate(scope.row,scope.index)" disabled>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-row>
            <h5>使用说明</h5>
            <el-form-item label="使用时间" prop="weekDuration">
                <div>
                    <el-checkbox-group v-model="checkList" disabled>
                        <el-checkbox label="2">周一</el-checkbox>
                        <el-checkbox label="3">周二</el-checkbox>
                        <el-checkbox label="4">周三</el-checkbox>
                        <el-checkbox label="5">周四</el-checkbox>
                        <el-checkbox label="6">周五</el-checkbox>
                        <el-checkbox label="7">周六</el-checkbox>
                        <el-checkbox label="1">周七</el-checkbox>
                    </el-checkbox-group>
                    <el-form>
                        <el-row :gutter="24">
                            <el-col :span="24">
                                <el-form-item label="可用时间段1">
                                    <el-input v-model="detailInfo.validDuration" disabled />
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <!-- <el-row :gutter="24">
                            <el-col :span="24">
                                <el-form-item label="可用时间段2">
                                    <el-input v-model="detailInfo.validDuration" disabled />
                                </el-form-item>
                            </el-col>
                        </el-row> -->
                    </el-form>
                    【注】使用时间和可用时间段仅做APP给用户查看商品详情使用，具体使用时间以当前商品所配置的活动时间为准。
                </div>

            </el-form-item>
            <el-form-item label="预约电话" prop="appointmentCall">
                <el-input v-model="detailInfo.appointmentCall" disabled  controls-position="right" class="form-action-item-50w"/>
            </el-form-item>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="预约规则">
                        <el-input v-model="detailInfo.appointmentTips" disabled :rows="3" type="textarea" placeholder="请输入在1000字以内" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="其他说明">
                        <el-input v-model="detailInfo.addtion" disabled :rows="3" type="textarea" placeholder="请输入在1000字以内" />
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div class="apply-active-box">
            <h4 class="mt20 mb20">商品图片信息</h4>
            <el-form-item label="商品通用图" >
                <div class="ty-style">
                    <cst-upload :limit="1" :multiple="true" v-model:fileList="detailInfo.StandardList" show="show" disabled></cst-upload>
                    <el-button type="primary" @click="compressionHandle(detailInfo.StandardList)" disabled>一键压缩</el-button>
                </div>
            </el-form-item>
            <el-form-item label="商品主图">
                <cst-upload :limit="1" :multiple="false" v-model:fileList="detailInfo.StandardList" disabled show="show" accept=".jpg,.png,.jpeg" :mediaType="2"  tip="主图，放在第一位置，1张，750*750"></cst-upload>
            </el-form-item>
            <el-form-item label="商品轮播图">
                <cst-upload :limit="1" :multiple="false"  v-model:fileList="detailInfo.lunbolist" disabled show="show" :mediaType="4" accept=".jpg,.png,.jpeg"  tip="放在购物车展示的缩略图，1张，jpg,小于50k，120*120"></cst-upload>
            </el-form-item>
            <el-form-item label="商品详情页图">
                <cst-upload :limit="1" :multiple="false" v-model:fileList="detailInfo.detailsList" disabled show="show" accept=".jpg,.png,.jpeg" :mediaType="7"  tip=""></cst-upload>
            </el-form-item>
            <el-card style="margin-top: 40px;">
                <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="auto">
                    <div>
                        <h4>审批</h4>
                        <el-form-item label="审批结果" prop="approveStatus">
                            <el-radio-group v-model="approveStatus" :disabled="$route.query?.type !== 'examine'">
                                <el-radio :label="3">通过</el-radio>
                                <el-radio :label="4">驳回</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="审批意见">
                            <el-input
                                v-model="approveAdvise"
                                placeholder="请输入审批意见"
                                show-word-limit
                                type="textarea"
                                maxlength="80"
                                :disabled="$route.query?.type !== 'examine'"
                            />
                        </el-form-item>
                        <div class="mt-20">
                            <el-button type="primary" @click="goBack()">
                                关闭
                            </el-button>
                            <el-button type="primary" @click="sendOK()" v-if="$route.query?.type === 'examine'">
                                提交审批结果
                            </el-button>
                        </div>
                    </div>
                </el-form>
            </el-card>
        </div>
        <el-dialog
            v-if="auditDialog"
            v-model="auditDialog"
            title="提示"
            width="30%"
            :before-close="handleClose"
        >
            <h3>请确认是否提交审批结果？</h3>
            <h3>若确认无误，请点击“确定”按钮完成审核。</h3>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">关闭</el-button>
                    <el-button type="primary" @click="onSubmit(3)">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CstUpload from '@/components/upload/upload.vue'
import { ElMessage } from 'element-plus'
import { tHead, dataState, ruleForm } from './userConfig.js'
import { publicRequest } from '@/api/common/index.js'

const { searchData, tableData, pageInfo, detailDate } = toRefs(dataState)

const detailInfo = ref({
    approvalCode: '', // 审批编号
    approveStatus: '', // 审核状态
    approveTime: '', // 申请时间
    applyTime: '', // 审批时间
    approver: '', // 审批人
    zhutuList: [],
    lunbolist: [],
    detailsList: [], // 详情图
    StandardList: [] // 标品通用图  11
})

const route = useRoute()
const router = useRouter()
const disabled = ref(true)
const busiCates = ref(null)
const date = ref([])

const checkList = ref([])

const approveStatus = ref(3) // 审核状态
const approveAdvise = ref('') // 审批意见
onMounted(() => {
    getDetail()
})
const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '总价'
            return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                    return prev + curr
                } else {
                    return prev
                }
            }, 0)
        } else if (column.property === 'totalAmount') {
            const list = data.map(item => Number(item.amount) * Number(item.price))
            sums[index] = list.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                    return prev + curr
                } else {
                    return prev
                }
            }, 0)
            sums[index] += ' 元'
        } else {
            sums[index] = ''
        }
    })

    return sums
}

const customRenderStatus = (status) => {
    switch (status) {
    case 2:
        return '待审核'
    case 3:
        return '审核通过'
    case 4:
        return '驳回'
    }
}

const getDetail = async () => {
    const res = await publicRequest({ key: 'LOCAL_LIFE_EXAMINE_MANNAGE_V5_DETAIL_v1', body: { approvalCode: route.query.id } })
    if (res.code === '200') {
        dataState.detailDate = res.data || {}
        detailInfo.value = {
            ...detailInfo.value,
            ...dataState.detailDate,
            date: [
                res.data.gmtStart,
                res.data.gmtEnd
            ]
        }
        const firstCateName = res.data.categoryList[0].busiFirstCateName ? res.data.categoryList[0].busiFirstCateName : ''
        const secondCateName = res.data.categoryList[0].busiSecondCateName ? '-' + res.data.categoryList[0].busiSecondCateName : ''
        const thirdCate = res.data.categoryList[0].busiThirdCateName ? '-' + res.data.categoryList[0].busiThirdCateName : ''
        res.data.categoryList = res.data.categoryList.map(el => `${el.busiFirstCateName}-${el.busiSecondCateName}`)

        // <template #categoryList="{row}">
        //             <template v-if="row.categoryList && row.categoryList.length">
        //                 {{row.categoryList.map(el => {
        //                     return `${el.busiFirstCateName}-${el.busiSecondCateName}`
        //                 }).join(',')}}
        //                 {{row.categoryList[0].busiFirstCateName}}
        //             </template>
        //         </template>

        busiCates.value = res.data.categoryList
        // busiCates.value = res.data.categoryList[0].busiFirstCateName + '-' + res.data.categoryList[0].busiSecondCateName + '-' + res.data.categoryList[0].busiThirdCateName
        const spuMediaList = res?.data?.mediasList
        spuMediaList.forEach(el => {
            // 2: 主图 、3: 轮播图、4：缩略图、5：瀑布图、6：列表图、7：详情图片、11：通用图
            if (el.mediaType === 2) {
                detailInfo.value.zhutuList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
            }
            if (el.mediaType === 3) {
                detailInfo.value.lunbolist.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
            }

            if (el.mediaType === 7) {
                detailInfo.value.detailsList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
            }

            if (el.mediaType === 11) { //  StandardList: 标品通用图  11
                detailInfo.value.StandardList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
            }
        })

        checkList.value = detailInfo.value.weekDuration.split(',')
        approveStatus.value = res?.data?.approveStatus
        approveAdvise.value = res?.data?.approveAdvise
    }
}

// 提交审核
// const sendOK = async () => {
//     if (approveStatus.value !== 3 || approveStatus.value !== 4) {
//         return ElMessage.error('请选择审批结果')
//     }
//     if (approveStatus.value === 4 && !approveAdvise.value) {
//         return ElMessage.error('审批结果为驳回时必须填审批意见')
//     }
//     auditDialog.value = true
// }
const sendOK = async () => {
    if (!(approveStatus.value === 3 || approveStatus.value === 4)) {
        return ElMessage.error('请选择审批结果')
    }
    if (approveStatus.value === 4 && !approveAdvise.value) {
        return ElMessage.error('审批结果为驳回时必须填审批意见')
    }
    auditDialog.value = true
}
const auditDialog = ref(false)

const handleClose = () => {
    auditDialog.value = false
}

const goBack = () => {
    router.go(-1)
}
// 审核
const selectionData = ref([])
const onSubmit = async (state) => {
    console.log(state, '0000')
    const approvalCodeList = [route.query.id + '']

    const params = {
        body: {
            approvalCodeList,
            approveStatus: approveStatus.value,
            approveAdvise: approveAdvise.value
        }
    }
    const res = await publicRequest({ key: 'LOCAL_LIFE_EXAMINE_MANNAGE_AUDIT', body: params.body })
    if (res.code === '200') {
        ElMessage.success('审核操作完成')
        auditDialog.value = false

        setTimeout(async () => {
            goBack(-1)
            getDetail()
        }, 500)
    }
}

</script>

<style lang="scss" scoped>
.mt20 {
    margin-top: 20px;
}
.mb20 {
    margin-bottom: 20px;
}
</style>
