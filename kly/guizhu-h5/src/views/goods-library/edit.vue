<template>
    <div class="edit-content">
        <div class="edit-remark">
            <img src="@/assets/remark_icon.png" class="remark-icon">
            <span>商品名称的修改需进行审核，审核中不支持再次修改。若审核未通过将使用修改前的内容。</span>
        </div>
        <div class="goods-info-box">
            <van-form ref="form">
                <van-field v-model="goodsInfo.goodsName" type="textarea" autosize rows="1" name="商品名称" label="商品名称" placeholder="商品名称" :rules="[{ required: true, message: '请填写商品名称' }]" :disabled="!submitBtn"/>
                <van-field v-model="goodsInfo.guideSalePrice" name="商品价格" label="商品价格" type="number" placeholder="商品价格" :rules="[{ required: true, message: '请填写商品价格', validator: validatorNum2 }]" :disabled="!submitBtn"/>
            </van-form>
        </div>
        <div class="goods-info-box" v-if="goodsInfo.goodsApproval">
            <div class="goods-info">
                <span class="title">审核状态</span>
                <span class="info">
                    {{goodsInfo.goodsApproval.approveStatus === 1 ? '待审核' : goodsInfo.goodsApproval.approveStatus === 2 ? '审核通过' : goodsInfo.goodsApproval.approveStatus === 3 ? '驳回' : ''}}
                </span>
            </div>
            <div class="goods-info">
                <span class="title">状态更新时间</span>
                <span class="info">{{goodsInfo.goodsApproval.gmtModify}}</span>
            </div>
            <div class="goods-info">
                <span class="title">变更信息</span>
                <span class="info info-check" @click="checkUpdate">查看 ></span>
            </div>
            <div class="goods-info" v-if="goodsInfo.goodsApproval.approveAdvise">
                <span class="title">原因</span>
                <span class="info remark">{{goodsInfo.goodsApproval.approveAdvise}}</span>
            </div>
        </div>
        <div class="bottom" v-if="submitBtn">
            <span class="btn" @click="submit">提交</span>
        </div>
        <!-- 提交操作 -->
        <van-dialog :show="multipleHandlePopVisiable" class="submit-dialog">
            <template v-slot:default>
                <!-- 提交并上架操作 -->
                <span class="submit-dialog-content" v-if="$route.query.putOn === 'true'">修改成功后，是否上架到设备？</span>
                <span class="submit-dialog-content" v-else>修改成功后，是否同步更新设备中已经在售的商品？</span>
            </template>
            <template v-slot:footer>
                <span class="submit-dialog-handle handle-active" v-if="$route.query.putOn === 'true'" @click="putOnDevice">上架到设备</span>
                <span class="submit-dialog-handle handle-active" v-else @click="updateTogether">同步更新</span>
                <span class="submit-dialog-handle" v-if="$route.query.putOn === 'true'" @click="update(2)">仅上架到我的商品库</span>
                <span class="submit-dialog-handle" v-else @click="update(0)">仅更新我的商品库</span>
                <span class="submit-dialog-handle" @click="clear">取消</span>
            </template>
        </van-dialog>
        <!-- 变更信息 -->
        <van-dialog :show="popupVisiable" class="popup-info">
            <template v-slot:title>
                <span class="popup-info-title">变更信息</span>
            </template>
            <template v-slot:default>
                <div class="popup-info-content">
                    <span class="title">商品名称:</span>
                    <span class="info">{{dataStatus.goodsNameNew}}</span>
                </div>
                <div class="popup-info-content">
                    <span class="title">商品价格:</span>
                    <span class="info">{{dataStatus.guideSalePriceNew}}</span>
                </div>
            </template>
            <template v-slot:footer>
                <span class="popup-info-handle handle-active" @click="sure">确定</span>
            </template>
        </van-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Toast } from 'vant'
import { queryGoodsDetail, updateGoods, operateGoods } from '@/api/goods-library'
import { validatorNum2 } from '@/utils/vantFormValidator.js'
import { closePage, newPage } from '@/utils/composables'

const multipleHandlePopVisiable = ref(false)
const popupVisiable = ref(false)
const submitBtn = ref(true)
const goodsInfo = ref({})
const route = useRoute()
const goodsId = route.query.goodsId

const dataStatus = reactive({
    goodsName: '',
    guideSalePrice: '',
    goodsNameNew: '',
    guideSalePriceNew: ''
})
// 获取商品详情
const getGoodsInfo = async () => {
    const res = await queryGoodsDetail({ goodsId })
    console.log(res)
    if (res.code === '200') {
        goodsInfo.value = res.data
        dataStatus.goodsName = goodsInfo.value.goodsName
        dataStatus.guideSalePrice = goodsInfo.value.guideSalePrice
        dataStatus.goodsNameNew = goodsInfo.value?.goodsApproval?.goodsName
        dataStatus.guideSalePriceNew = goodsInfo.value?.goodsApproval?.guideSalePrice
        if (goodsInfo.value.goodsApproval && goodsInfo.value?.goodsApproval?.approveStatus === 1) {
            submitBtn.value = false
        } else {
            submitBtn.value = true
        }
    }
}
// 更新商品
// putOn 0->更新 1->更新并上架到设备 2->更新并上架到我的商品库
const updataGoodsInfo = async (type, putOn = 0) => {
    const params = {
        goodsId,
        goodsName: dataStatus.goodsName,
        guideSalePrice: dataStatus.guideSalePrice,
        isSkuModify: type,
        modifyName: goodsInfo.value.goodsName,
        modifyPrice: goodsInfo.value.guideSalePrice
    }
    const res = await updateGoods(params)
    if (res.code === '200') {
        if (putOn === 0) {
            setTimeout(() => {
                Toast(res.msg)
                setTimeout(() => {
                    closePage()
                }, 1500)
            }, 150)
        } else if (putOn === 1) {
            newPage(`/goodsToContainer?goodsName=${route.query.goodsName}&goodsId=${route.query.goodsId}&guideSalePrice=${route.query.guideSalePrice}&modelCodes=${route.query.modelCodes}&operateGoodsTag=1&putOn=${putOn}`, {
                goodsName: route.query.goodsName,
                goodsId: route.query.goodsId,
                guideSalePrice: route.query.guideSalePrice,
                modelCodes: route.query.modelCodes,
                operateGoodsTag: 1,
                putOn
            })
        } else if (putOn === 2) {
            const params = {
                goodsId: route.query.goodsId,
                goodsStatus: 4
            }
            const res = await operateGoods(params)
            if (res.code === '200') {
                setTimeout(() => {
                    Toast(res.msg)
                    setTimeout(() => {
                        closePage()
                    }, 1500)
                }, 150)
            }
        }
    }
}

// 提交操作
const form = ref(null)
const submit = () => {
    form.value.validate().then(() => {
        multipleHandlePopVisiable.value = true
    }).catch((error) => {
        Toast(error[0].message)
    })
}

// 更新并上架到设备
const putOnDevice = () => {
    multipleHandlePopVisiable.value = false
    updataGoodsInfo(0, 1)
}
// 同步更新
const updateTogether = () => {
    multipleHandlePopVisiable.value = false
    updataGoodsInfo(1)
}
// 更新我的商品库
const update = (putOnType) => {
    multipleHandlePopVisiable.value = false
    updataGoodsInfo(0, putOnType)
}
// 取消
const clear = () => {
    multipleHandlePopVisiable.value = false
}
// 查看变更信息
const checkUpdate = () => {
    popupVisiable.value = true
}
// 查看变更信息-确定
const sure = () => {
    popupVisiable.value = false
}
onMounted(() => {
    getGoodsInfo()
})
</script>
<style lang="scss" scoped>
.edit-content{
    padding-bottom: 0px;
    .edit-remark{
        background: #F4F5F5;
        color: #696969;
        font-size: 24px;
        line-height: 32px;
        padding: 30px;
        position: relative;
        img{
            width: 32px;
            height: 32px;
            padding-right: 24px;
            position: absolute;
            top: 30px;
            left: 30px;
        }
        span{
            display: inline-block;
            padding-left: 56px;
        }
    }
    .goods-info-box{
        background: #fff;
        padding: 0 30px;
        margin-bottom: 20px;
        .goods-info{
            // height: 112px;
            line-height: 112px;
            display: flex;
            border-bottom: 1px solid #F4F5F5;
            .title{
                display: inline-block;
                width: 200px;
            }
            .info{
                display: inline-block;
                flex: 1;
                text-align: right;
            }
            .info-check{
                color: #696969;
            }
            .remark{
                line-height: 50px;
            }
        }
    }
    .bottom{
        position: fixed;
        bottom: 56px;
        padding: 0 60px;
        width: calc(100vw - 110px);
        .btn{
            display: inline-block;
            width: 100%;
            height: 92px;
            line-height: 92px;
            background: #FE7E41;
            border-radius: 46px;
            text-align: center;
            color: #fff;
            font-size: 30px;
        }
    }
    .submit-dialog{
        .submit-dialog-content{
            display: block;
            font-size: 36px;
            color: #000;
            text-align: center;
            padding: 56px 40px;
        }
        .submit-dialog-handle{
            display: block;
            height: 100px;
            line-height: 100px;
            font-size: 36px;
            color: #191919;
            text-align: center;
            border-top: 1px solid #ededed;
        }
        .handle-active{
            color: #FE7E41;
        }
    }
    .popup-info{
        .popup-info-title{
            display: block;
            font-size: 36px;
            color: #000;
            text-align: center;
            padding-bottom: 24px;
        }
        .popup-info-content{
            font-size: 30px;
            padding: 0 40px 24px;
            display: flex;
            .title{
                width: 150px;
                color: #696969;
            }
            .info{
                flex: 1;
            }
        }
        .popup-info-handle{
            display: block;
            height: 100px;
            line-height: 100px;
            font-size: 36px;
            color: #FE7E41;
            text-align: center;
            border-top: 1px solid #ededed;
            margin-top: 12px;
        }
    }
}
.van-cell{
    padding-left: 0;
    padding-right: 0;
    border-bottom: 1px solid #F4F5F5;
    ::after {
        border: none;
    }
    .van-field__label, .van-field__value{
        font-size: 30px;
        color: #191919;
    }
}
.van-cell:after{
    border: none;
}
.van-field__body,.van-field__error-message,.van-field__control{
    text-align: right;
}
.van-field__control--min-height {
    min-height: auto;
}
</style>
