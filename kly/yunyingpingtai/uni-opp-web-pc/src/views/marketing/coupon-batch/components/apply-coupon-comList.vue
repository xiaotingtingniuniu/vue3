<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="listDialogConfig" :before-close="handleClose">
            <template #headers>
                <div class='dialog-title'>
                    {{dialogTitle}}
                </div>
            </template>
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <div v-if="listType === 'costAccount'">
                        <el-form-item label="账户编号" prop="acctId">
                            <el-input v-model="searchData.acctId" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="账户名称" prop="acctName">
                            <el-input v-model="searchData.acctName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="预算中心" prop="centorCode">
                            <el-select v-model="searchData.centorCode" clearable placeholder="请选择" >
                                <el-option label="恒生活App" value="A1001001" />
                                <el-option label="智能货柜" value="A1001002" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预算科目" prop="subjectName">
                            <el-input v-model="searchData.subjectName" placeholder="请输入" disabled />
                        </el-form-item>
                        <el-form-item label="申请项目" prop="projectName">
                            <el-input v-model="searchData.projectName" placeholder="请输入" disabled />
                        </el-form-item>
                        <el-form-item label="状态" prop="acctStatus">
                            <el-select v-model="searchData.acctStatus" clearable placeholder="请选择" disabled>
                                <el-option label="启用" value="1" />
                                <el-option label="停用" value="2" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预算期间" prop="budgetPeriod">
                            <el-input v-model="searchData.budgetPeriod" placeholder="请输入" disabled />
                        </el-form-item>
                    </div>
                    <div v-if="listType === 'goodsSku'">
                        <el-form-item label="业务线" prop="channels">
                            <el-select class="form-action-item-50w" v-model="searchData.channels" placeholder="请选择" disabled>
                                <el-option label="全部" value="1" />
                                <el-option label="智能货柜" value="2" />
                                <el-option label="门店" value="3" />
                                <el-option label="生活充值" value="4" />
                                <el-option label="电商到家" value="5" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品编号" prop="skuIds">
                            <el-input v-model="searchData.skuIds" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="商品名称" prop="skuName">
                            <el-input v-model="searchData.skuName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="商品分类" prop="cateCode">
                            <el-cascader
                                v-model="searchData.cateCode"
                                :props="goodsClassifyPropsList"
                                @change="goodsClassifyChange"
                            />
                        </el-form-item>
                        <el-form-item label="商品状态" prop="skuStatus">
                            <el-select v-model="searchData.skuStatus" clearable placeholder="请选择" >
                                <el-option label="已上架" value="4" />
                                <el-option label="已下架" value="5" />
                                <el-option label="停用" value="6" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div v-if="listType === 'goodsSkuGroup'">
                        <el-form-item label="生效城市" prop="cityCode" v-if="!cityAll">
                            <el-select v-model="cityChecked" disabled multiple>
                                <el-option
                                    v-for="(item, index) in props.provinceCityInfo"
                                    :key="index"
                                    :label="item.cityName"
                                    :value="item.cityCode"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生效城市" prop="cityCode" v-if="cityAll">
                            <el-select v-model="cityChecked" disabled multiple>
                                <el-option
                                    label="全国"
                                    value=""
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="业务线" prop="channels">
                            <el-select class="form-action-item-50w" v-model="searchData.channels" placeholder="请选择" disabled>
                                <el-option label="全部" value="1" />
                                <el-option label="智能货柜" value="2" />
                                <el-option label="门店" value="3" />
                                <el-option label="生活充值" value="4" />
                                <el-option label="电商到家" value="5" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品编号" prop="skuIds">
                            <el-input v-model="searchData.skuIds" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="商品名称" prop="skuName">
                            <el-input v-model="searchData.skuName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="商品分类" prop="cateCode">
                            <el-cascader
                                v-model="searchData.cateCode"
                                :props="goodsClassifyPropsList"
                                @change="goodsClassifyChange"
                            />
                        </el-form-item>
                        <el-form-item label="商品状态" prop="skuStatus">
                            <el-select v-model="searchData.skuStatus" clearable placeholder="请选择" >
                                <el-option label="已上架" value="4" />
                                <el-option label="已下架" value="5" />
                                <el-option label="停用" value="6" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商户编号" prop="merchantCode">
                            <el-input v-model="searchData.merchantCode" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="商户名称" prop="merchantName">
                            <el-input v-model="searchData.merchantName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="店铺编号" prop="storeId">
                            <el-input v-model="searchData.storeId" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="店铺名称" prop="storeName">
                            <el-input v-model="searchData.storeName" placeholder="请输入" clearable />
                        </el-form-item>
                    </div>
                    <div v-if="listType === 'goodsSpu'">
                        <el-form-item label="业务线" prop="channels">
                            <el-select class="form-action-item-50w" v-model="searchData.channels" placeholder="请选择" disabled>
                                <el-option label="全部" value="1" />
                                <el-option label="智能货柜" value="2" />
                                <el-option label="门店" value="3" />
                                <el-option label="生活充值" value="4" />
                                <el-option label="电商到家" value="5" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品编号" prop="spuIds">
                            <el-input v-model="searchData.spuIds" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="商品名称" prop="spuName">
                            <el-input v-model="searchData.spuName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="商品分类" prop="cateCode">
                            <el-cascader
                                v-model="searchData.cateCode"
                                :props="goodsClassifyPropsList"
                                @change="goodsClassifyChange"
                            />
                        </el-form-item>
                        <el-form-item label="商品状态" prop="isEnabled">
                            <el-select v-model="searchData.isEnabled" disabled placeholder="请选择" >
                                <el-option label="启用" value="1" />
                                <el-option label="停用" value="0" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="条形码" prop="barcodes">
                            <el-input v-model="searchData.barcodes" placeholder="请输入" clearable />
                        </el-form-item>
                    </div>
                    <div v-if="listType === 'shop'">
                        <el-form-item label="店铺编号" prop="storeCode">
                            <el-input v-model="searchData.storeCode" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="店铺名称" prop="storeName">
                            <el-input v-model="searchData.storeName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="店铺类型" prop="storeType">
                            <el-select v-model="searchData.storeType" clearable placeholder="请选择" >
                                <el-option label="直营" value="0" />
                                <el-option label="加盟" value="1" />
                                <el-option label="合作" value="2" />
                                <el-option label="线下门店" value="3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="店铺状态" prop="storeStatus">
                            <el-select v-model="searchData.storeStatus" clearable placeholder="请选择" >
                                <el-option label="关闭" value="0" />
                                <el-option label="开启" value="1" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div v-if="listType === 'point'">
                        <a-row v-if="props.spuInfo.spuId !=='all_spu'">
                            <el-form-item label="spu编号" prop="storeType">
                                {{props.spuInfo.spuId}}
                            </el-form-item>
                            <el-form-item label="spu名称：" prop="storeType">
                                {{props.spuInfo.spuName}}
                            </el-form-item>
                            <el-form-item label="商品分类：" prop="storeType">
                                {{props.spuInfo.firstCateName}}-{{props.spuInfo.secondCateName}}-{{props.spuInfo.thirdCateName}}-{{props.spuInfo.fourthCateName}}
                            </el-form-item>
                        </a-row>
                        <br>
                        <el-form-item label="生效城市" prop="storeType" v-if="!cityAll">
                            <el-select v-model="cityChecked" disabled multiple>
                                <el-option
                                    v-for="(item, index) in props.provinceCityInfo"
                                    :key="index"
                                    :label="item.cityName"
                                    :value="item.cityCode"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生效城市" prop="storeType" v-if="cityAll">
                            <el-select v-model="cityChecked" disabled multiple>
                                <el-option
                                    label="全国"
                                    value=""
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="合同货柜编号" prop="pointId">
                            <el-input v-model="searchData.pointId" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="点位名称" prop="pointAddr">
                            <el-input v-model="searchData.pointAddr" placeholder="请输入" clearable />
                        </el-form-item>
                    </div>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList()">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <el-button type="primary" @click="exportList()" v-if="listType === 'point'">
                            批量导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area" v-if="listType !== 'point'">
                <system-list
                    :tHead="tHead"
                    :tableData="tableData"
                    :rowKey="getRowKeys"
                    v-model:current-page="pageinfo.currentPage"
                    v-model:page-size="pageinfo.pageSize"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    @select="handleChange"
                    @selectAll="handleChange"
                    ref="tableRef"
                >
                    <template #radio="row">
                        <el-radio :label="row.$index" v-model="dataState.radio" @change="getCurrentRow(row.row)"></el-radio>
                    </template>
                    <template #acctStatus="row">
                        {{row.row.acctStatus === 1 ? '启用' : '停用'}}
                    </template>
                    <template #thumbnail="scope">
                        <img :src="scope.row.thumbnail" alt="">
                    </template>
                    <template #skuInfo="scope" v-if="listType === 'goodsSku'">
                        <span>商品：{{scope.row.skuId}}-{{scope.row.skuName}}</span><br/>
                        <span>商品状态：{{skuStatusKeyValue[scope.row.skuOnshelfStatus]}}</span><br/>
                        <span>商品分类：{{scope.row.firstCateName}}-{{scope.row.secondCateName}}-{{scope.row.thirdCateName}}-{{scope.row.fourthCateName}}</span><br/>
                    </template>
                    <template #skuInfoGroup="scope">
                        <span>商品：{{scope.row.skuId}}-{{scope.row.skuName}}</span><br/>
                        <span>商品状态：{{skuStatusKeyValue[scope.row.skuStatus.toString()]}}</span><br/>
                    </template>
                    <template #storeType="scope">
                        {{storeTypeKeyValue[scope.row.storeType]}}
                    </template>
                    <template #storeStatus="scope">
                        {{scope.row.storeStatus === 1 ? '开启' : '关闭'}}
                    </template>
                    <template #spuInfo="scope">
                        <span>商品：{{scope.row.spuId}}-{{scope.row.spuName}}</span><br/>
                        <span>商品状态：{{isEnabledKeyValue[scope.row.isEnabled]}}</span><br/>
                        <span>商品分类：{{scope.row.firstCateName}}-{{scope.row.secondCateName}}-{{scope.row.thirdCateName}}-{{scope.row.fourthCateName}}</span><br/>
                    </template>
                    <template #spuImg="scope">
                        <img :src="scope.row.spuImg" alt="">
                    </template>
                    <template #merchanInfo="scope">
                        <span>商户编号：{{scope.row.merchantId}}</span><br/>
                        <span>商户名称：{{scope.row.merchantName}}</span><br/>
                    </template>
                    <template #storeInfo="scope">
                        <span>店铺编号：{{scope.row.secondChannelId}}</span><br/>
                        <span>店铺名称：{{scope.row.secondChannelName}}</span><br/>
                    </template>
                    <template #salePriceGropu="scope">
                        <span>原价：{{scope.row.markOffPrice ? '¥' + scope.row.markOffPrice / 100 : '--'}}</span><br/>
                        <span>团购价：{{scope.row.specialPrice ? '¥' + scope.row.specialPrice / 100 : '--'}}</span><br/>
                    </template>
                </system-list>
            </div>
            <div class="tableList-area" v-if="listType === 'point'">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-change="tabhandleChange">
                    <el-tab-pane label="全部" name="first" v-if="props.handleType !== 'detail' && props.handleType !== 'approval'">
                        <template #label>
                            全部（{{pageinfo.total}}）
                        </template>
                        <system-list
                            :tHead="tHead"
                            :tableData="tableData"
                            :rowKey="getRowKeys"
                            v-model:current-page="pageinfo.currentPage"
                            v-model:page-size="pageinfo.pageSize"
                            :total="pageinfo.total"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            @select="handleChange"
                            @selectAll="handleChange"
                            ref="tableRef"
                        >
                            <template #pointInfo="scope">
                                <span>合同货柜编号：{{scope.row.pointId}}-</span><br/>
                                <span>点位名称：{{scope.row.locationName}}</span><br/>
                                <span>点位地址：{{scope.row.pointAddr}}</span><br/>
                            </template>
                            <template #skuInfo="scope">
                                <div v-for="(item, index) in scope.row.skuList" :key="index">
                                    <span>
                                        <span v-if="item.thirdChannelId !== '0'">
                                            {{item.thirdChannelName }}
                                        </span>
                                        <span>价格：¥{{item.channelPrice }}</span>
                                    </span><br/>
                                    <span>sku编号：{{item.skuId}}</span><br/>
                                    <span>sku名称：{{item.skuName}}</span><br/>
                                </div>
                            </template>
                            <template #deviceInfo="scope">
                                <span>设备编号：{{scope.row.deviceCode}}</span><br/>
                                <span>设备名称：{{scope.row.deviceName}}</span><br/>
                                <span>设备型号：{{scope.row.deviceModelName}}</span>
                            </template>
                            <template #openWay="scope">
                                <p v-for="(item, index) in scope.row.supportOpenMethods" :key="index">
                                    {{index + 1}}、{{item}}
                                </p>
                            </template>
                        </system-list>
                    </el-tab-pane>
                    <el-tab-pane name="second">
                        <template #label>
                            已选（{{pageinfo.totalChecked}}）
                        </template>
                        <system-list
                            :tHead="tHead2"
                            :tableData="tableDataChecked"
                            v-model:current-page="pageinfo.currentPageChecked"
                            v-model:page-size="pageinfo.pageSizeChecked"
                            :total="pageinfo.totalChecked"
                            @size-change="sizeChangeChecked"
                            @current-change="currentChangeChecked"
                            ref="tableRef2"
                        >
                            <template #pointInfo="scope">
                                <span>合同货柜编号：{{scope.row.pointId}}-</span><br/>
                                <span>点位名称：{{scope.row.locationName}}</span><br/>
                                <span>点位地址：{{scope.row.pointAddr}}</span><br/>
                            </template>
                            <template #skuInfo="scope">
                                <div v-for="(item, index) in scope.row.skuList" :key="index">
                                    <span>
                                        <span v-if="item.thirdChannelId !== '0'">
                                            {{item.thirdChannelName }}
                                        </span>
                                        <span>价格：¥{{item.channelPrice }}</span>
                                    </span><br/>
                                    <span>sku编号：{{item.skuId}}</span><br/>
                                    <span>sku名称：{{item.skuName}}</span><br/>
                                    <!--<span>价格：{{scope.row.channelPrice}}</span><br/> -->
                                </div>

                            </template>
                            <template #deviceInfo="scope">
                                <span>设备编号：{{scope.row.deviceCode}}</span><br/>
                                <span>设备名称：{{scope.row.deviceName}}</span><br/>
                                <span>设备型号：{{scope.row.deviceModelName}}</span>

                            </template>
                            <template #openWay="scope">
                                <p v-for="(item, index) in scope.row.supportOpenMethods" :key="index">
                                    {{index + 1}}、{{item}}
                                </p>
                            </template>
                        </system-list>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="submit" v-if="props.handleType !== 'detail' && props.handleType !== 'approval'">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import SystemList from '@/composables/TablePagination/index.vue'
import { getAccList, getShopList } from '@/api/marketing/coupon'
import { getGoodsList, getBusiCate } from '@/api/marketing/active'
import { getMerchantList, publicRequest, exportCommon } from '@/api/operate/index'
import { queryCategory } from '@/utils'
import { ElMessage } from 'element-plus'

const store = useStore()
const tableRef = ref()
const dialogTitleKeyValue = {
    costAccount: '账户选择',
    goodsSku: 'sku商品选择',
    goodsSkuGroup: 'sku商品选择',
    goodsSpu: 'spu商品选择',
    shop: '门店选择',
    point: '合同货柜选择'
}
const userInfo = computed(() => store.state.userInfo)
const curSelectedRowIds = computed(() => {
    let result = []
    if (dataState.currentDialogCheckedAll && dataState.currentDialogCheckedAll.length > 0) {
        if (props.listType === 'costAccount') {
            result = dataState.currentDialogCheckedAll.map((item) => item.budgetId)
        } else if (props.listType === 'goodsSku' || props.listType === 'goodsSkuGroup') {
            result = dataState.currentDialogCheckedAll.map((item) => item.skuId)
        } else if (props.listType === 'shop') {
            result = dataState.currentDialogCheckedAll.map((item) => item.storeCode)
        } else if (props.listType === 'goodsSpu') {
            result = dataState.currentDialogCheckedAll.map((item) => item.spuId)
        } else if (props.listType === 'point') {
            result = dataState.currentDialogCheckedAll.map((item) => item)
        }
    }
    return result
})
const emit = defineEmits(['handleClose', 'pagerUpdate', 'getDialogCheckedData'])
const props = defineProps({
    listVisible: {
        type: Boolean
    },
    listType: {
        type: String
    },
    handleType: {
        type: String
    },
    provinceCityInfo: {
        type: Array
    },
    listIndex: {
        type: Number
    },
    hasSelectList: {
        type: Array
    },
    pointChecked: {
        type: Array
    },
    businessCode: {
        type: Array
    },
    spuInfo: {
        type: Object
    }
})
// 已选生效城市
const cityChecked = []
const cityAll = ref(false)
if (props.provinceCityInfo) {
    if (props.provinceCityInfo.length === 0) {
        cityAll.value = true
    } else {
        cityAll.value = false
        props.provinceCityInfo.map(item => {
            if (props.businessCode === '2') {
                cityChecked.push(item.cityName)
            } else {
                cityChecked.push(item.cityCode)
            }
            // cityChecked.push(item.cityName)
        })
    }
}
const dialogTitle = computed(() => {
    return dialogTitleKeyValue[props.listType]
})
const listDialogConfig = ref(props.listVisible)
const tHeadKeyValue = {
    costAccount: [
        // { align: 'center', tooltip: true, prop: 'radio', label: '选择', width: '60', slot: true },
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        { align: 'center', tooltip: true, prop: 'acctId', label: '账户编号', width: 250 },
        { align: 'center', tooltip: true, prop: 'acctName', label: '账户名称', width: 250 },
        { align: 'center', tooltip: true, prop: 'deptName', label: '机构', width: 100 },
        { align: 'center', tooltip: true, prop: 'centorName', label: '预算中心', width: 100 },
        { align: 'center', tooltip: true, prop: 'subjectName', label: '预算科目', width: 100 },
        { align: 'center', tooltip: true, prop: 'projectName', label: '预算项目', width: 100 },
        { align: 'center', tooltip: true, prop: 'budgetAmount', label: '预算金额', width: 100 },
        { align: 'center', tooltip: true, prop: 'freezeAmount', label: '已冻结金额', width: 100 },
        { align: 'center', tooltip: true, prop: 'usedAmount', label: '已使用金额', width: 100 },
        { align: 'center', tooltip: true, prop: 'balanceAmount', label: '剩余金额', width: 100 },
        { align: 'center', tooltip: true, prop: 'acctStatus', label: '状态', width: 100, slot: true }
    ],
    goodsSku: [
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        { align: 'center', prop: 'thumbnail', label: '图片', width: 120, slot: true },
        { align: 'center', tooltip: true, prop: 'skuInfo', label: 'sku', slot: true },
        { align: 'center', tooltip: true, prop: 'salePrice', label: '当前价格', width: 100 }
    ],
    goodsSkuGroup: [
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        { align: 'center', prop: 'merchanInfo', label: '商户', width: 120, slot: true },
        { align: 'center', prop: 'storeInfo', label: '店铺信息', width: 120, slot: true },
        { align: 'center', prop: 'thumbnail', label: '图片', width: 120, slot: true },
        { align: 'center', tooltip: true, prop: 'skuInfoGroup', label: 'sku', slot: true },
        { align: 'center', tooltip: true, prop: 'salePriceGropu', label: '当前价格', width: 150, slot: true }
    ],
    goodsSpu: [
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        { align: 'center', prop: 'spuImg', label: '图片', width: 120, slot: true },
        { align: 'center', tooltip: true, prop: 'spuInfo', label: 'spu', slot: true },
        { align: 'center', tooltip: true, prop: 'barcode', label: '条形码', width: 100 }
    ],
    shop: [
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        // { align: 'center', prop: 'thumbnail', label: '省份', width: 120 },
        { align: 'center', prop: 'cityName', label: '城市', width: 100 },
        { align: 'center', prop: 'storeType', label: '店铺类别', width: 100, slot: true },
        { align: 'center', prop: 'storeStatus', label: '店铺状态', width: 100, slot: true },
        { align: 'center', tooltip: true, prop: 'id', label: '店铺编号', width: 100 },
        { align: 'center', tooltip: true, prop: 'storeName', label: '店铺名称' }
    ],
    point: [
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        { align: 'center', prop: 'pointInfo', label: '合同货柜信息', width: 200, slot: true },
        { align: 'center', prop: 'deviceInfo', label: '设备信息', width: 200, slot: true },
        { align: 'center', prop: 'openWay', label: '支持开门方式', slot: true },
        { align: 'center', tooltip: true, prop: 'skuInfo', label: 'sku信息', slot: true, width: 200 }
    ],
    pointHad: [
        { align: 'center', prop: 'pointInfo', label: '合同货柜信息', width: 200, slot: true },
        { align: 'center', prop: 'deviceInfo', label: '设备信息', width: 200, slot: true },
        { align: 'center', prop: 'openWay', label: '支持开门方式', slot: true },
        { align: 'center', tooltip: true, prop: 'skuInfo', label: 'sku信息', slot: true, width: 200 }
    ]
}
const tHead = computed(() => {
    return tHeadKeyValue[props.listType]
})
const tHead2 = tHeadKeyValue.pointHad
const dataState = reactive({
    searchData: {
        // 成本账户
        acctId: '',
        acctName: '',
        centorCode: '',
        subjectName: '营销费用',
        projectName: '优惠券',
        acctStatus: '1',
        budgetPeriod: '',
        // 商品-sku
        channels: props.businessCode || '',
        skuIds: '',
        skuName: '',
        skuStatus: '4',
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourthCateName: '',
        storeId: '',
        storeName: '',
        merchantCode: '',
        merchantName: '',
        cityCode: '',
        // 门店
        storeCode: '',
        storeType: '',
        storeStatus: '',
        // 商品-spu
        spuIds: '',
        spuName: '',
        isEnabled: '1',
        barcodes: '',
        // 点位选择
        pointId: '',
        pointAddr: '',
        city: cityChecked
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        totalChecked: 0,
        currentPageChecked: 1,
        pageSizeChecked: 10
    },
    tableData: [],
    tableDataChecked: [],
    radio: null,
    currentDialogCheckedAll: [],
    skuStatusKeyValue: {
        1: '待审核',
        2: '已审核',
        3: '已拒绝',
        4: '已上架',
        5: '下架可上架',
        6: '下架',
        7: '待上架'
    },
    isEnabledKeyValue: {
        1: '启用',
        0: '停用'
    },
    storeTypeKeyValue: {
        0: '直营',
        1: '加盟',
        2: '合作',
        3: '线下门店'
    },
    pointListVisible: true
})
const { tableData, tableDataChecked, searchData, pageinfo, skuStatusKeyValue, storeTypeKeyValue, isEnabledKeyValue } = toRefs(dataState)

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    dataState.searchData.firstCateCode = ''
    dataState.searchData.secondCateCode = ''
    dataState.searchData.thirdCateCode = ''
}

// 点位选择切换待选/已选
const activeName = ref('first')
const tabhandleChange = (name) => {
    console.log(name)
    // if (name === 'first') {
    //     queryAllPoint()
    // } else if (name === 'second') {
    //     queryCheckedPoint()
    // }
}
const checkRows = () => {
    dataState.currentDialogCheckedAll = JSON.parse(JSON.stringify(props.hasSelectList))
    const checkedList = dataState.currentDialogCheckedAll
    nextTick(() => {
        dataState.tableData.forEach((row) => {
            checkedList.forEach((item) => {
                if (props.listType === 'costAccount') {
                    if (item.budgetId === row.budgetId) {
                        tableRef.value.tableRef.toggleRowSelection(row, true)
                    }
                } else if (props.listType === 'goodsSku' || props.listType === 'goodsSkuGroup') {
                    if (item.skuId === row.skuId) {
                        tableRef.value.tableRef.toggleRowSelection(row, true)
                    }
                } else if (props.listType === 'goodsSpu') {
                    if (item.spuId === row.spuId) {
                        tableRef.value.tableRef.toggleRowSelection(row, true)
                    }
                } else if (props.listType === 'shop') {
                    if (item.storeCode === row.storeCode) {
                        tableRef.value.tableRef.toggleRowSelection(row, true)
                    }
                } else if (props.listType === 'point') {
                    if (item === row.pointId) {
                        tableRef.value.tableRef.toggleRowSelection(row, true)
                    }
                }
            })
        })
    })
}

// 获取列表
const getList = async () => {
    if (props.listType === 'costAccount') {
        queryCostAccountList()
    } else if (props.listType === 'goodsSku') {
        querySkuList()
    } else if (props.listType === 'goodsSkuGroup') {
        queryGroupSkuList()
    } else if (props.listType === 'goodsSpu') {
        querySpuList()
    } else if (props.listType === 'shop') {
        queryShopList()
    } else if (props.listType === 'point') {
        if (props.handleType === 'detail' || props.handleType === 'approval') {
            activeName.value = 'second'
        }
        queryAllPoint()
        queryCheckedPoint()
    }
}

// 获取成本账户列表
const queryCostAccountList = async () => {
    const param = {
        appKey: 'A1001001',
        busCode: 'A1001001',
        acctId: dataState.searchData.acctId,
        acctName: dataState.searchData.acctName,
        centorCode: dataState.searchData.centorCode,
        subjectName: dataState.searchData.subjectName,
        projectName: dataState.searchData.projectName,
        acctStatus: dataState.searchData.acctStatus,
        budgetPeriod: dataState.searchData.budgetPeriod,
        budgetAmountGreaterZero: 1,
        currPage: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize
    }
    const res = await getAccList(param)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        dataState.pageinfo.total = res.data.totalCount
        checkRows()
    }
}
// 获取Sku列表
const querySkuList = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: props.businessCode === '2' ? 'A1001002' : props.businessCode === '3' ? 'A1001001' : props.businessCode === '5' ? 'A1001004' : '',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC16582257103870OxkY',
        name: '秒杀商品列表',
        source: '营销中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        body: {
            appKey: 'A1001001',
            busiCode: props.businessCode === '2' ? 'A1001002' : props.businessCode === '3' ? 'A1001001' : props.businessCode === '5' ? 'A1001004' : '',
            channels: dataState.searchData.channels,
            skuIds: dataState.searchData.skuIds,
            skuName: dataState.searchData.skuName,
            firstCateCode: dataState.searchData.firstCateCode,
            secondCateCode: dataState.searchData.secondCateCode,
            thirdCateCode: dataState.searchData.thirdCateCode,
            fourthCateCode: dataState.searchData.fourthCateCode,
            skuStatus: dataState.searchData.skuStatus,
            currPage: pageinfo.value.currentPage,
            pageSize: pageinfo.value.pageSize
        }
    }
    const res = await getGoodsList(param)
    if (res.code === '200') {
        dataState.tableData = []
        if (res.data.list) {
            res.data.list.map(item => {
                dataState.tableData.push(item)
            })
        }
        dataState.pageinfo.total = res.data.total
        checkRows()
    }
}
// 获取Sku列表-团购
const queryGroupSkuList = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001003',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UCJH56463083344916480',
        name: '团购商品管理聚合',
        source: '运营后台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001003',
            channels: dataState.searchData.channels,
            skuIds: [dataState.searchData.skuIds],
            skuName: dataState.searchData.skuName,
            cityCodes: cityChecked,
            firstCateCode: dataState.searchData.firstCateCode,
            secondCateCode: dataState.searchData.secondCateCode,
            thirdCateCode: dataState.searchData.thirdCateCode,
            fourthCateCode: dataState.searchData.fourthCateCode,
            secondChannelIds: dataState.searchData.storeId ? [dataState.searchData.storeId] : [],
            secondChannelName: dataState.searchData.storeName,
            merchantIds: dataState.searchData.merchantCode ? [dataState.searchData.merchantCode] : [],
            merchantNames: dataState.searchData.merchantName ? [dataState.searchData.merchantName] : [],
            skuStatus: [dataState.searchData.skuStatus],
            pageNo: pageinfo.value.currentPage,
            pageSize: pageinfo.value.pageSize
        }
    }
    const res = await getGoodsList(param)
    if (res.code === '200') {
        dataState.tableData = []
        if (res.data.list) {
            res.data.list.map(item => {
                dataState.tableData.push(item)
            })
        }
        dataState.pageinfo.total = res.data.total
        checkRows()
    }
}
// 获取Spu列表
const querySpuList = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            spuIds: [dataState.searchData.spuIds],
            spuName: dataState.searchData.spuName,
            isEnabled: dataState.searchData.isEnabled,
            barcodes: [dataState.searchData.barcodes],
            pageNo: pageinfo.value.currentPage,
            pageSize: pageinfo.value.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC15115376448741376',
        name: 'spu通用搜索接口V2',
        source: '商品中台'
    }
    const res = await getMerchantList(params)
    dataState.tableData = []
    if (res.list) {
        res.list.map(item => {
            if (item.spuMediaList) {
                const media = item.spuMediaList.filter(ele => ele.mediaType === 4)
                item.spuImg = media[0] && media[0].mediaUrl
            }
            dataState.tableData.push(item)
        })
    }
    dataState.pageinfo.total = res.total
    checkRows()
}
// 获取商铺列表
const queryShopList = async () => {
    const param = {
        appKey: 'A1001001',
        busCode: 'A1001001',
        storeCode: dataState.searchData.storeCode,
        storeName: dataState.searchData.storeName,
        storeType: dataState.searchData.storeType,
        storeStatus: dataState.searchData.storeStatus,
        current: pageinfo.value.currentPage,
        size: pageinfo.value.pageSize
    }
    const res = await getShopList(param)
    if (res.code === 200) {
        dataState.tableData = []
        dataState.tableData = res.data.records
        dataState.pageinfo.total = res.data.total
        checkRows()
    }
}
// 全部点位列表
const queryAllPoint = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            pointId: dataState.searchData.pointId === '' ? [] : [dataState.searchData.pointId],
            pointAddr: dataState.searchData.pointAddr,
            city: dataState.searchData.city,
            spuId: props.spuInfo.spuId === 'all_spu' ? '' : props.spuInfo.spuId,
            pageNum: pageinfo.value.currentPage,
            pageSize: pageinfo.value.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UCJH43371847664545792',
        name: '点位列表聚合',
        source: '运营后台'
    }
    const res = await publicRequest(params)
    if (res.code === '200') {
        dataState.tableData = []
        dataState.tableData = res?.data?.list ? res?.data?.list : []
        dataState.pageinfo.total = res?.data?.totalCount ? res?.data?.totalCount : 0
        checkRows()
    }
}
// 点位已选列表
const queryCheckedPoint = async () => {
    if (!props.hasSelectList || props.hasSelectList.length === 0) {
        dataState.tableDataChecked = []
        return
    }
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            pointId: props.hasSelectList[0] === 'all_point' ? [] : props.hasSelectList,
            pointAddr: dataState.searchData.pointAddr,
            city: dataState.searchData.city,
            spuId: props.spuInfo.spuId === 'all_spu' ? '' : props.spuInfo.spuId,
            pageNum: pageinfo.value.currentPageChecked,
            pageSize: pageinfo.value.pageSizeChecked
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UCJH43371847664545792',
        name: '点位列表聚合',
        source: '运营后台'
    }
    const res = await publicRequest(params)
    if (res.code === '200') {
        dataState.tableDataChecked = res.data.list
        dataState.pageinfo.totalChecked = res.data.totalCount
    }
}
// 搜索查询列表
const searchList = async () => {
    pageinfo.value.currentPage = 1
    getList()
}
// 当前页数改变
const currentChange = (val) => {
    pageinfo.value.currentPage = val
    getList()
}
const sizeChange = (val) => {
    pageinfo.value.currentPage = 1
    pageinfo.value.pageSize = val
    getList()
}
// 当前页数改变-已选
const currentChangeChecked = (val) => {
    pageinfo.value.currentPageChecked = val
    queryCheckedPoint()
}
const sizeChangeChecked = (val) => {
    pageinfo.value.currentPageChecked = 1
    pageinfo.value.pageSizeChecked = val
    queryCheckedPoint()
}

const handleChange = (selection, changedRow) => {
    let selectAll = false
    // 检查有没有新增的，有新增的就push
    if (selection && selection.length > 0) {
        if (selection.length < dataState.currentDialogCheckedAll.length) {
            selectAll = false
        } else {
            selectAll = true
        }
        selection.forEach((row) => {
            if (props.listType === 'costAccount') {
                if (curSelectedRowIds.value.indexOf(row.budgetId) < 0) {
                    dataState.currentDialogCheckedAll.push(row)
                }
            } else if (props.listType === 'goodsSku' || props.listType === 'goodsSkuGroup') {
                if (curSelectedRowIds.value.indexOf(row.skuId) < 0) {
                    dataState.currentDialogCheckedAll.push(row)
                }
            } else if (props.listType === 'goodsSpu') {
                if (curSelectedRowIds.value.indexOf(row.spuId) < 0) {
                    dataState.currentDialogCheckedAll.push(row)
                }
            } else if (props.listType === 'shop') {
                if (curSelectedRowIds.value.indexOf(row.storeCode) < 0) {
                    dataState.currentDialogCheckedAll.push(row)
                }
            } else if (props.listType === 'point') {
                if (curSelectedRowIds.value.indexOf(row.pointId) < 0) {
                    dataState.currentDialogCheckedAll.push(row.pointId)
                }
            }
        })
    }
    // 如果当前的selection没有changedRow，表示changedRow被cancel了，
    // 如果this.multipleSelection有这一条，需要splice掉
    if (changedRow) {
        if (selection.indexOf(changedRow) < 0) {
            let changedRowId = ''
            if (props.listType === 'costAccount') {
                changedRowId = changedRow.budgetId
            } else if (props.listType === 'goodsSku' || props.listType === 'goodsSkuGroup') {
                changedRowId = changedRow.skuId
            } else if (props.listType === 'goodsSpu') {
                changedRowId = changedRow.spuId
            } else if (props.listType === 'shop') {
                changedRowId = changedRow.storeCode
            } else if (props.listType === 'point') {
                changedRowId = changedRow.pointId
            }
            if (curSelectedRowIds.value.indexOf(changedRowId) > -1) {
                for (let index = 0; index < dataState.currentDialogCheckedAll.length; index++) {
                    if (props.listType === 'costAccount') {
                        if (changedRowId === dataState.currentDialogCheckedAll[index].budgetId) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                            break
                        }
                    } else if (props.listType === 'goodsSku' || props.listType === 'goodsSkuGroup') {
                        if (changedRowId === dataState.currentDialogCheckedAll[index].skuId) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                            break
                        }
                    } else if (props.listType === 'goodsSpu') {
                        if (changedRowId === dataState.currentDialogCheckedAll[index].spuId) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                            break
                        }
                    } else if (props.listType === 'shop') {
                        if (changedRowId === dataState.currentDialogCheckedAll[index].storeCode) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                            break
                        }
                    } else if (props.listType === 'point') {
                        if (changedRowId === dataState.currentDialogCheckedAll[index]) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                            break
                        }
                    }
                }
            }
        }
    } else {
        if (!selectAll) {
            if (selection.length < dataState.currentDialogCheckedAll.length) {
                dataState.tableData.forEach((row) => {
                    if (props.listType === 'costAccount') {
                        const index = curSelectedRowIds.value.indexOf(row.budgetId)
                        if (index > -1) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                        }
                    } else if (props.listType === 'goodsSku' || props.listType === 'goodsSkuGroup') {
                        const index = curSelectedRowIds.value.indexOf(row.skuId)
                        if (index > -1) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                        }
                    } else if (props.listType === 'goodsSpu') {
                        const index = curSelectedRowIds.value.indexOf(row.spuId)
                        if (index > -1) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                        }
                    } else if (props.listType === 'shop') {
                        const index = curSelectedRowIds.value.indexOf(row.storeCode)
                        if (index > -1) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                        }
                    } else if (props.listType === 'point') {
                        const index = curSelectedRowIds.value.indexOf(row.pointId)
                        if (index > -1) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                        }
                    }
                })
            }
        }
    }
    // 如果当前一条都没有选中，表示都没有选中，则需要把当前页面的rows都遍历一下，splice掉没选中的
    // if (selection.length === 0) {
    //     dataState.tableData.forEach((row) => {
    //         if (props.listType === 'costAccount') {
    //             const index = curSelectedRowIds.value.indexOf(row.budgetId)
    //             if (index > -1) {
    //                 dataState.currentDialogCheckedAll.splice(index, 1)
    //             }
    //         } else if (props.listType === 'goodsSku' || props.listType === 'goodsSkuGroup') {
    //             const index = curSelectedRowIds.value.indexOf(row.skuId)
    //             if (index > -1) {
    //                 dataState.currentDialogCheckedAll.splice(index, 1)
    //             }
    //         } else if (props.listType === 'goodsSpu') {
    //             const index = curSelectedRowIds.value.indexOf(row.spuId)
    //             if (index > -1) {
    //                 dataState.currentDialogCheckedAll.splice(index, 1)
    //             }
    //         } else if (props.listType === 'shop') {
    //             const index = curSelectedRowIds.value.indexOf(row.storeCode)
    //             if (index > -1) {
    //                 dataState.currentDialogCheckedAll.splice(index, 1)
    //             }
    //         } else if (props.listType === 'point') {
    //             const index = curSelectedRowIds.value.indexOf(row.pointId)
    //             if (index > -1) {
    //                 dataState.currentDialogCheckedAll.splice(index, 1)
    //             }
    //         }
    //     })
    // }
}
const getMonth = () => {
    const datetime = new Date()
    const year = datetime.getFullYear()
    const month = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
    dataState.searchData.budgetPeriod = year + '-' + month
}
const handleClose = () => {
    emit('handleClose', props.visible)
}

// 批量导出
const exportList = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            // pointId: dataState.searchData.pointId === '' ? [] : [dataState.searchData.pointId],
            // pointAddr: dataState.searchData.pointAddr,
            pointId: props.hasSelectList[0] === 'all_point' ? [] : props.hasSelectList,
            pointAddr: dataState.searchData.pointAddr,
            city: dataState.searchData.city,
            spuId: props.spuInfo.spuId === 'all_spu' ? '' : props.spuInfo.spuId,
            pageNum: pageinfo.value.currentPage,
            pageSize: pageinfo.value.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UCJH79630374675726336',
        name: '点位列表聚合',
        source: '运营后台',
        exportType: 7
    }
    const res = await exportCommon(params)
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    // console.log(fileName)
    if (fileName) { // 根据后端返回的数据处理文件名称
        fileName = fileName.substring(fileName.indexOf('=') + 1)
    }
    const link = document.createElement('a')// 创建一个a标签
    link.download = fileName// 设置a标签的下载属性
    link.style.display = 'none'// 将a标签设置为隐藏
    link.href = URL.createObjectURL(blob)// 把之前处理好的地址赋给a标签的href
    document.body.appendChild(link)// 将a标签添加到body中
    link.click()// 执行a标签的点击方法
    URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
    document.body.removeChild(link)// 移除a标签
}

onMounted(() => {
    getMonth()
    getList()
})

// 选择行
const getCurrentRow = (row) => {
    dataState.currentDialogCheckedAll = row
}

const submit = () => {
    if (props.listType === 'costAccount') {
        if (dataState.currentDialogCheckedAll.length > 3) {
            ElMessage.warning('最多可选择3条')
            return
        }
    } else if (props.listType === 'goodsSku' || props.listType === 'goodsSkuGroup') {
        if (dataState.currentDialogCheckedAll.length > 100) {
            ElMessage.warning('最多可选择100条')
            return
        }
    } else if (props.listType === 'goodsSpu') {
        if (dataState.currentDialogCheckedAll.length > 100) {
            ElMessage.warning('最多可选择100条')
            return
        }
    } else if (props.listType === 'shop') {
        if (dataState.currentDialogCheckedAll.length > 100) {
            ElMessage.warning('最多可选择100条')
            return
        }
    } else if (props.listType === 'point') {
        if (dataState.currentDialogCheckedAll.length > 100) {
            ElMessage.warning('最多可选择100条')
            return
        }
    }
    emit('getDialogCheckedData', dataState.currentDialogCheckedAll, props.listIndex)
    handleClose()
}
// 商品分类级联查询
const goodsClassifyPropsList = {
    lazy: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await queryCategory(level + 1, data.value || '')
        console.log(res)
        const nodes = res.map(item => {
            return {
                label: item.name,
                value: item.code,
                level: item.level,
                leaf: level >= 3
            }
        })
        resolve(nodes)
    }
}
// 商品分类change
const goodsClassifyChange = (value) => {
    dataState.searchData.firstCateCode = value[0]
    dataState.searchData.secondCateCode = value[1]
    dataState.searchData.thirdCateCode = value[2]
    dataState.searchData.fourthCateCode = value[3]
}
const getRowKeys = (row) => {
    if (props.listType === 'costAccount') {
        return row.acctId
    } else if (props.listType === 'goodsSku' || props.listType === 'goodsSkuGroup') {
        return row.skuId
    } else if (props.listType === 'goodsSpu') {
        return row.spuId
    } else if (props.listType === 'shop') {
        return row.storeCode
    } else if (props.listType === 'point') {
        return row.pointId
    }
}
</script>
<style lang="scss" scoped>
</style>
