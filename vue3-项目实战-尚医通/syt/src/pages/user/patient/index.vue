<template>
  <div class="patient">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>就诊人管理</span>
          <el-button type="primary" size="default" :icon="User" @click="addVisitor">添加就诊人</el-button>
        </div>
      </template>
      <!-- 就诊人管理模块-展示就诊人信息的结构 -->
      <div class="user" v-if="flag === true">
        <Visitor v-for="(item, index) in userArr" :key="item.id" class="visitor" @changeFlag="changeFlag" @updateFlag="updateFlag" :user="item"
          @click="changeIndex(index)" :index="index" :currentIndex="currentIndex" />
      </div>
      <!-- 添加就诊人/修改已有的就诊人信息的结构 -->
      <div class="from" v-else>
        <el-divider content-position="left">就诊人信息</el-divider>
        <el-form style="width: 60%;margin:10px auto" label-width="80">
          <el-form-item label="用户姓名">
            <el-input placeholder="请输入姓名" v-model="patientParams.name" />
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select placeholder="请选择证件类型" v-model="patientParams.certificatesType">
              <el-option :label="item.name" :value="item.value" v-for="item in certationArr" :key="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input placeholder="请输入证件号码" v-model="patientParams.certificatesNo" />
          </el-form-item>
          <el-form-item label="用户性别">
            <el-radio-group v-model="patientParams.sex">
              <el-radio :value="1">男</el-radio>
              <el-radio :value="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期" required>
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="请选择日期" v-model="patientParams.birthdate"
                  value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input placeholder="请输入手机号码" v-model="patientParams.phone" />
          </el-form-item>
        </el-form>
        <el-divider content-position="left">建档信息（完善后部分医院首次就诊不排队建档）</el-divider>
        <el-form style="width: 60%;margin:10px auto" label-width="80">
          <el-form-item label="婚姻状况">
            <el-radio-group v-model="patientParams.isMarry">
              <el-radio :value="1">未婚</el-radio>
              <el-radio :value="0">已婚</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自费/医保" label-width="86px">
            <el-radio-group v-model="patientParams.isInsure">
              <el-radio :value="1">自费</el-radio>
              <el-radio :value="0">医保</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="当前住址">
            <el-cascader :props="props" v-model="patientParams.addressSelected" />
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input placeholder="请输入用户详细地址" v-model="patientParams.address" />
          </el-form-item>
        </el-form>
        <el-divider content-position="left">联系人信息（选填）</el-divider>
        <el-form style="width: 60%;margin:10px auto" label-width="80">
          <el-form-item label="用户姓名">
            <el-input placeholder="请输入姓名" v-model="patientParams.contactsName" />
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select placeholder="请选择证件类型" v-model="patientParams.contactsCertificatesType">
              <el-option :label="item.name" :value="item.value" v-for="item in certationArr" :key="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input placeholder="请输入证件号码" v-model="patientParams.contactsCertificatesNo" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input placeholder="请输入手机号码" v-model="patientParams.contactsPhone" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="default" @click="submit">提交</el-button>
            <el-button type="primary" size="default" @click="reset">重写</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { User } from '@element-plus/icons-vue'
//引入获取某一账号下就诊人信息接口
import { reqAllPatient, reqCertationType, reqCity, reqAddOrUpdatePatient } from '@/api/user/index'
import { onMounted, ref, reactive,watch } from 'vue'
import { AllPatientResponseData, AllPatient, CertationTypeResponseData, CertationArr, AddOrUpdatePatient } from '@/api/user/type'
import { CascaderProps, ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
//定义一个响应式数据：决定卡片的身体部分的展示内容
let flag = ref<boolean>(true);
//存储就诊人信息
let userArr = ref<AllPatient>([]);
//存储用户确定就诊人索引值
const currentIndex = ref<number>(-1);
//存储证件类型的数据
let certationArr = ref<CertationArr>([]);
//获取路由对象
const $route = useRoute();
//获取路由器对象
const $router = useRouter();
//收集新增就诊人的数据
const patientParams = reactive<AddOrUpdatePatient>({
  name: '',
  certificatesType: '',
  certificatesNo: '',
  sex: 0,
  birthdate: '',
  phone: '',
  isMarry: 0,
  isInsure: 0,
  addressSelected: [],
  address: '',
  contactsName: '',
  contactsCertificatesType: '',
  contactsCertificatesNo: '',
  contactsPhone: ''
})
onMounted(()=> {
  //获取就诊人信息
  getUser();
  //获取证件类型
  getCertationType();
  //判断是路由上有type字段（表示应该跳转到新增或者修改就诊人信息页面）
  if ($route.query.type === 'add'||$route.query.type === 'edit') {
    flag.value = false;
  }
})
//获取就诊人信息
const getUser = async () => {
  const result: AllPatientResponseData = await reqAllPatient();
  console.log('result', result);
  if (result.code === 200) {
    userArr.value = result.data;
  }
}
//点击按钮添加就诊人
const addVisitor = () => {
  flag.value = false;
}
//清空数据
const reset = () => {
  Object.assign(patientParams, {
    id:null,
    name: '',
    certificatesType: '',
    certificatesNo: '',
    sex: 0,
    birthdate: '',
    phone: '',
    isMarry: 0,
    isInsure: 0,
    addressSelected: [],
    address: '',
    contactsName: '',
    contactsCertificatesType: '',
    contactsCertificatesNo: '',
    contactsPhone: ''
  })
}

//就诊人子组件的自定义事件的回调
const changeFlag = (user: AddOrUpdatePatient) => {
  console.log('user', user);
  //收集已有的就诊人信息
  Object.assign(patientParams, user);
  flag.value = false;
}
//删除就诊人数据的自定义事件的回调
const updateFlag = ()=>{
  //重新获取就诊人信息
  getUser();
}
//修改就诊人的索引值
const changeIndex = (index: number) => {
  currentIndex.value = index;
}
//获取证件类型
const getCertationType = async () => {
  const result: CertationTypeResponseData = await reqCertationType();
  console.log('result', result);
  if (result.code === 200) {
    certationArr.value = result.data;
  }
  console.log('certationArr', certationArr.value);
}
//级联选择器数据
const props: CascaderProps = {
  lazy: true,//懒加载
  //加载级联选择器数据的方法
  async lazyLoad(node: any, resolve) {
    console.log('node.data.id', node.data.id);
    let result: any = await reqCity(node.data.id || "86");
    console.log('result', result);
    if (result.code === 200) {
      const showData = result.data.map((item: any) => {
        console.log(item);
        return {
          id: item.id,
          label: item.name,
          value: item.value,
          leaf: !item.hasChildren
        }
      });
      console.log('showData', showData);
      //注入组件需要展示的数据
      resolve(showData);
    }

  }
}
//提交按钮
const submit = async () => {
  try {
    //要么新增就诊人成功｜要么更新已有就诊人成功
    await reqAddOrUpdatePatient(patientParams);
    ElMessage({
      type: 'success',
      message: patientParams.id ? '更新成功' : '新增成功'
    });
    //提交按钮时判断是不是从预约挂号页面来的
    if ($route.query.type) {
      //如果有type字段则返回原来的页面
      $router.back();
    } else {
      // 切换场景为flag:true
      flag.value = true;
    }
    //在获取全部的就诊人信息
    getUser();
    //清空上一次的数据
    reset();
  } catch (error) {
    ElMessage({
      type: 'error',
      message: patientParams.id ? '更新失败' : '新增失败'
    })
  }
}
//监听全部就诊人的数据
watch(userArr,(newValue, oldValue)=>{
	console.log(`新值:${newValue} ——— 老值:${oldValue}`)
  if($route.query.type=='edit'){
    let user = userArr.value.find((item:any)=>{
      return item.id===Number($route.query.id)
    });
    console.log('user',user);
    Object.assign(patientParams,user);
  }
})
</script>

<style scoped lang="scss">
.patient {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user {
    display: flex;
    flex-wrap: wrap;

    .visitor {
      width: 32%;
      margin: 5px;
    }
  }
}
</style>