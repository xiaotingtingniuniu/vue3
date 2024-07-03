<template>
    <div>
      <!-- 使用 v-for 渲染列表，并使用 item.id 作为 key -->
      <div v-for="item in items" :key="item.id">
        {{ item.text }}
        <!-- 在每个列表项中添加一个按钮，点击时删除该项 -->
        <button @click="removeItem(item.id)">Remove</button>
      </div>
      <!-- 在列表末尾添加一个按钮，点击时添加新的列表项 -->
      <button @click="addItem">Add Item</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // 初始的列表数据
        items: [
          { id: 1, text: 'Item 1' },
          { id: 2, text: 'Item 2' },
          { id: 3, text: 'Item 3' }
        ]
      };
    },
    methods: {
      // 添加新的列表项
      addItem() {
        const newItem = { id: Date.now(), text: 'New Item' };
        this.items.push(newItem);
      },
      // 删除指定 id 的列表项
      removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
      }
    }
  };
  </script>
  