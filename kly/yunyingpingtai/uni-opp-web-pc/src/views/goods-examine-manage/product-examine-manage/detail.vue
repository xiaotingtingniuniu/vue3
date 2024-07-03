<template>
    <div class='product-examine-manage'>
        <el-card>
            <h4>详情</h4>
            <el-form label-position="right" label-width="auto">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="审批编号">
                            <el-input v-model="$route.params.approvalCode" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务线">
                            <el-input v-model="detailInfo.busiName" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="品牌名称">
                            <el-input v-model="detailInfo.brandName"  :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品名称">
                            <el-input v-model="detailInfo.spuName" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="69码">
                            <el-input v-model="detailInfo.barcode" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="产地">
                            <el-input v-model="detailInfo.origPlace" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保质期">
                            <el-input v-model="detailInfo.productShelfLife" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品规格">
                            <el-input v-model="detailInfo.productSpec" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="是否小规格">
                            <el-radio-group v-model="detailInfo.isSmallSpec" :disabled="disabled">
                                <el-radio :label="1" >是</el-radio>
                                <el-radio :label="0" >否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品净重">
                            <el-input v-model="detailInfo.netRatio" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="口味">
                            <el-input v-model="detailInfo.productTaste" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="补存信息">
                            <el-input v-model="detailInfo.addition" :disabled="disabled" controls-position="right" class="form-action-item-50w" type="textarea"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="detailInfo.pdfUrl">
                    <el-col :span="24">
                        <el-form-item label="外检报告">
                            <a :href="detailInfo.pdfUrl" target="_banck">{{detailInfo.pdfName}}</a>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div>
                    <div class="mt-20 mb-20">1、正对着商品拍摄一张（俯拍）【需1张图片】</div>
                    <div class="img-box">
                        <template v-if="detailInfo.overlook">
                            <!-- <img :src="detailInfo.overlook" alt=""> -->
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="detailInfo.overlook"
                                :zoom-rate="1.2"
                                :preview-src-list="[detailInfo.overlook]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </template>
                        <template v-else>暂无图片</template>
                    </div>
                    <div  class="mt-20 mb-20">2、将商品正面朝上放置： 分别从商品的四个角，以 45 度角向内分别拍摄一张照片，每次拍摄应尽量拍到商品的3个面【需4张图片】</div>
                    <div class="img-box">
                        <template v-if="detailInfo.frontage.length">
                            <!-- <img v-for="img in detailInfo.frontage" :key="img" :src="img" alt=""> -->
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
                        </template>
                        <template v-else>暂无图片</template>
                    </div>
                    <div  class="mt-20 mb-20">3、将商品反面朝上放置：从商品的四个角，以 45 度角向内分别拍摄一张照片，每次拍摄应尽量拍到商品 的 3 个面；【需4张图片】</div>
                    <div class="img-box">
                        <template v-if="detailInfo.opposite.length">
                            <!-- <img v-for="img in detailInfo.opposite" :key="img" :src="img" alt=""> -->
                            <el-image
                                v-for="img in detailInfo.opposite"
                                :key="img"
                                style="width: 100px; height: 100px"
                                :src="img"
                                :zoom-rate="1.2"
                                :preview-src-list="[img]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </template>
                        <template v-else>暂无图片</template>
                    </div>
                    <div  class="mt-20 mb-20">4、视频清晰度及格式要求 视频统一为 mp4 格式，清晰度需要达到 1080p，视频无卡顿，画面模糊等情况。</div>
                    <div class="img-box">
                        <template v-if="detailInfo.vedio">
                            <video :src="detailInfo.vedio"></video>
                        </template>
                        <template v-else>暂无视频</template>
                    </div>
                </div>
            </el-form>
        </el-card>
        <el-card style="margin-top: 40px;">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="right" label-width="auto">
                <div style="width: 400px;">
                    <h4>审批</h4>
                    <el-form-item label="审批结果" prop="state">
                        <el-radio-group v-model="ruleForm.state" :disabled="!($route.params?.examine === 'examine')">
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
                        <el-button v-if="$route.params?.examine === 'examine'" type="primary" @click="submitForm()" >
                            提交审批结果
                        </el-button>
                    </div>
                </div>
            </el-form>
        </el-card>

    </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CstUpload from '@/components/upload/upload.vue'
import { ElMessage } from 'element-plus'
import { publicRequest } from '@/api/common/index.js'

const route = useRoute()
const router = useRouter()
const disabled = ref(true)

const ruleForm = reactive({
    state: '', // 审批状态 3、审核通过 4、驳回
    approveAdvise: '' // 审批意见
})

const busiObj = {
    A1001004: '到家电商',
    A1001002: '货柜',
    A1001003: '本地生活',
    A1001005: '进货商城'
}

const detailInfo = ref({
    // 审批编号
    brandName: '', // 品牌名称
    busiName: '',
    spuName: '', // 商品名称
    barcode: '', // 69码
    origPlace: '', // 产地
    productShelfLife: '', // 保质期
    productSpec: '', // 商品规格
    isSmallSpec: '', // 是否小规格 1是 0 否
    netRatio: '', // 净含量
    productTaste: '', // 口味
    addition: '', // 补充信息
    overlook: '', // 俯拍图
    frontage: [], // 正面朝上
    opposite: [], // 反面朝上
    vedio: '', // 视频
    pdfUrl: '', // 外检报告
    pdfName: ''
})
const ruleFormRef = ref(null)

const getDetail = async () => {
    // const data = await getMerchantList(params)
    const params = { approvalCode: route.params.approvalCode }
    const res = await publicRequest({ key: 'PRODUCT_EXAMINE_MANAGE_DETAIL', body: params })
    if (res.code === '200') {
        console.log(res.data, 'res')
        // detailInfo.value = res.data
        Object.assign(detailInfo.value, res.data)
        ruleForm.approveAdvise = res.data.approveAdvise
        ruleForm.state = res.data.approveStatus
        detailInfo.value.productShelfLife = res.data.productShelfLife + res.data.productShelfLifeUnit
        detailInfo.value.netRatio = res.data.netRatio + res.data.netRatioUnit
        detailInfo.value.busiName = busiObj[res.data.busiCode]
        res.data.spuApprovalMedias.length && res.data.spuApprovalMedias.map(el => {
            // 俯拍
            if (el.mediaType === 1) {
                detailInfo.value.overlook = el.mediaUrl
            }
            // 正面朝上
            if (el.mediaType === 2) {
                detailInfo.value.frontage.push(el.mediaUrl)
            }
            // 反面朝上
            if (el.mediaType === 3) {
                detailInfo.value.opposite.push(el.mediaUrl)
            }
            // 视频
            if (el.mediaType === 4) {
                detailInfo.value.vedio = el.mediaUrl
            }
            if (el.mediaType === 7) {
                const pdfArr = el.mediaUrl.split('/')
                detailInfo.value.pdfUrl = el.mediaUrl
                detailInfo.value.pdfName = pdfArr[pdfArr.length - 1]
            }
        })
        console.log(detailInfo.value, 'detailInfo')
    }
}
getDetail()

// 表单项规则
const rules = reactive({
    state: [{ required: true, message: '请选择审批意见', trigger: 'change' }]
})
// 提交审核
const submitForm = async () => {
    console.log(ruleForm)
    if (!ruleFormRef.value) return
    ruleFormRef.value.validate(async (validate) => {
        if (!validate) return
        console.log(ruleForm.value, 'validate')
        const res = await publicRequest({ key: 'PRODUCT_EXAMINE_MANAGE_EXAMINE', body: { approvalCode: route.params.approvalCode, ...ruleForm } })
        if (res.code === '200') {
            ElMessage.success('审核成功')
            setTimeout(async () => {
                await goBack()
            }, 500)
        }
    })
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
    }
</style>
