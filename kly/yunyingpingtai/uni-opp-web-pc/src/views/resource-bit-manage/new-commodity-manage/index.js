export const tHead = [
    // { type: 'index', align: 'center', label: '序号', width: 80 },
    { align: 'center', tooltip: true, prop: 'orderNum', label: '排序', width: 80 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'operatorId', label: '操作人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'isEnabled', label: '状态', minWidth: 60, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', fixed: 'right', minWidth: 120, slot: true }
]
export const addHead = [
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', width: 80 },
    { align: 'center', tooltip: true, prop: 'firstCateName', label: '一级分类', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'secondCateName', label: '二级分类', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'supplierType', label: '使用场景', minWidth: 60, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', fixed: 'right', minWidth: 120, slot: true }
]
