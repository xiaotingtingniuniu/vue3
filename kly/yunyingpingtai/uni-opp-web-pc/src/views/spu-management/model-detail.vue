<template>
    <div class='apply-active-box'>
        <pdf></pdf>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="auto">
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="品牌名称：" prop="brandName">
                        {{ruleForm.brandName}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="标品名称：" prop="goodsName">
                        {{ruleForm.goodsName}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="69码：" prop="barcode">
                        <span>{{ruleForm.barcode}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- 1:正对着商品、2: 商品正面朝上 、3: 商品反面朝上、4：视频 -->
            <el-form-item label="1、正对着商品拍摄一张（俯拍）【需1张图片】" prop="name">
                <cst-upload :limit="1" :multiple="false" v-model:fileList="ruleForm.pubuImageList" accept=".jpg,.png,.jpeg" :mediaType="1"></cst-upload>
            </el-form-item>
            <el-form-item label="2、将商品正面朝上放置： 分别从商品的四个角，以 45 度角向内分别拍摄一张照片，每次拍摄应尽量拍到商品的3个面【需4张图片】" props="zhutuList">
                <cst-upload :limit="4" :multiple="true" v-model:fileList="ruleForm.zhutuList" accept=".jpg,.png,.jpeg" :mediaType="2" ></cst-upload>
            </el-form-item>
            <el-form-item label="3、将商品反面朝上放置：从商品的四个角，以 45 度角向内分别拍摄一张照片，每次拍摄应尽量拍到商品 的 3 个面；【需4张图片】" prop="name">
                <cst-upload :limit="4" :multiple="true"  v-model:fileList="ruleForm.lunbolist" accept=".jpg,.png,.jpeg" :mediaType="3"></cst-upload>
            </el-form-item>
            <el-form-item label="4、视频清晰度及格式要求 视频统一为 mp4 格式，清晰度需要达到 1080p，视频无卡顿，画面模糊等情况。" >
                <cst-upload :limit="1" :multiple="true" v-model:fileList="ruleForm.vidoList" accept=".mp4" :mediaType="4"></cst-upload>
            </el-form-item>
            <!-- <h4 class='dividing-head'>商品详情页图片</h4>
            <el-row :gutter="24">
                <el-form-item label="" prop="name">
                    <cst-upload :limit="20" :multiple="true" v-model:fileList="ruleForm.mediasList" accept=".jpg,.png,.jpeg,.mp4"   tip="支持上传20张图片，支持格式：png，jpg，gif文件大小：小于1M,图片尺寸：宽666px，高度自定义，不建议超过1000px" :mediaType="7"></cst-upload>
                </el-form-item>
            </el-row> -->
        </el-form>
        <div  style="width: 400px; margin: 0 auto">
            <!-- <el-button type="primary" @click="submitForm()" >
                提交
            </el-button> -->
            <el-button type="primary" @click="goBack()">
                关闭
            </el-button>
            <el-button type="primary" @click="submitPush()">
                保存并推送
            </el-button>
        </div>

    </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CstUpload from '@/components/upload/uploadFlie.vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { getAllList, getupdate } from '@/api/operate/index'
import pdf from './pdf.vue'
const route = useRoute()
const router = useRouter()
const props = defineProps(['merchantCode', 'goodsId'])
const noCan = ref(true)
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const goodsId = route.params.goodsId
console.log(route.params.goodsId, 1111111123123)
const ruleForm = reactive({
    brandName: '', // 商品名称
    goodsName: '',
    spuId: '',
    vidoList: [],
    zhutuList: [],
    lunbolist: [],
    suolueList: [],
    pubuImageList: [],
    liebiaoImageList: [],
    mediasList: []
})

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
        configCode: 'UC22757475895386112',
        name: 'spu详情页查询V2',
        url: '/search/spu/detail/v2',
        source: '商品中台'
    }
    const data = await getAllList(params)
    detailInfo.value = data.data
    const modelMediaList = data.modelMediaList
    // detailInfo.value = data.data[0]
    ruleForm.goodsName = data.data.spuName
    ruleForm.brandName = data.data.brandName
    ruleForm.spuId = data.data.spuId
    ruleForm.barcode = data.data.barcode
    data.data.modelMediaList && data.data.modelMediaList.forEach(el => {
        // 1:俯视(overlook)、2: 正面朝上(frontage) 3: 反面朝上(opposite)、4：视频(vedio)
        if (el.mediaType === 4) {
            ruleForm.vidoList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 2) {
            ruleForm.zhutuList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 3) {
            ruleForm.lunbolist.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
        if (el.mediaType === 1) {
            ruleForm.pubuImageList.push({ url: el.mediaUrl, response: { data: el.mediaUrl }, id: el.id })
        }
    })
}
getDetail()
// 提交表单
const submitForm = async () => {
    const goodsObj = {}
    ruleForm.mediasList.map((el, index) => {
        console.log(el, 'el')
        goodsObj['pic' + (index + 1)] = el.url
    })
    const params = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001001', // 业务线编号
            spuId: ruleForm.spuId, // 标品ID
            // <!-- 1:正对着商品、2: 商品正面朝上 、3: 商品反面朝上、4：视频 -->
            spuModelMedias: [
                { mediaName: '视频', mediaType: 4, mediaUrl: ruleForm.vidoList[0]?.url || '', id: ruleForm.vidoList[0]?.id || '' },
                // { mediaName: '主图', mediaType: 2, mediaUrl: ruleForm.zhutuList[0]?.url || '', id: ruleForm.zhutuList[0].id || '' },
                ...ruleForm.zhutuList.map(el => {
                    return { mediaName: '正面朝上图', mediaType: 2, mediaUrl: el.url || '', id: el?.id || '' }
                }),
                // { mediaName: '轮播图', mediaType: 3, mediaUrl: ruleForm.lunbolist[0]?.response.data || '', id: ruleForm.lunbolist[0].id || '' },
                ...ruleForm.lunbolist.map(el => {
                    return { mediaName: '反面图', mediaType: 3, mediaUrl: el.url || '', id: el?.id || '' }
                }),
                // { mediaName: '缩略图', mediaType: 4, mediaUrl: ruleForm.suolueList[0]?.url || '', id: ruleForm.suolueList[0].id || '' },
                { mediaName: '俯视图', mediaType: 1, mediaUrl: ruleForm.pubuImageList[0]?.url || '', id: ruleForm.pubuImageList[0].id || '' }
                // { mediaName: '列表图', mediaType: 6, mediaUrl: ruleForm.liebiaoImageList[0]?.url || '', id: ruleForm.liebiaoImageList[0].id || '' },
                // ...ruleForm.mediasList.map(el => {
                //     return { mediaName: '详情图', mediaType: 7, mediaUrl: el.url || '', id: el?.id || '' }
                // })
            ],
            mediaSorting: 1 // 排序
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        name: 'SPU模型训练图片接口',
        url: '/goods/spu/modelMedias/saveOrUpdate/v1',
        source: '商品中台'
    }
    const res = await getAllList(params)
    ElMessage.success('修改成功')
    // router.push({ name: 'goods-management-list' })
}
const submitPush = async () => {
    const goodsObj = {}
    ruleForm.mediasList.map((el, index) => {
        console.log(el, 'el')
        goodsObj['pic' + (index + 1)] = el.url
    })
    console.log(ruleForm, 'ruleForm')
    const params = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001001', // 业务线编号
            spuId: ruleForm.spuId, // 标品ID
            // <!-- 1:正对着商品、2: 商品正面朝上 、3: 商品反面朝上、4：视频 -->
            spuModelMedias: [
                { mediaName: '视频', mediaType: 4, mediaUrl: ruleForm.vidoList[0]?.url || '', id: ruleForm.vidoList[0]?.id || '' },
                ...ruleForm.zhutuList.map(el => {
                    return { mediaName: '正面朝上图', mediaType: 2, mediaUrl: el.url || '', id: el?.id || '' }
                }),
                ...ruleForm.lunbolist.map(el => {
                    return { mediaName: '反面图', mediaType: 3, mediaUrl: el.url || '', id: el?.id || '' }
                }),
                { mediaName: '俯视图', mediaType: 1, mediaUrl: ruleForm.pubuImageList[0]?.url || '', id: ruleForm.pubuImageList[0]?.id || '' }

            ],
            mediaSorting: 1 // 排序
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        name: 'SPU模型训练图片提交并推送V3',
        configCode: 'UC32051057865170944',
        url: '/goods/spu/model/saveOrUpdate/push/v3',
        source: '商品中台'
    }
    const res = await getAllList(params)
    ElMessage.success('修改成功')
}

// 批量上传图片
const fileRequest = async (file) => {
    const formData = new FormData()
    file.forEach(item => {
        formData.append('file', item.file)
    })

    formData.append('appKey', 'A1001000')
    formData.append('busiCode', 'A1001000')
    formData.append('configCode', 'UC10459724838014976')
    formData.append('name', '提现结转导入')
    formData.append('source', '分销系统')
    formData.append('importType', 1)
    const res = await getupdate(formData)
    if (res.code === '200') {
        ElMessage({
            message: '上传成功',
            type: 'success'
        })
    }
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
        :deep(.el-form-item){
            display: block;
        }
        :deep(.el-form-item__label-wrap){
            display: block;
            margin-left: 0 !important;
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
