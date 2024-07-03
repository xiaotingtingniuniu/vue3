<template>
    <div class="rules-management">
        <!-- 标品等级规则管理 -->
        <el-card class="box-card">
            <div class="mt70 mb30">标品等级管理</div>

            <div class="search-area">
                <el-form  ref="formRef" :model="searchData" :inline="true" label-position="left" label-width="130px" :disabled="route.query.type==0 ?true: false">
                    <el-form-item label="标品等级" prop="level">
                        <el-select v-model="category.level" clearable placeholder="请选择" :disabled="true">
                            <el-option
                                v-for="item in platformList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <div class="level"> {{category.firstCateName}} -</div>
                        <div class="level"> {{category.secondCateName}} -</div>
                        <div class="level"> {{category.thirdCateName}} -</div>
                        <div class="level"> {{category.thirdCateName}}</div>
                    </el-form-item>

                </el-form>
            </div>
            <el-form ref="formRefs" :inline="true" :disabled="route.query.type == 0?true:false" class="subject">
                <el-form-item>
                    <div class="category">
                        <h3 class="title">{{getTitle(renderValue.frist)}}</h3>
                        <el-checkbox-group v-model="productList">
                            <el-checkbox
                                v-for="(item, index) in renderValue.frist"
                                :key="index"
                                :label="item.ruleDetailCode"
                                :disabled="!item.isEdit"
                                :checked="item.attrFlag === 1"
                            >{{ item.attrName }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="category">
                        <h3 class="title">{{getTitle(renderValue.second)}}</h3>

                        <el-checkbox-group v-model="images">
                            <el-checkbox
                                v-for="(item, index) in renderValue.second"
                                :key="index"
                                :label="item.ruleDetailCode"
                                :disabled="!item.isEdit"
                                :checked="item.attrFlag === 1"
                            >{{ item.attrName }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="category">
                        <h3 class="title">{{getTitle(renderValue.thrid)}}</h3>
                        <el-checkbox-group v-model="supplier">
                            <el-checkbox
                                v-for="(item, index) in renderValue.thrid"
                                :key="index"
                                :label="item.ruleDetailCode"
                                :disabled="!item.isEdit"
                                :checked="item.attrFlag === 1"
                            >{{ item.attrName }}</el-checkbox>
                        </el-checkbox-group>
                    </div>

                </el-form-item>
                <el-form-item>
                    <div class="category">
                        <h3 class="title">{{getTitle(renderValue.fourth)}}</h3>

                        <el-checkbox-group v-model="spread">
                            <el-checkbox
                                v-for="(item, index) in renderValue.fourth"
                                :key="index"
                                :label="item.ruleDetailCode"
                                :disabled="!item.isEdit"
                                :checked="item.attrFlag === 1"
                            >{{ item.attrName }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="category">
                        <div class="flx">
                            <h3 class="title">{{getTitle(renderValue.five)}}</h3>
                            <el-form  label-width="130px"> <el-form-item label="通用属性" prop="spuTemplateName">
                                <el-select v-model="category.spuTemplateName" clearable placeholder="请选择" disabled>
                                    <el-option
                                        v-for="item in tablist"
                                        :key="item.spuTemplate"
                                        :label="item.tabname"
                                        :value="item.spuTemplate"
                                    />
                                </el-select>
                            </el-form-item></el-form>

                        </div>
                        <el-checkbox-group v-model="commons">
                            <el-checkbox
                                v-for="(item, index) in renderValue.five"
                                :key="index"
                                :label="item.ruleDetailCode"
                                :disabled="!item.isEdit"
                                :checked="item.attrFlag === 1"
                            >{{ item.attrName }}</el-checkbox>
                        </el-checkbox-group>
                    </div>

                </el-form-item>
                <el-form-item>
                    <el-form>
                        <el-form-item>

                            <div>
                                <el-button type="primary" @click="goBack()">关闭</el-button>
                                <el-button v-if="route.query.type == 0 ?false: true" type="primary" @click="handleCatState">保存</el-button>
                            </div>
                        </el-form-item>

                    </el-form>

                </el-form-item>

            </el-form>
        </el-card>
    </div>
</template>
<script setup>

import { reactive, ref, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMerchantListCode } from '@/api/operate/index'
const route = useRoute()

const store = useStore()
const eque = ref([])
const userInfo = computed(() => store.state.userInfo)

const dataState = reactive({

    searchData: {
        ruleCode: '',
        level: '全部',
        thirdCateCode: '',
        fourthCateCode: ''
    },
    platformList: [
        {
            value: 'L1',
            label: 'L1'
        }, {
            value: 'L2',
            label: 'L2'
        }, {
            value: 'L3',
            label: 'L3'
        }
    ],

    tableData: [],

    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    tablist: [

        {
            tabname: '全部',
            spuTemplate: ''
        },
        {
            tabname: '方便食品',
            spuTemplate: 'fast_food'
        },

        {
            tabname: '日清用品',
            spuTemplate: 'sauces'
        },
        {
            tabname: '水饮',
            spuTemplate: 'water'
        },

        {
            tabname: '肉禽类',
            spuTemplate: 'meat'
        },
        {
            tabname: '果蔬类',
            spuTemplate: 'fruits_veg'
        }
    ],
    list: {},
    category: {},
    renderValue: {},
    addDialogVisible: false,
    editDialogVisible: false,
    productList: [],
    images: [],
    supplier: [],
    spread: [],
    commons: []
})

const { tableData, searchData, pageinfo, list, category, renderValue, platformList, productList, images, supplier, spread, commons } = toRefs(dataState)
onMounted(() => {
    getList()
})
const filterGroupByType = (data, type) => {
    if (!data) return
    const rst = data.filter((item) => {
        return item.attrType === type
    })

    return rst
}
const init = (val) => {
    const list = val
    const frist = filterGroupByType(list, 1) // 标品重要属性
    const second = filterGroupByType(list, 2)
    const thrid = filterGroupByType(list, 3)
    const fourth = filterGroupByType(list, 4)
    const five = filterGroupByType(list, 5)
    renderValue.value = { frist, second, thrid, fourth, five }
}

const getTitle = (val) => {
    if (!val) return ''
    if (val) {
        const type = val[0].attrType
        const vals = type === 1 ? '标品重要属性' : type === 2 ? '图片素材管理' : type === 3 ? '供应商发货地址信息' : type === 4 ? '扩展&补充属性' : type === 5 ? '通用&专用属性' : '其他'
        return vals
    }
}
const goBack = () => {
    router.go(-1)
}
/**
 * 提交前组织接口需要的数据
 * @param {*} allValue 该分类所有数据
 * @param {*} checkedVal 该分类下选择项
 */
const generatorSmtVal = (allValue, checkedVal) => {
    const smtValue = [] // 要提交的内容
    // 用户勾选中的项  label 绑定的就是 ruleDetailCode
    checkedVal.forEach((item) => {
        smtValue.push({
            attrFlag: 1,
            ruleDetailCode: item
        })
    })

    // 原先是勾选状态，用户取消勾选
    const unChecked = allValue.filter(item => checkedVal.indexOf(item.ruleDetailCode) === -1)
    unChecked.forEach((item) => {
        smtValue.push({
            attrFlag: 0,
            ruleDetailCode: item.ruleDetailCode
        })
    })
    return smtValue
}

const handleCatState = async (val) => {
    const productSmt = generatorSmtVal(renderValue.value.frist, productList.value)
    const imageSmt = generatorSmtVal(renderValue.value.second, images.value)
    const supplierSmt = generatorSmtVal(renderValue.value.thrid, supplier.value)
    const spreadSmt = generatorSmtVal(renderValue.value.fourth, spread.value)
    const commonSmt = generatorSmtVal(renderValue.value.five, commons.value)

    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002',
            ruleCode: route.query.id,
            spuLevelRuleDetails: [...productSmt, ...imageSmt, ...supplierSmt, ...spreadSmt, ...commonSmt]
            // 接口入参
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC38579812609908736',
        name: '标品等级更新',
        url: '/goods/spu/level/modify/v4',
        source: '商品中台'

    }

    const res = await getMerchantListCode(param)
    if (res.code === '200') {
        ElMessage({
            type: 'success',
            message: res.message
        })
        router.push({
            name: 'product-level-rules'
        })
    }
}

// 获取列表
const getList = async () => {
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002',
            ruleCode: route.query.id
            // 接口入参
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC38579516823396352',
        name: '标品等级详情',
        url: '/goods/spu/level/detail/v4',
        source: '商品中台'

    }

    const res = await getMerchantListCode(param)
    if (res.code === '200') {
        const { firstCateName, secondCateName, thirdCateName, fourthCateName, level, spuTemplateName } = res.data
        category.value = {

            firstCateName: firstCateName,
            secondCateName: secondCateName,
            thirdCateName: thirdCateName,
            fourthCateName: fourthCateName,
            level: level,
            spuTemplateName: spuTemplateName

        }

        init(res.data.spuLevelRuleDetails)
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
</style>
