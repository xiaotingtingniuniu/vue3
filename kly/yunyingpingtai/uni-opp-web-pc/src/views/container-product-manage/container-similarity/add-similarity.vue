<template>
    <div class="public-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" label-position="right" label-width="100px" :inline="true">
                <el-form-item label="品牌名称" prop="brandNames">
                    <el-input v-model="searchData.brandNames" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="标品名称" prop="spuName">
                    <el-input v-model="searchData.spuName" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="69码" prop="barcodes">
                    <el-input v-model="searchData.barcodes" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="" prop="thirdCateName">
                    <el-input v-model="searchData.thirdCateName" placeholder="请输入三级类目" clearable />
                    <!-- <el-select v-model="selectData.thirdCateName" class="m-2" placeholder="请选择三级类目" @change="changeThird">
                        <el-option v-for="item in thirdCateNameList" :key="item.name" :label="item.name" :value="item.code" />
                    </el-select> -->
                </el-form-item>
                <el-form-item label="" prop="fourCateName">
                    <el-input v-model="searchData.fourCateName" placeholder="请输入四级类目" clearable />
                    <!-- <el-select v-model="selectData.fourCateName" class="m-2" placeholder="请选择四级类目" @change="changeFour">
                        <el-option v-for="item in fourCateNameList" :key="item.name" :label="item.name" :value="item.code" />
                    </el-select> -->
                </el-form-item>

                <el-form-item class="button-box">
                    <el-button type="primary" @click="goBack()">
                        返回列表
                    </el-button>
                    <el-button type="primary" @click="searchCoupon()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content">
            <div class="content-left">
                <div class="tableList-area">
                    <el-checkbox-group
                        v-model="checkedIds"
                        @change="handlecheckedIdsChange"
                    >
                        <el-checkbox-button
                            v-for="item, index in tableData"
                            :key="index"
                            :label="item"
                            class="goods-box"
                        >
                            <div class="img-box" >
                                <img :src="item.imgUrl" class="goods-img">
                            </div>
                            <div class="swiper-box">
                                <swiper class="swiper-container" :slidesPerView="2"
                                        :spaceBetween="30"
                                        :loop="true"
                                        :centeredSlides="true"
                                        :navigation="true"
                                >
                                    <swiper-slide class="swiper-slide" v-for="(el, i) in item.imgList" :key="i">
                                        <img :src="el" alt="" class="img-swiper" @click.prevent="enlarge(el,index)">
                                    </swiper-slide>
                                </swiper>
                            </div>

                            <div class="goods-title"  @click.prevent="copyText(item.spuName)">
                                <el-tooltip :content="item.spuName" effect="light" placement="top">
                                    {{item.spuName}}
                                </el-tooltip>
                            </div>
                            <div class="goods-code" @click.prevent="copyText(item.barcode)">{{item.barcode}}</div>
                            <div class="bottom-show"  @click.prevent="copyText(item.guidePrice)">
                                <div class="title">官方指导价</div>
                                <div class="price">¥{{item.guidePrice}}</div>
                            </div>
                        </el-checkbox-button>
                    </el-checkbox-group>
                </div>
                <div class="page-box" :style="align">
                    <el-pagination
                        v-if="showPage"
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        :current-page="pageinfo.currentPage"
                        :page-size="pageinfo.pageSize"
                        :page-sizes="pageinfo.pageSizes"
                        :layout="pageinfo.layout"
                        :total="pageinfo.total"
                    ></el-pagination>
                </div>
                <template v-if="!showPage">
                    <el-empty description="暂无数据" />
                </template>
            </div>
            <div class="content-right">
                <el-form ref="ruleFormRef"  :rules="rules" :model="ruleForm" label-position="right" label-width="120px" :inline="true">
                    <div v-if="ifTrue">
                        <el-form-item label="相似品组名称:" prop="changeRuleName">
                            <el-input v-model="ruleForm.changeRuleName" placeholder="请输入" clearable :maxlength='32' />
                        </el-form-item>
                        <el-form-item class="button-box">
                            <el-button type="primary" @click="goSure(ruleFormRef)">
                                确定
                            </el-button>
                        </el-form-item>
                    </div>
                    <div v-if="ifFalse">
                        <el-form-item label="相似品组名称:" prop="ruleName">
                            <span style="color:red" @click="edit()">{{ruleForm.ruleName}}</span>
                        </el-form-item>
                        <el-form-item label="规则编号:" prop="ruleCode" v-if="props.type === 'edit'">
                            <span style="color:red">{{ruleForm.ruleCode}}</span>
                        </el-form-item>
                    </div>
                </el-form>
                <el-table :data="tableList" max-height="550" >
                    <el-table-column type="index" label="序号"  />
                    <el-table-column prop="imgUrl" label="商品图片" >
                        <template #default="{ row }">
                            <img :src="row.imgUrl" alt="" style="width:70px;height:70px">
                        </template>
                    </el-table-column>
                    <el-table-column prop="spuName" label="标品名称" />
                    <el-table-column prop="barcode" label="69码" />
                    <el-table-column prop="operation" label="操作" >
                        <template #default="scope">
                            <el-button type="primary" @click="delate(scope.row,scope.$index)" text>
                                移除
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-box">
                    <div>共计{{tableList.length}}条</div>
                    <el-button type="primary" @click="submit(row)">
                        保存
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, {
    Navigation,
    Pagination,
    Scrollbar,
    A11y,
    Autoplay
} from 'swiper'
import 'swiper/swiper-bundle.css'
import { getMerchantList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import { async } from 'q'
const { toClipboard } = useClipboard()
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay])

const store = useStore()
const router = useRouter()
const showPage = ref(false)
const checkedIds = ref([])
const ifFalse = ref(false)
const ifTrue = ref(false)
const tableList = ref([])
const tableListCopy = ref([])
const props = defineProps(['type', 'ruleCode'])

const tableData = ref([])
const dataState = reactive({
    searchData: {
        brandNames: '',
        spuName: '',
        barcodes: '',
        thirdCateName: '',
        fourCateName: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50],
        layout: 'total, sizes,prev, pager, next,jumper'
    },
    ruleForm: {
        changeRuleName: '',
        ruleName: '',
        ruleCode: ''
    },
    thirdCateNameList: [],
    fourCateNameList: []
})
const { searchData, modelList, pageinfo, ruleForm, thirdCateNameList, fourCateNameList } = toRefs(dataState)

const align = computed(() => {
    return { 'justify-content': 'center' }
})
onMounted(async () => {
    await getGoodsList()
    if (props.type !== 'add') {
        ifFalse.value = true
        await getDetail()
    }
    if (props.type === 'add') {
        ifTrue.value = true
    }
})

const handlecheckedIdsChange = (value) => {
    console.log(value, checkedIds.value, tableListCopy.value, 'val')
    tableList.value = JSON.parse(JSON.stringify(tableListCopy.value))
    value.map(el => {
        tableList.value.push(el)
    })
    // 列表去重
    nextTick(() => {
        const obj = {}
        const arr = tableList.value.reduce((newArr, next) => {
            if (!obj[next.spuId]) {
                obj[next.spuId] = true && newArr.push(next)
            }
            return newArr
        }, [])
        tableList.value = arr
    })
    // let checkGoodsIds = []
    // if (tableList.value.length) {
    //     const checkGoods = tableList.value.reduce((total, el) => {
    //         total.push(el)
    //         return total
    //     }, [])
    //     checkGoodsIds = checkGoods.length ? checkGoods.map(el => el.spuId) : []
    // } else {
    //     checkGoodsIds = checkedIds.value.map(el => el.spuId)
    // }
    // const list = []
    // checkedIds.value.map(el => {
    //     if (checkGoodsIds.includes(el.spuId)) {
    //         list.push(el)
    //     }
    //     return {
    //         ...el
    //     }
    // })
    // const map = new Map()
    // tableList.value = list.filter(key => !map.has(key.spuId) && map.set(key.spuId, key.spuId))
}
// 移除
const delate = (row, index) => {
    console.log(index, checkedIds.value[index], 'index')
    tableList.value.splice(index, 1)
    checkedIds.value = checkedIds.value.filter(item => item.spuId !== row.spuId)
    tableListCopy.value = tableListCopy.value.filter(item => item.spuId !== row.spuId)
}
const enlarge = (item, index) => {
    tableData.value[index].imgUrl = item
    console.log(item, index, 'enlarge')
}

const goBack = () => {
    router.go(-1)
}

const rules = reactive({
    changeRuleName: [{ required: true, message: '请填写相似品组名称', trigger: 'blur' }]
})
// 确定
const ruleFormRef = ref(null)

const goSure = () => {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            dataState.ruleForm.ruleName = dataState.ruleForm.changeRuleName
            ifTrue.value = false
            ifFalse.value = true
        }
    })
}
const edit = () => {
    dataState.ruleForm.changeRuleName = dataState.ruleForm.ruleName
    dataState.ruleForm.ruleName = ''
    ifTrue.value = true
    ifFalse.value = false
}
// 列表数据
const getGoodsList = async () => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC15115376448741376',
        name: 'spu通用搜索接口V2',
        source: '商品中台',
        url: '/search/spu/list/v2',
        body: {
            appKey: 'A1001001', // 系统编号
            busiCode: 'A1001002', // 业务线编号
            brandNames: dataState.searchData.brandNames ? dataState.searchData.brandNames.split(',') : [],
            spuName: dataState.searchData.spuName,
            barcodes: dataState.searchData.barcodes ? dataState.searchData.barcodes.split(',') : [],
            thirdCateNames: dataState.searchData.thirdCateName ? dataState.searchData.thirdCateName.split(',') : [],
            fourthCateNames: dataState.searchData.fourCateName ? dataState.searchData.fourCateName.split(',') : [],
            saleChannels: ['货柜'],
            modelStatuss: [2], // 模型训练状态  写死  只能展示有模型训练的货柜商品
            pageNo: dataState.pageinfo.currentPage,
            pageSize: dataState.pageinfo.pageSize
        }
    }
    const res = await getMerchantList(params)
    tableData.value = res.list.map(item => {
        item.imgList = []
        if (item.spuMediaList) {
            item.spuMediaList.map(arrItem => {
                if (arrItem.mediaType + '' === '2') {
                    item.imgUrl = arrItem.mediaUrl
                }
            })
        } else {
            item.imgUrl = null
        }
        if (item.modelMediaList) {
            item.modelMediaList.map(el => {
                if (el.mediaType + '' !== '4') {
                    item.imgList.push(el.mediaUrl)
                }
            })
        }
        return {
            ...item
        }
    })
    dataState.pageinfo.total = res.total
    res.total > 0 ? showPage.value = true : showPage.value = false
    checkedIds.value = []
    tableData.value.map(item => {
        tableList.value.map(el => {
            if (el.spuId === item.spuId) {
                checkedIds.value.push(item)
                tableListCopy.value = tableListCopy.value.filter(Copyitem => Copyitem.spuId !== el.spuId)
            }
        })
    })
}

// 创建保存
const submit = async () => {
    if (dataState.ruleForm.changeRuleName === '' && props.type === 'add') {
        return ElMessage.error('请输入相似品组名称！')
    }
    if (dataState.ruleForm.ruleName === '') {
        return ElMessage.error('请点击确定保存相似品组名称！')
    }
    if (tableList.value.length < 2 || tableList.value.length > 200) {
        return ElMessage.error('相似品组标品数必须超过两组且不得超过200！')
    }
    const list = tableList.value.map(item => {
        return {
            spuId: item.spuId,
            spuName: item.spuName,
            barcode: item.barcode
        }
    })
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001002',
        source: '商品中台',
        body: {
            appKey: 'A1001001', // 系统编号
            busiCode: 'A1001002', // 业务线编号
            ruleItems: list
        }
    }
    if (props.type === 'add') {
        params.body.ruleName = dataState.ruleForm.ruleName
        params.configCode = 'UC45924810878566400'
        params.name = '货柜相似品规则创建'
        params.url = '/goods/similar/spu/add/v1'
    }
    if (props.type === 'edit') {
        params.configCode = 'UC45925002726031360'
        params.name = '货柜相似品修改'
        params.url = '/goods/similar/spu/modify/v1'
        params.body.ruleCode = dataState.ruleForm.ruleCode
        params.body.ruleName = dataState.ruleForm.changeRuleName || ''
    }
    const res = await getMerchantList(params)
    ElMessage.success('创建成功')
    setTimeout(() => {
        router.go(-1)
    }, 500)
}

// 详情
const getDetail = async () => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC45923997477191680',
        name: '货柜相似品规则详情',
        source: '商品中台',
        url: '/goods/similar/spu/detail/v1',
        body: {
            appKey: 'A1001001', // 系统编号
            busiCode: 'A1001002', // 业务线编号
            ruleCode: props.ruleCode
        }
    }
    const res = await getMerchantList(params)
    dataState.ruleForm.ruleName = res.ruleName
    dataState.ruleForm.ruleCode = res.ruleCode
    tableList.value = res.ruleItems.map(item => {
        return {
            imgUrl: item.mediaUrl,
            ...item
        }
    })
    // tableListCopy.value = JSON.parse(JSON.stringify(tableList.value))
    tableData.value.map(item => {
        tableList.value.map(el => {
            if (el.spuId === item.spuId) {
                return checkedIds.value.push(item)
            }
        })
    })
}

// 复制
const copyText = async (value) => {
    await toClipboard(value)
    ElMessage.success('复制成功')
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.currentPage = 1
    getGoodsList()
}

// 当前页数改变
const currentChange = (val) => {
    tableListCopy.value = JSON.parse(JSON.stringify(tableList.value))
    dataState.pageinfo.currentPage = val
    checkedIds.value = tableList.value
    getGoodsList()
}
const sizeChange = (val) => {
    tableListCopy.value = JSON.parse(JSON.stringify(tableList.value))
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    checkedIds.value = tableList.value
    getGoodsList()
}

</script>
<style lang="scss" scoped>
 .public-container{
    .content{
        display: flex;
        .content-left{
            width: 63%;
            .page-box {
                display: flex;
                margin-top: 24px;
            }
        }
        .content-right{
            flex: 1;
            .page-box{
                margin-top: 24px;
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
        }
    }
    :deep(.el-checkbox-button) {
        margin: 20px 40px 0 0;
    }
    :deep(.el-checkbox-button) {
        --el-checkbox-button-checked-bg-color: #fff;
        --el-checkbox-button-checked-text-color: #409eff;
        --el-checkbox-button-checked-border-color: #409eff;
    }
    :deep(.el-checkbox-button__inner) {
        border: none;
        text-align: left;
        width: 100%;
    }
    :deep(.el-checkbox-button:first-child .el-checkbox-button__inner) {
        // border: none;
    }
    :deep(.is-checked .el-checkbox-button__inner) {
        border: 1px solid #409eff;
    }
    .goods-box{
        width: 200px;
        position: relative;
        .top-show{
            display: flex;
            justify-content: space-between;
            position: fixed;
            width: 180px;
            .small-spec-icon{
                width: 40px;
            }
            .have-goods-remak{
                font-size: 12px;
            }
        }
        .can-check{
            color: #F8AC3D;
        }
        .cannot-check{
            color: #B0B0B0;
        }
        .img-box{
            text-align: center;
            padding-bottom: 5px;
            height: 110px;
            .goods-img{
                height: 100px;
            }
        }
        .goods-title{
            width: 180px;
            height: 28px;
            line-height: 28px;
            font-size: 14px;
            color: #222;
            margin-bottom: 10px;
            white-space: break-spaces;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .goods-code{
            font-size: 12px;
            color: #B0B0B0;
            padding-bottom: 10px;
        }
        .bottom-show{
            display: flex;
            justify-content: center;
            width: 180px;
            .price{
                font-weight: 700;
            }
        }
        .swiper-box{

            .swiper-container {
                width: 100%;
                height: 50px;
                text-align: center;
                --swiper-theme-color: #ff6600;
                --swiper-pagination-color: #248cc0;
                --swiper-navigation-color: #248cc0;
                --swiper-navigation-size: 20px;
            }
            .swiper-slide{
                flex-shrink:inherit
            }

            .swiper-slide img{
                width: 50px;
                height: 100%;
            }
        }

    }

 }
</style>
