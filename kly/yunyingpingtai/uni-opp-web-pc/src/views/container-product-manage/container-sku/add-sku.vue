<template>
    <div class="apply-active-box">
        <h3 class="dividing-head">编辑sku信息</h3>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="auto" :inline="true">
            <el-form-item label="商品编号">
                <el-input v-model="ruleForm.skuId" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="基础类目">
                <el-input v-model="ruleForm.cateName" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="品牌名称" prop="brandName">
                <el-input v-model="ruleForm.brandName" controls-position="right" :disabled="noCan"/>
            </el-form-item><br />
            <el-form-item label="商品名称">
                <el-input v-model="ruleForm.skuName" controls-position="right" />
            </el-form-item>
            <el-form-item label="保质期天数" prop="shelfLifeDays">
                <el-input v-model="ruleForm.shelfLifeDays" controls-position="right" />
            </el-form-item>
            <el-form-item label="生产日期" prop="gtmOutput">
                <el-date-picker v-model="ruleForm.gtmOutput"  type="datetime" placeholder="请选择日期" value-format="YYYY-MM-DD HH:mm:ss"/>
            </el-form-item>
            <el-form-item label="一级渠道">
                <el-select v-model="ruleForm.firstChannelName" clearable placeholder="请选择一级渠道" collapse-tags collapse-tags-tooltip @change="changeFirstChannel" style="margin-right: 10px;">
                    <el-option v-for="el in qudaoList" :label="el.firstChannelName" :value="el.firstChannelName" :key="el.firstChannelName" />
                </el-select>
                <el-select v-model="ruleForm.secondChannel" clearable placeholder="请选择二级渠道" collapse-tags collapse-tags-tooltip>
                    <el-option v-for="el in twoList" :label="el.secondChannelName" :value="el.secondChannel" :key="el.secondChannel" />
                </el-select>
            </el-form-item>
            <el-form-item label="生产批次号">
                <el-input v-model="ruleForm.skuBatchNo" controls-position="right" />
            </el-form-item><br />
            <el-form-item label="活动商品">
                <el-radio-group v-model="ruleForm.isMarketSku">
                    <el-radio :label="1" >是</el-radio>
                    <el-radio :label="0" >否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="新人SKU" prop='isNewCustomer'>
                <el-radio-group v-model="ruleForm.isNewCustomer">
                    <el-radio :label="1" >是</el-radio>
                    <el-radio :label="0" >否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="售后服务">
                <el-select v-model="ruleForm.afterSaleService" clearable placeholder="无" collapse-tags collapse-tags-tooltip>
                    <el-option label="无" :value="0"/>
                    <el-option label="支持7天无理由退货" :value="1"/>
                    <el-option label="无忧退货" :value="2"/>
                </el-select>
            </el-form-item>
            <el-form-item label="应用类目" v-if="ruleForm.thirdCateCode !== ''">
                <el-cascader
                    ref="applyClassifyRef"
                    :props="skuApplyClassify"
                    v-model="busiCatesList"
                    @change="applyClassifyChange"
                    :collapse-tags="true"
                    clearable
                />
            </el-form-item>
            <el-form-item label="sku不可配送范围">
                <!-- <el-row :gutter="24" >
                    <el-col :span="5">
                        <el-select v-model="ruleForm.provinceCode" clearable placeholder="省份" collapse-tags collapse-tags-tooltip @change="changeCity">
                            <el-option v-for="el in provincesList" :label="el.addressName" :value="el.addressCode" :key="el.addressCode" /> </el-select
                        ></el-col>
                    <el-col :span="5">
                        <el-select v-model="ruleForm.cityCode" clearable placeholder="城市" collapse-tags collapse-tags-tooltip @change="changecounty">
                            <el-option v-for="el in cityList" :label="el.addressName" :value="el.addressCode" :key="el.addressCode" /> </el-select
                        ></el-col>
                    <el-col :span="5">
                        <el-select v-model="ruleForm.countyCode" clearable placeholder="区县" collapse-tags collapse-tags-tooltip @change="changeThirdcounty">
                            <el-option v-for="el in countyList" :label="el.addressName" :value="el.addressCode" :key="el.addressCode" /> </el-select
                        ></el-col>
                    <el-col :span="4">
                        <el-button text type="primary" @click="addcity">添加</el-button>
                    </el-col>
                    <el-col :span="24">
                        <div style="width: 300px; height: 200px; border: 1px solid black; margin-top: 10px">
                            <el-row :gutter="20" v-for="item in limitedRegionList" :key="item">
                                <el-col :span="13">
                                    <div>{{item.provinceName}}/{{item.cityName}}/{{item.countyName}}</div>
                                </el-col>
                                <el-col  :span="6">
                                    <el-button text type="primary" @click="detali(index)">删除</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    请选择不可配送范围
                </el-row> -->
                <el-cascader
                    ref="areaRef"
                    :props="goodsCannotSkuArea"
                    @change="skuAreaChange"
                    v-model="limitedCitys"
                    class="form-action-item-50w"
                    v-if="showArea"
                    :collapse-tags="true"
                    clearable
                />
            </el-form-item>

            <h3 class="dividing-head">SKU其他信息</h3>
            <el-form-item label="商品颜色" prop='skuColour'>
                <el-input v-model="ruleForm.skuColour" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="包装方式" prop="packagingMethod">
                <el-input v-model="ruleForm.packagingMethod" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <!-- <el-form-item label="是否小规格" prop="isSmallSpecification">
                <el-input v-model="ruleForm.isSmallSpecification" controls-position="right" :disabled="noCan"/>
            </el-form-item> -->
            <el-form-item label="商品毛重(g)" prop='productWeight'>
                <el-input v-model="ruleForm.productWeight" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="商品体积(mm3)" prop="productVolume">
                <el-input v-model="ruleForm.productVolume" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="宽(mm)" prop="productWidth">
                <el-input v-model="ruleForm.productWidth" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="存储方式" prop="storageMethod">
                <el-input v-model="ruleForm.storageMethod" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="长(mm)" prop="productLength">
                <el-input v-model="ruleForm.productLength" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="高(mm)" prop="productHeight">
                <el-input v-model="ruleForm.productHeigh" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="口味" prop="taste">
                <el-input v-model="ruleForm.taste" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="包装规格" prop="packagingSpecification">
                <el-input v-model="ruleForm.packagingSpecification" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-form-item label="容量" prop="capacity">
                <el-input v-model="ruleForm.capacity" controls-position="right" :disabled="noCan"/>
            </el-form-item>
            <el-col  :span="8">
                <el-form-item label="缩略图">
                    <template #thumbnail>
                        <!-- <img :src="ruleForm.thumbnail" alt="" style="width: 100px" /> -->
                        <img v-for="(item, index) in ruleForm.thumbnail" :src="item" :key="index">
                    </template>
                </el-form-item>
            </el-col>
            <div style="width: 200px; margin: 0 auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="modify(ruleForm)">确定</el-button>
            </div>
        </el-form>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, computed, onMounted, watch } from 'vue'
import SystemList from '@/composables/TablePagination/table.vue'
import { applyPromoList, applyDetail, applyEdit, applySubmit } from '@/api/marketing/active'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { yingyongQueryCategory, queryCategory } from '@/utils'
import { getMerchantList, skuDetails, skuModify, skuCreate, skuMap, oneLevel, twoLevel } from '@/api/operate/index'

const router = useRouter()
const props = defineProps(['skuId', 'merchantCode'])
const noCan = ref(true)

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => props.handleType === 'detail' || props.handleType === 'approval')

//

const ruleForm = ref({
    //  商家名称   成本价 没有字段
    cerType: '',
    skuId: '', // 商品编号
    fourthCateName: '', // 基础类目
    brandName: '', // 品牌名称
    salePrice: '', // 售卖价
    firstChannelName: '', // 一级渠道
    secondChannel: '', // 二级渠道
    gtmOutput: '', // 生产日期
    shelfLifeDays: '', // 保质期天数
    manufacturer: '', // 生产企业名称
    manufacturerAddress: '', // 生产企业地址
    manufacturerZipcode: '', // 生产企业邮编
    tags: '', // sku标签
    busiCates: '', // 应用类目
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
    city: '',
    county: '',
    resource: '是',
    cateName: '',
    thumbnail: []
})
const cateNameTextList = ref([])
const dataState = reactive({
    // 一级类目
    firstCateNameList: [],
    secondCateNameList: [],
    thirdCateNameList: [],
    qudaoList: [],
    busiCatesList: [],
    limitedCitys: [],
    areaCheckedNodes: [],
    showArea: true

})
const { firstCateNameList, secondCateNameList, thirdCateNameList, qudaoList, busiCatesList, limitedCitys, showArea } = toRefs(dataState)

onMounted(async () => {
    // await getSkuMap()
    await getOneLivel()
    await getQudaoList()
    await getSkuDetails()
})
const tages = ref([])
const busiCates = ref([])

// 一级渠道接口请求
const oneList = ref([])
const getOneLivel = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002'
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
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
            busiCode: 'A1001002',
            skuId: props.skuId
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC15115376431964160',
        name: 'sku详情页查询V2',
        source: '商品中台'
    }
    const res = await skuDetails(params)
    Object.assign(ruleForm.value, res)
    cateNameTextList.value = res.busiCates ? res.busiCates : []
    limitedRegionList.value = res.limitedRegionList ? res.limitedRegionList : []
    ruleForm.value.cateName = res.busiFirstCateName ? res.busiFirstCateName + '/' + res.busiSecondCateName + '/' + res.busiThirdCateName + '/' + res.busiFourthCateName : res.busiSecondCateName + '/' + res.busiThirdCateName + '/' + res.busiFourthCateName
    res.busiCates.forEach(item => {
        const catesInfo = [item.busiFirstCateCode, item.busiSecondCateCode]
        dataState.busiCatesList.push(catesInfo)
    })
    if (res.limitedRegionList) {
        res.limitedRegionList.forEach(item => {
            const cityInfo = [item.provinceCode, item.cityCode, item.countyCode]
            dataState.limitedCitys.push(cityInfo)
        })
    }

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
            busiCode: 'A1001004'
        },
        appKey: 'A1001001',
        busiCode: 'A1001004',
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
        console.log(data, 'noededata')
        setTimeout(async () => {
            const res = await yingyongQueryCategory(level + 1, data.value || '')
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
    dataState.applyClassifyCheckedNodes = applyClassifyRef.value.getCheckedNodes(true)
    dataState.applyClassifyCheckedNodes.forEach((item) => {
        cateNameTextList.value.push({
            busiFirstCateCode: item.pathValues[0],
            busiFirstCateName: item.pathLabels[0],
            busiSecondCateCode: item.pathValues[1],
            busiSecondCateName: item.pathLabels[1],
            busiThirdCateCode: item.pathValues[2],
            busiThirdCateName: item.pathLabels[2]
        })
    })
}

const detaliname = async (index) => {
    cateNameTextList.value.splice(index, 1)
}
// 点击确定修改页面
const modify = async () => {
    // 修改更新发起的请求
    const parm = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            skuName: ruleForm.value.skuName,
            skuId: ruleForm.value.skuId,
            ...ruleForm.value,
            channelType: channelType.value.channelType,
            secondChannelId: ruleForm.value.secondChannel,
            limitedRegionList: limitedRegionList.value,
            busiCates: cateNameTextList.value,
            gtmOutput: ruleForm.value.gtmOutput.replace('T', ' ')

        },
        appKey: 'A1001001',
        busiCode: 'A1001004',
        configCode: 'UC1657692763793NMkqp',
        name: 'sku更新',
        source: '商品中台'
    }
    await getMerchantList(parm)
    ElMessage.success('成功')
    router.push({ name: 'sku-list' })
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
            busiCode: 'A1001001',
            brandName
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
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
            busiCode: 'A1001001'
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
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
}
const twoList = ref([])
const channelType = ref({})
const changeFirstChannel = (val) => {
    ruleForm.value.secondChannel = ''
    getTwoList(val)
}
const getTwoList = async (val) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            firstChannelName: val
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
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
    channelType.value = dataState.qudaoList.find(item => item.firstChannelName === val)
}
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
