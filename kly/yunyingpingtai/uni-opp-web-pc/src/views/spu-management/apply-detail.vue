<template>
    <div class='apply-active-box'>
        <pdf></pdf>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="auto">
            <!-- <div>
                <el-form-item label="Goods编号" prop="goodsName" :rules="rules.name">
                    <el-input v-model="ruleForm.goodsId" :disabled="true" controls-position="right" class="form-action-item-50w"/>
                </el-form-item>
            </div> -->
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="品牌名称" prop="brandName">
                        {{ruleForm.brandName}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="标品名称" prop="goodsName">
                        {{ruleForm.goodsName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <h3>商品条形码</h3>
            <el-form-item label="商品条形码图" >
                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.barCodeList" accept=".jpg,.png" :mediaType="8"  tip="格式：png，jpg，大小：小于2M，仅限一张"></cst-upload>
            </el-form-item>
            <!-- 这是6期新增开始 -->
            <el-form-item label="商品背标图" >

                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.backplotList" accept='image/*' :mediaType="12"  tip="仅限一张"></cst-upload>
            </el-form-item>
            <h3>标品通用图</h3>
            <el-form-item label="商品通用图" >
                <div class="ty-style">
                    <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.StandardList" accept=".png" :mediaType="11"  tip="1080*1080，格式：png，大小：小于2M，仅限一张 "></cst-upload>
                    <el-button type="primary" @click="compressionHandle(ruleForm.StandardList)" :loading="packLoading">一键压缩</el-button>
                </div>

                <div class="image-url">
                    <el-input class="image-input" v-model="ruleForm.imageUrl" clearable placeholder="请输入图片URL" />
                    <el-button type="primary" @click="handleCheckUrl(ruleForm.imageUrl)">上传图片</el-button>
                </div>
            </el-form-item>
            <!-- 这是6期新增结束 -->

            <h3>货柜-商品素材管理</h3>
            <el-form-item label="货柜PAD商品图" >
                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.PADImageList" accept=".png" :mediaType="9"  tip="尺寸：200*200，格式：png，大小：不大于50k，仅限一张 "></cst-upload>
                <el-button type="primary" @click="syncProduct(9, ruleForm.PADImageList)">同步至货柜商品图</el-button>
            </el-form-item>
            <!-- <el-form-item label="APP扫码商品图" >
                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.scanCodeImageList" accept=".png" :mediaType="10"  tip="尺寸：200*200，格式：png，大小：不大于50k，仅限一张 "></cst-upload>
            </el-form-item> -->
            <h3>恒生活APP-商品素材管理</h3>
            <!-- 1:短视频、2: 主图 3: 轮播图、4：缩略图、5：瀑布图、6：列表图、7：详情图片 -->
            <el-form-item label="SPU视频" >
                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.vidoList" accept=".mp4" :mediaType="1"  tip="主图放一个，次于主图后，MP4 小于10M "></cst-upload>
            </el-form-item>
            <el-form-item label="SPU主图">
                <cst-upload :limit="1" :multiple="false" v-model:fileList="ruleForm.zhutuList" accept=".jpg,.png,.jpeg" :mediaType="2"  tip="主图，放在第一位置，1张，750*750"></cst-upload>
            </el-form-item>
            <!-- <el-form-item label="SPU轮播图：" prop="name">
                <cst-upload :limit="8" :multiple="true"  v-model:fileList="ruleForm.lunbolist" accept=".jpg,.png,.jpeg" tip="次于主图位置。建议尺寸：750*750 像素，最多上传8张" :mediaType="3"></cst-upload>
            </el-form-item> -->
            <el-form-item label="SPU缩略图：" prop="name">
                <cst-upload :limit="1" :multiple="false"  v-model:fileList="ruleForm.suolueList" :mediaType="4" accept=".jpg,.png,.jpeg"  tip="放在购物车展示的缩略图，1张，jpg,小于50k，120*120"></cst-upload>
                <el-button type="primary" @click="syncProduct(4, ruleForm.suolueList)">同步至设备商品图</el-button>

            </el-form-item>
            <!-- <el-form-item label="SPU瀑布图：" prop="name">
                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.pubuImageList" accept=".jpg,.png,.jpeg"   tip="放在APP首页，浏览使用，1张。jpg、png,小于100K,334p*334（必须是正方形）" :mediaType="5"></cst-upload>
            </el-form-item> -->
            <el-form-item label="SPU列表图：" prop="name">
                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.liebiaoImageList" accept=".jpg,.png,.jpeg,.mp4"   tip="应用类目展示图片。建议尺寸：140*140 像素，最多上传1张" :mediaType="6"></cst-upload>
                <el-button type="primary" @click="syncProduct(6, ruleForm.liebiaoImageList)">同步至设备商品图</el-button>

            </el-form-item>
            <!-- <h4 class='dividing-head'>商品详情页图片</h4>
            <el-row :gutter="24">
                <el-form-item label="" prop="name">
                    <cst-upload :limit="20" :multiple="true" v-model:fileList="ruleForm.mediasList" accept=".jpg,.png,.jpeg,.mp4"   tip="支持上传20张图片，支持格式：png，jpg，gif文件大小：小于1M,图片尺寸：宽666px，高度自定义，不建议超过1000px" :mediaType="7"></cst-upload>
                </el-form-item>
            </el-row> -->
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
import { reactive, ref, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CstUpload from '@/components/upload/upload.vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { getAllList, getMerchantListCode } from '@/api/operate/index'

import pdf from './pdf.vue'
const route = useRoute()
const router = useRouter()
const props = defineProps(['merchantCode', 'goodsId'])
const noCan = ref(true)
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const goodsId = route.params.goodsId
const ruleForm = reactive({
    brandName: '', // 商品名称
    goodsName: '',
    vidoList: [],
    zhutuList: [],
    lunbolist: [],
    suolueList: [],
    pubuImageList: [],
    liebiaoImageList: [],
    mediasList: [],
    barCodeList: [],
    PADImageList: [],
    scanCodeImageList: [],
    backplotList: [], //  商品背标图 12
    StandardList: [] // 标品通用图  11

})
const compressImg = ref([]) // 压缩后的图片集合
const dealList = ref([]) // 压缩后的图片集合

const packLoading = ref(false) // 一键压缩loading

const detailInfo = reactive({
    brandName: ''
})
const canNotEdit = computed(() => props.handleType === 'detail' || props.handleType === 'approval')

const ruleFormRef = ref(null)

const getDetail = async () => {
    if (!goodsId) return
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            spuId: goodsId
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        name: 'spu详情页查询V2',
        url: '/search/spu/detail/v2',
        source: '商品中台'
    }
    const data = await getAllList(params)
    const spuMediaList = data?.data?.spuMediaList

    // detailInfo.value = data.data[0]
    ruleForm.goodsName = data.data.spuName
    ruleForm.brandName = data.data.brandName
    // detailInfo.value.isBatch = data.data[0].isBatch === 1 ? 1 : 0
    // detailInfo.value.productShelfLife = data.data[0].productShelfLife + (data.data[0].productShelfLifeUnit || '')
    spuMediaList.forEach(el => {
        // 1:短视频、2: 主图 、3: 轮播图、4：缩略图、5：瀑布图、6：列表图
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
        if (el.mediaType === 8) { // 条形码商品图
            ruleForm.barCodeList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 9) { // PAD商品图
            ruleForm.PADImageList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 10) { // 扫码商品图
            ruleForm.scanCodeImageList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 11) { //  StandardList: 标品通用图  11
            ruleForm.StandardList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 12) { // backplotList
            ruleForm.backplotList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
    })
    console.log(ruleForm, 'goodsMediaList')
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
    const normalList = [
        { mediaName: '主图', mediaType: 2, mediaUrl: ruleForm.zhutuList[0]?.url || '' },
        { mediaName: '缩略图', mediaType: 4, mediaUrl: ruleForm.suolueList[0]?.url || '' },
        { mediaName: '列表图', mediaType: 6, mediaUrl: ruleForm.liebiaoImageList[0]?.url || '' },
        { mediaName: '货柜PAD商品图', mediaType: 9, mediaUrl: ruleForm.PADImageList[0]?.url || '' }
    ]
    const params = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002', // 业务线编号
            // goodsName: ruleForm.goodsName, // goods 名称
            spuId: goodsId, // 标品ID
            // spuName: ruleForm.goodsName, // 标品名称
            // spuType: detailInfo.value.spuType || '111Mer11214', // 模版类型
            // shadow: ruleForm.isShadow, // 是否为影子 Goods
            // goodsDetail: { goodsDetail: JSON.stringify([{ title: '商品介绍说明', index: 1, pics: goodsObj }]) }, // 商品详情
            // 1:短视频、2: 主图 、3: 轮播图、4：缩略图、5：瀑布图、6：列表图、7：详情图片
            spuMedias: [
                { mediaName: '短视频', mediaType: 1, mediaUrl: ruleForm.vidoList[0]?.url || '' },
                // { mediaName: '轮播图', mediaType: 3, mediaUrl: ruleForm.lunbolist[0]?.response.data || '', id: ruleForm.lunbolist[0].id || '' },
                // ...ruleForm.lunbolist.map(el => {
                //     return { mediaName: '轮播图', mediaType: 3, mediaUrl: el.url || '' }
                // }),
                // { mediaName: '瀑布图', mediaType: 5, mediaUrl: ruleForm.pubuImageList[0]?.url || '' },
                ...ruleForm.mediasList.map(el => {
                    return { mediaName: '详情图', mediaType: 7, mediaUrl: el.url || '' }
                }),
                { mediaName: '商品条形码图', mediaType: 8, mediaUrl: ruleForm.barCodeList[0]?.url || '' },
                // { mediaName: 'APP扫码商品图', mediaType: 10, mediaUrl: ruleForm.scanCodeImageList[0]?.url || '' },
                { mediaName: '商品背标图', mediaType: 12, mediaUrl: ruleForm.backplotList[0]?.url || '' },
                { mediaName: '标品通用图', mediaType: 11, mediaUrl: ruleForm.StandardList[0]?.url || '' }
            ],
            mediaSorting: 1 // 排序
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        name: 'SPU商品素材图片接口',
        url: '/goods/spu/medias/saveOrUpdate/v1',
        source: '商品中台'
    }
    // 点一键压缩压缩后的图片地址替换掉列表图，pad商品，主图，缩略图的地址
    if (dealList.value.length) {
        params.body.spuMedias = [
            ...params.body.spuMedias,
            ...dealList.value
        ]
    } else {
        params.body.spuMedias = [
            ...params.body.spuMedias,
            ...normalList
        ]
    }
    const res = await getAllList(params)
    ElMessage.success('修改成功')
    setTimeout(async () => {
        await goBack()
    }, 500)

    // router.push({ name: 'goods-management-list' })
}
const goBack = () => {
    router.go(-1)
}
// // 提交前数据校验
// const dataCheck = () => {
//     if (!ruleForm.StandardList) {
//         ElMessage.error('请先上传图片')
//         return false
//     } else {
//         return true
//     }
// }
const handleCheckUrl = async (url) => {
    if (!ruleForm.imageUrl) {
        ElMessage.error('请先上传图片')
        return false
    }

    try {
        const param = {
            body: {
                appKey: 'A1001000', // 系统编号
                busiCode: 'A1001002',
                fileType: 11,
                converterUrl: ruleForm.imageUrl
            // 接口入参
            },
            appKey: 'A1001001',
            busiCode: 'A1001001',
            configCode: 'UC42978730277384192',
            name: '图片链接转换接口',
            url: '/goods/file/converter/v1',
            source: '商品中台'

        }
        const { code, data, message } = await getMerchantListCode(param)
        console.log(data, '0000')
        if (code === '200') {
            if (!ruleForm.StandardList.length) {
                ruleForm.StandardList.push({ url: data, response: { data: data }, id: 'UC42978730277384192' })
            }
        }
    } catch (error) {
        // ElMessage.error(error)
    }
}
const dealHandle = (obj) => {
    // const compressParasm = [
    //     { mediaName: '主图', mediaType: 2, mediaUrl: ruleForm.zhutuList[0]?.url || '' },
    //     { mediaName: '缩略图', mediaType: 4, mediaUrl: ruleForm.suolueList[0]?.url || '' },
    //     { mediaName: '列表图', mediaType: 6, mediaUrl: ruleForm.liebiaoImageList[0]?.url || '' },
    //     { mediaName: '货柜PAD商品图', mediaType: 9, mediaUrl: ruleForm.PADImageList[0]?.url || '' }
    // ]

    obj.forEach(item => {
        compressImg.value.forEach(curr => {
            if (Number(curr.type) === Number(item.mediaType)) {
                item.mediaUrl = curr.url
            }
        })
    })

    return obj
}
// 一键压缩
const compressionHandle = async () => {
    if (!ruleForm.StandardList.length) return ElMessage.error('请先上传图片')
    packLoading.value = true
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002',
            url: ruleForm.StandardList[0].url // 通用图片URL
            // 接口入参
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC42978981226786816',
        name: '一键压缩图片',
        url: '/goods/file/exchange/v1',
        source: '商品中台'

    }

    const res = await getMerchantListCode(param)

    if (res.code === '200') {
        packLoading.value = false
        compressImg.value = res.data

        ElMessage({
            type: 'success',
            message: res.message
        })
        // console.log(ruleForm, '------------ruleForm------------')

        dealList.value = dealHandle([
            { mediaName: '主图', mediaType: 2, mediaUrl: ruleForm.zhutuList[0]?.url || '' },
            { mediaName: '缩略图', mediaType: 4, mediaUrl: ruleForm.suolueList[0]?.url || '' },
            { mediaName: '列表图', mediaType: 6, mediaUrl: ruleForm.liebiaoImageList[0]?.url || '' },
            { mediaName: '货柜PAD商品图', mediaType: 9, mediaUrl: ruleForm.PADImageList[0]?.url || '' }
        ])

        nextTick(() => {
            console.log(dealList.value)
            if (dealList.value.length === 0) return
            // 主图
            const mainImg = dealList.value.filter(item => item.mediaType === 2)[0]
            ruleForm.zhutuList = []
            ruleForm.zhutuList.push({ url: mainImg.mediaUrl, response: { data: mainImg.mediaUrl }, id: 0 })

            // 缩略图
            const thumbnails = dealList.value.filter(item => item.mediaType === 4)[0]
            ruleForm.suolueList = []
            ruleForm.suolueList.push({ url: thumbnails.mediaUrl, response: { data: thumbnails.mediaUrl }, id: 0 })

            // 列表图
            const listImg = dealList.value.filter(item => item.mediaType === 6)[0]
            ruleForm.liebiaoImageList = []
            ruleForm.liebiaoImageList.push({ url: listImg.mediaUrl, response: { data: listImg.mediaUrl }, id: 0 })

            // 货柜PAD商品图
            const pad = dealList.value.filter(item => item.mediaType === 9)[0]
            ruleForm.PADImageList = []
            ruleForm.PADImageList.push({ url: pad.mediaUrl, response: { data: pad.mediaUrl }, id: 0 })
        })
    }
    if (res.code !== '200') {
        packLoading.value = false
        ElMessage({
            type: 'error',
            message: res.message
        })
    }
}
// 同步至商品库
const syncProduct = async (mediaType, url) => {
    if (!url.length) return ElMessage.error('请先上传图片')
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002',
            spuId: goodsId, // 标品id
            mediaUrl: url[0].url, // 图片url
            mediaType: mediaType // 图片类型
            // 接口入参
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC43300419183325184',
        name: '同步SPU图片到商品',
        url: '/goods/spu/medias/sync/v1',
        source: '商品中台'

    }

    const res = await getMerchantListCode(param)

    if (res.code === '200') {
        ElMessage({
            type: 'success',
            message: res.message
        })
    }
    if (res.code !== '200') {
        ElMessage({
            type: 'error',
            message: res.message
        })
    }
}
</script>
<style lang="scss" scoped>
    .apply-active-box{
        .ty-style {
            width:100%;
            display: flex;
            align-items: center;
        }
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
        .image-url {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            // margin-left: 110px;
            margin-bottom: 20px;
        }
        .image-input {
            width: 460px;
            margin-right: 30px;
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
