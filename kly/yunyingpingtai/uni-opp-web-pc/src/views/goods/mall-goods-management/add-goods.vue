<template>
    <div class='apply-active-box'>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="auto">
            <h4 class='dividing-head'>GoodS基础信息</h4>
            <!-- <div>
                <el-form-item label="Goods编号" prop="goodsName" :rules="rules.name">
                    <el-input v-model="ruleForm.goodsId" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                </el-form-item>
            </div> -->
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="Goods名称" prop="goodsName" :rules="rules.name">
                        <el-input v-model="ruleForm.goodsName"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否创建影子">
                        <el-radio-group v-model="ruleForm.isShadow">
                            <el-radio :label="1" >是</el-radio>
                            <el-radio :label="0" >否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="品牌名称" prop="brandName">
                        <el-input v-model="detailInfo.brandName" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h4 class='dividing-head'>GoodS基础属性</h4>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="销售渠道" prop="saleChannel">
                        <el-input v-model="detailInfo.saleChannel" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品毛重（g）" prop="grossWeight">
                        <el-input v-model="detailInfo.grossWeight" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品净含量" prop="netRatio">
                        <el-input v-model="detailInfo.netRatio" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="商品颜色" prop="color">
                        <el-input v-model="detailInfo.color" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品净重" prop="netWeight">
                        <el-input v-model="detailInfo.netWeight" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="长（mm）" prop="productLength">
                        <el-input v-model="detailInfo.productLength" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="宽（mm）" prop="productWidth">
                        <el-input v-model="detailInfo.productWidth" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="高（mm）" prop="productHeight">
                        <el-input v-model="detailInfo.productHeight" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品规格" prop="productSpec">
                        <el-input v-model="detailInfo.productSpec" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="供应商类型" prop="supplierType">
                        <el-input v-model="supplierType[detailInfo.supplierType]" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                        <!-- <el-select v-model="detailInfo.supplierType" clearable placeholder="请选择" :disabled="true">
                            <el-option label="一件代发" value="1" />
                            <el-option label="入库" value="2" />
                            <el-option label="一件代发+入库" value="3" />
                        </el-select> -->
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发货方" prop="supplierName">
                        <el-input v-model="detailInfo.supplierName" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="包装单位" prop="packageUnit">
                        <el-input v-model="detailInfo.packageUnit" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="供应商全称" prop="supplierName">
                        <el-input v-model="detailInfo.supplierName" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="箱柜管理" prop="boxFormat">
                        <el-input v-model="detailInfo.boxFormat" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否批次管理" prop="isBatch">
                        <el-radio-group v-model="detailInfo.isBatch" :disabled="true">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0" >否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <h4 class='dividing-head'>GoodS销售属性</h4>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="国产/进口" prop="isImport">
                        <el-input v-model="detailInfo.isImport" :disabled="true" controls-position="right" class="form-action-item-50w" placeholder="中国"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产地" prop="origPlace">
                        <el-input v-model="detailInfo.origPlace" :disabled="true" controls-position="right" class="form-action-item-50w" placeholder="浙江杭州"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保质期" prop="productShelfLife">
                        <el-input v-model="detailInfo.productShelfLife" :disabled="true" controls-position="right" class="form-action-item-50w" placeholder="18个月"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="商品类型" prop="productType">
                        <el-input v-model="detailInfo.productType" :disabled="true" controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产品形态" prop="productForm">
                        <el-input v-model="detailInfo.productForm" :disabled="true" controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品条码" prop="barcode">
                        <el-input v-model="detailInfo.barcode" :disabled="true" controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="贮存条件" prop="storageCondition">
                        <el-input v-model="detailInfo.storageCondition" :disabled="true" controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="口味" prop='productTaste'>
                        <el-input v-model="detailInfo.productTaste" :disabled="true" controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="官方指导价" prop="guidePrice">
                        <el-input v-model="detailInfo.guidePrice" :disabled="true" controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h4>Goods图片管理</h4>
            <!-- 1:短视频、2: 主图 3: 轮播图、4：缩略图、5：瀑布图、6：列表图、7：详情图片 -->
            <el-form-item label="Goods短视频" >
                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.vidoList" accept=".mp4" :mediaType="1"  tip="主图放一个，次于主图后，MP4 小于10M "></cst-upload>
            </el-form-item>
            <el-form-item label="Goods主图" props="zhutuList">
                <cst-upload :limit="1" :multiple="false" v-model:fileList="ruleForm.zhutuList" accept=".jpg,.png,.jpeg" :mediaType="2"  tip="主图，放在第一位置，1张，750*750"></cst-upload>
            </el-form-item>
            <el-form-item label="Goods轮播图：" prop="name">
                <cst-upload :limit="8" :multiple="true"  v-model:fileList="ruleForm.lunbolist" accept=".jpg,.png,.jpeg" tip="次于主图位置。建议尺寸：750*750 像素，最多上传8张" :mediaType="3"></cst-upload>
            </el-form-item>
            <el-form-item label="Goods缩略图：" prop="name">
                <cst-upload :limit="1" :multiple="false"  v-model:fileList="ruleForm.suolueList" :mediaType="4" accept=".jpg,.png,.jpeg"  tip="放在购物车展示的缩略图，1张，jpg,小于50k，120*120"></cst-upload>
            </el-form-item>
            <el-form-item label="Goods瀑布图：" prop="name">
                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.pubuImageList" accept=".jpg,.png,.jpeg"   tip="放在APP首页，浏览使用，1张。jpg、png,小于100K,334p*334（必须是正方形）" :mediaType="5"></cst-upload>
            </el-form-item>
            <el-form-item label="Goods列表图：" prop="name">
                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.liebiaoImageList" accept=".jpg,.png,.jpeg,.mp4"   tip="应用类目展示图片。建议尺寸：140*140 像素，最多上传1张" :mediaType="6"></cst-upload>
            </el-form-item>
            <h4 class='dividing-head'>商品详情页图片</h4>
            <el-row :gutter="24">
                <el-form-item label="" prop="name">
                    <cst-upload :limit="20" :multiple="true" v-model:fileList="ruleForm.mediasList" accept=".jpg,.png,.jpeg,.mp4"   tip="支持上传20张图片，支持格式：png，jpg，gif文件大小：小于1M,图片尺寸：宽666px，高度自定义，不建议超过1000px" :mediaType="7"></cst-upload>
                </el-form-item>
            </el-row>
        </el-form>
        <div  style="width: 200px; margin: 0 auto">
            <el-button type="primary"  @click="submitForm()" >
                提交
            </el-button>
            <el-button type="primary" @click="goBack()">
                关闭
            </el-button>
        </div>

    </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CstUpload from '@/components/upload/upload.vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { getMerchantList } from '@/api/operate/index'

const route = useRoute()
const router = useRouter()
const props = defineProps(['merchantCode', 'goodsId'])
const noCan = ref(true)
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const ruleForm = reactive({
    goodsName: '', // 商品名称
    isShadow: 0, // 是否创建影子
    goodsId: '',
    vidoList: [],
    zhutuList: [],
    lunbolist: [],
    suolueList: [],
    pubuImageList: [],
    liebiaoImageList: [],
    mediasList: []
})

const detailInfo = ref({
    brandName: '', // 品牌名称
    saleChannel: '', // 销售渠道
    grossWeight: '', // 商品毛重
    netRatio: '', // 净含重
    color: '', // 商品颜色
    productLength: '', // 长
    productWidth: '', // "产品尺寸-宽",
    productHeight: '', // "产品尺寸-高",
    productSpec: '', // 商品规格
    netWeight: '', // 净重
    shipper: '', // 供应商类型
    supplierName: '', // 发货放
    packageUnit: '', // 包装单位
    boxFormat: '', // 供应商全称
    isBatch: 0, // 是否批次管理
    domesticImported: '', // 国产/进口
    commodityOrigin: '', // 产地
    shelfLife: '', // 保质期
    commodityType: '', // 商品类型
    productForm: '', // 产品形态
    barcode: '', // 商品条码 69码
    guidePrice: '', // 官方指导价
    storageCondition: '', // 储存条件
    productTaste: '', // 口味
    spuName: '' // 标品名称
})
const supplierType = {
    1: '一件代发',
    2: '入库',
    3: '一件代发+入库'
}
console.log(route.params)
const canNotEdit = computed(() => props.handleType === 'detail' || props.handleType === 'approval')

const ruleFormRef = ref(null)

const getDetail = async () => {
    const params = {
        body: {
            // appKey: 'A1001000',
            // busiCode: 'A1001001',
            // merchantCode: props.merchantCode,
            goodsId: props.goodsId
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: 'UC1657959893955WKBSi',
        name: 'Goods详情',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    detailInfo.value = data.data[0]
    ruleForm.goodsName = data.data[0].goodsName
    ruleForm.goodsId = data.data[0].goodsId
    detailInfo.value.isBatch = data.data[0].isBatch === 1 ? 1 : 0
    detailInfo.value.productShelfLife = data.data[0].productShelfLife + (data.data[0].productShelfLifeUnit || '')
    data.data[0].goodsMediaList.forEach(el => {
        console.log(el, 'el')
        // 1:短视频、2: 主图 3: 轮播图、4：缩略图、5：瀑布图、6：列表图、7：详情图片
        if (el.mediaType === 1) {
            ruleForm.vidoList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 2) {
            ruleForm.zhutuList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 3) {
            ruleForm.lunbolist.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 4) {
            ruleForm.suolueList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 5) {
            ruleForm.pubuImageList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 6) {
            ruleForm.liebiaoImageList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 7) {
            ruleForm.mediasList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
    })
    console.log(ruleForm.vidoList, ruleForm.vidoList[0]?.response.data, 'goodsMediaList')
}
getDetail()

// 表单项规则
const rules = reactive({
    inputRule: [{ required: true, message: '请输入', trigger: 'change' }],
    selectRule: [{ message: '请选择~', trigger: 'change' }],
    termType: [{ required: true, message: '请选择~', trigger: 'change' }],
    rewardContent: [{ required: true, message: '请选择～', trigger: 'change' }],
    couponBatchName: [{ required: true, message: '关联批次必填', trigger: 'blur' }],
    stairCount: [{ required: true }],
    name: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 50, message: '最长不超过50个字符长度', trigger: 'change' }
    ],
    textRule: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 20000, message: '最长不超过20000个字符长度', trigger: 'change' }
    ],
    textRulemax: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 2000, message: '最长不超过2000个字符长度', trigger: 'change' }
    ],
    zhutuList: [
        { type: 'array', required: true, message: 'Please select at least one activity type', trigger: 'change' }
    ]
})
// 提交表单
const submitForm = async () => {
    console.log(ruleForm, 'ruleForm')
    const goodsObj = {}
    ruleForm.mediasList.map((el, index) => {
        console.log(el, 'el')
        goodsObj['pic' + (index + 1)] = el.url
    })
    const params = {
        body: {
            goodsId: props.goodsId,
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001004', // 业务线编号
            goodsName: ruleForm.goodsName, // goods 名称
            // merchantId: detailInfo.value.merchantId || '111Mer11214', // 商户编号
            // merchantName: detailInfo.value.merchantName || '111Mer11214', // 商户名称
            spuId: detailInfo.value.spuId, // 标品ID
            spuName: detailInfo.value.spuName, // 标品名称
            spuType: detailInfo.value.spuType || '111Mer11214', // 模版类型
            shadow: ruleForm.isShadow, // 是否为影子 Goods
            goodsDetail: { goodsDetail: JSON.stringify([{ title: '商品介绍说明', index: 1, pics: goodsObj }]) }, // 商品详情
            medias: [
                { mediaName: '短视频', mediaType: 1, mediaUrl: ruleForm.vidoList[0]?.url || '', id: ruleForm.vidoList[0]?.id || '' },
                { mediaName: '主图', mediaType: 2, mediaUrl: ruleForm.zhutuList[0]?.url || '', id: ruleForm.zhutuList[0].id || '' },
                // { mediaName: '轮播图', mediaType: 3, mediaUrl: ruleForm.lunbolist[0]?.response.data || '', id: ruleForm.lunbolist[0].id || '' },
                ...ruleForm.lunbolist.map(el => {
                    return { mediaName: '轮播图', mediaType: 3, mediaUrl: el.url || '', id: el?.id || '' }
                }),
                { mediaName: '缩略图', mediaType: 4, mediaUrl: ruleForm.suolueList[0]?.url || '', id: ruleForm.suolueList[0].id || '' },
                { mediaName: '瀑布图', mediaType: 5, mediaUrl: ruleForm.pubuImageList[0]?.url || '', id: ruleForm.pubuImageList[0].id || '' },
                { mediaName: '列表图', mediaType: 6, mediaUrl: ruleForm.liebiaoImageList[0]?.url || '', id: ruleForm.liebiaoImageList[0].id || '' },
                ...ruleForm.mediasList.map(el => {
                    return { mediaName: '详情图', mediaType: 7, mediaUrl: el.url || '', id: el?.id || '' }
                })
            ],
            mediaSorting: 1 // 排序
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: 'UC1657692352371NOHdF',
        name: 'Goods修改接口',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name

    }
    console.log(params, 'params')
    const res = await getMerchantList(params)
    ElMessage.success('修改成功')
    setTimeout(async () => {
        await goBack()
    }, 500)

    // router.push({ name: 'goods-management-list' })
}

const goBack = () => {
    router.go(-1)
}
</script>
<style lang="scss" scoped>
    .apply-active-box{
        :deep(.el-dialog__body){
          max-height: 600px;
          overflow-y: scroll;
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
