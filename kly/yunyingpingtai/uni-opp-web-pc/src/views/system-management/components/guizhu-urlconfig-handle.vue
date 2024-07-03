<template>
    <div class='submit-box'>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
            <el-form-item label="配置编号" prop="configCode" :rules="rules.configCode" v-if="handleType === 'edit'">
                <el-input class="form-action-item-50w" v-model="ruleForm.configCode" clearable :disabled="canNotEdit"/>
            </el-form-item>
            <el-row>
                <el-form-item label="所属中台" prop="sourceFlag" :rules="rules.selectRule">
                    <el-select class="form-action-item-50w" v-model="ruleForm.sourceFlag" clearable placeholder="请选择">
                        <el-option label="用户中台" value="user" />
                        <el-option label="商户中台" value="merchant" />
                        <el-option label="营销中台" value="marketing" />
                        <el-option label="权限中台" value="permission" />
                        <el-option label="订单中台" value="order" />
                        <el-option label="支付中台" value="pay" />
                        <el-option label="设备中台" value="machine" />
                        <el-option label="库存中台" value="stock" />
                        <el-option label="商品中台" value="goods" />
                        <el-option label="商品搜索中台" value="goods-search" />
                        <el-option label="资源位中台" value="resource" />
                        <el-option label="价格中台" value="price" />
                        <el-option label="运单中台" value="waybill" />
                        <el-option label="工单中台" value="smp" />
                        <el-option label="结算中台" value="commission" />
                        <el-option label="账户中台" value="account" />
                        <el-option label="分销系统" value="distribution" />
                        <el-option label="运营后台" value="uo" />
                        <el-option label="商家后台" value="guizhu_merchant" />
                        <el-option label="核销中台" value="peacock" />
                        <el-option label="恒生活众包" value="salesman" />
                        <el-option label="推广系统" value="dandelion" />
                        <el-option label="OMS系统" value="oms" />
                        <el-option label="采销系统" value="purchase" />
                    </el-select>
                </el-form-item>
                <el-form-item label="请求类型" prop="reqType">
                    <el-select class="form-action-item-50w" v-model="ruleForm.reqType" clearable placeholder="请选择">
                        <el-option label="GET" value="1" />
                        <el-option label="POST" value="2" />
                        <el-option label="PUT" value="3" />
                        <el-option label="DELETE" value="4" />
                    </el-select>
                </el-form-item>
                <el-form-item label="接口类型" prop="configType">
                    <el-select class="form-action-item-50w" v-model="ruleForm.configType" clearable placeholder="请选择">
                        <el-option label="透传接口" value="1" />
                        <el-option label="聚合接口" value="2" />
                    </el-select>
                </el-form-item>
            </el-row>
            <el-form-item label="名称" prop="name" :rules="rules.name">
                <el-input class="form-action-item-50w" v-model="ruleForm.name" placeholder="最多输入20字符长度" clearable/>
            </el-form-item>
            <el-form-item label="接口地址" prop="url" :rules="rules.url">
                <el-input class="form-action-item-50w" v-model="ruleForm.url" placeholder="最多输入50字符长度" clearable/>
            </el-form-item>
            <el-form-item label="restful参数" prop="restfulParam" :rules="rules.restfulParam">
                <el-input class="form-action-item-50w" v-model="ruleForm.restfulParam" placeholder="restful接口参数名，以‘,’分割" clearable/>
            </el-form-item>
            <el-form-item label="数据源" prop="dataSourceType" v-if="false">
                <el-select class="form-action-item-50w" v-model="ruleForm.dataSourceType" clearable placeholder="请选择">
                    <el-option label="接口" value="0" />
                    <el-option label="ES" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status" v-if="false">
                <el-select class="form-action-item-50w" v-model="ruleForm.status" clearable placeholder="请选择">
                    <el-option label="已上线" value="1" />
                    <el-option label="未上线" value="0" />
                </el-select>
            </el-form-item>
            <el-row>
                <el-form-item label="接口负责人" prop="creatorId" :rules="rules.creatorId">
                    <el-input class="form-action-item-50w" v-model="ruleForm.creatorId" placeholder="中台接口负责人" clearable/>
                </el-form-item>
                <el-form-item label="接口修改人" prop="modifierId" :rules="rules.modifierId">
                    <el-input class="form-action-item-50w" v-model="ruleForm.modifierId" placeholder="如果对接口的返回值无修改:中台接口负责人" clearable/>
                </el-form-item>
                <el-form-item label="项目" prop="projectVersion" :rules="rules.projectVersion">
                    <el-input class="form-action-item-50w" v-model="ruleForm.projectVersion"  clearable/>
                </el-form-item>
            </el-row>
            <el-form-item label="文档" prop="docApi" :rules="rules.docApi">
                <el-input class="form-action-item-50w" v-model="ruleForm.docApi"  clearable/>
            </el-form-item>
        </el-form>
        <el-card shadow="always" v-if="ruleForm.configType === '1'">
            <template #header>
                <span>请求配置参数</span>
                <el-button @click="pop('权限条件', 'limit', 1, ruleForm.inputConfig, false)" style="float: right">新增权限条件</el-button>
            </template>
            <el-form-item
                v-for="(limitValue, limitKey) in ruleForm.inputConfig.limit"
                :label="limitKey "
                :key="limitKey"
                :prop="limitKey"
            >
                <el-input v-model="ruleForm.inputConfig.limit[limitKey]" :style="{width:getInputWidth(limitValue)}"></el-input>
                <el-button @click.prevent="removeProp('limit', 1, limitKey, limitValue, ruleForm.inputConfig, true)">删除权限条件</el-button>
            </el-form-item>
        </el-card>
        <br>
        <el-card shadow="always" v-if="ruleForm.configType === '1'">
            <template #header>
                <span>请求固定参数</span>
                <el-button @click="pop('固定参数', 'fixedBody', 1, ruleForm.inputConfig, false)" style="float: right">新增固定参数</el-button>
            </template>
            <el-form-item
                v-for="(fixedValue, fixedKey) in ruleForm.inputConfig.fixedBody"
                :label=" fixedKey "
                :key="fixedKey"
                :prop="fixedKey"
            >
                <el-input v-model="ruleForm.inputConfig.fixedBody[fixedKey]" :style="{width:getInputWidth(fixedValue)}"></el-input>
                <el-button @click.prevent="removeProp('fixedBody', 1, fixedKey, fixedValue, ruleForm.inputConfig, true)">删除固定参数</el-button>
            </el-form-item>
        </el-card>
        <el-card v-if="ruleForm.configType === '2'">
            <template #header>
                <span>SETP-串行请求(flows)</span>
                <el-button @click="addStep()" style="float: right">新增STEP</el-button>
            </template>
            <el-tabs tab-position='left' v-model="tabObjDef.activeName" stretch>
                <el-tab-pane label="SETPS: " disabled></el-tab-pane>
                <el-tab-pane
                    v-for="(flow, flowIndex) in ruleForm.inputConfig.flows"
                    :key="flowIndex"
                    :label="'STEP_' + (flowIndex + 1)"
                    :name="'STEP' + (flowIndex + 1)"
                >
                    <template #label>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="getTabDesc(flow)"
                            placement="right"
                            raw-content
                        >
                            <el-badge :value="flow.requests.length" class="item">{{ 'STEP_' + (flowIndex + 1) }}</el-badge>
                        </el-tooltip>
                    </template>
                    <el-card shadow="always">
                        <template #header>
                            <span>name: {{ flow.name }}</span><br>
                            <span>【一组请求】 (可使用name做为jsonpath的取值路径) </span><br>
                            <span>(暂不支持并发，parallelStream使用CurrentUser中的ThreadLocal有问题，待解决)</span>
                            <el-button @click="popRequestDialog(flow, flowIndex)" style="float: right">新增REQUEST</el-button>
                            <el-button @click="removeStep(flowIndex)" style="float: right">删除STEP</el-button>
                        </template>
                        <el-card
                            v-for="(request, requestIndex) in flow.requests"
                            :key="request.name"
                            :prop="request.name"
                        >
                            <template #header>
                                <span>REQUEST{{ requestIndex + 1}}</span><br><br>
                                <span>name: {{ request.name }}</span><br>
                                <span>当前节点jsonpath路径：{{ flow.name }}.{{ request.name }}</span><br>
                                <span>【一次请求】configCode:
                                    <el-tooltip class="item" effect="dark" :content="configDesc[request.configCode]" placement="right">
                                        <el-button @click="getsingleDataByConfigCode(request.configCode)">{{ request.configCode }}</el-button>
                                    </el-tooltip>
                                    <el-button>
                                        <a :href="configDocApi[request.configCode]" target="_blank" style="text-decoration: none">
                                            查看文档
                                        </a>
                                    </el-button>
                                </span>
                                <br>
                                <span>【报错是否终于流程】isStop: {{ request.isStop }} | false
                                    <el-switch
                                        v-model="request.isStop"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949">
                                    </el-switch>true
                                </span>
                                <br>
                                <span>【请求参数】useConfigParmas: {{ request.useConfigParmas }} | 使用客户端参数.body+配置参数
                                    <el-switch
                                        v-model="request.useConfigParmas"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949">
                                    </el-switch>仅使用配置参数
                                </span>
                                <br>
                                <el-button @click="removeRequest(flow, requestIndex)" style="float: right">删除REQUEST</el-button>
                                <el-button v-if="jsonContainerIsNull(request.response)" @click="pop('返回值配置', 'response', 1, request, false)" style="float: right">新增返回值配置</el-button>
                                <el-button v-if="jsonContainerIsNull(request.fixedBody)" @click="pop('请求参数固定值配置', 'fixedBody', 1, request, false)" style="float: right">新增请求参数固定值配置</el-button>
                                <el-button v-if="jsonContainerIsNull(request.body)" @click="pop('请求参数配置', 'body', 1, request, true)" style="float: right">新增请求参数配置</el-button>
                                <el-button v-if="arrayContainerIsNull(request.conditionResp)" @click="addConditionResp(request)" style="float: right">新增判断条件配置</el-button>
                                <el-button v-if="arrayContainerIsNull(request.conditions)" @click="addCondition(request)" style="float: right">新增请求条件配置</el-button>
                            </template>
                            <el-card v-if="arrayContainerIsNotNull(request.conditions)">
                                <template #header>
                                    <span>可请求条件配置，仅做if判断，无返回值(存储路径: flows[*].requests[*].conditions)</span><br>
                                    <el-button @click="addCondition(request)" style="float: right">新增请求条件配置</el-button>
                                </template>
                                <el-form-item
                                    v-for="(condition, index) in request.conditions"
                                    :label="'条件' + (index + 1)"
                                    :key="'条件' + (index + 1)"
                                    :prop="'条件' + (index + 1)"
                                >
                                    <el-input v-model="request.conditions[index]" :style="{width:getInputWidth(condition)}"></el-input>
                                    <el-button @click.prevent="removeProp('conditions', 2, index, condition, request, true)">删除请求条件配置</el-button>
                                </el-form-item>
                            </el-card>
                            <br>
                            <el-card v-if="arrayContainerIsNotNull(request.conditionResp)">
                                <template #header>
                                    <span>判断条件配置，带返回值(存储路径: flows[*].requests[*].conditionResp)</span><br>
                                    <el-button @click="addConditionResp(request)" style="float: right">新增判断条件配置</el-button>
                                </template>
                                <el-card
                                    v-for="(condition, index) in request.conditionResp"
                                    :label="'条件' + (index + 1)"
                                    :key="'条件' + (index + 1)"
                                    :prop="'条件' + (index + 1)"
                                >
                                    <template #header>
                                        <span>条件{{ (index + 1) }}</span>
                                    </template>
                                    <el-form :model="condition" :inline="true" label-position="right" label-width="auto">
                                        <el-row>
                                            <el-form-item label="返回CODE" prop="conditionRespCode" :rules="rules.conditionRespCode">
                                                <el-input class="form-action-item-50w" v-model="condition.code"  clearable/>
                                            </el-form-item>
                                            <el-form-item label="不满足条件返回message" prop="conditionRespMessage" :rules="rules.conditionRespMessage">
                                                <el-input class="form-action-item-50w" v-model="condition.message"  clearable/>
                                            </el-form-item>
                                        </el-row>
                                        <el-form-item label="条件" prop="conditionRespVerifyRule" :rules="rules.conditionRespVerifyRule">
                                            <el-input class="form-action-item-50w" v-model="condition.verifyRule" :style="{width:getInputWidth(condition.verifyRule)}" clearable/>
                                        </el-form-item>
                                        <br>
                                        <el-form-item>
                                            <el-button @click.prevent="removeProp('conditionResp', 2, index, condition, request, true)">删除请求条件配置</el-button>
                                        </el-form-item>
                                    </el-form>
                                    <br>
                                </el-card>
                            </el-card>
                            <br>
                            <el-card v-if="jsonContainerIsNotNull(request.body)">
                                <template #header>
                                    <span>请求参数配置(存储路径: flows[*].requests[*].body)</span><br>
                                    <span>当前节点jsonpath路径：{{ flow.name }}.{{ request.name }}.request</span>
                                    <el-button @click="pop('请求参数配置', 'body', 1, request, true)" style="float: right">新增请求参数配置</el-button>
                                </template>
                                <el-form-item
                                    v-for="(requestParam, requestParamKey) in request.body"
                                    :label=" requestParamKey "
                                    :key="requestParamKey"
                                    :prop="requestParamKey"
                                >
                                    <el-input v-model="request.body[requestParamKey]" :style="{width:getInputWidth(requestParam)}"></el-input>
                                    <el-button @click.prevent="removeProp('body', 1, requestParamKey, requestParam, request, false)">删除请求参数配置</el-button>
                                </el-form-item>
                            </el-card>
                            <br>
                            <el-card v-if="jsonContainerIsNotNull(request.fixedBody)">
                                <template #header>
                                    <span>请求参数固定值配置(魔法值配置)(存储路径: flows[*].requests[*].fixedBody)</span>
                                    <el-button @click="pop('请求参数固定值配置', 'fixedBody', 1, request, false)" style="float: right">新增请求参数固定值配置</el-button>
                                </template>
                                <el-form-item
                                    v-for="(requestParam, requestParamKey) in request.fixedBody"
                                    :label=" requestParamKey "
                                    :key="requestParamKey"
                                    :prop="requestParamKey"
                                >
                                    <el-input v-model="request.fixedBody[requestParamKey]" :style="{width:getInputWidth(requestParam)}" disabled></el-input>
                                    <el-button @click.prevent="removeProp('fixedBody', 1, requestParamKey, requestParam, request, false)">删除请求参数配置 (修改不能保证原字段"文本/数值"类型，如需修改，请删除)</el-button>
                                </el-form-item>
                            </el-card>
                            <br>
                            <el-card v-if="jsonContainerIsNotNull(request.response)">
                                <template #header>
                                    <span>返回值配置(存储路径: flows[*].requests[*].response)</span><br>
                                    <span>当前节点jsonpath路径：{{ flow.name }}.{{ request.name }}.response</span>
                                    <el-button @click="pop('返回值配置', 'response', 1, request, true)" style="float: right">新增返回值配置</el-button>
                                </template>
                                <el-form-item
                                    v-for="(responseValue, responseKey) in request.response"
                                    :label=" responseKey "
                                    :key="responseKey"
                                    :prop="responseKey"
                                >
                                    <el-input v-model="request.response[responseKey]" :style="{width:getInputWidth(responseValue)}"></el-input>
                                    <el-button @click.prevent="removeProp('response', 1, responseKey, responseValue, request, false)">删除返回值配置</el-button>
                                </el-form-item>
                            </el-card>
                            <br>
                            <el-button @click="popRequestDialog(flow, flowIndex)" style="float: right">新增REQUEST</el-button>
                        </el-card>
                        <br>
                        <el-button @click="addStep()" style="float: right">新增STEP</el-button>
                        <el-button @click="tabObjDef.activeName = 'STEP' + (flowIndex+2)" v-if="flowIndex!==(ruleForm.inputConfig.flows.length-1)" style="float: right">下一STEP</el-button>
                        <el-button @click="tabObjDef.activeName = 'STEP' + flowIndex" v-if="flowIndex!==0" style="float: right">上一STEP</el-button>
                    </el-card>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <br>
        <el-card shadow="always">
            <template #header>
                <span>响应值(inputResponse.body)</span>
                <el-button v-if="jsonContainerIsNull(ruleForm.inputConfig.inputResponse) || jsonContainerIsNull(ruleForm.inputConfig.inputResponse.body)"
                           @click="pop('响应值.返回数据', 'inputResponse.body', 1, ruleForm.inputConfig, true)" style="float: right">新增返回值配置</el-button>
                <el-button v-if="jsonContainerIsNull(ruleForm.inputConfig.inputResponse) || jsonContainerIsNull(ruleForm.inputConfig.inputResponse.titleList)"
                           @click="popExportAddDialog()" style="float: right">新增导出配置</el-button>
                <el-button v-if="jsonContainerIsNotNull(ruleForm.inputConfig.inputResponse) && jsonContainerIsNotNull(ruleForm.inputConfig.inputResponse.titleList)"
                           @click="drawerObjDef.visible = true" style="float: right">查看导出配置</el-button>
            </template>
            <el-card
                v-if="jsonContainerIsNotNull(ruleForm.inputConfig.inputResponse) && jsonContainerIsNotNull(ruleForm.inputConfig.inputResponse.body)"
                label="返回值配置"
                key="'inputResponse.body'"
                prop="'inputResponse.body'"
            >
                <template #header>
                    <span>返回值配置</span>
                    <el-button @click="pop('返回值配置', 'inputResponse.body', 1, ruleForm.inputConfig, false)" style="float: right">新增返回值字段</el-button>
                </template>
                <el-form :model="ruleForm.inputConfig.inputResponse" :inline="true" label-position="right" label-width="100px">
                    <el-form-item
                        v-for="(inputResponseValue, inputResponseKey) in ruleForm.inputConfig.inputResponse.body"
                        :key="inputResponseKey"
                        :label="inputResponseKey"
                        :prop="inputResponseKey"
                    >
                        <el-input v-model="ruleForm.inputConfig.inputResponse.body[inputResponseKey]" :style="{width:getInputWidth(inputResponseValue)}"></el-input>
                        <el-button @click.prevent="removeProp('inputResponse.body', 1, inputResponseKey, inputResponseValue, ruleForm.inputConfig, true)">删除返回值配置</el-button>
                    </el-form-item>
                </el-form>
                <br>
            </el-card>
            <el-drawer
                title="导出配置"
                v-model="drawerObjDef.visible"
                direction="rtl"
                :before-close="close">
                <el-card
                    v-if="jsonContainerIsNotNull(ruleForm.inputConfig.inputResponse) && jsonContainerIsNotNull(ruleForm.inputConfig.inputResponse.titleList)"
                    label="导出配置"
                    key="'inputResponse.body'"
                    prop="'inputResponse.body'"
                >
                    <template #header>
                        <span>导出配置</span>
                        <el-button @click="addExportPre()" style="float: right">在头部插入导出字段</el-button>
                        <el-button @click="addExportLast()" style="float: right">在最后新增导出字段</el-button>
                        <el-button @click="sortTitleList()" style="float: right">排序</el-button>
                    </template>
                    <el-collapse v-model="collapseObjDef.activeNames">
                        <el-collapse-item
                            v-for="(exportTitle, exportTitleIndex) in ruleForm.inputConfig.inputResponse.titleList"
                            :key="exportTitleIndex"
                            :lable="exportTitleIndex"
                            :prop="exportTitleIndex"
                            :title="exportTitle.title"
                            :name="exportTitleIndex"
                        >
                            <el-form :model="ruleForm.inputConfig.inputResponse.titleList" :inline="true" label-position="right" label-width="100px">
                                <el-form-item
                                    v-for="(exportTitleValue, exportTitleKey) in exportTitle"
                                    :key="exportTitleKey"
                                    :label="exportTitleKey"
                                    :prop="exportTitleKey"
                                >
                                    <el-input v-if="exportTitleKey !== 'calculation'" v-model="exportTitle[exportTitleKey]"></el-input>
                                    <span v-if="exportTitleKey === 'calculation'">金额处理公式：分元转换，建议在response处理</span>
                                </el-form-item>
                                <el-button @click.prevent="removeProp('titleList', 2, exportTitleIndex, exportTitle, ruleForm.inputConfig.inputResponse, false)">删除字段</el-button>
                            </el-form>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </el-drawer>
        </el-card>
        <br>
        <div>
            <span>配置存储结构</span>
            <JsonEditorVue class="editor" v-model="ruleForm.inputConfig" @blur="validate" @update:modelValue="updateModelValue"/>
        </div>
        <div class="footer">
            <span class="dialog-footer">
                <el-button type="primary"  v-if="handleType === 'add' || handleType === 'edit'" @click="submitForm(ruleFormRef)">
                    提交
                </el-button>
                <el-button type="primary"  @click="popInputConfigDialog()">
                    查看配置
                </el-button>
                <el-button type="primary" @click="handleClose">
                    取消
                </el-button>
            </span>
        </div>
    </div>
    <el-dialog
        v-model="attrAddDialogObjDef.dialogVisible"
        :title="attrAddDialogObjDef.title"
        :width="attrAddDialogObjDef.width"
        :before-close="close"
        draggable
    >
        <div class="lz-dialog">
            <el-form ref="attrAddDialogDef" v-model="attrAddDialogObjDef" label-position="right" label-width="150px">
                <el-form-item v-if="attrAddDialogObjDef.attrType === 1" label="要添加的属性KEY" prop="attrName">
                    <el-input class="form-action-item-50w" v-model="attrAddDialogObjDef.attrName" clearable :style="{width:getInputWidth(attrAddDialogObjDef.attrName)}"/>
                </el-form-item>
                <el-form-item v-if="attrAddDialogObjDef.type === 'function'" label="要添加的属性value" prop="attrName">
                    <el-autocomplete :fetch-suggestions="querySuggestions"
                                     class="form-action-item-50w"
                                     v-model="attrAddDialogObjDef.suggestionValue"
                                     @select="attrFunctionSelected"
                                     @change="attrFunctionChange"
                                     @clear="attrAddDialogObjDef.value = null"
                                     :style="{width:getInputWidth(attrAddDialogObjDef.suggestionValue, '600px')}"
                                     clearable
                    />
                </el-form-item>
                <el-form-item v-if="attrAddDialogObjDef.type === 'text'" label="要添加的属性value" prop="value">
                    <el-input class="form-action-item-50w" v-model="attrAddDialogObjDef.value" :type="attrAddDialogObjDef.type" clearable/>
                </el-form-item>
                <el-form-item v-if="attrAddDialogObjDef.type === 'number'" label="要添加的属性value" prop="value">
                    <el-input class="form-action-item-50w" v-model.number="attrAddDialogObjDef.value" :type="attrAddDialogObjDef.type" clearable/>
                </el-form-item>
                <el-alert v-show="attrAddDialogObjDef.alertVisible" title="JSON语法错误" type="error" @close="attrAddDialogObjDef.alertVisible=!attrAddDialogObjDef.alertVisible"/>
                <el-form-item v-if="attrAddDialogObjDef.type === 'textarea'"
                              label="要添加的属性JSON(数组/对象)"
                              prop="value"
                              :autosize="true"
                              @change="isJson(attrAddDialogObjDef.value)"
                >
                    <el-input class="form-action-item-50w" v-model="attrAddDialogObjDef.value" :type="attrAddDialogObjDef.type" clearable/>
                </el-form-item>
                <el-form-item label="要添加的属性类型" prop="type" v-if="!attrAddDialogObjDef.isFunc">
                    <el-select class="form-action-item-50w" v-model="attrAddDialogObjDef.type" clearable @change="attrAddDialogAttrTypeChanged">
                        <el-option label="文本" value="text" />
                        <el-option label="数值" value="number" />
                        <el-option label="JSON" value="textarea" />
                    </el-select>
                </el-form-item>
            </el-form>
            <br/>
            <span v-if="attrAddDialogObjDef.isFooter" class="dialog-footer" style="float: right">
                <el-button class="btn-mixins-clear-default" @click="attrAddDialogObjDef.dialogVisible = false">{{ attrAddDialogObjDef.closeBtnText }}</el-button>
                <el-button type="primary" class="btn-mixins dia-suc" @click="addProp(attrAddDialogObjDef.container)">{{ attrAddDialogObjDef.successBtnText }}</el-button>
            </span>
            <br/>
        </div>
    </el-dialog>
    <el-dialog
        v-model="requestDialogObjDef.dialogVisible"
        :title="requestDialogObjDef.title"
        :width="requestDialogObjDef.width"
        :before-close="close"
        draggable
    >
        <div class="lz-dialog">
            <el-form ref="requestAddDialogObjDef" v-model="requestDialogObjDef" label-position="right" label-width="150px">
                <el-form-item label="name" prop="name">
                    <el-input class="form-action-item-50w" v-model="requestDialogObjDef.name" clearable/>
                </el-form-item>
                <el-form-item label="configCode" prop="configCode">
                    <el-input class="form-action-item-50w" v-model="requestDialogObjDef.configCode" clearable/>
                </el-form-item>
                <el-form-item label="useConfigParmas" prop="useConfigParmas">
                    使用客户端参数.body+配置参数<el-switch v-model="requestDialogObjDef.useConfigParmas" active-color="#13ce66" inactive-color="#ff4949"/>仅使用配置参数
                </el-form-item>
                <el-form-item label="isStop" prop="isStop">
                    false<el-switch v-model="requestDialogObjDef.isStop" active-color="#13ce66" inactive-color="#ff4949"/>true
                </el-form-item>
            </el-form>
            <br/>
            <span v-if="requestDialogObjDef.isFooter" class="dialog-footer" style="float: right">
                <el-button class="btn-mixins-clear-default" @click="requestDialogObjDef.dialogVisible = false">{{ requestDialogObjDef.closeBtnText }}</el-button>
                <el-button type="primary" class="btn-mixins dia-suc" @click="addRequest()">{{ requestDialogObjDef.successBtnText }}</el-button>
            </span>
            <br/>
        </div>
    </el-dialog>
    <el-dialog
        v-model="exportAddDialogObjDef.dialogVisible"
        :title="exportAddDialogObjDef.title"
        :width="exportAddDialogObjDef.width"
        :before-close="close"
        draggable
    >
        <div class="lz-dialog">
            <div>
                <JsonEditorVue class="editor" v-model="exportAddDialogObjDef.exportConfig" @blur="validate"  @update:modelValue="updateInfo"/>
            </div>
            <br/>
            <span v-if="exportAddDialogObjDef.isFooter" class="dialog-footer" style="float: right">
                <el-button class="btn-mixins-clear-default" @click="exportAddDialogObjDef.dialogVisible = false">{{ exportAddDialogObjDef.closeBtnText }}</el-button>
                <el-button type="primary" class="btn-mixins dia-suc" @click="addExportConfig()">{{ exportAddDialogObjDef.successBtnText }}</el-button>
            </span>
            <br/>
        </div>
    </el-dialog>
    <el-dialog
        v-model="inputConfigDialogObjDef.dialogVisible"
        :title="inputConfigDialogObjDef.title"
        :width="inputConfigDialogObjDef.width"
        :before-close="close"
        draggable
    >
        <div class="lz-dialog">
            <el-descriptions title="">
                <el-descriptions-item label="TIPS:">需要点击一下JSON编辑区域才能显示最新数据</el-descriptions-item>
            </el-descriptions>
            <div>
                <JsonEditorVue style="height:300px" class="editor" id="inputConfigJsonEditor" v-model="ruleForm.inputConfig" @blur="validate"  @update:modelValue="updateInputConfigInfo"/>
            </div>
            <br/>
            <span v-if="inputConfigDialogObjDef.isFooter" class="dialog-footer" style="float: right">
                <el-button class="btn-mixins-clear-default" @click="inputConfigDialogObjDef.dialogVisible = false">{{ inputConfigDialogObjDef.closeBtnText }}</el-button>
                <el-button type="primary" class="btn-mixins dia-suc" @click="inputConfigDialogObjDef.dialogVisible = false">{{ inputConfigDialogObjDef.successBtnText }}</el-button>
            </span>
            <br/>
        </div>
    </el-dialog>
</template>
<script setup>
import { reactive, ref, toRefs, computed, defineComponent } from 'vue'
import { getOneConfig, addConfig, updateConfig, getUrlConfigList, getSuggestions } from '@/api/system/merchantUrlConfig'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import JsonEditorVue from 'json-editor-vue3'

const route = useRoute()
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => handleType === 'edit')
const handleType = route.query.handleType
const configCode = route.query.configCode
// 返回批次列表
const backList = async () => {
    router.back()
}
const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    backList()
}
const ruleFormRef = ref('')
const ruleForm = reactive({
    name: '',
    dataSourceType: '0',
    status: '1',
    inputConfig: {
    }
})

// 表单项规则
const rules = reactive({
    name: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 40, message: '最长不超过40个字符长度', trigger: 'change' }
    ]
})
const tabObjDef = reactive({
    activeName: ''
})
// 获取优惠券批次单条数据
const getsingleData = async () => {
    const res = await getOneConfig(configCode)
    Object.assign(ruleForm, res.data)
    ruleForm.reqType = ruleForm.reqType.toString()
    ruleForm.configType = ruleForm.configType.toString()
    ruleForm.status = ruleForm.status.toString()
    ruleForm.dataSourceType = ruleForm.dataSourceType.toString()
    ruleForm.inputConfig = (ruleForm.inputConfig === 'null' || ruleForm.inputConfig === '' || ruleForm.inputConfig === '{}') ? {} : JSON.parse(ruleForm.inputConfig)
    if (ruleForm.inputConfig !== undefined && ruleForm.inputConfig !== null) {
        if (ruleForm.inputConfig.flows !== undefined && ruleForm.inputConfig.flows !== null && JSON.stringify(ruleForm.inputConfig.flows) !== '[]') {
            tabObjDef.activeName = 'STEP1'
            for (const flowIndex in ruleForm.inputConfig.flows) {
                const flow = ruleForm.inputConfig.flows[flowIndex]
                for (const reqIndex in flow.requests) {
                    getsingleDataByConfigCode(flow.requests[reqIndex].configCode)
                }
            }
        }
        if (ruleForm.inputConfig.inputResponse !== undefined && JSON.stringify(ruleForm.inputConfig.inputResponse) !== '{}' && JSON.stringify(ruleForm.inputConfig.inputResponse.titleList) !== undefined && JSON.stringify(ruleForm.inputConfig.inputResponse.titleList) !== '{}') {
            for (const key in ruleForm.inputConfig.inputResponse.titleList) {
                collapseObjDef.activeNames[key] = ruleForm.inputConfig.inputResponse.titleList[key].title
            }
        }
    }
}
const configDesc = reactive({
})
const configDocApi = reactive({
})
const getsingleDataByConfigCode = async (configCode) => {
    const res = await getOneConfig(configCode)
    if (res.code !== '200') {
        configDesc[configCode] = '该配置不存在'
    }
    configDesc[configCode] = res.data.configCode + ' | ' + res.data.name + ' | ' + res.data.source + ' | ' + res.data.url
    configDocApi[configCode] = res.data.docApi
}

if (handleType) {
    if (handleType !== 'add') {
        getsingleData()
    }
}
const collapseObjDef = reactive({
    activeNames: []
})
const popoverObjDef = reactive({
    visible: false
})
const drawerObjDef = reactive({
    visible: false
})
// 提交表单
const submitForm = async (formEl) => {
    const params = {
        ...ruleForm,
        appKey: 'A1001000',
        busiCode: 'A1001000'
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        ruleForm.inputConfig = (ruleForm.inputConfig === 'null' || ruleForm.inputConfig === '' || ruleForm.inputConfig === '{}') ? null : ruleForm.inputConfig
        if (valid) {
            if (handleType === 'add') {
                const res = await addConfig({ ...params })
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                    emit('fevent')
                }
            } else {
                const res = await updateConfig([{ ...params }])
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                    emit('fevent')
                }
            }
        }
    })
}

const validate = async (editor) => {
    const res = await editor.validate()
    // res 是错误列表，如果是空数组，则表示检测没有错误
    console.log(res)
}
const updateModelValue = (val) => {
    ruleForm.inputConfig = val
}

const requestDialogObjDef = reactive({
    dialogVisible: false,
    title: '',
    isFooter: true,
    successBtnText: '确定',
    closeBtnText: '取消',
    width: '526px',
    name: '',
    configCode: '',
    isStop: true,
    useConfigParmas: false,
    flow: {}
})

const attrAddDialogObjDef = reactive({
    title: '',
    dialogVisible: false,
    isFooter: true,
    successBtnText: '确定',
    closeBtnText: '取消',
    width: '500px',
    alertVisible: false,
    attrName: '',
    value: null,
    suggestionValue: null,
    name: '',
    attrType: 0,
    isFunc: false,
    type: 'text',
    container: '',
    functions: [],
    selectedflag: false,
    addFlow: false
})

const exportAddDialogObjDef = reactive({
    title: '新增导出配置',
    dialogVisible: false,
    isFooter: true,
    successBtnText: '确定',
    closeBtnText: '取消',
    width: '300px',
    exportConfig: []
})

const inputConfigDialogObjDef = reactive({
    title: '配置存储结构',
    dialogVisible: false,
    isFooter: true,
    successBtnText: '确定',
    closeBtnText: '取消',
    width: '70%'
})

const updateInputConfigInfo = (val) => {
    ruleForm.inputConfig = val
}

const updateInfo = (val) => {
    exportAddDialogObjDef.exportConfig = val
}

const arrayContainerIsNull = (container) => {
    return container === undefined || container === null || JSON.stringify(container) === '[]'
}
const arrayContainerIsNotNull = (container) => {
    return !arrayContainerIsNull(container)
}
const jsonContainerIsNull = (container) => {
    return container === undefined || container === null || JSON.stringify(container) === '{}'
}
const jsonContainerIsNotNull = (container) => {
    return !jsonContainerIsNull(container)
}
const getTabDesc = (flow) => {
    let content = '<span>'
    if (jsonContainerIsNotNull(flow) && arrayContainerIsNotNull(flow.requests) && jsonContainerIsNotNull(flow.requests[0])) {
        for (let i = 0; i < flow.requests.length; i++) {
            if (i === 0) {
                content = configDesc[flow.requests[i].configCode]
            } else {
                content = content + '<br>' + configDesc[flow.requests[i].configCode]
            }
        }
    }
    return content + '</span>'
}
const attrAddDialogDefRules = reactive({
})
// attrType 1:{} 2:[""] 3[{}]
const pop = (title, name, attrType, container, isFunc) => {
    attrAddDialogObjDef.attrType = attrType
    attrAddDialogObjDef.name = name
    attrAddDialogObjDef.title = '添加' + title
    attrAddDialogObjDef.container = container
    attrAddDialogObjDef.isFunc = isFunc
    attrAddDialogObjDef.type = isFunc ? 'function' : 'text'
    attrAddDialogObjDef.width = isFunc ? '800px' : '500px'
    attrAddDialogObjDef.dialogVisible = true
}

const popRequestDialog = (flow, flowIndex) => {
    requestDialogObjDef.title = '添加REQUEST'
    requestDialogObjDef.flow = flow
    if (flow.requests === undefined) {
        requestDialogObjDef.name = 'request1'
    } else {
        const requestLength = flow.requests.length + 1
        requestDialogObjDef.name = 'request' + requestLength
    }
    requestDialogObjDef.useConfigParmas = flowIndex >= 1
    requestDialogObjDef.dialogVisible = true
}

const popExportAddDialog = () => {
    exportAddDialogObjDef.dialogVisible = true
}

const popInputConfigDialog = () => {
    inputConfigDialogObjDef.dialogVisible = true
}

const addProp = async (container) => {
    const path = attrAddDialogObjDef.name.split('.')
    for (let i = 0; i < path.length - 1; i++) {
        if (container[path[i]] === undefined) {
            container[path[i]] = {}
        }
        container = container[path[i]]
    }
    const name = path[path.length - 1]
    if (attrAddDialogObjDef.attrType === 1) {
        if (container[name] === undefined) {
            container[name] = {}
        }
        if (attrAddDialogObjDef.type === 'textarea') {
            container[name][attrAddDialogObjDef.attrName] = JSON.parse(attrAddDialogObjDef.value)
        } else {
            container[name][attrAddDialogObjDef.attrName] = attrAddDialogObjDef.value
        }
        attrAddDialogObjDef.attrName = ''
        attrAddDialogObjDef.value = null
    } else if (attrAddDialogObjDef.attrType === 2) {
        if (container[name] === undefined) {
            container[name] = []
        }
        if (attrAddDialogObjDef.value !== null) {
            container[name].push(
                attrAddDialogObjDef.value
            )
        }
        attrAddDialogObjDef.value = null
    }

    attrAddDialogObjDef.dialogVisible = false
}

const isJson = (value) => {
    try {
        JSON.parse(attrAddDialogObjDef.value)
    } catch (e) {
        // alert('错误的JSON格式')
        attrAddDialogObjDef.alertVisible = true
    }
}
const attrAddDialogAttrTypeChanged = () => {
    attrAddDialogObjDef.value = null
    attrAddDialogObjDef.alertVisible = false
}
const removeProp = async (pathStr, type, attrName, value, superContainer, deleteRoot) => {
    let container = superContainer
    const path = pathStr.split('.')
    for (let i = 0; i < path.length - 1; i++) {
        container = container[path[i]]
    }
    if (type === 1) {
        delete container[path[path.length - 1]][attrName]
        if (deleteRoot && JSON.stringify(container[path[path.length - 1]]) === '{}') {
            delete container[path[path.length - 1]]
        }
    } else if (type === 2) {
        container[path[path.length - 1]].splice(attrName, 1)
        if (deleteRoot && JSON.stringify(container[path[path.length - 1]]) === '[]') {
            delete container[path[path.length - 1]]
        }
    }
    if (deleteRoot) {
        path.pop()
        deletePath(superContainer, path)
    }
}

const deletePath = (container, path) => {
    if (path.length > 0) {
        for (let i = 0; i < path.length; i++) {
            if (JSON.stringify(container[path[i]]) === '{}') {
                delete container[path[i]]
                container = container[path[i]]
                break
            }
        }
        path.pop()
        deletePath(container, path)
    }
}

const removeStep = (flowIndex) => {
    if (flowIndex !== -1) {
        ruleForm.inputConfig.flows.splice(flowIndex, 1)
    }
    if (ruleForm.inputConfig.flows.length === 0) {
        delete ruleForm.inputConfig.flows
    } else {
        tabObjDef.activeName = 'STEP' + flowIndex
    }
}
const addStep = () => {
    if (ruleForm.inputConfig.flows === undefined) {
        ruleForm.inputConfig.flows = []
    }
    const index = ruleForm.inputConfig.flows.length + 1
    ruleForm.inputConfig.flows.push({
        name: 'flow' + index,
        requests: []
    })
    tabObjDef.activeName = 'STEP' + index
}

const addCondition = (request) => {
    if (request.conditions === undefined) {
        request.conditions = []
    }
    request.conditions.push('')
}

const addConditionResp = (request) => {
    if (request.conditionResp === undefined) {
        request.conditionResp = []
    }
    request.conditionResp.push({
        code: '',
        message: '',
        verifyRule: ''
    })
}

const removeRequest = (flow, requestIndex) => {
    if (requestIndex !== -1) {
        flow.requests.splice(requestIndex, 1)
    }
    if (flow.requests.length === 0) {
        delete flow.requests
    }
}

const addRequest = () => {
    requestDialogObjDef.dialogVisible = false
    if (requestDialogObjDef.flow.requests === undefined) {
        requestDialogObjDef.flow.requests = []
    }
    requestDialogObjDef.flow.requests.push({
        name: requestDialogObjDef.name,
        configCode: requestDialogObjDef.configCode,
        isStop: requestDialogObjDef.isStop,
        body: {},
        fixedBody: {},
        response: {}
    })
}
const addExportPre = () => {
    for (const titleIndex in ruleForm.inputConfig.inputResponse.titleList) {
        ruleForm.inputConfig.inputResponse.titleList[titleIndex].sort = ruleForm.inputConfig.inputResponse.titleList[titleIndex].sort + 1
    }
    ruleForm.inputConfig.inputResponse.titleList.unshift({
        calculation: 0,
        field: '',
        sort: 0,
        title: ''
    })
}
const addExportLast = () => {
    ruleForm.inputConfig.inputResponse.titleList.push({
        calculation: 0,
        field: '',
        sort: ruleForm.inputConfig.inputResponse.titleList.length + 1,
        title: ''
    })
}
const sortTitleList = () => {
    ruleForm.inputConfig.inputResponse.titleList.sort((o1, o2) => {
        return o1.sort - o2.sort
    })
    for (const titleIndex in ruleForm.inputConfig.inputResponse.titleList) {
        ruleForm.inputConfig.inputResponse.titleList[titleIndex].sort = titleIndex
    }
}
const addExportConfig = () => {
    if (ruleForm.inputConfig.inputResponse === undefined) {
        ruleForm.inputConfig.inputResponse = {}
    }
    ruleForm.inputConfig.inputResponse.titleList = exportAddDialogObjDef.exportConfig
    exportAddDialogObjDef.dialogVisible = false
}
const getInputWidth = (value, width) => {
    if (value === null || value === undefined || String(value).length <= 20) {
        return !width ? '150px' : width
    } else {
        const valueWidth = String(value).length * 7 + 10
        const windowWidth = document.documentElement.clientWidth
        return (valueWidth >= windowWidth * 0.6 ? windowWidth * 0.6 : valueWidth) + 'px'
    }
}

const querySuggestions = async (queryString, cb) => {
    attrAddDialogObjDef.functions = []
    attrAddDialogObjDef.addFlow = false
    queryString = attrAddDialogObjDef.selectedflag ? attrAddDialogObjDef.suggestionValue : queryString
    attrAddDialogObjDef.selectedflag = false
    queryString = queryString === 'null' ? '' : queryString
    const params = { path: queryString }
    const res = await getSuggestions(params)
    res.data.filter(suggestion => !suggestion.suggestionsEndFlag)
        .forEach(suggestion => {
            const value = suggestion.suggestion
            delete suggestion[suggestion]
            if (!attrAddDialogObjDef.addFlow && (jsonContainerIsNull(value) || (suggestion.level === 1 && (suggestion.beforeString === '' || suggestion.beforeString.endsWith('jsonPath('))))) {
                getFlowPath(suggestion.level, suggestion)
                    .filter(path => suggestion.queryString && suggestion.queryString !== '' ? path.path.toLowerCase().indexOf(suggestion.queryString.toLowerCase()) === 0 : true)
                    .forEach(path => {
                        attrAddDialogObjDef.functions.push(path)
                    })
                attrAddDialogObjDef.addFlow = false
            }
            if (jsonContainerIsNotNull(value)) {
                attrAddDialogObjDef.functions.push({
                    ...suggestion,
                    value: value.value,
                    path: value.value
                })
            }
        })
    attrAddDialogObjDef.functions.forEach(func => {
        func.value = func.beforeString.substring(func.beforeString.length - 10, func.beforeString.length) + func.value
    })
    if (attrAddDialogObjDef.functions.length === 1) {
        attrFunctionSelected(attrAddDialogObjDef.functions[0])
        querySuggestions(attrAddDialogObjDef.suggestionValue, cb)
    } else {
        cb(attrAddDialogObjDef.functions)
    }
}

const getFlowPath = (level, suggestion) => {
    const container = ruleForm.inputConfig.flows
    if (level === 1) {
        return container.map((item) => {
            return { ...suggestion, value: (item.name + '.'), path: (item.name + '.') }
        })
    } else if (level === 2) {
        const flowName = suggestion.pathString.substring(0, suggestion.pathString.indexOf('.'))
        const flows = container.filter((item) => flowName === item.name)
        return flows[0].requests.map((item) => {
            return { ...suggestion, value: (item.name + '.'), path: (item.name + '.') }
        })
    } else if (level === 3) {
        return [
            { ...suggestion, value: 'response.', path: 'response.' },
            { ...suggestion, value: 'request.', path: 'request.' }
        ]
    } else if (level === 4 && suggestion.queryString !== 'body' && suggestion.queryString !== 'config') {
        return [
            { ...suggestion, value: 'body', path: 'body' },
            { ...suggestion, value: 'config', path: 'config' }
        ]
    } else {
        return []
    }
}
const attrFunctionSelected = (suggestion) => {
    attrAddDialogObjDef.value = suggestion.beforeString + suggestion.path + suggestion.afterString
    attrAddDialogObjDef.suggestionValue = attrAddDialogObjDef.value
    attrAddDialogObjDef.selectedflag = true
}

const attrFunctionChange = (suggestion) => {
    attrAddDialogObjDef.value = suggestion
    attrAddDialogObjDef.suggestionValue = suggestion
}
const mergeSuggestionValue = (value) => {
    if (attrAddDialogObjDef.value.indexOf(value) > -1) {
        return attrAddDialogObjDef.value.substr(0, attrAddDialogObjDef.value.indexOf(value) + value.length)
    } else if (attrAddDialogObjDef.value.endsWith('.') || attrAddDialogObjDef.value.endsWith('(')) {
        return attrAddDialogObjDef.value + value
    } else {
        const index = attrAddDialogObjDef.value.lastIndexOf('.')
        if (index > -1) {
            const path = attrAddDialogObjDef.value.substr(0, index + 1)
            return path + value
        } else {
            return value
        }
    }
}
</script>
<style lang="scss" scoped>
    .submit-box{
        .dictContentBox{
            width: 100%;
            .checkedItem{
                display: block;
            }
        }
        .form-text{
            display: inline-block;
            height: 32px;
            line-height: 32px;
            color: #606266;
            font-size: 14px;
        }
        .form-text-btn{
            display: inline-block;
            margin-left: 5px;
            color: #fe2c55;
            cursor: pointer;
        }
        .footer{
            position: absolute;
            width: 100%;
            bottom: 0;
            margin: 30px;
            text-align: center;
        }
    }
    .el-card ::v-deep .el-card__header {
        background-color: #B3C0D1;
    }
</style>
