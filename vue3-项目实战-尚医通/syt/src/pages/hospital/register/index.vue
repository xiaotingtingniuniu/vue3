<template>
    <div class="register">
        <div class="top">
            <div class="title">{{ hospitalStore.hospitalInfo.hospital?.hosname }}</div>
            <div class="level">
                <i class="iconfont icon-dianzan"></i>
                <span>{{ hospitalStore.hospitalInfo.hospital?.param.hostypeString }}</span>
            </div>
        </div>
        <!-- 展示内容区域 -->
        <div class="content">
            <div class="left">
                <img :src="`data:image/ipeg;base64,${hospitalStore.hospitalInfo.hospital?.logoData}`" alt="">
            </div>
            <div class="right">
                <div>
                    挂号规则
                </div>
                <div class="time">
                    <span>预约周期：10天</span>
                    <span>放号时间：{{ hospitalStore.hospitalInfo.bookingRule?.releaseTime }}</span>
                    <span>停挂事件：{{ hospitalStore.hospitalInfo.bookingRule?.stopTime }}</span>
                </div>
                <div class="address">
                    具体地址：{{ hospitalStore.hospitalInfo.hospital?.param.fullAddress }}
                </div>
                <div class="route">
                    具体路线：{{ hospitalStore.hospitalInfo.hospital?.route }}
                </div>
                <div class="quittime">
                    退号时间：就诊前一工作日{{ hospitalStore.hospitalInfo.bookingRule?.quitTime }}前取消
                </div>
                <div class="rule">
                    预约挂号规则
                </div>
                <div class="ruleInfo" v-for="(item, index) in hospitalStore.hospitalInfo.bookingRule?.rule" :key="index">
                    {{ item }}
                </div>
            </div>
        </div>
        <!-- 每一个医院的科室的数据 -->
        <div class="department">
            <el-tabs tab-position="left" class="demo-tabs">
                <el-tab-pane :label="item.depname" v-for="(item, index) in hospitalStore.hospitalDepartment" :key="index">
                    <div class="tab_content">
                        <h1 class="top">
                            {{ item.depname }}
                        </h1>
                        <ul class="smallDepartment">
                            <li @click="showLogin(smallDepartment)" v-for="smallDepartment in item.children" :key="smallDepartment.depcode">
                                <span>{{ smallDepartment.depname }}</span>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup lang='ts'>
import '@/style/icon.scss'
// 引入医院详情仓库数据
import useDetailStore from '@/store/modules/hospitalDetail'
import { useRouter,useRoute } from 'vue-router'; 
//引入用户信息仓库数据
// import useUserStore from '@/store/modules/user'
//获取医院详情仓库数据
const hospitalStore = useDetailStore();
//获取用户信息仓库数据
// const userStore = useUserStore();

//获取路由器对象
const $router = useRouter();
//获取路由对象
const $route = useRoute();
//点击科室按钮，让login弹框弹出
const showLogin = (smallDepartment:any) => {
    //让登录对话框弹出来
    // userStore.dialogFormVisible = true;
    //点击某一个医院科室按钮，进入到相应的预约挂号详情页面

    //smallDepartment即为用户选中科室的数据
    console.log('smallDepartment',smallDepartment);
    //跳转到预约挂号页面
    console.log('query',$route.query);
    $router.push({path:'/hospital/register_step1',query:{hoscode:$route.query.hoscode,depcode:smallDepartment.depcode}})
}
</script>

<style scoped lang="scss">
.register {
    .top {
        display: flex;

        .title {
            font-size: 30px;
            line-height: 40px;
            font-weight: 900;
        }

        .level {
            color: #7f7f7f;
            margin-left: 10px;
            height: 40px;
            text-align: center;
            line-height: 40px;

            span {
                margin-left: 5px;
            }
        }
    }

    .content {
        display: flex;
        flex-direction: row;
        margin-top: 20px;

        .left {
            width: 80px;
            height: 80px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .right {
            flex: 1;
            font-size: 14px;
            margin-left: 10px;

            .time,
            .address,
            .route,
            .quittime,
            .ruleInfo {
                margin-top: 10px;
                color: #7f7f7f;

                span:nth-child(2) {
                    margin-left: 5px;
                    margin-right: 5px;
                }
            }

            .route {
                line-height: 23px;
            }

            .rule {
                margin: 10px 0;
            }
        }
    }

    .department {
        width: 100%;
        margin-top: 50px;

        .demo-tabs {
            .tab_content {
                .top {
                    font-size: 25px;
                    background: rgb(248, 248, 248);
                    color: #7f7f7f;
                }

                ul {
                    display: flex;
                    flex-wrap: wrap;
                    color: #7f7f7f;
                    margin-top: 10px;

                    li {
                        width: 33%;
                        padding: 10px 10px;
                        box-sizing: border-box;
                    }
                }
            }
        }


    }
}

//深度选择器
::v-deep(.el-tabs__nav-scroll) {
    /* 你的样式代码 */
    background: rgb(248, 248, 248);
}

::v-deep(.el-tabs__item.is-active) {
    color: red;
}

::v-deep(.el-tabs__active-bar) {
    background-color: red;
}

::v-deep(.el-tab-pane) {
    display: block;
}</style>