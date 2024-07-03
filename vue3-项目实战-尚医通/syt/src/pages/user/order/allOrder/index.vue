<template>
    <!-- 展示全部订单的结构 -->
    <el-card>
    <template #header>
      <div class="card-header">
        <span>挂号订单</span>
      </div>
    </template>
    <!-- 提供用户选择的下拉菜单 -->
    <el-form :inline="true" class="form">
        <el-form-item label="就诊人">
            <el-select placeholder="请选择就诊人" size="default" v-model="patientId" @change="changeSelectPaitent">
                <el-option label="请选择全部就诊人" value=""></el-option>
                <el-option v-for="item in allPatient" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
            <el-select placeholder="请选择订单状态" size="default" v-model="orderStatus" @change="changeSelectOrderStatus">
                <el-option label="请选择全部就诊人" value=""></el-option>
                <el-option v-for="(item,index) in allOrderStatus" :key="index" :label="item.comment" :value="item.status"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <!-- 表格展示订单数据 -->
    <el-table border class="table" :data="orderList">
        <el-table-column label="就诊时间" prop="reserveDate"></el-table-column>
        <el-table-column label="医院" prop="hosname"></el-table-column>
        <el-table-column label="科室" prop="depname"></el-table-column>
        <el-table-column label="医生" prop="title"></el-table-column>
        <el-table-column label="服务费" prop="amount"></el-table-column>
        <el-table-column label="就诊人" prop="patientName"></el-table-column>
        <el-table-column label="订单状态" prop="param.orderStatusString"></el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="text" @click="goDetail(scope.$index,scope.row)">
                    详情
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="prev, pager, next, jumper, ->, sizes,total"
      :total="total"
      @current-change="changePage"
      @size-change="changePageSize"
    />
  </el-card>
</template>

<script setup lang='ts'>
import {onMounted, ref} from 'vue'
import {GetUserOrderInforResponseData,UserOrderInforArr,AllPatientResponseData,AllPatient,OrderStatusResponseData,OrderStatusArr} from '@/api/user/type'
import {reqGetUserOrderInfor,reqAllPatient,reqOrderStatus} from '@/api/user/index'
import { useRouter } from 'vue-router';
//获取路由器对象
const $router = useRouter();
//存储当前分页器页码数
const pageNo = ref<number>(1);
//当前页码展示几条数据
const pageSize = ref<number>(10);
//收集就诊人的id
const patientId = ref<string>('');
//收集选择的某个订单状态
const orderStatus = ref<string>('');
//存储订单列表
const orderList = ref<UserOrderInforArr>([]);
//存储订单列表总个数
const total = ref<number>(0);
//存储就诊人信息
const allPatient = ref<AllPatient>([]);
//存储所有订单状态
const allOrderStatus = ref<OrderStatusArr>([]);
onMounted(()=>{
    //获取会员订单列表
    getUserOrderInfor();
    //获取就诊人
    getPatient();
    //获取订单状态
    getOrderStatus();
});
//获取会员订单列表
const getUserOrderInfor = async ()=>{
    const result:GetUserOrderInforResponseData = await reqGetUserOrderInfor(pageNo.value,pageSize.value,patientId.value,orderStatus.value);
    console.log('result',result);
    if(result.code===200){
        orderList.value = result.data.records;
        total.value = result.data.total;
    }
}
//详情按钮 跳转到订单详情
const  goDetail = ($index:any,row:any)=>{
    console.log('$index',$index);
    console.log('row',row);
    $router.push({
        path:'/user/order',
        query:{orderId:row.id}
    })
}
//修改当前页数 
const changePage = (value:number)=>{
    console.log('value',value);
    //调用获取会员订单列表接口
    getUserOrderInfor();
}
//修改当前的pageSize
const changePageSize = (value: number)=>{
    console.log('value',value);
    //调用获取会员订单列表接口
    getUserOrderInfor();
}
//获取就诊人
const getPatient = async ()=>{
    const result:AllPatientResponseData=await reqAllPatient();
    console.log('result',result);
    if(result.code===200){
        allPatient.value = result.data
    }
    console.log('allPatient',allPatient.value);
}
//获取订单状态
const getOrderStatus = async ()=>{
    const result:OrderStatusResponseData= await reqOrderStatus();
    console.log('result',result);
    if(result.code===200){
        allOrderStatus.value = result.data;
    }
    console.log('allOrderStatus',allOrderStatus.value);
}
//修改选中的就诊人时调用
const changeSelectPaitent = ()=>{
    //根据就诊人的ID获取会员订单列表
    getUserOrderInfor();
}
//修改选中的订单状态时调用
const changeSelectOrderStatus = ()=>{
    //根据订单状态获取会员订单列表
    getUserOrderInfor();
}
</script>

<style scoped lang="scss">
::v-deep .el-form-item{
    width:250px;
}
.table{
    margin:10px 0;
}
</style>