<template>
    <div class="tabbar-safe-area">
        <div class="tabbar">
            <template v-for="tab in appTab" :key="tab.name">
                <div v-if="tab.name !== 'scan-code'" class="tabbar-item" :class="currentName === tab.name ? 'active' : ''" @click="routerTo(tab.name)">
                    <div class="icon--unselect" v-if="tab.name !== 'shopping-cart'">
                        <van-icon v-show="currentName === tab.name" size="1em" :name="require(`@/assets/tabbar/${ tab.name }-active.png`)" />
                        <van-icon v-show="currentName !== tab.name" size="1em" :name="require(`@/assets/tabbar/${ tab.name }.png`)" />
                    </div>
                    <div class="icon--unselect" v-else>
                        <van-icon :badge="cartNum ? cartNum : ''" v-show="currentName === tab.name" size="1em" :name="require(`@/assets/tabbar/${ tab.name }-active.png`)" />
                        <van-icon :badge="cartNum ? cartNum : ''" v-show="currentName !== tab.name" size="1em" :name="require(`@/assets/tabbar/${ tab.name }.png`)" />
                    </div>
                    <div class="text">{{ tab.lable }}</div>
                </div>
                <template v-else>
                    <div class="tabbar-center" @click="scanQRCodeFn">
                        <div class="icon--unselect">
                            <van-icon size="1em" :name="require('@/assets/tabbar/scan-code.png')" />
                        </div>
                    </div>
                </template>
            </template>
        </div>
        <div class="van-safe-area-bottom"></div>
    </div>
    <div v-if="$route.name!=='menu' && $route.name!=='shopping-cart'" class="tabbar-height van-safe-area-bottom"></div>
</template>
<script setup>
import { appTab } from '@/utils'
import { scanQRCodeFn } from '@/utils/composables'
import { Toast } from 'vant'

const store = useStore()
const route = useRoute()
const router = useRouter()
const cartNum = computed(() => store.state.cartNum)
const currentName = ref('')
const storeInfo = computed(() => store.state.storeInfo)
const userInfo = computed(() => store.state.userInfo)

watchEffect(() => (currentName.value = route.name))

const routerTo = name => {
    if (name === 'menu' && !storeInfo.value) return Toast('请先在首页选择货柜和店铺')
    if (name === 'shopping-cart' && !storeInfo.value) return Toast('请先在首页选择货柜和店铺')
    if (name === 'shopping-cart' && !userInfo.value) return router.push({ name: 'login' })
    router.push({ name })
}
</script>

<style lang="scss" scoped>
.tabbar-height{
    width: 100%;
    height: 98px;
}
.tabbar-safe-area{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    .van-safe-area-bottom{
        background-color: #fff;
    }
    .tabbar{
        display: flex;
        height: 98px;
        // background-color: #fff;
        .tabbar-center{
            width: 240px;
            height: 98px;
            background-image: url('../assets/tabbar/center.png');
            background-size: 100% 100%;
            position: relative;
            .icon--unselect{
                width: 100%;
                text-align: center;
                position: absolute;
                bottom: 16px;
                font-size: 108px;
            }
        }
        .tabbar-item{
            flex: 1;
            text-align: center;
            background-color: #fff;
            .icon--unselect{
                font-size: 44px;
                margin-top: 14px;
                position: relative;
            }
            .text{
                font-size: 20px;
                font-weight: 400;
            }
        }
        .tabbar-item:first-child{
            padding-left: 42px;
        }
        .tabbar-item:nth-child(2){
            padding-left: 42px;
        }
        .tabbar-item:nth-child(4){
            padding-right: 42px;
        }
        .tabbar-item:last-child{
            padding-right: 42px;
        }
        .tabbar-item.active{
            .text{
                color: #E05324;
            }
        }
    }
}
</style>
