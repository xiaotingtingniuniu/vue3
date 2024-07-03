const formData = {
    brandCode: '',
    spuId: '',
    productFormat: '',
    netWeight: '',
    processStyle: '',
    variety: '',
    productRank: '',
    productTaste: '',
    singleDiameter: '',
    singleWeight: '',
    tasteStyle: '',
    foodCraft: '',
    plantMethod: '',
    isHkVeg: '',
    isGreenVeg: '',
    isOrganicVeg: '',
    isSeasonVeg: '',
    processForm: ''
}
const extendImportant = [
    { label: '品牌编号', name: 'brandCode', type: 'input' },
    { label: '标品编码', name: 'spuId', type: 'input', readonly: 'readonly' },
    { label: '产品标准号', name: 'productFormat', type: 'input' },
    { label: '商品净重', name: 'netWeight', type: 'input' },
    { label: '加工方式', name: 'processStyle', type: 'input' },
    { label: '品种', name: 'variety', type: 'input' },
    { label: '等级', name: 'productRank', type: 'input' },
    { label: '口味', name: 'productTaste', type: 'input' },
    { label: '单果直径', name: 'singleDiameter', type: 'input' },
    { label: '单果重量', name: 'singleWeight', type: 'input' },
    { label: '口感', name: 'tasteStyle', type: 'input' },
    { label: '食品工艺', name: 'foodCraft', type: 'input' },
    { label: '种植方式', name: 'plantMethod', type: 'input' },
    { label: '是否供港蔬菜', name: 'isHkVeg', type: 'input' },
    { label: '是否绿色蔬菜', name: 'isGreenVeg', type: 'input' },
    { label: '是否有机蔬菜', name: 'isOrganicVeg', type: 'input' },
    { label: '是否应季', name: 'isSeasonVeg', type: 'input' },
    { label: '加工形态', name: 'processForm', type: 'input' }
]
export default {
    tempFormData: formData,
    extendImportant: extendImportant
}
