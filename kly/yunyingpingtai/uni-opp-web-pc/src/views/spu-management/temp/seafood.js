const formData = {
    brandCode: '',
    spuId: '',
    productFormat: '',
    netWeight: '',
    growthEnv: '',
    breedStyle: '',
    seafoodStatus: '',
    noWashCut: '',
    productRank: '',
    feedStyle: '',
    processStyle: '',
    processFormat: '',
    processForm: '',
    variety: '',
    processCraft: '',
    noIceWeight: '',
    oilRatio: ''
}
const extendImportant = [
    { label: '品牌编号', name: 'brandCode', type: 'input' },
    { label: '标品编码', name: 'spuId', type: 'input', readonly: 'readonly' },
    { label: '产品标准号', name: 'productFormat', type: 'input' },
    { label: '商品净重', name: 'netWeight', type: 'input' },
    { label: '生长环境', name: 'growthEnv', type: 'input' },
    { label: '养殖方式', name: 'breedStyle', type: 'input' },
    { label: '海鲜状态', name: 'seafoodStatus', type: 'input' },
    { label: '免洗免切', name: 'noWashCut', type: 'input' },
    { label: '等级', name: 'productRank', type: 'input' },
    { label: '饲养方式', name: 'feedStyle', type: 'input' },
    { label: '加工方式', name: 'processStyle', type: 'input' },
    { label: '加工形态', name: 'processFormat', type: 'input' },
    { label: '加工形式', name: 'processForm', type: 'input' },
    { label: '品种', name: 'variety', type: 'input' },
    { label: '食品工艺', name: 'processCraft', type: 'input' },
    { label: '去冰克重', name: 'noIceWeight', type: 'input' },
    { label: '油脂含量', name: 'oilRatio', type: 'input' }
]
export default {
    tempFormData: formData,
    extendImportant: extendImportant
}
