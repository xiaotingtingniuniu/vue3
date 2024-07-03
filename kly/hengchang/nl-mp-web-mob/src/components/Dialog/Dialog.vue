<template>
    <van-overlay :show="true" z-index="10001">
        <div class="overlay-dialog">
            <div class="dialog-box" @click.stop>
                <div class="close" v-if="showCloseButton"><van-icon @click="getActionHandler('close')" name="cross"/></div>
                <div class="title" v-if="title" v-html="title"></div>
                <div class="message" v-if="message">{{ message }}</div>
                <div class="button-box">
                    <van-button @click="getActionHandler('left')" class="left" v-if="showLeftButton">{{ left }}</van-button>
                    <van-button @click="getActionHandler('right')" class="right" v-if="showRightButton">{{ right }}</van-button>
                </div>
            </div>
        </div>
    </van-overlay>
</template>
<script setup name="Dialog">
const props = defineProps({
    title: {
        type: String,
        default: '标题'
    },
    message: {
        type: String,
        default: ''
    },
    left: {
        type: String,
        default: '取消'
    },
    showLeftButton: {
        type: Boolean,
        default: true
    },
    right: {
        type: String,
        default: '确认'
    },
    showRightButton: {
        type: Boolean,
        default: true
    },
    showCloseButton: {
        type: Boolean,
        default: false
    },
    beforeClose: {
        type: Function,
        default: null
    },
    onClose: {
        type: Function,
        default: () => {}
    },
    callback: {
        type: Function,
        default: () => {}
    }
})

const getActionHandler = (action) => {
    if (props.beforeClose) {
        props.beforeClose(action).then((value) => {
            if (value) return props.onClose()
        })
    } else {
        props.callback(action)
        props.onClose()
    }
}
</script>
<style lang="scss" scoped>
.overlay-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .dialog-box {
        width: 590px;
        height: auto;
        background: #FFFFFF;
        border-radius: 32px;
        position: relative;
        .close{
            position: absolute;
            right: 24px;
            top: 24px;
            z-index: 5;
        }
        .title{
            font-size: 34px;
            font-weight: bold;
            color: #2C343E;
            text-align: center;
            margin-top: 44px;
            padding: 0 24px;
        }
        .message{
            padding: 0 40px;
            font-size: 28px;
            font-weight: 300;
            color: #2C343E;
            margin-top: 12px;
            padding: 0px 30px;
            text-align: center;
        }
        .button-box{
            display: flex;
            margin: 90px auto 50px;
            justify-content: space-between;
            padding: 0 40px;
            .van-button{
                flex: 1;
                height: 80px;
                border-radius: 16px;
            }
            .left{
                border: 1px solid #CACACA;
                color: #2C343E;
                margin-right: 30px;
            }
            .right{
                background: #F16542;
                color: #FFFFFF;
                border: none;
            }
        }
    }
  }

</style>
