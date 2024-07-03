<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="140px">
                    <el-form-item label="设备编号" prop="deviceCode">
                        <el-input v-model.trim="searchData.deviceCode" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="代运营商名称" prop="operatorName">
                        <el-input v-model.trim="searchData.operatorName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="IOT系统设备编码" prop="iotDeviceCode">
                        <el-input v-model.trim="searchData.iotDeviceCode" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="厂商设备编码" prop="manufacturerDeviceCode">
                        <el-input v-model.trim="searchData.manufacturerDeviceCode" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="柜主名称" prop="ownerName">
                        <el-input v-model.trim="searchData.ownerName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="合同编号" prop="contractCode">
                        <el-input v-model.trim="searchData.contractCode" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="合同货柜编号" prop="pointCode">
                        <el-input v-model.trim="searchData.pointCode" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="省份" prop="provinceCode">
                        <el-cascader ref="areaRef" :props="goodsCannotSkuArea" @change="skuAreaChange" v-model="searchData.areaAddress" :collapse-tags="true" clearable />
                        <!-- <el-select v-model="searchData.provinceCode" placeholder="省份" @change="cahngeProvice" clearable class="input-line">
                            <el-option v-for="el in addressList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                        </el-select> -->
                    </el-form-item>
                    <!-- <el-form-item label='城市' prop="cityCode">
                        <el-select v-model="searchData.cityCode" placeholder="城市" clearable class="input-line">
                            <el-option v-for="el in cityList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                        </el-select>
                    </el-form-item> -->
                    <!-- 这是设备在线状态新增开始-->
                    <el-form-item label="设备在线状态" prop="onlineState">
                        <el-select v-model="searchData.onlineState" placeholder="设备在线状态" clearable class="input-line">
                            <el-option label="在线" :value="1" key="1" />
                            <el-option label="离线" :value="0" key="0" />
                        </el-select>
                    </el-form-item>
                    <!-- 这是设备在线状态结束-->
                    <!-- 这是设备异常状态新增开始-->
                    <el-form-item label="设备异常状态" prop="abnormalState">
                        <el-select v-model="searchData.abnormalState" placeholder="设备异常状态" clearable class="input-line">
                            <el-option label="正常" :value="1" key="1" />
                            <el-option label="异常" :value="2" key="2" />
                        </el-select>
                    </el-form-item>
                    <!-- 这是设备异常状态结束-->
                    <!-- 支持开门交易方式-->
                    <el-form-item label="支持开门交易方式" prop="supportOpenMethod">
                        <el-select v-model="searchData.supportOpenMethod" placeholder="支持开门交易方式" clearable class="input-line">
                            <el-option label="恒生活APP扫码开门" value="1" key="1" />
                            <el-option label="微信小程序扫码开门" value="2" key="2" />
                            <el-option label="PAD刷脸开门" value="3" key="3" />
                            <el-option label="微信小程序扫码开门-中邮" value="4" key="4" />
                        </el-select>
                    </el-form-item>
                    <!-- 支持开门交易方式-->
                    <!-- 设备激活状态-->
                    <el-form-item label="设备激活状态" prop="activeState">
                        <el-select v-model="searchData.activeState" placeholder="设备激活状态" @change="cahngeProvice" clearable class="input-line">
                            <el-option label="未激活" value="0" key="0" />
                            <el-option label="已激活" value="1" key="1" />
                        </el-select>
                    </el-form-item>
                    <!-- 设备激活状态-->
                    <!-- 设备锁定状态-->
                    <el-form-item label="设备锁定状态" prop="lockState">
                        <el-select v-model="searchData.lockState" placeholder="设备锁定状态" @change="cahngeProvice" clearable class="input-line">
                            <el-option label="未锁定" value="0" key="0" />
                            <el-option label="已锁定（柜主可解锁）" value="1" key="1" />
                            <el-option label="已锁定（柜主不可解锁）" value="2" key="2" />
                        </el-select>
                    </el-form-item>
                    <!-- 设备锁定状态-->
                    <!-- 设备型号开始-级联-->
                    <el-form-item label="设备型号" prop="basicLevelChecked">
                        <el-cascader ref="basicLevelRef" :options="options" @change="basicLevelChange" v-model="searchData.basicLevelChecked" remote clearable />
                    </el-form-item>
                    <!-- 设备型号结束-->
                    <br />
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="getList(true)"> 搜索 </el-button>
                        <el-button type="primary" @click="resetForm(formRef)"> 重置 </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list
                    :tHead="tHead"
                    :tableData="tableData"
                    border="border"
                    v-model:current-page="pageInfo.page"
                    v-model:page-size="pageInfo.pageSize"
                    :total="pageInfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #deviceInfo="{ row }">
                        <div class="info">
                            <div>设备编号&nbsp;:&nbsp;{{ row.deviceCode ? row.deviceCode : '-' }}</div>
                            <div>设备名称&nbsp;:&nbsp;{{ row.deviceName ? row.deviceName : '-' }}</div>
                            <div>设备型号&nbsp;:&nbsp;{{ row.deviceModelName ? row.deviceModelName : '-' }}</div>
                        </div>
                    </template>
                    <template #iotInfo="scope">
                        <div class="info">
                            <!-- <div>IOT系统&nbsp;:&nbsp;{{ scope.row.iotSysId === 1 ? '619': scope.row.iotSysId === 2 ? '微米' : scope.row.iotSysId === 3 ? '易触' : scope.row.iotSysId === 4?'物联网平台':'虚拟货柜'}}</div> -->
                            <div>IOT系统&nbsp;:&nbsp;{{ iotSysIdlist[scope.row.iotSysId] }}</div>
                            <div>IOT系统设备编号&nbsp;:&nbsp;{{ scope.row.iotDeviceCode }}</div>
                        </div>
                    </template>
                    <template #companyDevInfo="scope">
                        <div class="info">
                            <div>厂商设备编号&nbsp;:&nbsp;{{ scope.row.manufacturerDeviceCode }}</div>
                            <div>厂商&nbsp;:&nbsp;{{ scope.row.manufacturerName }}</div>
                        </div>
                    </template>
                    <template #contractInfo="scope">
                        <div class="info">
                            <div>合同编号&nbsp;:&nbsp;{{ scope.row.contractCode }}</div>
                            <div>合同货柜编号&nbsp;:&nbsp;{{ scope.row.pointCode }}</div>
                            <div>
                                运营模式&nbsp;:&nbsp;
                                <template v-if="scope.row.operationModel === 1">自营</template>
                                <template v-if="scope.row.operationModel === 2">售卖</template>
                                <template v-if="scope.row.operationModel === 3">租赁</template>
                                <template v-if="scope.row.operationModel === 4">分期</template>
                            </div>
                        </div>
                    </template>
                    <template #operatorInfo="scope">
                        <div class="info">
                            <div>柜主&nbsp;:&nbsp;{{ scope.row.ownerName }}</div>
                            <div>代运营商&nbsp;:&nbsp;{{ scope.row.operatorName ?? '-' }}</div>
                        </div>
                    </template>
                    <template #onlineState="scope">
                        <div class="info">
                            <div>
                                在线状态&nbsp;:&nbsp; <span :style="scope.row.onlineState === 1 ? 'color:#66c18c' : 'color:red'">{{ scope.row.onlineState === 1 ? '在线' : '离线' }}</span>
                            </div>
                            <div>
                                设备状态&nbsp;:&nbsp;<span :style="scope.row.deviceState === 1 ? 'color:#66c18c' : 'color:red'"
                                >{{ scope.row.deviceState === 1 ? '正常' : '异常' }}
                                    <span v-if="scope.row.deviceState !== 1" @click="handleEdit('state', scope.row)" style="background: none; border: none; color: #303133">查看</span></span
                                >
                            </div>
                            <div>
                                设备激活状态&nbsp;:&nbsp; <span>{{ scope.row.activeState === 1 ? '已激活' : '未激活' }}</span>
                            </div>
                            <div>
                                设备锁定状态&nbsp;:&nbsp; <span>{{ scope.row.lockState === 0 ? '未锁定' : scope.row.lockState === 2 ? '已锁定（柜主不可解锁)' : '已锁定（柜主可解锁）' }}</span>
                            </div>
                        </div>
                        <span v-show="scope.row.status === 3" style="color: #ccc"> - </span></template
                    >
                    <template #supportOpenMethods="{ row }">
                        <div class="info">
                            <span>{{
                                row.supportOpenMethods?.[0] === 1
                                    ? '恒生活APP扫码开门'
                                    : row.supportOpenMethods?.[0] === 2
                                        ? '微信小程序扫码开门'
                                        : row.supportOpenMethods?.[0] === 3
                                            ? 'PAD刷脸开门'
                                            : row.supportOpenMethods?.[0] === 4
                                                ? '微信小程序扫码开门-中邮'
                                                : ''
                            }}</span
                            ><br />
                            {{
                                row.supportOpenMethods?.[1] === 1
                                    ? '恒生活APP扫码开门'
                                    : row.supportOpenMethods?.[1] === 2
                                        ? '微信小程序扫码开门'
                                        : row.supportOpenMethods?.[1] === 3
                                            ? 'PAD刷脸开门'
                                            : row.supportOpenMethods?.[1] === 4
                                                ? '微信小程序扫码开门-中邮'
                                                : ''
                            }}<br />
                            <span>{{
                                row.supportOpenMethods?.[2] === 1
                                    ? '恒生活APP扫码开门'
                                    : row.supportOpenMethods?.[2] === 2
                                        ? '微信小程序扫码开门'
                                        : row.supportOpenMethods?.[2] === 3
                                            ? 'PAD刷脸开门'
                                            : row.supportOpenMethods?.[2] === 4
                                                ? '微信小程序扫码开门-中邮'
                                                : ''
                            }}</span
                            ><br />
                            <span>{{
                                row.supportOpenMethods?.[3] === 1
                                    ? '恒生活APP扫码开门'
                                    : row.supportOpenMethods?.[3] === 2
                                        ? '微信小程序扫码开门'
                                        : row.supportOpenMethods?.[3] === 3
                                            ? 'PAD刷脸开门'
                                            : row.supportOpenMethods?.[3] === 4
                                                ? '微信小程序扫码开门-中邮'
                                                : ''
                            }}</span
                            ><br />
                        </div>
                    </template>
                    <template #operation="{ row }">
                        <div>
                            <span class="span" @click="handleEdit('erweima', row)">查看二维码</span>&nbsp; <span class="span" @click="handleEdit('detail', row)">查看信息</span>&nbsp;
                            <span class="span" @click="bindDevice(row.deviceCode)">解除绑定</span>&nbsp;
                            <span class="span" @click="handleClick('通知设备锁定', 'UC18689741064630272', row.deviceCode, row.lockState, 'locks')">{{
                                row.lockState === 0 ? '远程锁定' : '解除锁定'
                            }}</span
                            >&nbsp; <span class="span" @click="handleReset('远程重启', 'UC35821265353445376', row.deviceCode, 'reset')">重启设备</span>&nbsp;
                            <!-- <span v-if="row?.cabinetAttr?.supportOpenDoor" class="span" @click="handleOpenModel('远程开门', 'UC18727152654086144',row.deviceCode, 'open')">远程开门11</span>&nbsp; -->

                            <span v-if="row?.cabinetAttr?.supportOpenDoor" class="span" @click="handleClick('远程开门', 'UC18727152654086144', row.deviceCode, 'open', row?.cabinetAttr?.doorSize )">远程开门</span>&nbsp;
                            <span v-if="row?.cabinetAttr?.supportOpenLock" class="span" @click="handleLock('远程提锁', 'UC18727250188431360', row.deviceCode, 'lock', row?.cabinetAttr?.doorSize)">设备提锁</span>
                        </div>
                    </template>
                </system-list>
            </div>
        </el-card>
        <cst-form v-model="visible" v-if="visible" :deviceCode="dataState.deviceCode" :ownerId="dataState.ownerId" :type="dataState.type" @getList="getList"></cst-form>
        <el-drawer v-model="drawer" direction="rtl">
            <template #title>
                <h4>申请解除设备绑定</h4>
            </template>
            <template #default>
                <div>
                    <p>操作解除设备绑定后,系统会创建工单由管理员审批</p>
                    <br />
                    <p>管理员审批后</p>
                    <br />
                    <p>1、解除设备和柜主的绑定关系</p>
                    <br />
                    <p>2、解除设备合同,点位的绑定关系</p>
                    <br />
                    <p>3、消费者不能扫码购物</p>
                    <br />
                    请确认 ！
                </div>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancelClick">关闭</el-button>
                    <el-button type="primary" @click="confirmClick(bindDcode)">确认</el-button>
                </div>
            </template>
        </el-drawer>

        <el-dialog v-model="handleVisible" width="30%" :title="codeParams.lockState === 'open' ? '远程开门' : '远程操作'" :before-close="handleClose">
            <div v-show="codeParams.lockState === 0">
                <el-form ref="formSub" :rules="rule">
                    <el-form-item props="region">
                        <el-radio-group v-model="activeState">
                            <el-radio :label="1">锁定（柜主可解锁）</el-radio>
                            <el-radio :label="2">锁定（柜主不可解锁）</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <ol class="unremot-tips-title-content" v-show="codeParams.lockState === 0">
                <li>请不要在消费者交易时远程操作设备</li>
                <li>锁定设备后，消费者不能发起扫码开门交易。</li>
                <li>设定柜主不能进行解锁，则解锁权限仅开放给运营平台。</li>
            </ol>
            <div v-show="codeParams.lockState !== 0">
                <template v-if="codeParams.lockState !== 'open' && codeParams.name !== '远程重启' && codeParams.name !== '远程提锁'">
                    <span>请注意，不要在用户交易时刻远程操作设备，继续操作请确认</span></template
                >
            </div>
            <div v-show="codeParams.lockState === 'open'">
                <h5 style="margin-top: -10px; margin-bottom: 20px">提示:远程操作开门需要经过授权</h5>
                <div class="device-open">
                    <!-- <p>系统将短信形式给以上角色发送6位授权码，请您联系对方获取</p > -->

                    <div class="select-area">
                        <el-select v-model="user" placeholder="请选择" @change="changeUser" class="user-select">
                            <el-option v-for="(item, index) in userList" :key="index" :label="item.merchantName" :value="item.phoneMobile" />
                        </el-select>
                        <el-button type="primary" :disabled="sendDisabled" @click="getCode">{{ text }}</el-button>
                    </div>
                </div>
                <p class="sendmsg" style="margin-top: 20px">
                    系统将短信形式给以上角色<span style="color: #fe7e41">(尾号{{ lastCode }})</span>发送6位授权码，请您联系对方获取
                </p>
                <div class="auth-code">
                    <p>请提交授权码, 提交正确则系统会下发远程开门指令</p>
                    <div class="code">
                        <span style="padding-right: 8px; width: 80px">授权码</span>
                        <el-input type="text" v-model="sms" placeholder="请输入授权码" :disabled="!user" maxlength="6" style="width: 150px" />
                    </div>
                </div>
            </div>
            <!-- <div v-show="codeParams.lockState === 'reset'">
                当前设备有消费者正在开门购物，请在交易结束后操作，感谢！
            </div>
            <div v-show="codeParams.lockState === 'lock'">
                只有在门锁状态为“锁关门开”的状态下，可以操作远程提锁！
            </div> -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button v-if="codeParams.lockState === 'open'" type="primary" @click="confirmClicks('open')">确认</el-button>
                    <!-- <el-button type="primary" @click="handleOpenVisibles = false">关闭</el-button> -->
                    <el-button v-else @click="handleSomeClick(codeParams.name, codeParams.code, codeParams.num, codeParams.lockState)">确认</el-button>
                    <el-button type="primary" @click="onClose">取消</el-button>
                </span>

                <!-- <span class="dialog-footer">

                    <el-button v-if="codeParams.lockState === 'open'" type="primary" @click="confirmClicks('open')">确认</el-button>
                    <el-button v-else-if="codeParams.lockState === 0" @click="handleSomeClick(codeParams.name, codeParams.code, codeParams.num, codeParams.lockState)">确认</el-button>
                    <el-button type="primary" @click="onClose">取消</el-button>
                </span> -->
            </template>
        </el-dialog>
        <el-dialog title="设备二维码" v-model="handleCatVisible" width="50%" center :before-close="handleClose" v-if="handleCatVisible">
            <div class="qrcode">
                <div class="qrcode-item">
                    <p>设备中台二维码</p>
                    <qrcode-vue :value="erweimaUrl" :size="150" level="H" />
                    <p>{{ dataState.deviceCode }}</p>
                </div>
                <div class="qrcode-item">
                    <p>物联网平台二维码</p>
                    <qrcode-vue :value="erweimaUrl2" :size="150" level="H" />
                    <p>{{ dataState.deviceCode }}</p>
                </div>
                <div v-if="erweimaUrlQRCode" class="qrcode-item">
                    <p>微信小程序-中邮二维码</p>
                    <qrcode-vue :value="erweimaUrlQRCode" :size="150" level="H" />
                    <p>{{ dataState.deviceCode }}</p>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleCatVisibleMethods">关闭</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog title="远程提锁" v-model="lockVisible" width="50%" center>
            <div>只有在门锁状态为“锁关门开”的状态下，可以操作远程提锁！</div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary">关闭</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog title="远程重置" v-model="resetVisible" width="50%" center>
            <div>当前设备有消费者正在开门购物，请在交易结束后操作，感谢！</div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleOpenVisibles = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog title="设备异常状态" v-model="handleCatState" width="30%" :before-close="handleClose" v-if="deviceStateData">
            <ul class="warning-error" style="list-style: none; padding-left: 30px">
                <li>
                    <div><span style="padding-left:0px">网络状态</span><span :class="{ red_color: deviceStateData.networkState !== 1 }">{{ deviceStateData.networkState === 1 ? '正常' : '异常' }}</span></div>
                </li>
                <li v-if="supportCameraAlarm">
                    <div style="height: 50px;"><span style="padding-left:0px">摄像头状态</span>
                        <template v-for="(item, index) in  deviceStateData.doorAbnormalStateList" :key="index" :class="{red_color: item.cameraAbnormalState !== 1}">
                            <span v-if="index === 0" :class="{ red_color: item.cameraAbnormalState !== 1 }" style="padding-left:  154px">
                                <template v-if="item.doorType !== 0">
                                    {{ item.doorName }}:
                                </template>
                                {{ item.cameraAbnormalState === 1?'正常': item.cameraAbnormalState === 2?'异常':'' }}
                            </span>
                            <span v-else style="padding-left:  224px" :class="{ red_color: item.cameraAbnormalState !== 1 }">
                                <template v-if="item.doorType !== 0">{{  item.doorName}}:</template>
                                {{ item.cameraAbnormalState === 1?'正常': item.cameraAbnormalState === 2?'异常':'' }}
                            </span>
                        </template>
                    </div>
                </li>

                <li v-if="supportDoorLockAlarm">
                    <div style="height: 50px;"><span style="padding-left:0px;">门锁状态</span>
                        <template v-for="(item, index) in deviceStateData.doorAbnormalStateList" :key="index">
                            <span :class="{ red_color: item.doorLockAbnormalState !== 1 }" v-if="index === 0" style="padding-left:  170px">
                                <template v-if="item.doorType !== 0">
                                    {{ item.doorName }}:
                                </template>{{ item.doorLockAbnormalState === 1?'正常': item.doorLockAbnormalState === 2?'异常':'' }}
                            </span>
                            <span v-else style="padding-left:  224px" :class="{red_color: item.doorLockAbnormalState !== 1}">
                                <template v-if="item.doorType !== 0">{{ item.doorName }}:</template> {{ item.doorLockAbnormalState === 1?'正常': item.doorLockAbnormalState === 2?'异常':'' }}
                            </span>
                        </template>
                    </div>
                </li>
                <li v-if="supportTemperatureAlarm"><div><span style="padding-left:0px">温度状态</span><span v-if="supportTemperatureAlarm" :class="{red_color: deviceStateData.temperatureState !== 1}">{{deviceStateData.temperatureState === 1 ?'正常':'异常'}}</span></div></li>
                <li>
                    <div><span style="padding-left:0px">位置状态</span><span v-if="deviceStateData.locationState" :class="{ red_color: deviceStateData.locationState !== 1 }">{{ deviceStateData.locationState === 1 ? '正常' : '异常' }}</span></div>
                </li>
            </ul>
            <div class="tips-error" style="padding-left: 30px; matin-top: 20px">
                <h4 class="h4-title">异常问题检查方法：</h4>
                <ul class="title-content" style="list-style: none">
                    <li>1. 检查设备是否断电</li>
                    <li>2. 检查设备网络信号</li>
                    <li>3. 检查设备流量卡是否欠费停机</li>
                    <li>4. 检查设备APP是否正常运行</li>
                    <li>5. 如无以上问题，请联系客服</li>
                </ul>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="getequsttaus">获取设备最新状态</el-button>
                    <el-button type="primary" @click="handleCatState = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 获取设备最新状态开始 -->
        <el-dialog
            v-if="selectDoor"
            :title="dataState.openLockState=== 'opendoor'?'远程开门':'设备提锁'" class="agreeDialog"
            v-model="selectDoor"
            width="30%"
        >
            <div class="unbind-remotelock">
                <p>请选择要操作的门</p>
                <el-radio-group v-model="checked">
                    <el-radio :label="1">左门</el-radio>
                    <el-radio :label="2">右门</el-radio>
                </el-radio-group>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="slectDoorSave">提交</el-button>
                    <el-button type="primary" @click="cancelClickDoor">关闭</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="equststus" title="确定获取设备最新状态" class="agreeDialog shootingShow">
            <div class="unbind-tips">
                <!-- <p class="unbind-tips-desc">操作解除设备绑定后，系统会创建工单由管理员审批</p>-->
                <h4 class="unremot-tips-title">提示：</h4>
                <ul class="unremot-tips-title-content">
                    <li>1、单个设备每10秒最多只能下发1个更新指令，请勿频繁操作。</li>
                    <li>2、下发更新指令后，设备返回结果需要一定时间，请耐心等待。</li>
                </ul>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="getRefreshStatus">确定</el-button>
                    <!-- <el-button type="primary" @click="equststus = false">关闭</el-button> -->
                    <el-button type="primary" @click="equststusCancle">关闭</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 获取设备最新状态结束-->

    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import QrcodeVue from 'qrcode.vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref, toRefs, computed } from 'vue'
import { devicetList, keyCode } from '@/api/deviceManager'
import { getMerchantList, getMerchantListCode, getMerchantListCodes } from '@/api/operate/index'
import { queryCategoryDevice } from '@/utils'

import CstForm from './src/form2.vue'

const store = useStore()
const formSub = ref()
const userInfo = computed(() => store.state.userInfo)
const tHead = [
    { align: 'center', prop: 'deviceInfo', label: '设备信息', width: 200, slot: true },
    { align: 'center', prop: 'iotInfo', label: 'IOT信息', minWidth: 200, slot: true },
    { align: 'center', prop: 'companyDevInfo', label: '厂商设备信息', minWidth: 200, slot: true },
    { align: 'center', prop: 'contractInfo', label: '合同和合同货柜编号', minWidth: 200, slot: true },
    { align: 'center', prop: 'operatorInfo', label: '运营商信息', minWidth: 150, slot: true },
    { align: 'center', prop: 'onlineState', label: '设备状态', minWidth: 150, slot: true },
    { align: 'center', prop: 'supportOpenMethods', label: '支持开门方式', minWidth: 150, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 150, fixed: 'right', slot: true }
]

// const areaAddress = ref('')
let doortypes = 1

const rule = reactive({
    region: [
        {
            required: true,
            message: '请选择',
            trigger: 'change'
        }
    ]
})
const iotSysIdlist = {
    1: '619',
    2: '微米',
    3: '易触',
    4: '物联网平台',
    5: '虚拟货柜'
}
const options = ref([])

const dataState = reactive({
    doorsize: 1,
    tableData: [],
    resourceCode: null,
    deviceCode: null,
    type: null,
    qrcodeShow: false,
    currentVal: null,
    visible: false,
    openLockState: 'opendoor',
    handleCatVisible: false, // 二维码弹窗
    handleCatVisibles: false, // 二维码弹窗

    user: '',
    sms: '',
    text: '获取授权码',
    sendDisabled: false,
    handleOpenVisible: false, // 远程开门弹窗
    userList: [],
    // userList: [
    //     { label: '柜主-章三', value: '1892000028320' },
    //     { label: '柜主-章三1', value: '1892000028321' },
    //     { label: '柜主-章三2', value: '1892000028322' },
    //     { label: '柜主-章三3', value: '1892000028323' }
    // ],
    drawer: false,
    ownerId: '',
    dialogType: null,
    searchData: {
        deviceCode: '', // 设备编号
        operatorName: '', // 代运营商
        iotDeviceCode: '', // IOT系统设备编码编码
        manufacturerName: '', // 厂商
        manufacturerDeviceCode: '', // 厂商设备编码
        abnormalState: '',
        contractCode: '', // 合同编码
        provinceCode: '', // 省份
        cityCode: '', // 城市
        pointCode: '', // 合同点位编码
        ownerId: '', // 柜主
        ownerName: '', // 柜主name
        areaAddress: ''
    },
    limitedRegionList: []
})

const pageInfo = ref({
    total: 0,
    page: 1,
    pageSize: 10
})

const {
    tableData,
    searchData,
    visible,
    handleCatVisible,
    handleCatVisibles,
    user,
    sms,
    text,
    sendDisabled,
    handleOpenVisible,
    userList,
    openLockState,
    drawer,
    deviceCode,
    dialogType,
    currentVal,
    doorsize,
    limitedRegionList
} = toRefs(dataState)
const equststus = ref(false)

onMounted(async () => {
    // await dictType()
    await getList()
    await getOptions()
    // await getRoleList()
})
const equstatuscancel = async (values) => {
    getRefreshStatus()
}
const getOptions = async () => {
    const res = await queryCategoryDevice()
    options.value = res
}
// 选择门后保存
const slectDoorSave = async() => {
    if (!checked.value) {
        ElMessage({
            message: '请选择门信息',
            type: 'error'
        })
    } else {
        console.log(dataState.openLockState, '0000000000dataState.openLockStates')
        // 调开门的接口
        if (dataState.openLockState === 'opendoor') {
            onSubmit('远程开门', 'UC18727152654086144', deviceCodes.value, 'open')
        } else {
            // getSelectDoorStatus()
            console.log(lockDoor.value, 'lockDoor')
            getLockDoorStatus(lockDoor.value.name, lockDoor.value.id, lockDoor.value.code)
        }
    }
}
const res = ''
const errorState = ref([])
const lastCode = ref('') // 手机号后四位
// const num = ref(0)
// const str = ref('')

const lockVisible = ref(false)
const resetVisible = ref(false)
const basicLevelRef = ref(null)

// 设备型号基础类目change
const basicLevelChange = (value) => {
    let deviceTypeName = ''
    let productCateName = ''
    let modelName = ''

    dataState.basicLevelCheckedNodes = basicLevelRef.value.getCheckedNodes(true)

    dataState.basicLevelCheckedNodes.forEach((item) => {
        deviceTypeName = item.pathLabels[1]
        productCateName = item.pathLabels[0]
        modelName = item.pathLabels[2]

        // first.push(item.pathLabels[0])
        // second.push(item.pathLabels[1])
        // three.push(item.pathLabels[2])
        // fourth.push(item.pathLabels[3])
    })
    dataState.searchData.deviceTypeName = deviceTypeName
    dataState.searchData.productCateName = productCateName
    dataState.searchData.modelName = modelName
}
let doortype = 1
// 设备型号基础类目设备型号
const basicLevel = {
    lazy: true,
    multiple: false,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        // 需要替换成字段类型和父级id
        const res = await queryCategoryDevice('device.model.name', data.parentId || 0)
        const nodes = res.map((item) => {
            return {
                label: item.label, // 页面显示的文字
                parentId: item.id, // 父级pid
                dictType: item.type, // 字典类型
                leaf: level >= 2
            }
        })
        resolve(nodes)
    }
}
// 获取设备最新状态
const getRefreshStatus = async () => {
    isHasErrorState()
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001000',
            deviceCode: updateCode.value,
            operatorId: store.state.userInfo.account,
            operatorName: userInfo.value.name,
            abnormalTypes: errorState.value.join()
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        configCode: 'UC63647350137831424',
        name: '刷新设备异常状态',
        source: '设备中台'
    }
    const res = await getMerchantListCode(param)

    if (res.code === '200') {
        // Toast(res.message)
        equststus.value = false
        ElMessage({
            message: res.message,
            type: 'success'
        })
    } else {
        equststus.value = true

        ElMessage({
            message: res.message,
            type: 'error'
        })
    }
}
const equststusCancle = async (values) => {
    equststus.value = false
}
const equstatusrefuse = async (values) => {
    equststus.value = false
}
const cancelClickDoor = async (values) => {
    selectDoor.value = false
}

// 获取用户信息
const getRoleList = async (val) => {
    if (!val) {
        return false
    }
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001000',
            deviceNo: val
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC66487525076389888',
        name: '根据设备编码查询商户基础信息',
        source: '商户中台'
    }
    const res = await getMerchantListCode(param)

    if (res.code === '200') {
        // userList.value = res?.data?.merchantSubList || []
        // user.value = res?.data?.merchantSubList[0].subPhoneMobile
        // const dealDate = res?.data?.merchantSubList || []
        // const filterArr = []
        // dealDate = dealDate.filter(item => item.merchUserType === 2)
        let dealDate = res?.data?.merchantSubList || []

        dealDate = dealDate.filter((item) => item.merchantSubType === 1)
        const text1 = `柜主: ${res?.data?.merchantName}`
        // filterArr.push({
        //     phoneMobile: res?.data?.phoneMobile || '',
        //     merchantName: text1
        // })

        const arr = []
        dealDate.forEach((ele) => {
            const text = `代运营商: ${ele.merchantSubName}`
            const tel = ele.subPhoneMobile
            arr.push({
                phoneMobile: tel,
                merchantName: text
            })
        })
        arr.push({
            phoneMobile: res?.data?.phoneMobile || '',
            merchantName: text1
        })

        user.value = arr[0].phoneMobile
        const part = arr[0].phoneMobile.substring(7, 11)
        lastCode.value = part
        userList.value = arr || []

        // if (res?.data) {
        //     const text = `柜主: ${res?.data.merchantName}`
        // }
        // dealData.forEach((ele) => {
        //     const text = `代运营商：${ele.merchantName}`
        //     const tel = ele.phoneMobile
        //     arr.push({
        //         phoneMobile: tel,
        //         merchantName: text
        //     })
        // })
    }
}
// 获取验证码
const getCode = async (val) => {
    if (!user.value) {
        ElMessage({
            message: '请先选择柜主',
            type: 'error'
        })
        return false
    }
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001000',
            systemSign: 'HSHYWZTPC',
            sceneCode: 5,
            mobile: user.value,
            deviceCode: deviceCodes.value
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UCJH63953588854095872',
        name: '发送验证码聚合设备点位',
        source: '权限中台'
    }
    const timer = ref(null)

    const res = await getMerchantListCode(param)
    if (res.code === '200') {
        userList.value = res?.data?.merchantSubList
        let time = 60
        timer.value = setInterval(() => {
            if (time === 0) {
                clearInterval(timer)
                sendDisabled.value = false
                text.value = '获取授权码'
            } else {
                time--
                text.value = `${time > 9 ? time : '0' + time}秒`
                sendDisabled.value = true
            }
        }, 1000)
    }
}

const selectDoor = ref(false)
const checked = ref(0)
// const handleClose = async(done) => {
//     confirm('确认关闭？')
//         .then(_ => {
//             done()
//         })
//         .catch(_ => {})
// }
// 发送验证码
const sendCodes = async (val) => {
    if (!sms.value || sms.value.length !== 6) {
        ElMessage({
            message: '请输入正确的授权码',
            type: 'error'
        })
        // userLoginShow.value = true
    } else {
        console.log(doortype, '----doorsize---')
        if (doortype === 2) {
            selectDoor.value = true
        } else {
            getSelectDoorStatus()
        }
    }
}
const getSelectDoorStatus = async () => {
    console.log('H10000251', checked)
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001000',
            systemSign: 'HSHYWZTPC',
            sceneCode: 5,
            mobile: user.value,
            smsCode: sms.value
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC63937404624601088',
        name: '验证验证码',
        source: '权限中台'
    }
    const res = await getMerchantListCode(param)
    if (res.code === '200') {
        // const onSubmit = async (name, configCode, id, lockState) => {}
        // handleClick('远程开门', 'UC18727152654086144', deviceCodes.value, 'open')
        onSubmit('远程开门', 'UC18727152654086144', deviceCodes.value, 'open')
        dataState.openLockState = 'lockdoor'
        handleOpenVisibles.value = false
        handleVisible.value = false
        selectDoor.value = false
        // 如果等于200  怎么整
    } else {
        handleVisible.value = true
        handleOpenVisibles.value = true

        ElMessage({
            message: res.message,
            type: 'error'
        })
    }
}
const goodsCannotSkuArea = {
    lazy: true,
    multiple: false,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const params = {
            code: data.value || 0,
            ql: level + 1
        }
        // const res = await getAllList(params)
        const res = await getProviceList(params)
        const nodes = res?.map((item) => {
            return {
                label: item.addressName,
                value: item.addressCode,
                level: item.level,
                leaf: level >= 2
            }
        })
        resolve(nodes)
    }
}
const areaRef = ref(null)

const skuAreaChange = (value) => {
    const areaCheckedNodes = areaRef.value.getCheckedNodes(true)
    searchData.value.provinceCode = areaCheckedNodes.pathNades

    areaCheckedNodes.forEach((item) => {
        dataState.limitedRegionList.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1],
            countyCode: item.pathValues[2],
            countyName: item.pathLabels[2]
        })
    })
}
const handleOpenVisibles = ref(false)
const changeUser = (e) => {
    user.value = e.trim()
    const part = e.trim().substring(7, 11)
    lastCode.value = part
}
const handleCatVisibleMethods = (e) => {
    erweimaUrlQRCode.value = null
    handleCatVisible.value = false
}
// 远程开门
const handleOpenModel = async (name, code, id, lockState) => {
    handleOpenVisibles.value = true
    if (code === 'UC18727152654086144') {
        getRoleList(id)
    }
    // userLoginShow.value = false
    // 弹窗前校验用户身份
    // showTips.value = false
    // type.value = val
}

// huoqu 设备最新状态
const getequsttaus = async () => {
    equststus.value = true
}
// 获取设备提锁方法
const getLockDoorStatus = async (name, id, code, lock, doorsize) => {
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001000',
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name,
            deviceCode: code,
            doorType: checked.value

        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        configCode: id,
        name: name,
        source: '设备中台'
    }
    const res = await getMerchantListCodes(param)
    if (res.code === '095405') {
        lockVisible.value = true
    } else if (res.code === '100') {
        lockVisible.value = true
    } else if (res.code === '200') {
        ElMessage({
            message: '操作成功',
            type: 'success'
        })
    } else {
        ElMessage({
            message: '操作失败',
            type: 'error'
        })
    }
}
// h
// huoqu 远程提锁
// const handleLock = async (name, id, code, lock, doorsize) => {
//     dataState.openLockState = 'doorlock'
//     dataState.doorsize = doorsize
//     console.log(doortype, '---设备提锁方法---doorsize-')
//     if (doortype === 2) {
//         // 如果是双开门柜的话
//         selectDoor.value = true
//     } else {
//         getLockDoorStatus(name, id, code, lock, doorsize)
//     }

//     // lockVisible.value = true
// }
const lockDoor = ref({})

// huoqu 远程提锁
const handleLock = async (name, id, code, lock, doorsize) => {
    checked.value = 0
    dataState.openLockState = 'doorlock'
    dataState.doorsize = doorsize
    console.log(doortype, '---设备提锁方法---doorsize-')
    if (doorsize === 2) {
        selectDoor.value = true
        lockDoor.value.name = name
        lockDoor.value.id = id
        lockDoor.value.code = code
    } else {
        getLockDoorStatus(name, id, code, lock, doorsize)
    }

    // lockVisible.value = true
}

const handleReset = async (name, id, code, lock) => {
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001000',
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name,
            deviceCode: code
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        configCode: id,
        name: name,
        source: '设备中台'
    }
    const res = await getMerchantListCode(param)
    if (res.code === '095406') {
        resetVisible.value = true
    } else if (res.code === '100') {
        resetVisible.value = true
    } else if (res.code === '200') {
        ElMessage({
            message: '操作成功',
            type: 'success'
        })
    } else {
        ElMessage({
            message: '操作失败',
            type: 'error'
        })
    }

    // lockVisible.value = true
}
const list = ref(null)
const doorType = 1
// 获取列表初始化
const getList = async (reset = false) => {
    if (reset) pageInfo.value.page = 1
    const val = {
        name: '查询设备信息列表v2聚合',
        configCode: 'UCJH46211908217593856',
        source: '运营后台'
    }
    const params = {
        ...searchData.value,
        provinceCode: searchData?.value?.areaAddress ? searchData?.value?.areaAddress[0] : '',
        cityCode: searchData?.value?.areaAddress ? searchData?.value?.areaAddress[1] : '',
        ...keyCode,
        pageNum: pageInfo.value.page,
        pageSize: pageInfo.value.pageSize,
        deviceCodes: searchData.value.deviceCode === '' ? [] : [searchData.value.deviceCode],
        iotDeviceCodes: searchData.value.iotDeviceCode === '' ? [] : [searchData.value.iotDeviceCode],
        manufacturerDeviceCodes: searchData.value.manufacturerDeviceCode === '' ? [] : [searchData.value.manufacturerDeviceCode],
        ownerIds: searchData.value.ownerId === '' ? [] : [searchData.value.ownerId],
        // 设备型号支持级联  参数后端给出后需要修改,需要包装成一个对象
        modelName: searchData?.value?.modelName || null,
        productCateName: searchData?.value?.productCateName || null,
        deviceTypeName: searchData?.value?.deviceTypeName || null
    }
    // if (params.basicLevelChecked) delete params.basicLevelChecked
    const res = await devicetList(params, val)
    if (res.code === '200') {
        dataState.tableData = res.data === null ? res.data : res.data?.list
        pageInfo.value.total = res.data.total
        // doorType.value = res?.data?.cabinetDoorLis?.doorType
        // console.log(res, '--doorType-----')
    }
}
// 获设备型号初始化
// const dictType = async () => {
//     const param = {
//         body: {
//             appKey: 'A1001001',
//             busiCode: 'A1001002',
//             dictType: 'device.model.name',
//             parentId: 0
//             // 接口入参
//         },
//         appKey: 'A1001001', // 系统编号
//         busiCode: 'A1001001',
//         name: '设备型号级联查询',
//         configCode: 'UC19859938486165504',
//         source: '运营后台'
//     }

//     const res = await getMerchantListCode(param)
//     if (res.code === '200') {
//         console.log(res, '-----res---')
//     }
// }
// 操作栏 统一请求
// 记得修改回来
const handleVisible = ref(false)
const visibles = ref(false)
const statusValue = {
    1: '网络异常',
    2: '位置异常',
    3: '温度异常',
    4: '摄像头异常',
    5: '门锁异常'
}
// 远程拍摄
const handleCatState = ref(false)
const deviceStateData = ref(null)

const erweimaUrl = ref('')
const erweimaUrl2 = ref('')
const erweimaUrlQRCode = ref('')

const activeState = ref(1)
const rowdata = ref(null)
const deviceCodes = ref(null)
const codeParams = reactive({
    name: '',
    code: '',
    num: '',
    lockState: ''
})

const handleClick = async (name, code, id, lockState, doorsize) => {
    console.log(doorsize, '-----doorsize-0--远程开门')
    checked.value = 0
    dataState.openLockState = 'opendoor'
    // 单开门柜还是双开门柜
    doortype = doorsize
    if (!id) {
        return false
    }
    deviceCodes.value = id

    // getRoleList(id)
    if (code === 'UC18727152654086144') {
        getRoleList(id)
    }

    handleVisible.value = true
    codeParams.name = name
    codeParams.code = code
    codeParams.num = id
    codeParams.lockState = lockState
}
const updateCode = ref(null)
// 短信授权-确认按钮
const handleSomeClick = (name, configCode, id, lockState) => {
    onSubmit(name, configCode, id, lockState)
    handleVisible.value = false
    selectDoor.value = false
    // 判断是否显示双开门
}
// 点开门
const onSubmit = async (name, configCode, id, lockState) => {
    const val = {
        name: name,
        configCode: configCode,
        source: '设备中台'
    }
    const params = {
        ...keyCode,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        lockState: name === '通知设备锁定' ? activeState.value ?? 0 : null, // 设备锁定状态
        deviceCode: id,
        doorType: checked.value

    }
    const res = await devicetList(params, val)
    if (res.code === '200') {
        activeState.value = null
        selectDoor.value = false
        handleVisible.value = false
        // 选择门弹窗消失
        getList()
        ElMessage({
            message: '操作成功',
            type: 'success'
        })
    } else {
        ElMessage({
            message: '操作失败',
            type: 'error'
        })
    }
}
const timer = ref(null)
const supportTemperatureAlarm = ref(0)
// 门锁异常
const supportDoorLockAlarm = ref(0)
// 摄像头异常预警
const supportCameraAlarm = ref(0)
// 编辑 详情
const handleEdit = (type, { deviceCode, ownerId, cabinetAttr, doorType }) => {
    updateCode.value = deviceCode
    doortypes = doorType
    supportTemperatureAlarm.value = cabinetAttr?.supportTemperatureAlarm
    supportDoorLockAlarm.value = cabinetAttr?.supportDoorLockAlarm
    supportCameraAlarm.value = cabinetAttr?.supportCameraAlarm

    if (type === 'state') {
        handlDeviceState(deviceCode)
        handleCatState.value = true
    } else if (type === 'erweima') {
        handleCatVisible.value = true
        dataState.deviceCode = deviceCode
        handleCat(deviceCode)
        // handleCat(deviceCode, 2)
        // handleCat(deviceCode, 3)
    } else {
        dataState.visible = true
        dataState.deviceCode = deviceCode
        dataState.type = type
        dataState.ownerId = ownerId
    }
}
// const onClose = () => {
//     handleVisible.value = false
//     activeState.value = null
//     // userLoginShow.value = false
//     text.value = '获取授权'
//     sendDisabled.value = false
//     // codeDisabled.value = false
// }
const onClose = () => {
    handleVisible.value = false // 关闭弹窗
    user.value = '' // 选项清空
    if (timer.value) clearInterval(timer.value) // 清除定时器
    text.value = '获取授权码' // 按钮文字重置
    sms.value = '' // 输入的授权码清空
    sendDisabled.value = false // 按钮恢复点击
}

// }
// 获取设备异常状态
const handlDeviceState = async (val) => {
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001022',

            deviceCode: val
            // 接口入参
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC32065144569372672',
        name: '设备状态',
        url: '/api/device/v2/abnormal-states',
        source: '设备中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    deviceStateData.value = res

    if (res === 'success') {
        handleCatState.value = false
    }
    return res
}
// 获取二维码
const handleCat = async (val) => {
    const param = {
        body: {
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001022',
            deviceCode: val
            // qrCodeType: num
            // 接口入参
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        // configCode: 'UC33908382909505536',
        // name: '二维码详情',
        configCode: 'UC75532669880586240',
        name: '查询二维码列表',
        url: '/api/device/qr-code/detail/v1',
        source: '设备中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    res.forEach((item) => {
        if (item.qrCodeType === 1) {
            erweimaUrl2.value = item.qrCodeContent
        } else if (item.qrCodeType === 3) {
            erweimaUrlQRCode.value = item.qrCodeContent
        } else {
            erweimaUrl.value = item.qrCodeContent
        }
    })
    // if (num === 1) {
    //     erweimaUrl2.value = res.content
    // } else {
    //     erweimaUrl.value = res.content
    //     erweimaUrlQRCode.value = res.content
    // }
}

// 获取验证码
// const getSmsCode = async (val) => {
//     const param = {
//         body: {
//             appKey: 'A1001000', // 系统编号
//             busiCode: 'A1001022',
//             systemSign: '',
//             sceneCode: 5
//             // 接口入参
//         },
//         appKey: 'A1001000',
//         busiCode: 'A1001000',
//         configCode: 'UC63937404624601088',
//         name: '获取验证码',
//         source: '权限中台'
//     }
//     const res = await getMerchantList(param)
//     // deviceStateData.value = await getMerchantList(param)

//     if (res === 'success') {
//         handleCatState.value = false
//     }
//     return res
// }

// 解绑设备
const cancelClick = () => {
    dataState.drawer = false
}
const bindDcode = ref(null)
const bindDevice = (val) => {
    drawer.value = true
    bindDcode.value = val
}
const confirmClick = async (deviceCode) => {
    const val = {
        name: '申请解绑设备',
        configCode: 'UC18279742890962944',
        source: '设备中台'
    }
    const params = {
        ...keyCode,
        deviceCode,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await devicetList(params, val)
    if (res.code === '200') {
        drawer.value = false
        getList()
        ElMessage({
            message: '解绑成功',
            type: 'success'
        })
    } else {
        ElMessage({
            message: '解绑失败',
            type: 'error'
        })
    }
}
// 发送短信验证码  --确认
const confirmClicks = async (deviceCode) => {
    // deviceCodes.value = deviceCode
    await sendCodes(deviceCode)
}
// 获取省列表
const getProviceList = async (params) => {
    const res = await getAllList(params.ql, params.code)
    proviceList.value = res.addressList
    return proviceList.value
}

// 始发省 出市
const cahngeProvice = async (val) => {
    if (searchData.value.provinceCode?.value) {
        const res = await getAllList(2, val.value)
        cityList.value = res.addressList
    }
}

// 获取省市
const proviceList = ref([])
const cityList = ref([])
const getAllList = async (ql, code) => {
    const param = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001001',
            ql: ql,
            code: code
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1658391004384SvOqm',
        name: '查询四级地址库信息',
        source: '运单中台',
        modifierId: store.state?.userInfo?.account ?? '',
        operatorId: store.state?.userInfo?.account ?? '',
        operatorName: store.state?.userInfo?.name ?? ''
    }
    const res = await getMerchantList(param)
    return res
}

// 重置
const formRef = ref(null)
const resetForm = (formEl) => {
    if (!formEl) return
    if (areaRef?.value?.panel) {
        areaRef.value.panel.clearCheckedNodes()
    }
    searchData.value.areaAddress = ''
    searchData.value.modelName = ''
    searchData.value.productCateName = ''
    searchData.value.deviceTypeName = ''
    formEl.resetFields()
    getList()
}

// 页数改变
const sizeChange = (val) => {
    pageInfo.value.page = 1
    pageInfo.value.pageSize = val
    getList()
}

// 当前页改变
const currentChange = (val) => {
    pageInfo.value.page = val
    getList()
}

const dealData = (data) => {
    //  1-网络异常 2-位置异常 3-温度异常,4-摄像头异常,5-门锁异常
    const arr = []
    Object.keys(data).forEach((item) => {
        if (data[item] === 2) {
            switch (item) {
            case 'temperatureState':
                arr.push(3)
                break
            case 'cameraState':
                arr.push(4)
                break
            case 'doorLockState':
                arr.push(5)
                break
            default:
                return arr
            }
        }
    })
    return arr
}
// 得到异常状态对象
const isHasErrorState = () => {
    // const arr = []
    const data1 = deviceStateData.value
    errorState.value = [3, 4, 5]
}
</script>
<style lang="scss" scoped>
// .unremot-tips-title {
.unremot-tips-title {
    margin-top: 20px;
}
.tips-error {
    margin-top: 50px;
}
.device-open {
    h1 {
        font-size: 18px;
    }

    p {
        margin: 20px 0;
    }
    .el-button {
        margin-left: 20px;
    }
}
.el-dialog {
    margin-top: 0;
}
.auth-code {
    p {
        margin: 10px 0;
    }
    .code {
        width: 50%;
        display: flex;
        align-items: center;
        .el-input {
            margin-left: 20px;
        }
    }
}
.warning-error {
    li {
        // display: flex;
    }
    .red_color {
        color: red;
    }
    span {
        padding-left: 200px;
    }
}
.unremot-tips-title-content {
    margin-top: 10px;
    // height: 136px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #696969;
    padding-left: 20px;
    padding-right: 64px;
    // line-height: 42px;
    margin-bottom: 40px;
}
.warning-erro {
    background: red;
}
.role-page {
    .el-table tr {
        height: 50px;
    }
    .el-select {
        :deep(.el-select__tags-text) {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            justify-content: flex-start;
        }
    }
    .box-card {
        border: initial;
        .search-area {
            .el-form {
                .el-form-item {
                    width: 280px;
                }
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
        .el-form-item {
            :deep .el-form-item__label {
                width: 200px;
            }
        }
    }
    .info {
        text-align: left;
    }
    .span {
        color: deepskyblue;
        display: inline-block;
        border-bottom: 1px;
        cursor: pointer;
    }
    .qrcode {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .qrcode-item {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            p {
                margin-bottom: 10px;
            }
        }
    }
}
</style>
