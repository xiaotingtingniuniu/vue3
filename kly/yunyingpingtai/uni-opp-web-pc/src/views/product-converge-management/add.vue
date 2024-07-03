<template>
    <div class="spu-edit-box add-cover-management">
        <el-col :span="16">
            <div class='box-title'>请选择基础类目</div>
            <el-row :gutter="20">
                <el-col :span="5" class="cate-Name">
                    <el-select v-model="selectData.firstCateName" class="m-2" placeholder="请选择一级类目" :disabled="(route.query.type === 'edit'|| route.query.type === 'cat') ? true : false"  @change='changeFirst'>
                        <el-option v-for="item in firstCateNameList" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="selectData.secondCateName" :disabled="(route.query.type === 'edit'|| route.query.type === 'cat') ? true : false" class="m-2" placeholder="请选择二级类目" @change="changeSeccond">
                        <el-option v-for="item in secondCateNameList" :key="item.code" :label="item.name" :value="item.code"/>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="selectData.thirdCateName" class="m-2" placeholder="请选择三级类目" :disabled="(route.query.type === 'edit'|| route.query.type === 'cat') ? true : false" @change="changeThird">
                        <el-option v-for="item in thirdCateNameList" :key="item.name" :label="item.name" :value="item.code" />
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="selectData.fourCateName" class="m-2" :disabled="(route.query.type === 'edit'|| route.query.type === 'cat') ? true : false" placeholder="请选择四级类目" @change="changeFour">
                        <el-option v-for="item in fourCateNameList" :key="item.name" :label="item.name" :value="item.code" />
                    </el-select>
                </el-col>
            </el-row>
        </el-col>

        <div>
            <!-- <el-col :span="16">
                <div class='box-title'>标品重要属性</div>
                <el-row :gutter="20">
                    <el-col :span="20" class="cate-Name">

                        <el-select v-model="category.spuTemplateName" clearable placeholder="请选择">
                            <el-option
                                v-for="item in tablist"
                                :key="item.spuTemplate"
                                :label="item.tabname"
                                :value="item.spuTemplate"
                            />
                        </el-select>
                    </el-col>
                </el-row>
            </el-col> -->
            <div class='box-title'>标品重要属性</div>
            <el-form :disabled="(route.query.type === 'edit'|| route.query.type === 'cat') ? true : false" ref="formRef" :model="selectStstusData" :inline="true" label-position="left" label-width="130px">
                <el-form-item label="属性模板" prop="spuTemplateName">
                    <el-select v-model="selectStstusData.spuTemplateName" clearable placeholder="请选择">
                        <el-option
                            v-for="item in tablist"
                            :key="item.spuTemplate"
                            :label="item.tabname"
                            :value="item.spuTemplate"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-col :span="16">
                <div class='box-title'>标品重要属性</div>
                <el-row :gutter="20">
                    <el-col :span="20" class="cate-Name">
                        <el-checkbox-group v-model="checkedProducts" :disabled="route.query.type === 'cat' ? true : false">
                            <el-checkbox
                                v-for="el in products"
                                :label="el.attrCode"
                                :value="el.attrCode"
                                :key="el.attrCode"
                            >{{ el.attrName }}</el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-row>
            </el-col>
        </div>
        <div>
            <el-col :span="16">
                <div class='box-title'>扩展&补充属性</div>
                <el-row :gutter="20">
                    <el-col :span="20" class="cate-Name">
                        <el-checkbox-group v-model="checkedExtends">
                            <el-checkbox
                                :disabled="route.query.type === 'cat' ? true : false"
                                v-for="el in extendsProList"
                                :label="el.attrCode"
                                :value="el.attrCode"
                                :key="el.attrCode"

                            >{{ el.attrName }}</el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-row>
            </el-col>
        </div>

        <div>
            <el-col :span="16">
                <div class='box-title'>聚合规则状态</div>
                <el-row :gutter="20">

                    <el-col :span="20" class="cate-Name">
                        <el-form :disabled="route.query.type === 'cat' ? true : false" :model="selectStstusData" ref="formRef" :inline="true" label-position="left" label-width="130px">
                            <el-form-item prop="ruleStatus">
                                <el-select v-model="selectStatus" clearable placeholder="请选择">
                                    <el-option
                                        v-for="item in platformList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-col>
        </div>

        <!-- <el-button type="primary" @click="submitForm(formRef)">提交</el-button> -->
        <div class="btn">
            <el-button @click="goBack">关闭</el-button>
            <div class="btn-add-box">
                <el-button  v-if="!route.query.type" @click="submitForm(formRef)" type="primary">保存</el-button>
                <el-button v-if="route.query.type == 'edit'" @click="submitForm('edit')" type="primary">保存</el-button>

            </div>
        </div>
    </div>
</template>
<script setup>

import { reactive, ref, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMerchantListCode } from '@/api/operate/index'
import { queryCategory } from '@/utils'

const route = useRoute()

// const store = useStore()
// const eque = ref([])
// const userInfo = computed(() => store.state.userInfo)

const dataState = reactive({
    selectData: { // v-model 基础类目
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourCateName: ''
    },
    selectStstusData: {
        ruleStatus: 0, // 聚合状态
        spuTemplateName: '' // 属性模板

    },

    tablist: [
        {
            tabname: '乳饮咖啡',
            spuTemplate: 'coffee'
        },
        {
            tabname: '卤味熟食',
            spuTemplate: 'cooked_food'
        },
        {
            tabname: '乳制品',
            spuTemplate: 'dairy'
        },
        {
            tabname: '果汁饮料',
            spuTemplate: 'drink'
        },
        {
            tabname: '方便速食',
            spuTemplate: 'fast_food'
        },
        {
            tabname: '冰柜',
            spuTemplate: 'freezer'
        },
        {
            tabname: '果蔬类',
            spuTemplate: 'fruits_veg'
        },

        {
            tabname: '肉禽',
            spuTemplate: 'meat'
        },
        {
            tabname: '个人护理',
            spuTemplate: 'nursing'
        },

        {
            tabname: '主食面点',
            spuTemplate: 'pastry'
        },
        {
            tabname: '膨化食品',
            spuTemplate: 'puffed_food'
        },
        {
            tabname: '调味酱汁',
            spuTemplate: 'sauces'
        },

        {
            tabname: '海鲜水产',
            spuTemplate: 'seafood'
        },
        {
            tabname: '水饮',
            spuTemplate: 'water'
        }
    ],
    // 一级类目
    firstCateNameList: [],
    secondCateNameList: [],
    thirdCateNameList: [],
    fourCateNameList: [],

    platformList: [
        {
            value: 0,
            label: '停用'
        }, {
            value: 1,
            label: '启用'
        }
    ],

    tableData: [],

    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },

    list: {},
    category: {},
    // 规则状态
    selectStatus: 0,
    renderValue: {},
    addDialogVisible: false,
    editDialogVisible: false,
    productList: [],
    images: [],
    supplier: [],
    spread: [],
    commons: []
})
const list = ref(null)
const listData = ref(null)

const products = ref([]) // 标品重要属性
const extendsProList = ref([]) // 扩展
const checkedProducts = ref([])
const checkedExtends = ref([])

// list.value = {
//     code: '200',
//     data: [{
//         attrType: '1',
//         attrName: 'L1',
//         attrCode: '三级类目code2',
//         attrSort: '1'
//     }, {
//         attrType: '1',
//         attrName: 'L1',
//         attrCode: '三级类目code1',
//         attrSort: '1'
//     }, {
//         attrType: '4',
//         attrName: 'L1',
//         attrCode: '三级类目code3',
//         attrSort: '1'
//     }, {
//         attrType: '4',
//         attrName: 'L1',
//         attrCode: '三级类目code4',
//         attrSort: '1'
//     }]

// }
const { selectStstusData, category, renderValue, tablist, platformList, statusTempData, productList, images, supplier, selectStatus, spread, commons, selectData, spuFormData, initAddrData, spuFormDataAddr, spuFormData1, spuFormData21, spuFormData22, spuFormData23, spuFormData24, spuFormData3, chaildFormData, firstCateNameList, secondCateNameList, thirdCateNameList, fourCateNameList, goodsTypeList } = toRefs(dataState)
// 按基础类目层级查询类目
const selectFirst = ref({})
const selectSecond = ref({})
const selectThird = ref({})
const selectFour = ref({})
//  查看出来的全部数据
const spuDetailAll = ref({})

// const cateNameTextList = ref([])
const spuDetail = ref({})
// 获取基础类目，1,2,3,
const getfirstCateNameList = async () => {
    const res = await queryCategory(1)
    dataState.firstCateNameList = res
    console.log(dataState.firstCateNameList, '0001100')
}
const changeFirst = async (val) => {
    const res = await queryCategory(2, val)
    selectFirst.value = dataState.firstCateNameList.find(item => item.code === val)
    console.log(selectFirst.value, 'selectFirst')

    dataState.secondCateNameList = res
    dataState.thirdCateNameList = []
    dataState.fourCateNameList = []
    // 切换基础类目数据清空
    dataState.selectData.secondCateName = ''
    dataState.selectData.thirdCateName = ''
    dataState.selectData.fourCateName = ''
}
const changeSeccond = async (val) => {
    selectSecond.value = dataState.secondCateNameList.find(item => item.code === val)
    const res = await queryCategory(3, val)
    dataState.thirdCateNameList = res
    dataState.fourCateNameList = []
    dataState.selectData.thirdCateName = ''
    dataState.selectData.fourCateName = ''
}
const changeThird = async (val) => {
    selectThird.value = dataState.thirdCateNameList.find(item => item.code === val)
    const res = await queryCategory(4, val)
    dataState.fourCateNameList = res
    dataState.selectData.fourCateName = ''
}
const changeFour = async (val) => {
    selectFour.value = dataState.fourCateNameList.find(item => item.code === val)
}

// 初始化SPU详情
const initData = async (res) => {
    console.log(res, '0000')
    selectFirst.value = {
        name: res.firstCateName,
        code: res.firstCateCode
    }
    selectSecond.value = {
        name: res.secondCateName,
        code: res.secondCateCode

    }
    selectThird.value = {
        name: res.thirdCateName,
        code: res.thirdCateCode

    }
    selectFour.value = {
        name: res.fourthCateName,
        code: res.fourthCateCode
    }
    dataState.selectData = {
        firstCateName: res.firstCateName,
        secondCateName: res.secondCateName,
        thirdCateName: res.thirdCateName,
        fourCateName: res.fourthCateName
    }
    selectStatus.value = res.ruleStatus
    selectStstusData.value = {
        ruleStatus: res.ruleStatus, // 聚合状态
        spuTemplateName: res.spuTemplate // 属性模板
    }

    // products.value = mergeParams()
    // checkedProducts.value = spuDetailAll.value.spuMergeRuleDetails.map(item => item.attrCode)

    const ckProducts = spuDetailAll.value.spuMergeRuleDetails.filter(item => item.attrType === 1)
    checkedProducts.value = ckProducts.map(item => item.attrCode)

    const ckExtends = spuDetailAll.value.spuMergeRuleDetails.filter(item => item.attrType === 4)
    checkedExtends.value = ckExtends.map(item => item.attrCode)
}
// 查询SPU详情
const getSpuDetail = async () => {
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002',
            ruleCode: route.query.id
            // 接口入参
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC42974149141114880',
        name: '标品等级详情',
        url: '/goods/spu/merge/detail/v1',
        source: '商品中台'

    }

    const res = await getMerchantListCode(param)

    spuDetailAll.value = res.data
    await initData(res.data)
}
//
onMounted(async () => {
    await getfirstCateNameList()
    await getList()

    // await getSupplierList()
    if (route.query.type === 'edit' || route.query.type === 'cat') {
        await getSpuDetail()
    }
})

// 提交前数据校验
const dataCheck = () => {
    if (!selectFirst.value.code) {
        ElMessage.error('请选择一级类目！')
        return false
    } else if (!selectSecond.value.code) {
        ElMessage.error('请选择二级类目！')
        return false
    } else if (!selectThird.value.code) {
        ElMessage.error('请选择三级类目！')
        return false
    } else if (!selectStstusData.value.spuTemplateName.length) {
        ElMessage.error('请选择通用模板')
        return false
    } else {
        return true
    }
}
const mergeParams = () => {
    // 标品
    const pList = products.value.filter(item => checkedProducts.value.indexOf(item.attrCode) !== -1)
    // 扩展
    const exList = extendsProList.value.filter(item => checkedExtends.value.indexOf(item.attrCode) !== -1)
    console.log(pList, exList, 'exList')
    return pList.concat(exList)
}
// 提交
const submitForm = async (type) => {
    if (!dataCheck()) return
    console.log(mergeParams(), '00mergeParams()')

    const param1 = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002',
            thirdCateCode: selectThird.value.code,
            thirdCateName: selectThird.value.name,
            fourthCateCode: selectFour.value.code,
            fourthCateName: selectFour.value.name,
            ruleStatus: selectStatus.value,
            firstCateCode: selectFirst.value.code,
            firstCateName: selectFirst.value.name,
            secondCateCode: selectSecond.value.code,
            secondCateName: selectSecond.value.name,
            spuTemplate: selectStstusData.value.spuTemplateName,
            spuMergeRuleDetails: mergeParams()
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC42974804345925632',
        name: '商品聚合规则管理新增',
        url: '/goods/spu/merge/rule/add/v1',
        source: '商品中台'

    }
    const param2 = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002',

            ruleStatus: selectStatus.value,
            ruleCode: route.query.id,
            spuMergeRuleDetails: mergeParams()
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC42975006372966400',
        name: '商品聚合规则管理更新',
        url: '/goods/spu/merge/rule/modify/v1',
        source: '商品中台'

    }
    const param = (type === 'edit' || type === 'cat') ? param2 : param1
    const res = await getMerchantListCode(param)
    if (res.code === '200') {
        ElMessage({
            type: 'success',
            message: res.message
        })
        router.push({
            name: 'product-converge-rules'
        })
    }
}

const goBack = () => {
    router.go(-1)
}

// 获取列表
const getList = async () => {
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002',
            attrTypes: [1, 4]
            // 接口入参
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC42974426783068160',
        name: '标品聚合字段属性查询',
        url: '/goods/spu/merge/attr/list/v1',
        source: '商品中台'

    }
    // const res = list.value // 联调需要注释

    const res = await getMerchantListCode(param)
    if (res.code === '200' && res.data.length) {
        // listData.value = res.data

        // 拆分 - 分类
        const productVal = res.data.filter(item => Number(item.attrType) === 1)
        const extendsVal = res.data.filter(item => Number(item.attrType) === 4)

        products.value = productVal
        extendsProList.value = extendsVal
    }
}

</script>
<style lang="scss" scoped>
.rules-management{
    .box-card{
        border: initial;
        .search-area{
            .el-form{
                .el-form-item{
                    width: 250px;
                }
                .form-item-time{
                    :deep(.el-date-editor){
                        flex: 1;
                    }
                }
                .button-box{
                    width: 100%;
                    .el-button{
                        border: initial;
                    }
                }
            }
        }
        .page-area{
            display: flex;
            justify-content: center;
        }
    }
.mt70{
    margin-top: 30px;
}
.subject {
    .el-form-item{
        width: 100%;
    }
}
.flx {
    display: flex;
    justify-content: left ;
    align-items: center;

}
.ml50{
    margin-left: 50px;
}
.mb30 {
    margin-bottom: 30px;
}
 :deep(.el-card__body){
    padding-left: 100px;
}
    .category {
        padding-bottom: 45px;
        .title{
            // width: 100%;
        // margin-top: 50px;
    }
    .el-checkbox{
        margin-top: 40px;
    }
}
}

.spu-edit-box{
    margin: 30px;
    .box-title{
        font-size:20px;
        font-weight:700;
        margin: 20px 0;
        .el-upload{
            margin-left: 20px;
        }
        .cate-Name:before{
            content: "*";
            color: var(--el-color-danger);
            margin-right: 4px;
        }
    }
    .address-input-box{
        display: inline-block;
        .address-detail{
            margin-left: 10px;
            :deep(.el-input__inner){
                width: 300px;
            }
        }
    }
    .export-title{
        position: relative;
        .export-btns{
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .box-title-sm{
        font-size:14px;
        font-weight:600;
        margin-bottom: 20px;
        margin-left: 20px;
        color: #333;
    }
    .form-action-item-50w{
        :deep(.el-input){
            width: auto;
        }
    }
    .sel-cate-name{
        margin: 20px 0;
    }
    .header-title{
        font-size:20px;
        color:red;
        height:50px;
        font-weight:700;
        align-items:center
    }
}
.last-text{
    display: inline-block;
    margin-left: 18px;
}
h1{
    font-weight: 800;
    font-size: 30px;
    margin-bottom: 50px;
}
.btn{
    margin-top: 10px;
    display: flex;
    .btn-add-box{
        margin-left: 30px;
    }
    .btn-edit-box{
        margin-left: 30px;
    }
}

</style>
