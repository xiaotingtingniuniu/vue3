
<template>
    <!-- 型号能力配置 -->
    <div class="poduct-category-list">
        <div>型号能力配置</div>
        <el-card class="box-card" style="margin-top: 20px">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                ref="multipleTableRef"
                :isPage="false"
            >
                <template #operation="scope">
                    <div class="info">
                        <el-button type="primary" @click="usedcoupon(scope.row)" text>
                            查看
                        </el-button>
                    </div>
                </template>
            </system-list>
            <el-dialog v-model="dialogVisible" >

                <system-list
                    :tHead="tHead1"
                    :tableData="tableData1"
                    ref="multipleTableRef"
                >
                    <template #propType="scope">
                        <div class="info">
                            <span>型号</span>
                            <span v-if="scope">{{ scope.row.propType}}</span>
                        </div>
                    </template>

                    <template #dynamicVisualMachine="scope">
                        <div class="info">

                            <div v-if="scope.row.propName === '设备温度控制'">
                                <el-select :disabled="true" v-model="params.supportTemperatureControl" clearable placeholder="请选择">
                                    <el-option
                                        v-for="item in dataState.selectList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="scope.row.propName === '实时温度获取'">
                                <el-select :disabled="true" v-model="params.supportTemperatureObtain" clearable placeholder="请选择">
                                    <el-option
                                        v-for="item in dataState.selectList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="scope.row.propName === '温度异常预警'">
                                <el-select :disabled="true" v-model="params.supportTemperatureAlarm" clearable placeholder="请选择">
                                    <el-option
                                        v-for="item in dataState.selectList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="scope.row.propName === '设备支持温度层'">
                                <el-select :disabled="true" v-model="params.temperatureType" clearable placeholder="请选择">
                                    <el-option
                                        v-for="item in dataState.selectList1"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="scope.row.propName === '货柜sku上架数量上限'">
                                <el-input :disabled="true" type="text" v-model="params.skuQtyLimit" />
                            </div>
                            <div v-if="scope.row.propName === '货柜商品满载数'">
                                <el-input :disabled="true" type="text" v-model="params.skuKindLimit" />
                            </div>
                            <div v-if="scope.row.propName === '门数量'">
                                <el-select :disabled="true" v-model="params.doorSize" clearable placeholder="请选择">
                                    <el-option
                                        v-for="item in dataState.doorSizeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="scope.row.propName === '默认C端开门流程'">
                                <el-select :disabled="true" v-model="params.shoppingOpenProcess" clearable placeholder="请选择">
                                    <el-option
                                        v-for="item in dataState.selectList4"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>

                        </div>
                    </template>
                </system-list>

            </el-dialog>

        </el-card>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantListCode } from '@/api/operate/index'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const list = ref(null)
list.value = {}
const tableData1 = [
    { propName: '设备温度控制' },
    { propName: '实时温度获取' },
    { propName: '温度异常预警' },
    { propName: '设备支持温度层' },
    { propName: '货柜sku上架数量上限' },
    { propName: '货柜商品满载数' },
    { propName: '门数量' },
    { propName: '默认C端开门流程' }
]
const dialogVisible = ref(false)
const dataState = reactive({
    tableData: [],

    tableDataDetail: [],
    selectList: [
        {
            value: 0,
            label: '不支持'
        }, {
            value: 1,
            label: '支持'
        }
    ],
    doorSizeList: [
        {
            value: 1,
            label: 1
        },
        {
            value: 2,
            label: 2
        }
    ],
    selectList1: [
        {
            value: 0,
            label: '常温'
        }, {
            value: 1,
            label: '冷藏'
        }, {
            value: 2,
            label: '冷冻'
        }
    ],
    selectList4: [
        {
            value: 1,
            label: '一次授权开1门'
        },
        {
            value: 2,
            label: '一次授权开多门'
        },
        {
            value: 0,
            label: ''
        }
    ],
    temperatureType: Number(list?.value?.temperatureType),
    supportTemperatureObtain: Number(list?.value?.supportTemperatureObtain),
    supportTemperatureAlarm: Number(list?.value?.supportTemperatureAlarm),
    supportTemperatureControl: list?.value?.supportTemperatureControl,
    skuQtyLimit: Number(list?.value?.skuQtyLimit),
    skuKindLimit: Number(list?.value?.skuKindLimit),
    doorSize: Number(list?.value?.doorSize),
    shoppingOpenProcess: Number(list?.value?.shoppingOpenProcess)

})
const { tableData, selectList, selectList1, selectList4, doorSizeList, temperatureType } = toRefs(dataState)

// 表头
const tHead = [
    { align: 'center', tooltip: false, prop: 'productCateName', label: '产品类别名称', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'deviceTypeCode', label: '设备类型code', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'deviceTypeName', label: '设备类型名称', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'deviceModelCode', label: '设备型号code', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'deviceModelName', label: '设备型号名称', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'operation', label: '操作', minWidth: 100, slot: true }

]
// 表头
const tHead1 = [
    { align: 'center', type: 'index', label: '序号', minWidth: 150 },
    { align: 'center', tooltip: false, prop: 'propName', label: '字段名称', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'propType', label: '字段颗粒度', minWidth: 100, slot: true },
    { align: 'center', tooltip: false, prop: 'dynamicVisualMachine', label: '属性配置', minWidth: 100, slot: true }
]

const getTableList = async() => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002'
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC72746880810426368',
        name: '产品能力配置详情页',
        source: '运营中台'
    }
    // 联调时候打开
    const res = await getMerchantListCode(param)

    // 联调时候记得注释开始
    // const res = {
    //     code: '200',
    //     msg: '成功',
    //     data: [
    //         {
    //             productCateName: '动态视觉柜', // 产品类别名称
    //             deviceTypeCode: 'HBL', // 设备类型code
    //             deviceTypeName: '嗨便利', // 设备类型名称
    //             deviceModelCode: 'HBL', // 设备型号code
    //             deviceModelName: '嗨便利' // 设备型号名称
    //         },
    //         {
    //             productCateName: 'meizhi2', // 产品类别名称
    //             deviceTypeCode: 'meizhi-youping', // 设备类型code
    //             deviceTypeName: '美智无屏', // 设备类型名称
    //             deviceModelCode: '设备型号code', // 设备型号code
    //             deviceModelName: '美智有屏' // 设备型号名称
    //         },
    //         {
    //             productCateName: '动态视觉柜', // 产品类别名称
    //             deviceTypeCode: 'XC_338_QCOM', // 设备类型code
    //             deviceTypeName: '自研338QCOM', // 设备类型名称
    //             deviceModelCode: 'XC-338QCOM-DG01', // 设备型号code
    //             deviceModelName: '338冷藏柜高配-QCOM' // 设备型号名称
    //         }
    //     ]
    // }

    if (+res?.code === 200) {
        dataState.tableData = res.data || []
    } else {
        ElMessage({
            message: res.message,
            type: 'error'
        })
    }
    // 联调时候记得注释开始
}
// 点击查看
// const usedcoupon = async (row) => {
//     router.push({
//         name: 'model-capability-tag',
//         query: {
//             productCateName: row?.productCateName,
//             deviceTypeCode: row?.deviceTypeCode,
//             deviceTypeName: row?.deviceTypeName,
//             deviceModelCode: row?.deviceModelCode,
//             deviceModelName: row?.deviceModelName
//         }
//     })
// }
// const usedcoupon = async (row) => {
//     router.push({
//         name: 'model-capability-tag',
//         params: {
//             productCateName: row?.productCateName,
//             deviceTypeCode: row?.deviceTypeCode,
//             deviceTypeName: row?.deviceTypeName,
//             deviceModelCode: row?.deviceModelCode,
//             deviceModelName: row.deviceModelName,
//             temperatureType: row?.temperatureType,
//             supportTemperatureObtain: row?.supportTemperatureObtain,
//             supportTemperatureAlarm: row?.supportTemperatureAlarm,
//             supportTemperatureControl: row?.supportTemperatureControl,
//             skuQtyLimit: row?.skuQtyLimit,
//             skuKindLimit: row?.skuKindLimit,
//             doorSize: row.doorSize,
//             shoppingOpenProcess: row?.shoppingOpenProcess
//         }
//     })
// }
// 点击查看
const params = {}
const usedcoupon = async (row) => {
    dataState.temperatureType = row.temperatureType
    dialogVisible.value = true
    Object.keys(row).forEach(item => {
        params[item] = row[item]
    })
    console.log(params.temperatureType, 'dasd')
}
getTableList()

</script>
<style lang='scss' scoped></style>
