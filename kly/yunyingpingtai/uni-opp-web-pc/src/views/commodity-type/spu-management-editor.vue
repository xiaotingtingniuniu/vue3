<template>
    <div>
        <h1>请选择基础类项目</h1>
        <div>
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
        </div>
        <div style="margin-top:30px;margin-bottom: 30px;">
            <el-table :data="tableData" border>
                <el-table-column prop="date" label="一级基础类目名称"  />
                <el-table-column prop="name" label="二级基础类目名称"  />
                <el-table-column prop="address" label="三级基础类目名称" />
                <el-table-column prop="address" label="四级基础类目名称" />
            </el-table>
        </div>
        <h1>请选择属性模型</h1>
        <div style="margin-top:30px;margin-bottom: 30px;">
            <el-form :model="form" label-width="120px" :inline="true">
                <el-form-item label="属性模型名称">
                    <el-select v-model="form.region" placeholder="全部">
                        <el-option label="全部" value="shanghai" />
                        <el-option label="蔬菜类" value="beijing" />
                        <el-option label="鲜肉类" value="beijing" />
                        <el-option label="鲜蛋类" value="beijing" />
                        <el-option label="List ltem1" value="beijing" />
                    </el-select>
                </el-form-item>
                <el-form-item> <el-button type="danger">搜索</el-button></el-form-item>
            </el-form>
            <el-table :data="tableData" border>
                <el-table-column prop="date" label="属性模型编号" align="center" />
                <el-table-column prop="name" label="属性模型名称" align="center" />
                <el-table-column prop="address" label="通用属性" align="center" />
                <el-table-column prop="date" label="专有属性" align="center" />
                <el-table-column prop="name" label="扩展属性" align="center" />
                <el-table-column prop="name" label="补充属性" align="center" />
                <el-table-column prop="name" label="操作" align="center">
                    <el-button text> 下载模板 </el-button>
                </el-table-column>
            </el-table>
        </div>
        <div style="display:flex">
            <h2 style="margin-right:1000px">填写标品属性</h2>
            <el-button type="success"> 导入 </el-button>
        </div>
        <div style="max-width: 900px">
            <el-form
                :label-position="labelPosition"
                label-width="100px"
                :model="formLabelAlign"
                :inline="true"
            >
                <el-form-item label="品牌名称">
                    <el-input v-model="formLabelAlign.region" />
                </el-form-item>
                <el-form-item label="商品条码类型">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="商品条码">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="规格单位">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="售卖中文名">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="商品主图">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="净含量">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="商品视频">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="净含量单位">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="商品组成">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="库存管理方式">
                    <el-input v-model="formLabelAlign.region" />
                </el-form-item>
                <el-form-item label="生产方式">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="单位">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="使用方式">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="价签展示单位">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="包装方式">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="售价展示单位">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="储存要求">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="保质期">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="保质期">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="保质期单位">
                    <el-input v-model="formLabelAlign.region" />
                </el-form-item>
                <el-form-item label="商品溯源表">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="称重码">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="业务部门">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="秤签方式">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
                <el-form-item label="业务部门">
                    <el-input v-model="formLabelAlign.type" />
                </el-form-item>
            </el-form>
            <div class="btn">
                <el-button>取消</el-button>
                <el-button type="success">确定</el-button>
            </div>

        </div>
    </div>

</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
    name: '',
    region: ''
})
const formLabelAlign = reactive({
    name: '',
    region: '',
    type: ''
})
const parentBorder = ref(false)
const childBorder = ref(false)
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
        family: [
            {
                name: 'Jerry',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114'
            },
            {
                name: 'Spike',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114'
            },
            {
                name: 'Tyke',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114'
            }
        ]
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
        family: [
            {
                name: 'Jerry',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114'
            },
            {
                name: 'Spike',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114'
            },
            {
                name: 'Tyke',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114'
            }
        ]
    }
]

const handleNodeClick = () => {
    console.log(data)
}
const data = [
    {
        label: '一级基础类目1',
        children: [
            {
                label: '二级基础类目1.1',
                children: [
                    {
                        label: '三级级基础类目1.1.1',
                        children: [
                            {
                                label: '四级级基础类目1.1.1.1'
                            },
                            {
                                label: '四级级基础类目1.1.1.2'
                            }
                        ]
                    },
                    {
                        label: '三级级基础类目1.1.2'
                    },
                    {
                        label: '三级级基础类目1.1.3'
                    }
                ]
            },
            {
                label: '二级基础类目1.2'
            },
            {
                label: '二级基础类目1.3',
                children: [
                    {
                        label: '三级基础类目1.3.1'
                    },
                    {
                        label: '三级基础类目1.3.2'
                    },
                    {
                        label: '三级基础类目1.3.3'
                    }
                ]
            }
        ]
    },
    {
        label: '一级基础类目2'
    },
    {
        label: '一级基础类目3'
    },
    {
        label: '一级基础类目4'
    },
    {
        label: '一级基础类目5'
    }
]

const defaultProps = {
    children: 'children',
    label: 'label'
}

</script>

<style lang="scss" scoped>
h1{
    font-weight: 800;
    font-size: 30px;
    margin-bottom: 50px;
}
  .btn{
                margin-top: 10px;
                display: flex;
                }
</style>
