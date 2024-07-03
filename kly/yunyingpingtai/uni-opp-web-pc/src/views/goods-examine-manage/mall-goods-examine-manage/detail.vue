<template>
    <div class='product-examine-manage' v-loading="loading">
        <el-card>
            <h4>详情</h4>
            <el-form label-position="right" label-width="auto">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="审批编号：">
                            {{route.params.approvalCode}}
                            <!-- <el-input v-model="$route.params.approvalCode" :disabled="disabled" controls-position="right" class="form-action-item-50w"/> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审核状态">
                            <el-select v-model="detailInfo.approveStatus" :disabled="disabled" controls-position="right" class="form-action-item-50w">
                                <el-option label="未提交" :value="1" />
                                <el-option label="待审核" :value="2" />
                                <el-option label="审核通过" :value="3" />
                                <el-option label="驳回" :value="4" />
                                <el-option label="建模审核中" :value="5" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请时间">
                            <el-input v-model="detailInfo.applyTime" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审批时间">
                            <el-input v-model="detailInfo.approveTime" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审批人">
                            <el-input v-model="detailInfo.approver" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <h4>Sku信息</h4>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="商品编号">
                            <el-input v-model="detailInfo.skuDetail.skuId"  :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="Goods编码">
                            <el-input v-model="detailInfo.skuDetail.skuName" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="8">
                        <el-form-item label="生产日期">
                            <el-input v-model="detailInfo.skuDetail.productDate" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品名称">
                            <el-input v-model="detailInfo.skuDetail.skuName" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="品牌名称">
                            <el-input v-model="detailInfo.skuDetail.brandName" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="生产批次号">
                            <el-input v-model="detailInfo.skuDetail.skuBatchNo" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="运费">
                            <el-input v-model="detailInfo.skuDetail.freightFee" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="三方商品编号">
                            <el-input v-model="detailInfo.skuDetail.outerSkuId" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="售卖单位">
                            <el-select v-model="detailInfo.skuDetail.sellingUnit" :disabled="disabled" controls-position="right" class="form-action-item-50w">
                                <el-option label="件" :value="0"/>
                                <el-option label="箱" :value="1"/>
                                <el-option label="碗" :value="2"/>
                                <el-option label="桶" :value="3"/>
                                <el-option label="瓶" :value="4"/>
                                <el-option label="盒" :value="5"/>
                                <el-option label="罐" :value="6"/>
                                <el-option label="根" :value="7"/>
                                <el-option label="个" :value="8"/>
                                <el-option label="袋" :value="9"/>
                                <el-option label="杯" :value="10"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="标品换算单位">
                            <el-input v-model="detailInfo.skuDetail.spuTransUnit" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="基础类目">
                            <el-input v-model="detailInfo.skuDetail.cateName" :disabled="disabled" controls-position="right" type="textarea" autosize class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应用类目">
                            <el-input v-model="busiCatesList" autosize :disabled="disabled" controls-position="right" class="form-action-item-50w" type="textarea"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <h4>SKU基本信息</h4>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="商品条码">
                            <el-input v-model="detailInfo.skuDetail.barcode" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品规格">
                            <el-input v-model="detailInfo.skuDetail.productSpec" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="品牌名称">
                            <el-input v-model="detailInfo.skuDetail.brandName" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="包装方式">
                            <el-input v-model="detailInfo.skuDetail.packageStyle" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品毛重（g）">
                            <el-input v-model="detailInfo.skuDetail.grossWeight" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保质期">
                            <el-input v-model="detailInfo.skuDetail.productShelfLife" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="口味">
                            <el-input v-model="detailInfo.skuDetail.productTaste" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="产地">
                            <el-input v-model="detailInfo.skuDetail.origPlace" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="存储条件">
                            <el-input v-model="detailInfo.skuDetail.storageCondition" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="官方指导价">
                            <el-input v-model="detailInfo.skuDetail.guidePrice" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <h4>Sku图片</h4>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="主图">
                            <!-- <img v-for="img in detailInfo.backscript" :key="img" :src="img" class="detail-img"> -->
                            <el-image
                                v-for="img in detailInfo.frontage"
                                :key="img"
                                style="width: 100px; height: 100px"
                                :src="img"
                                :zoom-rate="1.2"
                                :preview-src-list="[img]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="轮播图">
                            <!-- <img v-for="img in detailInfo.barcodeImgs" :key="img" :src="img" class="detail-img"> -->
                            <el-image
                                v-for="img in detailInfo.sweperList"
                                :key="img"
                                style="width: 100px; height: 100px"
                                :src="img"
                                :zoom-rate="1.2"
                                :preview-src-list="[img]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="缩略图">
                            <el-image
                                v-for="img in detailInfo.abbreviation"
                                :key="img"
                                style="width: 100px; height: 100px"
                                :src="img"
                                :zoom-rate="1.2"
                                :preview-src-list="[img]"
                                :initial-index="4"
                                fit="cover"
                            />
                        <!-- <img v-for="img in detailInfo.modelImgs" :key="img" :src="img" class="detail-img"> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="瀑布图">
                            <el-image
                                v-for="img in detailInfo.barcodeImgs"
                                :key="img"
                                style="width: 100px; height: 100px"
                                :src="img"
                                :zoom-rate="1.2"
                                :preview-src-list="[img]"
                                :initial-index="4"
                                fit="cover"
                            />
                        <!-- <img v-for="img in detailInfo.modelImgs" :key="img" :src="img" class="detail-img"> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="列表图">
                            <el-image
                                v-for="img in detailInfo.goodsList"
                                :key="img"
                                style="width: 100px; height: 100px"
                                :src="img"
                                :zoom-rate="1.2"
                                :preview-src-list="[img]"
                                :initial-index="4"
                                fit="cover"
                            />
                        <!-- <img v-for="img in detailInfo.modelImgs" :key="img" :src="img" class="detail-img"> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="商品详情页图片">
                            <el-image
                                v-for="img in detailInfo.goodsDetailList"
                                :key="img"
                                style="width: 100px; height: 100px"
                                :src="img"
                                :zoom-rate="1.2"
                                :preview-src-list="[img]"
                                :initial-index="4"
                                fit="cover"
                            />
                        <!-- <img v-for="img in detailInfo.modelImgs" :key="img" :src="img" class="detail-img"> -->
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card style="margin-top: 40px;">
            <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="auto">
                <div>
                    <h4>审批处理</h4>
                    <el-form-item label="审批结果" prop="approveStatus">
                        <el-radio-group v-model="ruleForm.approveStatus" :disabled="!($route.params?.examine === 'examine')">
                            <el-radio :label="3" >通过</el-radio>
                            <el-radio :label="4" >驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="审批意见">
                        <el-input
                            v-model="ruleForm.approveAdvise"
                            :disabled="!($route.params?.examine === 'examine')"
                            placeholder="请输入审批意见"
                            show-word-limit
                            type="textarea"
                            maxlength="80"
                        />
                    </el-form-item>
                    <div class="mt-20">
                        <el-button type="primary" @click="goBack()">
                            关闭
                        </el-button>
                        <el-button v-if="$route.params?.examine === 'examine'" type="primary" @click="productCheckDialogShow()" >
                            提交审批
                        </el-button>
                    </div>
                </div>
            </el-form>
        </el-card>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import CstUpload from '@/components/upload/upload.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { publicRequest } from '@/api/common/index.js'
import { queryCategory } from '@/utils'
import { getMerchantList } from '@/api/operate/index'
import { Flag } from '@element-plus/icons'

const route = useRoute()
const router = useRouter()
const disabled = ref(true)
const ruleFormRef = ref(null)
const loading = ref(false)
const ruleForm = reactive({
    approveStatus: 3, // 审批状态 3、审核通过 4、驳回
    approveAdvise: null // 审批意见
})

const detailInfo = ref({
    // 审批编号
    approveStatus: '', // 审核状态
    applyTime: '', // 申请时间
    approveTime: '', // 审批时间
    approver: '', // 审批人
    brandName: '', // 品牌名称
    spuName: '', // 商品名称
    barcode: '', // 69码
    productShelfLife: '', // 保质期
    productSpec: '', // 商品规格
    isSmallSpec: '', // 是否小规格 1是 0 否
    netRatio: '', // 净含量
    addition: '', // 补充信息
    overlook: '', // 俯拍图
    frontage: [], // 正面朝上
    opposite: [], // 反面朝上
    backscript: [], // 背标图
    barcodeImgs: [], // 条形码
    sweperList: [], // 轮播图
    abbreviation: [], // 缩略图
    modelImgs: [], // 训练模型图
    goodsList: [], // 列表图
    goodsDetailList: [],
    skuDetail: {
        cateName: '', // 基础类目
        barcode: '', // 商品编号
        skuName: '', // 商品名称
        productDate: '', // 生产日期
        brandName: '', // 品牌编码
        freightFee: '', // 运费
        outerSkuId: '', // 三方商品编号
        sellingUnit: '', // 售卖单位
        spuTransUnit: '', // 标品换算单位
        limitedRegionList: '', // 不可配送范围
        productSpec: '', // 商品规格
        skuBatchNo: '', // 生产批次号
        packageStyle: '', // 包装方式
        grossWeight: '', // 商品毛重
        busiCates: '', // 应用类目
        productShelfLife: '', // 保质期
        productTaste: '', // 口味
        origPlace: '', // 产地
        storageCondition: '', // 存储方式
        guidePrice: '' // 官方指导价
    },
    vedio: '' // 视频
})
const busiCatesList = ref([])

const getDetail = async () => {
    console.log(route.params.examine)
    const params = { approvalCode: route.params.approvalCode }
    loading.value = true
    const res = await publicRequest({ key: 'MALL_GOODS_EXAMINE_MANAGE_EXAMINE_DETAIL', module: 'SPU', body: params })
    loading.value = false
    if (res.code === '200') {
        Object.assign(detailInfo.value, res.data)
        ruleForm.approveStatus = route.params.examine === 'examine' ? 3 : res.data.approveStatus
        ruleForm.approveAdvise = route.params.examine === 'examine' ? '' : res.data.approveAdvise
        detailInfo.value.skuDetail.productShelfLife = res.data.skuDetail.productShelfLife + (res.data.skuDetail.productShelfLifeUnit || '')
        // ${el.busiFirstCateName}-${el.busiSecondCateName}-${el.busiThirdCateName}
        busiCatesList.value = (Array.isArray(res.data.skuDetail?.busiCateList) && res.data.skuDetail.busiCateList.length) ? res.data.skuDetail.busiCateList.map(el => `${el.bfirstCateName}-${el.bsecondCateName}-${el.bthirdCateName}`) : []
        busiCatesList.value.join('')
        detailInfo.value.skuDetail.cateName = res.data.skuDetail.firstCateName + (res.data.skuDetail.secondCateName ? `-${res.data.skuDetail.secondCateName}` : '') + (res.data.skuDetail.thirdCateName ? `-${res.data.skuDetail.thirdCateName}` : '') + (res.data.skuDetail.fourthCateName ? `-${res.data.skuDetail.fourthCateName}` : '')
        console.log(busiCatesList.value, '111')
        res.data.skuDetail.goodsMediaList.length && res.data.skuDetail.goodsMediaList.map(el => {
            // 正面朝上
            if (el.mediaType === 2) {
                detailInfo.value.frontage.push(el.mediaUrl)
            }
            // 反面朝上
            if (el.mediaType === 3) {
                detailInfo.value.sweperList.push(el.mediaUrl)
            }
            // 条形码
            if (el.mediaType === 5) {
                detailInfo.value.barcodeImgs.push(el.mediaUrl)
            }
            // 背标图
            if (el.mediaType === 6) {
                detailInfo.value.goodsList.push(el.mediaUrl)
            }
            // 视频
            if (el.mediaType === 4) {
                // detailInfo.value.vedio = el.mediaUrl
                detailInfo.value.abbreviation.push(el.mediaUrl)
            }
            if (el.mediaType === 7) {
                detailInfo.value.goodsDetailList.push(el.mediaUrl)
            }
        })
        console.log(detailInfo.value)
        setTimeout(() => {
            ruleFormRef.value.clearValidate()
            loading.value = false
        }, 60)
    }
}
getDetail()

// 提交审批，审批结果为通过且可创建新标品时，show标品核查弹窗，否则直接提交
const productCheckDialogShow = () => {
    if (ruleForm.approveStatus === 4 && !ruleForm.approveAdvise) {
        return ElMessage.error('请输入审批意见！')
    }
    console.log(111, ruleForm.approveStatus)
    ElMessageBox.confirm('若确认无误，请点击“确定”按钮完成审核。', '请确认是否提交审批结果？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '关闭'
        }
    ).then(async () => {
        const param = {
            approvalCodeList: [detailInfo.value.approvalCode],
            approveStatus: ruleForm.approveStatus,
            approveAdvise: ruleForm.approveAdvise
        }
        const res = await publicRequest({ module: 'SPU', key: 'MALL_GOODS_EXAMINE_MANAGE_LIST_EXAMINE', body: param })
        if (res.code === '200') {
            ElMessage.success('操作成功！')
            goBack()
        } else {
            ElMessage.error(res.message)
        }
    }).catch(() => {})
}

const goBack = () => {
    router.go(-1)
}
</script>
<style lang="scss" scoped>
    .mt-20 {
        margin-top: 20px;
    }
    .mb-20 {
        margin-bottom: 20px;
    }
    .product-examine-manage{
        padding: 20px 40px;
        :deep(.el-dialog__body){
          max-height: 600px;
          overflow-y: scroll;
        }
        .img-box {
            img {
                width: 148px;
                height: 148px;
            }
        }
        .form-action-item-50w{
            width: 50%;
        }
        .form-action-item-100w{
            width: 100%;
        }
        .dividing-head{
            margin-left:50px;
            line-height:50px;
        }
        span{
            font-size:14px;
            height: 32px;
            line-height: 32px;
            color: #606266;
            font-size: 14px;
        }
        .border-box{
            border:1px solid #ccc;
            padding:20px;
            margin-bottom:10px;
        }
        .goods-list{
          padding: 20px;
          margin-left: 150px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
        }
        .form-text-btn{
          display: inline-block;
          margin-left: 5px;
          color: #fe2c55;
          cursor: pointer;
        }
        .flex-box{
            display:flex;
            justify-content:center
            div{
                flex:1
            }
        }
        .detail-img{
            width: 100px;
            margin-left: 10px;
            margin-bottom: 10px;
        }
    }
</style>
