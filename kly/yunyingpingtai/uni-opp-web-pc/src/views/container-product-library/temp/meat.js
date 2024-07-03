const formData = {
    brandCode: '',
    spuId: '',
    productFormat: '',
    netWeight: '',
    growthEnv: '',
    leanRatio: '',
    feedStyle: '',
    isMuslim: '',
    processCraft: '',
    bodyPart: '',
    sterilizeCraft: '',
    mainMaterial: '',
    processStyle: '',
    processFormat: '',
    variety: '',
    noIceWeight: '',
    fatContent: ''
}
const extendImportant = [
    { label: '品牌编号', name: 'brandCode', type: 'input' },
    { label: '标品编码', name: 'spuId', type: 'input', readonly: 'readonly' },
    { label: '产品标准号', name: 'productFormat', type: 'input' },
    { label: '商品净重', name: 'netWeight', type: 'input' },
    { label: '生长环境', name: 'growthEnv', type: 'input' },
    { label: '瘦肉占比', name: 'leanRatio', type: 'input' },
    { label: '饲养方式', name: 'feedStyle', type: 'input' },
    { label: '是否清真', name: 'isMuslim', type: 'input' },
    { label: '加工工艺', name: 'processCraft', type: 'input' },
    { label: '部位', name: 'bodyPart', type: 'input' },
    { label: '杀菌工艺', name: 'sterilizeCraft', type: 'input' },
    { label: '主材料', name: 'mainMaterial', type: 'input' },
    { label: '加工方式', name: 'processStyle', type: 'input' },
    { label: '加工形态', name: 'processFormat', type: 'input' },
    { label: '品种', name: 'variety', type: 'input' },
    { label: '去冰克重', name: 'noIceWeight', type: 'input' },
    { label: '脂肪含量', name: 'fatContent', type: 'input' }
]
export default {
    tempFormData: formData,
    extendImportant: extendImportant
}
