<template>
    <el-row>
        <el-col :span="3" :offset="0">
            <el-link href="http://wiki.hengchang6.com/pages/viewpage.action?pageId=99356210" target="_blank" type="danger" style="font-weight: bolder">注：运营平台接口使用说明</el-link>
        </el-col>
        <el-col :span="3" :offset="0">
            <el-link href="http://wiki.hengchang6.com/pages/viewpage.action?pageId=99355540" target="_blank" type="danger" style="font-weight: bolder">运营平台接口配置说明</el-link>
        </el-col>
    </el-row>
    <el-tabs v-model="activeName">
        <el-tab-pane label="版本管理" name="first">
            <UrlConfigPrjList v-if="activeName === 'first' || activeName === 'second'"></UrlConfigPrjList>
        </el-tab-pane>
        <el-tab-pane label="接口配置" name="second" lazy>
            <UrlConfigList v-if="activeName === 'first' || activeName === 'second'"></UrlConfigList>
        </el-tab-pane>
        <el-tab-pane label="商户后台接口配置" name="third" lazy>
            <MerchantUrlConfigList v-if="activeName === 'third' || activeName === 'fourth' || activeName === 'fifth'"></MerchantUrlConfigList>
        </el-tab-pane>
        <el-tab-pane label="商户后台接口版本管理" name="fourth" lazy>
            <MerchantUrlConfigPrjList v-if="activeName === 'third' || activeName === 'fourth' || activeName === 'fifth'"></MerchantUrlConfigPrjList>
        </el-tab-pane>
        <el-tab-pane label="商户后台字典管理" name="fifth" lazy>
            <MerchantDictList v-if="activeName === 'third' || activeName === 'fourth' || activeName === 'fifth'"></MerchantDictList>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import UrlConfigList from './url-config-list.vue'
import MerchantUrlConfigList from './guizhu-url-config-list.vue'
import UrlConfigPrjList from './url-config-prjctl.vue'
import MerchantUrlConfigPrjList from './guizhu-url-config-prjctl.vue'
import MerchantDictList from './guizhu-url-config-dict.vue'

export default {
    components: {
        UrlConfigList,
        UrlConfigPrjList,
        MerchantUrlConfigList,
        MerchantUrlConfigPrjList,
        MerchantDictList
    },
    data () {
        return {
            activeName: 'first'
        }
    }
}
</script>
<style lang="scss" scoped>
    .el-row {
        margin-bottom: 20px;
    }
    .register-user-list-page {
        .box-card {
            border: initial;

            .search-area {
                .el-form {
                    .el-form-item {
                        width: 250px;
                    }

                    // .form-item-time{
                    //     width: 535px;
                    //     // :deep(.el-date-editor){
                    //     //     flex: 1;
                    //     // }
                    // }
                    .button-box {
                        width: 100%;

                        .el-button {
                            border: initial;
                        }
                    }
                }
            }

            .page-area {
                display: flex;
                justify-content: center;
            }
        }
    }
</style>
