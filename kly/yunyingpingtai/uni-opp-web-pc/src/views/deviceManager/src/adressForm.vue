
<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            :title="props.type === 'add' ? '新增' : '编辑'"
            width="1000px"
            @close="close"
            draggable
        >
            <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                label-width="auto"
                :rules="formRule"
                class="demo-ruleForm"
                status-icon
                label-position="right"
                :disabled="isEdit === 'detail' ? true : false"
            >
                <el-col :span="10">
                    <el-form-item label="点位名称:" props="deviceCode">
                        <el-input v-model="ruleForm.locationName" placeholder="请输入"/>
                    </el-form-item>
                </el-col>
                <!-- <el-form-item label="省份" prop="provinceCode">
                    <el-select v-model="ruleForm.provinceName" placeholder="省份" @change="cahngeProvice" clearable class="input-line">
                        <el-option v-for="el in proviceList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label='城市' prop="cityCode">
                    <el-select v-model="ruleForm.cityName" placeholder="城市" @change="changeCity" clearable class="input-line">
                        <el-option v-for="el in cityList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="区县" prop="districtCode">
                    <el-select v-model="ruleForm.districtName" placeholder="区县" clearable class="input-line">
                        <el-option v-for="el in districtList" :label="el.addressName" :value="{ value: el.addressCode, label: el.addressName }" :key="el.addressCode" />
                    </el-select>
                </el-form-item> -->

                <el-form-item label="省市区" prop="provinceCode">
                    <el-cascader ref="areaRef" :props="goodsCannotSkuArea" @change="skuAreaChange" v-model="ruleForm.areaAddress" :collapse-tags="true" clearable />
                </el-form-item>

                <el-col :span="12">
                    <el-form-item label="详细地址:" props="address">
                        <el-input v-model="ruleForm.address" placeholder="请输入"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="摆放位置:" props="placementPosition">
                        <el-input v-model="ruleForm.placementPosition" placeholder="请输入"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="经纬度:" props="longitude">
                        <div class="link">
                            <el-input v-model="ruleForm.longitude" placeholder="请输入"/>
                            <div class="alink">
                                <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">坐标拾取</a>
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="点位场景:" props="firstScenesName">
                        <el-select v-model="ruleForm.firstScenesName" @change="changePlacce" clearable>
                            <el-option v-for="item in placeList" :key="item.id" :label="item.label" :value="{value: item.id, label: item.label}" ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="" props="secondScenesCode">
                        <el-select v-model="ruleForm.secondScenesName" clearable>
                            <el-option v-for="item in twoPlaceList" :key="item.id" :label="item.label" :value="{value: item.id, label: item.label}" clearable></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form>
            <div class="handleBtn">
                <el-button type="primary" @click="close">关闭</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
/* eslint-disable */
import { reactive, ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { devicetList, keyCode } from '@/api/deviceManager'
import { getMerchantList } from '@/api/operate/index'

const props = defineProps({
    type: String,
    modelValue: {
        type: Boolean,
        default: false
    },
    ownerId: String,
    res: Array
})

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'gitList', 'update:type'])

const ruleFormRef = ref()
const isEdit = ref('edit')
onMounted(async () => {
    console.log(props.res)
    // await getProviceList()
    await getPlaceData(0)
    if (props.type === 'edit') {
        init()
    }
})
const close = () => {
    emits('update:modelValue', false)
    emits('getList')
}

// 表单数据
const ruleForm = reactive({
    locationName: null, // 安装位置名称
    locationCode: '', // 安装位置编码
    provinceCode: '', // 省份编号
    provinceName: '', // 省份名称
    cityCode: '', // 城市编号
    cityName: '', // 城市名称
    districtCode: '', // 区县编号
    districtName: '', // 区县名称
    areaAddress: '', // 省市区
    address: '', // 详细地址
    placementPosition: '', // 摆放位位置
    longitude: '', // 经度
    latitude: '', // 纬度
    jwd: '', // 经纬度
    firstScenesCode: null, // 一级场景编号
    firstScenesName: null, // 一级场景名称
    secondScenesCode: null, // 二级场景编号
    secondScenesName: null // 二级场景编号
})
const init = () => {
    console.log(props.res.address, '000000000000000000000000')

    ruleForm.locationName = props.res.locationName,
    ruleForm.provinceCode = props.res.provinceCode,
    ruleForm.provinceName = props.res.provinceName,
    ruleForm.cityCode = props.res.cityCode,
    ruleForm.cityName = props.res.cityName,
    ruleForm.districtCode = props.res.districtCode,
    ruleForm.districtName = props.res.districtName,
    ruleForm.address = props.res.address,
    ruleForm.placementPosition = props.res.placementPosition,
    ruleForm.longitude = props.res.longitude,
    ruleForm.latitude = props.res.latitude,
    ruleForm.jwd = props.res.jwd,
    ruleForm.firstScenesCode = props.res.firstScenesCode,
    ruleForm.firstScenesName = props.res.firstScenesName,
    ruleForm.secondScenesCode = props.res.secondScenesCode,
    ruleForm.secondScenesName = props.res.secondScenesName
}

const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            onEdit()
        }
    })
}
// 创建、编辑新安装位置
const onEdit = async () => {
    const val = {
        name: '创建新点位',
        configCode: 'UC18278318681485312',
        source: '设备中台'
    }
    const val2 = {
        name: '修改点位信息',
        configCode: 'UC18278432963686400',
        source: '设备中台'
    }
    const params = {
        ...ruleForm,
        provinceCode: ruleForm.provinceName['value'],
        provinceName: ruleForm.provinceName['label'],
        cityCode: ruleForm.cityName['value'],
        cityName: ruleForm.cityName['label'],
        districtCode: ruleForm.districtName[ 'value'],
        districtName: ruleForm.districtName[ 'label'],
        ownerId:props.ownerId, // props.ownerId
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        firstScenesCode: ruleForm.firstScenesName['value'], // 一级场景编号
        firstScenesName: ruleForm.firstScenesName['label'], // 一级场景名称
        secondScenesCode: ruleForm.secondScenesName['value'], // 二级场景编号
        secondScenesName: ruleForm.secondScenesName['label'], // 二级场景编号
        locationCode: '122',
        longitude: ruleForm.longitude.split(',')[0], // 经度
        latitude: ruleForm.longitude.split(',')[1], // 纬度
        ...keyCode
    }
    const val3 = props.type === 'add' ? val : val2
    const res = await devicetList(params, val3)
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
const goodsCannotSkuArea = {
    lazy: true,
    multiple: false,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const params = {
            code: data.value || 0,
            ql: level + 1
        }
        const res = await getProviceList(params)
        const nodes = res?.map((item) => {
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
const areaRef = ref(null)

const skuAreaChange = (value) => {
    const areaCheckedNodes = areaRef.value.getCheckedNodes(true)
    console.log(areaCheckedNodes, '9999999')
    // ruleForm.provinceCode = areaCheckedNodes.pathNades
    ruleForm.value.provinceCode = areaCheckedNodes.pathNades

    areaCheckedNodes.forEach((item) => {
        ruleForm.provinceCode = item.pathValues[0],
        ruleForm.provinceName = item.pathLabels[0],
        ruleForm.cityCode = item.pathValues[1],
        ruleForm.cityName = item.pathLabels[1],
        ruleForm.districtCode = item.pathValues[2],
        ruleForm.districtName = item.pathLabels[2]
    })
}

// 获取省列表
const getProviceList = async (params) => {
    const res = await getAllList(params.ql, params.code)
    proviceList.value = res.addressList
    return proviceList.value
}
// // 获取省列表
// const getProviceList = async () => {
//     const res = await getAllList(1, 0)
//     proviceList.value = res.addressList
// }
// // 市
// const cahngeProvice = async (val) => {
//     if (ruleForm.provinceName?.value) {
//         const res = await getAllList(2, val.value)
//         cityList.value = res.addressList
//     }
// }
// // 县
// const changeCity = async (val) => {
//     if (ruleForm.cityName?.value) {
//         const res = await getAllList(3, val.value)
//         districtList.value = res.addressList
//     }
// }

// 获取省市
const proviceList = ref([])
const cityList = ref([])
const districtList = ref([])
const getAllList = async (ql, code) => {
    const param = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001001',
            ql: ql,
            code: code
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1658391004384SvOqm',
        name: '查询四级地址库信息',
        source: '运单中台',
        modifierId: store.state?.userInfo?.account ?? '',
        operatorId: store.state?.userInfo?.account ?? '',
        operatorName: store.state?.userInfo?.name ?? ''

    }
    const res = await getMerchantList(param)
    return res
}
// 获取一级场所列表
const placeList = ref()
const val = {
    name: '字典数据列表',
    configCode: 'UC19859938486165504',
    source: '设备中台'
}
const getPlaceData = async (id) => {
    const params = {
        dictType: 'device.install.location', // 字典类型
        parentId: id, // 父目录
        ...keyCode
    }
    const { data } = await devicetList(params, val)
    placeList.value = data
}
const twoPlaceList = ref()
const changePlacce = async (value) => {
    console.log(value)
    const params = {
        dictType: 'device.install.location', // 字典类型
        parentId: value.value, // 父目录
        ...keyCode
    }
    const {data} = await devicetList(params, val)
    twoPlaceList.value = data
}

// 表单校验规则
const formRule = reactive({
    commissionRate: [
        {
            required: true,
            message: '请输入分销费率',
            trigger: 'change'
        }
    ],
    startTime: [
        {
            required: true,
            message: '请输入开始生效时间',
            trigger: 'change'
        }
    ],
    endTime: [
        {
            required: true,
            message: '请输入失效时间',
            trigger: 'change'
        }
    ]

})

</script>
<style lang="scss" scoped>
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
.link{
    position: relative;
    .alink{
        width:200px;
        position: absolute;
        bottom: 0;
        left: 200px
    }
}
</style>
