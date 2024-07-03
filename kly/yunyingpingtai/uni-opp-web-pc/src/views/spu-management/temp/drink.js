const formData = {
    brandCode: '',
    spuId: '',
    productFormat: '',
    netWeight: '',
    vitRatio: '',
    traceRatio: '',
    juiceRatio: '',
    pectinRatio: '',
    jamRatio: '',
    extractTech: '',
    sugarRatio: '',
    sugarCate: '',
    teaVarieties: '',
    pulpRatio: '',
    teaPolRatio: '',
    highFiber: '',
    noSuger: '',
    fruityType: '',
    beverageType: '',
    sportsDrink: '',
    electrolyte: '',
    polType: '',
    solubleSolidRatio: '',
    isSubstitute: '0',
    anthocyaninRatio: '',
    caroteneRatio: '',
    preservRatio: '',
    bestDrinkTime: '',
    packageProcess: '',
    processCraft: ''
}
const extendImportant = [
    { label: '品牌编号', name: 'brandCode', type: 'input' },
    { label: '标品编码', name: 'spuId', type: 'input', readonly: 'readonly' },
    { label: '产品标准号', name: 'productFormat', type: 'input' },
    { label: '商品净重', name: 'netWeight', type: 'input' },
    { label: '维生素含量', name: 'vitRatio', type: 'input' },
    { label: '微量元素含量', name: 'traceRatio', type: 'input' },
    { label: '果汁含量', name: 'juiceRatio', type: 'input' },
    { label: '果胶含量', name: 'pectinRatio', type: 'input' },
    { label: '果酱含量', name: 'jamRatio', type: 'input' },
    { label: '萃取技术', name: 'extractTech', type: 'input' },
    { label: '含糖量', name: 'sugarRatio', type: 'input' },
    { label: '含糖类别', name: 'sugarCate', type: 'input' },
    { label: '茶叶品种', name: 'teaVarieties', type: 'input' },
    { label: '果肉含量', name: 'pulpRatio', type: 'input' },
    { label: '茶多酚含量', name: 'teaPolRatio', type: 'input' },
    { label: '高膳食纤维', name: 'highFiber', type: 'input' },
    { label: '是否0糖0卡', name: 'noSuger', type: 'input' },
    { label: '果味类型', name: 'fruityType', type: 'input' },
    { label: '饮料类型', name: 'beverageType', type: 'input' },
    { label: '运动饮料', name: 'sportsDrink', type: 'input' },
    { label: '电解质', name: 'electrolyte', type: 'input' },
    { label: '多肽型', name: 'polType', type: 'input' },
    { label: '可溶性固溶性含量', name: 'solubleSolidRatio', type: 'input' },
    {
        label: '是否能用于代餐',
        name: 'isSubstitute',
        type: 'radio',
        required: false,
        menu: [
            { value: '0', text: '否' },
            { value: '1', text: '是' }
        ]
    },
    { label: '花青素含量', name: 'anthocyaninRatio', type: 'input' },
    { label: '胡萝卜素含量', name: 'caroteneRatio', type: 'input' },
    { label: '防腐剂含量', name: 'preservRatio', type: 'input' },
    { label: '最佳饮用时间', name: 'bestDrinkTime', type: 'input' },
    { label: '包装工艺', name: 'packageProcess', type: 'input' },
    { label: '加工工艺', name: 'processCraft', type: 'input' }
]
export default {
    tempFormData: formData,
    extendImportant: extendImportant
}
