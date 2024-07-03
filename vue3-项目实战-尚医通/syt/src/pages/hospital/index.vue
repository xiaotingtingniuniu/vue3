<template>
    <div class="hospital">
        <!-- 左侧导航区域   -->
        <div class="menu">
            <div class="top">
                <el-icon>
                    <HomeFilled />
                </el-icon>
                <span>/医院信息</span>
            </div>
            <div class="content">
                <el-menu :default-active="`${$route.path}?hoscode=${$route.query.hoscode}`" class="el-menu-vertical-demo"
                    :router="true">
                    <el-menu-item :index="`/hospital/register?hoscode=${$route.query.hoscode}`">
                        <el-icon>
                            <Calendar />
                        </el-icon>
                        <span>预约挂号</span>
                    </el-menu-item>
                    <el-menu-item :index="`/hospital/detail?hoscode=${$route.query.hoscode}`">
                        <el-icon>
                            <document />
                        </el-icon>
                        <span>医院详情</span>
                    </el-menu-item>
                    <el-menu-item :index="`/hospital/notice?hoscode=${$route.query.hoscode}`">
                        <el-icon>
                            <Bell />
                        </el-icon>
                        <span>预约须知</span>
                    </el-menu-item>
                    <el-menu-item :index="`/hospital/close?hoscode=${$route.query.hoscode}`">
                        <el-icon>
                            <Warning />
                        </el-icon>
                        <span>停诊信息</span>
                    </el-menu-item>
                    <el-menu-item :index="`/hospital/search?hoscode=${$route.query.hoscode}`">
                        <el-icon>
                            <Search />
                        </el-icon>
                        <span>查询/取消</span>
                    </el-menu-item>
                </el-menu>
            </div>

        </div>
        <!-- 右侧内容展示区域：路由组件展示位置 -->
        <div class="hospital_content">
            <!-- 子组件展示结构的地方 -->
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang='ts'>
// 左侧菜单需要用到的图标
import {
    Document,
    Calendar,
    Bell,
    Warning,
    Search,
    HomeFilled
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import useDetailStore from '@/store/modules/hospitalDetail.ts'
//获取仓库对象
let detailStore = useDetailStore();
//获取当前路由信息
const $route = useRoute();
console.log('route', $route);
//组件挂载完毕：通知pinia仓库发送请求获取医院详情的数据，存储到仓库中
onMounted(() => {
    console.log('detailStore', detailStore);
    //获取医院详情的数据
    detailStore.getHospital(<string>$route.query.hoscode);
    //获取某个医院科室的数据
    detailStore.getHospitalDepartment(<string>$route.query.hoscode);
});
</script>

<style scoped lang="scss">
.hospital {
    display: flex;
    flex-direction: row;
    .menu {
        display: flex;
        flex:1;
        flex-direction: column;
        align-items: center;
        .top {
            color: #7f7f7f;
            display: flex;
            flex-direction: row;
        }
        .content{
            display: flex;
        }
    }

    .hospital_content {
        flex: 9;
        margin-left:50px;
    }
}</style>