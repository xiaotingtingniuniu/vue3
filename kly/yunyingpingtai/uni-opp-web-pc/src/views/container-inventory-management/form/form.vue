
<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            :title="title"
            width="1100px"
            height="1000px"
            @close="close"
            draggable
        >
            <div class="facility-box" v-if="title === '补货单确认' || props.title === '补货详情'">
                <span class="facility-label">设备信息</span>
                <span class="facility-text">设备编号：{{ dataState.equipmentCode }}</span>
                <span class="facility-text">设备温层：{{ dataState.temperatureName }}</span>
            </div>
            <el-button type="primary" @click="addSku" v-if="title === '补货单确认'">新增商品</el-button>
            <el-table v-if="title === '盘点详情'" :data="row" style="width: 100%">
                <el-table-column prop="skuId" label="商品编号"  />
                <el-table-column prop="skuName" label="商品名称"  />
                <el-table-column prop="channelPrice" label="商品价格" />
                <el-table-column prop="thumbnail" label="商品缩略图">
                    <template v-slot="scope">
                        <img :src="scope.row.thumbnail" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="expectQuantity" label="应盘数量" />
                <el-table-column prop="actualQuantity" label="实盘数量" />
                <el-table-column prop="difference" label="盘点差异" />
                <el-table-column prop="secondCabinetTypeName" label="设备类型"/>
                <el-table-column prop="doorName" label="设备门信息"/>
                <el-table-column prop="temperatureName" label="设备温层"/>
                <el-table-column prop="storageStyleName" label="商品温层"/>

            </el-table>
            <el-table v-else-if="title === '补货单确认'" :data="tableData" style="width: 100%">
                <el-table-column prop="skuId" label="商品编号"  />
                <el-table-column prop="skuName" label="商品名称"  />
                <el-table-column prop="price" label="商品价格" />
                <el-table-column prop="thumbnail" label="商品缩略图">
                    <template v-slot="scope">
                        <img :src="scope.row.thumbnail" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="storageStyleCode" label="商品温层">
                    <template v-slot="scope">
                        <div v-if="scope.row.storageStyleCode === 'normal'">常温</div>
                        <div v-else-if="scope.row.storageStyleCode === 'preserve'">冷藏</div>
                        <div v-else-if="scope.row.storageStyleCode === 'freeze'">冷冻</div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
                <el-table-column prop="quantity" label="补货数量">
                    <template v-slot="scope">
                        <el-input v-model.number="scope.row.quantity"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="originQuantity" label="补货前库存" />
                <el-table-column label="操作" align="center">
                    <template v-slot="scope">
                        <el-button text type="primary" @click="delSku(scope.row)"> 删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-else :data="tableData" style="width: 100%">
                <el-table-column prop="skuId" label="商品编号"  />
                <el-table-column prop="skuName" label="商品名称"  />
                <el-table-column prop="price" label="商品价格" />
                <el-table-column prop="thumbnail" label="商品缩略图">
                    <template v-slot="scope">
                        <img :src="scope.row.thumbnail" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="storageStyleCode" label="商品温层">
                    <template v-slot="scope">
                        <div v-if="scope.row.storageStyleCode === 'normal'">常温</div>
                        <div v-else-if="scope.row.storageStyleCode === 'preserve'">冷藏</div>
                        <div v-else-if="scope.row.storageStyleCode === 'freeze'">冷冻</div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
                <el-table-column prop="actualQuantity" label="补货数量" />
                <el-table-column prop="originQuantity" label="补货前库存" />
            </el-table>
            <div class="sku-btns" v-if="title === '补货单确认'">
                <el-button @click="cancelSku">
                    取消
                </el-button>
                <el-button type="primary" @click="confirmSku">
                    确认
                </el-button>
            </div>
        </el-dialog>
    </div>
    <add-form v-model="visible" v-if="visible" :type="add" @getDialogCheckedData="getDialogCheckedData"></add-form>
</template>
<script setup>
import { toRefs, reactive, ref, computed, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { replenishmentConfirm } from '@/api/operate/index'
// import { proportionConfigModif, proportionConfig } from '@/api/distributionManagement'
import AddForm from './add-sku.vue'

const props = defineProps({
    type: String,
    currentVal: {
        type: Object,
        default: () => {}
    },
    modelValue: {
        type: Boolean,
        default: false
    },
    row: {
        type: Object,
        default: () => {}
    },
    title: {
        type: String
    }
})
const store = useStore()
const myCmnType = ref(2)
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'gitList'])
// const ruleFormRef = ref()
// const tableData = ref([])
const close = () => {
    emits('update:modelValue', false)
    emits('getList')
}
const visible = ref(false)
const dataState = reactive({
    tableData: [],
    selectList: [],
    skuNumLimitNum: '',
    equipmentCode: '',
    temperatureName: '',
    temperatureType: ''
})
const { tableData, selectList } = toRefs(dataState)
// 表单数据
// const ruleForm = ref({
//     cmnType: myCmnType,
//     ratioLevelFirst: null,
//     ratioLevelSecond: null,
//     ratioStatus: 2,
//     ratioStartTime: null,
//     ratioEndTime: null,
//     creatorId: userInfo.value.name,
//     remark: null
// })

const init = async () => {
    if (props.title === '补货单确认' || props.title === '补货详情') {
        dataState.tableData = props.row.detailList
        dataState.skuNumLimitNum = props.row.skuNumLimitNum
        dataState.equipmentCode = props.row.equipmentCode
        dataState.temperatureName = props.row.temperatureName
        dataState.temperatureType = props.row.temperatureType
    }
}
init()

// 新增商品
const addSku = async () => {
    visible.value = true
}
// 删除商品
const delSku = async (row) => {
    dataState.tableData.forEach((item, index) => {
        if (item.skuId === row.skuId) {
            dataState.tableData.splice(index, 1)
        }
    })
}
// 取消
const cancelSku = async () => {
    emits('update:modelValue', false)
    emits('getList')
}
// 获取选择商品
const getDialogCheckedData = async (info) => {
    if (info.length > 0) {
        // 去重
        const arr1 = info
        const arr2 = dataState.tableData
        const arr3 = []
        for (let i = 0; i < arr1.length; i++) {
            let isAdd = true
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i].skuId === arr2[j].skuId) {
                    isAdd = false
                }
            }
            if (isAdd) {
                arr3.push(arr1[i])
            }
        }
        if (arr3.length > 0) {
            arr3.forEach((item) => {
                dataState.tableData.push({
                    originQuantity: 0,
                    price: item.salePrice,
                    quantity: 0,
                    skuId: item.skuId,
                    skuName: item.skuName,
                    thumbnail: item.thumbnail,
                    storageStyleCode: item.storageStyleCode
                })
            })
        }
    }
}
// 提交前SKU数据去重校验
const confirmSku = async () => {
    // 校验设备温层和商品温层是否一直
    let typeFit = true
    if (dataState.tableData.length > 0) {
        const arr = dataState.tableData
        for (let k = 0; k < arr.length; k++) {
            if (arr[k].storageStyleCode !== dataState.temperatureType) {
                typeFit = false
            }
        }
    }
    // sku限制数，去重后数量大于sku限制数
    if (dataState.skuNumLimitNum && dataState.tableData.length > dataState.skuNumLimitNum) {
        const arr = dataState.tableData
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i].skuId === arr[j].skuId) {
                    arr.splice(j, 1)
                    j--
                }
            }
        }
        if (arr.length > dataState.skuNumLimitNum) {
            ElMessageBox.confirm(
                `您的补货单商品数为${arr.length}个，超过${dataState.skuNumLimitNum}个会降低商品的识别率和识别速度，请确认是否继续添加！`,
                '特别提醒',
                {
                    confirmButtonText: '继续添加',
                    cancelButtonText: '取消'
                }
            )
                .then(async () => {
                    if (typeFit) {
                        confirm()
                    } else {
                        ElMessageBox.confirm(
                            `当前货柜为“${dataState.temperatureName}”货柜，带有非“${dataState.temperatureName}”标签的商品，不建议补货！`,
                            '特别提醒',
                            {
                                confirmButtonText: '确认',
                                cancelButtonText: '取消'
                            }
                        )
                            .then(async () => {
                                confirm()
                            })
                    }
                })
        }
    } else {
        if (typeFit) {
            confirm()
        } else {
            ElMessageBox.confirm(
                // '带有“冷冻”标签的商品需在冷冻条件下存放，当前货柜非“冷冻”货柜，不建议补货！',
                `当前货柜为“${dataState.temperatureName}”货柜，带有非“${dataState.temperatureName}”标签的商品，不建议补货！`,
                '特别提醒',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消'
                }
            )
                .then(async () => {
                    confirm()
                })
        }
    }
}
// 提交
const confirm = async () => {
    const params = {
        id: props.row.id,
        billNo: props.row.billNo,
        billStatus: 1,
        creatorId: userInfo.value.id,
        detailList: dataState.tableData
    }
    const res = await replenishmentConfirm(params)
    if (res.code === '200') {
        ElMessage.success('成功')
        emits('update:modelValue', false)
        emits('getList')
    }
}
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
.avatar-uploader .el-upload{
    width: 200px;
    height: 200px;
}

.avatar-uploader{
    width: 300px;
    height: 300px;
}
.el-form-item{
    display: flex;
}
.sku-btns{
    margin: 0 auto;
    width: fit-content;
    margin-top: 20px;
}
img{
    width: 120px;
}
.facility-box{
    font-size: 16px;
    margin-bottom: 12px;
}
.facility-label{
    font-size: 16px;
    font-weight: bold;
    margin-right: 20px;
}
.facility-text{
    margin-right: 32px;
    font-size: 14px;
}
</style>
