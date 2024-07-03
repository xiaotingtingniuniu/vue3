const routes = [
    {
        path: '/open',
        name: 'open',
        meta: {
            title: ''
        },
        component: () => import(/* webpackChunkName: "open" */ '@/views/replenishment/open.vue')
    },
    {
        path: '/scanningFailed',
        name: 'scanningFailed',
        meta: {
            title: ''
        },
        component: () => import(/* webpackChunkName: "scanningFailed" */ '@/views/replenishment/scanningFailed.vue')
    },
    {
        path: '/openingResult',
        name: 'openingResult',
        meta: {
            title: '开门结果'
        },
        component: () => import(/* webpackChunkName: "openingResult" */ '@/views/replenishment/openingResult.vue')
    },
    {
        path: '/openFail',
        name: 'openFail',
        meta: {
            title: '开门结果失败'
        },
        component: () => import(/* webpackChunkName: "openFail" */ '@/views/replenishment/openFail.vue')
    },
    {
        path: '/inventoryList',
        name: 'inventoryList',
        meta: {
            title: '盘货',
            keepAlive: true
        },
        component: () => import(/* webpackChunkName: "replenishmentList" */ '@/views/replenishment/replenishmentList.vue')
    },
    {
        path: '/replenishmentList',
        name: 'replenishmentList',
        meta: {
            title: '设备商品'
        },
        component: () => import(/* webpackChunkName: "replenishmentList" */ '@/views/replenishment/replenishmentList.vue')
    },
    {
        path: '/result',
        name: 'result',
        meta: {
            title: '补货结果'
        },
        component: () => import(/* webpackChunkName: "result" */ '@/views/replenishment/result.vue')
    },
    {
        path: '/addItem',
        name: 'addItem',
        meta: {
            title: '添加商品'
        },
        component: () => import(/* webpackChunkName: "addItem" */ '@/views/replenishment/addItem.vue')
    },
    {
        path: '/inventoryResults',
        name: 'inventoryResults',
        meta: {
            title: '盘货结果'
        },
        component: () => import(/* webpackChunkName: "inventoryResults" */ '@/views/replenishment/inventoryResults.vue')
    },
    // 设备列表
    {
        path: '/equipmentList',
        name: 'equipmentList',
        meta: {
            title: '选择设备'
        },
        component: () => import(/* webpackChunkName: "equipmentList" */ '@/views/replenishment/equipmentList.vue')
    },
    {
        path: '/deviceDetails',
        name: 'deviceDetails',
        meta: {
            title: '设备商品'
        },
        component: () => import(/* webpackChunkName: "deviceDetails" */ '@/views/replenishment/assembly/deviceDetails.vue')
    },
    {
        path: '/resembleGoods/:deviceCode/:deviceType',
        name: 'resembleGoods',
        props: true,
        meta: {
            title: '相似商品'
        },
        component: () => import(/* webpackChunkName: "resembleGoods" */ '@/views/replenishment/assembly/resembleGoods.vue')
    },
    {
        path: '/invalid-goods/:deviceCode',
        name: 'invalid-goods',
        props: true,
        meta: {
            title: '失效商品'
        },
        component: () => import(/* webpackChunkName: "invalid-goods" */ '@/views/replenishment/assembly/invalid-goods.vue')
    },
    // {
    //     path: '/salesOrders',
    //     name: 'hesalesOrders',
    //     meta: {
    //         title: '销售订单',
    //         keepAlive: true
    //     },
    //     component: () => import(/* webpackChunkName: "health" */ '../../views/salesOrders/index')
    // },
    {
        path: '/salesOrders/:active?',
        name: 'hesalesOrders',
        meta: {
            title: '销售订单',
            keepAlive: true
        },
        component: () => import(/* webpackChunkName: "health" */ '@/views/salesOrders/order-list/index.vue')
    },
    {
        path: '/salesOrders/orderDetail',
        name: 'hesalesOrders/orderDetail',
        meta: {
            title: '销售订单',
            keepAlive: true
        },
        component: () => import(/* webpackChunkName: "salesOrders/orderDetail" */ '@/views/salesOrders/orderDetail.vue')
    },
    {
        path: '/salesOrders/detail/:orderNoSub?/:applyCode',
        name: 'salesOrdersDetails',
        props: true,
        meta: {
            title: '订单详情'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/order-detail/index.vue')
    },
    {
        path: '/details/:orderNoSub/:orderStatus?',
        name: 'details',
        props: true,
        meta: {
            title: '订单详情'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/details/details.vue')
    },
    {
        path: '/goodsDetails',
        name: 'goodsDetails',
        meta: {
            title: '订单详情'
        },
        component: () => import(/* webpackChunkName: "goodsDetails" */ '@/views/salesOrders/details/goodsDetails.vue')
    },
    {
        path: '/afterDetails/:orderNoSub?/:refundNo?',
        name: 'afterDetails',
        props: true,
        meta: {
            title: '退款/售后详情'
        },
        component: () => import(/* webpackChunkName: "afterDetails" */ '@/views/salesOrders/details/afterSales.vue')
    },
    {
        path: '/openDetails/:openDoorNo/:consumerId',
        name: 'openDetails',
        props: true,
        meta: {
            title: '开门记录详情'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/details/openDetail.vue')
    },
    {
        path: '/abnormalDetails',
        name: 'abnormalDetails',
        meta: {
            title: '工单详情'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/details/abnormal.vue')
    },
    {
        path: '/addGoods/:workOrderNo',
        name: 'addGoods',
        props: true,
        meta: {
            title: '添加商品'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/addGoods/addGoods.vue')
    },
    {
        path: '/addOrder/:workOrderNo?',
        name: 'addOrder',
        props: true,
        meta: {
            title: '创建订单'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/addGoods/addOrder.vue')
    },
    {
        path: '/addGoodsOrder',
        name: 'addGoodsOrder',
        meta: {
            title: '创建订单'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/addGoods/addGoodsOrder.vue')
    },
    {
        path: '/addResult/:workOrderNo?/:orderNo?',
        name: 'addResult',
        props: true,
        meta: {
            title: '创建订单结果'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/addGoods/addResult.vue')
    },
    {
        path: '/equipmentDetails/:applyCode/:orderNoSub?',
        name: 'equipmentDetails',
        props: true,
        meta: {
            title: '设备详情'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/details/equipmentDetail.vue')
    },
    {
        path: '/abnormalProcess/:applyCode/:orderNoSub?',
        name: 'abnormalProcess',
        props: true,
        meta: {
            title: '售后信息'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/details/abnormalProcess.vue')
    },
    {
        path: '/supplementary-order/:applyCode/:orderNoSub?',
        name: 'supplementary-order',
        props: true,
        meta: {
            title: '配置商品信息'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/details//supplementary-order.vue')
    },
    {
        path: '/supplementary-order-work/:applyCode/:orderNoSub?',
        name: 'supplementary-order-work',
        props: true,
        meta: {
            title: '配置商品信息'
        },
        component: () => import(/* webpackChunkName: "details" */ '@/views/salesOrders/details//supplementary-order-work.vue')
    }
]

export default routes
