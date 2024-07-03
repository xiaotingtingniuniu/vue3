<template>
    <div class="apply-active-box">
        <h3 class="dividing-head">编辑sku信息</h3>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" :rules="rules" label-width="auto" :inline="true" :disabled="route.params.merchantCode === 'detail' ? true : false">
            <el-form-item label="商品编号">
                <el-input v-model="ruleForm.skuId" controls-position="right" :disabled="route.params.merchantCode!=='add'"/>
            </el-form-item>
            <el-form-item label="选择Goods">
                <el-input v-model="ruleForm.goodsName" controls-position="right" />
            </el-form-item>
            <el-form-item label="生产日期" prop="productDate">
                <el-date-picker v-model="ruleForm.productDate"  type="datetime" placeholder="请选择日期" value-format="YYYY-MM-DD"/>
            </el-form-item>
            <el-form-item label="商品名称">
                <el-input v-model="ruleForm.skuName" controls-position="right" />
            </el-form-item>
            <el-form-item label="基础类目">
                <el-input v-model="ruleForm.cateName" controls-position="right" />
            </el-form-item>
            <el-form-item label="品牌名称" prop="brandName">
                <el-input v-model="ruleForm.brandName" controls-position="right" />
            </el-form-item><br />
            <el-form-item label="生产批次号">
                <el-input v-model="ruleForm.skuBatchNo" controls-position="right" />
            </el-form-item><br />
            <el-col :span="8" v-if="route.params.merchantCode === 'add'">
                <el-form-item label="一级渠道" prop="channelType">
                    <el-select
                        v-model="ruleForm.channelType"
                        placeholder="请输入"
                        :loading="loading"
                    >
                        <el-option
                            v-for="item in qudaoList"
                            :key="item.channelType"
                            :label="item.firstChannelName"
                            :value="item.skuChannelId"
                            @click="changeFirstChannel(item)"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="route.params.merchantCode === 'add'">
                <el-form-item label="二级渠道" prop="secondChannelId">
                    <el-select
                        v-model="ruleForm.secondChannelId"
                        placeholder="请输入"
                        :loading="loading"
                    >
                        <el-option
                            v-for="item in twoList"
                            :key="item.skuChannelId"
                            :label="item.secondChannelName"
                            :value="item.secondChannelId"
                            @click="changeSecondChannel(item)"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-form-item label="运费" prop="freightFee">
                <el-input v-model="ruleForm.freightFee" controls-position="right" class="form-action-item-50w"/>
            </el-form-item>
            <el-form-item label="三方商品编号">
                <el-input v-model="ruleForm.outerSkuId" controls-position="right" class="form-action-item-50w"/>
            </el-form-item>
            <el-form-item label="售卖单位" prop="sellingUnit">
                <el-select v-model="ruleForm.sellingUnit">
                    <el-option label="箱" value="0"/>
                    <el-option label="盒" value="1"/>
                    <el-option label="瓶" value="2"/>
                    <el-option label="包" value="3"/>
                    <el-option label="袋" value="4"/>
                    <el-option label="个" value="5"/>
                </el-select>
            </el-form-item>
            <el-form-item label="标品换算单位" prop="spuTransUnit">
                <el-input v-model="ruleForm.spuTransUnit" controls-position="right" class="form-action-item-50w"/>
            </el-form-item>
            <el-form-item label="应用类目">
                <el-cascader ref="applyClassifyRef" :props="skuApplyClassify"  v-model="busiCatesList" @change="applyClassifyChange"/>
            </el-form-item>
            <el-form-item label="sku可售区域">
                <el-cascader
                    ref="areaRef"
                    :props="goodsCannotSkuArea"
                    @change="skuAreaChange"
                    v-model="limitedCitys"
                    class="form-action-item-50w"
                    v-if="showArea"
                />
            </el-form-item>
            <el-form-item label="sku可售区域" v-if="route.params.merchantCode === 'detail'">
                <el-input v-model="ruleForm.limitedCitys" style="width:400px"></el-input>
            </el-form-item>
            <h3 class="dividing-head">SKU基本信息</h3>
            <el-form-item label="商品条码">
                <el-input v-model="ruleForm.brandCode"/>
            </el-form-item>
            <el-form-item label="商品规格">
                <el-input v-model="ruleForm.brandName"/>
            </el-form-item>
            <el-form-item label="品牌名称">
                <el-input v-model="ruleForm.brandName"/>
            </el-form-item>
            <el-form-item label="包装方式" prop="packagingMethod">
                <el-input v-model="ruleForm.packagingMethod" controls-position="right" />
            </el-form-item>
            <el-form-item label="商品毛重(g)" prop='productWeight'>
                <el-input v-model="ruleForm.productWeight" controls-position="right" />
            </el-form-item>
            <el-form-item label="保质期" prop="shelfLifeDays">
                <el-input v-model="ruleForm.shelfLifeDays" controls-position="right" />
            </el-form-item>
            <el-form-item label="口味" prop="taste">
                <el-input v-model="ruleForm.taste" controls-position="right" />
            </el-form-item>
            <el-form-item label="产地">
                <el-input v-model="ruleForm.taste"/>
            </el-form-item>
            <el-form-item label="存储条件" prop="storageMethod">
                <el-input v-model="ruleForm.storageMethod" controls-position="right" />
            </el-form-item>
            <el-form-item label="官方指导价" prop="salePrice">
                <el-input v-model="ruleForm.salePrice" controls-position="right" />
            </el-form-item>
        </el-form>
        <div style="width: 200px; margin: 0 auto">
            <el-button v-if="route.params.merchantCode === 'edit'" type="primary" @click="modify('SKU更新V6', 'UC77099861835296768')">确定</el-button>
            <el-button  type="primary" @click="cancel">关闭</el-button>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, computed, onMounted, watch } from 'vue'
import SystemList from '@/composables/TablePagination/table.vue'
import { applyPromoList, applyDetail, applyEdit, applySubmit } from '@/api/marketing/active'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { yingyongQueryCategoryPF, queryCategory } from '@/utils'
import { getMerchantList, skuDetails, skuModify, skuCreate, skuMap, oneLevel, twoLevel } from '@/api/operate/index'

const router = useRouter()
const route = useRoute()
const props = defineProps(['skuId', 'merchantCode'])
const noCan = ref(true)

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => route.params.merchantCode === 'detail' || route.params.merchantCode === 'approval')

//

const ruleForm = ref({
    //  商家名称   成本价  原价 没有字段
    cerType: '',
    goodsId: '',
    freightFee: '', // 运费
    secondChannelId: '',
    outerSkuId: '', // 三方商品编号
    sellingUnit: '',
    spuTransUnit: '', // 标品换算单位
    isMarketSku: '',
    brandCode: '', // 商品条码
    skuId: '', // 商品编号
    fourthCateName: '', // 基础类目
    brandName: '', // 品牌名称
    salePrice: '', // 售卖价
    firstChannelName: '', // 一级渠道
    secondChannel: '', // 二级渠道
    productDate: '', // 生产日期
    shelfLifeDays: '', // 保质期天数
    manufacturer: '', // 生产企业名称
    manufacturerAddress: '', // 生产企业地址
    manufacturerZipcode: '', // 生产企业邮编
    tags: '', // sku标签
    busiCates: [], // 应用类目
    skuColour: '', // 商品颜色
    packagingMethod: '', // 包装方式
    isSmallSpecification: '', // 是否小规格
    productWeight: '', // 商品毛重
    productVolume: '', // 商品体积
    productWidth: '', // 宽
    storageMethod: '', // 存储方式
    productLength: '', // 长
    productHeigh: '', // 高
    taste: '', // 口味
    packagingSpecification: '', // 包装规格
    capacity: '', // 容量
    skuBatchNo: '', // 生产批次号
    addressName: '',
    channelType: '',
    city: '',
    county: '',
    resource: '是',
    cateName: '',
    thumbnail: [],
    regionList: ''
})
const cateNameTextList = ref([])
const dataState = reactive({
    // 一级类目
    firstCateNameList: [],
    secondCateNameList: [],
    thirdCateNameList: [],
    qudaoList: [], // 渠道列表
    busiCatesList: [],
    limitedCitys: null, // []
    areaCheckedNodes: [],
    showArea: true

})
const { firstCateNameList, secondCateNameList, thirdCateNameList, qudaoList, busiCatesList, limitedCitys, showArea } = toRefs(dataState)

onMounted(async () => {
    await getOneLivel()
    await getQudaoList()
    if (route.params.merchantCode !== 'add') {
        await getSkuDetails()
    }
})
const tages = ref([])
const busiCates = ref([])

// 一级渠道接口请求
const oneList = ref([])
const getOneLivel = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001005'
        },
        appKey: 'A1001001',
        busiCode: 'A1001005',
        configCode: 'UC1657884654291RUuhQ',
        name: '查询业务线列表',
        source: '商户中台'
    }
    const res = await oneLevel(params)
    oneList.value = res
}

const getSkuDetails = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001005',
            skuId: props.skuId
        },
        appKey: 'A1001001',
        busiCode: 'A1001005',
        configCode: 'UC15115376431964160',
        name: 'sku详情页查询V2',
        source: '商品中台'
    }
    const res = await skuDetails(params)
    Object.assign(ruleForm.value, res)
    console.log(ruleForm.value, 'ruleForm')
    cateNameTextList.value = res.busiCateList ? res.busiCateList.map(el => {
        const busiFirstCateCode = el.bfirstCateCode || ''
        const busiFirstCateName = el.bfirstCateName || ''
        const busiSecondCateCode = el.bsecondCateCode || ''
        const busiSecondCateName = el.bsecondCateName || ''
        const busiThirdCateCode = el.bthirdCateCode || ''
        const busiThirdCateName = el.bthirdCateName || ''
        return {
            busiFirstCateCode,
            busiFirstCateName,
            busiSecondCateCode,
            busiSecondCateName,
            busiThirdCateCode,
            busiThirdCateName
        }
    }) : []
    console.log(cateNameTextList.value, 'cateNameTextList')
    limitedRegionList.value = res.limitedRegionList ? res.limitedRegionList : []
    ruleForm.value.cateName = res.firstCateName ? res.firstCateName + '/' + res.secondCateName + '/' + res.secondCateName + '/' + res.thirdCateName + '/' + res.fourthCateName : res.secondCateName + '/' + res.thirdCateName + '/' + res.fourthCateName
    res.busiCateList.forEach(item => {
        console.log(item)
        const catesInfo = [item.bfirstCateCode, item.bsecondCateCode]
        dataState.busiCatesList.push(catesInfo)
        console.log(dataState.busiCatesList, 'busiCatesList')
    })
    // res.regionList.forEach(item => {
    //     const cityInfo = [item.provinceCode, item.cityCode, item.countyCode]
    //     dataState.limitedCitys.push(cityInfo)
    // })
    ruleForm.value.limitedCitys = res.regionList[0].provinceName + res.regionList[0].countyName + res.regionList[0].cityName
    console.log(dataState.limitedCitys, '12313123')
    dataState.showArea = false
    setTimeout(() => {
        dataState.showArea = true
    }, 1000)
    await getTwoList(res.firstChannelName)
}
// 城市接口请求
const provincesList = ref([])
const getCities = async (ql, code) => {
    const params = {
        body: {
            ql: ql,
            code: code,
            appKey: 'A1001001',
            busiCode: 'A1001005'
        },
        appKey: 'A1001001',
        busiCode: 'A1001005',
        configCode: 'UC1658391004384SvOqm',
        name: '查询四级地址库信息',
        source: '运单中台'
    }
    const res = await skuMap(params)
    return res
}

// 城市范围联动
const limitedRegionList = ref([])
const goodsCannotSkuArea = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await getCities(level + 1, data.value || '')
        console.log(res, '000')
        const nodes = res.addressList.map(item => {
            return {
                label: item.addressName,
                value: item.addressCode,
                level: item.level,
                leaf: level >= 2
            }
        })
        resolve(nodes)
    }
}

const skuAreaChange = (val) => {
    dataState.applyClassifyCheckedNodes = applyClassifyRef.value.getCheckedNodes(true)
    dataState.areaCheckedNodes.forEach((item) => {
        limitedRegionList.value.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1],
            countyCode: item.pathValues[2],
            countyName: item.pathLabels[2]

        })
    })
}
// 应用类目联动
const applyClassifyRef = ref(null)
const skuApplyClassify = {
    lazy: true,
    multiple: true,
    lazyLoad (node, resolve) {
        const { level, data } = node
        setTimeout(async () => {
            const res = await yingyongQueryCategoryPF(level + 1, data.value || '')
            const nodes = res.map(item => {
                return {
                    label: item.name,
                    value: item.code,
                    level: item.level,
                    leaf: level >= 1
                }
            })
            resolve(nodes)
        }, 1000)
    }
}
// 应用类目change
const applyClassifyChange = (value) => {
    console.log(value, 'change')
    dataState.applyClassifyCheckedNodes = applyClassifyRef.value.getCheckedNodes(true)
    console.log(dataState.applyClassifyCheckedNodes, 'dataState.applyClassifyCheckedNodes')
    // dataState.applyClassifyCheckedNodes.forEach((item) => {
    //     cateNameTextList.value.push({
    //         busiFirstCateCode: item.pathValues[0],
    //         busiFirstCateName: item.pathLabels[0],
    //         busiSecondCateCode: item.pathValues[1],
    //         busiSecondCateName: item.pathLabels[1],
    //         busiThirdCateCode: item.pathValues[2],
    //         busiThirdCateName: item.pathLabels[2]
    //     })
    // })
    cateNameTextList.value = dataState.applyClassifyCheckedNodes.map((item) => {
        const busiFirstCateCode = item.pathValues[0] ? item.pathValues[0] : ''
        const busiFirstCateName = item.pathLabels[0] ? item.pathLabels[0] : ''
        const busiSecondCateCode = item.pathValues[1] ? item.pathValues[1] : ''
        const busiSecondCateName = item.pathLabels[1] ? item.pathLabels[1] : ''
        const busiThirdCateCode = item.pathValues[2] ? item.pathValues[2] : ''
        const busiThirdCateName = item.pathLabels[2] ? item.pathLabels[2] : ''
        return {
            busiFirstCateCode,
            busiFirstCateName,
            busiSecondCateCode,
            busiSecondCateName,
            busiThirdCateCode,
            busiThirdCateName
        }
        // cateNameTextList.value.push({
        //     busiFirstCateCode: item.pathValues[0],
        //     busiFirstCateName: item.pathLabels[0],
        //     busiSecondCateCode: item.pathValues[1],
        //     busiSecondCateName: item.pathLabels[1],
        //     busiThirdCateCode: item.pathValues[2],
        //     busiThirdCateName: item.pathLabels[2]
        // })
    })
    console.log(cateNameTextList.value, 'value')
}

const detaliname = async (index) => {
    cateNameTextList.value.splice(index, 1)
}
// 点击确定修改页面
const modify = async (name, code) => {
    // 修改更新发起的请求
    const parm = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001005',
            skuName: ruleForm.value.skuName,
            skuId: ruleForm.value.skuId,
            goodsId: ruleForm.value.goodsId,
            ...ruleForm.value,
            // channelType: channelType.value.channelType,
            channelType: ruleForm.value.channelType || 0,
            secondChannelId: ruleForm.value.secondChannelId || 0,
            // secondChannelId: 0,
            // limitedRegionList: limitedRegionList.value,
            busiCates: cateNameTextList.value,
            productDate: ruleForm.value.productDate?.replace('T', ' ')

        },
        appKey: 'A1001001',
        busiCode: 'A1001005',
        configCode: code,
        name: name,
        source: '商品中台'
    }
    await getMerchantList(parm)
    ElMessage.success('成功')
    router.push({ name: 'wholesaleMall-sku-list' })
}

const cancel = () => {
    router.go(-1)
}

// 品牌名称模糊搜索
const brandNameList = ref([])
const getPinpaiList = async (brandName) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001005',
            brandName
        },
        appKey: 'A1001000',
        busiCode: 'A1001005',
        configCode: 'UC1657693029305Xk3lm',
        name: '品牌模糊查询',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    return res
}
const remoteMethod = async (query) => {
    if (query) {
        const res = await getPinpaiList(query)
        brandNameList.value = res
    } else {
        brandNameList.value = []
    }
}

// 基础类目
const cateNameList = ref([])
const propsList = {
    lazy: true,
    lazyLoad (node, resolve) {
        const { level, data } = node
        setTimeout(async () => {
            const res = await queryCategory(level + 1, level > 0 ? data.value : null)
            const nodes = res.map(item => {
                return {
                    label: item.name,
                    value: item.code,
                    level: item.level,
                    leaf: level >= 3
                }
            })
            resolve(nodes)
            console.log(nodes, 'nodes')
        }, 1000)
    }
}

// 查询商品渠道
const getQudaoList = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001005'
        },
        appKey: 'A1001000',
        busiCode: 'A1001005',
        configCode: 'UC1658564001352htiW2',
        name: '查询商品渠道接口',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    const newArr = []
    const obj = {}
    for (let i = 0; i < res.list.length; i++) {
        if (!obj[res.list[i].skuChannelId]) {
            obj[res.list[i].skuChannelId] = res.list[i].skuChannelId
            newArr.push(res.list[i])
        }
    }
    dataState.qudaoList = newArr
    console.log(dataState.qudaoList)
}
const twoList = ref([])
const channelType = ref({})
const changeFirstChannel = (item) => {
    ruleForm.value.channelType = item.skuChannelId
    ruleForm.value.secondChannel = ''
    getTwoList(item.skuChannelId)
}
const getTwoList = async (val) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001005',
            firstChannelName: val
        },
        appKey: 'A1001000',
        busiCode: 'A1001005',
        configCode: 'UC1658564001352htiW2',
        name: '查询商品渠道接口',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    const newArr = []
    const obj = {}
    for (let i = 0; i < res.list.length; i++) {
        if (!obj[res.list[i].skuChannelId]) {
            obj[res.list[i].skuChannelId] = res.list[i].skuChannelId
            newArr.push(res.list[i])
        }
    }
    twoList.value = newArr.map(item => {
        return {
            secondChannel: item.secondChannelId,
            ...item
        }
    })
    console.log(twoList.value)
    channelType.value = dataState.qudaoList.find(item => item.firstChannelName === val)
}

const changeSecondChannel = (item) => {
    ruleForm.value.secondChannelId = item.secondChannelId
}

const rules = reactive({
    skuName: [
        { required: true, message: '请输入商品名称', trigger: 'blur' }
    ],
    channelType: [
        { required: true, message: '请选择一级渠道', trigger: 'change' }
    ],
    secondChannelId: [
        { required: true, message: '请选择二级渠道', trigger: 'change' }
    ],
    isNewCustomer: [
        { required: true, message: '请选择新人SKU', trigger: 'change' }
    ],
    busiCatesList: [
        { type: 'array', required: true, message: '请选择应用类目', trigger: 'change' }
    ],
    salePrice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
    inventory: [{ required: true, message: '请输入库存', trigger: 'blur' }]

})
//
</script>
<style lang="scss" scoped>
.apply-active-box {
    :deep(.el-dialog__body) {
        max-height: 600px;
        overflow-y: scroll;
    }
    .form-action-item-50w {
        width: 50%;
    }
    .form-action-item-100w {
        width: 100%;
    }
    .dividing-head {
        margin-left: 50px;
        line-height: 50px;
    }
    span {
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        color: #606266;
        font-size: 14px;
    }
    .border-box {
        border: 1px solid #ccc;
        padding: 20px;
        margin-bottom: 10px;
    }
    .goods-list {
        padding: 20px;
        margin-left: 150px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
    }
    .form-text-btn {
        display: inline-block;
        margin-left: 5px;
        color: #fe2c55;
        cursor: pointer;
    }
    .flex-box {
        display: flex;
        justify-content:center div {
            flex: 1;
        }
    }
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 32x;
    height: 32px;
    text-align: center;
    border: 1px solid black;
}
</style>
