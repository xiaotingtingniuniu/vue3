<template>
    <div class='apply-active-box'>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="auto">
            <h4 class='dividing-head'>GoodS基础信息</h4>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="Goods编号" prop="goodsId">
                        <el-input v-model="detailInfo.goodsId"  :disabled="true" controls-position="right" class="form-action-item-50w" label-width='200px'/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="Goods名称" prop="goodsName">
                        <el-input v-model="detailInfo.goodsName"  :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="route.params.type === 'detail'">
                    <el-form-item label="标品类目" prop="brandName">
                        <el-input v-model="detailInfo.brandName" controls-position="right" class="form-action-item-50w" :disabled="route.params.type === 'detail' ? true : false"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h4 class='dividing-head'>GoodS基础属性</h4>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="商品条码" prop="barcode">
                        <el-input v-model="detailInfo.barcode" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品规格" prop="productSpec">
                        <el-input v-model="detailInfo.productSpec" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="品牌名称" prop="brandName">
                        <el-input v-model="detailInfo.brandName" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="包装单位" prop="packageUnit">
                        <el-input v-model="detailInfo.packageUnit" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品毛重（g）" prop="grossWeight">
                        <el-input v-model="detailInfo.grossWeight" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保质期" prop="productShelfLife">
                        <el-input v-model="detailInfo.productShelfLife" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="长（mm）" prop="productLength">
                        <el-input v-model="detailInfo.productLength" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="宽（mm）" prop="productWidth">
                        <el-input v-model="detailInfo.productWidth" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="高（mm）" prop="productHeight">
                        <el-input v-model="detailInfo.productHeight" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="口味" prop="productTaste">
                        <el-input v-model="detailInfo.productTaste" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产地" prop="origPlace">
                        <el-input v-model="detailInfo.origPlace" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="储存条件" prop="storageConditions">
                        <el-input v-model="detailInfo.storageConditions" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="官方指导价" prop="guidePrice">
                        <el-input v-model="detailInfo.guidePrice" :disabled="route.params.type === 'detail' ? true : false" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h4>Goods图片管理</h4>
            <!-- 1:短视频、2: 主图 3: 轮播图、4：缩略图、5：瀑布图、6：列表图、7：详情图片 -->
            <el-form-item label="Goods短视频" >
                <cst-upload
                    :limit="1"
                    :disabled="route.params.type === 'detail' ? true : false"
                    :multiple="true" v-model:fileList="ruleForm.vidoList"
                    accept=".mp4"
                    :mediaType="1"
                    tip='主图放一个，次于主图后，MP4 小于10M'
                ></cst-upload>
            </el-form-item>
            <el-form-item label="Goods主图" props="zhutuList">
                <cst-upload :limit="1" :disabled="route.params.type === 'detail' ? true : false" :multiple="false" v-model:fileList="ruleForm.zhutuList" accept=".jpg,.png,.jpeg" :mediaType="2" tip='主图，放在第一位置，1张，750*750    png、jpg、gif   png、jpg小于500k   gif小于1M'></cst-upload>
            </el-form-item>
            <el-form-item label="Goods轮播图：" prop="name">
                <cst-upload :limit="8" :disabled="route.params.type === 'detail' ? true : false" :multiple="true"  v-model:fileList="ruleForm.lunbolist" accept=".jpg,.png,.jpeg" tip="次于主图位置，最多8张，750*750    png、jpg、gif   png、jpg小于500k   gif小于1M" :mediaType="3"></cst-upload>
            </el-form-item>
            <el-form-item label="Goods缩略图：" prop="name">
                <cst-upload :limit="1" :disabled="route.params.type === 'detail' ? true : false" :multiple="false"  v-model:fileList="ruleForm.suolueList" :mediaType="4" accept=".jpg,.png,.jpeg" ></cst-upload>
            </el-form-item>
            <el-form-item label="Goods瀑布图：" prop="name">
                <cst-upload :limit="1" :disabled="route.params.type === 'detail' ? true : false" :multiple="true" v-model:fileList="ruleForm.pubuImageList" accept=".jpg,.png,.jpeg" tip="首页。建议尺寸：334*334 像素，最多上传1张" :mediaType="5"></cst-upload>
            </el-form-item>
            <el-form-item label="Goods列表图：" prop="name">
                <cst-upload :limit="1" :disabled="route.params.type === 'detail' ? true : false" :multiple="true" v-model:fileList="ruleForm.liebiaoImageList" accept=".jpg,.png,.jpeg,.mp4" tip="应用类目展示图片。建议尺寸：140*140 像素，最多上传1张" :mediaType="6"></cst-upload>
            </el-form-item>
            <h4 class='dividing-head'>商品详情页图片</h4>
            <el-row :gutter="24">
                <el-form-item label="" prop="name">
                    <cst-upload :limit="4" :disabled="route.params.type === 'detail' ? true : false" :multiple="true" v-model:fileList="ruleForm.mediasList" accept=".jpg,.png,.jpeg,.mp4" tip="应用类目展示图片。建议尺寸：140*140 像素，最多上传1张" :mediaType="7"></cst-upload>
                </el-form-item>
            </el-row>
        </el-form>
        <el-button type="primary"  @click="submitForm()" v-if="route.params.type !== 'detail'">
            提交
        </el-button>
        <el-button type="primary" @click="goBack()">
            关闭
        </el-button>
    </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CstUpload from '@/components/upload/upload.vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { getMerchantList } from '@/api/operate/index'

const route = useRoute()
const router = useRouter()
const props = defineProps(['merchantCode', 'goodsId'])
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const ruleForm = reactive({
    vidoList: [],
    zhutuList: [],
    lunbolist: [],
    suolueList: [],
    pubuImageList: [],
    liebiaoImageList: [],
    mediasList: []
})

const detailInfo = ref({
    goodsId: '',
    goodsName: '', // 商品名称
    brandName: '', // 品牌名称
    salesChannel: '', // 销售渠道
    grossWeight: '', // 商品毛重
    netContent: '', // 净含重
    color: '', // 商品颜色
    productLength: '', // 长
    productWidth: '', // "产品尺寸-宽",
    productHeight: '', // "产品尺寸-高",
    productSpec: '', // 商品规格
    netWeight: '', // 净重
    supplierType: '', // 供应商类型
    shipper: '', // 发货放
    packageUnit: '', // 包装单位
    supplierFullName: '', // 供应商全称
    isBatchManagement: '', // 是否批次管理
    domesticImported: '', // 国产/进口
    origPlace: '', // 产地
    productShelfLife: '', // 保质期
    commodityType: '', // 商品类型
    productForm: '', // 产品形态
    barcode: '', // 商品条码 69码
    guidePrice: '', // 官方指导价
    storageConditions: '', // 储存条件
    productTaste: '', // 口味
    spuName: '' // 标品名称
})
console.log(route.params)
const canNotEdit = computed(() => props.handleType === 'detail' || props.handleType === 'approval')

const ruleFormRef = ref(null)

onMounted(() => {
    console.log(route.params)
})
const getDetail = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001005',
            goodsId: props.goodsId
        },
        appKey: 'A1001000',
        busiCode: 'A1001005',
        // configCode: 'UC1657959893955WKBSi',
        configCode: 'UC15115376415186944',
        name: 'goods详情页查询V2',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    detailInfo.value = data
    data.goodsMediaList.forEach(el => {
        console.log(el, 'el')
        // 1:短视频、2: 主图 3: 轮播图、4：缩略图、5：瀑布图、6：列表图、7：详情图片
        if (el.mediaType === 1) {
            ruleForm.vidoList.push({ url: el.mediaUrl, response: { data: el.mediaUrl } })
        }
        if (el.mediaType === 2) {
            ruleForm.zhutuList.push({ url: el.mediaUrl, response: { data: el.mediaUrl } })
        }
        if (el.mediaType === 3) {
            ruleForm.lunbolist.push({ url: el.mediaUrl, response: { data: el.mediaUrl } })
        }
        if (el.mediaType === 4) {
            ruleForm.suolueList.push({ url: el.mediaUrl, response: { data: el.mediaUrl } })
        }
        if (el.mediaType === 5) {
            ruleForm.pubuImageList.push({ url: el.mediaUrl, response: { data: el.mediaUrl } })
        }
        if (el.mediaType === 6) {
            ruleForm.liebiaoImageList.push({ url: el.mediaUrl, response: { data: el.mediaUrl } })
        }
        if (el.mediaType === 7) {
            ruleForm.mediasList.push({ url: el.mediaUrl, response: { data: el.mediaUrl } })
        }
    })
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
        { max: 20, message: '最长不超过20个字符长度', trigger: 'change' }
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
        goodsObj['pic' + (index + 1)] = el.response.data
    })
    const params = {
        body: {
            goodsId: props.goodsId,
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001005', // 业务线编号
            isSkuModify: 0,
            shadow: 0,
            goodsName: ruleForm.goodsName, // goods 名称
            merchantId: detailInfo.value.merchantId, // 商户编号
            merchantName: detailInfo.value.merchantName, // 商户名称
            spuId: detailInfo.value.spuId, // 标品ID
            spuName: detailInfo.value.spuName, // 标品名称
            goodsDetail: { goodsDetail: JSON.stringify([{ title: '商品介绍说明', index: 1, pics: goodsObj }]) }, // 商品详情
            medias: [
                { mediaName: '短视频', mediaType: 1, mediaUrl: ruleForm.vidoList[0]?.response.data || '' },
                { mediaName: '主图', mediaType: 2, mediaUrl: ruleForm.zhutuList[0]?.response.data || '' },
                { mediaName: '轮播图', mediaType: 3, mediaUrl: ruleForm.lunbolist[0]?.response.data || '' },
                { mediaName: '缩略图', mediaType: 4, mediaUrl: ruleForm.suolueList[0]?.response.data || '' },
                { mediaName: '瀑布图', mediaType: 5, mediaUrl: ruleForm.pubuImageList[0]?.response.data || '' },
                { mediaName: '列表图', mediaType: 6, mediaUrl: ruleForm.liebiaoImageList[0]?.response.data || '' }
            ],
            mediaSorting: 1 // 排序
        },
        appKey: 'A1001000',
        busiCode: 'A1001005',
        configCode: 'UC1657692352371NOHdF',
        // configCode: 'UC16222842373271552',
        name: 'Goods修改接口',
        // name: 'Goods更新V2',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name

    }
    const res = await getMerchantList(params)
    ElMessage.success('修改成功')
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
