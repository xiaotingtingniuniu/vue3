<template>
    <div class="seat-content add-seat-container">
        <van-nav-bar title="点位" fixed placeholder right-text="新增" @click-right="onEditItem('add')"> </van-nav-bar>
        <div class="detail-seat-list">
            <ul class="seat-list" v-for="(item, index) in list" :key="index">
                <li class="ul-li" @click="onDetail(index, item)">

                    <div class="icon" v-if="item.markstate">
                        <img src="@/assets/selected.png" />
                    </div>
                    <div class="icon" v-else></div>
                    <div class="content">
                        <p class="ul-title van-ellipsis">{{ item.locationName }}</p>
                        <div class="ul-desc van-ellipsis">
                            <!-- {{ item.address }} -->
                            <p class="ul-desc-content">{{ item.address }}</p>
                            <span class="ul-desc-edit" @click.stop="onEditItem('edit', index, item)">
                                <img :src="edit" alt="" class="title-name-image" />
                            </span>
                            <p class="mt2">关联设备数量: {{ item.associatedDeviceCount || 0 }}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 这是新增安装位置开始 -->
        <van-popup :lazy-render="false" class="wx-box-popup" ref="popups" v-model:show="showAddPopup" position="bottom" :style="{ height: '545px' }">
            <van-nav-bar :title="types === 'add' ? '新增点位' : '编辑点位'" @click-left="showAddPopup = false">
                <template #left>
                    <van-icon :name="closeImg" size="18" />
                </template>
                <template #right>
                    <div class="nav-right-icon" @click="btnSave">保存</div>
                </template>
            </van-nav-bar>

            <van-form ref="Form" label-width="120px">
                <van-cell-group inset>
                    <van-field v-model="addData.locationName" name="locationName" label="点位名称" placeholder="请输入点位名称" required :rules="[{ required: true, message: '请输入点位名称' }]" />
                    <van-field v-model="result" is-link readonly name="area" label="地区选择" placeholder="请选择地区" required :rules="[{ required: true, message: '请选择地区' }]" @click="show = true" />

                    <van-popup v-model:show="show" :lazy-render="false" position="bottom" :style="{ height: '540px' }">
                        <van-cascader v-model="cascaderValue" style="height: 100%" title="请选择所在地区" v-if="areaList" :options="areaList" @close="show = false" @finish="onFinish" @change="onChange" />
                    </van-popup>
                    <van-field v-model="addData.address" name="address" label="详细地址" placeholder="请输入详细地址" required :rules="[{ required: true, message: '请输入详细地址' }]" />
                    <van-field v-model="addData.placement" name="placement" label="摆放位置" placeholder="请输入" required :rules="[{ required: true, message: '请输入摆放位置' }]" />
                    <van-field v-model="lnglat" readonly name="locationName" label="经纬度" placeholder="请输入经纬度" required @update:model-value="handleChangeLngLat" :rules="[{ required: true, message: '请输入经纬度' }]" />
                    <van-field is-link readonly v-model="deviceResult" name="firstScenesName" label="点位场景" placeholder="请选择点位场景" required :rules="[{ required: true, message: '请选择点位场景' }]" @click="handleScene" />
                    <van-popup v-model:show="shows" :lazy-render="false" :style="{ height: '72%' }" position="bottom">
                        <van-cascader v-model="addData.secondScenesName" title="请选择所在地区" v-if="areaLists" :options="areaLists" @close="shows = false" @finish="onFinishs" @change="onChanges" />
                    </van-popup>
                    <van-field readonly v-model="customTel" is-link label="消费者客服电话" placeholder="请输入消费者客服电话" @click="handleDeviceSetting"/>
                    <van-popup v-model:show="deviceSetting" position="bottom" closeable close-icon="close" close-icon-position="top-left" style="height: 67%">
                        <van-form @submit="handleSmtCustomTel">
                            <div class="setting">
                                <div class="seting-title">
                                    <van-button plain color="#FE7E41" native-type="submit" style="border: 0; color: #fff" disabled>确认</van-button>
                                    <h3>配置消费者客服电话</h3>
                                    <van-button plain color="#FE7E41" native-type="submit" style="border: 0">保存</van-button>
                                </div>
                                <div class="setting-content">
                                    <div class="open-type">
                                        <div class="merchant card">
                                            <van-cell-group class="guizhu-cell-group">
                                                <el-form>
                                                    <van-field name="radio">
                                                        <template #input>
                                                            <van-radio-group v-model="customizedCustomer" direction="horizontal">
                                                                <div style="display: flex">
                                                                    <span class="configw">自定义消费者客服电话</span>
                                                                    <van-radio :name="1" checked-color="#ee0a24" icon-size="16px">
                                                                        <template #icon="props">
                                                                            <img class="img-icon img-icon-left" :src="props.checked ? Checkn : Unchecked" />
                                                                        </template>
                                                                        启用
                                                                    </van-radio>
                                                                    <van-radio :name="0" checked-color="#ee0a24" icon-size="16px">
                                                                        <template #icon="props">
                                                                            <img class="img-icon" :src="props.checked ? Checkn : Unchecked" />
                                                                        </template>
                                                                        关闭
                                                                    </van-radio>
                                                                </div>
                                                            </van-radio-group>
                                                        </template>
                                                    </van-field>
                                                    <van-field v-if="customizedCustomer" type="number" input-align="right" v-model.number="phone1" name="phone1" maxlength="11"
                                                               label="客服电话1" @handleValue="handleValue" placeholder="请输入客服电话" required :rules="[{ required: true, message: '请输入客服电话' }]" />
                                                    <van-field v-if="customizedCustomer" @handleValue="handleValue" type="number" placeholder="请输入客服电话" v-model="phone2" maxlength="11" input-align="right" name="phone2" label="客服电话2" />

                                                    <van-field
                                                        v-if="customizedCustomer"
                                                        class="guizhu-field"
                                                        label="服务时间"
                                                        readonly
                                                        placeholder="服务时间"
                                                        input-align="right"
                                                        v-model="settings.effective"
                                                        name="effective"
                                                        is-link
                                                        @click="effectiveShowHandle"
                                                        :rules="[{ required: true, message: '请选择每日生效时间' }]"
                                                    >
                                                    </van-field>
                                                    <van-popup v-model:show="effectiveShow" position="bottom">
                                                        <van-picker
                                                            title="服务时间"
                                                            v-if="effectiveShow"
                                                            :columns="timeColumns"
                                                            value-key="hour"
                                                            @confirm="onConfirmEffective"
                                                            @cancel="effectiveShow = false"
                                                        />
                                                    </van-popup>
                                                    <div class="phone-text">
                                                        <p class="phone-title">备注</p>
                                                        <p class="phone-content">1.自定义的客服电话和服务时间，会在对应点位产生的订单展示，供消费者有问题时咨询</p>
                                                        <p class="phone-content">2. 如果柜主不配置客服电话，平台会引导消费者通过平台400服务电话咨询</p>
                                                    </div>
                                                </el-form>

                                            </van-cell-group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </van-form>
                    </van-popup>
                    <van-field readonly v-model="addData.associatedDeviceCount" name="address" label="关联设备数量" placeholder="请输入关联设备数量" />
                    <van-button color="#FE7E41" :icon="require('@/assets/device/location.png')" loading-type="spinner" class="newLocationBtn" @click="getNewLocation">获取最新定位</van-button>

                    <van-popup :lazy-render="false" ref="popups" v-model:show="showNewLoactionPop" position="bottom" :style="{ height: '383px' }">
                        <van-nav-bar title="定位位置" @click-left="showNewLoactionPop = false">
                            <template #left>
                                <van-icon :name="closeImg" size="18" />
                            </template>
                            <template #right>
                                <div class="nav-right-icon" @click="btnUseLocation">使用</div>
                            </template>
                        </van-nav-bar>
                        <van-radio-group v-model="locationChecked">
                            <div class="radioGroup">
                                <van-radio :name="0" checked-color="#ee0a24" icon-size="16px" :disabled="!locInfo.lng">
                                    <template #icon="props">
                                        <div class="group-check">
                                            <div class="group-left">
                                                <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                                <div class="equipment-name">
                                                    <h4 class="equipment-position">设备定位</h4>
                                                    <ul class="equipment-ui" v-if="locInfo.lng">
                                                        <li>地址：{{ locInfo.devicePosition }}</li>
                                                        <li>经纬度：{{ locInfo.lng }}，{{ locInfo.lat }}</li>
                                                        <li>更新时间：{{ locInfo.locationUpdateTime }}</li>
                                                    </ul>
                                                    <span style="color: red; margin-top: 10px" v-else>设备定位失败，请刷新一下试试</span>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </van-radio>
                                <img class="refresh" height="20" width="20" :src="indefaultIcon" @click="handleRefresh('device')" />
                            </div>
                            <div class="sccoll-bb"></div>

                            <div class="radioGroup">
                                <van-radio :name="1" checked-color="#ee0a24" icon-size="16px" :disabled="!phoneLocationInfo.lng">
                                    <template #icon="props">
                                        <div class="group-check">
                                            <div class="group-left">
                                                <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                                <div class="equipment-name">
                                                    <h4 class="equipment-position">手机定位</h4>
                                                    <ul class="equipment-ui" v-if="phoneLocationInfo.lng">
                                                        <li>地址：{{ phoneLocationInfo.devicePosition }}</li>
                                                        <li>经纬度：{{ phoneLocationInfo.lng }}，{{ phoneLocationInfo.lat }}</li>
                                                    </ul>
                                                    <span style="color: red; margin-top: 10px" v-else>手机定位获取失败，请检查应用权限。</span>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </van-radio>
                                <img class="refresh" height="20" width="20" :src="indefaultIcon" @click="handleRefresh('phone')" />
                            </div>
                            <div class="sccoll-bb"></div>
                        </van-radio-group>
                    </van-popup>
                </van-cell-group>
            </van-form>
        </van-popup>
        <!-- 这是新增安装位置结束 -->
    </div>
</template>

<script setup>
import { reactive, toRefs, ref, onMounted } from 'vue'
import { getDeviceSeat, getAreaList, getDeviceAddSeat, getDevicePlaceType, updateSeat, getDeviceDetail } from '@/api/device'
import { useRoute, useRouter } from 'vue-router'
import { qqMapTransBMap } from '@/utils/index.js'
// import { closePage } from '@/utils/composables'
// const deviceEdit = ref(false)
import { getLatitudeLongitude, openLocation } from '@/utils/composables'
import { setAppStorageFn } from '@/utils/storage'
import closeImg from '@/assets/close.png'
import edit from '@/assets/device/edit.png'
import { Toast } from 'vant'
import { useStore } from 'vuex'
const activeIcon = require('@/assets/mine/icon-checked.png')
const inactiveIcon = require('@/assets/mine/icon-check.png')
const indefaultIcon = require('@/assets/device/refesh.png')

const store = useStore()
const router = useRouter()
const route = useRoute()
const Form = ref(null)

const list = ref([])
const areaList = ref(null)
const areaLists = ref(null)

const result = ref('')
const deviceResult = ref('')
const show = ref(false)
const shows = ref(false)

const cascaderValue = ref('')

const customTel = ref(null) // 消费者客服电话保存后需要显示的内容
const customizedCustomer = ref(1) // 消费者自定义电话模式

// 消费者自定义电话保存时方法，读取模式，其他前端暂存
const handleSmtCustomTel = () => {
    customTel.value = customizedCustomer.value ? `${phone1.value} ${settings.effective}` : '不使用自定义客服电话'
    deviceSetting.value = false
}

const types = ref('')
const Checkn = require('@/assets/Checkn.png')
const Unchecked = require('@/assets/Unchecked.png')
const state = reactive({
    showAddPopup: false, // 新增安装位置

    // 新增安装位置参数
    addData: {
        locationName: '', // 位置名称
        provinceCode: '', // 省份编码
        provinceName: '', // 省份名称
        cityCode: '', // 城市编码merchantId
        cityName: '', // 城市名称
        districtCode: '', // 区县编码
        districtName: '', // 区县名称
        address: '', // 详细地址
        placement: '', // 摆放位置
        longitude: '', // 精度
        latitude: '', // 纬度
        firstScenesCode: '', // 一级安装场景编码
        firstScenesName: '', // 一级安装场景名称
        secondScenesCode: '', // 二级安装场景编码
        secondScenesName: '', // 二级安装场景名称，
        operatorId: sessionStorage.getItem('operatorId') || '',
        associatedDeviceCount: 0,
        serviceConfig: {
            enable: 0 // 消费者自定义电话模式 0:不使用，1:使用
        }
    }
})
const telPattern = /^1[3-9]\d{9}$/
// 设置项
const settings = reactive({
    temperature: '8',
    effective: '',
    closingHour: '', // 开启
    openingHour: ''// 关闭时刻
})
const handleValue = async (value) => {
    if (value.length === 11) {
        if (!telPattern.test(value)) {
            Toast('输入的手机号不对，请重新输入')
        }
    }
}
const startIndex = ref(0)
const endIndex = ref(0)
// const getIndex = num => {
//     if (!num) return 0
//     const arr = num.split(':')
//     if (Number(arr[1]) === 30) {
//         return Number(arr[0]) * 2 - 1
//     } else {
//         return Number(arr[0]) * 2
//     }
// }
const getDefaultIndex = () => {
    const config = state.addData.serviceConfig
    // 说明有时间数据
    if (config && config.serviceTimeStart && config.serviceTimeEnd) {
        const start = config.serviceTimeStart
        const end = config.serviceTimeEnd
        const arr = createTimePeriod()

        const times = arr.map(item => item.hour)
        startIndex.value = times.indexOf(start)
        console.log(times.indexOf(start), 'arr.indexOf(start)')
        endIndex.value = times.indexOf(end)
    }
}
const createTimePeriod = () => {
    const arr = []
    for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? `0${i}:00:00` : `${i}:00:00`
        arr.push({
            val: i,
            hour
        })
        const halfHour = i < 10 ? `0${i}:30:00` : `${i}:30:00`
        arr.push({
            val: halfHour,
            hour: halfHour
        })
    }
    return arr
}
const timeColumns = [
    {
        values: createTimePeriod(),
        defaultIndex: startIndex
    },
    {
        values: createTimePeriod(),
        defaultIndex: endIndex
    }
]

const effectiveShow = ref(false)

// console.log(timeColumns, '-----------timeColumns-----')

// 控制客服电话
const deviceSetting = ref(false)
// 经纬度显示
const lnglat = ref('')
const phone1 = ref('')
const phone2 = ref('')

// 经纬度输入框手动修改
const handleChangeLngLat = (value) => {
    console.log(value, 'value')
    if (!value) console.log('经纬度没有输入内容')
    const lngLatArr = value.split(',')
    state.addData.longitude = lngLatArr[0] || '0'
    state.addData.latitude = lngLatArr[1] || '0'
}

const { showAddPopup, addData } = toRefs(state)
onMounted(async () => {
    getSeatList()
    getAreaLists()

    // const { target, index } = route.query
    // // // 假设从工单异常页面跳转过来
    // if (target === 'abnormal') {
    //     console.log(index, list, 'index')
    //     const res = await getDeviceDetail({
    //         appKey: 'A1001001',
    //         busiCode: 'A1001022',
    //         deviceCode: index
    //     })
    //     if (res.code === 200) {
    //         state.addData = res.data
    //     }

    // types.value = 'update' // 设置成编辑
    // // 需要 index 匹配数据
    // showAddPopup.value = true
    // }
})

const getSeatList = async () => {
    const params = {
        busiCode: 'A1001022',
        appKey: 'A1001001',
        ownerId: sessionStorage.getItem('ownerId') ? sessionStorage.getItem('ownerId') : 'asdfg',
        deviceCodes: route.query.index ? route.query.index : '',
        pageNo: 1,
        pageSize: 20
    }
    const { data, code } = await getDeviceSeat(params)

    if (Number(code) === 200) {
        const { records } = data // list列表数据
        const device = JSON.parse(sessionStorage.getItem('device')) || {}
        console.log(device.addCode, device, 'device')
        if (device) {
            // TODO 判断是否有值，初始化时默认为空
            records.forEach((item) => {
                if (item.locationCode === device.locationCode || item.locationCode === device.addCode) {
                    item.markstate = true
                } else {
                    item.markstate = false
                }
            })
        }

        list.value = records || []
    }
}
const handleRefresh = async (type) => {
    if (type === 'device') {
        Toast('正在刷新')
        await getDetailData()
    } else {
        // 刷新调用获取手机定位
        Toast('正在刷新')
        getPhoneAddress()
    }
}
// 消费者客服电话
const handleDeviceSetting = async () => {
    deviceSetting.value = true
}

//  查询省市区
const getAreaLists = async () => {
    const params = {
        code: '0',
        ql: 1
    }
    const { data, code } = await getAreaList(params)

    if (Number(code) === 200) {
        areaList.value = []
        data.addressList.forEach((el) => {
            areaList.value.push({
                text: el.addressName,
                value: el.addressCode,
                level: el.level,
                children: []
            })
        })
    }
}
const getPlaceTypes = async () => {
    const params = {
        busiCode: 'A1001022',
        appKey: 'A1001001',
        dictType: 'device.install.location',
        parentId: 0
    }
    const { data, code } = await getDevicePlaceType(params)

    if (Number(code) === 200) {
        areaLists.value = []
        data.forEach((el) => {
            // console.log(el, '-----el--')
            areaLists.value.push({
                text: el.label,
                value: el.id,
                level: el.pid + 1,
                children: []
            })
        })
    }
}

// getPlaceTypes()
const btnSave = async () => {
    try {
        const params = {
            appKey: 'A1001001', // 系统编码
            busiCode: 'A1001022', // 业务线编码
            ownerId: sessionStorage.getItem('ownerId') ? sessionStorage.getItem('ownerId') : 'asdfg',
            operatorId: sessionStorage.getItem('operatorId') || ''
        }
        // 使用自定义客服电话, 需要组合到提交的参数中
        if (customizedCustomer.value === 1) {
            const params = {
                servicePhones: phone2.value ? `${phone1.value},${phone2.value}` : `${phone1.value}`,
                serviceTimeStart: settings?.effective?.split('~')[0],
                serviceTimeEnd: settings?.effective?.split('~')[1],
                enable: 1
            }
            params.servicePhones.replace(/\s*/g, '')
            const config = state.addData.serviceConfig
            state.addData.serviceConfig = { ...config, ...params } // 组合使用时的数据
        } else {
            state.addData.serviceConfig.enable = 0
            if (state.addData.serviceConfig.serviceTimeEnd) { delete state.addData.serviceConfig.serviceTimeEnd }
            if (state.addData.serviceConfig.serviceTimeStart) { delete state.addData.serviceConfig.serviceTimeStart }
            if (state.addData.serviceConfig.servicePhones) { delete state.addData.serviceConfig.servicePhones }
            if (state.addData.serviceConfig.locationCode) { delete state.addData.serviceConfig.locationCode }
        }

        await Form.value.validate()
        console.log(types, '00')
        if (types.value !== 'edit') {
            const res = await getDeviceAddSeat({ ...state.addData, ...params })
            if (res.code === '200') {
                showAddPopup.value = false
                await getSeatList()
            }
        } else {
            const res = await updateSeat({ ...state.addData, ...params })
            if (res.code === '200') {
                showAddPopup.value = false
                await getSeatList()
            }
        }

        console.log('验证通过')
    } catch (e) {
        console.info('验证不通过', e)
    }
}
const handleScene = async () => {
    await getPlaceTypes()

    shows.value = true
}
// const closeClick = async () => {
//     router.go(-1)
// }
const onChanges = async ({ value, selectedOptions, tabIndex }) => {
    // console.log(value, selectedOptions, tabIndex)
    // //  省index  先找到对应选中的省的索引
    const index1 = areaLists.value.findIndex((item) => {
        return item.value === selectedOptions[0].value
    })

    if (tabIndex === 0 && tabIndex === 0 && areaList.value[index1].children.length === 0) {
        // 第一列 省选中
        const { data } = await getDevicePlaceType({
            parentId: +`${selectedOptions[0].value}`,
            dictType: 'device.install.location',
            busiCode: 'A1001022',
            appKey: 'A1001001'
        })

        data.forEach((el) => {
            areaLists.value[index1].children.push({
                text: el.label,
                value: el.value
                // children: []
            })
        })
    }
}

const onFinishs = ({ selectedOptions }, tabIndex) => {
    shows.value = false
    deviceResult.value = selectedOptions.map((option) => option.text).join('/')
    deviceResult.value = selectedOptions.map((option) => option.text).join('/')
    state.addData.firstScenesCode = selectedOptions[0].value
    state.addData.firstScenesName = selectedOptions[0].text
    state.addData.secondScenesCode = selectedOptions[1].value
    state.addData.secondScenesName = selectedOptions[1].text
}
const onChange = async ({ value, selectedOptions, tabIndex }) => {
    //  省index  先找到对应选中的省的索引
    const index1 = areaList.value.findIndex((item) => {
        return item.value === selectedOptions[0].value
    })
    if (tabIndex === 0) {
        // 第一列 省选中
        const { data } = await getAreaList({
            code: `${selectedOptions[0].value}`,
            ql: 2
        })
        data.addressList.forEach((el) => {
            areaList.value[index1].children.push({
                value: el.addressCode, // code
                text: el.addressName,
                level: el.level, // ql
                children: []
            })
        })
    }
    if (tabIndex === 1) {
        // 第二列 市选中
        // 市 index  先找到对应选中的市的索引
        const { data } = await getAreaList({
            code: `${selectedOptions[1].value}`,
            ql: 3
        })
        const index2 = areaList.value[index1].children.findIndex((item) => {
            return item.value === selectedOptions[1].value
        })
        // 县区不用加 children 字段
        data.addressList.forEach((el) => {
            areaList.value[index1].children[index2].children.push({
                value: el.addressCode,
                text: el.addressName,
                level: el.level
            })
        })
    }
}
const onFinish = ({ selectedOptions }, tabIndex) => {
    show.value = false
    result.value = selectedOptions.map((option) => option.text).join('/')
    result.value = selectedOptions.map((option) => option.text).join('/')
    state.addData.provinceCode = selectedOptions[0].value
    state.addData.provinceName = selectedOptions[0].text
    state.addData.cityCode = selectedOptions[1].value
    state.addData.cityName = selectedOptions[1].text
    state.addData.districtCode = selectedOptions[2].value
    state.addData.districtName = selectedOptions[2].text
}

const { pointData } = store.state

const onDetail = (idx, value) => {
    list.value.map((el, index) => {
        if (index === idx) {
            el.markstate = true
            if (route.query.target === 'activation') {
                const newPoint = { ...pointData }
                newPoint.address = el.address
                newPoint.locationName = el.locationName
                console.log(newPoint, '---newPoint--')

                store.commit('setPointData', newPoint)

                router.push({
                    path: 'device-activation',
                    query: {
                        locationName: el.locationName,
                        address: el.address,
                        index: route.query.index,
                        locationCode: el.locationCode
                    }
                })
                // const params = {
                //     locationName: el.locationName,
                //     address: el.address,
                //     index: route.query.index
                // }

                // newPage(`/device-activation?locationName=${el.locationName}&address=${el.address}&index=${route.query.index}`)
            } else {
                // newPage(`/device/device-detail?index=${route.query.index}&locationName=${el.locationName}&address=${el.address}&locationCode=${el.locationCode}&showNavbar=0`, {
                //     index: route.query.index,
                //     locationName: el.locationName,
                //     address: el.address,
                //     locationCode: el.locationCode
                // })

                // http://192.168.50.31:8060/device/device-detail?index=100363&locationName=%E5%85%AB%E8%A7%92%E6%B8%B8%E4%B9%90%E5%9B%AD&placementPosition=%E5%86%85%E8%92%99%E5%8F%A4%E8%B5%A4%E5%B3%B0%E5%B8%82%E9%98%BF%E9%B2%81%E7%A7%91%E5%B0%94%E6%B2%81%E6%97%97%E5%85%AB%E8%A7%92%E6%B8%B8%E4%B9%90%E5%9B%AD&locationCode=LC2111617735&showNavbar=0
                const address = `${el.provinceName}${el.cityName}${el.districtName}${el.locationName}`
                console.log(address, 'addddd')
                router.replace({
                    path: '/device/device-detail',
                    query: {
                        index: route.query.index ? route.query.index : '0',
                        locationName: el.locationName,
                        placementPosition: address,

                        // placementPosition: el.placementPosition,
                        locationCode: el.locationCode,
                        showNavbar: 0
                    }

                })
            }
        } else {
            el.markstate = false
        }
    })
    console.log(value, '-----value---')
    setAppStorageFn('installList', JSON.stringify(value))
    store.commit('setPointAddress', value)
}
// 编辑地址 新建
const onEditItem = async (type, index, item) => {
    getPhoneAddress()
    console.log(item, '00')
    types.value = type
    showAddPopup.value = true

    if (type === 'add') {
        state.addData = {}
        state.addData.associatedDeviceCount = 0
        lnglat.value = ''
        result.value = ''
        state.addData.serviceConfig = {

        }
        state.addData.serviceConfig.enable = 0
        settings.effective = ''
        deviceResult.value = ''
        customTel.value = '' // 消费者客服电话保存后需要显示的内容
        customizedCustomer.value = ''
        phone1.value = '' // 消费者客服电话保存后需要显示的内容
        phone2.value = ''
    }

    if (type === 'edit' && item) {
        state.addData = JSON.parse(JSON.stringify(item))
        result.value = item.provinceName + '/' + item.cityName + '/' + item.districtName
        deviceResult.value = item.firstScenesName + '/' + item.secondScenesName
        lnglat.value = `${item.longitude},${item.latitude}`
        console.log('-item.servicePhones---', item.serviceConfig.servicePhones)
        const config = state.addData.serviceConfig
        // customTel.value = config.enable ? `${config.servicePhones} ${config.serviceTimeStart}~${config.serviceTimeEnd}` : '不使用自定义客服电话'
        customizedCustomer.value = config.enable

        customTel.value = state.addData.serviceConfig.enable ? `${item.serviceConfig.servicePhones} ${item.serviceConfig.serviceTimeStart}~${item.serviceConfig.serviceTimeEnd}` : '不使用自定义客服电话'
        customizedCustomer.value = state.addData.serviceConfig.enable
        if (item.serviceConfig.enable === 1) {
            const isFlag = config.servicePhones.indexOf(',') !== -1
            if (isFlag) {
                const tels = config.servicePhones.split(',')
                phone1.value = tels[0]
                phone2.value = tels[1]
            } else {
                phone1.value = config.servicePhones
                phone2.value = ''
            }
            console.log(config.serviceTimeStart, 'config.serviceTimeStart')

            settings.effective = `${config.serviceTimeStart}~${config.serviceTimeEnd}`
        } else {
            phone1.value = ''
            phone2.value = ''
            settings.effective = ''
        }
        console.log('----------config----', config, '---------item---', item)

        console.log('------settings------', settings)
        // phone1.value = item.serviceConfig.servicePhones.indexOf(',') >= -1?item.serviceConfig.servicePhones.split(',')[0]
        // phone2.value = item.serviceConfig.servicePhones.indexOf(',') >= -1?item.serviceConfig.servicePhones.split(',')[1]
    }
}

const showNewLoactionPop = ref(false)

const locInfo = reactive({
    lng: '',
    lat: '',
    locationUpdateTime: '',
    devicePosition: ''
})

const phoneLocationInfo = reactive({
    lng: '',
    lat: '',
    devicePosition: ''
})

// 指定默认选中项
const locationChecked = ref(0)

// 获取设备定位
const getDetailData = async () => {
    const locationInfo = await getDeviceDetail({
        appKey: 'A1001001',
        busiCode: 'A1001022',
        deviceCode: route.query.index
    })

    if (Number(locationInfo.code) === 200) {
        const { longitude, latitude, locationUpdateTime, devicePosition } = locationInfo.data
        locInfo.lng = longitude
        locInfo.lat = latitude

        locInfo.locationUpdateTime = locationUpdateTime
        locInfo.devicePosition = devicePosition
    }
}

// 获取手机定位
const getPhoneAddress = async () => {
    try {
        const phoneAddress = await getLatitudeLongitude()
        console.log(phoneAddress, '--------phoneAddress---', await getLatitudeLongitude())
        const address = phoneAddress && JSON.parse(phoneAddress)
        if (address && Object.keys(address).length > 0) {
            phoneLocationInfo.lng = address.longitude
            phoneLocationInfo.lat = address.latitude
            phoneLocationInfo.devicePosition = address.address
        } else {
            await openLocation()
        }
    } catch (error) {
        console.log(error, 'error')
    }
}
// 获取最新定位
const getNewLocation = async () => {
    showNewLoactionPop.value = true

    await getDetailData()
    // getPhoneAddress()
    // showNewLoactionPop.value = true

    // const locationInfo = await getDeviceDetail({
    //     appKey: 'A1001001',
    //     busiCode: 'A1001022',
    //     deviceCode: route.query.index
    // })

    // if (Number(locationInfo.code) === 200) {
    //     const { longitude, latitude, locationUpdateTime, devicePosition } = locationInfo.data
    //     locInfo.lng = longitude
    //     locInfo.lat = latitude

    //     locInfo.locationUpdateTime = locationUpdateTime
    //     locInfo.devicePosition = devicePosition
    // }

    // const phoneLocation = getLatitudeLongitude()
    const phoneLocation = ''

    console.log(phoneLocation, phoneLocationInfo, 'phoneLocation')
    // console.log(locationInfo, 'locationInfo')
    // splitAddress(locationInfo.data.devicePosition)
}

const splitAddress = (data) => {
    // const regex = '(?<province>[^省]+自治区|.*?省|.*?行政区|上海|北京|天津|重庆|.*?市)(?<city>[^市]+自治州|.*?市|.*?地区\\)|.*?行政单位|.+盟|市辖区|.*?县)(?<county>[^县]+县|.*?区|.+市|.+旗|.+海域|.+岛)?(?<town>.*)?(?<village>.*)'
    const regex = '(?<province>[^省]+省|.+自治区|[^澳门]+澳门|[^香港]+香港|[^市]+市)?(?<city>[^自治州]+自治州|[^特别行政区]+特别行政区|[^市]+市|.*?地区|.*?行政单位|.+盟|市辖区|[^县]+县)(?<county>[^县]+县|[^市]+市|[^镇]+镇|[^区]+区|[^乡]+乡|.+场|.+旗|.+海域|.+岛)?(?<address>.*)'
    const res = data.match(regex)
    return res.groups
}
// 每日生效时间
const effectiveShowHandle = () => {
    effectiveShow.value = true
    getDefaultIndex()
}
const onConfirmEffective = (value) => {
    if (value[0].val >= value[1].val) {
        Toast('结束生效时间不能小于或者等于开始生效时间!')
        return
    }
    effectiveShow.value = false
    const time = `${value[0].hour}~${value[1].hour}`

    if (value[0].hour) Object.assign(settings, { openingHour: value[0].hour })
    if (value[1].hour) Object.assign(settings, { closingHour: value[1].hour })

    Object.assign(settings, { effective: time })
}
// 使用
const btnUseLocation = () => {
    showNewLoactionPop.value = false

    let uselng = 0
    let uselat = 0
    let useAddress = ''

    // 选择手机定位时需要转化下经纬度
    if (Number(locationChecked.value) === 1) {
        const { lng, lat } = qqMapTransBMap(phoneLocationInfo.lng, phoneLocationInfo.lat)
        uselng = lng
        uselat = lat
        useAddress = phoneLocationInfo.devicePosition
    } else {
        uselng = locInfo.lng
        uselat = locInfo.lat
        useAddress = locInfo.devicePosition
    }

    lnglat.value = `${uselng}, ${uselat}`

    console.log(uselng, uselat, 'asfkjasjd')
    state.addData.longitude = uselng
    state.addData.latitude = uselat
    // 省市区截取，现在拿的是除省市区之外的内容
    state.addData.address = splitAddress(useAddress).address
}

// 当手动修改经纬度时，需要将地区数据清空
// const handleChangeLatitude = (value) => {
//     const lnglat = `${locInfo.lng}, ${locInfo.lat}`
//     if (value !== lnglat) {
//         result.value = ''
//     } else {
//         result.value = locInfo.devicePosition
//     }
// }
</script>
<style lang="scss" scoped>
.radioGroup {
    display: flex;
    justify-content: space-between;
    // padding-right: 20px;
    // height: 258px;
    padding: 30px 50px 30px 0;
    min-height: 258px;
    box-sizing: border-box;
    // background: yellow;
}
// :deep(.wx-box-popup ){
//     padding-bottom: calc(16px + constant(safe-area-inset-bottom));
//     padding-bottom: calc(16px + env(safe-area-inset-bottom));
// }
.mt2 {
    margin-top: 4px;
}
.configw {
    width: 480px;
}
.refresh {
    height: 40px;
    width: 40px;
    margin-top: 28px;
}

.group-check {
    display: flex;
    justify-content: space-between;
    .img-icon {
        width: 32px;
        height: 32px;
    }

    .group-left {
        display: flex;
        align-items: flex-start;
    }
}

.van-radio-group {
    :deep(.van-radio__icon) {
        height: auto;
    }
    .van-radio {
        padding-left: 50px;
        // height: 129px;
        width: 100%;
        box-sizing: border-box;
        // background: yellow;
        // border-bottom: 1px solid #ccc;
    }
}
.van-radio {
    :deep(.van-radio__icon) {
        width: 90%;
        // background: red;
    }
    //     :deep (.van-radio__icon){
    // background: red;
    //     }
}
.sccoll-bb {
    height: 0.5px;
    margin-left: 50px;
    background: #f4f5f5;
}

.equipment-name {
    display: flex;
    // height: 200px;
    flex-direction: column;
    margin-left: 20px;
    font-size: 20px;
    font-weight: 400;
    color: #191919;
    .equipment-position {
        font-size: 30px;

        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191919;
    }
    .equipment-ui {
        // width: 251px;
        margin-top: 24px;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;
    }
    .equipment-ui li {
        line-height: 36px;
        word-wrap: break-word;
        word-break: break-all;
    }
}
.newLocationBtn {
    width: 630px;
    height: 92px;
    background: #fe7e41;
    border-radius: 46px;
    font-size: 30px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    left: 40px;
    margin-bottom: 20px;
}
.nav-right-icon {
    color: #fe7e41;
}
.detail-seat-list {
    background: #fff;

    .mt4 {
        margin-top: 4px;
    }
    .seat-list {
        width: 100%;
        box-sizing: border-box;
        position: relative;
        padding-left: 30px;
        box-sizing: border-box;
    }
    :deep(.van-nav-bar__text) {
        color: #fe7e41;
    }

    .ul-li {
        // box-sizing: border-box;
        border-bottom: 1px solid #e7e7e7;
        height: 124px;
        padding: 36px 30px 36px 0;
        overflow: hidden;
        // background: red;
        .icon {
            float: left;
            margin-right: 14px;
            img {
                width: 30px;
                height: 24px;
            }
        }
        .content {
            overflow: hidden;
        }
    }
    .ul-title {
        color: #191919;

        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191919;
        // background: yellow;;
    }
    .ul-desc {
        color: #999;
        font-size: 24px;
        margin-top: 8px;
        line-height: 32px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
    }

    .ul-desc-edit img {
        height: 36px;
        width: 36px;
        position: absolute;
        right: 30px;
        top: 20%;
        z-index: 0;
    }
}
.add-seat-container {
    // width: 100%;
    //     min-height: 100vh;
    //     background-color: #F4F5F5;
    //     display: flex;
    //     flex-direction: column;
}
.seat-content {
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #fe7e41;
    --van-nav-bar-title-font-size: 36px;
    --van-base-font-family: 'PingFangSC-Medium, PingFang SC';
    --van-nav-bar-text-size: 30px;

    .van-nav-bar__placeholder {
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
        .van-hairline--bottom:after {
            border-bottom-width: 0;
        }
    }
    :deep(.van-nav-bar__title) {
        font-size: 32px;
        font-weight: 500;
        color: #191919;
    }
    :deep(.nav-right-icon) {
        font-size: 30px;
        font-weight: 500;
        color: #fe7e41;
    }
    .van-cell-group {
        :deep(.van-cell) {
            border-bottom: 1px solid #f4f5f5;
            height: 101px;

            box-sizing: border-box;
            font-size: 30px;
            display: flex;
            align-items: center;
        }
    }
    :deep(.van-cell::after) {
        border-bottom: none;
    }
    :deep(.van-cascader__options) {
        height: 920px;
    }
}
.setting {
        height: 500px;
    }

    .seting-title {
        width: 100%;
        box-sizing: border-box;
        font-size: 32px;
        color: #191919;
        position: absolute;
        height: 132px;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        :deep(.van-radio__icon--checked) {
            background: yellow;
        }
    }
    .mb20 {
        margin-bottom: 20px;
        height: 40px;
    }
    .setting-content {
        padding-top: 132px;
    }
    .merchant {
    :deep(.van-cell) {
        padding: 30px 50px;
        // background: yellow;

    }
    .van-radio-group {
    :deep(.van-radio__icon) {
        height: auto;
    }
    .van-radio {

        padding-left: 0;
        // height: 129px;
        width:24%;
        box-sizing: border-box;
        // background: yellow;
        // border-bottom: 1px solid #ccc;
    }
    .van-radio {
    :deep(.van-radio__icon) {
        width: auto
    }
    .img-icon-left {
        margin-left: 10px;
    }

}

.img-icon {
    width: 32px;
    height: 32px;
}
.img-icon-left{
    margin-left: 86px;
    }
}
.van-radio {
    :deep(.van-radio__icon) {
        // width: 10%;
        // background: red;
    }
    //     :deep (.van-radio__icon){
    // background: red;
    //     }
}
    .guizhu-cell-group {
        // display: flex;
    }
}
:deep(.van-picker__confirm) {
    color: #fe7e41;
}
.img-icon {
    width: 32px;
    height: 32px;
}
.img-icon-left{
    margin-left: 86px;
    }
:deep(.van-icon-close:before) {
    position: absolute;
    left: 8px;
    top: 16px;
}
:deep(.van-picker-column__item--selected) {
    color: #e74d09;
}
.phone-text {
    padding: 0 50px 254px;
    box-sizing: border-box;
}
.phone-title {
        font-size: 30px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #191919;
margin-top: 24px;
    }
    .phone-content {
        font-size: 26px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #696969;
margin-top: 16px;
line-height: 36px;
    }

</style>
