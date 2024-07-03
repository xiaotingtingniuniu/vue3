<template>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="订单详情" name="first">
            <div class="first-box">
                <div class="details">
                    <el-space direction="vertical">
                        <el-card v-for="i in list" :key="i" class="box-card" style="width: 250px">
                            <template #header>
                                <div class="card-header">
                                    <span>{{ i }}</span>
                                </div>
                            </template>
                            <div v-for="o in 4" :key="o" class="text item">
                                {{ 'List item ' + o }}
                            </div>
                        </el-card>
                    </el-space>
                </div>
                <div class="videos">
                    <h1>视频信息</h1>
                    <video :src="VideoAddress == 0 ? require('../../assets/images/video.mp4') : require('../../assets/images/video2.mp4')" width="500" height="400" controls></video>
                    <div>
                        <el-button type="primary" @click="oneClick">视频一</el-button>
                        <el-button type="success" @click="twoClick">视频二</el-button>
                        <el-button type="warning">查看日志</el-button>
                    </div>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="商户订单" name="second">
            <h1>商户订单信息</h1>
            <div style="text-align: -webkit-center">
                <el-table :data="tableData" style="width: 100%" border show-summary :header-cell-style="{ 'text-align': 'center' }">
                    <el-table-column prop="date" label="商户信息"> </el-table-column>
                    <el-table-column prop="name" label="POI" />
                    <el-table-column prop="address" label="商品信息" />
                    <el-table-column prop="date" label="合计" />
                    <el-table-column prop="name" label="单价" />
                    <el-table-column prop="address" label="商品数量" />
                    <el-table-column prop="date" label="运费" />
                    <el-table-column prop="name" label="优惠金额" />
                    <el-table-column prop="address" label="支付金额" />
                    <el-table-column prop="date" label="履约信息" />
                    <el-table-column prop="name" label="退款信息" />
                </el-table>
            </div>
            <h1>优惠信息</h1>
            <div>
                <el-table :data="tableData" style="width: 50%" border show-summary :header-cell-style="{ 'text-align': 'center' }">
                    <el-table-column prop="date" label="营销工具" />
                    <el-table-column prop="name" label="营销活动编码" />
                    <el-table-column prop="address" label="营销活动名称" />
                    <el-table-column prop="date" label="优惠金额" />
                    <el-table-column prop="name" label="优惠券编码" />
                </el-table>
            </div>
            <h1>价格计算</h1>
            <p>订单总原价:</p>
            <p>总优惠金额:</p>
            <p>总运费:</p>
            <p>订单总支付价:</p>
            <p>总退款金额:</p>
        </el-tab-pane>
        <el-tab-pane label="退款单" name="third">
            <el-table :data="tableData" style="width: 100%" :header-cell-style="{ 'text-align': 'center' }" border>
                <el-table-column prop="date" label="退款订单单号" />
                <el-table-column prop="name" label="工单单号" />
                <el-table-column prop="address" label="订单单号" />
                <el-table-column prop="date" label="商户订单单号" />
                <el-table-column prop="name" label="退款订单状态" />
                <el-table-column prop="name" label="退款金额" />
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="补款单" name="fourth">
            <el-table :data="tableData" style="width: 100%" :header-cell-style="{ 'text-align': 'center' }" border>
                <el-table-column prop="date" label="订单单号" />
                <el-table-column prop="name" label="商户订单单号" />
                <el-table-column prop="address" label="补款订单单号" />
                <el-table-column prop="date" label="工单单号" />
                <el-table-column prop="name" label="补款订单状态" />
                <el-table-column prop="name" label="补款金额" />
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="客服信息" name="fifth">
            <el-table :data="tableData" style="width: 100%" :header-cell-style="{ 'text-align': 'center' }" border>
                <el-table-column prop="name" label="工单单号" />
                <el-table-column prop="address" label="工单时间" />
                <el-table-column prop="date" label="用户手机号" />
                <el-table-column prop="name" label="工单状态" />
                <el-table-column prop="name" label="工单类型" />
                <el-table-column prop="name" label="客诉类型" />
                <el-table-column prop="name" label="处理人" />
                <el-table-column prop="name" label="处理方案" />
                <el-table-column prop="name" label="操作" />
            </el-table>
        </el-tab-pane>
    </el-tabs>
</template>
<script setup>
// first
import { ref } from 'vue'

const activeName = ref('first')
const list = ['订单信息', '订单价格', '业务信息', '用户信息']

// second
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
    }
]
const VideoAddress = ref(0)
const oneClick = () => {
    VideoAddress.value = 0
}
const twoClick = () => {
    VideoAddress.value = 1
}
</script>
<style lang="scss" scoped>
.demo-tabs {
    .el-tabs__content {
        padding: 32px;
        color: #6b778c;
        font-size: 32px;
        font-weight: 600;
    }
}
.first-box {
    display: flex;
    .details {
        width: 500px;
    }
}
</style>
