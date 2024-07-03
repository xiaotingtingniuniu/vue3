<template>
    <van-overlay :show="visible">
        <div class="overlay-dialog">
            <div class="dialog-box" @click.stop>
                <div class="close" v-if="close"><van-icon @click="closeClick" name="cross" /></div>
                <div class="title" v-if="title" v-html="title"></div>
                <div class="content" v-if="content">{{ content }}</div>
                <div class="button-box">
                    <van-button @click="leftClick" class="left" v-if="left">{{ left }}</van-button>
                    <van-button @click="rightClick" class="right" v-if="right">{{ right }}</van-button>
                </div>
            </div>
        </div>
    </van-overlay>
</template>
<script setup>
const props = defineProps(['visible', 'title', 'content', 'left', 'right', 'close'])
const emit = defineEmits(['rightClick', 'leftClick', 'closeClick'])

const visible = ref()
const rightClick = () => emit('rightClick')
const leftClick = () => emit('leftClick')
const closeClick = () => emit('closeClick')

watchEffect(() => (visible.value = props.visible))
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
        .content{
            font-size: 28px;
            font-weight: 300;
            color: #2C343E;
            margin-top: 12px;
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
