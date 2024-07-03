<template>
    <div class='apply-goods-box'>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="auto">
            <h4 class='dividing-head'>GoodS基础信息</h4>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="商家" prop="merchantName" :rules="rules.name">
                        <el-select v-model="ruleForm.merchantName" @change="changName">
                            <el-option v-for="item in merchantNameList" :key="item.code" :label="item.name" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="选择标品">
                        <el-select>
                            <el-option v-for="item in thirdCateNameList" :key="item.name" :label="item.name" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="Goods分类" prop="CateNameList">
                        <!-- <el-input v-model="ruleForm.CateNameList"  controls-position="right" class="form-action-item-50w"/> -->
                        <span>{{ruleForm.firstCateName}}/{{ruleForm.secondCateName}}/{{ruleForm.thirdCateName}}/{{ruleForm.fourthCateName}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="Goods名称" prop="goodsName" :rules="rules.name">
                        <el-input v-model="ruleForm.goodsName"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="品牌名称" prop="brandName">
                        <el-input v-model="ruleForm.brandName"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h4 class='dividing-head'>GoodS基础属性</h4>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="销售渠道" prop="salesChannel">
                        <el-input v-model="ruleForm.basic.salesChannel"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品毛重（g）" prop="commodityGrossWeight">
                        <el-input v-model="ruleForm.basic.commodityGrossWeight"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品体积" prop="volume">
                        <el-input v-model="ruleForm.basic.volume"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="商品颜色" prop="color">
                        <el-input v-model="ruleForm.basic.color"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品净重" prop="netWeight">
                        <el-input v-model="ruleForm.basic.netWeight"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="长" prop="productLength">
                        <el-input v-model="ruleForm.basic.productLength"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="宽" prop="productWidth">
                        <el-input v-model="ruleForm.basic.productWidth"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="高" prop="productHeight">
                        <el-input v-model="ruleForm.basic.productHeight"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品规格" prop="commoditySpecification">
                        <el-input v-model="ruleForm.basic.commoditySpecification"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="供应商类型" prop="supplierType">
                        <el-input v-model="ruleForm.basic.supplierType"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发货方" prop="shipper">
                        <el-input v-model="ruleForm.basic.shipper"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="包装单位" prop="packagingUnit">
                        <el-input v-model="ruleForm.basic.packagingUnit"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="供应商全称" prop="supplierFullName">
                        <el-input v-model="ruleForm.basic.supplierFullName"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="箱柜管理" prop="boxSizeManagement">
                        <el-input v-model="ruleForm.basic.boxSizeManagement"  controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否批次管理" prop="isBatchManagement">
                        <el-radio-group v-model="ruleForm.basic.isBatchManagement" @change="radioC">
                            <el-radio :label="2">是</el-radio>
                            <el-radio :label="1" >否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <h4 class='dividing-head'>GoodS销售属性</h4>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="国产/进口" prop="domesticImported">
                        <el-input v-model="ruleForm.sales.domesticImported"  controls-position="right" class="form-action-item-50w" placeholder="中国"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产地" prop="commodityOrigin">
                        <el-input v-model="ruleForm.sales.commodityOrigin"  controls-position="right" class="form-action-item-50w" placeholder="浙江杭州"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保质期" prop="shelfLife">
                        <el-input v-model="ruleForm.sales.shelfLife"  controls-position="right" class="form-action-item-50w" placeholder="18个月"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="商品类型" prop="commodityType">
                        <el-input v-model="ruleForm.sales.commodityType"  controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产品形态" prop="productForm">
                        <el-input v-model="ruleForm.sales.productForm"  controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品条码" prop="sixnineBarcode">
                        <el-input v-model="ruleForm.sales.sixnineBarcode"  controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="储存条件" prop="storageConditions">
                        <el-input v-model="ruleForm.sales.storageConditions"  controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="口味" prop='taste'>
                        <el-input v-model="ruleForm.sales.taste"  controls-position="right" class="form-action-item-50w" placeholder="18个月"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="官方指导价" prop="officialGuidingPrice">
                        <el-input v-model="ruleForm.sales.officialGuidingPrice"  controls-position="right" class="form-action-item-50w" placeholder="18个月"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h4 class='dividing-head'>GoodS其他属性</h4>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="外部商品编号" prop="externalProductId">
                        <el-input v-model="ruleForm.goodsExtends.externalProductId"  controls-position="right" class="form-action-item-50w" placeholder=""/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="外部商品名称" prop="externalProductName">
                        <el-input v-model="ruleForm.goodsExtends.externalProductName"  controls-position="right" class="form-action-item-50w" placeholder="18个月"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否生成影子" prop='shadow'>
                        <el-radio-group v-model="ruleForm.shadow" @change="radioC">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0" >否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="margin_bottom_20" style="text-align:center">
            <el-button @click="submitForm('ruleForm')" type="primary">下一步</el-button>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, computed, watch, nextTick, onMounted, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getMerchantList } from '@/api/operate/index'

const router = useRouter()
const props = defineProps({
    toRuleForm: {
        type: Object,
        default: () => {}
    }
})
const emit = defineEmits(['next'])

watch(() => props.toRuleForm,
    (val) => {
        dataState.ruleForm = props.toRuleForm
    },
    {
        deep: true
    })

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => props.handleType === 'detail' || props.handleType === 'approval')

// const handleType = ref(props.handleType)
const ruleFormRef = ref(null)
const dataState = reactive({
    ruleForm: props.toRuleForm,
    merchantNameList: []

})
const { ruleForm, merchantNameList } = toRefs(dataState)

onMounted(async () => {
    await getMerchantName()
    await getSpuName()
})
// 表单项规则
const rules = reactive({
    inputRule: [{ required: true, message: '请输入', trigger: 'change' }],
    selectRule: [{ message: '请选择~', trigger: 'change' }],
    termType: [{ required: true, message: '请选择~', trigger: 'change' }],
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
    ]
})

if (props.handleType !== 'add') {
    // getsingleData()
}

const getMerchantName = async () => {
    const params = {
        body: {
            businessCode: 'A1001001',
            // merchantName:'',
            page: 1,
            pageSize: 9999,
            appKey: 'A1001000',
            busiCode: 'A1001001',
            sceneCode: '1',
            functionCode: 'functionCode',
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1657588823142wNsGY',
        name: '获取商户信息列表',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    dataState.merchantNameList = data.list.map(item => {
        return {
            code: item.busiMerchantId,
            name: item.merchantName
        }
    })
}
const getSpuName = async () => {
    const params = {
        body: {
            businessCode: 'A1001001',
            page: 1,
            pageSize: 9999,
            appKey: 'A1001000',
            busiCode: 'A1001001',
            sceneCode: '1',
            functionCode: 'functionCode',
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1657692903781wCdeA',
        name: 'SPU分页列表',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    console.log(data)
    // dataState.spuNameList = data.list.map(item => {
    //     return {
    //         code: item.busiMerchantId,
    //         name: item.merchantName
    //     }
    // })
}
const getSpuDetail = async () => {
    const params = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001000',
            busiCode: 'A1001001',
            spuId: '123',
            spuTemplate: '122'

        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1657692903781wCdeA',
        name: 'SPU分页列表',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
}
const changName = (val) => {

}
// 提交表单
const submitForm = (formName) => {
    emit('next', 2, dataState.ruleForm)
}

const goBack = () => {
    router.go(-1)
}
</script>
<style lang="scss" scoped>
    .apply-goods-box{
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
