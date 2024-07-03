
<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            :title="title"
            width="900px"
            height="1000px"
            @close="close"
            draggable
        >
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="规则名称：" prop="ruleName" :rules="rules.ruleNameRule">
                    <el-input v-model="ruleForm.ruleName" placeholder="请选择～"></el-input>
                </el-form-item>
                <el-form-item label="适用对象：" prop="ruleType" :rules="rules.ruleTypeRule">
                    <el-select v-model="ruleForm.ruleType" placeholder="请选择～" @change="ruleTypeChange">
                        <el-option v-for="item in ruleTypeStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <template #default>
                        <div>
                            <span>请选择补货规则，系统会在指定的时间根据规则自动生成补货单</span>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="选择城市" prop="selCitys" v-if="ruleForm.ruleType === 1">
                    <el-cascader
                        ref="authorityRef"
                        :props="selCitysProp"
                        @change="selCitysChange"
                        v-model="dataState.selCitysChecked"
                        width="100%"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="选择柜主" prop="selOwner" v-if="ruleForm.ruleType === 2">
                    <el-input v-model="dataState.selOwnerChecked" placeholder="请选择～">
                        <template #append>
                            <el-button @click="selectOwner()">搜索</el-button>
                        </template>
                    </el-input>
                    <div class="sel-box">
                        <div class="tab-title">已选柜主</div>
                        <el-table :data="ownerTabChecked" style="width: 100%">
                            <el-table-column prop="ownerCode" label="商家编号"  />
                            <el-table-column prop="ownerName" label="商品名称" />
                            <el-table-column label="操作" align="center">
                                <template v-slot="scope">
                                    <el-button text type="primary" @click="delOwner(scope.row)"> 删除 </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tab-title" v-if="isSelOwner">添加柜主</div>
                        <el-table :data="ownerTabData" style="width: 100%" v-if="isSelOwner">
                            <el-table-column prop="ownerCode" label="商家编号"  />
                            <el-table-column prop="ownerName" label="商品名称" />
                            <el-table-column label="操作" align="center">
                                <template v-slot="scope">
                                    <el-button v-if="scope.row.isSel === 0" text type="primary" @click="selOwner(scope.row)"> 选择 </el-button>
                                    <el-button v-if="scope.row.isSel === 1" text type="primary" @click="cancelOwner(scope.row)"> 取消 </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="bottom" v-if="isSelOwner">
                            <div class="demo-pagination-block" style="margin:0 auto">
                                <el-pagination
                                    v-model:currentPage="dataState.pageinfo.currentPage"
                                    v-model:page-size="dataState.pageinfo.pageSize"
                                    :page-sizes="[10, 20, 30, 40]"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="dataState.pageinfo.total"
                                    @size-change="sizeChange"
                                    @current-change="currentChange"
                                />
                            </div>
                            <el-button @click="addOwner">取消</el-button>
                            <el-button type="primary" @click="addOwner">确定</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="选择设备" prop="selDevice" v-if="ruleForm.ruleType === 3">
                    <el-input v-model="dataState.selDeviceChecked" placeholder="请选择～">
                        <template #append>
                            <el-button @click="selectDevice()">搜索</el-button>
                        </template>
                    </el-input>
                    <div class="sel-box">
                        <div class="tab-title">已选设备</div>
                        <el-table :data="deviceTabChecked" style="width: 100%">
                            <el-table-column prop="equipmentCode" label="设备编号"  />
                            <el-table-column prop="equipmentName" label="设备名称" />
                            <el-table-column label="操作" align="center">
                                <template v-slot="scope">
                                    <el-button text type="primary" @click="delDevice(scope.row)"> 删除 </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tab-title" v-if="isSelDevice">添加设备</div>
                        <el-table :data="deviceTabData" style="width: 100%" v-if="isSelDevice">
                            <el-table-column prop="equipmentCode" label="设备编号"  />
                            <el-table-column prop="equipmentName" label="设备名称" />
                            <el-table-column label="操作" align="center">
                                <template v-slot="scope">
                                    <el-button v-if="scope.row.isSel === 0" text type="primary" @click="selDevice(scope.row)"> 选择 </el-button>
                                    <el-button v-if="scope.row.isSel === 1" text type="primary" @click="cancelDevice(scope.row)"> 取消 </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="bottom" v-if="isSelDevice">
                            <div class="demo-pagination-block" style="margin:0 auto">
                                <el-pagination
                                    v-model:currentPage="dataState.pageinfo.currentPage"
                                    v-model:page-size="dataState.pageinfo.pageSize"
                                    :page-sizes="[10, 20, 30, 40]"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="dataState.pageinfo.total"
                                    @size-change="sizeChange"
                                    @current-change="currentChange"
                                />
                            </div>
                            <el-button @click="addOwner">取消</el-button>
                            <el-button type="primary" @click="addDevice">确定</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="整柜缺货率：" prop="wholeShortageRate" :rules="rules.repRateMax">
                    <el-input v-model.number="ruleForm.wholeShortageRate" placeholder="请选择～"><template v-slot:suffix>%</template></el-input>
                </el-form-item>
                <el-form-item label="单品缺货率：" prop="skuShortageRate" :rules="rules.repRateMax">
                    <el-input v-model.number="ruleForm.skuShortageRate" placeholder="请选择～"><template v-slot:suffix>%</template></el-input>
                </el-form-item>
            </el-form>
            <div class="sku-btns">
                <el-button @click="cancelRule">
                    取消
                </el-button>
                <el-button type="primary" @click="submitRule(ruleFormRef)">
                    确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { repRuleQueryGuizhu, repRuleQueryEquipment, repRuleAdd } from '@/api/operate/index'
import { cityQueryCategory } from '@/utils'

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
    title: {
        type: String
    }
})
const dataState = reactive({
    ruleForm: {
        ruleName: '',
        ruleType: '',
        wholeShortageRate: '',
        skuShortageRate: '',
        ruleDetails: []
    },
    // 账户类型
    ruleTypeStatus: [
        {
            value: 1,
            label: '城市'
        },
        {
            value: 2,
            label: '柜主'
        },
        {
            value: 3,
            label: '设备'
        }
    ],
    selCitysChecked: '', // 选择城市选中
    selOwnerChecked: '',
    selDeviceChecked: '',
    isSelOwner: false,
    ownerTabData: [],
    ownerTabChecked: [],
    isSelDevice: false,
    deviceTabData: [],
    deviceTabChecked: [],
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
})
const authorityRef = ref(null)
const { ruleForm, ruleTypeStatus, isSelOwner, ownerTabData, ownerTabChecked, isSelDevice, deviceTabData, deviceTabChecked } = toRefs(dataState)
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'gitList'])
const ruleFormRef = ref()
// 关闭弹出框
const close = () => {
    emits('update:modelValue', false)
    emits('getList')
}
// 适用对象变化
const ruleTypeChange = async () => {
    if (dataState.ruleForm.ruleType === 1) {
        dataState.ruleForm.ruleDetails = []
    } else if (dataState.ruleForm.ruleType === 2) {
        dataState.ruleForm.ruleDetails = []
    } else if (dataState.ruleForm.ruleType === 3) {
        dataState.ruleForm.ruleDetails = []
    }
}
// 校验规则：支持输入整数数字，可输入范围0~100
const numValidator = (rule, value, callback) => {
    if (value === '') {
        callback()
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value >= 0 && value <= 100) {
                callback()
            } else {
                callback(new Error('请输入大于等于0且小于等于100的数字'))
            }
        }
    }
}
// 表单项规则
const rules = reactive({
    ruleNameRule: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
    ruleTypeRule: [{ required: true, message: '适用对象不能为空', trigger: 'change' }],
    repRateMax: [{ validator: numValidator, trigger: 'change' }]
})
// 取消
const cancelRule = async () => {
    emits('update:modelValue', false)
    emits('getList')
}
// 提交前检验
const submitBefore = async () => {
    if (dataState.ruleForm.ruleType === 2) {
        dataState.ownerTabChecked.forEach(item => {
            dataState.ruleForm.ruleDetails.push(String(item.ownerCode))
        })
    } else if (dataState.ruleForm.ruleType === 3) {
        dataState.deviceTabChecked.forEach(item => {
            dataState.ruleForm.ruleDetails.push(String(item.equipmentCode))
        })
    }
}
// 新增规则确认（柜主） 021663241195443O4E 02166529039707378T 0216634006954912JD  021663124763333VQU
// 新增规则确认（设备） 099975 100362
const submitRule = async (formEl) => {
    if (!formEl) return
    if (dataState.ruleForm.wholeShortageRate === '' && dataState.ruleForm.skuShortageRate === '') {
        ElMessage.warning('整柜与单品缺货率不可同时为空')
        return
    }
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            submitBefore()
            const params = {
                ruleName: dataState.ruleForm.ruleName,
                ruleType: dataState.ruleForm.ruleType,
                wholeShortageRate: dataState.ruleForm.wholeShortageRate,
                skuShortageRate: dataState.ruleForm.skuShortageRate,
                ruleDetails: dataState.ruleForm.ruleDetails,
                // ruleDetails: ['021663241195443O4E'],
                creatorId: userInfo.value.id
            }
            const res = await repRuleAdd(params)
            if (res.code === '200') {
                ElMessage.success('新增成功')
                emits('update:modelValue', false)
                emits('getList')
            }
        }
    })
}
// 选择城市联动
const selCitysProp = {
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
// 选择城市change
const selCitysChange = (value) => {
    if (value.length > 150) {
        ElMessageBox.confirm(
            '选择城市数量不能超过150个!',
            '提示',
            {
                confirmButtonText: '确定'
            }
        )
        return
        // ElMessage.success('选择城市数量不能超过150个')
    }
    ruleForm.ruleDetails = []
    dataState.selCitysCheckedNodes = authorityRef.value.getCheckedNodes(true)
    dataState.selCitysCheckedNodes.forEach(item => {
        // ruleForm.ruleDetails.push({
        //     provinceCode: item.pathValues[0],
        //     provinceName: item.pathLabels[0],
        //     cityCode: item.pathValues[1],
        //     cityName: item.pathLabels[1]
        // })
        ruleForm.ruleDetails.push(item.pathValues[1])
    })
    dataState.ruleForm.ruleDetails = ruleForm.ruleDetails
}
// 搜索柜主
const selectOwner = async () => {
    dataState.isSelOwner = true
    const params = {
        ownerName: dataState.selOwnerChecked
    }
    const res = await repRuleQueryGuizhu(params)
    if (res.code === '200') {
        dataState.ownerTabData = []
        if (res.data.list) {
            res.data.list.map(item => {
                item.isSel = 0
                dataState.ownerTabData.push(item)
            })
        }
        dataState.pageinfo.total = res.data.total
    }
}
// 选择柜主
const selOwner = async (row) => {
    dataState.ownerTabData.forEach((item) => {
        if (item.ownerCode === row.ownerCode) {
            item.isSel = 1
        }
    })
    dataState.ownerTabChecked.push(row)
}
// 取消柜主
const cancelOwner = async (row) => {
    dataState.ownerTabData.forEach((item, index) => {
        if (item.ownerCode === row.ownerCode) {
            item.isSel = 0
        }
    })
    dataState.ownerTabChecked.forEach((item, index) => {
        if (item.ownerCode === row.ownerCode) {
            dataState.ownerTabChecked.splice(index, 1)
        }
    })
}
// 删除柜主
const delOwner = async (row) => {
    dataState.ownerTabData.forEach((item, index) => {
        if (item.ownerCode === row.ownerCode) {
            item.isSel = 0
        }
    })
    dataState.ownerTabChecked.forEach((item, index) => {
        if (item.ownerCode === row.ownerCode) {
            dataState.ownerTabChecked.splice(index, 1)
        }
    })
}
// 提交柜主
const addOwner = async (row) => {
    dataState.isSelOwner = false
}
// 搜索配置
const selectDevice = async () => {
    dataState.isSelDevice = true
    const params = {
        equipmentInfo: dataState.selDeviceChecked,
        pageNo: 1,
        pageSize: 10
    }
    const res = await repRuleQueryEquipment(params)
    if (res.code === '200') {
        dataState.deviceTabData = []
        if (res.data.list) {
            res.data.list.map(item => {
                item.isSel = 0
                dataState.deviceTabData.push(item)
            })
        }
        dataState.pageinfo.total = res.data.total
    }
}
// 选择配置
const selDevice = async (row) => {
    dataState.deviceTabData.forEach((item) => {
        if (item.equipmentCode === row.equipmentCode) {
            item.isSel = 1
        }
    })
    dataState.deviceTabChecked.push(row)
}
// 取消配置
const cancelDevice = async (row) => {
    dataState.deviceTabData.forEach((item, index) => {
        if (item.equipmentCode === row.equipmentCode) {
            item.isSel = 0
        }
    })
    dataState.deviceTabChecked.forEach((item, index) => {
        if (item.equipmentCode === row.equipmentCode) {
            dataState.deviceTabChecked.splice(index, 1)
        }
    })
}
// 删除配置
const delDevice = async (row) => {
    dataState.deviceTabData.forEach((item, index) => {
        if (item.equipmentCode === row.equipmentCode) {
            item.isSel = 0
        }
    })
    dataState.deviceTabChecked.forEach((item, index) => {
        if (item.equipmentCode === row.equipmentCode) {
            dataState.deviceTabChecked.splice(index, 1)
        }
    })
}
// 提交配置
const addDevice = async (row) => {
    dataState.isSelDevice = false
}
// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    if (dataState.ruleForm.ruleType === 1) {
        selCitysProp()
    } else if (dataState.ruleForm.ruleType === 2) {
        selectOwner()
    } else if (dataState.ruleForm.ruleType === 3) {
        selectDevice()
    }
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    if (dataState.ruleForm.ruleType === 1) {
        selCitysProp()
    } else if (dataState.ruleForm.ruleType === 2) {
        selectOwner()
    } else if (dataState.ruleForm.ruleType === 3) {
        selectDevice()
    }
}
</script>
<style>
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
.sel-box{
    width: 100%;
    border: 1px solid #dcdcdc;
    margin-top: 10px;
    border-radius: 4px;
}
.bottom{
    padding: 6px;
}
.tab-title{
    padding: 6px 10px;
    border-bottom: 1px solid #dcdcdc;
}
</style>
