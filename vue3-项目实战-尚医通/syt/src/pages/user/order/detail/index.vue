<template>
    <div class="detail">
        <!-- 展示订单详情的结构 -->
        <el-card>
            <!-- 卡片头部 -->
            <template #header>
                <div class="card-header">
                    <span>挂号详情</span>
                </div>
            </template>
            <!-- 展示身体部分顶部结构 -->
            <div class="body">
                <!-- 左侧标签 -->
                <div class="left">
                    <el-tag type="success">
                        <i class="iconfont icon-check left"></i>
                        <span class="right">{{ orderInfor.param?.orderStatusString }}</span>
                    </el-tag>
                </div>
                <!-- 右侧div -->
                <div class="right">
                    <img src="@/assets/images/code_app.png" alt="">
                    <div class="word">
                        <p>
                            <span>微信关注</span>
                            <i class="iconfont icon-weixin"></i>
                            <span>
                                "北京114预约挂号"
                            </span>
                        </p>
                        <p>"快速预约挂号"</p>
                    </div>
                </div>
            </div>
            <!-- 订单详情底部结构 -->
            <div class="bottom">
                <div class="left">
                    <!-- 左侧显示订单详情信息 -->
                    <el-descriptions class="margin-top" :column="1" border>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    就诊人信息
                                </div>
                            </template>
                            {{ orderInfor.patientName }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    就诊日期
                                </div>
                            </template>
                            {{ orderInfor.reserveDate }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    就诊医院
                                </div>
                            </template>
                            {{ orderInfor.hosname }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    就诊科室
                                </div>
                            </template>
                            {{ orderInfor.depname }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    医生职称
                                </div>
                            </template>
                            {{ orderInfor.title }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    医事服务费
                                </div>
                            </template>
                            <span style="color:red">{{ orderInfor.amount }}元</span>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    挂号单号
                                </div>
                            </template>
                            {{ orderInfor.outTradeNo }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    挂号时间
                                </div>
                            </template>
                            {{ orderInfor.createTime }}
                        </el-descriptions-item>
                    </el-descriptions>
                    <div class="btn" v-if="orderInfor.orderStatus === 0 || orderInfor.orderStatus === 1">
                        <el-popconfirm title="确定取消预约？" @confirm="confirm" @cancel="cancel">
                            <template #reference>
                                <el-button>取消预约</el-button>
                            </template>
                        </el-popconfirm>
                        <el-button type="primary" size="default" v-if="orderInfor.orderStatus === 0"
                            @click="payMent">支付</el-button>
                    </div>
                </div>
                <div class="right">
                    <el-card>
                        <template #header>
                            <div class="card-header">
                                <span>注意事项</span>
                            </div>
                        </template>
                        <p>1.请确认就诊人信息是否准确，若填写错误将无法取号就诊，损失由本人承担；</p>
                        <p style="color: red">
                            2.【取号】就诊当天需在{{ orderInfor.fetchTime }}
                            在医院取号，未取号视为爽约，该号不退不换；
                        </p>
                        <p>
                            3.【退号】在{{ orderInfor.quitTime }}可在线退号 ，逾期将不可办理退号退费；
                        </p>
                        <p>
                            4.北京114预约挂号支持自费患者使用身份证预约，同时支持北京市医保患者使用北京社保卡在平台预约挂号。请于就诊当日，携带预约挂号所使用的有效身份证件到院取号；
                        </p>
                        <p>5.请注意北京市医保患者在住院期间不能使用社保卡在门诊取号。</p>
                    </el-card>
                </div>
            </div>
        </el-card>
        <!-- 展示对话框的结构 （支付二维码）(通过v-model来控制显示与隐藏的)-->
        <el-dialog v-model="dialogVisible" title="微信支付" width="400" @close="close">
            <div class="qrcode">
                <img :src="imgUrl" alt="">
                <p>请使用微信扫一扫</p>
                <p>扫描二维码支付</p>
            </div>
            <!-- 对话框底部插槽传递结构 -->
            <template #footer>
                <el-button type="primary" size="default" @click="closeDialog">关闭窗口</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import '@/style/icon.scss'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { reqGetOrderInfor, reqCancelOrder, reqQrCode,reqQueryPayStatus } from '@/api/user/index'
import { GetOrderInforResponseData,CancelOrderResponseData,QueryPayStatusResponseData } from '@/api/user/type'
import { ElMessage } from 'element-plus'
// 生成二维码插件
import QRCode from 'qrcode'
//控制对话框显示与隐藏的数据
let dialogVisible = ref<boolean>(false);
//获取路由对象
const $route = useRoute();
const { orderId } = $route.query;
const orderInfor = ref<any>({});
//存储二维码图片
let imgUrl = ref<string>('');
//存储定时器
let timer = ref<any>();
onMounted(() => {
    //获取订单详情
    getOrderInfor(orderId as string);
});
//获取订单详情
const getOrderInfor = async (orderId: string) => {
    const result: GetOrderInforResponseData = await reqGetOrderInfor(orderId);
    console.log('result', result);
    if (result.code === 200) {
        orderInfor.value = result.data;
        console.log('orderInfor', orderInfor.value);
    }
}
//确定取消按钮
const confirm = () => {
    //发送取消订单接口
    cancelOrder();
}
//取消订单接口 订单的三种状态：orderStatus：-1（取消取悦） 0（预约但是没有支付） 1（支付成功）
const cancelOrder = async () => {
    try {
        const result:CancelOrderResponseData = await reqCancelOrder(orderId as string);
        if(result.code===200){
            //取消成功
            ElMessage({
                type:'success',
                message:result.message
            })
            //再次获取订单详情
            getOrderInfor(orderId as string);
        }else{
            ElMessage({
                type:'error',
                message:result.message
            })
        }
        
    } catch (error) {
        ElMessage({
            type: 'error',
            message: '取消预约失败'
        })
    }
}
//支付按钮
const payMent = () => {
    //获取支付二维码
    getQrcode();

}
//支付二维码 右上角的关闭按钮
const close = ()=>{
    //清除定时器
    clearInterval(timer.value);
}
//关闭对话框
const closeDialog = () => {
    dialogVisible.value = false;
    //清除定时器
    clearInterval(timer.value);
}
//获取支付二维码接口
const getQrcode = async () => {
    const result = await reqQrCode(orderId as string);
    if (result.code === 200) {
        //根据服务器返回的二维码信息生成二维码图片
        console.log('QRCode', QRCode);
        await QRCode.toDataURL(result.data.codeUrl)
            .then(url => {
                imgUrl.value = url;
            })
            .catch(err => {
                console.error(err)
            })
        //弹出二维码对话框
        dialogVisible.value = true;
        //询问服务器当前这笔交易的支付状态
        //只要二维码出来，需要每隔几秒询问服务器是否支付成功
        timer.value = setInterval( async ()=>{
            const result:QueryPayStatusResponseData = await reqQueryPayStatus(orderId as string);
            console.log('result',result);
            //如果服务器返回的数据data:true,代表支付成功
            if(result.code === 200){
                if(result.data){
                    //支付成功
                    dialogVisible.value = false;
                    //提示语
                    ElMessage({
                        type:'success',
                        message:'支付成功'
                    });
                    //清除定时器
                    clearInterval(timer.value);
                    //再次获取订单详情信息
                    getOrderInfor(orderId as string);
                }
            }
        },5000);
    }
}
</script>

<style scoped lang="scss">
.detail {
    .card-header {
        span {
            color: #7f7f7f;
            font-weight: 900;
        }
    }

    .body {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        padding: 10px;

        .left {
            ::v-deep .el-tag__content {
                display: flex;
                align-items: center;

                .right {
                    margin-left: 5px;
                }
            }
        }

        .right {
            display: flex;
            align-items: center;

            img {
                width: 40px;
                height: 40px;
            }

            .word {
                margin-left: 10px;

                p {
                    font-size: 12px;
                    line-height: 20px;
                    display: flex;

                    .icon-weixin {
                        color: green;
                    }
                }
            }
        }
    }

    .bottom {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;

        .left {
            flex: 4;

            .btn {
                margin: 10px 0;
            }
        }

        .right {
            margin-left: 30px;
            flex: 6;

            p {
                line-height: 30px;
            }
        }
    }

    .qrcode {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}

::v-deep(.el-dialog__body) {
    border-top: 1px solid #7f7f7f;
    border-bottom: 1px solid #7f7f7f;

    p {
        line-height: 30px;
    }

    p:nth-child(3) {
        margin-bottom: 10px;
    }
}</style>