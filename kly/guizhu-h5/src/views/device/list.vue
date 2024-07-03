<template>
    <div class="device-management">
        <van-nav-bar title="设备管理" fixed placeholder left-arrow right-text="新增设备" @click-left="closePage" @click-right="showAddPopup" />
        <van-tabs v-model:active="pageTab" @change="onRefresh" color="#FE7E41" title-active-color="#FE7E41">
            <van-tab title="我的设备" />
            <van-tab title="激活申请" />
        </van-tabs>
        <!-- 我的设备 -->
        <div class="my-device" v-if="pageTab === 0">
            <div class="sticky-box">
                <form action="/">
                    <van-search v-model="searchValue" placeholder="请输入设备编号或设备名称搜索" @blur="searchFn" :clearable="false" shape="round" @focus="isSearching = true">
                        <template #left-icon>
                            <div class="icon--unselect">
                                <van-icon size="1em" :name="require('@/assets/search2.png')" />
                            </div>
                        </template>
                    </van-search>
                </form>
            </div>
            <div class="tabs" v-show="!isSearching">
                <div class="container cell-item tabs-span">
                    <div class="tab-wrap">
                        <span key="device" @click="handleChangeTab('device')" :class="[tab === 'device' ? 'active' : '', 'mr5 ml5']">
                            <div>{{ deviceTab }}</div>
                            <van-icon :name="tab === 'device' ? 'arrow-down' : 'arrow-up'" />
                        </span>
                        <span key="point" @click="handleChangeTab('point')" :class="tab === 'point' ? 'active' : ''"
                        ><div>{{ senceTab}}</div>
                            <van-icon :name="tab === 'point' ? 'arrow-down' : 'arrow-up'" size="14"
                            /></span>
                        <span key="cabinet" @click="handleChangeTab('cabinet')" :class="tab === 'cabinet' ? 'active' : ''"
                        ><div>{{ cabinetTab }}</div>
                            <van-icon :name="tab === 'cabinet' ? 'arrow-down' : 'arrow-up'"
                            /></span>
                        <span key="address" @click="handleChangeTab('address')" :class="tab === 'address' ? 'active' : ''"
                        ><div>{{ addressTab }}</div>
                            <van-icon :name="tab === 'address' ? 'arrow-down' : 'arrow-up'"
                            /></span>
                    </div>
                    <!-- <div class="tab-wrap">
                        <span key="device" @click="handleChangeTab('device')" :class="[tab === 'device' ? 'active' : '', 'mr5 ml5']">
                            <div>设备状态</div>
                            <van-icon :name="tab === 'device' ? 'arrow-down' : 'arrow-up'" />
                        </span>
                        <span key="point" @click="handleChangeTab('point')" :class="tab === 'point' ? 'active' : ''"
                        ><div>点位场景</div>
                            <van-icon :name="tab === 'point' ? 'arrow-down' : 'arrow-up'" size="14"
                            /></span>
                        <span key="cabinet" @click="handleChangeTab('cabinet')" :class="tab === 'cabinet' ? 'active' : ''"
                        ><div>货柜类型</div>
                            <van-icon :name="tab === 'cabinet' ? 'arrow-down' : 'arrow-up'"
                            /></span>
                        <span key="address" @click="handleChangeTab('address')" :class="tab === 'address' ? 'active' : ''"
                        ><div>点位地址</div>
                            <van-icon :name="tab === 'address' ? 'arrow-down' : 'arrow-up'"
                            /></span>
                    </div> -->
                </div>
                <div style="position: relative">
                    <div>
                        <div v-if="tab === 'device'" :class="tab === 'device' ? 'pab' : ''">
                            <van-tree-select v-model:active-id="deviceStatus" v-model:main-active-index="deviceIndex" :items="deviceStateStatsNodes" @click-nav="handleClickDevice" @click-item="handleClickItemDevice" />
                            <van-row v-if="tab === 'device'" class="sub-btn-row">
                                <van-col span="12"> <van-button block color="#FE7E41" plain type="primary" @click="goout" style="border: 0"> 重置 </van-button></van-col>
                                <van-col span="12"> <van-button block color="#FE7E41" type="primary" native-type="submit" @click="submit"> 确定 </van-button></van-col>
                            </van-row>
                            <!-- <div class="mask_div" :style="{ height: `${cacHeight}px`}"></div> -->
                        </div>
                        <div v-if="tab === 'point'" :class="tab === 'point' ? 'pab' : ''">
                            <van-tree-select v-model:active-id="senceState" v-model:main-active-index="senceIndex" :items="pointSceneStatsNodes" @click-nav="handleClickSence" @click-item="handleClickItemSence" />
                            <van-row v-if="tab === 'point'" class="sub-btn-row">
                                <van-col span="12"> <van-button block color="#FE7E41" plain type="primary" @click="goout" style="border: 0"> 重置 </van-button></van-col>
                                <van-col span="12"> <van-button block color="#FE7E41" type="primary" native-type="submit" @click="submit"> 确定 </van-button></van-col>
                            </van-row>
                            <!-- <div class="mask_div" :style="{ height: `${cacHeight}px`}"></div> -->

                        </div>
                        <div v-if="tab === 'cabinet'" :class="tab === 'cabinet' ? 'pab' : ''">
                            <van-tree-select v-model:active-id="cabinetState" v-model:main-active-index="cabinetIndex" :items="cabinetTypeStatsNodes" @click-nav="handleClickCabinet" @click-item="handleClickItemCabinet" />
                            <van-row v-if="tab === 'cabinet'" class="sub-btn-row">
                                <van-col span="12"> <van-button block color="#FE7E41" plain type="primary" @click="goout" style="border: 0"> 重置 </van-button></van-col>
                                <van-col span="12"> <van-button block color="#FE7E41" type="primary" native-type="submit" @click="submit"> 确定 </van-button></van-col>
                            </van-row>
                            <!-- <div class="mask_div" :style="{ height: `${cacHeight}px`}"></div> -->
                        </div>
                        <div v-if="tab === 'address'" :class="tab === 'address' ? 'pab' : ''">
                            <div style="position: relative">
                                <div v-if="tab === 'address'" style="display: flex;flex-direction:row">
                                    <div style="width: 33%; min-height: 212px;" class="tab-jl-tab">
                                        <div
                                            v-for="(province, index) in pointAddressStatsNodes"
                                            :key="province.id" style="padding-left: 5px; height: 45px; line-height: 45px"
                                            @click="handleClickProvince(index)"
                                            :class="index === provinceIndex ? 'select' : ''"
                                        >
                                            <span style="display: flex; justify-content: space-between; align-items: center;height: 49px;">
                                                {{ province.text }} <van-icon color="#FE7E41" :name="index === provinceIndex ? 'success' : ''" />
                                            </span>
                                        </div>
                                    </div>
                                    <div style="width: 33%; min-height: 212px; " class="tab-jl-tab">
                                        <div v-for="(citys, index) in citysNode"
                                             :key="citys.id" style="padding-left: 5px; height: 45px;line-height: 45px"
                                             @click="handleClickCitys(index)"
                                             :class="index === cityIndex ? 'select' : ''"
                                        >
                                            <span style="display: flex; justify-content: space-between; align-items: center;height: 49px;">
                                                {{ citys.text }} <van-icon color="#FE7E41" :name="index === cityIndex ? 'success' : ''" />
                                            </span>
                                        </div>
                                    </div>

                                    <div style="width: 33%; height: 300px" class="tab-jl-tab">
                                        <div
                                            v-for="(areas, index) in areaNode" :key="areas.id"
                                            style="padding-left: 5px; height: 45px;line-height: 45px"
                                            @click="handleClickArea(index)"
                                            :class="index === areaIndex ? 'select' : ''"
                                        >
                                            <span style="display: flex; justify-content: space-between; align-items: center;height: 49px;">
                                                {{ areas.text }} <van-icon color="#FE7E41" :name="index === areaIndex ? 'success' : ''" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <van-row v-if="tab === 'address'" class="sub-btn-row">
                                    <van-col span="12"> <van-button block color="#FE7E41" plain type="primary" @click="goout" style="border: 0"> 重置 </van-button></van-col>
                                    <van-col span="12"> <van-button block color="#FE7E41" type="primary" native-type="submit" @click="submit"> 确定 </van-button></van-col>
                                </van-row>
                            </div>
                            <!-- <van-tree-select v-model:active-id="pointStatus" v-model:main-active-index="pointIndex" :items="pointAddressStatsNodes" @click-nav="handleClickAddress" @click-item="handleClickItemAddress" />
                            <van-row v-if="tab === 'address'" class="sub-btn-row">
                                <van-col span="12"> <van-button block color="#FE7E41" plain type="primary" @click="goout" style="border: 0"> 重置 </van-button></van-col>
                                <van-col span="12"> <van-button block color="#FE7E41" type="primary" native-type="submit" @click="submit"> 确定 </van-button></van-col>
                            </van-row> -->
                            <!-- <div class="mask_div" :style="{ height: `${cacHeight}px`}"></div> -->

                        </div>
                    </div>
                    <!-- <div id="mask_div">22</div> -->

                </div>
            </div>
            <!-- <van-tabs v-show="!isSearching" v-model:active="activeName" @change="onRefresh" type="card">
                <van-tab :title="1 ? `正常(${ deviceCount?.normalQty })` : '正常'" name="success" />
                <van-tab :title="2 ? `异常(${ deviceCount?.abnormalQty })` : '异常'" name="error"/>
                <van-tab :title="3 ? `离线(${ deviceCount?.offlineQty })` : '离线'" name="onlineState"/>
                <van-tab :title="4  ? `锁定(${ deviceCount?.lockedQty })` : '锁定'" name="lockState"/>
            </van-tabs> -->

            <van-pull-refresh v-model="myDevice.refreshLoading" @refresh="onRefresh" :disabled="(tab === 'device'||tab === 'cabinet'||tab === 'point'||tab === 'address')?true:false">
                <van-list v-if="myDevice.list.length" v-model:loading="myDevice.loading" :finished="myDevice.finished" @load="onLoad" finished-text="没有更多了" :immediate-check="false">
                    <template v-for="item in myDevice.list" :key="item.deviceCode">
                        <div class="cell-item" @click="goDetail(item.deviceCode)">
                            <p class="device-name"><img :src="icon" alt="" />{{ item.deviceName || '-' }}</p>
                            <div class="device-desc">
                                设备编号：<span>{{ item.deviceCode || '-' }}</span
                                ><span v-if="item.signalStrength">（{{ item.networkTypeName || '-' }}-{{ item.signalStrength }}dbm）</span><span class="signal" @click.stop="signalHistory(item.deviceCode)">信号历史</span>
                            </div>
                            <div class="device-desc">
                                设备型号：<span>{{ item.deviceModelName }}</span>
                            </div>
                            <div class="device-desc">
                                设备状态：<span :class="'color' + item.deviceState">{{ item.deviceState === 1 ? '正常' : '异常' }}</span
                                ><span class="updateTime">{{ item.onlineStateUpdateTime || '-' }}</span>
                            </div>
                        </div>
                    </template>
                </van-list>
                <div class="empty" v-else>
                    <img src="@/assets/empty@2x.png" />
                    <span class="no-data">暂无数据</span>
                </div>
            </van-pull-refresh>
        </div>
        <!-- 激活申请 -->
        <div class="approve-list" v-else>
            <van-pull-refresh v-model="approveInfo.refreshLoading" @refresh="onRefresh()">
                <van-list v-if="approveInfo.list.length" v-model:loading="approveInfo.loading" :finished="approveInfo.finished" @load="onLoad" finished-text="没有更多了" :immediate-check="false">
                    <template v-for="item in approveInfo.list" :key="item.applicationId">
                        <div class="cell-item" @click="goDetail(item.applicationId)">
                            <div class="item-title van-hairline--bottom">
                                <span class="item-title--text">审批单单号：{{ item.applicationId }}</span>
                                <span class="item-title--state" :class="'state' + item.approvalState">{{ item.approvalState === 0 ? '待处理' : item.approvalState === 1 ? '已通过' : '已拒绝' }}</span>
                            </div>
                            <div class="item-content">
                                <div class="outside">
                                    <div class="withinLeft">审批单类型</div>
                                    <div class="withinRight">{{ item.applyType === 1 ? '激活申请' : item.applyType === 2 ? '解绑申请' : '-' }}</div>
                                </div>
                                <div class="outside">
                                    <div class="withinLeft">设备编号</div>
                                    <div class="withinRight">{{ item.deviceCode }}</div>
                                </div>
                                <div class="outside">
                                    <div class="withinLeft">设备名称</div>
                                    <div class="withinRight">{{ item.deviceName }}</div>
                                </div>
                                <div class="outside">
                                    <div class="withinLeft">设备型号</div>
                                    <div class="withinRight">{{ item.modelName }}</div>
                                </div>
                                <div class="outside">
                                    <div class="withinLeft">申请时间</div>
                                    <div class="withinRight">{{ item.applyTime }}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </van-list>
                <div class="empty" v-else>
                    <img src="@/assets/empty@2x.png" />
                    <span class="no-data">暂无数据</span>
                </div>
            </van-pull-refresh>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Toast } from 'vant'

import { useRouter } from 'vue-router'
import { appBridge, registerhandler } from '@/utils/bridge.js'

import { getDeviceList, getApproveList, getDeviceInfos, getCabinetDevice, getStatisticsOptions } from '@/api/device'

import { closePage, newPage } from '@/utils/composables'
import icon from '@/assets/device/list_title_icon.png'

const router = useRouter()
const pageTab = ref(0)
// const activeName = ref(null)

// const cacHeight = ref(0)

// const calcHeight = () => {
//     const height = window.document.body.clientHeight
//     console.log(height, 'height')
//     cacHeight.value = height
// }

// const isFalseTabs = ref(true)
const isTrueTabs = ref(false)
const flag = ref(false)

const deviceTab = ref('设备状态')
const senceTab = ref('点位场景')
const cabinetTab = ref('货柜类型')
const addressTab = ref('点位地址')

// 重置tab值
const resetTab = () => {
    deviceTab.value = '设备状态'
    senceTab.value = '点位场景'
    cabinetTab.value = '货柜类型'
    addressTab.value = '点位地址'
}

const deviceStatus = ref(0)
const deviceIndex = ref(0)
const deviceStateStatsNodes = ref([])
const tab = ref(null)
// const handleChangeTab = (val) => {
//     tab.value = val
//     resetTab()
// }
const tabClickLog = []
let search = {} // 多选搜索条件组合
const initSearch = (tab) => {
    if (tab === 'device' && !search.deviceState) {
        search.deviceState = { // 设备管理
            firstDeviceState: null,
            secondDeviceState: null,
            stateType: null // 如果 设备状态选择正常、异常，是则 stateType 值为 0，否则为 1
        }
    }
    if (tab === 'point' && !search.scenes) {
        search.scenes = { // 点位场景
            firstScenesCode: null,
            secondScenesCode: null
        }
    }
    if (tab === 'cabinet' && !search.deviceType) {
        search.deviceType = { // 货柜类型
            firstCabinetType: null,
            secondCabinetType: null
        }
    }

    if (tab === 'address' && !search.location) {
        search.location = { // 点位地址
            provinceCode: null,
            cityCode: null,
            districtCode: null
        }
    }

    return search
}
const handleChangeTab = (val) => {
    // show = true
    // 重复点击同一个tab
    if (tabClickLog[0] === val && tab.value !== null) {
        tab.value = null
        tabClickLog.length = 0
    } else {
        tab.value = val
    }
    // resetTab()
    tabClickLog.unshift(val)
    initSearch(val)
}

// 设备状态选择的值
const deviceSelect = ref({})
const handleClickDevice = (index) => {
    const current = deviceStateStatsNodes.value[index]
    const text = current.desc
    flag.value = text === '正常' || text === '异常'
    console.log(current, flag, 'current-----------------------------------------------------')
    deviceSelect.value.parent = current
    deviceTab.value = text !== '全部' ? text : '设备状态'
    // deviceTab.value = text

    search.deviceState.firstDeviceState = current.value ? Number(current.value) : null // 设备全部时默认为0
    search.deviceState.stateType = flag.value ? 0 : 1 // 如果 设备状态选择正常、异常，是则 stateType 值为 0，否则为 1

    search.deviceState.secondDeviceState = null // 只选择一级点确定情况，二级重置为null
    deviceStatus.value = 0 // 原先其他二级选择的索引重置
}

// 点击右侧选中值放入到 child
const handleClickItemDevice = (item) => {
    console.log(item, 'item')
    deviceSelect.value.child = item
    deviceTab.value = item.desc
    search.deviceState.secondDeviceState = item.value ? Number(item.value) : null
}

// 点位场景
const senceSelect = ref({})

const handleClickSence = (index) => {
    const current = pointSceneStatsNodes.value[index]
    senceSelect.value.parent = current
    // senceTab.value = current.desc
    senceTab.value = current.desc !== '全部' ? current.desc : '点位场景'
    search.scenes.firstScenesCode = current.value

    search.scenes.secondScenesCode = null // 只选择一级点确定情况，二级重置为null
    senceState.value = 0 // 原先其他二级选择的索引重置
}

const handleClickItemSence = (item) => {
    senceSelect.value.child = item
    senceTab.value = item.desc
    search.scenes.secondScenesCode = item.value
}

// 货柜
const cabinetSelect = ref({})

const handleClickCabinet = (index) => {
    const current = cabinetTypeStatsNodes.value[index]
    cabinetSelect.value.parent = current
    search.deviceType.firstCabinetType = current.value
    cabinetTab.value = current.desc !== '全部' ? current.desc : '货柜类型'
    search.deviceType.secondCabinetType = null // 只选择一级点确定情况，二级重置为null
    cabinetState.value = 0 // 原先其他二级选择的索引重置
}

const handleClickItemCabinet = (item) => {
    cabinetSelect.value.child = item
    search.deviceType.secondCabinetType = item.value
    cabinetTab.value = item.desc
}

// const addressSelect = ref({})
// const handleClickAddress = (index) => {
//     const current = pointAddressStatsNodes.value[index]
//     addressSelect.value.parent = current
//     addressTab.value = current.desc
//     search.location.provinceCode = current.value

//     search.location.cityCode = null // 只选择一级点确定情况，二级重置为null
//     pointStatus.value = 0 // 原先其他二级选择的索引重置
// }

// const handleClickItemAddress = (item) => {
//     addressSelect.value.child = item
//     addressTab.value = item.desc
//     search.location.cityCode = item.value
// }

const provinceIndex = ref(0) // 省份索引
const cityIndex = ref(0) // 市级索引
const areaIndex = ref(0) // 区级索引

const citysNode = ref([]) // 市级内容
const areaNode = ref([]) // 区级内容

// 点击省级获取市级内容
// const handleClickProvince = (index) => {
//     const province = pointAddressStatsNodes.value[index]
//     citysNode.value = province.children
//     provinceIndex.value = index

//     search.location.provinceCode = province.value // 给省份条件赋值

//     areaNode.value = null // 切换省级时，区级有数据需要清理
// }
// 点击省级获取市级内容
const handleClickProvince = (index) => {
    const province = pointAddressStatsNodes.value[index]
    citysNode.value = province.children
    provinceIndex.value = index

    search.location.provinceCode = !province.value ? null : province.value // 给省份条件赋值
    areaNode.value = null // 切换省级时，区级有数据需要清理

    search.location.cityCode = null // 切换省级时，市级有数据需要清理
    search.location.districtCode = null // 切换省级时，市级有数据需要清理
}

// 点击市级获取区级内容
const handleClickCitys = (index) => {
    const city = citysNode.value ? citysNode.value[index] : {} // 市
    areaNode.value = city.children ? city.children : []
    cityIndex.value = index

    search.location.cityCode = !city.value ? null : city.value

    search.location.districtCode = null // 切换市级时，区级有数据需要清理
}
// 点击市级获取区级内容
// const handleClickCitys = (index) => {
//     const city = citysNode.value ? citysNode.value[index] : {} // 市
//     areaNode.value = city.children ? city.children : []
//     cityIndex.value = index

//     search.location.cityCode = city.value
// }

// 点击区级
const handleClickArea = (index) => {
    areaIndex.value = index

    const area = areaNode.value ? areaNode.value[index] : {}
    search.location.districtCode = area.value
    search.location.districtCode = !area.value ? null : area.value

    // search.location.districtCode = null // 切换市级时，区级有数据需要清理
}

// 点位场景
const senceState = ref(0)
const senceIndex = ref(0)
const pointSceneStatsNodes = ref([])
let isReset = false
// 货柜类型
const cabinetState = ref(0)
const cabinetIndex = ref(0)
const cabinetTypeStatsNodes = ref([])

// 点位地址
const pointStatus = ref(0)
// 点位地址
const pointIndex = ref(0)
const pointAddressStatsNodes = ref([])
const isFrist = ref(false)
let useData = []
onMounted(() => {
    // calcHeight()
    isFrist.value = true
    onLoad()
    getDeviceNumber().then((res) => {
        useData = res
        deviceStateStatsNodes.value = getData(res.deviceStateStatsNodes, true)
        pointSceneStatsNodes.value = getData(res.pointSceneStatsNodes)
        cabinetTypeStatsNodes.value = getData(res.cabinetTypeStatsNodes)
        pointAddressStatsNodes.value = getData(res.pointAddressStatsNodes)
    })
})

const onLoad = async () => {
    if (pageTab.value === 0) return getSubLevelList()
    getApproveLists()
}
const onRefresh = async () => {
    if (pageTab.value === 0) {
        myDevice.value.pageNum = 1
        myDevice.value.finished = false
    }
    onLoad()
}

const resetSearch = () => {
    search = {
        deviceState: {},
        scenes: {},
        deviceType: {},
        location: {}
    }
}
// const show = false
//  默认显示
// 重置
const goout = () => {
    // console.log(trueActive, 'trueActive')
    if (tab.value === 'device') {
        deviceStatus.value = 0
        deviceIndex.value = 0
    }
    if (tab.value === 'cabinet') {
        cabinetState.value = 0
        cabinetIndex.value = 0
    }
    if (tab.value === 'point') {
        senceState.value = 0
        senceIndex.value = 0
    }
    if (tab.value === 'address') {
        pointStatus.value = 0
        pointIndex.value = 0

        provinceIndex.value = 0
        cityIndex.value = 0
        areaIndex.value = 0
    }
    resetSearch()
    resetTab()

    isReset = true
    getSubLevelList(search)

    // console.log(trueActive, 'trueActive')
}

const flagIndex = ref(false)

const submit = async () => {
    isReset = false
    console.log(search, 'search')
    flagIndex.value = true
    isFrist.value = false
    myDevice.value.pageNum = 1
    myDevice.value.finished = false

    const res = await getSubLevelList(search)
    if (res.code === '200') {
        resetSearch()
        isTrueTabs.value = false
    }

    // isFalseTabs.value = true
}

// 搜索
const searchValue = ref('')
const isSearching = ref(false)
const searchFn = () => {
    if (!searchValue.value) isSearching.value = false
    onRefresh()
}

const myDevice = ref({
    pageNum: 1,
    pageSize: 10,
    list: [],
    loading: false,
    finished: false,
    refreshLoading: false
})

// 设备列表数据
const getSubLevelList = async (param) => {
    myDevice.value.loading = true
    const params = {
        pageNum: myDevice.value.pageNum,
        pageSize: myDevice.value.pageSize,
        busiCode: 'A1001022',
        appKey: 'A1001001',
        ...param,
        condition: searchValue.value.trim() || null
    }

    const { code, data } = await getDeviceList(params)
    if (code === '200') {
        if (!isReset) tab.value = null
        myDevice.value.list = myDevice.value.pageNum === 1 ? data.list : [...myDevice.value.list, ...data.list]

        if (myDevice.value.pageNum >= data.pageTotal) myDevice.value.finished = true
        myDevice.value.pageNum++
        // if (pageTab.value === 0) {
        //     myDevice.value.pageNum = 1
        // } else {
        //     myDevice.value.pageNum++
        // }
    }
    if (myDevice.value.refreshLoading) myDevice.value.refreshLoading = false
    myDevice.value.loading = false
    return code
}

const getChildNodes = (childNodes, parent) => {
    let arr
    if (childNodes && childNodes.length > 0) {
        arr = childNodes.map((child) => {
            let children
            if (child.childNodes) {
                children = getChildNodes(child.childNodes)
            }
            return {
                text: `${child.desc} (${child.qty})`,
                value: child.value,
                id: Math.floor(Math.random() * 100 + 1),
                children,
                ...child
            }
        })
    }

    let total = 0
    childNodes &&
        childNodes.forEach((item) => {
            total += item.qty
        })

    const allChildChildren = { text: `全部 (${parent ? parent.qty : total})`, id: 0, value: '', desc: '全部' }
    arr.unshift(allChildChildren)

    return arr
}

// const getData = (list, isDevice = false) => {
//     if (!Array.isArray) {
//         return []
//     }
//     const rst = list.map((item) => {
//         const childNodes = item.childNodes
//         const isException = isDevice && item.desc === '异常' // 设备状态 - 左侧为异常的判断
//         let children
//         if (childNodes) {
//             children = getChildNodes(childNodes, isException)
//         }
//         return {
//             text: `${item.desc} (${item.qty})`,
//             ...item,
//             id: Math.floor(Math.random() * 100 + 1),
//             children
//         }
//     })

//     let total = 0
//     list.forEach((item) => { total += item.qty })
//     const totalVal = useData.total // 设备状态总和，接口会返回

//     const allChildren = [{ text: `全部 (${isDevice ? totalVal : total})`, id: 0, value: '', desc: '全部' }]

//     const all = {
//         text: `全部 (${isDevice ? totalVal : total})`,
//         children: allChildren,
//         disabled: !allChildren,
//         desc: '全部',
//         id: Math.floor(Math.random() * 100 + 1)
//     }
//     rst.unshift(all)
//     return rst
// }
const getData = (list, isDevice = false) => {
    if (!Array.isArray) {
        return []
    }
    const rst = list.map((item, i) => {
        const childNodes = item.childNodes
        let children
        if (childNodes) {
            children = getChildNodes(childNodes, item)
        }
        return {
            text: `${item.desc} (${item.qty})`,
            ...item,
            id: Math.floor(Math.random() * 100 + 1 + i),
            children
        }
    })

    let total = 0
    list.forEach((item) => { total += item.qty })

    const totalVal = useData.total // 设备状态总和，接口会返回

    const allChildren = [{ text: `全部 (${isDevice ? totalVal : total})`, id: 0, value: '', desc: '全部' }]

    const all = {
        text: `全部 (${isDevice ? totalVal : total})`,
        children: allChildren,
        disabled: !allChildren,
        desc: '全部',
        id: Math.floor(Math.random() * 100 + 1)
    }
    rst.unshift(all)
    return rst
}

const goDetail = (id) => {
    localStorage.setItem('target', 'details') // 从设备列表进来的先缓存下来源
    if (pageTab.value === 0) {
        // newPage(`/device/device-detail?index=${id}&target=detail&showNavbar=0`, {
        //     index: id,
        //     target: 'detail'
        // })
        router.replace({
            path: '/device/device-detail',
            query: {
                index: id,
                target: 'detail',
                showNavbar: 0
            }
        })
    } else {
        router.push({
            path: '/device/approval-details',
            query: {
                index: id
            }
        })
        // newPage(`/approval-details?index=${id}`)
    }
}
const signalHistory = async (id) => {
    newPage(`/history-signal?index=${id}`, {
        index: id
    })
}

const getDeviceNumber = async () => {
    const res = await getStatisticsOptions({})
    if (res.code === '200') {
        return Promise.resolve(res.data)
    }
}

const codes = ref('')
const showAddPopup = async () => {
    registerhandler('setScanResult', async (val) => {
        if (val.length) {
            codes.value = val.split('=')[1]
            // deviceCodes查询出设备名称
            const res = await getDeviceInfos({
                appKey: 'A1001001',
                deviceCode: codes.value
            })
            const cabinetRes = await getCabinetDevice({
                appKey: 'A1001001',
                busiCode: 'A1001022',
                deviceCode: codes.value
            })
            if (res.code === '200') {
                const { activeState } = res?.data
                // 如果激活1-详情页 0-未激活-跳转激活页
                if (activeState !== 0) {
                    if (cabinetRes?.data?.state === 1) {
                        newPage(`/device/device-detail?index=${codes.value || ''}&target=detail&showNavbar=0`, {
                            index: codes.value || '',
                            target: 'detail'
                        })
                    } else {
                        Toast(cabinetRes?.data?.state === 0 ? '该柜主跟此货柜无关联关系' : '该柜主下没有关联货柜')
                    }
                } else {
                    router.push({
                        path: '/device/device-activation',
                        query: {
                            key: codes.value || '',
                            name: res.data.deviceModelName || '',
                            showNavbar: 1
                        }
                    })
                }
            }
        } else {
            Toast('扫描二维码失败')
        }
    })
    appBridge('openScan', 2)
}

// 厂商列表数据
const approveInfo = ref({
    pageNum: 1,
    pageSize: 10,
    list: [],
    loading: false,
    finished: false,
    refreshLoading: false
})
const getApproveLists = async () => {
    approveInfo.value.loading = true
    const { code, data } = await getApproveList({
        busiCode: 'A1001022',
        appKey: 'A1001001',
        pageNo: approveInfo.value.pageNum,
        pageSize: approveInfo.value.pageSize
    })
    if (code === '200') {
        approveInfo.value.list = approveInfo.value.pageNum === 1 ? data.records : [...approveInfo.value.list, ...data.records]
        if (approveInfo.value.pageNum >= data.totalPage) approveInfo.value.finished = true
        approveInfo.value.pageNum++
    }
    if (approveInfo.value.refreshLoading) approveInfo.value.refreshLoading = false
    approveInfo.value.loading = false
}
</script>
<style lang="scss" scoped>
.device-management {
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #fe7e41;
    --van-nav-bar-title-font-size: 34px;
    .van-nav-bar__placeholder {
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
    }
// .arrow-down {
//            background:  url('../../assets/device/arrow-down@2x.png')

// }
      .pab {
    :deep(.van-tree-select__nav-item){
        font-size: 24px;
            display: flex;
    justify-content: space-between;
    align-items: center;
    height: 98px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #191919;

box-sizing: border-box;

}
    }
    .mask_div{
        width: 900px;
        height: 100vh;
        display: block;
        opacity: .2;
        background: rgb(0, 0, 0);
        z-index: 98;
    }
    .tab-jl-tab  {
        span{
font-size: 24px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #191919;
padding: 0 30px;
box-sizing: border-box;
        }

    }

    .icon--unselect {
       .van-icon-success:before
             {
                        position: absolute;
                        top: 1px;
                        left: 3px;
                        font-size: 26px;
                        background: red;
                    }
    }
    .tab-jl-tab:first-child{
        background: #F4F5F5;
    }
    .my-device {
        .active {
            color: var(--van-nav-bar-text-color) !important;
        }
        .mr5 {
            // margin-right: 10px;
            // margin-left: 10px;
        }
        .tab-wrap {
            display: flex;
            box-sizing: border-box;
            margin-left: 10px;

            span {
                width: 156px;
                padding: 7px 8px;
                display: flex;
                box-sizing: border-box;

                justify-content: center;
                align-items: center;
                margin-left: 20px;
                border-radius: 4px;
                border: 1px solid #bbbbbb;
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #696969;
                border-radius: 8px;
            }
        }
        // .tabs-span{
        //     box-sizing: border-box;
        //     display: flex;

        //     margin-right: 30px;

        //             margin-left: 30px;
        //        span{
        //         width: 156px;
        //         text-indent: 10px;
        //             display: flex;
        //     justify-content: space-between;
        //    align-items:center;

        //             box-sizing: border-box;

        //    margin-right: 10px;

        //     border-radius: 4px;
        //     border: 1px solid #BBBBBB;
        // font-size: 24px;
        // font-family: PingFangSC-Regular, PingFang SC;
        // font-weight: 400;
        // color: #696969;

        // }
        // }
        :deep(.van-tree-select__item--active) {
            color: var(--van-nav-bar-text-color);
        }
        :deep(.van-sidebar-item){
            background: #F4F5F5;

        }
        :deep(.van-tree-select__content){
            font-size: 3.2vw;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    // height: 13.066667vw;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191919;
    box-sizing: border-box;
        }
        .pab {
            width: 100%;
            position: absolute;
            top: 32px;
            z-index: 99;
            background-color: #fff;
        }
        .tabs {
            height: 100px;
            display: flex;
            flex-direction: column;
        }
        .container {
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .container > span {
            height: 60px;
            width: 100%;
            text-align: center;
            border-radius: 2px;
        }
        :deep(.van-tabs) {
            width: 100%;
            margin-top: 24px;
            position: relative;
            .van-tabs__wrap {
                height: max-content;
                padding-bottom: 5px;
            }
            .van-tabs__content {
                position: absolute;
                top: 90px;
                left: 0;
                width: 100%;
                z-index: 99;
            }
            .van-tab--active {
                width: 152px;
                height: 62px;
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #fe7e41 !important;
                color: #fe7e41 !important;
            }
            .van-tabs__nav {
                border: none;
                background: #f4f5f5;
                font-size: 24px;
                font-weight: 400;
                color: #696969;
                margin-left: 10px;
                height: max-content;
            }
            .van-tab--card {
                color: #696969;
                border: none;
                width: 152px;
                height: 62px;
                border-radius: 8px;
                border: 1px solid #bbbbbb;
                margin-left: 20px;
                box-sizing: border-box;
            }
        }
        .van-pull-refresh {
            min-height: calc(100vh - 92px - 88px - 108px - 100px - var(--van-status-bar-height));
            .van-list {
                .cell-item {
                    margin: 20px 30px 0;
                    padding: 40px 30px;
                    background: #ffffff;
                    border-radius: 8px;
                    .device-name {
                        display: flex;
                        align-items: center;
                        margin-bottom: 28px;
                        font-size: 30px;
                        font-weight: 500;
                        color: #191919;
                        img {
                            width: 32px;
                            height: 34px;
                            margin-right: 14px;
                        }
                    }
                    .device-desc {
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        margin-top: 12px;
                        span {
                            color: #191919;
                        }
                        .signal {
                            color: #69925a;
                        }
                        .color0 {
                            color: #ff2442;
                        }
                        .updateTime {
                            font-size: 24px;
                            color: #999999;
                            margin-left: 40px;
                        }
                    }
                }
            }
        }
    }
    .approve-list {
        .van-pull-refresh {
            .van-list {
                .cell-item {
                    margin: 20px 30px;
                    background-color: #fff;
                    border-radius: 8px;
                    .item-title {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 22px 30px;
                        .item-title--text {
                            font-size: 28px;
                            font-weight: 400;
                            color: #191919;
                        }
                        .item-title--state {
                            font-size: 24px;
                            font-weight: 400;
                            color: #ff2442;
                        }
                        .state0 {
                            color: #fe7e41;
                        }
                        .state1 {
                            color: #69925a;
                        }
                    }
                    .item-content {
                        padding: 8px 30px 30px;
                        .outside {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-top: 16px;
                            .withinLeft {
                                font-size: 26px;
                                font-weight: 400;
                                color: #b0b0b0;
                            }
                            .withinRight {
                                font-size: 26px;
                                font-weight: 400;
                                color: #191919;
                            }
                        }
                    }
                }
            }
        }
    }
    .empty {
        text-align: center;
        margin-top: 204px;
        img {
            width: 64%;
        }
        .no-data {
            display: block;
            font-size: 30px;
            color: #999999;
        }
    }
}
</style>
