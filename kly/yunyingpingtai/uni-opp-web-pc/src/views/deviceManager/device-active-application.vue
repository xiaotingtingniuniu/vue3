<template>
    <div class='role-page'>
        <el-card class='box-card'>
            <div class='search-area'>
                <el-form ref='formRef' :model='searchData' :inline='true' label-position='right' label-width='140px'>
                    <el-form-item label='设备编号' prop='deviceCode'>
                        <el-input v-model.trim='searchData.deviceCode' placeholder='请输入' />
                    </el-form-item>
                    <el-form-item label='代运营商' prop='operatorId'>
                        <el-input v-model.trim='searchData.operatorId' placeholder='请输入' />
                    </el-form-item>
                    <el-form-item label='IOT系统设备编号' prop='iotDeviceCode'>
                        <el-input v-model.trim='searchData.iotDeviceCode' placeholder='请输入' />
                    </el-form-item>
                    <el-form-item label='厂商设备编号' prop='originalDeviceCode'>
                        <el-input v-model.trim='searchData.originalDeviceCode' placeholder='请输入' />
                    </el-form-item>
                    <el-form-item label='柜主' prop='ownerId'>
                        <el-input v-model.trim='searchData.ownerId' placeholder='请输入' />
                    </el-form-item>
                    <el-form-item label='审批单单号' prop='applicationId'>
                        <el-input v-model.trim='searchData.applicationId' placeholder='请输入' />
                    </el-form-item>
                    <el-form-item label='合同编号' prop='contractCode'>
                        <el-input v-model.trim='searchData.contractCode' placeholder='请输入' />
                    </el-form-item>
                    <el-form-item label='合同货柜编号' prop='pointCode'>
                        <el-input v-model.trim='searchData.pointCode' placeholder='请输入' />
                    </el-form-item>
                    <el-form-item label="省份" prop="provinceCode">
                        <el-cascader ref="areaRef" :props="goodsCannotSkuArea" @change="skuAreaChange" v-model="searchData.areaAddress" :collapse-tags="true" clearable />
                        <!-- <el-select v-model="searchData.provinceCode" placeholder="省份" @change="cahngeProvice" clearable class="input-line">
                            <el-option v-for="el in proviceList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                        </el-select> -->
                    </el-form-item>
                    <!-- <el-form-item label='城市' prop="cityCode">
                        <el-select v-model="searchData.cityCode" placeholder="城市" clearable class="input-line">
                            <el-option v-for="el in cityList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label='审批状态' prop='approvalState'>
                        <el-select v-model='searchData.approvalState' clearable placeholder='请选择'>
                            <el-option label='待审批' value='0' />
                            <el-option label='已通过' value='1' />
                            <el-option label='已拒绝' value='2' />
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item class='button-box'>
                        <el-button type='primary' @click='getList(true)'>
                            搜索
                        </el-button>
                        <el-button type='primary' @click='resetForm(formRef)'>
                            重置
                        </el-button>
                        <!-- <el-button type='primary' @click='onNew(formRef)'>
                            新增
                        </el-button> -->
                    </el-form-item>
                </el-form>
            </div>
            <div class='tableList-area'>
                <system-list :tHead='tHead' border :tableData='tableData' v-model:current-page='pageInfo.page' v-model:page-size='pageInfo.pageSize' :total='pageInfo.total' @size-change='sizeChange' @current-change='currentChange'>
                    <template #applyInfo="scope">
                        <div class="info">
                            <div>审批单单号:{{ scope.row.applicationId }}</div>
                            <div>审批单类型:{{ scope.row.applyType === 1 ? '激活申请': '解除申请' }}</div>
                            <div>状态:{{ scope.row.approvalState === 0 ? '待处理' :scope.row.approvalState === 1 ? '已通过' : '已拒绝'  }}</div>
                            <div>申请人:{{ scope.row.applicantName }}</div>
                            <div>申请时间:{{ scope.row.applyTime }}</div>
                        </div>
                    </template>
                    <template #deviceInfo="scope">
                        <div class="info">
                            <div>设备编号:{{ scope.row.deviceCode }}</div>
                            <div>设备名称:{{ scope.row.deviceName }}</div>
                            <div>设备型号:{{ scope.row.modelCode }}</div>
                        </div>
                    </template>
                    <template #IOTInfo="scope">
                        <div class="info">
                            <!-- <div>IOT系统:{{ scope.row.iotSysId === 1 ? '物联网' : scope.row.iotSysId === 2 ? '微米' : '易触' }}</div> -->
                            <div>IOT系统:{{iotSysIdlist[scope.row.iotSysId]}}</div>
                            <div>IOT系统设备编号:{{ scope.row.iotDeviceCode }}</div>
                        </div>
                    </template>
                    <template #manufactInfo="scope">
                        <div class="info">
                            <div>厂商设备编号:{{ scope.row.originalDeviceCode }}</div>
                            <div>厂商:{{ scope.row.manufacturerName }}</div>
                        </div>
                    </template>
                    <template #cpInfo="scope">
                        <div class="info">
                            <div>合同编号:{{ scope.row.contractCode }}</div>
                            <div>合同货柜编号:{{ scope.row.pointCode }}</div>
                            <div>点位位置:{{ scope.row.pointPosition }}</div>
                            <div>运营模式&nbsp;:&nbsp;{{ scope.row.operationModel === 1 ? '自营' : scope.row.operationModel === 2 ? '售卖': scope.row.operationModel === 2 ? '租赁' : '分期'}}</div>
                        </div>
                    </template>
                    <template #ownerInfo="scope">
                        <div class="info">
                            <div>柜主:{{ scope.row.ownerName }}</div>
                            <div>代运营商:{{ scope.row.operatorName }}</div>
                        </div>
                    </template>
                    <template #adressInfo="scope">
                        <div class="info">
                            <div>点位:{{ scope.row.locationName }}</div>
                            <!-- <div>设备定位:{{ scope.row.address }}&nbsp; <span style="color:blue;cursor:pointer" @click="openMap">查看地图</span></div> -->
                            <div>设备定位:{{ scope.row.address }}</div>
                        </div>
                    </template>
                    <template #aInfo="scope">
                        <div v-show="scope.row.approvalState !== 0" class="info">
                            <div>操作人:{{scope.row.approverName}}</div>
                            <div>操作时间:{{scope.row.approvalTime}}</div>
                            <div>审批备注:{{scope.row.remark}}</div>
                        </div>
                        <span v-show="scope.row.status === 3" style="color: #ccc"> - </span>
                    </template>
                    <template #operation='scope'>
                        <template v-if="scope.row.approvalState === 0">
                            <el-button @click='hendleAudit(scope.row, 1)' type='primary' link>通过</el-button>
                            <el-button @click='hendleAudit(scope.row, 2)' type='primary' link style="color:red">拒绝</el-button>
                        </template>
                        <template v-else>
                            <span> - </span>
                        </template>
                    </template>
                </system-list>
            </div>
            <el-dialog
                v-model="mapVisible"
                :before-close="handleClose"
            >
                <div id="map"></div>
            </el-dialog>
        </el-card>
        <!-- <cst-form v-model='visible' v-if="visible" :resourceCode='dataState.resourceCode' :row="dataState.row" @getList='getList'></cst-form> -->
        <el-drawer v-model="auditVisible" direction="rtl">
            <el-form ref="formRef" :rules="rule" :model="ruleForm">
                <el-form-item label="审批备注">
                    <div class="aaa" style="position: relative">
                        <el-input v-model.trim="ruleForm.text" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" resize='none' placeholder="请您输入通过备注或者拒绝理由..." maxlength="200"  @input="descInput($event.length)" props="text" style="width:300px;height:100px">
                        </el-input>
                        <span class="numberV" style="position: absolute; left: 262px;bottom: 18px; font-size: 12px; color:#ccc">{{txtVal}}/200</span>
                    </div>
                </el-form-item>
            </el-form>
            <template #title>
                <h4>设备审核</h4>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary" v-if="auditType === 2" @click="handleClick(formRef)">拒绝</el-button>
                    <el-button type="primary" v-if="auditType === 1" @click="handleClick(formRef)">通过</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { useStore } from 'vuex'
import { onMounted, reactive, ref, toRefs, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { devicetList, keyCode } from '@/api/deviceManager'
import { getMerchantList } from '@/api/operate/index'
import CstForm from './src/form2.vue'
const tHead = [
    { align: 'center', prop: 'applyInfo', label: '审批单信息', minWidth: 150, slot: true },
    { align: 'center', prop: 'deviceInfo', label: '设备信息', width: 150, slot: true },
    { align: 'center', prop: 'IOTInfo', label: 'IOT信息', minWidth: 120, slot: true },
    { align: 'center', prop: 'manufactInfo', label: '厂商设备信息', minWidth: 120, slot: true },
    { align: 'center', prop: 'cpInfo', label: '合同和合同货柜编号', minWidth: 120, slot: true },
    { align: 'center', prop: 'adressInfo', label: '设备地址位置', minWidth: 120, slot: true },
    { align: 'center', prop: 'ownerInfo', label: '运营商信息', minWidth: 150, slot: true },
    { align: 'center', prop: 'aInfo', label: '审批信息', minWidth: 150, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 150, fixed: 'right', slot: true }
]

const dataState = reactive({
    tableData: [],
    resourceCode: null,
    row: null,
    currentVal: null,
    // visible: false,
    dialogType: null,
    searchData: {
        deviceCode: '', // 设备编号
        agentOperator: '',
        operatorId: '', // 代运营商 operatorId
        iotDeviceCode: '', // Iot设备编号
        originalDeviceCode: '', // 厂商设备编号
        ownerId: '', // 柜主
        applicationId: '', // 审批单单号
        contractCode: '', // 合同编号
        pointCode: '', // 点位编码
        provinceName: '', // 省份名称
        provinceCode: '', // 省份编码
        cityName: '', // 城市名称
        cityCode: '', // 城市编码
        approvalState: '', // 审批状态
        areaAddress: ''

    }
})
const iotSysIdlist = {
    1: '619',
    2: '微米',
    3: '易触',
    4: '物联网平台',
    5: '虚拟货柜'
}
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const pageInfo = ref({
    total: 0,
    page: 1,
    pageSize: 10
})
const { tableData, searchData, dialogType, currentVal } = toRefs(dataState)

onMounted(async () => {
    await getList()
    // await getProviceList()
})

const ruleForm = reactive({
    text: ''
})

const rule = reactive({
    text: [{ required: true, message: '审批备注内容不能为空', trigger: 'change' }]
})

// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.page = 1)
    const val = {
        name: '查询设备绑定申请列表聚合',
        configCode: 'UCJH46230520445788160',
        source: '运营后台'
    }
    const params = {
        ...searchData.value,
        provinceCode: searchData?.value?.areaAddress ? searchData?.value?.areaAddress[0] : '',
        cityCode: searchData?.value?.areaAddress ? searchData?.value?.areaAddress[1] : '',
        ...keyCode,
        pageNo: pageInfo.value.page,
        pageSize: pageInfo.value.pageSize
    }
    const res = await devicetList(params, val)
    console.log(res)
    if (res.code === '200') {
        dataState.tableData = res.data.records
        pageInfo.value.total = res.data.totalSize
    }
}

// 地图
const mapVisible = ref(false)
const openMap = () => {
    mapVisible.value = true
    var center = new window.TMap.LatLng(39.984120, 116.307484)
    // 初始化地图
    var map = new window.TMap.Map('map', {
        zoom: 18, // 设置地图缩放级别
        center: center, // 设置地图中心点坐标
        baseMap: { // 设置卫星地图
            type: 'satellite'
        }
    })
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    if (areaRef?.value?.panel) {
        areaRef.value.panel.clearCheckedNodes()
    }
    searchData.value.areaAddress = ''
    formEl.resetFields()
    getList()
}

// 页数改变
const sizeChange = (val) => {
    pageInfo.value.page = 1
    pageInfo.value.pageSize = val
    getList()
}

// 当前页改变
const currentChange = (val) => {
    pageInfo.value.page = val
    getList()
}
// 弹出编辑页
// const onNew = (row) => {
//     dataState.row = row
//     dataState.resourceCode = row.resourceCode
//     dataState.currentVal = row
//     dataState.visible = true
// }

// 通过、拒绝弹窗
const auditVisible = ref(false)
const auditType = ref(null)
const hendleAudit = (row, type) => {
    auditVisible.value = true
    auditType.value = type
    dataState.row = row
}
// 点击通过 拒绝 发起请求
const handleClick = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            onSubmit()
        }
    })
}
// 设备通过拒绝 审核提交
const onSubmit = async () => {
    console.log(userInfo.value)
    const params = {
        ...keyCode,
        applicationId: Number(dataState.row.applicationId), // 申请编号
        approvalState: Number(auditType.value), // 审批状态
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        approvalNote: ruleForm.text
    }
    const val = {
        name: '审批设备绑定申请',
        configCode: 'UC18279444667559936',
        source: '设备中台'
    }
    const res = await devicetList(params, val)
    if (res.code === '200') {
        auditVisible.value = false
        getList()
        ElMessage({
            message: '审核成功',
            type: 'success'
        })
    } else {
        ElMessage({
            message: '审核失败',
            type: 'error'
        })
    }
}

const txtVal = ref(0)
const descInput = (val) => {
    txtVal.value = val
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
        // const res = await getAllList(params)
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
    console.log(areaRef.value.getCheckedNodes(true), '000000')
}
// 获取省列表
const getProviceList = async (params) => {
    const res = await getAllList(params.ql, params.code)
    proviceList.value = res.addressList
    return proviceList.value
}
// 始发省 出市
const cahngeProvice = async (val) => {
    if (searchData.value.provinceCode?.value) {
        const res = await getAllList(2, val.value)
        cityList.value = res.addressList
    }
}

// 获取省市
const proviceList = ref([])
const cityList = ref([])
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
</script>
<style lang='scss' scoped>
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
    // #map{
    //     width:50%;
    //     height:50%;
    //     position:fixed
    // }
}
</style>
