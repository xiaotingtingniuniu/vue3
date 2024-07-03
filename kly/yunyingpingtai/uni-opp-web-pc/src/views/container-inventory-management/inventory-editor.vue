<template>
    <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
        style="max-width: 460px"
    >
        <el-form-item label="商家编号">
            <el-input v-model="formLabelAlign.name" />
        </el-form-item>
        <el-form-item label="商家名称">
            <el-input v-model="formLabelAlign.region" />
        </el-form-item>
        <el-form-item label="Goods编号">
            <el-input v-model="formLabelAlign.type" />
        </el-form-item>
        <el-form-item label="SKU编号">
            <el-input v-model="formLabelAlign.type" />
        </el-form-item>
        <el-form-item label="SKU名称">
            <el-input v-model="formLabelAlign.type" />
        </el-form-item>
        <el-form-item label="可售数量">
            <el-input v-model="formLabelAlign.type" />
        </el-form-item>
        <el-form-item label="一级渠道">
            <el-input v-model="formLabelAlign.type" />
        </el-form-item>
        <el-form-item label="二级渠道">
            <el-input v-model="formLabelAlign.type" />
        </el-form-item>
        <el-form-item label="价格">
            <el-input v-model="formLabelAlign.type" />
        </el-form-item>
        <el-form-item label="预占数量">
            <el-input v-model="formLabelAlign.type" />
        </el-form-item>
        <el-form-item label="状态">
            <el-input v-model="formLabelAlign.type" />
        </el-form-item>
    </el-form>
    <div class="btn">
        <el-button>取消</el-button>
        <el-button type="success">确定</el-button>
    </div>
</template>

<script setup>
import { reactive } from 'vue'

const formLabelAlign = reactive({
    name: '',
    region: '',
    type: ''
})
</script>

<style lang="scss" scoped>
.btn{
    margin-top: 10px;
    display: flex;
}
</style>
