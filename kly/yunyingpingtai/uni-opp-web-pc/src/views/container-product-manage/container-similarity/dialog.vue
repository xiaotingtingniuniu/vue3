<template>
    <div class='send-coupon-box'>
        <el-dialog v-model="dialogVisible"  :before-close="handleClose" >
            <div>
                <el-form
                    ref="formRef"
                    :model="ruleForm"
                    :rules="rules"
                    class="demo-ruleForm"
                    :inline="true"
                >
                    <el-form-item label="相似品组名称：" prop="ruleName" >
                        <span>{{ruleForm.ruleName}}</span>
                    </el-form-item>
                    <el-form-item label="规则编号：" prop="ruleCode"  >
                        <span>{{ruleForm.ruleCode}}</span>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" max-height="350" >
                <el-table-column type="index" label="序号"  />
                <el-table-column prop="spuListPicUrl" label="商品图片" >
                    <template #default="{ row }">
                        <img :src="row.spuListPicUrl" alt="" style="width:100px;height:100px">
                    </template>
                </el-table-column>
                <el-table-column prop="spuName" label="标品名称" />
                <el-table-column prop="barcode" label="69码" />
            </el-table>
            <div class="page-box" :style="align">
                <div>共计{{tableData.length}}条</div>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { getMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const props = defineProps({
    visible: {
        type: Boolean
    },
    ruleCode: {
        type: String
    }
})
const route = useRoute()
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(props.visible)
const tableData = ref([])

const ruleForm = ref({
    ruleForm: '',
    ruleCode: ''
})

const formRef = ref(null)

const phoneList = ref([])

/**
 * @description    校验多行文本验证
 * @param val      输入值
 * @param name     字段名称
 * @param rowNum   每行字符个数
 * @param colNum   行数
 */

const handleTextarea = (val, rowNum, colNum) => {
    console.log(val, rowNum, colNum)
    // 正则匹配每行字数
    const reg = new RegExp('(.{' + rowNum + '})', 'g')
    // 先除回车换行符的字符串，不去除影响字符个数计算
    const result = val.replace(/[\r\n]/g, '').replace(reg, '$1\n')
    // 获取colNum行
    const arr = result.split('\n').slice(0, colNum)
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === '') {
            arr.splice(i, 1)// 去掉值为空的数组
            i = i - 1
        }
        phoneList.value = arr
    }
    console.log(arr)
}

onMounted(async () => {
    await getDetail()
})
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
    console.log(res, 'res。详情')
    ruleForm.value.ruleName = res.ruleName
    ruleForm.value.ruleCode = res.ruleCode
    tableData.value = res.ruleItems.map(item => {
        return {
            spuListPicUrl: item.mediaUrl,
            ...item
        }
    })
}
const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
}

</script>
<style lang="scss" scoped>
 .send-coupon-box{
     .page-box{
        display: flex;
       justify-content: center;
       text-align: center;
       margin-top: 20px;
     }

 }
</style>
