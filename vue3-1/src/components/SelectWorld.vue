<template>
  <div>
    <select v-model="selectedOptions" multiple>
      <option value="option1">选项1</option>
      <option value="option2">选项2</option>
      <option value="option3">选项3</option>
    </select>
    <p>当前选择的选项是: {{ selectedOptions }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOptions: ["option2"] // 默认选中的选项值
    };
  }
};
</script>
