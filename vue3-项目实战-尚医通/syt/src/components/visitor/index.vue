<template>
    <div class="visitor">
        <div class="top">
            <div class="left">
                <span class="free">{{ user.isInsure === 0 ? "自费" : "医保" }}</span>
                <span class="username">{{ user.name }}</span>
            </div>
            <div class="right">
                <el-button type="primary" size="default" :icon="Edit" circle @click="handler"></el-button>
                <el-popconfirm :title="`你确定要删除${user.name}`" @confirm="removePaitent" width="200">
                    <template #reference>
                        <el-button v-if="$route.path === '/user/patient'" type="danger" size="default" :icon="Delete" circle></el-button>
                    </template>
                </el-popconfirm>
            </div>
        </div>
        <div class="bottom">
            <p>证件类型：{{ user.param.certificatesTypeString }}</p>
            <p>证件号码：{{ user.certificatesNo }}</p>
            <p>用户性别：{{ user.sex === 0 ? '女士' : '男士' }}</p>
            <p>出生日期：{{ user.birthdate }}</p>
            <p>手机号码：{{ user.phone }}</p>
            <p>婚姻状况：{{ user.isMerry === 0 ? '未婚' : '已婚' }}</p>
            <p>当前住址：{{ user.param.cityString }}</p>
            <p>详细地址：{{ user.param.fullAddress }}</p>
            <!-- 红色的已经选择的盒子 -->
            <transition name="confirm">
                <div class="confirm" v-if="index === currentIndex">
                    已选择
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { Edit, Delete } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router'
import { reqRemovePatient } from '@/api/user/index'
import { ElMessage } from 'element-plus';
let $emit = defineEmits(['changeFlag','updateFlag']);
//获取路由对象
const $route = useRoute();
//获取路由器对象
const $router = useRouter();
console.log('$route', $route);
//接受父组件传递过来的就诊人信息并展示
const props = defineProps(['user', 'index', 'currentIndex']);
//相应就诊人组件修改按钮的回调
const handler = () => {
    //要么是就诊人管理模块点击修改按钮
    //要么是预约挂号模块点击修改按钮
    if ($route.path === '/user/patient') {
        //就诊人管理模块点击修改按钮
        $emit('changeFlag', props.user);
    } else if ($route.path === '/hospital/register_step2') {
        //预约挂号模块点击修改按钮
        // 跳转路由
        $router.push({ path: '/user/patient', query: { type: 'edit', id: props.user.id } })
    }

}
//点击删除按钮
const removePaitent = async () => {
    console.log(1111, props.user.id);
    //删除就诊人信息
    try {
        await reqRemovePatient(props.user.id);
        ElMessage({
            type:'success',
            message:'删除成功'
        })
    } catch (error) {
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
    //当删除成功时，更新数据
    $emit('updateFlag');
}

</script>

<style scoped lang="scss">
.visitor {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);

    .top {
        height: 60px;
        background: #e5e5e5;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .left {
            width: 200px;
        }

        .free {
            background: #fff;
            padding: 5px;
            font-size: 12px;
            margin-right: 5px;
            border-radius: 10px;
        }

        .username {
            color: #7f7f7f;
        }
    }

    .bottom {
        padding: 20px;
        position: relative;

        p {
            line-height: 40px;
        }

        .confirm {
            position: absolute;
            width: 200px;
            height: 200px;
            color: red;
            border-radius: 50%;
            border: 1px dashed red;
            text-align: center;
            line-height: 200px;
            left: 50%;
            top: 50%;
            margin-left: -100px;
            margin-top: -100px;
            opacity: 0.5;
            transform: rotate(35deg);
            font-weight: 900;
        }

        //过渡动画
        .confirm-enter-from {
            transform: scale(1);
        }

        .confirm-enter-active {
            transition: all .3s;
        }

        .confirm-enter-to {
            transform: scale(1.2);
        }
    }
}
</style>