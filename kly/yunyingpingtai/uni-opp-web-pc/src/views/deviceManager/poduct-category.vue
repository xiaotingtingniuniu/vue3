<template>
    <!-- 产品类别能力配置 -->
    <div class="poduct-category-list">
        <div>产品信息</div>
        <el-card class="box-card" style="margin-top: 20px">

            <system-list
                :tHead="tHead"
                :tableData="tableData"
                ref="multipleTableRef"
                v-model:current-page="pageInfo.currPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >

                <template #supportOpenDoor="scope">
                    <div class="info">
                        <el-select v-model="scope.row.supportOpenDoor" clearable placeholder="请选择" :disabled="true">
                            <el-option
                                v-for="item in dataState.selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template #supportOpenDoorParticleCount="scope">
                    <div class="info">
                        {{ scope.row.supportOpenDoorParticleCount === 1?'全局' :scope.row.supportOpenDoorParticleCount===2?'类别':scope.row.supportOpenDoorParticleCount===3?'型号':'-' }}
                    </div>
                </template>
                <template #supportOpenLock="scope">
                    <div class="info">
                        <el-select :disabled="true" v-model="scope.row.supportOpenLock" clearable placeholder="请选择">
                            <el-option
                                v-for="item in dataState.selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>

                    </div>
                </template>
                <template #supportOpenLockParticleCount="scope">
                    <div class="info">
                        {{ scope.row.supportOpenLockParticleCount ===1?'全局':scope.row.supportOpenLockParticleCount===2?'类别':scope.row.supportOpenLockParticleCount===3?'型号':'-' }}
                    </div>
                </template>
                <template #supportTakePhoto="scope">
                    <div class="info">
                        <el-select :disabled="true" v-model="scope.row.supportTakePhoto" placeholder="请选择">
                            <el-option
                                v-for="item in dataState.selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template #supportTakePhotoParticleCount="scope">
                    <div class="info">
                        {{ scope.row.supportTakePhotoParticleCount ===1?'全局':scope.row.supportTakePhotoParticleCount===2?'类别':scope.row.supportTakePhotoParticleCount===3?'型号':'-' }}
                    </div>
                </template>
                <template #supportDoorLockState="scope">
                    <div class="info">
                        <el-select :disabled="true" v-model="scope.row.supportDoorLockState" placeholder="请选择">
                            <el-option
                                v-for="item in dataState.selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template #supportDoorLockStateParticleCount="scope">
                    <div class="info">
                        {{ scope.row.supportDoorLockStateParticleCount ===1?'全局':scope.row.supportDoorLockStateParticleCount===2?'类别':scope.row.supportDoorLockStateParticleCount===3?'型号':'-' }}
                    </div>
                </template>
                <template #supportDoorLockAlarm="scope">
                    <div class="info">
                        <el-select :disabled="true" v-model="scope.row.supportDoorLockAlarm" placeholder="请选择">
                            <el-option
                                v-for="item in dataState.selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template #supportDoorLockAlarmParticleCount="scope">
                    <div class="info">
                        {{ scope.row.supportDoorLockAlarmParticleCount ===1?'全局':scope.row.supportDoorLockAlarmParticleCount===2?'类别':scope.row.supportDoorLockAlarmParticleCount===3?'型号':'-' }}
                    </div>
                </template>
                <template #supportCameraAlarm="scope">
                    <div class="info">
                        <el-select :disabled="true" v-model="scope.row.supportCameraAlarm" placeholder="请选择">
                            <el-option
                                v-for="item in dataState.selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template #supportCameraAlarmParticleCount="scope">
                    <div class="info">
                        {{ scope.row.supportCameraAlarmParticleCount ===1?'全局':scope.row.supportCameraAlarmParticleCount===2?'类别':scope.row.supportCameraAlarmParticleCount===3?'型号':'-' }}
                    </div>
                </template>
            </system-list>

        </el-card>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import { getMerchantListCode } from '@/api/operate/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import SystemList from '@/composables/TablePagination/index.vue'

const originData = [{
    type: '选择题',
    num: '5题',
    average: '3分/题'
},
{
    type: '填空题',
    num: '5题',
    average: '3分/题'
},
{
    type: '选择题',
    num: '2题',
    average: '10分/题'
}
]
const originTitle = ['动态视觉柜', '弹簧柜', '云台机/炸鸡柜']
const dataState = reactive({
    tableData: [],
    selectList: [
        {
            value: 0,
            label: '不支持'
        }, {
            value: 1,
            label: '支持'
        }
    ]

})
const transData = ref([])
const matrixData = ref([])
const isClick = ref(false)
const transTitle = ['字段名称', '字段颗粒度', '远程开门', '远程提锁', '远程拍照', '门锁状态', '门锁报',
    '摄像头报警']
const pageInfo = ref({
    total: null,
    currentPage: 1,
    pageSize: 10
})
const codes = ref(null)
const { tableData, selectList } = toRefs(dataState)
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
    { align: 'center', tooltip: false, prop: 'productCateName', label: '产品类别', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'supportOpenDoor', label: '远程开门', minWidth: 100, slot: true },
    { align: 'center', tooltip: false, prop: 'supportOpenLock', label: '远程提锁', minWidth: 100, slot: true },
    { align: 'center', tooltip: false, prop: 'supportTakePhoto', label: '远程拍照', minWidth: 100, slot: true },
    { align: 'center', tooltip: false, prop: 'supportDoorLockState', label: '门锁状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: false, prop: 'supportDoorLockAlarm', label: '门锁报警', minWidth: 100, slot: true },
    { align: 'center', tooltip: false, prop: 'supportCameraAlarm', label: '摄像头报警', minWidth: 100, slot: true }

    // { align: 'center', tooltip: true, prop: 'userId', label: '推广人id', minWidth: 150 }
]
const afterGetData = async() => {

}
const getTableList = async() => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            pageNo: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',

        configCode: 'UCJH78537440713367552',
        name: '产品类别能力配置',
        source: '设备中台'
    }
    // 联调时候打开
    const res = await getMerchantListCode(param)
    if (+res?.code === 200) {
        dataState.tableData = res.data || []
        isClick.value = true

        console.log(transData, '---transData--')
    } else {
        ElMessage({
            message: res.message,
            type: 'error'
        })
    }
    // 联调时候记得注释开始
    // [{ productCateCode: '1', productCateName: '动态视觉柜', supportOpenDoor: 1, supportOpenLock: 1, supportTakePhoto: 1, supportDoorLockState: 1, supportDoorLockAlarm: 1, supportCameraAlarm: 1 }]
    // const res = {
    //     code: '200',
    //     msg: '成功',
    //     data: [
    //         {
    //             productCateName: '远程开门', // 字段名称
    //             particleCount: '类别', // 字段颗粒度
    //             dynamicVisualMachine: 0, // 动态视觉柜 0否 1是
    //             springMachine: 0, // 弹簧柜 0否 1是
    //             gimbalMachine: 0 // 云台机/炸鸡柜 0否 1是
    //         },

    //         {
    //             productCateName: '远程提锁', // 字段名称
    //             particleCount: '类别', // 字段颗粒度
    //             dynamicVisualMachine: 1, // 动态视觉柜 0否 1是
    //             springMachine: 0, // 弹簧柜 0否 1是
    //             gimbalMachine: 0 // 云台机/炸鸡柜 0否 1是
    //         },
    //         {
    //             productCateName: '远程拍照',
    //             particleCount: 1
    //         },
    //         {
    //             productCateName: '设备温度控制',
    //             particleCount: '类别' // 型号
    //         },
    //         {
    //             productCateName: '们数量',
    //             particleCount: '250' // 型号
    //         },
    //         {
    //             productCateName: '默认开门流程',
    //             particleCount: '1次授权开门' // 型号
    //         },
    //         {
    //             productCateName: '支持温度层',
    //             particleCount: '常温' // 型号
    //         }
    //     ]
    // }

    // 联调时候记得注释开始
}
// 发布时请求
const pulishUrlConfig = async () => {
    ElMessageBox.confirm(
        '是否确认发布',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const param = {
                body: {
                    appKey: 'A1001000',
                    busiCode: 'A1001000',
                    productCateCode: '1',
                    uniterBatchList: [
                        ...tableData.value
                    ]

                },
                appKey: 'A1001000',
                busiCode: 'A1001000',

                configCode: 'UC72752168393318400',
                name: '产品类别能力配置发布接口',
                source: '设备中台'
            }
            // 联调时候打开
            const res = await getMerchantListCode(param)
            if (res.code === '200') {
                ElMessage.success('成功')
            }
            await getTableList()
        })
}
getTableList()
</script>
<style lang='scss' scoped></style>
