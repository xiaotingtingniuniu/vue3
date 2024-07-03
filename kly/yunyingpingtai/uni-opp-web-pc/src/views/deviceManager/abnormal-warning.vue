<template>
    <div class='role-page'>
        <el-form ref="formRef" :model="formData" label-position="right" label-width="155px" class="form-data">
            <el-form-item label="设备离线" prop="minutes" class="warning-el-form-item" :rules="rules.minutes">
                <span class="item-span">设备网络离线超过</span>
                <span class="item-span item-input"><el-input v-model.trim="formData.minutes" placeholder="分钟" style="width: 150px; margin: 0 10px;"/></span>
                <span class="item-span">分钟</span>
            </el-form-item>

            <el-form-item label="设备位置变更异常" prop="distance" style="width: 902px" :rules="rules.distance">
                设备 “即时定位位置” 和 “安装位置” 距离超过 <el-input v-model="formData.distance" style="width: 150px; margin: 0 10px;"/> km
            </el-form-item>

            <el-form-item label="摄像头状态" prop="durationMinutes" style="width: 902px" :rules="rules.durationMinutes">
                摄像头状态连续超过<el-input v-model.trim="formData.durationMinutes" placeholder="分钟" style="width: 150px; margin: 0 10px;" />分钟，报警异常次数达到
            </el-form-item>
            <el-form-item prop="doorLockSecpnd" :rules="rules.doorLockSecpnd">
                <el-input v-model.trim="formData.doorLockSecpnd" placeholder="次数" style="width: 150px; margin: 0 10px;" />次数，则发送预警信息
            </el-form-item>

            <el-form-item label="门锁状态" prop="doorLockState" style="width: 902px" :rules="rules.doorLockState">
                门锁超过<el-input v-model.trim="formData.doorLockState" placeholder="分钟" style="width: 150px; margin: 0 10px;"/>分钟未关闭，或无法获取门锁状态，则发送预警信息
            </el-form-item>

            <el-form-item label="温度异常" prop="temperature" style="width: 902px" :rules="rules.temperature">
                设备实时温度偏差小于<el-input v-model="formData.temperature" placeholder="温度" style="width: 150px; margin: 0 10px;" />
                ℃，则解除警报
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleSave">保存</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'

import CstForm from './src/form2.vue'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const deviceStateData = ref(null)
const deviceList = ref(null)

const formRef = ref()
const formData = ref(null)
formData.value = {
    distance: 0, // 距离
    minutes: 0, // 时间
    doorLockState: '',
    durationMinutes: 0,
    temperature: 0,
    doorLockSecpnd: 0
}

// 校验规则：支持输入整数数字，可输入范围0~99999
const numberValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(Number(value))) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value > 0 && value <= 99999) {
                callback()
            } else {
                callback(new Error('支持输入最大数字99999'))
            }
        }
    }
}

// 校验规则：支持输入整数数字，可输入范围0~99
const tempValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(Number(value))) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value > 0 && value <= 99) {
                callback()
            } else {
                callback(new Error('支持输入最大温度99'))
            }
        }
    }
}

// 表单项规则
const rules = reactive({
    minutes: [{ required: true, validator: numberValidator, trigger: 'blur' }],
    distance: [{ required: true, validator: numberValidator, trigger: 'blur' }],
    durationMinutes: [{ required: true, validator: numberValidator, trigger: 'blur' }],
    doorLockSecpnd: [{ required: true, validator: numberValidator, trigger: 'blur' }],
    doorLockState: [{ required: true, validator: numberValidator, trigger: 'blur' }],
    temperature: [{ required: true, validator: tempValidator, trigger: 'blur' }]
})

// 获取数据列表的接口
const getdataList = async (name, val) => {
    const param = {
        body: {
            // appKey: 'A1001000', // 系统编号
            // busiCode: 'A1001022',
            // locationChangeAlarmRule: {
            //     maxOffsetDistance: formData.value.locationState
            // },
            // offlineAlarmRule: {
            //     maxOfflineMinutes: formData.value.doorLockState
            // },
            // operatorId: userInfo.value.account,
            // operatorName: userInfo.value.name

            // 接口入参
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC35356298079080448',
        name: '获取预警规则',
        url: '/api/device/alarm/rule/query/v1',
        source: '设备中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    if (res) {
        deviceList.value = res
        formData.value.minutes = deviceList.value.offlineAlarmRule.maxOfflineMinutes
        formData.value.distance = deviceList.value.locationChangeAlarmRule.maxOffsetDistance
        formData.value.temperature = deviceList.value.temperatureAbnormalAlarmRule.recoverTemperature
        formData.value.doorLockSecpnd = deviceList.value.cameraAbnormalAlarmRule.abnormalTimes
        formData.value.durationMinutes = deviceList.value.cameraAbnormalAlarmRule.durationMinutes

        formData.value.doorLockState = deviceList.value.doorLockAbnormalAlarmRule.durationMinutes
    }
}
// const formData = ref({

//     // locakoffice: '',
//     doorLockState: null,
//     // temperatureState: null,
//     locationState: ''
//     // distance: null,
//     // temperatureStatem: null
// })
onMounted(async () => {
    await getdataList()
})
// 保存时候的接口
const handleSave = async (name, val) => {
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001022',
            locationChangeAlarmRule: {
                maxOffsetDistance: formData.value.distance //	最大偏移距离（单位：KM）
            },
            offlineAlarmRule: {
                maxOfflineMinutes: formData.value.minutes // 最大离线分钟数
            },
            cameraAbnormalAlarmRule: {
                durationMinutes: formData.value.durationMinutes,
                abnormalTimes: formData.value.doorLockSecpnd
            },
            temperatureAbnormalAlarmRule: {
                recoverTemperature: formData.value.temperature
            },
            doorLockAbnormalAlarmRule: {
                durationMinutes: formData.value.doorLockState
            },
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name

        // 接口入参
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC33860081468219392',
        name: '修改预警规则',
        url: '/api/device/alarm/rule/modify/v1',
        source: '设备中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    formRef.value.validate(async (valid) => {
        if (valid) {
            const res = await getMerchantListCode(param)
            if (res.code === '200') ElMessage.success(res.message)
            if (res.code !== '200') ElMessage.error(res.message)

            deviceStateData.value = await getMerchantListCode(param)
        }
    })
}

</script>
<style lang='scss' scoped>
.role-page {
    dl{
    display: flex;
    dt{
        width: 200px;
    }
    dd{
        flex: 1;
    }
}
:deep(.el-form-item__content){
    margin-left: 15px;
}
.warning-el-form-item {
    display: flex;
}
.item-input{
    margin: 0 6px;
}

    .unremot-tips-title {
        margin-top: 20px;
    }

    .unremot-tips-title-content {
        margin-top: 10px;
        // height: 136px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;
        padding-left: 20px;
        padding-right: 64px;
        // line-height: 42px;
        margin-bottom: 40px;
    }
.role-page{
    .el-table tr{
        height: 50px;
    }
    .el-select{
        :deep(.el-select__tags-text){
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            justify-content: flex-start;
        }
    }
    .box-card{
        border: initial;
        .search-area{
            .el-form{
                .el-form-item{
                    width: 280px;
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
        .el-form-item{
            :deep .el-form-item__label{
                width: 200px;
            }
        }
    }
    .info{
        text-align: left;
    }
    .span{
        color:deepskyblue;
        display:inline-block;
        border-bottom: 1px;
        cursor:pointer
    }
}
}

</style>
