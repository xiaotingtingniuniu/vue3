<template>
    <!-- <h1>表单提交组件</h1> -->
    <div class="lz-dialog">
        <el-dialog v-model="dialogVisible"  :before-close="handleClose" title="" width="80%">
            <el-form
                class="dia-form"
                ref="formRef"
                :model="chaildFormData"
                :inline="true"
                label-position="right"
                label-width="150px"
                style="margin: 0 auto"
                :rules="rules"
            >
                <h3 class="tit">{{props.title}}</h3>
                <template v-if="!elastic">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="一级应用类目名称" prop="busiFirstCateName" >
                                <el-input placeholder="请输入一级类目名称"  v-model.trim="chaildFormData.busiFirstCateName" :disabled="noCan"/>
                            </el-form-item>
                            <el-form-item label="二级应用类目名称" prop="busiSecondCateName">
                                <el-input placeholder="请输入二级类目名称" v-model.trim="chaildFormData.busiSecondCateName" :disabled="noCan"/>
                            </el-form-item>
                            <el-form-item label="三级应用类目名称" prop="busiThirdCateName">
                                <el-input placeholder="请输入三级类目名称" v-model.trim="chaildFormData.busiThirdCateName" :disabled="noCan"/>
                            </el-form-item>
                            <el-form-item label="使用状态" prop="isEnabled">
                                <el-select v-model="chaildFormData.isEnabled" placeholder="" disabled>
                                    <el-option label="启用" :value="1" />
                                    <el-option label="停用" :value="0" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="基础类目">
                                <el-cascader
                                    ref="basicLevelRef"
                                    :props="basicLevel"
                                    @change="basicLevelChange"
                                    v-model="dataState.basicLevelChecked"
                                    :disabled="noCan"
                                    filterable
                                    remote
                                    collapse-tags
                                    clearable
                                    v-if="basicLevelRefVisiable"
                                />
                            </el-form-item>
                            <!-- <h3>请选择基础类目</h3>
                            <el-row :gutter="20">
                                <el-col :span="5">
                                    <el-select v-model="selectData.firstCateName" class="m-2" placeholder="请选择" @change='changeFirst' :disabled="noCan">
                                        <el-option v-for="item in firstCateNameList" :key="item.code" :label="item.name" :value="item.code" />
                                    </el-select>
                                </el-col>
                                <el-col :span="5">
                                    <el-select v-model="selectData.secondCateName" class="m-2" placeholder="请选择二级类目" @change="changeSeccond" :disabled="noCan">
                                        <el-option v-for="item in secondCateNameList" :key="item.code" :label="item.name" :value="item.code"/>

                                    </el-select>
                                </el-col>
                                <el-col :span="5">
                                    <el-select v-model="selectData.thirdCateName" class="m-2" placeholder="请选择三级类目" @change="changeThird" :disabled="noCan">
                                        <el-option v-for="item in thirdCateNameList" :key="item.name" :label="item.name" :value="item.code" />
                                    </el-select>
                                </el-col>
                                <el-col :span="5" v-if="fourCateNameList.length>0" :disabled="noCan">
                                    <el-select v-model="selectData.fourCateName" class="m-2" placeholder="请选择四级类目" @change="changeFour">
                                        <el-option v-for="item in fourCateNameList" :key="item.name" :label="item.name" :value="item.code" />
                                    </el-select>
                                </el-col>
                                <el-col :span="4">
                                    <el-button text type="primary" @click="addCateName" :disabled="noCan">添加</el-button>
                                </el-col>
                            </el-row>
                            <h3>已选择的基础类目：</h3>
                            <el-row :gutter="20" v-for="item in CateNameTextList" :key="item">
                                <el-col :span="10">
                                    <div>{{item.firstCateName}}/{{item.secondCateName}}/{{item.thirdCateName}}/{{item.fourthCateName}}</div>
                                </el-col>
                                <el-col :span="6">
                                    <el-button text type="primary" @click="detali(index,item)" :disabled="noCan">删除</el-button>
                                </el-col>
                            </el-row> -->
                        </el-col>
                    </el-row>
                </template>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">取消 </el-button>
                    <el-button type="primary" @click="dialogSuccessDef()" :loading="submitLoading">确定</el-button>
                    <!-- <el-button type="primary" @click="dialogSuccessDef()" v-if="props.handleType === 'edit'">确定</el-button> -->
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, toRefs, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'
import { queryCategory, yingyongQueryCategory } from '@/utils'
import { ElMessageBox, ElMessage } from 'element-plus'

import { useStore } from 'vuex'
const store = useStore()
const formRef = ref(null)
const userInfo = computed(() => store.state.userInfo)
const basicLevelRef = ref(null)
const props = defineProps({
    visible: {
        type: Boolean
    },
    handleType: {
        type: String
    },
    id: {
        type: Number
    },
    title: {
        type: String
    },
    busiCode: {
        type: String
    }
})
const dialogVisible = ref(props.visible)
const noCan = ref(false)
onMounted(async () => {
    // await getfirstCateNameList()
    if (props.handleType !== 'add') {
        await getCateNameListDetail(props.id)
    }
})

const dataState = reactive({
    chaildFormData: {
        busiFirstCateName: '',
        busiSecondCateName: '',
        busiThirdCateName: '',
        isEnabled: 1
    },
    selectData: {
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourCateName: ''
    },
    // 一级类目
    firstCateNameList: [],
    secondCateNameList: [],
    thirdCateNameList: [],
    fourCateNameList: [],
    basicLevelChecked: [],
    cateList: [],
    basicLevelRefVisiable: true,
    submitLoading: false
})
const { firstCateNameList, secondCateNameList, thirdCateNameList, selectData, fourCateNameList, chaildFormData, basicLevelRefVisiable, submitLoading } = toRefs(dataState)
// 表单校验
const rules = reactive({
    busiFirstCateName: [
        { required: true, message: '请输入', trigger: 'change' }
    ],
    busiSecondCateName: [
        { required: true, message: '请输入', trigger: 'change' }
    ]
})
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
// 基础类目change
const basicLevelChange = (value) => {
    console.log(value)
    dataState.basicLevelCheckedNodes = basicLevelRef.value.getCheckedNodes(true)
    dataState.cateList = []
    dataState.basicLevelCheckedNodes.forEach((item) => {
        dataState.cateList.push({
            firstCateCode: item.pathValues[0],
            firstCateName: item.pathLabels[0],
            secondCateCode: item.pathValues[1],
            secondCateName: item.pathLabels[1],
            thirdCateCode: item.pathValues[2],
            thirdCateName: item.pathLabels[2],
            fourthCateCode: item.pathValues[3],
            fourthCateName: item.pathLabels[3]
        })
    })
}
// // 按基础类目层级查询类目
// const selectFirst = ref({})
// const selectSecond = ref({})
// const selectThird = ref({})
// const selectFour = ref({})
// const getfirstCateNameList = async () => {
//     const res = await queryCategory(1)
//     dataState.firstCateNameList = res
// }
// const changeFirst = async (val) => {
//     const res = await queryCategory(2, val)
//     selectFirst.value = dataState.firstCateNameList.find(item => item.code === val)
//     dataState.secondCateNameList = res
// }
// const changeSeccond = async (val) => {
//     selectSecond.value = dataState.secondCateNameList.find(item => item.code === val)
//     const res = await queryCategory(3, val)
//     dataState.thirdCateNameList = res
// }
// const changeThird = async (val) => {
//     selectThird.value = dataState.thirdCateNameList.find(item => item.code === val)
//     const res = await queryCategory(4, val)
//     dataState.fourCateNameList = res
// }
// const changeFour = async (val) => {
//     selectFour.value = dataState.fourCateNameList.find(item => item.code === val)
// }
// const CateNameTextList = ref([])
// // 添加展示文本
// const addCateName = async () => {
//     CateNameTextList.value.push({
//         firstCateName: selectFirst.value.name,
//         firstCateCode: selectFirst.value.code,
//         secondCateName: selectSecond.value.name,
//         secondCateCode: selectSecond.value.code,
//         thirdCateName: selectThird.value.name,
//         thirdCateCode: selectThird.value.code,
//         fourthCateName: selectFour.value.name,
//         fourthCateCode: selectFour.value.code
//     })
//     dataState.selectData.firstCateName = ''
//     dataState.selectData.secondCateName = ''
//     dataState.selectData.thirdCateName = ''
//     dataState.selectData.fourCateName = ''
//     selectFirst.value = {}
//     selectSecond.value = {}
//     selectSecond.value = {}
//     selectThird.value = {}
//     selectFour.value = {}
// }
// // 删除
// const detali = async (index, row) => {
//     console.log(index, row, '000')
//     CateNameTextList.value.splice(index, 1)
//     // if (props.handleType === 'edit') {
//     //     CateNameTextList.value.map((item) => {
//     //         item.deleted = 1
//     //         return{

//     //         }
//     //     })
//     // }
// }

// 确定
const dialogSuccessDef = async () => {
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: props.busiCode,
            ...dataState.chaildFormData,
            cateList: dataState.cateList
        },
        appKey: 'A1001001',
        busiCode: props.busiCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        modifierId: store.state.userInfo.account,
        operatorId: store.state.userInfo.account,
        operatorName: store.state.userInfo.name
    }
    formRef.value.validate(async (valid) => {
        if (valid) {
            if (props.handleType === 'add') {
                param.configCode = 'UC16576933794465rayV'
                param.name = '新增应用类目'
                param.source = '商品中台'
            } else {
                param.configCode = 'UC1657693405403anxvq'
                param.name = '修改应用类目'
                param.source = '商品中台'
            }
            const data = await getMerchantList(param)
            ElMessage.success('成功')
            emit('handleClose', props.visible)
            emit('fevent')
        }
    })
}

// 应用类目详情
const getCateNameListDetail = async (id) => {
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: props.busiCode,
            id: id

        },
        appKey: 'A1001001',
        busiCode: props.busiCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC16584093290419I1Cw',
        name: '应用类目详情',
        source: '商品中台',
        modifierId: store.state.userInfo.account,
        operatorId: store.state.userInfo.account,
        operatorName: store.state.userInfo.name
    }
    const data = await getMerchantList(param)
    // CateNameTextList.value = data.cateList
    Object.assign(dataState.chaildFormData, data)
    dataState.cateList = data.cateList
    data.cateList.forEach(item => {
        const catesInfo = [item.firstCateCode, item.secondCateCode, item.thirdCateCode, item.fourthCateCode]
        dataState.basicLevelChecked.push(catesInfo)
    })
    console.log(dataState.basicLevelChecked)
    dataState.basicLevelRefVisiable = false
    setTimeout(() => {
        dataState.basicLevelRefVisiable = true
    }, 100)
    // dataState.chaildFormData.
    // if (dataState.chaildFormData.isEnabled === 0) {
    //     noCan.value = true
    // }
}

const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
    emit('fevent')
}

</script>
<style lang="scss" scoped>
.lz-dialog{
    h3{
        line-height: 30px;
        padding: 0px 20px;
    }
}
</style>
