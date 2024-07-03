<template>
    <div class="lz-dialog">
        <el-dialog v-model="dialogVisible"  :before-close="handleClose" title="" width="50%">
            <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
                <el-form-item label="仓名称" prop="warehouseName">
                    <!-- <el-input v-model="form.warehouseName" placeholder="请输入仓名称"  :disabled="props.handleType === 'detail'"/> -->
                    <el-select v-model="form.warehouseObj"  placeholder="请选择仓名称" clearable  filterable
                               remote
                               reserve-keyword @change="getCode"  value-key="warehouseCode">
                        <el-option v-for="item in kuNameList" :key="item.warehouseCode" :label="item.warehouseName" :value="item"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓编号" prop="warehouseCode">
                    <el-input v-model="form.warehouseCode" placeholder="请输入仓编号"  :disabled="props.handleType === 'detail'"/>
                </el-form-item>
                <h3>城市信息</h3>
                <el-form-item label="省市区" prop="limitedCitys">
                    <el-cascader
                        ref="areaRef"
                        :props="goodsCannotSkuArea"
                        @change="skuAreaChange"
                        v-model="form.limitedCitys"
                        class="form-action-item-50w"
                        :collapse-tags="false"
                        show-all-levels
                        clearable
                        v-if="showArea === true"
                    />
                </el-form-item>

            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="submit(resetFormData)" v-if="props.handleType !== 'see'">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, toRefs, computed } from 'vue'
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
    warehouseCode: {
        type: String
    }
})
const dataList = ref([])
const dialogVisible = ref(props.visible)

onMounted(async () => {
    await getWarehouseName()
    if (props.handleType !== 'add') {
        await getDetail()
    }
})
// 表单数据
const form = ref({
    warehouseObj: {},
    warehouseCode: '',
    warehouseName: '',
    limitedCitys: []

})
const showArea = ref(true)
const getDetail = async () => {
    showArea.value = false
    const parm = {
        body: {
            warehouseCode: props.warehouseCode,
            appKey: 'A1001001',
            busiCode: 'A1001006'
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC61840004695572480',
        name: '仓覆盖范围详情',
        source: '采销系统'
    }
    const res = await getMerchantList(parm)
    form.value.warehouseCode = res.warehouseCode
    form.value.warehouseObj = { warehouseCode: res.warehouseCode, warehouseName: res.warehouseName }
    form.value.warehouseName = res.warehouseName
    limitedRegionList.value = res.locationRangeList
    res.locationRangeList.forEach(item => {
        const info = [item.provinceCode, item.cityCode]
        form.value.limitedCitys.push(info)
    })
    setTimeout(() => {
        showArea.value = true
    }, 200)
}

// 城市范围联动
const limitedRegionList = ref([])
const areaRef = ref(null)
const areaCheckedNodes = ref([])
const goodsCannotSkuArea = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await cityQueryCategory(level + 1, data.value || '')
        const nodes = res.map(item => {
            return {
                label: item.addressName,
                value: item.addressCode,
                level: item.level,
                leaf: level >= 1
            }
        })
        resolve(nodes)
    }
}

const skuAreaChange = (val) => {
    areaCheckedNodes.value = areaRef.value.getCheckedNodes(true)
    limitedRegionList.value = []
    areaCheckedNodes.value.forEach((item) => {
        limitedRegionList.value.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1]

        })
    })
}

// 库列表
const kuNameList = ref([])
const getWarehouseName = async (value) => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            status: 1,
            page: 1,
            rows: 99999

        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC61835295184240640',
        name: '库房主数据列表',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        kuNameList.value = res.data
    }
}
const getCode = (value) => {
    console.log(value, form.value.warehouseName)
    if (value) {
        form.value.warehouseCode = value.warehouseCode
        form.value.warehouseName = value.warehouseName
    }
}
const submit = async () => {
    const parm = {
        body: {
            warehouseCode: form.value.warehouseCode,
            warehouseName: form.value.warehouseName,
            locationRangeList: limitedRegionList.value,
            appKey: 'A1001001',
            busiCode: 'A1001006'
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        source: '采销系统'
    }
    if (props.handleType === 'add') {
        parm.configCode = 'UC61839462292373504'
        parm.name = '仓覆盖范围保存'
    } else {
        parm.configCode = 'UC61840303636201472'
        parm.name = '仓覆盖范围更新'
    }
    const res = await getMerchantList(parm)
    ElMessage.success('成功')
    await handleClose()
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
