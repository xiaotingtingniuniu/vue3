<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            :title="isEdit === 'detail' ? '详情' : '编辑'"
            width="70%"
            @close="close"
            draggable
        >
            <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                :rules="formRule"
                label-width="130px"
                class="demo-ruleForm"
                status-icon
                label-position="left"
                :disabled="isEdit === 'detail' ? true : false"
            >
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="设备编号:" props="deviceCode">
                            <span>{{ruleForm.deviceCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同编号:" props="contractCode">
                            <span>{{ruleForm.contractCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="设备名称:" props="deviceName">
                            <el-input v-model="ruleForm.deviceName" placeholder=""/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同货柜编号:" props="pointCode">
                            <span>{{ruleForm.pointCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="设备型号:" v-model="deviceModelName" props="deviceType">
                            <span>{{ruleForm.deviceModelName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="运营模式:" props="operationModel">
                            <span v-if="ruleForm.operationModel === 1">自营</span>
                            <span v-if="ruleForm.operationModel === 2">售卖</span>
                            <span v-if="ruleForm.operationModel === 3">租赁</span>
                            <span v-if="ruleForm.operationModel === 4">分期</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="IOT系统:" props="iotSysId">
                            <!-- <el-input v-model="ruleForm.iotSysId" placeholder=""/> -->
                            <el-select
                                v-model="ruleForm.iotSysId"
                            >
                                <el-option label="619" :value="1"/>
                                <el-option label="微米" :value="2"/>
                                <el-option label="易触" :value="3"/>
                                <el-option label="物联网平台" :value="4"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="柜主:" props="ownerName">
                            <span>{{ruleForm.ownerName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="IOT系统设备编号:" props="iotDeviceCode">
                            <el-input v-model="ruleForm.iotDeviceCode" placeholder=""/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="代运营商:" props="operatorName">
                            <span>{{ruleForm.operatorName ?? '-'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="24">
                    <el-form-item label="支持开门方式:" prop="supportOpenMethods">
                        <el-select
                            v-model="ruleForm.supportOpenMethods"
                            multiple
                            style="width: 840px"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label "
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <template v-if="isEdit">
                    <el-form-item label="厂商设备编号:" prop="manufacturerDeviceCode">
                        <span>{{ruleForm.manufacturerDeviceCode}}</span>
                    </el-form-item>
                </template>
                <template v-if="isEdit">
                    <el-form-item label="厂商:" prop="manufacturerName">
                        <span>{{ruleForm.manufacturerName}}</span>
                    </el-form-item>
                </template>
                <el-form-item label="点位:" prop="placeData">
                    <el-select v-model="ruleForm.placeData">
                        <el-option v-for="(item, index) in addressList" :value="index" :key="index" :label="item.addressName"/>
                    </el-select>
                    <div class="flex justify-space-between mb-4 flex-wrap gap-4">
                        &nbsp;<el-button type='text' style="color:blue"  @click="editAdress('edit')">修改</el-button>
                        <el-button type='text' style="color:blue"  @click="editAdress('add')">新增</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="设备定位:" prop="address">
                    <span>{{ruleForm.locationData}}</span>
                </el-form-item>
            </el-form>
            <div class="handleBtn">
                <el-button type="primary" @click="close">关闭</el-button>
                <el-button v-if="isEdit!=='detail'" type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
                <el-button v-else type="primary" @click="editDetail">编辑</el-button>
            </div>
            <adressForm v-model="visible" v-if="visible" :ownerId="ownerId" :res="resAddress" :type="type"/>
        </el-dialog>
        <div id="map"></div>
    </div>
</template>
<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { devicetList, keyCode } from '@/api/deviceManager'
import adressForm from './adressForm.vue'
import { getMerchantListCode } from '@/api/operate/index'

const props = defineProps({
    type: String,
    modelValue: {
        type: Boolean,
        default: false
    },
    deviceCode: String,
    ownerId: String
})

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'gitList', 'update:type'])
const ruleFormRef = ref()
const visible = ref(false)
const type = ref('')
const a = ref(['1', '2'])

const isEdit = ref('detail')
onMounted(() => {
    getOwnerDevPList()
    getDetail()
})
const editAdress = (val) => {
    visible.value = true
    type.value = val
}
const close = () => {
    emits('update:modelValue', false)
    emits('getList')
}
const options = ref([])
// options.value = []

// const options = [
//     {
//         value: 1,
//         label: '微信小程序扫码开门'
//     },
//     {
//         value: 2,
//         label: '恒生活APP扫码开门'
//     },
//     {
//         value: 3,
//         label: 'PAD刷脸开门'
//     }
// ]

// 表单数据
const ruleForm = ref({
    creatorId: userInfo.value.name,
    modifierId: userInfo.value.name,
    deviceCode: '', // 设备编号
    deviceName: '', // 设备name
    contractCode: '', // 合同编号
    // deviceModelName: '', // 设备型号
    pointCode: '', // 点位编码
    deviceModelName: '', // 设备型号
    operationModel: '', // 运营模式
    iotSysId: null, // ITO系统编号
    iotDeviceCode: '', // Iot设备编号
    ownerName: '', // 柜主
    ownerId: '', // 柜主编号
    supportOpenMethods: null, // 开门方式
    operatorName: '', // 代运营商
    manufacturerDeviceCode: '', // 厂商设备编号
    manufacturerName: '', // 厂商
    placementPosition: '', // 安装位置
    address: '', // 地址
    latitude: '', // 经度
    longitude: '', // 维度
    placeData: '',
    locationData: ''
})
// 中邮-按柜主处理
const busiMerchantId = ref(null)
const addressList = ref([]) // 柜主名下设备列表地址
const resAddress = ref()
// 获取设备详情
const getDetail = async () => {
    const val = {
        name: '获取设备详情信息V2',
        configCode: 'UC18278739349204992',
        source: '设备中台'
    }
    const params = {
        ...keyCode,
        deviceCode: props.deviceCode
    }
    const res = await devicetList(params, val)
    const { data } = res
    resAddress.value = data
    if (res.code === '200') {
        ruleForm.value.deviceCode = data.deviceCode
        ruleForm.value.deviceName = data.deviceName
        ruleForm.value.contractCode = data.contractCode
        ruleForm.value.deviceModelName = data.deviceModelName
        ruleForm.value.pointCode = data.pointCode
        // ruleForm.value.deviceModelName = data.deviceModelName
        ruleForm.value.operationModel = data.operationModel ?? '-'
        ruleForm.value.iotSysId = data.iotSysId
        ruleForm.value.iotDeviceCode = data.iotDeviceCode
        ruleForm.value.ownerName = data.ownerName
        ruleForm.value.ownerId = data.ownerId
        ruleForm.value.supportOpenMethods = data.supportOpenMethods
        ruleForm.value.operatorName = data.operatorName
        ruleForm.value.manufacturerDeviceCode = data.manufacturerDeviceCode
        ruleForm.value.manufacturerName = data.manufacturerName
        ruleForm.value.placementPosition = data.placementPosition ?? '无'
        ruleForm.value.address = data.address
        ruleForm.value.latitude = data.latitude
        ruleForm.value.longitude = data.longitude
        ruleForm.value.placeData = data?.locationName
        busiMerchantId.value = data?.ownerId
        // ruleForm.value.placeData = data.provinceName + data.cityName + data.districtName + data.address + ' ' + data.placementPosition
        ruleForm.value.locationData = data.provinceName + data.cityName + data.districtName + data.address || ''
    }
    getDoorOpen()
}

const getOwnerDevPList = async () => {
    const val = {
        name: '根据设备编号集合查询其安装位置',
        configCode: 'UC19099768728449024',
        source: '设备中台'
    }
    const params = {
        ...keyCode,
        deviceCodes: props.deviceCode.split(',')
    }
    const res = await devicetList(params, val)
    if (res.code === '200') {
        addressList.value = res.data.map(item => {
            return {
                addressName: item.provinceName + item.cityName + item.address + item.placement || '',
                ...item
            }
        })
        ruleForm.value.placeData = addressList.value[0].addressName
    }
}

const editDetail = () => {
    isEdit.value = 'edit'
}

const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            onEdit()
        }
    })
}
const onEdit = async () => {
    const val = {
        name: '修改设备信息',
        configCode: 'UC20227384569143296',
        source: '设备中台'
    }
    const params = {
        ...ruleForm.value,
        ...keyCode
    }
    const res = await devicetList(params, val)
    if (res.code === '200') {
        close()
        ElMessage({
            message: '编辑成功',
            type: 'success'
        })
    } else {
        ElMessage({
            message: '编辑失败',
            type: 'error'
        })
    }
}

// 获取开门方式
const getDoorOpen = async () => {
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002',
            // busiMerchantId: '021675221607332QEG'
            busiMerchantId: resAddress?.value?.ownerId

        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UCJH72731020624470016',
        name: '开门方式列表',
        source: '运营后台'
    }
    const res = await getMerchantListCode(param)

    if (res.code === '200') {
        const data = res?.data
        const arr = []
        data.forEach(ele => {
            arr.push({
                value: Number(ele.value),
                label: ele.label
            })
        })
        options.value = arr
        // data.forEach(ele => {
        //     options.value.push({
        //         value: ele.value *1,
        //         label: ele。label
        //     })
        // })
    } else {
        ElMessage({
            message: res.message,
            type: 'error'
        })
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
.el-form{
    padding: 0 50px;
}
.handleBtn{
    height:100px;
    display:flex;
    justify-content:space-evenly;
    align-items:center
}
</style>
