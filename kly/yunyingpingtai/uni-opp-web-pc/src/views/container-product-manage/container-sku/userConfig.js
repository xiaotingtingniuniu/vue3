
import { reactive, ref } from 'vue'
export const tHead = [
    { align: 'center', tooltip: true, prop: 'cityName', label: '城市', fixed: true },
    { align: 'center', tooltip: true, prop: 'secondChannelId', label: '设备编号', fixed: true },
    { align: 'center', tooltip: true, prop: 'deviceTypeName', label: '设备类型' },
    { align: 'center', tooltip: true, prop: 'thirdChannelName', label: '上架渠道' },
    { align: 'center', tooltip: true, prop: 'skuId', label: 'sku编码', fixed: true },
    { align: 'center', tooltip: true, prop: 'skuName', label: 'sku名称', fixed: true },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商家编码', fixed: true },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商家名称', fixed: true },

    // { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称' },
    { align: 'center', tooltip: true, prop: 'imgUrl', label: '商品图片', minWidth: 150, slot: true, fixed: true },
    { align: 'center', tooltip: true, prop: 'gmtOnShelf', label: '上架时间', slot: true },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '最新操作时间', slot: true },
    { align: 'center', tooltip: true, prop: 'spuId', label: 'spu编号', fixed: true },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', fixed: true },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码' },
    { align: 'center', tooltip: true, prop: 'firstCateName', label: '基础类目', slot: true },
    { align: 'center', tooltip: true, prop: 'storageStyle', label: '存储条件' },
    { align: 'center', tooltip: true, prop: 'skuStatus', label: 'Sku 状态', slot: true, minWidth: 225 },
    { align: 'center', tooltip: true, prop: 'stock', label: '柜内库存' }
]
