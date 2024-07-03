<template>
    <!-- 商品属性管理< -->
    <div>
        <el-row class="row-bg" justify="left">
            <el-col :span="3" v-for="item in tableData" :key="item">
                <div style="padding: 20px;display: flex; flex-direction: column; justify-content: center; align-items: center;" :style="{
                    boxShadow: `var(--el-box-shadow)`,
                }">
                    <div style="padding: 20px 0">{{item.templateName}}</div>
                    <el-button type="primary" @click="save(item.templateUrl)"> 下载模版 </el-button>
                </div>
            </el-col>
        </el-row>
        <!-- <div class="demo-pagination-block">
            <el-pagination
                v-model:currentPage="currentPage4"
                v-model:page-size="pageSize4"
                :page-sizes="[100, 200, 300, 400]"
                :small="small"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div> -->
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
// import { Search } from '@element-plus/icons-vue'
import { getMerchantList } from '@/api/operate/index'
// 价格调整中设置价格
const input = ref('')

const form = reactive({
    name: ''
})

const save = (val) => {
    window.open(val)
}

// 表格信息展示
const tableData = ref([])

const getAllList = async () => {
    const param = {
        body: {},
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC1657961764047K9Y7l',
        name: '查询模板文件列表',
        source: '商品中台'
    }
    const res = await getMerchantList(param)
    tableData.value = res.data.records
    console.log(tableData.value)
}
getAllList()
// 分页处
const currentPage4 = ref(4)
const pageSize4 = ref(100)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
</script>
<style lang="scss" scoped>
.channel-title {
    display: flex;
    margin-bottom: 10px;
    span {
        flex: 1;
    }
}
.demo-pagination-block {
    margin-left: 30%;
    margin-top: 20px;
}
</style>
