<template>
    <div class='product-examine-manage' v-loading="loading">
        <el-card>
            <h4>Sku必填项</h4>
            <el-form label-position="right" label-width="auto">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="标品名称1：">{{detailData.spuName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Sku编号：">
                            {{detailData.skuId}}
                        </el-form-item>
                    </el-col>
                    <br/>
                    <el-col :span="8">
                        <el-form-item label="Sku名称：">
                            {{detailData.skuName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Sku原价：">
                            {{detailData.channelPrice}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="库存：">
                            {{detailData.stock}}
                        </el-form-item>
                    </el-col>
                    <br/>
                    <el-col :span="8">
                        <el-form-item label="商品分类：">
                            {{detailData.firstCateName}}{{detailData.secondCateName ? '-' + detailData.secondCateName : '' }}{{detailData.thirdCateName ? '-' + detailData.thirdCateName : '' }}{{detailData.fourthCateName ? '-' + detailData.fourthCateName : '' }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上架渠道：">
                            {{detailData.secondChannelName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <h4>商品基础信息</h4>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="品牌名称：">
                            {{detailData.brandName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="产品官方名称：">
                            {{detailData.productOfficialName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="产品型号：">
                            {{detailData.productModel}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="标品名称：">
                            {{detailData.spuName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="标品编码：">
                            {{detailData.spuId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品毛重：">
                            {{detailData.grossWeight}}g
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开门方式：">
                            {{detailData.doorStyle}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="识别方式：">
                            {{detailData.identMode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="门体数量：">
                            {{detailData?.doorNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="支持温度层：">
                            {{detailData?.tempLayer}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="温区：">
                            {{detailData.tempeZone}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品满载数：">
                            {{detailData.fullLoadQuantity}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="有无广告屏：">
                            {{detailData.isAdScreen}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="屏幕是否支持刷脸支付：">
                            {{detailData.isSuppFaceScan}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="屏幕是否支持操作：">
                            {{detailData.isTouchPanel}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售渠道：">
                            {{detailData.saleChannel}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="包装尺寸-长：">
                            {{detailData.packageLength}} mm
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="包装尺寸-宽：">
                            {{detailData.packageWidth}} mm
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="包装尺寸-高：">
                            {{detailData.packageHeight}} mm
                        </el-form-item>
                    </el-col>
                </el-row>
                <h4>商品图片信息</h4>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="商品通用图：">
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="image"
                                :zoom-rate="1.2"
                                :preview-src-list="[image]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="display: flex;justify-content: center;"><el-button type="primary" @click="goBack">关闭</el-button></el-row>
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
const channelTypes = {
    0: 'APP',
    1: '货柜',
    2: '门店',
    3: '供应链',
    4: 'B2B商城',
    5: '本地生活',
    6: '设备供应链'
}
const detailData = ref({
    spuName: '',
    skuName: '',
    spuId: '',
    channelPrice: 0,
    stock: 0,
    channelType: '',
    firstCateName: '',
    secondCateName: '',
    thirdCateName: '',
    fourthCateName: '',
    brandName: '',
    packageLength: '',
    packageHeight: '',
    packageWidth: '',
    grossWeight: '',
    productOfficialName: '',
    productModel: '',
    tempeZone: '',
    fullLoadQuantity: '',
    isTouchPanel: '',
    saleChannel: '',
    identMode: '',
    isAdScreen: '',
    isSuppFaceScan: '',
    secondChannelName: ''
})
const image = ref('')

const getDetail = async () => {
    console.log(route.params)
    const params = { skuId: route.params.skuId }
    loading.value = true
    const res = await publicRequest({ key: 'SUPPLY_CHAIN_GOODS_DETAIL', module: 'SUPPLY_CHAIN_GOODS', body: params })
    console.log(res, 'res --- detail')
    loading.value = false
    if (res.code === '200') {
        Object.assign(detailData.value, res.data)
        res.data.skuMediaList.length && res.data.skuMediaList.map(el => {
            // 正面朝上
            if (el.mediaType === 11) {
                image.value = el.mediaUrl
            }
        })
    }
}
getDetail()

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
