<template>
    <div>
        <el-table :data="props.googdsHasSelectList" style="width: 100%;marginTop: 20px;" v-if="groupSkuGoods">
            <el-table-column prop="date" label="商户信息">
                <template #default="{row}">
                    商户编号：{{row.merchantId}}<br>
                    商户名称：{{row.merchantName}}
                </template>
            </el-table-column>
            <el-table-column label="店铺信息" width="180">
                <template #default="{row}">
                    店铺编号：{{row.shopId}}<br>
                    店铺名称：{{row.shopName}}
                </template>
            </el-table-column>
            <el-table-column label="商品信息" width="180">
                <template #default="{row}">
                    sku编号：{{row.skuId}}<br>
                    sku名称：{{row.skuName}}
                </template>
            </el-table-column>
            <el-table-column label="当前价格" width="180">
                <template #default="{row}">
                    原价：{{row.markOffPrice/100}}<br>
                    团购价：{{row.specialPrice/100}}
                </template>
            </el-table-column>
            <el-table-column label="当前团购券数量(申请/待核销/已核销)" width="180">
                <template #default="{row}">
                    {{row.voucherCount}}/{{row.unVerifyCount}}/{{row.usedCount}}
                </template>
            </el-table-column>
            <el-table-column label="当前团购活动有效期" width="180">
                <template #default="{row}">
                    开始：{{row.isValidBeginTime}}<br>
                    结束：{{row.isValidEndTime}}
                </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="120" align="center" v-if="!props.canNotEdit" fixed="right">
                <template #default="scope">
                    <el-button type="primary" text @click="handleGoodsRemove(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup>
import { computed } from 'vue'
const emit = defineEmits(['remove'])
// 本地生活-团购 选中商品回显
const groupSkuGoods = computed(() => props.businessCode === 'A1001003' || props.goodsRangeType === 2)
// googdsHasSelectList已选中的商品
// businessCode业务线
// goodsRangeType商品范围：全部/部分商品
const props = defineProps(['googdsHasSelectList', 'businessCode', 'goodsRangeType', 'canNotEdit'])

// 商品表格-remove
const handleGoodsRemove = (index) => {
    emit('remove', index)
}
</script>
