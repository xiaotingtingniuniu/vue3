<template>
    <div class="allDataBox">
        <!-- {{props.value}}
        {{props.activeName}} -->
        <div v-if="props.activeName" class="allDate">
            <div class="allDataList" v-for="(item,index) in commodityList" :key="index" @click="details(item.id,item.word)">
                <div class="outsideBox">
                    <img :src="item.url" alt="" class="allDataIng">
                    <div class="inside">
                        <div class="tips">
                            <div>{{item.title}}</div>
                            <div v-if="props.activeName === 'whole'">
                                <div class="onLineBox" v-if="item.word === 'onLine'">在线</div>
                                <div class="offLineBox" v-if="item.word === 'offLine'">离线</div>
                                <div class="lockingBox" v-if="item.word === 'locking'">锁定</div>
                            </div>
                            <div class="onLineBox" v-if="props.activeName === 'onLine'">在线</div>
                            <div class="offLineBox" v-if="props.activeName === 'offLine'">离线</div>
                            <div class="lockingBox" v-if="props.activeName === 'locking'">锁定</div>
                        </div>
                        <div class="numberBox">设备编号：{{item.order}}</div>
                        <div class="last">上次补货时间：{{item.order}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 锁定弹出 -->
    <!-- <van-dialog v-model:show="refuseShow"
                class="agreeDialog"
                show-cancel-button title="确定拒绝退款？"
                confirmButtonText="确定"
                cancelButtonText="取消"
                :before-close = 'onRefuseConfirmn'
                @confirm="refuseConfirmn"
                @cancel="refuseCancel">
        <div class="showBoxOne">
            <van-field v-model="refuseReason" type="textarea" placeholder="设备已锁定，是否手动解锁" class="reasonBox" />
        </div>
    </van-dialog>   -->
</template>

<script setup>
import { watch, reactive } from 'vue'
import { Dialog, Toast } from 'vant'
import { deviceLock } from '@/api/scan/scan.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    activeName: {
        typeof: String,
        default: ''
    }
})
console.log(props.value, props.activeName)
const commodityList = reactive([
    {
        id: 1,
        url: require('../img/img.jpg'),
        title: '华腾世纪大厦E1 503',
        order: '692346778899990',
        time: '2022-06-23 12:23:25',
        word: 'onLine'
    },
    {
        id: 2,
        url: require('../img/img.jpg'),
        title: '华腾世纪大厦E1 503',
        order: '692346778899990',
        time: '2022-06-23 12:23:25',
        word: 'offLine'
    },
    {
        id: 3,
        url: require('../img/img.jpg'),
        title: '华腾世纪大厦E1 503',
        order: '692346778899990',
        time: '2022-06-23 12:23:25',
        word: 'locking'
    },
    {
        id: 4,
        url: require('../img/img.jpg'),
        title: '华腾世纪大厦E1 503',
        order: '692346778899990',
        time: '2022-06-23 12:23:25',
        word: 'onLine'
    },
    {
        id: 5,
        url: require('../img/img.jpg'),
        title: '华腾世纪大厦E1 503',
        order: '692346778899990',
        time: '2022-06-23 12:23:25',
        word: 'offLine'
    },
    {
        id: 6,
        url: require('../img/img.jpg'),
        title: '华腾世纪大厦E1 503',
        order: '692346778899990',
        time: '2022-06-23 12:23:25',
        word: 'locking'
    }
])
// props.activeName = computed(() => {

// })
// onMounted(() => {
//     // console.log(value)
// })
const details = (id, val) => {
    if (val === 'locking') {
        Dialog.confirm({
            confirmButtonColor: '#FE7E41',
            message: '设备已锁定，是否手动解锁？',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            getContaniner: '.allDataBox',
            title: '货柜锁定时，不能查看设备商品'
        }).then(async () => {
            const res = await deviceLock({
                tagetStatus: 2
            })
            console.log(res)
            Toast.success('解锁成功')
            router.replace({
                path: '/device',
                name: 'device',
                params: { id: id }
            })
        }).catch(() => {

        })
    } else {
        router.replace({
            path: '/device',
            name: 'device',
            params: { id: id }
        })
    }
}
watch(() => props.activeName, (val) => {
    // console.log(val)
})
</script>
<style lang="scss">
.allDataBox{
    overflow:auto;
    margin-top: 10px;
    height: 100%;
    .allDate{
        margin-top: -20px;
    }
    .allDataList{
        width: 690px;
        height: 207px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;
        margin-bottom: 20px;
        .outsideBox{
            display: flex;
            .allDataIng{
                width: 147px;
                height: 147px;
                margin-top: 30px;
                margin-left: 30px;
            }
            .inside{
                width: 460px;
                // height: 200px;
                margin-left: 26px;
                .tips{
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    margin-top: 30px;
                    display: flex;
                    justify-content:space-between;
                    .onLineBox{
                        color: #69925A;
                    }
                    .offLineBox{
                        color: #FF2442;
                    }
                    .lockingBox{
                        color: #FE7E41;
                    }
                }
                .numberBox{
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #B0B0B0;
                    margin-top: 20px;
                }
                .last{
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #B0B0B0;
                    margin-top: 10px;
                }
            }
        }
    }
    .van-dialog__header{
        padding-top: 10px !important;
    }
}
.van-dialog__message--has-title{
        padding-top: 50px;
}
</style>
