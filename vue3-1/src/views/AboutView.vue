<template>
  <div class="about">
    <h1>{{ ageRange }}</h1>
    <input type="text" placeholder="请输入密码">
    <input type="checkbox" name="hu" :checked="isChecked">
    <div v-html="htmlContent"></div>
    <div v-for="item in items" :key="item.id">
      <!-- 内容 -->
      {{ item.name }}
    </div>
    <div v-for="(value, key, index) in myObject" :key="index">
      {{ index }} - {{ key }} - {{ value }}
    </div>
    <KeyWorld />
    <input type="text" :value="text" @input="event => text = event.target.value">
    <p>{{ text }}</p>
    <input type="text" v-model="text1">
    <p>{{ text1 }}</p>
    <div>
      <input type="checkbox" id="checkbox" v-model="checked" />
      <label for="checkbox">{{ checked }}</label>
    </div>
    <!-- 选择器 -->
    <div>
      selectedList:{{ selectedList }}
    </div>
    <select name="chooseName" v-model="selectedList" multiple>
      <option disabled value="option0">Please select one</option>
      <option value="option1">A</option>
      <option value="option2" selected>B</option>
      <option value="option3">C</option>
      <option value="option4">D</option>
    </select>
    <SelectWorld />
    <div class="father-box">
      <button @click="updateChildData">父组件按钮传数据给子组件</button>
      <button @click="updateFatherData">给父组件更新数据按钮</button>
      <p>Parent Component{{ fatherData }}</p>
      <UpdateWorld :parentData="parentData" @update-parent-data="handleUpdate"/>
    </div>
    <ErrorWorld />
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>
<style>
.father-box{
  width:400px;
  height: 400px;
  background-color: yellow;
}
</style>
<script setup>
import { reactive, computed, ref, getCurrentInstance, onBeforeUpdate, onUpdated,onErrorCaptured } from 'vue';
import KeyWorld from '@/components/KeyWorld.vue';
import SelectWorld from "@/components/SelectWorld.vue";
import UpdateWorld from '@/components/UpdateWorld.vue';
import ErrorWorld from '@/components/ErrorWorld.vue';
//获取当前组件的实例对象
const { proxy } = getCurrentInstance();
console.log(getCurrentInstance());
//通过当前的实例对象来获取全局属性
const $appName = proxy.$appName;
console.log($appName);
// 定义一个嵌套结构的响应式对象
const state = reactive({
  user: {
    name: 'John',
    age: 30,
    address: {
      city: 'New York',
      country: 'USA'
    }
  },
  products: [
    { id: 1, name: 'Product 1', price: 20 },
    { id: 2, name: 'Product 2', price: 30 },
    { id: 3, name: 'Product 3', price: 25 }
  ],
  isChecked: false
});
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
});
const items = ref([
  {
    name: "zhangsan",
    age: 11,
    id: 0
  },
  {
    name: "lisi",
    age: 22,
    id: 1
  }
]);
const htmlContent = ref('<p>这里是一个p标签</p>');
const text = ref('');
const text1 = ref('');
const checked = ref(true);
//选择器
const selectedList = ref([]);

//传给子组件的数据
const parentData = ref('父组件数据');
//父组件的数据
const fatherData = ref('我是父组件的数据');

//错误提示
const errorMessage = ref('');
// // 定义一个计算属性，计算用户的年龄段
const ageRange = computed(() => {
  if (state.user.age < 18) {
    return 'Underage';
  } else if (state.user.age >= 18 && state.user.age <= 60) {
    return 'Adult';
  } else {
    return 'Senior';
  }
});

// // 修改响应式对象的值
state.user.name = 'Alice';

//修改子组件内的数据
const updateChildData=()=>{
  parentData.value = '给子组件传的新数据';
  console.log('parentData.value',parentData.value);
}
//修改父组件内的数据
const updateFatherData = ()=>{
  fatherData.value = "父组件自己修改了父组件的数据";
}
// 处理子组件触发的 update 事件
const handleUpdate = (newData) => {
  // 在父组件中修改数据
  parentData.value = newData;
};
onBeforeUpdate(() => {
  console.log('这里是父组件的onBeforeUpdate函数');
});
onUpdated(() => {
  console.log('这里是父组件的onUpdated函数');
});
const childError = (error)=>{
  //添加错误提示语
  errorMessage.value = error.message;
};
//截取错误勾子函数
onErrorCaptured((error)=>{
  childError(error);
});
</script>
