<!-- sku管理 -->
<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="sku编码" prop="skuId">
                            <el-input v-model.trim="searchData.skuId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="sku名称" prop="skuName">
                            <el-input v-model.trim="searchData.skuName" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商家编码" prop="merchantId">
                            <el-input v-model.trim="searchData.merchantId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商家名称" prop="merchantName">
                            <el-input v-model.trim="searchData.merchantName" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="spu编号" prop="spuId">
                            <el-input v-model.trim="searchData.spuId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="标品名称" prop="spuName">
                            <el-input v-model.trim="searchData.spuName" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="69码" prop="barcode">
                            <el-input v-model.trim="searchData.barcode" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="基础类目" prop="basicLevelChecked">
                            <el-cascader
                                ref="basicLevelRef"
                                :props="basicLevel"
                                v-model="searchData.basicLevelChecked"
                                remote
                                clearable
                                filterable
                                collapse-tags
                                @change="basicLevelChange"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备编号" prop="secondChannelId">
                            <el-input v-model.trim="searchData.secondChannelId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="存储条件" prop="storageStyle">
                            <el-select v-model.trim="searchData.storageStyle" clearable placeholder="请选择" >
                                <el-option label="常温" value="常温" />
                                <el-option label="冷藏" value="冷藏" />
                                <el-option label="冷冻" value="冷冻" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备类型" prop="deviceKind">
                            <el-select v-model.trim="searchData.deviceKind" clearable placeholder="请选择" >
                                <el-option label="单开门常温柜" value="101" />
                                <el-option label="单开门冷藏柜" value="102" />
                                <el-option label="单开门冷冻柜" value="103" />
                                <el-option label="单开门大容量常温柜" value="111" />
                                <el-option label="单开门大容量冷藏柜" value="112" />
                                <el-option label="单开门大容量冷冻柜" value="113" />
                                <el-option label="双开门常温柜" value="201" />
                                <el-option label="双开门冷藏柜" value="202" />
                                <el-option label="双开门冷冻柜" value="203" />
                                <el-option label="双开门冷藏冷冻柜" value="204" />
                                <el-option label="36货道弹簧柜" value="501" />
                                <el-option label="60货道弹簧柜" value="502" />
                                <el-option label="组合柜" value="10" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上架渠道" prop="doorType">
                            <el-select v-model.trim="searchData.doorType" clearable placeholder="请选择" >
                                <el-option label="单门" value="0" />
                                <el-option label="左门" value="1" />
                                <el-option label="右门" value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="search()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                    <el-button type="primary" @click="exportTable">
                        导出
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.currPage"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >

                <template #imgUrl="scope">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" fit="cover" />
                </template>
                <template #gmtOnShelf="scope">
                    {{ scope.row.gmtOnShelf }}
                </template>
                <template #gmtModify="scope">
                    {{ scope.row.gmtModify}}
                </template>
                <template #skuStatus="{row}">

                    <div v-if="row.skuStatus === 1">待审核</div>
                    <div v-else-if="row.skuStatus === 2">已审核</div>
                    <div v-else-if="row.skuStatus === 3">审核不通过</div>
                    <div v-else-if="row.skuStatus === 4">已上架</div>
                    <div v-else-if="row.skuStatus === 5">下架可上架</div>
                    <div v-else-if="row.skuStatus === 6">下架不可再上架</div>
                    <div v-else-if="row.skuStatus === 7">待上架</div>
                    <div v-else>-</div>
                </template>
                <template #firstCateName="scope">
                    <span>{{scope.row.firstCateName}}-{{scope.row.secondCateName}}-{{scope.row.thirdCateName}}-{{scope.row.fourthCateName}}</span>
                </template>
            </system-list>
        </div>
        <apply-sku v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false" :rowList = "rowList" :type="type" @fevent="getPagingList()"></apply-sku>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList, exportCommon } from '@/api/operate/index'
import { useStore } from 'vuex'
import { queryCategory } from '@/utils'
import { tHead } from './userConfig.js'

import applySku from './apply-sku.vue'
const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const SkuStatusValue = ref({ 1: '待审核', 2: '已审核', 3: '审核不通过', 4: '已上架', 5: '下架可上架', 6: '下架不可再上架', 7: '待上架' })

const dataState = reactive({
    searchData: {
        merchantId: '', // 商户编码
        merchantName: '', // 商家名称
        brandName: '', // 品牌名称
        skuId: '', // sku编号
        skuName: '', // sku名称
        barcode: '',
        // modelCode: '',
        spuId: '',
        spuName: '',
        secondChannelId: '', // 设备编号
        storageStyle: '',
        firstCateName: [],
        secondCateName: [],
        thirdCateName: [],
        fourthCateName: [],
        basicLevelChecked: [],
        deviceKind: '',
        doorType: ''
    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    },
    tableData: [],
    cityList: [],
    firstCateList: [],
    secondCateList: [],
    thirdCateList: [],
    fourCateList: [],
    pinpaiList: [],
    dialogVisible: false,
    rowList: {},
    type: ''

})
const { searchData, pageinfo, tableData, firstCateList, secondCateList, thirdCateList, fourCateList, dialogVisible, rowList, type } = toRefs(dataState)

onMounted(async () => {
    await getPagingList()
})

// 列表数据
const getPagingList = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            barcodes: dataState.searchData.barcode ? dataState.searchData.barcode.split(',') : [],
            spuIds: dataState.searchData.spuId ? dataState.searchData.spuId.split(',') : [],
            firstCateNames: dataState.searchData.firstCateName ? dataState.searchData.firstCateName : '',
            secondCateNames: dataState.searchData.secondCateName ? dataState.searchData.secondCateName : '',
            thirdCateNames: dataState.searchData.thirdCateName ? dataState.searchData.thirdCateName : '',
            fourthCateNames: dataState.searchData.fourthCateName ? dataState.searchData.fourthCateName : '',
            merchantNames: dataState.searchData.merchantName ? dataState.searchData.merchantName.split(',') : [],
            merchantIds: dataState.searchData.merchantId ? dataState.searchData.merchantId.split(',') : [],
            secondChannelIds: dataState.searchData.secondChannelId ? dataState.searchData.secondChannelId.split(',') : [],
            skuIds: dataState.searchData.skuId ? dataState.searchData.skuId.split(',') : [],
            storageStyles: dataState.searchData.storageStyle ? dataState.searchData.storageStyle.split(',') : [],
            spuName: dataState.searchData.spuName,
            deviceKind: dataState.searchData.deviceKind,
            doorType: dataState.searchData.doorType,
            skuStatus: [-1],
            channelTypes: [1],
            skuName: dataState.searchData.skuName,
            pageNo: dataState.pageinfo.currPage,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UCJH32483132292374528',
        name: 'sku管理',
        source: '运营后台'
    }
    const res = await getMerchantList(params)
    const resultdata = res?.list || []
    for (let i = 0; i < resultdata.length; i++) {
        const imgurl = ref('')
        if (resultdata[i].goodsMediaList !== null) {
            for (let j = 0; j < resultdata[i].goodsMediaList.length; j++) {
                if (resultdata[i].goodsMediaList[j].mediaType === 2) {
                    imgurl.value = resultdata[i].goodsMediaList[j].mediaUrl
                }
            }
        }
        console.log(imgurl.value + 'imgurl')
        resultdata[i].imgUrl = imgurl.value
    }
    dataState.tableData = res?.list
    dataState.pageinfo.total = res?.total
}

// 基础类目联动
const basicLevel = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await queryCategory(level + 1, data.value || '')
        const nodes = res.map(item => {
            return {
                label: item.name,
                value: item.code,
                level: item.level,
                leaf: level >= 3
            }
        })
        resolve(nodes)
    }
}

const basicLevelRef = ref(null)
const productDataState = reactive({
    basicLevelRefVisiable: true,
    basicLevelCheckedInfo: {},
    firstCateNameList: [],
    secondCateNameList: [],
    thirdCateNameList: [],
    fourCateNameList: []
})

// 基础类目change
const basicLevelChange = (value) => {
    const first = []
    const second = []
    const three = []
    const fourth = []
    dataState.basicLevelCheckedNodes = basicLevelRef.value.getCheckedNodes(true)
    dataState.basicLevelCheckedNodes.forEach((item) => {
        first.push(item.pathLabels[0])
        second.push(item.pathLabels[1])
        three.push(item.pathLabels[2])
        fourth.push(item.pathLabels[3])
    })
    dataState.searchData.firstCateName = new Set(first)
    dataState.searchData.secondCateName = new Set(second)
    dataState.searchData.thirdCateName = new Set(three)
    dataState.searchData.fourthCateName = new Set(fourth)
    // dataState.searchData.firstCateName = basicLevelChecked.pathLabels[0]
    // dataState.searchData.secondCateName = basicLevelChecked.pathLabels[1]
    // dataState.searchData.thirdCateName = basicLevelChecked.pathLabels[2]
    // dataState.searchData.fourthCateName = basicLevelChecked.pathLabels[3]
}

// 基础类目模糊搜索
const getlistByName = async (level, cateName) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            level,
            cateName
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC1657693119977tVHEb',
        name: '品类模糊搜索接口',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    return res
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    dataState.searchData.firstCateName = []
    dataState.searchData.secondCateName = []
    dataState.searchData.thirdCateName = []
    dataState.searchData.fourthCateName = []

    getPagingList()
}

// 查询
const search = () => {
    dataState.pageinfo.currPage = 1
    getPagingList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currPage = val
    getPagingList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currPage = 1
    dataState.pageinfo.pageSize = val
    getPagingList()
}

const exportTable = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UCJH32483132292374528',
        exportType: 7,
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            barcodes: dataState.searchData.barcode ? dataState.searchData.barcode.split(',') : [],
            spuIds: dataState.searchData.spuId ? dataState.searchData.spuId.split(',') : [],
            firstCateNames: dataState.searchData.firstCateName ? dataState.searchData.firstCateName : '',
            secondCateNames: dataState.searchData.secondCateName ? dataState.searchData.secondCateName : '',
            thirdCateNames: dataState.searchData.thirdCateName ? dataState.searchData.thirdCateName : '',
            fourthCateNames: dataState.searchData.fourthCateName ? dataState.searchData.fourthCateName : '',
            merchantNames: dataState.searchData.merchantNames ? dataState.searchData.merchantNames.split(',') : [],
            merchantIds: dataState.searchData.merchantIds ? dataState.searchData.merchantIds.split(',') : [],
            skuIds: dataState.searchData.skuId ? dataState.searchData.skuId.split(',') : [],
            storageStyles: dataState.searchData.storageStyle ? dataState.searchData.storageStyle.split(',') : [],
            spuName: dataState.searchData.spuName,
            secondChannelIds: dataState.searchData.secondChannelId ? dataState.searchData.secondChannelId.split(',') : [],
            skuStatus: [-1],
            channelTypes: [1],
            skuName: dataState.searchData.skuName
        }

    }
    const res = await exportCommon(params)
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    if (fileName) { // 根据后端返回的数据处理文件名称
        fileName = fileName.substring(fileName.indexOf('=') + 1)
    }
    const link = document.createElement('a')// 创建一个a标签
    link.download = fileName// 设置a标签的下载属性
    link.style.display = 'none'// 将a标签设置为隐藏
    link.href = URL.createObjectURL(blob)// 把之前处理好的地址赋给a标签的href
    document.body.appendChild(link)// 将a标签添加到body中
    link.click()// 执行a标签的点击方法
    URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
    document.body.removeChild(link)// 移除a标签
}
</script>

<style lang="scss" scoped>
 .coupon-submit-box{
     .dialog-title{
        font-size:20px;
        color:red;
        font-weight:700;
     }
     .header-title{
         font-size:20px;
         color:red;
         height:50px;
         font-weight:700;
         align-items:center
     }
 }
</style>
