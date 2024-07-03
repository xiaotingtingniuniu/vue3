<template>
    <div class="subaccount-list">
        <div class="submit-box">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="right" label-width="150px">
                <el-row v-if="props.handleType === 'check'">
                    <el-col :span="24">
                        <el-form-item label="审核意见：" prop="auditStatus">
                            {{ storeStatusKeyValue[ruleForm.auditStatus] }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="审核说明：" prop="remark">
                            {{ ruleForm.remark }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="title-top">
                    <div class="line"></div>
                    <div>店铺基本信息</div>
                </div>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="店铺名称：" prop="storeName" :rules="rules.storeName">
                            <el-input class="form-action-item-50w" v-model="ruleForm.storeName" placeholder="请输入店铺名称" clearable :disabled="props.handleType === 'check'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客服电话" prop="phoneMobile" :rules="rules.phoneMobile">
                            <el-input class="form-action-item-50w" v-model="ruleForm.phoneMobile" placeholder="请输入客服电话" clearable :disabled="props.handleType === 'check'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="店铺联系人：" props="contacts">
                            <el-input v-model="ruleForm.contacts" placeholder="请输入店铺联系人" clearable :maxlength="100" :disabled="props.handleType === 'check'" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="联系人电话：" prop="contactsPhone">
                            <el-input class="form-action-item-50w" v-model="ruleForm.contactsPhone" placeholder="请输入店铺联系人电话" clearable :disabled="props.handleType === 'check'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="店铺地址" prop="limitedCitys" :rules="rules.select">
                            <el-cascader
                                ref="areaRef"
                                :props="goodsCannotSkuArea"
                                @change="skuAreaChange"
                                v-model="ruleForm.limitedCitys"
                                class="form-action-item-50w"
                                v-if="areaRefVisiable"
                                :collapse-tags="true"
                                clearable
                                :disabled="props.handleType === 'check'"
                            />
                            <el-input class="form-action-item-50w" v-model="ruleForm.storeAddr" placeholder="请输入详细地址" clearable :disabled="props.handleType === 'check'">
                                <template #append>
                                    <el-button @click="searchArea">查询坐标</el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="店铺坐标：" prop="coordinate" :rules="rules.storeDesc">
                            <el-input class="for1am-action-item-50w" v-model="ruleForm.coordinate" placeholder="点击地图获取" clearable disabled />
                        </el-form-item>
                        <div id="allmap" class="map"></div>
                    </el-col>
                </el-row>

                <el-form-item label="店铺描述：" prop="storeDesc" :rules="rules.storeDesc" style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.storeDesc" placeholder="请输入店铺描述" clearable :disabled="props.handleType === 'check'" />
                </el-form-item>
                <div class="title-top">
                    <div class="line"></div>
                    <div>店铺经营信息</div>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="店铺品类：" prop="category">
                            <el-cascader
                                v-model="ruleForm.category"
                                :options="options"
                                :props="{ value: 'cateCode', label: 'cateName', children: 'childList', multiple: true }"
                                @change="handleChange"
                                :disabled="props.handleType === 'check'"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="免运费订单金额" prop="freeOrderAmount" :rules="rules.freeOrderAmount">
                            <el-input class="form-action-item-50w" v-model="ruleForm.freeOrderAmount" placeholder="请输入金额" clearable :disabled="props.handleType === 'check'">
                                <template #append>元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="店铺起订金额：" props="minimumAmount">
                            <el-input v-model="ruleForm.minimumAmount" placeholder="请输入起订金额" clearable :maxlength="100" :disabled="props.handleType === 'check'">
                                <template #append>元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="营业状态：" prop="businessStatus">
                            <el-select v-model="ruleForm.businessStatus" clearable placeholder="请选择" :disabled="props.handleType === 'check'">
                                <el-option label="营业中" :value="1" />
                                <el-option label="休息中" :value="2" />
                                <el-option label="暂停营业" :value="3" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="营业时间：" prop="businessTimeType">
                            <el-radio-group v-model="ruleForm.businessTimeType" :disabled="props.handleType === 'check'">
                                <el-radio :label="1">24小时营业</el-radio>
                                <el-radio :label="2">固定时间营业</el-radio>
                            </el-radio-group>
                            <span
                                style="color: #fe2c55; font-size: 12px; cursor: pointer; display: inline-block; padding-left: 10px"
                                @click="addDomain(ruleFormRef)"
                                v-if="ruleForm.getbusinessTimeList.length <= 5 && props.handleType !== 'check'"
                            >
                                添加
                            </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" v-if="ruleForm.businessTimeType === 2">
                        <el-form-item label="" v-for="(domain, index) in ruleForm.getbusinessTimeList" :key="domain.key" :prop="'domains.' + index" :rules="rules.timePicker">
                            <el-row>
                                <el-col :span="20">
                                    <el-time-picker
                                        v-model="domain.value"
                                        is-range
                                        range-separator="～"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        :disabled="props.handleType === 'check'"
                                        value-format="HH:mm:ss"
                                        @change="timePickerChange"
                                        style="width: 200px"
                                    />
                                </el-col>
                                <el-col :span="4">
                                    <span
                                        style="color: #fe2c55; font-size: 12px; cursor: pointer; display: inline-block; padding-left: 10px"
                                        @click="removeDomain(index)"
                                        v-if="ruleForm.getbusinessTimeList.length > 1 && props.handleType !== 'check'"
                                    >
                                        删除
                                    </span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="店铺服务：" prop="storeService" style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.storeService" placeholder="请输入店铺服务" clearable :disabled="props.handleType === 'check'" />
                </el-form-item>
                <div class="title-top">
                    <div class="line"></div>
                    <div>店铺标签</div>
                </div>
                <el-form-item label="店铺标签：" prop="tagIdList" style="width: 450px">
                    <el-select v-model="ruleForm.tagIdList" clearable placeholder="请选择" multiple :disabled="props.handleType === 'check'">
                        <el-option v-for="item in labelOption" :key="item.id" :label="item.tagName" :value="item.id" />
                    </el-select>
                </el-form-item>
                <div class="title-top">
                    <div class="line"></div>
                    <div>店铺装修</div>
                </div>
                <el-form-item label="店铺LOGO" prop="imgList">
                    <el-upload class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess" :http-request="beforeAvatarUploada">
                        <el-image v-if="coverImg" style="width: 100px; height: 100px" :src="coverImg" />
                        <div v-else class="addImage">
                            <el-icon><Plus /></el-icon>
                            <p style="color: #666; margin-top: 6px; margin-bottom: 12px">点击添加</p>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="店铺门脸图：" props="storeCoverList">
                    <cst-upload
                        :limit="3"
                        :multiple="false"
                        v-model:fileList="ruleForm.storeCoverList"
                        accept=".jpg,.png,.jpeg"
                        @delete="uploadDel"
                        :disabled="props.handleType === 'check'"
                        tip="支持扩展名：jpg,jpeg,png,文件最大不超过2M"
                    />
                </el-form-item>
                <el-form-item label="店铺环境图：" props="environmentPicList">
                    <cst-upload
                        :limit="8"
                        :multiple="false"
                        v-model:fileList="ruleForm.environmentPicList"
                        accept=".jpg,.png,.jpeg"
                        @delete="uploadDel"
                        :disabled="props.handleType === 'check'"
                        tip="支持扩展名：jpg,jpeg,png,文件最大不超过2M"
                    />
                </el-form-item>
            </el-form>
            <div class="footer">
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm(ruleFormRef)" v-if="props.handleType !== 'check'"> 提交审核 </el-button>
                    <el-button @click="goBack"> 取消 </el-button>
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted, toRefs, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CstUpload from './comments/upload.vue'
// import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { update, getLabelList } from '@/api/operate/index.js'
import { getshopDetail, addStoreInfo, updateStoreInfo, storeCategoryInfo, getAddresss, getprocessDetail, getstoreDetail, getstoretypeDetail } from '../../../api/marketing/marketingApply.js'
// import { createStore, getMainTagList, getAddresss, storeCategoryInfo, getS
import { cityQueryCategory } from '@/utils'
import { useStore } from 'vuex'
const props = defineProps(['handleType', 'storeCode', 'busiMerchantId', 'type', 'id'])
const router = useRouter()

const store = useStore()
const route = useRoute()
const userInfo = computed(() => store.state.userInfo)
const mapKey = process.env.VUE_APP_MAPKEY

const storeStatusKeyValue = ref({ 2: '未审核', 3: '通过', 4: '未通过' })
const dataState = reactive({
    goodsList: [],
    firstChannelList: [],
    secondChannelList: [],
    goodsDetail: {},
    areaCheckedNodes: [],
    applyClassifyCheckedNodes: [],
    limitedCitys: [], // 城市回显
    busiCatesList: [], // 应用类目回显
    areaRefVisiable: true,
    applyClassifyVisiable: false,
    labelOption: []
})
const { areaRefVisiable, labelOption } = toRefs(dataState)
onMounted(async () => {
    console.log(props.storeCode, 'props.storeCode')
    await initMap()
    // await storeTagInfo()
    await getStoreCategoryInfo()
    // await getLabs()
    await queryLabelList()
    if (props.handleType !== 'add') {
        await getStoreInfoDetail()
    }
    // await queryLabelList()
})

// 详情
const getStoreInfoDetail = async () => {
    markerArr.value = []
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        storeCode: route.params.storeCode
    }
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        id: route.params.storeCode
    }
    const res = route.params.type === 'manage' ? await getshopDetail(param) : await getprocessDetail(params)
    ruleForm.value.limitedRegionList = []
    if (res.code === '200') {
        Object.assign(ruleForm.value, res.data)
        const cityInfo = [res.data.provinceCode, res.data.cityCode, res.data.districtCode]
        ruleForm.value.limitedCitys = cityInfo
        ruleForm.value.limitedRegionList.push({
            provinceCode: res.data.provinceCode,
            provinceName: res.data.provinceName,
            cityCode: res.data.cityCode,
            cityName: res.data.cityName,
            districtCode: res.data.districtCode,
            districtName: res.data.districtName
        })
        dataState.areaRefVisiable = false
        setTimeout(() => {
            dataState.areaRefVisiable = true
        }, 100)
        ruleForm.value.coordinate = '经度：' + res.data.longitude + '   ' + '纬度：' + res.data.latitude
        ruleForm.value.locationData.longitude = res.data.longitude
        ruleForm.value.locationData.latitude = res.data.latitude
        ruleForm.value.category = res.data.categoryIdList
        coverImg.value = res.data.storeLogo
        ruleForm.value.imgList = coverImg.value
        if (res.data.storeCover && res.data.storeCover !== '') {
            const list = ruleForm.value.storeCover.split(',')
            list.map((item) => {
                ruleForm.value.storeCoverList.push({
                    response: {
                        data: ruleForm.value.storeCover
                    }
                })
            })
        }
        if (res.data.environmentPic && res.data.environmentPic !== '') {
            const list = ruleForm.value.environmentPic.split(',')
            list.map((item) => {
                ruleForm.value.environmentPicList.push({
                    response: {
                        data: ruleForm.value.environmentPic
                    }
                })
            })
        }
        // 时间段
        if (res.data.businessTimeList && res.data.businessTimeList.length > 0) {
            res.data.businessTimeList.map((item, index) => {
                ruleForm.value.getbusinessTimeList.push({
                    key: index,
                    value: [item.startTime, item.endTime]
                })
            })
        } else {
            ruleForm.value.getbusinessTimeList.push({
                key: 0,
                value: []
            })
        }
        await getAddresssFn()
    }
}
// 获取标签列表数据
const queryLabelList = async () => {
    const params = {
        appKey: 'A1001000',
        page: 1,
        pageSize: 999
    }
    const res = await getLabelList(params)
    labelOption.value = res.data.list
}
// 返回批次列表
const goBack = async () => {
    router.back()
}
const ruleFormRef = ref('')

const ruleForm = ref({
    storeStatus: '',
    storeName: '', // 店铺名
    phoneMobile: '', // 手机号
    storeDesc: '', // 描述
    contacts: '', // 联系人
    contactsPhone: '', // 联系人电话
    storeAddr: '', // 详细地址
    coordinate: '', // 坐标
    freeOrderAmount: '', // 免运费订单金额
    minimumAmount: '', // 店铺起订金额
    businessStatus: '', // 营业状态
    storeService: '', // 店铺服务
    businessTimeType: '',
    imgList: '',
    auditStatus: '',
    remark: '',
    tagIdList: [],
    category: [],
    useDate: [],
    storeCoverList: [],
    limitedRegionList: [],
    environmentPicList: [],
    limitedCitys: [], // 地址
    locationData: {
        longitude: '',
        latitude: ''
    },
    businessTimeList: [], // 固定时间时间段
    getbusinessTimeList: [] // 固定时间时间段，组件数据
})

const areaRef = ref(null)
const goodsCannotSkuArea = {
    lazy: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await cityQueryCategory(level + 1, data.value || '')
        const nodes = res.map((item) => {
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
const skuAreaChange = (value) => {
    dataState.areaCheckedNodes = areaRef.value.getCheckedNodes(true)
    ruleForm.value.limitedRegionList = []
    dataState.areaCheckedNodes.forEach((item) => {
        ruleForm.value.limitedRegionList.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1],
            districtCode: item.pathValues[2],
            districtName: item.pathLabels[2]
        })
    })
}
// 商品表格校验规则：数值格式, 大于等于0
const timePickerValidator = (rule, value, callback) => {
    if (ruleForm.value.businessTimeType === '1') {
        return false
    }
    const index = rule.field.charAt(rule.field.length - 1)
    const currentTime = ruleForm.value.getbusinessTimeList[index].value.length === 0 ? null : ruleForm.value.getbusinessTimeList[index].value
    if (!currentTime) {
        callback(new Error('请选择时间'))
        return false
    }
    const currentTimeStart = Number(currentTime[0].replace(/:/g, ''))
    const currentTimeEnd = Number(currentTime[1].replace(/:/g, ''))
    ruleForm.value.getbusinessTimeList.map((item) => {
        const itemStart = Number(item.value[0].replace(/:/g, ''))
        const itemEnd = Number(item.value[1].replace(/:/g, ''))
        if (itemStart < currentTimeStart && currentTimeStart < itemEnd) {
            callback(new Error('时间重复'))
        } else if (itemStart < currentTimeEnd && currentTimeEnd < itemEnd) {
            callback(new Error('时间重复'))
        } else if (itemStart > currentTimeStart && currentTimeEnd > itemEnd) {
            callback(new Error('时间重复'))
        } else {
            callback()
        }
    })
}
const imgListValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请选择图片'))
    } else {
        callback()
    }
}
// 表单项规则
const rules = reactive({
    select: [{ required: true, message: '请选择', trigger: 'change' }],
    merchantSubType: [{ required: true, message: '请选择', trigger: 'change' }],
    storeName: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 50, message: '最长不超过50个字符长度', trigger: 'change' }
    ],
    storeDesc: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 200, message: '最长不超过200个字符长度', trigger: 'change' }
    ],
    phoneMobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
            pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/,
            message: '请输入正确的手机号码或者座机号'
        }
    ],
    freeOrderAmount: [
        { required: true, message: '请输入金额', trigger: 'blur' },
        { max: 5, message: '最长不超过5个字符长度', trigger: 'change' },
        {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: '请输入整数数字'
        }
    ],
    imgList: [{ required: true, validator: imgListValidator, trigger: 'change' }],
    timePicker: [{ required: true, validator: timePickerValidator, trigger: 'change' }]
})

// 店铺分类
const options = ref([])
const getStoreCategoryInfo = async () => {
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        busiMerchantId: props.busiMerchantId
    }
    const res = await storeCategoryInfo(param)
    if (res.code === '200') {
        options.value = res.data
    }
}
const handleChange = async (value) => {
    console.log(value, 'vbalu')
    getStoreCategoryInfo()
}

// const getLabs = async () => {
//     const param = {
//         appKey: 'A1001001',
//         busiMerchantId: userInfo.value.bisMerchantId
//     }
//     const res = await getMainTagList(param)
//     console.log(res)
// }

// 查询坐标
const searchArea = async () => {
    getAddresssFn()
}
// 地址解析
const getAddresssFn = async () => {
    markerArr.value = []
    if (ruleForm.value.storeAddr) {
        const res = await getAddresss({
            address: ruleForm.value.limitedRegionList[0].provinceName + ruleForm.value.limitedRegionList[0].cityName + ruleForm.value.limitedRegionList[0].districtName + ruleForm.value.storeAddr,
            key: mapKey
        })
        if (res.status === 0) {
            ruleForm.value.coordinate = '经度：' + res.result.location.lng + '   ' + '纬度：' + res.result.location.lat
            ruleForm.value.locationData.longitude = res.result.location.lng
            ruleForm.value.locationData.latitude = res.result.location.lat
            var myLatlng = new window.TMap.LatLng(res.result.location.lat, res.result.location.lng)
            map.value.setCenter(myLatlng)
            markerArr.value.push({
                id: 'demo',
                styleId: 'marker',
                position: new window.TMap.LatLng(res.result.location.lat, res.result.location.lng),
                properties: {
                    title: 'marker'
                }
            })
            await getMarker()
        } else {
            ruleForm.value.storeAddr = ''
            ElMessage.error(res.message)
        }
    } else {
        // ElMessage.error('请选择地址')
    }
}
// 添加时间段
const addDomain = () => {
    if (ruleForm.value.getbusinessTimeList.length >= 5) {
        ElMessage.error('最多添加5组时间')
        return
    }
    ruleForm.value.getbusinessTimeList.push({
        key: ruleForm.value.getbusinessTimeList.length,
        value: ''
    })
}
const removeDomain = (index) => {
    ruleForm.value.getbusinessTimeList.splice(index, 1)
}
const timePickerChange = (val) => {
    // const currentTimeStart = Number(val[0].replace(/:/g, ''))
    // const currentTimeEnd = Number(val[1].replace(/:/g, ''))
    // ruleForm.value.getbusinessTimeList.map(item => {
    //     const itemStart = Number(item.value[0].replace(/:/g, ''))
    //     const itemEnd = Number(item.value[1].replace(/:/g, ''))
    //     if (itemStart < currentTimeStart < itemEnd || itemStart < currentTimeEnd < itemEnd) {
    //         ElMessage.error('时间重复')
    //         return false
    //     }
    // })
}
const submitForm = (formEl) => {
    if (!formEl) return
    console.log(ruleForm.value, 'rule')
    formEl.validate(async (valid, fields) => {
        if (valid) {
            const storeCoverList = ruleForm.value.storeCoverList.map((item) => {
                return item.response.data
            })
            const environmentPicList = ruleForm.value.environmentPicList.map((item) => {
                return item.response.data
            })
            const param = {
                appKey: 'A1001000',
                busiCode: 'A1001000',
                busiMerchantId: props.busiMerchantId,
                ...ruleForm.value,
                provinceCode: ruleForm.value.limitedRegionList[0].provinceCode || '',
                provinceName: ruleForm.value.limitedRegionList[0].provinceName || '',
                cityCode: ruleForm.value.limitedRegionList[0].cityCode || '',
                cityName: ruleForm.value.limitedRegionList[0].cityName || '',
                districtCode: ruleForm.value.limitedRegionList[0].districtCode || '',
                districtName: ruleForm.value.limitedRegionList[0].districtName || '',
                mapType: 1,
                longitude: ruleForm.value.locationData.longitude || '',
                latitude: ruleForm.value.locationData.latitude || '',
                storeLogo: coverImg.value || '',
                categoryIdList: ruleForm.value.category || '',
                storeCover: storeCoverList.join(',') || '',
                environmentPic: environmentPicList.join(',') || '',
                creatorId: userInfo.value.name
            }
            delete param.storeCoverList
            delete param.environmentPicList
            if (props.handleType === 'edit') {
                const res = await updateStoreInfo(param)
                if (res.code === '200') {
                    ElMessage({
                        message: '成功',
                        type: 'success'
                    })
                    router.go(-1)
                }
            } else if (props.handleType === 'add') {
                const res = await addStoreInfo(param)
                if (res.code === '200') {
                    ElMessage({
                        message: '成功',
                        type: 'success'
                    })
                    router.go(-1)
                }
            }
        }
    })
}
// 上传图片
const coverImg = ref('')
const loadingstates = ref(false)
const handleAvatarSuccess = (response, file, fileList) => {
    loadingstates.value = false
}
// 文件格式验证
const beforeAvatarUploada = async (file) => {
    loadingstates.value = true
    const index = file.file.name.lastIndexOf('.')
    const extension = file.file.name.substr(index + 1)
    const extensionList = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'bmp', 'BMP']
    const isLt2M = file.file.size / 1024 / 1024 < 10
    if (!isLt2M) {
        ElMessage({
            message: '店铺LOGO不可超出10M',
            type: 'warning',
            center: true
        })

        return false
    } else if (extensionList.indexOf(extension) < 0) {
        ElMessage({
            message: '当前文件格式不支持',
            type: 'error',
            center: true
        })
        return false
    } else {
        const obj = new FormData()
        // 上传文件
        obj.append('file', file.file)
        // 上传文件接口
        const data = await update(obj)
        coverImg.value = data
        ruleForm.value.imgList = coverImg.value
        ruleFormRef.value.validate('imgList', async (valid, fields) => {})
    }
}

const map = ref(null)
const markerLayer = ref(null)
const markerArr = ref([])

// 地图默认展示
const initMap = async () => {
    const Bmap = window.TMap
    map.value = new Bmap.Map(document.getElementById('allmap'), {
        center: new Bmap.LatLng(39.984104, 116.307503),
        zoom: 12,
        rotation: 20, // 设置地图旋转角度
        pitch: 30 // 设置俯仰角度（0~45）
    })
    await getMarker()
}
const getMarker = async () => {
    // 添加新图层
    markerLayer.value = new window.TMap.MultiMarker({
        map: map.value,
        styles: {
            // 点标记样式
            marker: new window.TMap.MarkerStyle({
                width: 20, // 样式宽
                height: 30, // 样式高
                anchor: { x: 10, y: 30 } // 描点位置
            })
        },
        geometries: markerArr.value
    })
}
</script>
<style lang="scss" scoped>
.submit-box {
    .title-top {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 30px;
        font-size: 16px;
        font-weight: 700;
        .line {
            width: 5px;
            border-radius: 5px;
            background-color: dodgerblue;
            margin-right: 3px;
        }
    }
    #allmap {
        width: 800px;
        height: 300px;
    }
    .dictContentBox {
        width: 100%;
        width: 100%;
        .checkedItem {
            display: block;
        }
    }
    .form-text {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        color: #606266;
        font-size: 14px;
    }
    .form-text-btn {
        display: inline-block;
        margin-left: 5px;
        color: #fe2c55;
        cursor: pointer;
    }
    .footer {
        margin: 30px;
        text-align: left;
    }
}
.addImage {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
