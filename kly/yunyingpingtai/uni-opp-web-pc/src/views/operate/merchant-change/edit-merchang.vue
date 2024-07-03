<template>
    <div class='edit-merchang'>
        <el-tabs  v-model="activeName" type="border-card" @tab-change="handleClick">
            <el-tab-pane label="智能货柜-货柜主" name="货柜主" >
                <div>
                    <counter-list  :title = "title"></counter-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="智能货柜-厂商" name="厂商">
                <div>
                    <counter-list :title = "title"></counter-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="智能货柜-门店主" name="门店主">
                <div>
                    <counter-list  :title = "title"></counter-list>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref } from 'vue'
import counterList from './tabs/counter'

const dataState = reactive({
    title: '',
    passwordForm: {}
})
const { title } = toRefs(dataState)

const activeName = ref('货柜主')
dataState.title = activeName.value
const handleClick = (tab, e) => {
    dataState.title = activeName.value
}

</script>
