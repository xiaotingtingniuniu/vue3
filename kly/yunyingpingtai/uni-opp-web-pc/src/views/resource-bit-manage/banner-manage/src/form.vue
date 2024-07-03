
<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            :title="dialogTitle"
            width="900px"
            @close="close"
            draggable
        >
            <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                :rules="formRule"
                label-width="150px"
                class="demo-ruleForm"
                status-icon
            >
                <el-form-item label="banner名称" prop="title">
                    <el-input v-model="ruleForm.title" placeholder="请输入banner名称" maxlength="200"/>
                </el-form-item>
                <el-form-item label="业务线" prop="busiCode">
                    <el-select
                        v-model="ruleForm.busiCode"
                        @change="busiChange"
                        placeholder="请选择业务线"
                        :disabled="props.type !== 'add'"
                    >
                        <!-- <el-option label="恒生活APP" value="A1001" /> -->
                        <el-option v-for="item in busiCodeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择展示位置" prop="displaySite">
                    <el-select
                        v-model="ruleForm.displaySite"
                        clearable
                        placeholder="请选择展示位置"
                        @change="displaySiteChange"
                    >
                        <!-- <el-option label="首页" value="HOME_BANNER" />
                        <el-option label="支付完成页" value="ORDER_FINISH_BANNER" /> -->
                        <el-option v-for="item in displaySite" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="ruleForm.busiCode === 'A1001006'" label="生效时间" prop="time" class="form-item-time">
                    <el-date-picker size="default" v-model="ruleForm.time" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                </el-form-item>
                <el-form-item v-if="ruleForm.busiCode === 'A1001006'" label="投放范围" prop="filterType">
                    <!-- <el-select
                        v-model="ruleForm.filterType"
                        clearable
                        placeholder="请选择投放范围"
                        @change="rangeChange"
                    >
                        <el-option label="全部" :value="0" />
                        <el-option label="部分货柜" :value="1" />
                        <el-option label="黑名单" :value="2" />
                        <el-option label="城市" :value="3" />
                        <el-option label="场景" :value="4" />
                    </el-select> -->
                    <el-radio-group v-model="ruleForm.filterType" @change="rangeChange">
                        <el-radio :label="0">全部</el-radio>
                        <el-radio :label="1">部分货柜</el-radio>
                        <el-radio :label="2">黑名单</el-radio>
                        <el-radio :label="3">城市</el-radio>
                        <el-radio :label="4">场景</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 省市区 -->
                <div v-if="proviceList.length>0">
                    <el-form-item v-show="ruleForm.busiCode === 'A1001006'" label="选择地址" prop="filterType">
                        <el-row type="flex" :gutter="20">
                            <el-col :span="7">
                                <el-form-item prop="provinceCode">
                                    <el-select v-model="dataState.provinceName" placeholder="省份" @change="cahngeProvice" clearable class="input-line" :disabled="ruleForm.filterType !== 3">
                                        <el-option v-for="el in proviceList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item prop="cityCode">
                                    <el-select v-model="dataState.cityName" placeholder="城市" @change="changeCity" clearable class="input-line" :disabled="ruleForm.filterType !== 3">
                                        <el-option v-for="el in cityList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item prop="districtCode">
                                    <el-select v-model="dataState.districtName" placeholder="区县" clearable class="input-line" :disabled="ruleForm.filterType !== 3">
                                        <el-option v-for="el in districtList" :label="el.addressName" :value="{ value: el.addressCode, label: el.addressName }" :key="el.addressCode" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-button type="primary" @click="addTabList" :disabled="ruleForm.filterType !== 3">+</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </div>
                <!-- 省市区显示 -->
                <el-form-item v-show="ruleForm.busiCode === 'A1001006'" prop="filterType">
                    <div class="tab-outter">
                        <el-tag
                            :disabled="ruleForm.filterType !== 3"
                            v-for="(index, tag) of ruleForm.addrList"
                            :key="tag"
                            closable
                            :type="tag"
                            @close="deleteTabListSel(tag)">
                            {{tag}}
                        </el-tag>
                    </div>
                </el-form-item>
                <!-- 货柜、黑名单输入框 -->
                <el-form-item v-if="ruleForm.busiCode === 'A1001006'" prop="filterType">
                    <el-input
                        :disabled="ruleForm.filterType !== 1"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容。可输入多组，使用英文','分割。"
                        oninput ="value=value.replace(/，/g,',')"
                        v-model="ruleForm.textarea">
                    </el-input>
                </el-form-item>
                <el-form-item v-if="ruleForm.busiCode === 'A1001006'" prop="filterType">
                    <el-input
                        :disabled="ruleForm.filterType !== 2"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容。可输入多组，使用英文','分割。"
                        oninput ="value=value.replace(/，/g,',')"
                        v-model="ruleForm.blackList">
                    </el-input>
                </el-form-item>
                <!-- 场景 -->
                <el-form-item v-show="ruleForm.busiCode === 'A1001006'" label="选择场景" prop="filterType">
                    <el-col :span="7">
                        <el-select v-model="dataState.sceneSel" placeholder="选择场景" clearable class="input-line" :disabled="ruleForm.filterType !== 4">
                            <el-option v-for="(el, index) of dataState.scene" :label="el" :value="{value: index, label: el}" :key="el" />
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="addSceneList" :disabled="ruleForm.filterType !== 4">+</el-button>
                    </el-col>
                </el-form-item>
                <!-- 场景显示 -->
                <el-form-item v-show="ruleForm.busiCode === 'A1001006'" prop="filterType">
                    <div class="tab-outter">
                        <el-tag
                            :disabled="ruleForm.filterType !== 4"
                            v-for="tag in ruleForm.sceneIndex"
                            :key="tag"
                            closable
                            :type="tag"
                            @close="deleteSceneList(tag)">
                            {{tag}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item v-if="ruleForm.busiCode === 'A1001006'" label="投放类型" prop="useType">
                    <el-radio-group v-model="ruleForm.useType" :disabled="props.type === 'detail'" @change="useTypeChange">
                        <el-radio :label="2">广告</el-radio>
                        <el-radio :label="1">运营</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="ruleForm.busiCode === 'A1001006' && ruleForm.useType === 2" label="广告位ID" prop="targetId">
                    <el-input v-model="ruleForm.targetId" placeholder="请输入广告位ID" maxlength="50"/>
                </el-form-item>
                <el-form-item v-if="ruleForm.busiCode === 'A1001' || ruleForm.useType === 1" label="上传图片" prop="imgUrl">
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :show-file-list="true"
                        list-type="picture-card"
                        :limit="1"
                        accept=".jpg,.jpeg,.png,.gif"
                        :on-exceed="handleExceed"
                        :before-upload="beforeAvatarUpload"
                        :http-request="fileRequest"
                        :on-remove="handleRemove"
                    >
                        <img v-if="ruleForm.imgUrl.length" :src="ruleForm.imgUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                        <template #tip>
                            <div class="el-upload__tip">
                                建议尺寸760*260PX，建议最大不超过300k
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item v-if="ruleForm.busiCode === 'A1001' || ruleForm.useType === 1" label="选择跳转方式" prop="jumpType">
                    <el-select
                        v-model="ruleForm.jumpType"
                        clearable
                        placeholder="请选择跳转方式"
                        @change="bankChange"
                    >
                        <el-option label="无" :value="1" />
                        <el-option label="Url跳转" :value="0" />
                        <el-option label="小程序跳转" :disabled="ruleForm.busiCode === 'A1001' && ruleForm.displaySite !== 'HOME_BANNER'" :value="2" />
                    </el-select>
                </el-form-item>
                <!-- URL 跳转 -->
                <el-form-item v-if="ruleForm.jumpType === 0" label="添加URL" prop="targetUrl">
                    <el-input v-model="ruleForm.targetUrl" placeholder="请添加url" maxlength="200"/>
                </el-form-item>
                <template v-if="ruleForm.jumpType === 2">
                    <el-form-item  label="小程序原始ID" prop="appletInfo.appletId">
                        <el-input v-model="ruleForm.appletInfo.appletId" maxlength="500" placeholder="请输入小程序原始ID"/>
                    </el-form-item>
                    <el-form-item label="小程序页面地址参数" prop="appletInfo.path">
                        <el-input v-model="ruleForm.appletInfo.path" maxlength="500" placeholder="请输入小程序页面地址参数"/>
                    </el-form-item>
                    <el-form-item label="小程序环境编号" prop="appletInfo.appletType">
                        <el-select
                            v-model="ruleForm.appletInfo.appletType"
                            clearable
                            placeholder="请选择小程序环境编号"
                        >
                            <el-option label="正式版" :value="0" />
                            <el-option label="开发版" :value="1" />
                            <el-option label="体验版" :value="2" />
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item label="是否启用" prop="status">
                    <el-select
                        v-model="ruleForm.status"
                        placeholder="请选择状态"
                    >
                        <el-option label="是" :value="1" />
                        <el-option label="否" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="ruleForm.busiCode === 'A1001'" label="排序" prop="sort">
                    <el-input v-model="ruleForm.sort" placeholder="请输入banner排序"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
                    <el-button @click="close">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script setup>
import { reactive, ref, computed, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { postUpload } from '@/api/marketing/marketing-cost'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { formRule, busiCodeList, AppDisplaySite, wxAppDisplaySite, shopH5DisplaySite } from './index'
import { bannerAddList, bannerUpdate, detailEdit } from '@/api/banner'
import { getMerchantList } from '@/api/operate/index'
import { de } from 'element-plus/es/locale'
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
    resourceCode: String
})

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const loadingInstance = ref(null)
const emits = defineEmits(['update:modelValue', 'gitList'])
const oldData = ref(null)
const router = useRouter()
const result = reactive({
    fileList: [],
    hideUpload: false,
    isLoading: false
})

// 地址选择
const authorityRef = ref(null)

const displaySite = ref(AppDisplaySite)

const ruleFormRef = ref()

const close = () => {
    emits('update:modelValue', false)
    emits('getList')
}
const dataState = reactive({
    areaCheckedNodes: [],
    tagList: [],
    provinceCode: '', // 省份编号
    provinceName: '', // 省份名称
    cityCode: '', // 城市编号
    cityName: '', // 城市名称
    districtCode: '', // 区县编号
    districtName: '', // 区县名称
    scene: { 1: '4S店', 2: '办公场所', 3: '本地生活', 4: '非盈利', 5: '工厂', 6: '交通枢纽', 7: '酒店', 8: '商超购物', 9: '社区公寓', 10: '学校', 11: '医院', 12: '政企单位' }, // 地区选项
    sceneSel: '', // 地区
    sceneList: []
})
// 表单数据
const ruleForm = ref({
    appKey: 'A1001001',
    id: null,
    title: '', // banner 名称
    creatorId: userInfo.value.name,
    sceneCode: 'A1001004',
    busiCode: 'A1001', // 业务线
    displaySite: '', // 展示位置
    imgUrl: '', // banner 图
    status: null, // 是否可用
    targetUrl: null, // 跳转url
    sort: 1, // 排序
    value: 'A1001',
    filterType: 0, // 投放范围
    useType: 1, // 投放类型
    targetId: '', // 广告ID
    jumpType: 1, // 跳转类型
    appletInfo: { // 小程序信息
        appletId: '', // 小程序原始ID
        appletType: 0, // 小程序版本0: 正式版， 1:开发版， 2:体验版
        path: '' // 小程序跳转路径
    },
    time: [],
    addrList: {}, // 地址选择集合
    addr: [], // 地址选择集合
    // sceneList: {}, // 地区选择集合
    sceneIndex: [],
    textarea: '', // 货柜
    blackList: '' // 黑名单
})

const init = async () => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001',
        resourceCode: props.resourceCode
    }
    if (props.type === 'add') {
        return null
    } else {
        const res = await detailEdit(params)
        if (res.code === '200') {
            Object.assign(ruleForm.value, res.data)
            ruleForm.value.title = res.data.title
            ruleForm.value.id = res.data.id
            ruleForm.value.displaySite = res.data.displaySite
            ruleForm.value.appKey = res.data.appKey
            ruleForm.value.imgUrl = res.data.imgUrl
            ruleForm.value.status = res.data.status
            ruleForm.value.busiCode = res.data.busiCode
            ruleForm.value.sort = res.data.sort
            ruleForm.value.targetUrl = res.data.targetUrl
            ruleForm.value.jumpType = res.data.jumpType
            // ruleForm.value.appletInfo.appletId = res.data.appletInfo?.appletId || ''
            // ruleForm.value.appletInfo.path = res.data.appletInfo?.path || ''
            // ruleForm.value.appletInfo.appletType = res.data.appletInfo?.appletType || 0
            ruleForm.value.appletInfo = {
                appletId: res.data.appletInfo?.appletId || '',
                path: res.data.appletInfo?.path || '',
                appletType: res.data.appletInfo?.appletType || 0
            }
            ruleForm.value.blackList = res.data.filterContent.blackList
            ruleForm.value.textarea = res.data.filterContent.whiteList
            // antisequenceSceneList(res.filterContent.sceneNameList)
            ruleForm.value.sceneIndex = res.data.filterContent.sceneList
            antisequenceCityList(res.data.filterContent.areaNameList)
            if (res.data.startTime && res.data.endTime) {
                ruleForm.value.time = [res.data.startTime, res.data.endTime]
            }
            // if (res.data.busiCode === 'A1001') {
            //     displaySite.value = AppDisplaySite
            // } else {
            //     displaySite.value = wxAppDisplaySite
            // }
            switch (res.data.busiCode) {
            case 'A1001':
                displaySite.value = AppDisplaySite
                break
            case 'A1001006':
                displaySite.value = wxAppDisplaySite
                break
            case 'A1001005':
                displaySite.value = shopH5DisplaySite
                break
            default:
            }
        }
    }
}
init()
const dialogTitle = computed(() => {
    let title = ''
    if (props.type === 'add') {
        title = '新增'
    } else if (props.type === 'edit') {
        title = '编辑'
    }
    return title
})
const rangeChange = (val) => {
    const form = ruleForm.value
    if (val === 0) {
        form.addrList = {}
        form.addr = []
        dataState.tagList = []
        form.sceneIndex = []
        form.textarea = ''
        form.blackList = ''
        dataState.provinceName = ''
        dataState.cityName = ''
        dataState.districtName = ''
        dataState.sceneSel = ''
    } else if (val === 1) {
        form.addrList = {}
        form.addr = []
        dataState.tagList = []
        form.sceneIndex = []
        form.blackList = ''
        dataState.provinceName = ''
        dataState.cityName = ''
        dataState.districtName = ''
        dataState.sceneSel = ''
    } else if (val === 2) {
        form.addrList = {}
        form.addr = []
        dataState.tagList = []
        form.sceneIndex = []
        form.textarea = ''
        dataState.provinceName = ''
        dataState.cityName = ''
        dataState.districtName = ''
        dataState.sceneSel = ''
    } else if (val === 3) {
        form.sceneIndex = []
        form.textarea = ''
        form.blackList = ''
        dataState.sceneSel = ''
    } else if (val === 4) {
        form.addrList = {}
        form.addr = []
        dataState.tagList = []
        form.textarea = ''
        form.blackList = ''
        dataState.provinceName = ''
        dataState.cityName = ''
        dataState.districtName = ''
    }
}
const busiChange = (val) => {
    ruleForm.value.displaySite = ''
    // if (val === 'A1001') {
    //     displaySite.value = AppDisplaySite
    //     ruleForm.value.sceneCode = 'A1001004'
    // } else {
    //     displaySite.value = wxAppDisplaySite
    //     ruleForm.value.sceneCode = val
    // }
    switch (val) {
    case 'A1001':
        displaySite.value = AppDisplaySite
        break
    case 'A1001006':
        displaySite.value = wxAppDisplaySite
        break
    case 'A1001005':
        displaySite.value = shopH5DisplaySite
        break
    default:
    }
    console.log(ruleForm.value, val, 'val')
    ruleForm.value.jumpType = 1
}
const displaySiteChange = (val) => {
    if (val !== 'HOME_BANNER' && ruleForm.value.jumpType === 2) {
        ruleForm.value.jumpType = 1
    }
}
// 反序列场景
// const antisequenceSceneList = (data = []) => {
//     data = JSON.parse(data[0])
//     const form = ruleForm.value
//     let a
//     for (a in data) {
//         dataState.sceneList.push(a)
//         form.sceneIndex.push(data[a])
//         form.sceneList[a] = data[a]
//     }
// }
// 反序列城市
const antisequenceCityList = (data = []) => {
    data = JSON.parse(data[0])
    const form = ruleForm.value
    let a
    for (a in data) {
        dataState.tagList.push(a)
        form.addr.push(data[a])
        form.addrList[a] = data[a]
    }
}
// 场景添加
const addSceneList = () => {
    const form = ruleForm.value
    const index = form.sceneIndex.indexOf(dataState.sceneSel.label)
    if (index < 0) {
        form.sceneIndex.push(dataState.sceneSel.label)
        // form.sceneIndex.push(dataState.sceneSel.value)
        // form.sceneList[dataState.sceneSel.label] = dataState.sceneSel.value
    }
}
// 删除场景
const deleteSceneList = (val) => {
    const index = dataState.sceneList.indexOf(val)
    // dataState.sceneList.splice(index, 1)
    ruleForm.value.sceneIndex.splice(index, 1)
    // delete ruleForm.value.sceneList[val]
}
// 获取省列表
const getProviceList = async () => {
    const res = await getAllList(1, 0)
    proviceList.value = res.addressList
}
// 市
const cahngeProvice = async (val) => {
    if (dataState.provinceName?.value) {
        const res = await getAllList(2, val.value)
        cityList.value = res.addressList
        dataState.cityName = ''
        dataState.districtName = ''
    }
}
// 县
const changeCity = async (val) => {
    if (dataState.cityName?.value) {
        const res = await getAllList(3, val.value)
        districtList.value = res.addressList
        dataState.districtName = ''
    }
}
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
// 获取地址选项
getProviceList()
// 添加城市
const addTabList = () => {
    if (!dataState.cityName.label) {
        ElMessage({
            message: '至少添加至市一级！',
            type: 'error'
        })
        return
    }
    const label = [dataState.provinceName.label, dataState.cityName.label, dataState.districtName.label]
    const value = [dataState.provinceName.value, dataState.cityName.value, dataState.districtName.value]
    const index = dataState.tagList.indexOf(label.join('/'))
    if (index < 0) {
        dataState.tagList.push(label.join('/'))
        // dataState.districtName.value ? ruleForm.value.addr.push(dataState.districtName.value) : ruleForm.value.addr.push(dataState.cityName.value)
        ruleForm.value.addrList[label.join('/')] = value.join(',')
        ruleForm.value.addr = []
        for (const a in ruleForm.value.addrList) {
            const t = ruleForm.value.addrList[a].split(',')
            if (t) {
                ruleForm.value.addr.push(t[t.length - 1])
            }
        }
    }
}
// 删除选择
const deleteTabListSel = (val) => {
    const index = dataState.tagList.indexOf(val)
    dataState.tagList.splice(index, 1)
    ruleForm.value.addr.splice(index, 1)
    delete ruleForm.value.addrList[val]
}
// 上传拦截
const beforeAvatarUpload = (rawFile) => {
    const types = ['image/jpeg', 'image/jpg', 'image/png']
    const isJPG = types.includes(rawFile.type)
    if (!isJPG) {
        ElMessage({
            message: '上传图片只能是 jpg/png 格式!',
            type: 'error'
        })
        return false
    }
    if (rawFile.size > 300 * 1024) {
        ElMessage({
            message: '建议上传图片大小不能超过 300k!',
            type: 'error'
        })
        return false
    }
    return true
}

// 上传文件
const fileRequest = async (file) => {
    const formData = new FormData()
    formData.append('file', file.file)
    const res = await postUpload(formData)
    if (res.code === '200') {
        ruleForm.value.imgUrl = res.data
    } else {
        result.fileList = []
        ruleForm.value.imgUrl = ''
    }
    console.log(ruleForm.value, ' ruleForm.value.')
}
const handleExceed = (files) => {
    fileRequest({ file: files[0] })
}
const handleRemove = () => {
    ruleForm.value.imgUrl = []
}
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            props.type === 'add' ? onNewly() : onEdit()
        }
    })
}
const onNewly = async () => {
    const params = {
        ...ruleForm.value,
        filterContent: {
            areaList: ruleForm.value.addr,
            blackList: typeof ruleForm.value.blackList === 'string' ? ruleForm.value.blackList.split(',') : ruleForm.value.blackList,
            sceneList: ruleForm.value.sceneIndex,
            whiteList: typeof ruleForm.value.textarea === 'string' ? ruleForm.value.textarea.split(',') : ruleForm.value.textarea,
            areaNameList: [JSON.stringify(ruleForm.value.addrList)]
        },
        startTime: ruleForm.value.time.length ? ruleForm.value.time[0] : '',
        endTime: ruleForm.value.time.length ? ruleForm.value.time[1] : '',
        sceneCode: busiCodeList.find(el => el.value === ruleForm.value.busiCode).sceneCode
        // sceneCode: 'A1001004'
        // busiCode: 'A1001'
    }
    console.log(params)
    const { code } = await bannerAddList(params)
    if (code === '200') {
        ElMessage.success('新增成功')
        close()
    }
}
const bankChange = (val) => {
    console.log(val, 'val')
    if (val !== 2) {
        ruleForm.value.appletInfo = {
            appletId: '', // 小程序原始ID
            appletType: 0, // 小程序版本0: 正式版， 1:开发版， 2:体验版
            path: '' // 小程序跳转路径
        }
    }
    if (val !== 0) {
        ruleForm.value.targetUrl = ''
    }
}
// 投放类型切换
const useTypeChange = val => {
    console.log(val, 'val')
    ruleForm.value.jumpType = 1
}
const onEdit = async () => {
    const params = {
        ...ruleForm.value,
        filterContent: {
            areaList: ruleForm.value.addr,
            blackList: typeof ruleForm.value.blackList === 'string' ? ruleForm.value.blackList.split(',') : ruleForm.value.blackList,
            sceneList: ruleForm.value.sceneIndex,
            whiteList: typeof ruleForm.value.textarea === 'string' ? ruleForm.value.textarea.split(',') : ruleForm.value.textarea,
            areaNameList: [JSON.stringify(ruleForm.value.addrList)]
        },
        appKey: 'A1001001',
        busiCode: 'A1001',
        startTime: ruleForm.value.time.length ? ruleForm.value.time[0] : '',
        endTime: ruleForm.value.time.length ? ruleForm.value.time[1] : '',
        // sceneCode: 'A1001004',
        sceneCode: busiCodeList.find(el => el.value === ruleForm.value.busiCode).sceneCode,
        modifierId: userInfo.value.name,
        resourceCode: props.resourceCode
    }
    const res = await bannerUpdate(params)
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
const imgUrl = ref('')
const resetForm = (formEl) => {
    if (ruleFormRef.value) {
        ruleFormRef.value.resetFields()
    }
}

</script>
<style lang="scss" scoped>
.tab-outter{
    min-height: 100px;
    width: 80%;
    padding: 6px;
    box-sizing: border-box;
    border: 1px solid #8c939d;
    border-radius: 5px;
}
.avatar-uploader {
    :deep(.el-upload-list__item) {
        display: none;
    }
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload-list__item {
    display: none !important;
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
    width: 150px;
    height: 150px;
}
.avatar-uploader img {
    width: 150px;
    height: 150px;
}
</style>
