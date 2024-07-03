<template>
    <div class="lz-dialog">
        <el-dialog v-model="dialogVisible"  :before-close="handleClose" title="" width="80%">
            <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true" >
                <el-form-item label="库房编号" prop="warehouseCode" :rules="rules.warehouseCode">
                    <el-input v-model="form.warehouseCode" placeholder="请输入库房编号"  :disabled="props.handleType!=='add'" />
                </el-form-item>
                <el-form-item label="库房名称" prop="warehouseName">
                    <el-input v-model="form.warehouseName" placeholder="请输入库房名称" :disabled="props.handleType === 'detail'"/>
                </el-form-item>
                <el-form-item label="大类" prop="bigCategory">
                    <el-select v-model="form.bigCategory"   clearable placeholder="请选择大类" :disabled="props.handleType === 'detail'">
                        <el-option label="城市仓" :value="2" />
                        <el-option label="中心仓" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="基本类型" prop="basicType">
                    <el-select v-model="form.basicType"    clearable placeholder="请选择基本类型" :disabled="props.handleType === 'detail'">
                        <el-option label="商品综合仓" :value="1" />
                        <el-option label="设备仓" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="省市区" prop="limitedCitys">
                    <el-cascader
                        ref="areaRef"
                        :props="goodsCannotSkuArea"
                        @change="skuAreaChange"
                        v-model="form.limitedCitys"
                        class="form-action-item-50w"
                        :collapse-tags="false"
                        show-all-levels
                        :disabled="props.handleType === 'detail'"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="详细地址" prop="detAddress">
                    <el-input v-model="form.detAddress" placeholder="请输入详细地址" :disabled="props.handleType === 'detail'"/>
                </el-form-item>
                <el-form-item label="联系人" prop="contacter">
                    <el-input v-model="form.contacter" placeholder="请输入联系人" :disabled="props.handleType === 'detail'"/>
                </el-form-item>
                <el-form-item label="联系方式" prop="contacterMobile">
                    <el-input v-model="form.contacterMobile" placeholder="请输入联系方式" :disabled="props.handleType === 'detail'"/>
                </el-form-item>
                <el-form-item label="拓展属性" prop="ownership">
                    <el-select v-model="form.ownership"    clearable placeholder="请选择拓展属性"  :disabled="props.handleType === 'detail'">
                        <el-option label="自营仓" :value="1" />
                        <el-option label="三方仓" :value="2" />
                    </el-select>
                </el-form-item>

            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="submit(resetFormData)" v-if="props.handleType !== 'detail'">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'
import { cityQueryCategory } from '@/utils'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
const store = useStore()
const formRef = ref(null)
const userInfo = computed(() => store.state.userInfo)
const props = defineProps({
    visible: {
        type: Boolean
    },
    handleType: {
        type: String
    },
    id: {
        type: Number
    }
})
const dataList = ref([])
const dialogVisible = ref(props.visible)

// 表单数据
const form = ref({
    warehouseCode: '',
    warehouseName: '',
    bigCategory: '',
    basicType: '',
    detAddress: '',
    contacter: '',
    contacterMobile: '',
    ownership: '',
    limitedCitys: [],
    provinceCode: '',
    provinceName: '',
    cityCode: '',
    cityName: '',
    countyCode: '',
    countyName: ''

})
onMounted(async () => {
    if (props.handleType !== 'add') {
        await getDetail()
    }
})
// 表单项规则
const rules = reactive({
    warehouseCode: [
        { required: true, message: '请输入仓编号', trigger: 'blur' },
        { pattern: /^[A-Za-z0-9]{4,18}$/, required: true, message: '请输入正确格式的仓编号', trigger: 'blur' }
    ]

})
const getDetail = async () => {
    const parm = {
        body: {
            id: props.id,
            appKey: 'A1001001',
            busiCode: 'A1001006'
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC61837514424041472',
        name: '库房主数据详情',
        source: '采销系统'
    }
    const res = await getMerchantList(parm)
    form.value = res
    form.value.limitedCitys = [res.provinceCode, res.cityCode, res.countyCode]
}

// 城市范围联动
const limitedRegionList = ref([])
const areaRef = ref(null)
const areaCheckedNodes = ref([])
const goodsCannotSkuArea = {
    lazy: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await cityQueryCategory(level + 1, data.value || '')
        const nodes = res.map(item => {
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
    areaCheckedNodes.value = areaRef.value.getCheckedNodes(true)
    areaCheckedNodes.value.forEach((item) => {
        form.value.provinceCode = item.pathValues[0]
        form.value.provinceName = item.pathLabels[0]
        form.value.cityCode = item.pathValues[1]
        form.value.cityName = item.pathLabels[1]
        form.value.countyCode = item.pathValues[2]
        form.value.countyName = item.pathLabels[2]
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

// 保存
const submit = async () => {
    const parm = {
        body: {
            ...form.value,
            appKey: 'A1001001',
            busiCode: 'A1001006'
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        source: '采销系统'
    }
    if (props.handleType === 'add') {
        parm.configCode = 'UC61837049451888640'
        parm.name = '库房主数据保存'
    } else {
        parm.configCode = 'UC61837915022016512'
        parm.name = '库房主数据更新'
    }
    const res = await getMerchantListCode(parm)
    if (res.code === '200') {
        ElMessage.success('成功')
        handleClose()
    }
}
const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
    emit('fevent')
}

</script>
<style lang="scss" scoped>
.text-style{
    font-size: 30px;
    text-align: center;
}
</style>
