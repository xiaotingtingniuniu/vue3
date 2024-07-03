<template>
    <!-- 基础属性配置 -->
    <div class="goods-tax-list">
        <div>基础属性配置</div>
        <el-card class="box-card" style="margin-top: 20px">
            <system-list
                :tHead="tHead"
                :tableData="dataState.selectList"
                ref="multipleTableRef"
                v-model:current-page="pageInfo.currPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #attrGranularity="scope">
                    <div class="info">
                        <el-select v-model="scope.row.attrGranularity" disabled placeholder="请选择">

                            <el-option
                                v-for="item in dataState.selectList"
                                :key="item.attrGranularity"
                                :label="item.attrGranularity===1?'全局':item.attrGranularity===2?'类别':item.attrGranularity===3?'型号':'-'"
                                :value="item.attrGranularity">
                            </el-option>

                        </el-select>

                    </div>
                </template>
            </system-list>
        </el-card>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantListCode } from '@/api/operate/index'
import { ElMessage } from 'element-plus'
import { promiseTimeout } from '@vueuse/core'

const dataState = reactive({
    tableData: [],
    selectList: []

})
const pageInfo = ref({
    total: null,
    currentPage: 1,
    pageSize: 10
})
const { tableData, options, selectList } = toRefs(dataState)
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getTableList()
}
// 当前也改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getTableList()
}
// 表头
const tHead = [
    { align: 'center', type: 'index', label: '序号', minWidth: 150 },
    { align: 'center', tooltip: false, prop: 'filedName', label: '字段名称', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'attrGranularity', label: '字段颗粒度', minWidth: 100, slot: true }
    // { align: 'center', tooltip: true, prop: 'userId', label: '推广人id', minWidth: 150 }
]
const defaultValue = ref(null)

const dealData = async (data) => {
    const arr = []
    Object.keys(data).forEach(ele => {
        switch (ele) {
        case 'doorSize':
            arr.push({
                filedName: '门数量',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'shoppingOpenProcess':
            arr.push({
                filedName: '默认C端开门流程',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'skuKindLimit':
            arr.push({
                filedName: '货柜商家sku数量上限',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'skuQtyLimit':
            arr.push({
                filedName: '货柜商品满载数',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'supportCameraAlarm':
            arr.push({
                filedName: '摄像头异常预警	',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'supportDoorLockAlarm':
            arr.push({
                filedName: '门锁异常预警',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'supportDoorLockState':
            arr.push({
                filedName: '门/锁状态获取',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'supportOpenDoor':
            arr.push({
                filedName: '远程开门',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'supportOpenLock':
            arr.push({
                filedName: '远程提锁',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'supportTakePhoto':
            arr.push({
                filedName: '远程拍照',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'supportTemperatureAlarm':
            arr.push({
                filedName: '温度异常预警',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'supportTemperatureControl':
            arr.push({
                filedName: '设备温度控制',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'supportTemperatureObtain':
            arr.push({
                filedName: '实时温度获取',
                attrGranularity: data[ele].attrGranularity

            })
            break
        case 'temperatureType':
            arr.push({
                filedName: '设备支持温度层',
                attrGranularity: data[ele].attrGranularity

            })
            break
        default:
            return arr
        }
    })
    console.log(arr, '010')
    return Promise.resolve(arr)
}
// 获取设备基础属性
const getTableList = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            pageNo: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',

        configCode: 'UC72746379276525568',
        name: '设备基础属性配置',
        source: '设备中台'
    }
    // 联调时候打开
    const res = await getMerchantListCode(param)

    // const res = {
    //     code: '200',
    //     msg: '成功',
    //     data: [
    //         {
    //             filedName: '远程开门',
    //             attrGranularity: 0 // 0为支持1为不支持
    //         },
    //         {
    //             filedName: '远程提锁',
    //             attrGranularity: 1
    //         },
    //         {
    //             filedName: '远程拍照',
    //             attrGranularity: 1
    //         },
    //         {
    //             filedName: '设备温度控制',
    //             attrGranularity: '类别' // 型号
    //         },
    //         {
    //             filedName: '们数量',
    //             attrGranularity: '250' // 型号
    //         },
    //         {
    //             filedName: '默认开门流程',
    //             attrGranularity: '1次授权开门' // 型号
    //         },
    //         {
    //             filedName: '支持温度层',
    //             attrGranularity: '常温' // 型号
    //         }
    //     ]
    // }

    if (+res?.code === 200) {
        dealData(res.data).then(res => {
            dataState.selectList = res
        })

        dataState.selectList = dataState.selectList.map(el => {
            console.log(el, '00ele')
            el.label = el.attrGranularity === 0 ? '支持' : el.attrGranularity === 1 ? '不支持' : el.attrGranularity
            return {
                ...el
            }
        })
        dataState.tableData = dataState.selectList || []
        console.log(tableData, '00')
        // dataState?.options =  res.data
        // ElMessage({
        //     message: res.message,
        //     type: 'success'
        // })

        // pageInfo.value.total = res.total
    } else {
        ElMessage({
            message: res.message,
            type: 'error'
        })
    }
}
getTableList()
</script>
<style lang="scss">
.goods-tax-list {
    .search-area {
        .el-form-item__content {
            width: 240px !important;
        }
    }
}
</style>
