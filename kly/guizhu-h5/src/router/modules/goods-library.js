export default [
    {
        path: '/myGoods/:active?',
        name: 'myGoods',
        meta: {
            title: '我的商品库'
        },
        component: () => import(/* webpackChunkName: "goods-library-mine" */ '@/views/goods-library/mine.vue')
    },
    {
        path: '/goodsEdit',
        name: 'goodsEdit',
        meta: {
            title: '编辑商品'
        },
        component: () => import(/* webpackChunkName: "goods-library-mine" */ '@/views/goods-library/edit.vue')
    },
    {
        path: '/goodsToContainer',
        name: 'goodsToContainer',
        meta: {
            title: '添加商品到货柜'
        },
        component: () => import(/* webpackChunkName: "goods-library-mine" */ '@/views/goods-library/container.vue')
    },
    {
        path: '/commodity-warehouse-title',
        name: 'commodityWarehouseTitle',
        component: () => import(/* webpackChunkName: "commodity-warehouse-title" */ '@/views/goods-library/commodity-warehouse-title.vue'),
        children: [
            {
                path: '/publicGoods',
                name: 'publicGoods',
                meta: {
                    title: '公共商品库'
                },
                component: () => import(/* webpackChunkName: "goods-library-mine" */ '@/views/goods-library/public-goods.vue')
            },
            {
                path: '/apply-new-products',
                name: 'applyNewProducts',
                meta: {
                    title: '新品申请'
                },
                component: () => import(/* webpackChunkName: "apply-new-products" */ '@/views/goods-library/apply-new-products.vue')
            }
        ]
    },
    {
        path: '/boot-upgrade',
        name: 'boot-upgrade',
        meta: {
            title: '标品化升级'
        },
        component: () => import(/* webpackChunkName: "boot-upgrade" */ '@/views/guide/boot-upgrade.vue')
    },
    {
        path: '/equipment-on-sale/:goodsId',
        name: 'equipment-on-sale',
        props: true,
        meta: {
            title: '在售设备'
        },
        component: () => import(/* webpackChunkName: "equipment-on-sale" */ '@/views/goods-library/equipment-on-sale.vue')
    }
]
