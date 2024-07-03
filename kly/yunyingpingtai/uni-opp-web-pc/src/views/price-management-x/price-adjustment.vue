<template>
    <!-- 原价管理 -->
    <div>
        <div class="channel-title">
            <el-form :model="form" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="商户编号" prop="busiMerchantId">
                    <span>{{props.busiMerchantId}}</span>
                </el-form-item>
                <el-form-item label="商户名称" prop="merchantName">
                    <span>{{props.merchantName}}</span>
                </el-form-item>
                <el-form-item label="商户类型" prop="merchantType">
                    <span>{{Number(props.merchantType)===1?'企业':Number(props.merchantType)===2?'自然人':'系统'}}</span>
                </el-form-item>
                <el-form-item label="一级渠道:" prop="firstChannelName">
                    <span>{{props.firstChannelName}}</span>
                </el-form-item>
            </el-form>
        </div>
        <el-form ref="resetFormData" :model="searchData" label-width="120px" :inline="true">
            <el-form-item label="商品名称" prop="skuName">
                <el-input v-model="searchData.skuName" placeholder="请输入" /> </el-form-item>
            <el-form-item label="商品编号" prop="skuId">
                <el-input v-model="searchData.skuId" placeholder="请输入" /> </el-form-item>
            <el-form-item label="商品状态"  prop="skuState">
                <el-select v-model="searchData.skuState" placeholder="请选择">
                    <el-option label="待审核" :value="1" />
                    <el-option label="已审核" :value="2" />
                    <el-option label="审核不通过" :value="3" />
                    <el-option label="已上架" :value="4" />
                    <el-option label="下架可上架" :value="5" />
                    <el-option label="下架不可再上架" :value="6" />
                    <!-- <el-option label="待上架" :value="7" /> -->
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="商品名称" prop="skuName">
                <el-input v-model="searchData.skuName" placeholder="商品名称" /> </el-form-item> -->
            <!-- 安装位置一期不做 -->
            <!-- <el-form-item label="安装位置" prop="placementPosition">
                <el-input v-model="searchData.placementPosition" placeholder="安装位置" /> </el-form-item> -->
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon()">
                    查询
                </el-button>
                <el-button type="primary" @click="resetForm">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            border
            :header-cell-style="{ 'text-align': 'center' }"
        >
            <el-table-column type="index" label="序号" min-width="100" align="center" />
            <el-table-column prop="name" label="商品信息" align="left" min-width="150">
                <template v-slot="{row}">
                    <div>
                        <span>sku编号：{{row.skuId}}</span><br/>
                        <span>商品名称：{{row.skuName}}</span><br/>
                        <span>售卖规格：{{row.specName}}</span><br/>
                        <span>商品分类：{{row.firstCateName}}/{{row.secondCateName}}/{{row.thirdCateName}}/{{row.fourthCateName}}</span><br/>
                        <span>商品条形码：{{row.barcode}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="skuStatus"
                label="商品状态"
                align="center"
            >
                <template v-slot="{row}">
                    <div v-if="row.skuStatus === 1">待审核</div>
                    <div v-else-if="row.skuStatus === 2">已审核</div>
                    <div v-else-if="row.skuStatus === 3">审核不通过</div>
                    <div v-else-if="row.skuStatus === 4">已上架</div>
                    <div v-else-if="row.skuStatus === 5">下架可上架</div>
                    <div v-else-if="row.skuStatus === 6">下架不可再上架</div>
                    <!-- <div v-else-if="row.skuStatus === 7">待上架</div> -->
                    <div v-else>-</div>
                </template>
            </el-table-column
            >
            <el-table-column
                prop="cityName"
                label="城市"
                align="center"
            >
                <template v-slot="{row}">
                    <!-- {{row?.cityName ?? '全国'}}- -->
                    {{row.provinceName}}
                </template>
            </el-table-column
            >
            <el-table-column
                prop="secondChannelCode"
                label="二级渠道"
                align="left"
            >
                <template v-slot="{row}">
                    <span>货柜编号：{{row.secondCateCode}}</span><br/>
                    <span>货柜名称：{{row.secondCateName}}</span>
                </template>
            </el-table-column
            >
            <!-- 一期不做 -->
            <!-- <el-table-column
                prop="provinceName"
                label="安装位置"
                align="center"
            >
                <template v-slot="{row}">
                    {{row?.provinceName ?? '-'}}{{row?.cityName ?? '-'}}
                </template>
            </el-table-column
            > -->
            <el-table-column
                prop="channelPrice"
                label="价格"
                align="center"
            >
                <template v-slot="{row}">
                    <el-input v-model="row.channelPrice" @keyup="row.channelPrice = oninput(row.channelPrice)" maxlength="9" placeholder="" style="width: 80px" @input="checknum(row)" :disabled="row.skuStatus !== 5" />
                </template>
            </el-table-column
            >
            <!-- <el-table-column
                prop="purchasePrice"
                label="采购价"
                align="center"
            >
            </el-table-column
            >
            <el-table-column
                prop="maolilv"
                label="毛利率"
                align="center"
            >
                <template v-slot="{row}">
                    {{row?.channelPrice && row?.channelPrice !== '' && row.purchasePrice || row.purchasePrice === 0 || row.purchasePrice === '0' && row.purchasePrice !== '' ? ((row.channelPrice - row.purchasePrice) / row.channelPrice * 100).toFixed(2) + '%' : '-'}}
                </template>

            </el-table-column
            > -->
            <el-table-column prop="address" label="操作" align="center">
                <template v-slot="{row}">
                    <!-- , dialogVisible = true -->
                    <el-button type="text" @click="save(row)" v-if="row.skuStatus === 5"> 保存 </el-button>
                    <el-button type="text" v-else> -- </el-button>
                </template>
            </el-table-column
            >
        </el-table>
        <div class="demo-pagination-block" style="display:flex;margin-top:25px;justify-content:center">
            <el-pagination
                v-model:currentPage="dataState.pageinfo.page"
                v-model:page-size="dataState.pageinfo.pageSize"
                :page-sizes="[10, 20, 30, 40]"
                :small="small"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataState.pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            />
        </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        :title="details ? '是否确认修改价格' : '当前商品正在做营销活动，请下线活动或等活动结束'"
        width="50%"
    >
        <div v-if="!details">
            <h4 v-for="(item, index) in activity" :key="item.promoCode">活动编号{{index + 1}}:{{item.promoCode}};</h4>
        </div>
        <template #footer="{row}" v-if="details">
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialookt(row)"
                >确认保存</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed, toRefs } from 'vue'
import { getMerchantList, getoriginalpriceList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
// import { Search } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const props = defineProps(['merchantName', 'busiMerchantId', 'merchantType', 'firstChannelName'])

const oninput = (num) => {
    var str = num
    var len1 = str.substr(0, 1)
    var len2 = str.substr(1, 1)
    // 如果第一位是0，第二位不是点，就用数字把点替换掉
    if (str.length > 1 && Number(len1) === 0 && len2 !== '.') {
        str = str.substr(1, 1)
    }
    // 第一位不能是.
    if (len1 === '.') {
        str = ''
    }
    // 限制只能输入一个小数点
    if (str.indexOf('.') !== -1) {
        var str_ = str.substr(str.indexOf('.') + 1)
        if (str_.indexOf('.') !== -1) {
            str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1)
        }
    }
    // 正则替换
    str = str.replace(/[^\d^.]+/g, '') // 保留数字和小数点
    str = str.replace(/\.\d\d\d$/, '') // 小数点后只能输两位
    return str
}

// 价格调整中设置价格
const input = ref('')
const abc = ref(121212)

// 保存 弹窗
const details = ref(true)
const activity = ref([])

const searchData = reactive({
    skuId: '',
    skuName: '',
    purchasePrice: '',
    secondCateCode: '',
    skuState: ''
})

const getout = reactive({
    skuId: '',
    skuName: '',
    purchasePrice: ''
})

// 价格按钮
const save = (val) => {
    preservation(val)
    // geteventdetails(val)
    getout.skuId = val.skuId
    getout.skuName = val.skuName
    getout.purchasePrice = val.channelPrice
}

const dialogVisible = ref(false)
// 弹窗确认
const dialookt = async () => {
    dialogVisible.value = false
    await preservation()
}

const geteventdetails = async (val) => {
    const params = {
        appKey: 'A1001000', // 系统编码
        busiCode: 'A1001001', // 业务线编号
        name: '查询商品参加的在线活动',
        source: '营销中台',
        configCode: 'UC1659058276253gQoEc',
        creatorId: userInfo.value.id,
        modifierId: userInfo.value.id,
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            skuIds: val.skuId === '' ? [] : [val.skuId]
        }
    }
    const data = await getMerchantList(params)
    if (data?.length === 0 || data === null) {
        details.value = true
    } else {
        details.value = false
        activity.value = data
    }
}

onMounted(() => {
    console.log(1)
    // preservation()
})

const searchCoupon = () => {
    dataState.pageinfo.page = 1
    getRefundList()
}

const preservation = async (val) => {
    const params = {
        appKey: 'A1001000', // 系统编码
        busiCode: 'A1001001', // 业务线编号
        name: '更新商品渠道价',
        source: '价格中台',
        configCode: 'UC1658205999441NIW7m',
        creatorId: userInfo.value.account,
        modifierId: userInfo.value.account,
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            skuId: val.skuId,
            channelPrice: Number(val.channelPrice),
            operatorId: Number(userInfo.value.id),
            operatorName: userInfo.value.name
        }
    }
    const data = await getMerchantList(params)
    ElMessage.success('保存成功')
    // if (data.code === '200') {
    //     ElMessage.success('保存成功')
    // } else {
    //     ElMessage.error('失败')
    // }
    await resetForm()
}

// 重置
const resetFormData = ref(null)
const resetForm = () => {
    resetFormData.value.resetFields()
    setTimeout(() => {
        dataState.pageinfo.page = 1
        getRefundList()
    })
}

// 表格信息展示
const tableData = ref([])

const dataState = reactive({
    pageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    }

})
const { pageinfo } = toRefs(dataState)

onMounted(() => {
    getRefundList()
})

const getRefundList = async () => {
    const params = {
        appKey: 'A1001000', // 系统编码
        busiCode: 'A1001001', // 业务线编号
        name: 'sku通用查询接口V2',
        source: '商品中台',
        configCode: 'UC15115376423575552',
        creatorId: userInfo.value.account,
        modifierId: userInfo.value.account,
        body: {
            appKey: 'A1001000', // 系统编码
            busiCode: 'A1001001', // 业务线编号
            channelCodes: searchData.secondCateCode === '' ? [] : [searchData.secondCateCode], // 渠道编码集合
            skuIds: searchData.skuId === '' ? [] : searchData.skuId.split(','),
            skuName: searchData.skuName,
            skuStatus: searchData.skuState === '' ? [] : [searchData.skuState],
            pageSize: dataState.pageinfo.pageSize, // 页大小
            pageNo: dataState.pageinfo.page,
            busiMerchantId: props.busiMerchantId
        }
    }
    const data = await getoriginalpriceList(params)
    if (data.list) {
        tableData.value = data.list.map(item => {
            return {
                maolilv: item.channelPrice !== null && item.purchasePrice !== '' ? (((item.channelPrice - item.purchasePrice) / item.channelPrice) * 100).toFixed(4) + '%' : '',
                ...item
            }
        })
    } else {
        tableData.value = []
    }
    dataState.pageinfo.total = data.total
}

const checknum = async (row) => {
    if (row.channelPrice !== null && row.purchasePrice !== '') {
        row.maolilv = (((row.channelPrice - row.purchasePrice) / row.channelPrice) * 100).toFixed(4) + '%'
    } else {
        row.maolilv = ''
    }
}
// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.page = val
    getRefundList()
}
const sizeChange = (val) => {
    dataState.pageinfo.page = 1
    dataState.pageinfo.pageSize = val
    getRefundList()
}

// 分页处
const currentPage4 = ref(4)
const pageSize4 = ref(100)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
</script>

<style lang="scss" scoped>
.channel-title{
    display: flex;
    margin-bottom: 10px;
    span{
        flex: 1;
    }
}
.demo-pagination-block{
    margin-left: 30%;
    margin-top: 20px;
}
::v-deep(.el-table__header-wrapper .el-table_1_column_1 .cell){
    padding: 0;
}
</style>
