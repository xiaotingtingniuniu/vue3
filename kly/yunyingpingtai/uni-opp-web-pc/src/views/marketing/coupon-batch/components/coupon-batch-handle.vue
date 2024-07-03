<template>
    <div class='coupon-submit-box'>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
            <el-form-item label="券批次编号" prop="groupCode" v-if="props.handleType !== 'add' && props.handleType !== 'copy'">
                <el-input class="form-action-item-50w" v-model="ruleForm.groupCode" disabled/>
            </el-form-item>
            <el-form-item label="券批次名称" prop="groupName" :rules="rules.name">
                <el-input class="form-action-item-50w" v-model="ruleForm.groupName" placeholder="最多输入20汉字长度" clearable :disabled="canNotEdit"/>
            </el-form-item>
            <el-form-item label="申请人" prop="applier">
                {{props.handleType === 'add' || props.handleType === 'copy' ? userInfo.name: ruleForm.applier}}
            </el-form-item>
            <el-form-item label="状态" prop="groupStatus">
                {{statusKeyValue[ruleForm.groupStatus]}}
            </el-form-item>
            <el-form-item label="组织" prop="orgCode" :rules="rules.selectRule">
                <el-select class="form-action-item-50w" v-model="ruleForm.orgCode" clearable placeholder="请选择" :disabled="canNotEdit">
                    <el-option label="恒生活" value="A1001" />
                    <el-option label="小恒数科" value="A1002" />
                    <el-option label="汇财" value="A1003" />
                    <el-option label="保险" value="A1004" />
                </el-select>
            </el-form-item>
            <el-form-item label="子系统" prop="subCode" :rules="rules.selectRule" v-if="ruleForm.orgCode === 'A1001'">
                <el-select class="form-action-item-50w" v-model="ruleForm.subCode" clearable placeholder="请选择" :disabled="canNotEdit">
                    <el-option label="恒生活App" value="A1001001" />
                    <el-option label="智能货柜" value="A1001002" />
                    <el-option label="恒生活众包" value="A1001003" />
                    <el-option label="恒掌柜" value="A1001004" />
                    <el-option label="供应链" value="A1001005" />
                    <el-option label="交付" value="A1001006" />
                </el-select>
            </el-form-item>
            <el-form-item label="业务线" prop="businessCode" :rules="rules.selectRule">
                <el-select class="form-action-item-50w" v-model="ruleForm.businessCode" clearable placeholder="请选择" :disabled="canNotEdit" @change="businessCodeChange">
                    <el-option label="通用券" value="1" />
                    <el-option label="智能货柜" value="2" />
                    <el-option label="门店" value="3" />
                    <el-option label="生活充值" value="4" />
                    <el-option label="电商到家" value="5" />
                    <el-option label="本地生活" value="A1001003" />
                </el-select>
            </el-form-item>
            <el-form-item label="交易订单类型" prop="dealType" :rules="rules.selectRule">
                <el-select class="form-action-item-50w" v-model="ruleForm.dealType" clearable placeholder="请选择" :disabled="canNotEdit" multiple>
                    <el-option label="全部" value="1" v-if="ruleForm.businessCode ===  '1'"/>
                    <el-option label="预约到柜" value="2" v-if="ruleForm.businessCode ===  '1' || ruleForm.businessCode ===  '2'"/>
                    <el-option label="即时到柜" value="3" v-if="ruleForm.businessCode ===  '1' || ruleForm.businessCode ===  '2'"/>
                    <el-option label="即时到店" value="4" v-if="ruleForm.businessCode ===  '1' || ruleForm.businessCode ===  '3'"/>
                    <el-option label="预约到店" value="5" v-if="ruleForm.businessCode ===  '1' || ruleForm.businessCode ===  '3'"/>
                    <el-option label="生活充值" value="6" v-if="ruleForm.businessCode ===  '1' || ruleForm.businessCode ===  '4'"/>
                    <el-option label="电商到家" value="7" v-if="ruleForm.businessCode ===  '1' || ruleForm.businessCode ===  '5'"/>
                    <el-option label="虚拟门店" value="8" v-if="ruleForm.businessCode ===  '1' || ruleForm.businessCode ===  '2'"/>
                    <el-option label="团购订单" value="9" v-if="ruleForm.businessCode ===  '1' || ruleForm.businessCode ===  'A1001003'"/>
                </el-select>
            </el-form-item>
            <el-row v-for="(item, index) in ruleForm.acctInfo" :key="index" >
                <el-col :span="12">
                    <el-form-item :label="index === 0 ? '成本账户' : ''" :prop="'acctInfo.'+ index + '.acctId'" :rules="rules.selectRule">
                        <el-row style="width: 100%">
                            <el-col :span="6"><span class="form-text form-text-btn" @click="showSubDialog('costAccount')" v-if="!canNotEdit">选择账户</span></el-col>
                            <el-col :span="!canNotEdit ? 16 : 24"><el-input v-model="item.acctName" disabled style="width: 100%"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="承担比例" :prop="'acctInfo.'+ index + '.assumeRatio'" :rules="rules.discountRateRule" label-width="80px">
                        <el-input v-model.number="item.assumeRatio" :disabled="canNotEdit"><template v-slot:suffix>%</template></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="3" v-if="index === ruleForm.acctInfo.length - 1">
                    <span class="form-text form-text-btn" v-if="!canNotEdit && ruleForm.acctInfo.length < 3" @click="addCostCount">新增</span>
                    <span class="form-text form-text-btn" v-if="!canNotEdit && index > 0" @click.prevent="removeCostCount(index)">删除</span>
                </el-col>
            </el-row>
            <el-form-item label="生效城市" prop="cityRangeType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.cityRangeType" :disabled="canNotEdit">
                    <el-radio :label="1">全国</el-radio>
                    <el-radio :label="2">指定城市</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="effectiveCitysChecked" :rules="rules.effectiveCitysChecked" v-if="ruleForm.cityRangeType === 2">
                <el-cascader
                    ref="authorityRef"
                    :props="effectiveCitysProp"
                    @change="effectiveCitysChange"
                    v-model="dataState.effectiveCitysChecked"
                    v-if="effectiveCitysVisiable"
                    width="100%"
                    clearable
                    :disabled="canNotEdit"
                />
            </el-form-item>
            <el-form-item label="选择商品" prop="goodsRangeType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.goodsRangeType" @change="goodsRangeTypeChange" :disabled="canNotEdit">
                    <el-radio :label="1">全部商品</el-radio>
                    <el-radio
                        :label="2"
                        v-if="ruleForm.businessCode ===  '5' || ruleForm.businessCode ===  '2' || ruleForm.businessCode ===  'A1001003'"
                    >
                        商品维度生效
                        <span v-if="ruleForm.goodsRangeType === 2">({{googdsHasSelectList.length}})</span>
                    </el-radio>
                    <el-radio
                        :label="3"
                        v-if="ruleForm.businessCode ===  '5' && ruleForm.businessCode.length === 1"
                    >
                        分类维度生效 ({{googdsClassifyList.length}})
                    </el-radio>
                </el-radio-group>
                <span
                    class="form-text-btn"
                    @click="showGoodsDialog()"
                    v-if="!canNotEdit && (ruleForm.businessCode ===  '5' || ruleForm.businessCode ===  '2' || ruleForm.businessCode ===  'A1001003') && ruleForm.goodsRangeType !== 1"
                >增加</span>
                <span
                    class="form-text-btn"
                    @click="ruleForm.businessCode ===  '5' || ruleForm.businessCode ===  'A1001003' ? batchAddHandle('sku') : batchAddHandle('spu')"
                    v-if="!canNotEdit && (ruleForm.businessCode ===  '5' || ruleForm.businessCode ===  '2' || ruleForm.businessCode ===  'A1001003') && ruleForm.goodsRangeType === 2"
                >批量增加</span>
                <span
                    class="form-text-btn"
                    v-if="ruleForm.businessCode ===  'A1001003'"
                >注意：原价，团购价和活动有效期。可能因为商户调整发生变化</span>
            </el-form-item>
            <div class="goods-list">
                <goods-has-checked
                    :googdsHasSelectList="googdsHasSelectList"
                    :businessCode="ruleForm.businessCode"
                    :goodsRangeType="ruleForm.goodsRangeType"
                    v-if="ruleForm.businessCode ===  'A1001003'"
                    @remove="handleGoodsRemove"
                    :canNotEdit="canNotEdit"
                >
                </goods-has-checked>
                <el-table :data="googdsHasSelectList" style="width: 100%;marginTop: 20px;" border v-if="ruleForm.goodsRangeType === 2 && ruleForm.businessCode ===  '5'">
                    <el-table-column prop="date" label="商品信息">
                        <template #default="scope">
                            <span>商品：{{scope.row.skuId}}-{{scope.row.skuName}}</span><br/>
                            <span>商品状态：{{skuStatusKeyValue[scope.row.skuOnshelfStatus]}}</span><br/>
                            <span>商品分类：{{scope.row.firstCateName}}-{{scope.row.secondCateName}}-{{scope.row.thirdCateName}}-{{scope.row.fourthCateName}}</span><br/>
                        </template>
                    </el-table-column>
                    <el-table-column label="价格" width="180">
                        <template #default="scope">
                            <span>原价：{{scope.row.salePrice}}</span><br/>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前库存" width="180">
                        <template #default="scope">
                            <span>物理库存：{{scope.row.stock}}</span><br/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="操作" width="120" align="center" v-if="!canNotEdit" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" text @click="handleGoodsRemove(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table :data="googdsHasSelectList" style="width: 100%;marginTop: 20px;" border v-if="ruleForm.businessCode ===  '2'">
                    <el-table-column prop="date" label="商品信息">
                        <template #header>
                            商品信息
                            <span class="remark-icon" @click="openRemarkSpu">?</span>
                        </template>
                        <template #default="scope">
                            <div v-if="ruleForm.goodsRangeType !== 1">
                                <span>spu编号：{{scope.row.spuId}}</span><br/>
                                <span>spu名称：{{scope.row.spuName}}</span><br/>
                                <!-- <span>商品状态：{{isEnabledKeyValue[scope.row.isEnabled]}}</span><br/> -->
                                <span>spu分类：{{scope.row.firstCateName}}-{{scope.row.secondCateName}}-{{scope.row.thirdCateName}}-{{scope.row.fourthCateName}}</span><br/>
                            </div>
                            <div v-if="ruleForm.goodsRangeType === 1">
                                <span>全部商品</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="生效合同货柜范围" width="180">
                        <template #header>
                            生效合同货柜范围
                            <span class="remark-icon" @click="openRemarkPoint">?</span>
                        </template>
                        <template #default="scope">
                            <el-select
                                v-model="scope.row.point"
                                placeholder="请选择"
                                @change="value => handleSpuPointChange(value, scope.$index)"
                                :disabled="canNotEdit"
                            >
                                <el-option label="全部合同货柜生效" value="1" />
                                <el-option label="指定合同货柜生效" value="2" />
                            </el-select>
                            <div v-if="scope.row.point === '2'">
                                <div v-if="!canNotEdit">
                                    <span class="form-text-btn" @click="showSubDialog('point', scope.$index, scope.row)">新增</span>
                                    <span class="form-text-btn" @click="batchAddHandle('point', scope.$index, scope.row)">批量增加</span>
                                </div>
                                <div>
                                    <span>
                                        已选{{scope.row.pointCodeList.length}}合同货柜
                                    </span>
                                    <span v-if="canNotEdit">
                                        <span class="form-text-btn" @click="showSubDialog('point', scope.$index, scope.row)">查看</span>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="操作" width="120" align="center" v-if="!canNotEdit && ruleForm.goodsRangeType !== 1" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" text @click="handleGoodsRemove(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table :data="googdsClassifyList" style="width: 100%;marginTop: 20px;" border v-if="ruleForm.goodsRangeType === 3">
                    <el-table-column prop="firstCategoryId" label="一级类目编号" width="180"></el-table-column>
                    <el-table-column prop="firstCategoryName" label="一级类目名称" width="180"></el-table-column>
                    <el-table-column prop="secondCategoryId" label="二级类目编号" width="180"></el-table-column>
                    <el-table-column prop="secondCategoryName" label="二级类目名称" width="180"></el-table-column>
                    <el-table-column prop="operate" label="操作" width="120" align="center" v-if="!canNotEdit" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" text @click="handleGoodsClassifyRemove(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-form-item label="批次有效期" prop="isValidTime" style="width: 700px" class="form-item-time" :rules="rules.isValidTimeRule">
                <el-date-picker
                    v-model="ruleForm.isValidTime"
                    type="datetimerange"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    range-separator="~"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    :disabled="canNotEdit"
                    :default-time="defaultTime"
                />
                <span>注意：仅在批次有效期内可领取优惠券</span>
            </el-form-item>
            <el-form-item label="营销工具" prop="couponType" :rules="rules.selectRule" class="coupon-type">
                <el-tabs
                    v-model="couponTypeActiveName"
                    type="card"
                    class="demo-tabs"
                    @tab-click="couponTypeHandleClick"
                >
                    <el-tab-pane :name="item.title" v-for="(item, index) in couponTypeTab" :key="index">
                        <template #label>
                            <span v-if="item.title === '立减'">{{item.title}}({{instantlyCouponsCount}})</span>
                            <span v-if="item.title === '满减'">{{item.title}}({{spendEnoughCouponsCount}})</span>
                            <span v-if="item.title === '折扣'">{{item.title}}({{discountCouponsCount}})</span>
                        </template>
                        <el-table :data="item.couponsList" border style="width: 100%">
                            <el-table-column label="券类型" align="center">
                                <template #default="scope">
                                    {{couponTypeKeyValue[scope.row.couponType]}}
                                </template>
                            </el-table-column>
                            <el-table-column label="可领券用户范围" width="130" align="center">
                                <template #default="scope">
                                    {{userRangeTypeKeyValue[scope.row.userRangeType]}}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="couponTypeActiveName !== '折扣'" prop="maxMinusAmount" label="最高立减金额" width="130" align="center" />
                            <el-table-column v-if="couponTypeActiveName !== '折扣'" prop="doorsillAmount" label="门槛金额" width="100" align="center">
                                <template #default="scope">
                                    {{scope.row.doorsillAmount === '' ? '--' : scope.row.doorsillAmount}}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="couponTypeActiveName === '折扣'" prop="discountRate" label="折扣比例" width="130" align="center">
                                <template #default="scope">
                                    {{scope.row.discountRate}}%
                                </template>
                            </el-table-column>
                            <el-table-column v-if="couponTypeActiveName === '折扣'" prop="maxDiscountAmount" label="最大优惠金额" width="130" align="center" />
                            <el-table-column prop="applyCount" label="券申请/领用/使用数量" width="200"  align="center">
                                <template #default="scope">
                                    {{scope.row.applyCount}}/{{scope.row.receiveCount || 0}}/{{scope.row.usedCount || 0}}
                                </template>
                            </el-table-column>
                            <el-table-column label="券有效期" width="220" align="center">
                                <template #default="scope">
                                    <span v-if="scope.row.termType === 1">领取后{{scope.row.isValidDays}}天生效，有效期{{scope.row.validDays}}天</span>
                                    <span v-if="scope.row.termType === 2">{{scope.row.useBeginDate}}</span>
                                    <br/>
                                    <span v-if="scope.row.termType === 2">{{scope.row.useEndDate}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="150" v-if="!canNotEdit">
                                <template #default="scope">
                                    <el-button link type="primary" size="small" @click="delCoupon(scope.$index)">删除</el-button>
                                    <el-button link type="primary" size="small" @click="getSignalCoupon(scope.row, scope.$index)">编辑</el-button>
                                    <el-button link type="primary" size="small" @click="showCouponBag(scope.row)">复制</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="150" v-if="canNotEdit && (ruleForm.groupStatus=== 4 || ruleForm.groupStatus === 5)">
                                <template #default="scope">
                                    <el-button link type="primary" size="small" @click="exportExcelCoupon(scope.row)">券码导出</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
                <span class="add-coupon" @click="showCouponBag" v-if="!canNotEdit">添加优惠券({{allCouponsCount}}/50)</span>
            </el-form-item>
            <el-form-item label="默认冻结金额" prop="freezeAmount" :rules="rules.numberRule">
                <el-input class="form-action-item-50w" v-model="ruleForm.freezeAmount" placeholder="默认冻结营销费用金额，优惠券失效后自动解冻" :disabled="canNotEdit"><template v-slot:suffix>元</template></el-input>
                <span>默认冻结金额用于优惠券核销，核销数量达到80%，会邮件提醒运营是否下线活动。</span>
            </el-form-item>
            <el-form-item label="单个用户领取上限" prop="singleUserMax" :rules="rules.singleUserMax">
                <el-input class="form-action-item-50w" v-model.number="ruleForm.singleUserMax" placeholder="填写数值，仅支持整数，不得为0" :disabled="canNotEdit"><template v-slot:suffix>次数</template></el-input>
            </el-form-item>
            <!-- <el-form-item label="POI范围">
                <span class="form-text">预计40个</span>
                <span class="form-text">查看列表</span>
            </el-form-item> -->
            <!-- <el-form-item label="POI类型" prop="poiRangeInfo.poiType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.poiRangeInfo.poiType" :disabled="canNotEdit">
                    <el-radio :label="1">智能柜</el-radio>
                    <el-radio :label="2">门店</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item label="渠道范围" prop="poiRangeInfo.channelType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.poiRangeInfo.channelType" :disabled="canNotEdit">
                    <el-radio :label="1">货柜</el-radio>
                    <el-radio :label="2">门店</el-radio>
                    <el-radio :label="3">到家电商</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <div v-if="ruleForm.businessCode ===  '2'">
                <el-form-item label="货柜">
                    <el-form-item label="设备运营模式" prop="poiRangeInfo.operateModel" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.poiRangeInfo.operateModel" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <el-radio :label="2">自营</el-radio>
                            <el-radio :label="3">柜主</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form-item>
            </div>
            <div v-if="ruleForm.businessCode ===  '3'">
                <el-form-item label="门店">
                    <el-form-item label="指定门店" prop="poiRangeInfo.isAssignStore" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.poiRangeInfo.isAssignStore" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <el-radio :label="2">部门门店</el-radio>
                        </el-radio-group>
                        <span class="form-text-btn" @click="showSubDialog('shop')" v-if="ruleForm.poiRangeInfo.isAssignStore === 2 && !canNotEdit">增加</span>
                        <div class="form-text-btn" v-if="ruleForm.poiRangeInfo.isAssignStore === 2">已选择{{shopHasSelectList.length}}个门店</div>
                    </el-form-item>
                </el-form-item>
            </div>
            <div v-if="ruleForm.businessCode ===  '5'">
                <el-form-item label="到家电商">
                    <el-form-item label="指定渠道" prop="poiRangeInfo.homeChannelType" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.poiRangeInfo.homeChannelType" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <!-- <el-radio :label="2">恒生活电商</el-radio> -->
                            <!-- <el-radio :label="3">X平台</el-radio> -->
                        </el-radio-group>
                    </el-form-item>
                </el-form-item>
            </div>
            <!-- <el-form-item label="使用说明" prop="couponDesc" :rules="rules.couponDesc">
                <el-input v-model="ruleForm.couponDesc" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="1、全品类商品通用（不能使用优惠券商品除外） 2、限定北京，上海城市智能货柜使用" :disabled="canNotEdit"/>
            </el-form-item> -->
            <el-form-item label="项目投入产出测算" prop="couponCalculate" :rules="rules.textRule">
                <el-input v-model="ruleForm.couponCalculate" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="预计投入1000元，GMV上升2000元" :disabled="canNotEdit"/>
            </el-form-item>
        </el-form>
        <div class="footer">
            <span class="dialog-footer">
                <el-button type="primary"  v-if="checkRole('marketing-5') && (props.handleType === 'add' || props.handleType === 'edit'|| props.handleType === 'copy')" @click="submitForm(ruleFormRef)">
                    提交
                </el-button>
                <el-button type="primary" v-if="checkRole('marketing-9') && props.handleType === 'approval' && ruleForm.groupStatus===1" @click="couponAudit(3)">
                    提交审批
                </el-button>
                <el-button type="primary" @click="handleClose">
                    取消
                </el-button>
            </span>
        </div>
        <com-list
            v-if="listDialogConfig"
            :listVisible ='listDialogConfig'
            :listType="dataState.subListType"
            :provinceCityInfo="ruleForm.provinceCityInfo? ruleForm.provinceCityInfo : []"
            :hasSelectList="dataState.hasSelectList"
            :pointChecked="dataState.pointChecked"
            :handleType="props.handleType"
            :businessCode="ruleForm.businessCode"
            :spuInfo="dataState.spuInfo"
            @handleClose="listDialogConfig = false"
            @getDialogCheckedData="getDialogCheckedData"
        ></com-list>
        <coupon-bag
            v-if="couponBagConfig"
            :listVisible ='couponBagConfig'
            :handleType="couponBagType"
            :updateCouponData="signalCouponData"
            :isValidTime="ruleForm.isValidTime"
            @handleClose="couponBagConfig = false"
            @addCoupon="updateCouponsList"
            @updateCoupon="updateCouponData"
        ></coupon-bag>
        <coupon-submit
            v-if="dialogVisible"
            :visible ='dialogVisible'
            @handleClose="dialogVisible = false"
            @fevent="goCouponBatchList()"
            :batchList='ruleForm.batchList'
            :freezeAmount='ruleForm.freezeAmount'
        >
        </coupon-submit>
        <el-dialog
            v-model="goodsClassifyDialogVisiable"
            :title="dataState.goodsAddType === 'batch' ? '批量添加' : '商品分类选择'"
            width="30%"
            :before-close="hideGoodsClassifyDialog"
        >
            <div v-if="dataState.goodsAddType === 'classify'">
                <el-cascader
                    ref="basicLevelRef"
                    :props="basicLevel"
                    @change="basicLevelChange"
                    v-model="dataState.basicLevelChecked"
                    v-if="basicLevelRefVisiable"
                    width="100%"
                    clearable
                >
                </el-cascader>
            </div>
            <div v-if="dataState.goodsAddType === 'batch'">
                <el-input v-model="dataState.batchAddIds" :autosize="{ minRows: 2, maxRows: 10 }" placeholder="一次最多输入200个id，请用英文逗号分隔" type="textarea"/>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="goodsClassifyDialogVisiable = false">取消</el-button>
                    <el-button type="primary" @click="dialogSubmit">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, computed, nextTick } from 'vue'
import comList from './apply-coupon-comList.vue'
import couponBag from './apply-coupon-bag.vue'
import couponSubmit from './coupon-submit.vue'
import goodsHasChecked from './goods-has-checked.vue'
import { addCouponBatch, getCouponDataSingle, updateCouponBatch, getCityList } from '@/api/marketing/coupon'
import { getMerchantList, publicRequest } from '@/api/operate/index'
import { getGoodsList } from '@/api/marketing/active'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { checkRole, yingyongQueryCategory, cityQueryCategory } from '@/utils'

const route = useRoute()
const router = useRouter()
// const { proxy } = getCurrentInstance()
const dialogVisible = ref(false)
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => props.handleType === 'detail' || props.handleType === 'approval')
const listDialogConfig = ref(false) // 页面子列表弹框
const goodsClassifyDialogVisiable = ref(false) // 商品分类纬度选择弹窗
// 券包 start
const couponTypeActiveName = ref('立减') // 营销工具tab选中
const signalCouponData = ref(null) // 营销券包单个优惠券项
const updateCouponIndex = ref(null) // 营销券包单个优惠券index
const couponBagConfig = ref(false) // 添加券包弹窗
const couponBagType = ref(null) // 券包弹窗类型，新增，编辑，复制
const instantlyCouponsList = ref([]) // 立减券
const spendEnoughCouponsList = ref([]) // 满减券
const discountCouponsList = ref([]) // 折扣券
const instantlyCouponsCount = computed(() => instantlyCouponsList.value.length)
const spendEnoughCouponsCount = computed(() => spendEnoughCouponsList.value.length)
const discountCouponsCount = computed(() => discountCouponsList.value.length)
const allCouponsList = computed(() => instantlyCouponsList.value.concat(spendEnoughCouponsList.value, discountCouponsList.value)) // 所有类型的券包整合
const allCouponsCount = computed(() => allCouponsList.value.length)
// 券包 end

const basicLevelRef = ref(null)
const authorityRef = ref(null)
const props = defineProps(['handleType', 'groupCode', 'subCode'])
const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59)
]
const value1 = ref([
    new Date(2000, 10, 10, 10, 10),
    new Date(2000, 10, 11, 10, 10)
])
const cascaderProps = { multiple: true } // 生效城市可多选

// 返回批次列表
const goCouponBatchList = async () => {
    router.push({ name: 'coupon-batch-list' })
}
const handleClose = () => {
    goCouponBatchList()
}
const ruleFormRef = ref('')
const dataState = reactive({
    authorityCheckedNodes: [],
    subListType: '', // 子弹框列表
    statusKeyValue: {
        1: '草稿',
        2: '待审批',
        3: '审批驳回',
        4: '待开始',
        5: '在线',
        6: '已停止',
        7: '已结束'
    },
    cityOption: [],
    hasSelectList: [], // 子弹窗列表已选项
    pointChecked: [], // 子弹窗列表点位（合同货柜）已选列表
    costCountHasSelectList: [], // 成本账户已选
    googdsHasSelectList: [], // 商品列表已选-商品纬度
    googdsClassifyList: [], // 商品列表已选-分类纬度
    shopHasSelectList: [], // 门店列表已选
    pointCurrentIndex: [], // 商品选择点位当前行数
    couponTypeTab: [
        {
            title: '立减',
            couponsList: []
        },
        {
            title: '满减',
            couponsList: []
        },
        {
            title: '折扣',
            couponsList: []
        }
    ],
    couponTypeKeyValue: {
        1: '立减',
        2: '满减',
        3: '折扣'
    },
    isEnabledKeyValue: {
        1: '启用',
        0: '停用'
    },
    userRangeTypeKeyValue: {
        1: '全部用户',
        2: 'App新注册用户',
        3: '已注册未下单用户',
        4: '已下单用户'
    },
    skuStatusKeyValue: {
        1: '待审核',
        2: '已审核',
        3: '已拒绝',
        4: '已上架',
        5: '下架可上架',
        6: '下架',
        7: '待上架'
    },
    basicLevelChecked: [], // 商品分类纬度选中
    effectiveCitysChecked: [], // 生效城市纬度选中
    basicLevelRefVisiable: true, // 商品分类纬度级联下拉框
    effectiveCitysVisiable: true, // 生效城市级联下拉框
    goodsAddType: '', // 新增商品，列表选择/批次添加
    batchAddIds: '', // 批次添加商品skuids
    batchAddType: '', // 批次添加类型 sku，spu，点位
    spuInfo: '' // 选择点位当前的spu商品
})
const {
    statusKeyValue,
    couponTypeTab,
    couponTypeKeyValue,
    userRangeTypeKeyValue,
    skuStatusKeyValue,
    shopHasSelectList,
    googdsHasSelectList,
    basicLevelRefVisiable,
    effectiveCitysVisiable,
    googdsClassifyList,
    isEnabledKeyValue,
    effectiveCitysChecked
} = toRefs(dataState)
const ruleForm = reactive({
    applier: '',
    groupName: '',
    groupStatus: 1,
    subCode: '',
    businessCode: '',
    dealType: [],
    acctInfo: [{ acctName: '', acctId: '', assumeRatio: '', budgetId: '' }],
    couponType: Number(route.params.couponType),
    maxMinusAmount: '',
    doorsillAmount: '',
    discountRate: '',
    applyCount: '',
    freezeAmount: '',
    cityRangeType: '',
    effectiveCitys: [],
    provinceCityInfo: [],
    userRangeType: '',
    goodsRangeType: '1',
    isValidTime: '',
    termType: null,
    isValidDays: 0,
    unValidDays: 0,
    useDate: [],
    singleUserMax: '',
    poiRangeInfo: {
        channelType: null,
        operateModel: null,
        isAssignStore: null,
        homeChannelType: 1,
        storeInfo: []
    },
    couponDesc: '',
    couponCalculate: ''
})

// 营销工具change
const couponTypeChange = () => {
    ruleForm.discountRate = ''
    ruleForm.maxMinusAmount = ''
    ruleForm.doorsillAmount = ''
    ruleForm.freezeAmount = ''
}

// 校验规则：支持输入整数数字，可输入范围0~100
const discountRateValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value > 0 && value <= 100) {
                callback()
            } else {
                callback(new Error('请输入大于0且小于等于100的数字'))
            }
        }
    }
}
// 校验规则：支持输入整数数字，可输入范围1~200000
const numberValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!isNaN(value) && reg.test(value)) {
            callback()
        } else {
            callback(new Error('仅限输入数字，支持小数点后两位'))
        }
        callback()
    }
}

// 校验规则：支持输入整数数字，可输入范围1~99999
const singleUserMaxValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value > 0 && value < 100000) {
                callback()
            } else {
                callback(new Error('限定数量99999张'))
            }
        }
    }
}

// 校验规则：数值格式，支持两位小数,最低预算
const freezeAmountValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!isNaN(value) && reg.test(value)) {
            if (ruleForm.couponType === 3) {
                const minValue = 10 * ruleForm.discountRate * ruleForm.applyCount / 100
                if (value >= minValue) {
                    // 如果通过校验，调用无参数的 `callback()` 即可
                    callback()
                } else {
                    callback(new Error('不得低于' + minValue + '(10*折扣比例*申请数量)'))
                }
            }
        } else {
            callback(new Error('仅限输入数字，支持小数点后两位'))
        }
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}

// 校验规则：数值格式，支持两位小数，最大不超过9999.99
const amountValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!isNaN(value) && reg.test(value)) {
            if (value > 0 && value < 10000) {
                // 如果通过校验，调用无参数的 `callback()` 即可
                callback()
            } else {
                callback(new Error('可输入范围0~9999.99'))
            }
        } else {
            callback(new Error('仅限输入数字，支持小数点后两位'))
        }
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}

// 校验规则：门槛金额需大于立减金额；数值格式，支持两位小数，最大不超过9999.99
const doorsillAmountValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!isNaN(value) && reg.test(value)) {
            if (value > 0 && value < 10000) {
                if (Number(value) > Number(ruleForm.maxMinusAmount)) {
                    // 如果通过校验，调用无参数的 `callback()` 即可
                    callback()
                } else {
                    callback(new Error('门槛金额需大于"最高立减金额"'))
                }
            } else {
                callback(new Error('可输入范围0~9999.99'))
            }
        } else {
            callback(new Error('仅限输入数字，支持小数点后两位'))
        }
        callback()
    }
}

// 校验规则：过期失效时间大于开始时间
const unValidDaysValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (value >= ruleForm.isValidDays) {
            // 如果通过校验，调用无参数的 `callback()` 即可
            callback()
        } else {
            callback(new Error('过期失效时间大于开始生效时间'))
        }
        callback()
    }
}

// 校验规则：批次有效期开始时间大于当前时间
const isValidTimeValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (!value || value === '') {
        callback(new Error('请选择'))
    } else {
        const currTime = Date.now()
        const start1 = new Date(value[0]).getTime()
        const start2 = new Date(ruleForm.useDate[0]).getTime()
        if (start1 < currTime) {
            callback(new Error('批次有效期开始时间应大于当前时间'))
        } else if (start2 && start2 < start1) {
            callback(new Error('批次有效期开始时间应小于券使用开始时间'))
        }
        callback()
    }
}

// 校验规则：券使用期限固定范围在批次有效期内
const useDateValidator = (rule, value, callback) => {
    if (!value || value === '') {
        callback(new Error('请选择'))
    } else {
        const start2 = new Date(value[0]).getTime()
        const end2 = new Date(value[1]).getTime()
        if (end2 <= start2) {
            callback(new Error('结束时间应大于开始时间'))
        }
        if (ruleForm.isValidTime && ruleForm.isValidTime[0]) {
            const start1 = new Date(ruleForm.isValidTime[0]).getTime()
            if (start2 < start1) {
                callback(new Error('开始时间应大于批次有效期开始时间'))
            }
        }
        callback()
    }
}
// 表单项规则
const rules = reactive({
    inputRule: [{ required: true, message: '请输入', trigger: 'change' }],
    selectRule: [{ required: true, message: '请选择', trigger: 'change' }],
    dataAuthority: [{ required: true, message: '请选择', trigger: 'change' }],
    numberRule: [{ required: true, validator: numberValidator, trigger: 'change' }],
    singleUserMax: [{ required: true, validator: singleUserMaxValidator, trigger: 'change' }],
    amountRule: [{ required: true, validator: amountValidator, trigger: 'change' }],
    freezeAmountRule: [{ required: true, validator: freezeAmountValidator, trigger: 'change' }],
    discountRateRule: [{ required: true, validator: discountRateValidator, trigger: 'change' }],
    doorsillAmountRule: [{ required: true, validator: doorsillAmountValidator, trigger: 'change' }],
    unValidDaysRule: [{ required: true, validator: unValidDaysValidator, trigger: 'change' }],
    isValidTimeRule: [{ required: true, validator: isValidTimeValidator, trigger: 'change' }],
    useDateRule: [{ required: true, validator: useDateValidator, trigger: 'change' }],
    name: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 20, message: '最长不超过20个字符长度', trigger: 'change' }
    ],
    textRule: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 200, message: '最长不超过200个字符长度', trigger: 'change' }
    ],
    effectiveCitys: [
        { required: true, message: '请选择', trigger: 'change' }
    ]
})

// 获取所有城市信息
const getCityOption = async () => {
    const res = await getCityList()
    if (res.code === '200') {
        dataState.cityOption = res.data
    }
}

// 初始化所选生效城市
// const initCityList = (cityInfo) => {
//     const cityRangeInfo = []
//     cityInfo.map((effectiveItem) => {
//         cityRangeInfo.push([effectiveItem.provinceCode, effectiveItem.cityCode])
//     })
//     return cityRangeInfo
// }

// 格式化所选生效城市
// const formatCityList = (cityInfo) => {
//     const cityRangeInfo = []
//     cityInfo.map((effectiveItem) => {
//         dataState.cityOption.map((cityListItem) => {
//             if (effectiveItem[0] === cityListItem.id) {
//                 cityListItem.children.map((childrenItem) => {
//                     if (effectiveItem[1] === childrenItem.id) {
//                         cityRangeInfo.push({
//                             provinceCode: childrenItem.parentId,
//                             provinceName: childrenItem.parentName,
//                             cityCode: childrenItem.value,
//                             cityName: childrenItem.label
//                         })
//                     }
//                 })
//             }
//         })
//     })
//     return cityRangeInfo
// }

// 获取优惠券批次单条数据
const getsingleData = async () => {
    const params = {
        appKey: props.subCode,
        busiCode: props.subCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        groupCode: props.groupCode,
        groupStatus: 1,
        operatorId: userInfo.value.account
    }
    const res = await getCouponDataSingle(params)
    Object.assign(ruleForm, res.data)
    // ruleForm.businessCode = ruleForm.businessCode
    ruleForm.dealType = ruleForm.dealType.split(',')
    if (props.handleType !== 'copy') {
        if (ruleForm.acctInfo && ruleForm.acctInfo.length > 0) {
            ruleForm.acctInfo.map((item) => {
                item.assumeRatio = item.assumeRatio * 100
            })
        } else {
            ruleForm.acctInfo = [{ acctName: '', acctId: '', assumeRatio: '', budgetId: '' }]
        }
    } else {
        ruleForm.acctInfo = [{ acctName: '', acctId: '', assumeRatio: '', budgetId: '' }]
    }
    ruleForm.cityRangeType = Number(ruleForm.cityRangeType)
    if (ruleForm.batchList && ruleForm.batchList.length > 0) {
        ruleForm.batchList.map((item) => {
            item.maxMinusAmount = item.maxMinusAmount / 100
            item.doorsillAmount = item.doorsillAmount / 100
            item.maxDiscountAmount = item.maxDiscountAmount / 100
            item.discountRate = item.discountRate * 100
            updateCouponsList(item)
        })
    }
    ruleForm.isValidTime = [res.data.isValidBeginTime, res.data.isValidEndTime]
    ruleForm.freezeAmount = res.data.freezeAmount / 100
    // 生效城市回显
    if (res.data.provinceCityInfo) {
        res.data.provinceCityInfo.forEach(item => {
            const catesInfo = [item.provinceCode, item.cityCode]
            dataState.effectiveCitysChecked.push(catesInfo)
        })
        dataState.effectiveCitysVisiable = false
        setTimeout(() => {
            dataState.effectiveCitysVisiable = true
        }, 100)
    }
    // 业务线=智能货柜，选择商品=全部商品
    if (res.data.goodsRangeType === 1 && ruleForm.businessCode === '2') {
        dataState.googdsHasSelectList = [{
            spuId: 'all_spu',
            point: res.data.goodsRangeInfo[0].pointCodeList[0] === 'all_point' ? '1' : '2', // 判断全部点位/指定点位
            pointCodeList: res.data.goodsRangeInfo[0].pointCodeList[0] === 'all_point' ? ['all_point'] : res.data.goodsRangeInfo[0].pointCodeList,
            pointChecked: res.data.goodsRangeInfo[0].pointCodeList
        }]
    }
    if (res.data.goodsRangeType === 2) {
        dataState.googdsHasSelectList = res.data.goodsRangeInfo ? res.data.goodsRangeInfo : []
        if (ruleForm.businessCode === '2') {
            dataState.googdsHasSelectList.map(item => {
                item.point = item.pointCodeList[0] === 'all_point' ? '1' : '2'
                item.pointChecked = item.pointCodeList
            })
        }
    } else if (res.data.goodsRangeType === 3) {
        dataState.googdsClassifyList = res.data.categoryInfo ? res.data.categoryInfo : []
    }
    ruleForm.poiRangeInfo.operateModel = Number(ruleForm.poiRangeInfo.operateModel)
    ruleForm.poiRangeInfo.isAssignStore = Number(ruleForm.poiRangeInfo.isAssignStore)
    ruleForm.poiRangeInfo.homeChannelType = Number(ruleForm.poiRangeInfo.homeChannelType)
    if (ruleForm.poiRangeInfo.storeInfo) dataState.shopHasSelectList = ruleForm.poiRangeInfo.storeInfo
}

if (props.handleType) {
    getCityOption()
    if (props.handleType !== 'add') {
        getsingleData()
    }
}

// 提交审批
const couponAudit = async () => {
    dialogVisible.value = true
}

// 新增成本账户
const addCostCount = () => {
    ruleForm.acctInfo.push({ acctName: '', acctId: '', assumeRatio: '' })
}
// 获取已选
const getDialogCheckedData = (info, index) => {
    if (dataState.subListType === 'costAccount') {
        ruleForm.acctInfo = []
        dataState.costCountHasSelectList = []
        if (info.length === 0) {
            ruleForm.acctInfo.push({ acctName: '', acctId: '', assumeRatio: '', budgetId: '' })
        }
        info.map((item, index) => {
            dataState.costCountHasSelectList.push(item)
            item = { ...item, assumeRatio: '' }
            ruleForm.acctInfo.push(item)
        })
    } else if (dataState.subListType === 'goodsSku' || dataState.subListType === 'goodsSkuGroup') {
        dataState.googdsHasSelectList = []
        info.map((item, index) => {
            dataState.googdsHasSelectList.push(item)
        })
    } else if (dataState.subListType === 'goodsSpu') {
        dataState.googdsHasSelectList = []
        info.map((item, index) => {
            if (!item.point) item.point = '1'
            item.pointCodeList = ['all_point']
            dataState.googdsHasSelectList.push(item)
        })
    } else if (dataState.subListType === 'shop') {
        dataState.shopHasSelectList = []
        info.map((item, index) => {
            dataState.shopHasSelectList.push(item)
        })
    } else if (dataState.subListType === 'point') {
        // dataState.googdsHasSelectList = []
        dataState.googdsHasSelectList[dataState.pointCurrentIndex].pointCodeList = []
        info.map((item) => {
            dataState.googdsHasSelectList[dataState.pointCurrentIndex].pointCodeList.push(item)
        })
    }
}
// 商品添加，sku商品，spu商品
const showGoodsDialog = () => {
    if (ruleForm.businessCode === '5') { // 业务线是到家
        showSubDialog('goodsSku')
    } else if (ruleForm.businessCode === '2') { // 业务线是智能货柜
        showSubDialog('goodsSpu')
    } else if (ruleForm.businessCode === 'A1001003') { // 业务线是本地生活-团购
        showSubDialog('goodsSkuGroup')
    }
}
// 展示子列表
const showSubDialog = (type, index, row) => {
    dataState.subListType = type
    if (dataState.subListType === 'costAccount') {
        dataState.hasSelectList = dataState.costCountHasSelectList
        listDialogConfig.value = true
    } else if (dataState.subListType === 'goodsSku' || dataState.subListType === 'goodsSkuGroup') {
        if (ruleForm.goodsRangeType === 2) {
            dataState.hasSelectList = dataState.googdsHasSelectList
            listDialogConfig.value = true
        } else if (ruleForm.goodsRangeType === 3) {
            // 商品分类纬度选择-show
            showGoodsClassifyDialog()
        }
    } else if (dataState.subListType === 'goodsSpu') {
        if (ruleForm.goodsRangeType === 2) {
            dataState.hasSelectList = dataState.googdsHasSelectList
            listDialogConfig.value = true
        } else if (ruleForm.goodsRangeType === 3) {
            // 商品分类纬度选择-show
            showGoodsClassifyDialog()
        }
    } else if (dataState.subListType === 'shop') {
        dataState.hasSelectList = dataState.shopHasSelectList
        listDialogConfig.value = true
    } else if (dataState.subListType === 'point') {
        dataState.hasSelectList = row.pointCodeList
        dataState.pointChecked = row.pointChecked
        dataState.pointCurrentIndex = index
        dataState.spuInfo = row
        listDialogConfig.value = true
    }
}
// 批次添加
const batchAddHandle = (type, index, row) => {
    dataState.goodsAddType = 'batch'
    dataState.batchAddType = type
    // dataState.hasSelectList = dataState.googdsHasSelectList
    goodsClassifyDialogVisiable.value = true
    if (type === 'point') {
        dataState.pointCurrentIndex = index
        dataState.spuInfo = row
    }
}

const showGoodsClassifyDialog = (type) => {
    dataState.goodsAddType = 'classify'
    dataState.basicLevelChecked = []
    dataState.googdsClassifyList.forEach(item => {
        const catesInfo = [item.firstCategoryId, item.secondCategoryId]
        dataState.basicLevelChecked.push(catesInfo)
    })
    goodsClassifyDialogVisiable.value = true
    dataState.basicLevelRefVisiable = false
    setTimeout(() => {
        dataState.basicLevelRefVisiable = true
    }, 100)
}
// 商品分类纬度选择-hide
const hideGoodsClassifyDialog = (type) => {
    goodsClassifyDialogVisiable.value = false
}

// 删除成本账户
const removeCostCount = (index) => {
    ruleForm.acctInfo.splice(index, 1)
    dataState.costCountHasSelectList.splice(index, 1)
}

// 商品表格-remove
const handleGoodsRemove = (index) => {
    dataState.googdsHasSelectList.splice(index, 1)
}
// 商品分类纬度表格-remove
const handleGoodsClassifyRemove = (index) => {
    dataState.googdsClassifyList.splice(index, 1)
}

// 业务线change
const businessCodeChange = (tab, event) => {
    ruleForm.dealType = []
    const channelType = []
    console.log(ruleForm.businessCode)
    if (ruleForm.businessCode === '2') {
        channelType.push(1)
        ruleForm.goodsRangeType = 1
        dataState.googdsHasSelectList = [{
            spuId: 'all_spu',
            point: '1',
            pointCodeList: ['all_point']
        }]
    } else {
        ruleForm.poiRangeInfo.operateModel = null
        dataState.googdsHasSelectList = []
    }
    if (ruleForm.businessCode === '3') {
        channelType.push(2)
    } else {
        ruleForm.poiRangeInfo.isAssignStore = null
        dataState.shopHasSelectList = []
    }
    if (ruleForm.businessCode === '5') {
        channelType.push(3)
    } else {
        ruleForm.goodsRangeType = 1
        ruleForm.poiRangeInfo.homeChannelType = 1
    }
    ruleForm.poiRangeInfo.channelType = channelType.join()
}

// 选择商品change
const goodsRangeTypeChange = (value) => {
    if (ruleForm.businessCode === '2' && value === 1) {
        dataState.googdsHasSelectList = [{
            spuId: 'all_spu',
            point: '1',
            pointCodeList: ['all_point']
        }]
    } else {
        dataState.googdsHasSelectList = []
    }
    dataState.googdsClassifyList = []
}

// 营销工具change
const couponTypeHandleClick = (tab, event) => {
    console.log(tab.props, event)
}
// 添加券包
const showCouponBag = (couponData) => {
    if (allCouponsCount.value >= 50) {
        ElMessage.warning('可添加50个券，已达上限')
        return
    }
    if (couponData) {
        signalCouponData.value = couponData
    }
    couponBagConfig.value = true
    couponBagType.value = 'add'
}
// 导出券码
const exportExcelCoupon = async (row) => {
    const params = {
        body: {
            batchCode: row.batchCode,
            appKey: 'A1001001',
            busiCode: 'A1001001',
            gmtOperate: new Date().getTime(),
            operatorId: userInfo.value.account
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC8867225242206208',
        name: '营销中台-按组或批次导出兑换码',
        source: '营销中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    await getMerchantList(params)
}
// 添加券列表
const updateCouponsList = (coupon) => {
    if (coupon.couponType === 1) {
        instantlyCouponsList.value.push(coupon)
        dataState.couponTypeTab[0].couponsList = instantlyCouponsList.value
    } else if (coupon.couponType === 2) {
        spendEnoughCouponsList.value.push(coupon)
        dataState.couponTypeTab[1].couponsList = spendEnoughCouponsList.value
    } else if (coupon.couponType === 3) {
        discountCouponsList.value.push(coupon)
        dataState.couponTypeTab[2].couponsList = discountCouponsList.value
    }
}

// 删除券列表项
const delCoupon = (index) => {
    if (couponTypeActiveName.value === '立减') {
        instantlyCouponsList.value.splice(index, 1)
        dataState.couponTypeTab[0].couponsList = instantlyCouponsList.value
    } else if (couponTypeActiveName.value === '满减') {
        spendEnoughCouponsList.value.splice(index, 1)
        dataState.couponTypeTab[1].couponsList = spendEnoughCouponsList.value
    } else if (couponTypeActiveName.value === '折扣') {
        discountCouponsList.value.splice(index, 1)
        dataState.couponTypeTab[2].couponsList = discountCouponsList.value
    }
}

// 编辑券列表项
const getSignalCoupon = (row, index) => {
    signalCouponData.value = row
    updateCouponIndex.value = index
    couponBagConfig.value = true
    couponBagType.value = 'edit'
}

// 编辑券列表项
const updateCouponData = (coupon) => {
    const couponIndex = updateCouponIndex.value
    if (coupon.couponType === 1) {
        Object.assign(instantlyCouponsList.value[couponIndex], coupon)
    } else if (coupon.couponType === 2) {
        Object.assign(spendEnoughCouponsList.value[couponIndex], coupon)
    } else if (coupon.couponType === 3) {
        Object.assign(discountCouponsList.value[couponIndex], coupon)
    }
}

// 应用类目联动
const basicLevel = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await yingyongQueryCategory(level + 1, data.value || '')
        console.log(res)
        const nodes = res.map(item => {
            return {
                label: item.name,
                value: item.code,
                level: item.level,
                leaf: level >= 1
            }
        })
        resolve(nodes)
        // if (res.length > 0) {
        // }
    }
}
// 应用类目change
const basicLevelChange = (value) => {
    dataState.basicLevelCheckedNodes = basicLevelRef.value.getCheckedNodes(true)
}
// 生效城市联动
const effectiveCitysProp = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await cityQueryCategory(level + 1, data.value || '')
        const nodes = res.map(item => {
            return {
                label: item.addressName,
                value: item.addressCode,
                level: item.level,
                leaf: level >= 1
            }
        })
        resolve(nodes)
    }
}
// 生效城市change
const effectiveCitysChange = (value) => {
    ruleForm.provinceCityInfo = []
    dataState.effectiveCitysCheckedNodes = authorityRef.value.getCheckedNodes(true)
    dataState.effectiveCitysCheckedNodes.forEach(item => {
        ruleForm.provinceCityInfo.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1]
        })
    })
}
// 选择商品分类纬度dialog提交
const dialogSubmit = async () => {
    if (dataState.goodsAddType === 'batch') {
        if (dataState.batchAddIds !== '') {
            if (dataState.batchAddIds.split(',').length < 200) {
                if (dataState.batchAddType === 'spu') {
                    batchAddSpu()
                } else if (dataState.batchAddType === 'sku') {
                    if (ruleForm.businessCode === '5') {
                        batchAddSku()
                    } else if (ruleForm.businessCode === 'A1001003') {
                        queryGroupSkuList()
                    }
                } else if (dataState.batchAddType === 'point') {
                    batchAddPoint()
                }
            } else {
                const message = '输入id超过上限200'
                ElMessage.warning(message)
                return
            }
        }
    } else if (dataState.goodsAddType === 'classify') {
        classifyAddSku()
    }
    goodsClassifyDialogVisiable.value = false
    dataState.batchAddIds = ''
}
// 分类选择sku商品 提交
const classifyAddSku = () => {
    dataState.googdsClassifyList = []
    dataState.basicLevelCheckedNodes.forEach((item) => {
        dataState.googdsClassifyList.push({
            firstCategoryId: item.pathValues[0],
            firstCategoryName: item.pathLabels[0],
            secondCategoryId: item.pathValues[1],
            secondCategoryName: item.pathLabels[1],
            threeCategoryId: item.pathValues[2],
            threeCategoryName: item.pathLabels[2]
        })
    })
}
// 批次选择sku商品 提交
const batchAddSku = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001004',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC16582257103870OxkY',
        name: '秒杀商品列表',
        source: '营销中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001004',
            channels: ruleForm.businessCode,
            skuIds: dataState.batchAddIds,
            currPage: 1,
            pageSize: 999
        }
    }
    const res = await getGoodsList(param)
    if (res.code === '200') {
        if (res.data.list) {
            res.data.list.map(item => {
                // item = { ...item, skuCode: item.skuId }
                dataState.googdsHasSelectList.push(item)
            })
            // 列表去重
            nextTick(() => {
                const obj = {}
                const arr = dataState.googdsHasSelectList.reduce((newArr, next) => {
                    if (!obj[next.skuId]) {
                        obj[next.skuId] = true && newArr.push(next)
                    }
                    return newArr
                }, [])
                dataState.googdsHasSelectList = arr
            })
        }
    }
}
// 批次选择Sku列表-团购
const queryGroupSkuList = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001003',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UCJH56463083344916480',
        name: '团购商品管理聚合',
        source: '运营后台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001003',
            skuIds: dataState.batchAddIds.split(','),
            pageNo: 1,
            pageSize: 999
        }
    }
    const res = await getGoodsList(param)
    if (res.code === '200') {
        res.data.list.map(item => {
            // item = { ...item, skuCode: item.skuId }
            dataState.googdsHasSelectList.push(item)
        })
        // 列表去重
        nextTick(() => {
            const obj = {}
            const arr = dataState.googdsHasSelectList.reduce((newArr, next) => {
                if (!obj[next.skuId]) {
                    obj[next.skuId] = true && newArr.push(next)
                }
                return newArr
            }, [])
            dataState.googdsHasSelectList = arr
        })
    }
}
// 批次选择spu商品 提交
const batchAddSpu = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            spuIds: dataState.batchAddIds.split(','),
            pageNo: 1,
            pageSize: 999
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC15115376448741376',
        name: 'spu通用搜索接口V2',
        source: '商品中台'
    }
    const res = await getMerchantList(params)
    if (res.list) {
        res.list.map(item => {
            item.point = '1'
            item.pointCodeList = ['all_point']
            dataState.googdsHasSelectList.push(item)
        })
        // 列表去重
        nextTick(() => {
            const obj = {}
            const arr = dataState.googdsHasSelectList.reduce((newArr, next) => {
                if (!obj[next.spuId]) {
                    obj[next.spuId] = true && newArr.push(next)
                }
                return newArr
            }, [])
            dataState.googdsHasSelectList = arr
        })
    }
}// 批次选择point 提交
const batchAddPoint = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            pointId: dataState.batchAddIds.split(','),
            spuId: dataState.spuInfo.spuId,
            pageNum: 1,
            pageSize: 999
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UCJH43371847664545792',
        name: '点位列表聚合',
        source: '运营后台'
    }
    const res = await publicRequest(params)
    console.log(res)
    if (res.code === '200') {
        if (res.data.list) {
            res.data.list.map(item => {
                dataState.googdsHasSelectList[dataState.pointCurrentIndex].pointCodeList.push(item.pointId)
            })
            // 列表去重
            nextTick(() => {
                const arr = new Set(dataState.googdsHasSelectList[dataState.pointCurrentIndex].pointCodeList)
                dataState.googdsHasSelectList[dataState.pointCurrentIndex].pointCodeList = Array.from(arr)
            })
        }
    }
}
// 商品表格点位生效change
const handleSpuPointChange = (value, index) => {
    if (value === '1') {
        dataState.googdsHasSelectList[index].pointCodeList = ['all_point']
    } else if (value === '2') {
        dataState.googdsHasSelectList[index].pointCodeList = []
    }
    dataState.googdsHasSelectList[index].point = value
}
// 提交表单
const submitForm = async (formEl) => {
    const params = JSON.parse(JSON.stringify(ruleForm))
    const couponsList = instantlyCouponsList.value.concat(spendEnoughCouponsList.value, discountCouponsList.value)
    params.appKey = ruleForm.subCode
    params.busiCode = ruleForm.subCode
    params.dealType = params.dealType.join()
    params.operatorId = userInfo.value.account
    params.applier = userInfo.value.name
    params.applierId = userInfo.value.account
    params.gmtOperate = new Date().getTime()
    params.acctInfo = JSON.parse(JSON.stringify(ruleForm.acctInfo))
    params.poiRangeInfo = JSON.parse(JSON.stringify(ruleForm.poiRangeInfo))
    params.batchList = JSON.parse(JSON.stringify(couponsList))
    params.acctInfo.map((item) => {
        item.assumeRatio = item.assumeRatio / 100
    })
    params.isValidBeginTime = params.isValidTime[0] || ''
    params.isValidEndTime = params.isValidTime[1] || ''
    params.freezeAmount = params.freezeAmount * 100
    params.goodsRangeInfo = []
    if (params.cityRangeType === 1) params.provinceCityInfo = []
    let pointValid // 商品列表里所选点位是否已经指定
    if (ruleForm.businessCode === '5' || ruleForm.businessCode === 'A1001003') { // 业务线-电商到家
        if (ruleForm.goodsRangeType === 2) {
            dataState.googdsHasSelectList.forEach(item => {
                params.goodsRangeInfo.push({
                    skuId: item.skuId,
                    skuName: item.skuName
                })
            })
        } else if (ruleForm.goodsRangeType === 3) {
            params.categoryInfo = dataState.googdsClassifyList
        }
    } else if (ruleForm.businessCode === '2') { // 业务线-智能货柜
        if (ruleForm.goodsRangeType === 2) {
            dataState.googdsHasSelectList.forEach(item => {
                if (item.point === '2' && item.pointCodeList.length === 0) pointValid = true
                params.goodsRangeInfo.push({
                    spuId: item.spuId,
                    pointCodeList: item.pointCodeList
                })
            })
        } else if (ruleForm.goodsRangeType === 3) {
            params.categoryInfo = dataState.googdsClassifyList
        } else if (ruleForm.goodsRangeType === 1) {
            params.goodsRangeInfo.push({
                spuId: 'all_spu',
                pointCodeList: dataState.googdsHasSelectList[0].pointCodeList
            })
            if (dataState.googdsHasSelectList[0].pointCodeList.length === 0) pointValid = true
        }
    }
    params.poiRangeInfo.storeInfo = []
    dataState.shopHasSelectList.forEach(item => {
        params.poiRangeInfo.storeInfo.push(item)
    })
    if (props.handleType === 'copy') {
        params.batchList.map((item) => {
            delete item.batchName
            delete item.batchCode
            delete item.groupCode
            delete item.groupName
            delete item.freezeAmount
        })
        params.acctInfo.map((item) => {
            delete item.groupCode
            delete item.groupName
        })
        delete params.auditWorkId
        delete params.auditName
        delete params.auditStatus
        delete params.auditTime
        delete params.auditRemark
        delete params.poiRangeInfo.groupCode
        delete params.poiRangeInfo.groupName
        delete params.submitAuditTime
    }
    params.batchList.map((item) => {
        item.maxMinusAmount = Math.round(Number(item.maxMinusAmount) * 100)
        item.maxDiscountAmount = Math.round(Number(item.maxDiscountAmount) * 100)
        item.doorsillAmount = Math.round(Number(item.doorsillAmount) * 100)
        item.discountRate = item.discountRate / 100
        if (props.handleType === 'copy') {
            if (item.groupCode) {

            }
        }
    })
    delete params.isValidTime
    if (pointValid) {
        ElMessage.warning('请选择合同设备范围')
        return
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if (couponsList.length === 0) {
                ElMessage.warning('请添加优惠券')
                return
            }
            if (props.handleType === 'add' || props.handleType === 'copy') {
                const res = await addCouponBatch({ ...params })
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                }
            } else {
                const res = await updateCouponBatch({ ...params, groupCode: props.groupCode })
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                }
            }
        }
    })
}
const openRemarkSpu = () => {
    ElMessageBox.alert(
        '商品选择影响优惠券核销，在订单结算时刻，系统会将优惠券的优惠金额只分摊给已选择的商品。',
        '选择spu',
        {
            dangerouslyUseHTMLString: true
        }
    )
}
const openRemarkPoint = () => {
    ElMessageBox.alert(
        '<P>1）优惠券生效对象是点位，如果点位新增或变更所绑定设备，不会影响优惠券配置生效。</P><P>2）仅已选点位所绑定的设备可以核销优惠券。</P><P>3）点位：系统根据货柜售卖合同中购买数量条款，生成的点位数据，合同约定多少台设备，则生成对应数量点位ID。点位用于激活设备，设备ID和点位ID绑定后，则设备激活。</P>',
        '生效点位范围',
        {
            dangerouslyUseHTMLString: true
        }
    )
}
</script>
<style lang="scss" scoped>
    .coupon-submit-box{
        :deep(.el-dialog){
          min-width: 800px;
        }
        :deep(.el-dialog__body){
          height: 500px;
          overflow-y: scroll;
        }
        .form-action-item-50w{
            width: 50%;
        }
        .form-action-item-100w{
            width: 100%;
        }
        .coupon-type{
            .add-coupon{
                position: absolute;
                right: 50%;
                top: 0;
                color: #fe2c55;
                cursor: pointer;
                text-decoration: underline;
                z-index: 9;
            }
        }
        .goods-list{
          padding: 0;
          margin-left: 150px;
          margin-bottom: 30px;
        .remark-icon{
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 10px;
            background: #fe2c55;
            color: #fff;
            font-size: 12px;
            text-align: center;
            line-height: 17px;
            cursor: pointer;
        }
        //   border: 1px solid #ccc;
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
          margin: 30px;
          text-align: center;
        }
    }
</style>
