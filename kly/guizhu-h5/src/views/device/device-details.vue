<template>
    <div class="goodsDetailsBox mine-content">
        <van-nav-bar title="设备详情" fixed placeholder left-arrow @click-left="goBack" />
        <!-- 设备信息 -->
        <div class="equipmentBox">
            <div class="mantle" v-if="route.query.type && route.query.type === 'sonaccount'"></div>
            <van-form>
                <div class="outside">
                    <div class="withinLeft">设备编号</div>
                    <div class="withinRight">
                        {{ showOperationList.deviceCode || '-' }}
                    </div>
                </div>
                <!-- <div class="outside">
                    <div class="withinLeft">设备型号</div>
                    <div class="withinRight">
                        {{ showOperationList.deviceModelName || '-' }}
                    </div>
                </div> -->
                <div class="outside" >
                    <van-field class="guizhu-field" @click="handleDeviceModelAttributes" label="设备型号" readonly input-align="right" v-model="showOperationList.deviceModelName" name="deviceModelName" is-link />
                </div>
                <van-popup v-model:show="deviceModelAttrsShow" class="device-status decice-status-c9" closeable close-icon="close" close-icon-position="top-left" position="bottom">
                    <van-cell-group>
                        <van-cell class="device-status-title" :title="showOperationList.deviceModelName" />
                        <van-cell class="lock_status lock_statusc" title="支持温度层" :value="showOperationList.cabinetAttr.temperatureType === 0 ? '常温' :showOperationList.cabinetAttr.temperatureType === 1?'冷藏': '冷冻'" />
                        <!-- <van-cell v-if="showOperationList.cabinetAttr.temperatureType" class="lock_status" title="支持温度层" :value="showOperationList.cabinetAttr.temperatureType === 0 ? '常温' :showOperationList.cabinetAttr.temperatureType === 1?'冷藏': '冷冻'" /> -->
                        <van-cell class="lock_status lock_statusc" title="设备温度控制" :value="showOperationList.cabinetAttr.supportTemperatureControl === 0 ? '不支持' : '支持'" />
                        <van-cell v-if="showOperationList.cabinetAttr"  class="lock_status lock_statusc" title="实时温度获取" :value="showOperationList.cabinetAttr.supportTemperatureObtain === 0 ? '不支持' : '支持'" />
                        <!-- <van-cell v-if="showOperationList.cabinetAttr.supportTemperatureAlarm" class="lock_status" title="温度异常预警" :value="showOperationList.cabinetAttr.supportTemperatureAlarm === 0 ? '不支持' : '支持'" /> -->

                        <van-cell class="lock_status lock_statusc"  title="温度异常预警" :value="showOperationList.cabinetAttr.supportTemperatureAlarm === 0 ? '不支持' : '支持'" />
                        <van-cell class="lock_status lock_statusc" title="门数量" :value="showOperationList.cabinetAttr.doorSize" />
                        <!-- <van-cell class="lock_statusc" v-if="showOperationList.cabinetAttr.skuKindLimit" title="上架SKU数量上限" :value="showOperationList.cabinetAttr.skuKindLimit" />
                        <van-cell v-if="showOperationList.cabinetAttr.skuQtyLimit" class="lock_status lock_statusc" title="货柜满载数" :value="showOperationList.cabinetAttr.skuQtyLimit" /> -->
                    </van-cell-group>
                    <div class="bottom-device ">
                        <span class="btn" @click="closePopver">关闭</span>
                    </div>
                </van-popup>
                <div class="outside">
                    <van-field class="guizhu-field" v-model="showOperationList.deviceName" @click="handleEdit" is-link readonly label="设备名称" name="deviceName" input-align="right" />
                </div>
                <div class="popup-deviceName">
                    <van-popup :style="{ height: '30%' }" :lazy-render="false" ref="popups" v-model:show="editType" closeable close-icon="close" close-icon-position="top-left" position="bottom" title=" 修改设备名称">
                        <van-form ref="Form" @submit="onSubmit">
                            <div class="seting-titles">
                                <h2 class="setings-h3">
                                    修改设备名称
                                    <button hairline plain color="#FE7E41" native-type="submit" size="mini" style="outline: 0; border: 0; border: none">确认</button>
                                </h2>
                            </div>
                            <div class="content-edit">
                                <van-cell-group inset>
                                    <van-field v-model="editDatas" name="editDatas" placeholder="请输入设备名称" />
                                </van-cell-group>
                            </div>
                        </van-form>
                    </van-popup>
                </div>
                <div class="outside devceSeat" style="height: 77px">
                    <van-field class="guizhu-field" @click="showLocationPopupsPostion" label="点位" readonly placeholder="请选择点位" name="locationName" input-align="right" mame="locationName" is-link :rules="[{ required: true, message: '请选择点位' }]">
                        <template #input>
                            <span class="slot">

                                <span class="device-seat-span">{{ merchantInfo.locationName }}</span>
                                <span class="device-seat-span">{{ merchantInfo.deviceAdress }}</span>
                                <!-- <span class="device-seat-span">{{ merchantInfo.locationName }}</span>
                                <span class="device-seat-span">{{ merchantInfo.deviceAdress }}</span> -->
                            </span>
                        </template>
                    </van-field>
                </div>
                <div class="outside">
                    <van-field :disabled="orderType === 3?true: false" class="guizhu-field" v-model="showOperationList.orderNo" @click="handleOrderDetail(showOperationList.orderNo)" :is-link="showOperationList.hasOrderRight" readonly label="订单编号" name="orderNo" input-align="right" />
                </div>
                <div class="outside">
                    <van-field class="guizhu-field" v-model="showOperationList.contractCode" @click="handleContract(showOperationList.contractUri)" :is-link="showOperationList.hasContractRight" readonly label="合同编号" name="contractCode" input-align="right" />
                </div>
                <div class="outside">
                    <div class="withinLeft">合同货柜编号</div>
                    <div class="withinRight">
                        {{ showOperationList.pointCode || '-' }}
                    </div>
                </div>
                <div class="outside" :class="[showOperationList.deviceState === 0 ? 'errClass' : 'normalClasss', 'withinRight']">
                    <van-field class="guizhu-field" @click="handleDeviceStatus" label="设备状态" readonly input-align="right" v-model="isStatus" name="deviceState" is-link />
                </div>
                <van-popup v-model:show="deviceStatus" class="device-status" closeable close-icon="close" close-icon-position="top-left" position="bottom">
                    <van-cell-group>
                        <van-cell class="device-status-title" title="设备状态" />
                        <van-cell v-if="deviceStateData.networkState" class="lock_status" title="网络状态" :class="[deviceStateData.networkState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']" :value="deviceStateData.networkState === 1 ? '正常' : '异常'" />

                        <!-- <template v-if="deviceStateData.doorAbnormalStateList.doorType">
                            <van-cell v-if="showOperationList?.cabinetAttr?.supportCameraAlarm" class="lock_status" title="摄像头状态" :class="[deviceStateData.doorAbnormalStateList.cameraAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']">
                                <div v-for="(item, index) in  deviceStateData.doorAbnormalStateLis" :key="index">
                                    <span :class="{red_color: item.doorLockAbnormalState !== 1}">   {{  doorName}}{{ item.cameraAbnormalState === 1?'正常': item.cameraAbnormalState === 2?'异常':'' }}</span>
                                </div>
                            </van-cell>
                        </template>
                        <template v-else>
                            <van-cell v-if="deviceStateData.doorAbnormalStateList.cameraAbnormalState" class="lock_status" title="摄像头状态" :class="[deviceStateData.doorAbnormalStateList.cameraAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']" :value="deviceStateData.cameraState === 1 ? '正常' : '异常'" />
                        </template> -->
                        <!-- <van-cell v-if="showOperationList?.cabinetAttr?.supportCameraAlarm" class="lock_status" title="摄像头状态" :class="[deviceStateData.cameraAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']" :value="deviceStateData.cameraAbnormalState === 1 ? '正常' : '异常'" /> -->
                        <!-- <template v-if="deviceStateData.doorAbnormalStateList.doorType"> -->

                        <van-cell v-if="showOperationList?.cabinetAttr?.supportCameraAlarm" :class="[deviceStateData.doorAbnormalStateList.length>1 ? 'two-door-lh79' : 'one-door-59', 'lock_status']" title="摄像头状态">
                            <!-- <span v-for="(item, index) in  deviceStateData.doorAbnormalStateList" :key="index" >
                                <span :class="[item.cameraAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']" v-if="showOperationList.cabinetAttr.doorSize === 2"> {{ item.doorName }} {{ item.cameraAbnormalState === 1 ? '正常':'异常' }}</span>
                                <span v-else :class="[item.cameraAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']">{{ item.cameraAbnormalState === 1 ? '正常':'异常' }}</span>
                            </span> -->
                            <template v-slot:label>
                                <div class="label-normalClasss">
                                    <span v-for="(item, index) in  deviceStateData.doorAbnormalStateList" :key="index" >
                                        <div :class="[item.cameraAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'ptb4']" v-if="showOperationList.cabinetAttr.doorSize === 2"> {{ item.doorName }}： {{ item.cameraAbnormalState === 1 ? '正常':'异常' }}</div>
                                        <div v-else :class="[item.cameraAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'ptb4']">{{ item.cameraAbnormalState === 1 ? '正常':'异常' }}</div>
                                    </span>
                                </div>
                            </template>
                        </van-cell>

                        <van-cell v-if="showOperationList.cabinetAttr.supportDoorLockState" :class="[deviceStateData.doorAbnormalStateList.length>1 ? 'two-door-lh79' : 'one-door-59', 'lock_status']" title="门锁状态" >
                            <template v-slot:label>
                                <div class="label-normalClasss">

                                    <span v-for="(item, index) in deviceStateData.doorAbnormalStateList" :key="index">
                                        <div :class="[item.doorLockAbnormalState === 1 ? 'normalClasss' : 'errClasss','ptb4']" v-if="showOperationList.cabinetAttr.doorSize === 2"> {{ item.doorName }}： {{ item.doorLockAbnormalState === 1 ? '正常':'异常' }}</div>
                                        <div v-else :class="[item.doorLockAbnormalState === 1 ? 'normalClasss' : 'errClasss','ptb4']">{{ item.doorLockAbnormalState === 1 ? '正常':'异常' }}</div>
                                    </span>
                                </div>
                            </template>
                        <!-- <span v-for="(item, index) in deviceStateData.doorAbnormalStateList" :key="index">
                                <span :class="[item.doorLockAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']" v-if="showOperationList.cabinetAttr.doorSize === 2"> {{ item.doorName }} {{ item.doorLockAbnormalState === 1 ? '正常':'异常' }}</span>
                                <span v-else :class="[item.doorLockAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']">{{ item.doorLockAbnormalState === 1 ? '正常':'异常' }}</span>
                            </span> -->
                        </van-cell>

                        <!-- <van-cell v-if="showOperationList.cabinetAttr.supportDoorLockState" class="lock_status" title="门锁状态" :class="[deviceStateData.doorAbnormalStateList.doorLockAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']" :value="deviceStateData.doorAbnormalStateList.doorLockAbnormalState === 1 ? '正常' : '异常'" /> -->
                        <van-cell v-if="showOperationList.cabinetAttr.supportTemperatureAlarm" class="lock_status" title="温度状态" :class="[deviceStateData.temperatureState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']" :value="deviceStateData.temperatureState === 1 ? '正常' : '异常'" />
                        <van-cell v-if="deviceStateData.locationState" class="lock_status" title="位置状态" :class="[deviceStateData.locationState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']" :value="deviceStateData.locationState === 1 ? '正常' : '异常'" />
                    </van-cell-group>
                    <div class="tips-error">
                        <h4 class="h4-title">异常问题检查方法：</h4>
                        <ul class="title-content">
                            <li>1. 检查设备是否断电</li>
                            <li>2. 检查设备网络信号</li>
                            <li>3. 检查设备流量卡是否欠费停机</li>
                            <li>4. 检查设备APP是否正常运行</li>
                            <li>5. 如无以上问题，请联系客服</li>
                        </ul>
                    </div>
                    <div class="bottom-device">
                        <span class="btn" @click="getequsttaus">获取设备最新状态</span>
                    </div>
                </van-popup>
                <!-- <div class="outside" v-if="showOperationList?.cabinetAttr?.supportDoorLockState" style="display: flex;">
                    <div class="withinLeft" style="flex:1">门锁状态1</div>
                    <div>
                        <div v-for="(item, index) in showOperationList?.cabinetDoorList" :key="index">
                            <span v-if="state.doorsize=== 2">{{ item.doorName  }}</span> <span> {{ item?.doorLockState === 3 ? ' 门关锁关' :  item?.doorLockState === 4?' 门关锁开':item?.doorLockState === 5?'门开锁关':item?.doorLockState === 6?'门开锁开':'' }}</span>
                        </div>
                    </div>
                </div> -->

                <van-cell v-if="showOperationList?.cabinetAttr?.supportDoorLockState" :class="[showOperationList?.cabinetDoorList.length>1 ? 'two-door-lh87' : 'one-door-59', 'lock_status','pd0']" title="门锁状态">
                    <template v-slot:label>
                        <div>
                            <span v-for="(item, index) in showOperationList?.cabinetDoorList" :key="index" class="ptb4">
                                <!-- <div :class="[item.doorLockAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']" v-if="showOperationList.cabinetAttr.doorSize === 2"> {{ item.doorName }}： {{ item.doorLockAbnormalState === 1 ? '正常':'异常' }}</div> -->
                                <!-- <div v-else :class="[item.doorLockAbnormalState === 1 ? 'normalClasss' : 'errClasss', 'withinRight']">{{ item.doorLockAbnormalState === 1 ? '正常':'异常' }}</div> -->
                                <div v-if="state.doorsize=== 2">{{ item.doorName  }}：</div> <span> {{ item?.doorLockState === 3 ? ' 门关锁关' :  item?.doorLockState === 4?' 门关锁开':item?.doorLockState === 5?'门开锁关':item?.doorLockState === 6?'门开锁开':'' }}</span>

                            </span>
                        </div>
                    </template>
                </van-cell>
                <div class="outside" v-if="showOperationList?.cabinetAttr?.supportTemperatureObtain">
                    <div class="withinLeft">实时温度</div>
                    <div class="withinRight" v-if="showOperationList?.temperature">{{ showOperationList?.temperature }}℃</div>
                    <div class="withinRight" v-else>-</div>
                </div>

                <div class="outside" v-if="showOperationList?.cabinetAttr?.supportTemperatureControl">
                    <van-field v-if="showOperationList.cabinetAttr.supportTemperatureControl" class="guizhu-field" @click="handleDeviceSetting" label="设备制冷设置" readonly input-align="right" v-model="lockStatuss" name="contractCode" is-link />
                </div>
                <van-popup v-model:show="deviceSetting" position="bottom" closeable close-icon="close" close-icon-position="top-left" style="height: 45%">
                    <van-form @submit="handleSubmitSettings">
                        <div class="setting">
                            <div class="seting-title">
                                <van-button plain color="#FE7E41" native-type="submit" style="border: 0; color: #fff" disabled>确认</van-button>
                                <h3>设备制冷设置</h3>
                                <van-button plain color="#FE7E41" native-type="submit" style="border: 0">确认</van-button>
                            </div>
                            <div class="setting-content">
                                <div class="open-type">
                                    <div class="merchant card">
                                        <van-cell-group class="guizhu-cell-group">
                                            <van-field name="radio">
                                                <template #input>
                                                    <van-radio-group v-model="state.isOffTemplature.powerMode" direction="horizontal">
                                                        <van-radio :name="3" checked-color="#ee0a24" icon-size="16px" class="radio-w">
                                                            <template #icon="props">
                                                                <img class="img-icon" :src="props.checked ? Checkn : Unchecked" />
                                                            </template>
                                                            关闭制冷
                                                        </van-radio>
                                                        <van-radio :name="0" checked-color="#ee0a24" icon-size="16px" class="radio-w">
                                                            <template #icon="props">
                                                                <img class="img-icon" :src="props.checked ? Checkn : Unchecked" />
                                                            </template>
                                                            常开
                                                        </van-radio>
                                                        <van-radio :name="1" checked-color="#ee0a24" icon-size="16px" class="radio-w">
                                                            <template #icon="props">
                                                                <img class="img-icon" :src="props.checked ? Checkn : Unchecked" />
                                                            </template>
                                                            定时开启
                                                        </van-radio>
                                                    </van-radio-group>
                                                </template>
                                            </van-field>
                                            <van-field
                                                v-if="(state.isOffTemplature.powerMode !== 3)"
                                                class="guizhu-field guizhu-field-temperature"
                                                @click="setTempture"
                                                label="设置货柜温度(℃)"
                                                readonly
                                                placeholder="设置货柜温度(℃)"
                                                input-align="right"
                                                v-model="settings.temperature"
                                                name="temperature"
                                                is-link
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: '请设置货柜温度'
                                                    }
                                                ]" />
                                            <van-popup title="iii" v-model:show="temperatureShow" position="bottom">
                                                <van-picker v-if="temperatureList" title="设置货柜温度(℃)" :columns="temperatureList" @confirm="onConfirmTempera" @cancel="temperatureShow = false" />
                                            </van-popup>
                                            <van-field
                                                v-if="(state.isOffTemplature.powerMode ===1)"
                                                class="guizhu-field"
                                                label="每日生效时间"
                                                readonly
                                                placeholder="请选择每日生效时间"
                                                input-align="right"
                                                v-model="settings.effective"
                                                name="effective"
                                                is-link
                                                @click="effectiveShowHandle"
                                                :rules="[{ required: true, message: '请选择每日生效时间' }]"
                                            >
                                            </van-field>
                                            <van-popup v-model:show="effectiveShow" position="bottom">
                                                <van-picker
                                                    title="每日生效时间"
                                                    v-if="effectiveShow"
                                                    :columns="timeColumns"
                                                    value-key="hour"
                                                    @confirm="onConfirmEffective"
                                                    @cancel="effectiveShow = false"
                                                />
                                            </van-popup>
                                        </van-cell-group>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </van-form>
                </van-popup>
                <div class="outside">
                    <van-field name="slider" label="视频音量调节">
                        <template #input>
                            <van-slider v-model="serviceHotline" active-color="#FE7E41" button-size="20" @change="soundChange">
                                <template #button>
                                    <div class="custom-button"></div>
                                </template>
                            </van-slider>
                        </template>
                    </van-field>
                </div>
            </van-form>
        </div>
        <div class="lock-status" style="box-sizeing: border-box;padding-left: 15px ">
            <van-row gutter="40">
                <van-col span="8" style="margin-top:10px !important;box-sizeing: border-box !important;padding-right: 7.5px !important;padding-left: 0px !important; ">
                    <van-button type="primary" block color="#FE7E41" size="mini" style="border-radius: 4px; height: 30px; font-size: 14px; width: 105px;" class="lock-btn" @click.prevent="handleLock('lock')" :disabled="route.query.type && route.query.type === 'sonaccount'">
                        {{ state.showOperationList.lockState === 1 ? '解除锁定' : '远程锁定' }}
                    </van-button>
                </van-col>
                <van-col span="8" style="margin-top:10px !important;padding-right: 0px !important;padding-left: 0px !important; ">
                    <van-button type="primary" color="#FE7E41" block size="small" class="lock-btn" style="border-radius: 4px; height: 30px; width: 105px; font-size: 14px" @click.prevent="handlereset('reset')">重启设备 </van-button>
                </van-col>
                <van-col v-if="showOperationList?.cabinetAttr?.supportOpenDoor" span="8"  style="margin-top:10px !important;padding-right: 0px !important;padding-left: 0px !important; ">
                    <van-button v-if="showOperationList?.cabinetAttr?.supportOpenDoor" type="primary" :loading="remoteLoading" round block color="#FE7E41" size="small" class="lock-btn" style="border-radius: 4px; height: 30px; font-size: 14px; width: 105px" @click.prevent="handleOpenModel('open')" :disabled="route.query.type && route.query.type === 'sonaccount'">
                        远程开门
                    </van-button>
                </van-col>
                <van-col span="8" v-if="showOperationList?.cabinetAttr?.supportOpenLock" style="margin-top:10px !important;padding-right: 0px !important;padding-left: 0px !important; ">
                    <van-button v-if="showOperationList?.cabinetAttr?.supportOpenLock" class="lock-btn" @click.prevent="handleDeviceLock('fighting')" type="primary" color="#FE7E41" style="border-radius: 4px; height: 30px; width: 105px; font-size: 14px" block size="small" :disabled="route.query.type && route.query.type === 'sonaccount'">
                        设备提锁
                    </van-button>
                </van-col>
                <van-col span="8" style="margin-top:10px !important;padding-right: 0px !important;padding-left: 0px !important; ">
                    <van-button class="lock-btn" @click.prevent="handleUnBind" type="primary" color="#FE7E41" style="border-radius: 4px; height: 30px; width: 105px; font-size: 14px" block size="small" :disabled="route.query.type && route.query.type === 'sonaccount'">解除绑定</van-button>
                </van-col>
                <van-col v-if="showOperationList?.cabinetAttr?.supportTakePhoto" span="8" style="margin-top:10px !important;padding-right: 0px !important;padding-left: 0px !important; ">
                    <van-button v-if="showOperationList?.cabinetAttr?.supportTakePhoto" class="lock-btn" @click.prevent="handleRomote" type="primary" color="#FE7E41" style="border-radius: 4px; height: 30px; width: 105px; font-size: 14px" block size="small" :disabled="route.query.type && route.query.type === 'sonaccount'">远程拍摄</van-button>
                </van-col>
            </van-row>
        </div>
        <!-- <div class="lock-status" style="padding: 0 15px; box-sizeing: border-box">
            <van-row gutter="20">
                <van-col span="8">
                    <van-button type="primary" block color="#FE7E41" size="mini" style="border-radius: 4px; height: 30px; font-size: 14px; width: 105px" class="lock-btn" @click.prevent="handleLock('lock')" :disabled="route.query.type && route.query.type === 'sonaccount'">
                        {{ state.showOperationList.lockState === 1 ? '解除锁定' : '远程锁定' }}
                    </van-button>
                </van-col>
                <van-col span="8">
                    <van-button type="primary" color="#FE7E41" block size="small" class="lock-btn" style="border-radius: 4px; height: 30px; width: 105px; font-size: 14px" @click.prevent="handlereset('reset')">重启设备 </van-button>
                </van-col>
                <van-col v-if="showOperationList?.cabinetAttr?.supportOpenDoor" span="8">
                    <van-button v-if="showOperationList?.cabinetAttr?.supportOpenDoor" type="primary" :loading="remoteLoading" round block color="#FE7E41" size="small" class="lock-btn" style="border-radius: 4px; height: 30px; font-size: 14px; width: 105px" @click.prevent="handleOpenModel('open')" :disabled="route.query.type && route.query.type === 'sonaccount'">
                        远程开门
                    </van-button>
                </van-col>
            </van-row>
        </div> -->
        <!-- <div class="lock-status" style="padding: 0 15px">
            <van-row gutter="20">
                <van-col span="8">
                    <van-button v-if="showOperationList?.cabinetAttr?.supportOpenLock" class="lock-btn" @click.prevent="handleDeviceLock('fighting')" type="primary" color="#FE7E41" style="border-radius: 4px; height: 30px; width: 105px; font-size: 14px" block size="small" :disabled="route.query.type && route.query.type === 'sonaccount'">
                        设备提锁
                    </van-button>
                </van-col>
                <van-col span="8">
                    <van-button class="lock-btn" @click.prevent="handleUnBind" type="primary" color="#FE7E41" style="border-radius: 4px; height: 30px; width: 105px; font-size: 14px" block size="small" :disabled="route.query.type && route.query.type === 'sonaccount'">解除绑定</van-button>
                </van-col>
                <van-col span="8">
                    <van-button v-if="showOperationList?.cabinetAttr?.supportTakePhoto" class="lock-btn" @click.prevent="handleRomote" type="primary" color="#FE7E41" style="border-radius: 4px; height: 30px; width: 105px; font-size: 14px" block size="small" :disabled="route.query.type && route.query.type === 'sonaccount'">远程拍摄</van-button>
                </van-col>
            </van-row>
        </div> -->
        <van-dialog v-model:show="show" show-cancel-button title="申请解除设备绑定" class="agreeDialog" confirmButtonText="确定" cancelButtonText="取消" @confirm="refuseConfirmn('unbind')" @cancel="refuseCancel">
            <div class="unbind-tips">
                <p class="unbind-tips-desc">该申请通过后，设备{{ showOperationList.deviceCode }}将与您解除绑定关系</p>
            </div>
        </van-dialog>
        <!-- 这是远程拍摄开始 -->
        <van-dialog v-model:show="shootingShow" :before-close="(action) => handleRemoteClose(action, 'remote')" @confirm="refuseConfirmn('remote')" @cancel="refuseCancel" show-cancel-button title="请确认是否操作远程拍摄" class="agreeDialog shootingShow" confirmButtonText="确定" cancelButtonText="关闭">
            <van-radio-group v-model="shootingShowCheck" direction="horizontal" class="remote-raduo-gruop" v-if="doorsize === 2">
                <van-radio name="1" class="remote-raduo-gruop-l">左门</van-radio>
                <van-radio name="2" class="remote-raduo-gruop-r">右门</van-radio>
            </van-radio-group>
            <div class="unbind-tips">
                <!-- <p class="unbind-tips-desc">操作解除设备绑定后，系统会创建工单由管理员审批</p>-->
                <h4 class="unremot-tips-title">提示：</h4>
                <ul class="unremot-tips-title-content">
                    <li>1. 请不要在消费者交易时远程操作设备</li>
                    <li>2. 拍摄照片/视频会消耗流量，请谨慎操作</li>
                    <li>3. 拍摄结果上传完成需要一定时间，请关注消息通知或工单任务</li>
                </ul>

            </div>
        </van-dialog>
        <!-- 这是远程拍摄结束 -->
        <van-dialog v-model:show="showTips" @confirm="refuseConfirmns" @cancel="refuseCancels" show-cancel-button title="设备远程操作" class="agreeDialog" confirmButtonText="确定" cancelButtonText="取消">
            <div class="unbind-tips">
                <p class="unbind-tips-desc">请注意，不要在用户交易时刻远程操作设备</p>
            </div>
        </van-dialog>
        <!-- 获取设备最新状态开始 -->
        <van-dialog v-model:show="equststus" @confirm="equstatuscancel" @cancel="equstatusrefuse()" show-cancel-button title="确定获取设备最新状态" class="agreeDialog shootingShow" confirmButtonText="确定" cancelButtonText="关闭">
            <div class="unbind-tips">
                <!-- <p class="unbind-tips-desc">操作解除设备绑定后，系统会创建工单由管理员审批</p>-->
                <h4 class="unremot-tips-title">提示：</h4>
                <ul class="unremot-tips-title-content">
                    <li> 1、单个设备每10秒最多只能下发1个更新指令，请勿频繁操作。</li>
                    <li> 2、下发更新指令后，设备返回结果需要一定时间，请耐心等待。</li>
                </ul>

            </div>
        </van-dialog>
        <!-- 获取设备重启-->
        <van-dialog v-model:show="deviceResetShow" @confirm="equstatuscancels" @cancel="equstatuscancelss()" show-cancel-button="false" title="提示" class="agreeDialog shootingShow" cancelButtonText="关闭" :show-confirm-button=false>
            <div class="unbind-tips">
                <ul class="unremot-tips-title-content">
                    <li> 当前设备有消费者正在开门购物，请在交易结束后操作，感谢！</li>
                </ul>
            </div>

        </van-dialog>
        <!-- 获取设备提锁-->
        <van-dialog v-model:show="deviceResetShows" @confirm="equstatuscancels" @cancel="equstatuscancels()" show-cancel-button title="设备提锁" class="agreeDialog shootingShow" cancelButtonText="关闭" :show-confirm-button=false>
            <div class="unbind-tips">
                <ul class="unremot-tips-title-content">
                    <li> 只有在门锁状态为“锁关门开”的状态下，可以操作远程提锁！</li>
                </ul>
            </div>
        </van-dialog>
        <openLock :show="selectDoorLock"></openLock>

        <!-- 这是校验用户身份开始 -->
        <van-dialog width="292" v-model:show="userLoginShow" :before-close="handleBeforeClose" @cancel="handleCloseRemote" show-cancel-button title="远程开门" class="agreeDialog shootingShow" confirmButtonText="确定" cancelButtonText="关闭">
            <div class="unbind-tips">
                <h4 class="unremot-tips-title-open">提示：操作远程开门需要经过授权</h4>
                <div class="pl24 pr24 title-open">
                    <div class="divInput">
                        <div class="input" >
                            <input @focus="openValue" readOnly :disabled="codeDisabled?true:false" style="width: 244px;margin-top: 33px;border:none;padding-left:16px;box-sizing:border-box;m: 16px;height: 40px;background: #F6F6F6;border-radius: 20px;" placeholder="请选择"  class="user-select" v-model="user" type="text">

                        </div>
                        <div class="list" v-show="shows">
                            <ul>
                                <li style="width: 234px;background: #F6F6F6;padding-left:16px;" v-for="item in roleList" :key="item.phoneMobile" @click="getvalue(index, item)">{{ item.merchantName }}</li>
                            </ul>
                        </div>
                    </div>

                    <!-- <select :disabled="codeDisabled" style="width: 244px;margin-top: 33px;margin-bottom: 16px;height: 40px;background: #F6F6F6;border-radius: 20px;" v-model="user" placeholder="请选择" @change='changeUser' class="user-select">
                        <option style="width: 204px;background: #F6F6F6;" v-for="item in roleList" :key="item.phoneMobile" :label="item.merchantName" :value="item.phoneMobile" />
                    </select> -->
                    <p class="sendmsg">系统将短信形式给以上角色 <span style="color: #FE7E41">(尾号{{ lastCode }})</span>发送6位授权码，请您联系对方获取</p>
                    <van-field
                        v-model="sms"
                        center
                        clearable
                        type="number"
                        label="授权码"
                        placeholder="请输入授权码"
                        maxlength="6"
                        calss="getSmsClass"
                    >
                        <template #button>
                            <van-button class="sms-button" size="small"  border="none" plain color="FE7E41" :disabled="sendDisabled" @click="getCode">{{text}}</van-button>
                        </template>
                    </van-field>
                    <div class="checksms">请提交授权码，提交正确则系统会下发远程开门指令。</div>

                </div>

            <!-- <van-dropdown-menu>
                    <van-dropdown-item  v-for="(item, index) in roleList" :key="index" v-model="value1" :options="roleList" />
                </van-dropdown-menu> -->
            <!-- <van-cell-group inset>
                    <van-field
                        v-model="mobile"
                        name="pattern"
                        label=""
                        maxlength="12"
                        type="tel"
                        placeholder="输入手机号"
                        clearable
                        :formatter="formatter"
                        format-trigger="onChange"
                        :rules="[{ required: true, message: '请输入手机号' }]"
                    />
                </van-cell-group> -->
            <!-- <ul class="unremot-tips-title-content">
                    <li>1. 请不要在消费者交易时远程操作设备</li>
                    <li>2. 拍摄照片/视频会消耗流量，请谨慎操作</li>
                    <li>3. 拍摄结果上传完成需要一定时间，请关注消息通知或工单任务</li>
                </ul> -->

            </div>
            <div class="lh"></div>
            <template v-slot:footer>
                <div class="msg-w">
                    <span class="popup-info-handle handle-active" @click="handleCloseRemote" style="font-size:16px">关闭 </span>
                    <span class="popup-info-handle handle-active" @click="handleConfirmRemote" style="color:#FE7E41;font-size:16px">确认</span>
                </div>

            </template>
        </van-dialog>

        <van-dialog v-model:show="selectDoor" :before-close="(action) => handleRemoteClose(action, 'OpenLock')" show-cancel-button :title="isType=== 'opendoor'?'远程开门':'远程提锁'" class="agreeDialog" confirmButtonText="确定" cancelButtonText="取消" @confirm="confirmLock('OpenLock')" @cancel="refuseCancel">
            <div class="unbind-remotelock">
                <p class="two-door-dialog-title">该型号设备为双开门柜，请选择左右门</p>
                <van-radio-group v-model="checked" direction="horizontal" class="two-door-dialog-radio">
                    <van-radio name="1" class="two-door-dialog-radio-l">左门</van-radio>
                    <van-radio name="2" class="two-door-dialog-radio-r">右门</van-radio>
                </van-radio-group>
            </div>
        </van-dialog>

    </div>
</template>

<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue'
import { Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import {
    getDeviceDetail, getPowerModeConfig, sendSmsEquipment, openCheck, getDeviceUnBind, getDeviceLock, getDeviceRestart, getDeviceOpen, getDeviceLiftingLock, getPowerMode, equiUpdate, volumeCtrl, getRemoteShot, getDeviceStates,
    getRefreshEquipmentStatus, checkSmsCode
} from '@/api/device'
import openLock from './components/open-lock.vue'

import { closePage } from '@/utils/composables'
import { getAppStorageFn } from '@/utils/storage'
import { appBridge } from '@/utils/bridge.js'
import { msgIdGetDetailId } from '@/api/order'

const router = useRouter()

const route = useRoute()
const msgId = route.query.msgId
const extField = ref(null)
const Checkn = require('@/assets/Checkn.png')
const Unchecked = require('@/assets/Unchecked.png')

const goBack = () => {
    const target = localStorage.getItem('target') // 得到来源，跳转到指定页面
    if (target === 'details') {
        localStorage.removeItem('target')
        window.location.href = '/device/device-list'
    } else {
        closePage()
    }
}
// const value1 = ref(0)
// const option1 = [
//     { text: '全部商品', value: 0 }
// ]

// 返回上一级
const show = ref(false)
const shows = ref(false)
const selectDoor = ref(false)
const selectDoorLock = ref(false)

// const openValue = () => {
//     shows.value = !shows.value
// }

const isType = ref('open')
const sms = ref('')
const sendDisabled = ref(false)
const lockStatuss = ref(null)
const logicState = ref(false)
// 远程拍摄
const shootingShow = ref(false)
const equststus = ref(false)
const temperatureShow = ref(false)

// 编辑设备信息
const editType = ref(false)
// 温度设置
const deviceSetting = ref(false)
// 温度控制时间
// const effectiveShow = ref(false)

const tempIndex = ref(0)
const getTempIndex = () => {
    if (settings.temperature) {
        const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        tempIndex.value = list.indexOf(Number(settings.temperature))
    }
}
const temperatureList = [
    {
        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        defaultIndex: tempIndex
    }
]
// 设置项
const setTempture = () => {
    temperatureShow.value = state.isOffTemplature.powerMode === 1 || state.isOffTemplature.powerMode === 0
    getTempIndex()
}

// const refuseConfirmnLock = () => {
//     selectDoor.value = true
// }

const startIndex = ref(0)
const endIndex = ref(0)
const userphone = ref(null)
const getvalue = (index, item) => {
    console.log('getvalue', item)

    // this.value=item.name;
    const str = String(item.phoneMobile).trim()
    userphone.value = str
    const part = str.substring(7, 11)
    lastCode.value = part

    user.value = item.merchantName
    shows.value = false
}
const getDefaultIndex = () => {
    // 说明有时间数据
    if (settings.openingHour && settings.closingHour) {
        const start = settings.openingHour
        const end = settings.closingHour
        const arr = createTimePeriod()

        const times = arr.map(item => item.hour)
        startIndex.value = times.indexOf(start)
        endIndex.value = times.indexOf(end)
    }
}
const user = ref(null)
// const changeUser = (e) => {
//     const str = String(e.target.value).trim()
//     user.value = str
//     const part = str.substring(7, 11)
//     lastCode.value = part
// }
const handleBeforeClose = (action) =>
    new Promise((resolve) => {
        if (action === 'confirm') {
            resolve(false)
        } else {
        // 拦截取消操作
            resolve()
        }
    })
// 短信验证码  确定
const handleConfirmRemote = async () => {
    isType.value = 'opendoor'

    if (!sms.value || sms.value.length !== 6) {
        Toast.fail('请输入正确授权码')
        userLoginShow.value = true
    } else {
        const { code } = await sendSmsCode()
        // if (code === '200' && doorType.value) {
        if (code === '200' && doorsize.value === 2) {
            userLoginShow.value = false

            selectDoor.value = true
            checked.value = 0
        } else {
            userLoginShow.value = false
            handleOpen()
            handleCloseRemote()
        }
    }
}
// 获取授权码
const sendSmsCode = async () => {
    const params = {
        customerMobile: userphone.value,
        smsCode: sms.value
    }
    const { data, code, msg } = await checkSmsCode(params)

    return { data, code, msg }
}
// 确定左门油门
// 确定左门油门
const confirmLock = async () => {
    if (!checked.value) {
        Toast('请选择要操作的门')
    } else {
        console.log(isType.value, 'isType.value')
        if (isType.value === 'opendoor') {
            handleOpen()
            handleCloseRemote()
        } else {
            deviceOpenLock()
        }
    }
}
// const confirmLock = async () => {
//     if (!checked.value) {
//         Toast('请选择要操作的门')
//     } else {
//         if (isType.value === 'opendoor') {
//             handleOpen()
//             handleCloseRemote()
//         } else {
//             deviceOpenLock()
//         }
//     }
// }
const timer = ref(null)

const text = ref('获取授权码')
const codeDisabled = ref(false)
const getCode = () => {
    if (!user.value) {
        Toast('请先选择用户')
    }
    let time = 60
    timer.value = setInterval(async () => {
        if (time === 0) {
            clearInterval(timer)
            sendDisabled.value = false
            text.value = '获取授权码'
        } else {
            time--
            text.value = `${time > 9 ? time : '0' + time}s`
            sendDisabled.value = true
            // codeDisabled.value = true
        }
    }, 1000)
    getSmsCode()
}

const createTimePeriod = () => {
    const arr = []
    for (let i = 0; i <= 23; i++) {
        const hour = i < 10 ? `0${i}:00` : `${i}:00`
        arr.push({
            val: i,
            hour
        })
    }
    return arr
}

const effectiveShow = ref(false)
const timeColumns = [
    {
        values: createTimePeriod(),
        defaultIndex: startIndex
    },
    {
        values: createTimePeriod(),
        defaultIndex: endIndex
    }
]
const serviceHotline = ref(0)
const placementPosition = ref('')
const deviceStateData = ref(null)

const showTips = ref(false)
// 短信弹窗是否显示
const userLoginShow = ref(false)

const handleCloseRemote = () => {
    userLoginShow.value = false
    text.value = '获取授权码'
    sendDisabled.value = false
    codeDisabled.value = false
    user.value = ''
    clearInterval(timer)
}

const type = ref(false)
const deviceStatus = ref(false)
const editDatas = ref('')
const deviceResetShow = ref(false)
const deviceResetShows = ref(false)
// 设备型号属性是都展示
const deviceModelAttrsShow = ref(false)
// 判断门类型
const doorType = ref(0)

// 复制
const state = reactive({
    showOperationList: {},
    // 安装位置
    showSeatList: [],
    doorsize: 1, // 区分单开门柜子还是多开门柜
    editData: '',
    isOffTemplature: {}, // 制冷控制是否开启
    params: {
        deviceCode: extField?.value ? extField?.value?.deviceCode : null,
        busiCode: 'A1001022',
        appKey: 'A1001001'
    }
})

// 设备状态
const { showOperationList, showSeatList, isOffTemplature, doorsize } = toRefs(state)
console.log(isOffTemplature, '====isOffTemplature==', doorsize.value)

const isStatus = ref(null)
const locationName = ref('')
const merchantInfo = reactive({
    locationName: route.query.locationName ? route.query.locationName : locationName,
    deviceAdress: route.query.placementPosition ? route.query.placementPosition : placementPosition
})

// const merchantInfo = reactive({
//     locationName: route.query.target !== 'detail' ? (route.query.locationName ? route.query.locationName : '') : placementPosition,
//     deviceAdress: route.query.target !== 'detail' ? (route.query.address ? route.query.address : '') : ''
// })
sessionStorage.setItem('ss', showSeatList)

// 更新设备详情 - 安装位置
const updateData = async () => {
    await equiUpdate({
        busiCode: 'A1001022',
        appKey: 'A1001001',
        locationCode: route.query.locationCode,
        locationName: route.query.locationName,
        deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null
        // deviceCode: route.query.index
    })
}

const getSmsCode = async () => {
    const params = {
        customerMobile: userphone.value,
        busiCode: 'A1001022',
        appKey: 'A1001001',
        deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null
        // deviceCode: route.query.index
    }
    const { data, code } = await sendSmsEquipment(params)
    console.log(data, code, '000')
}
const init = async () => {
    const { locationCode } = route.query
    if (locationCode) {
        updateData()
    }
    getAppStorageFn('installList', (val) => {
        const installList = JSON.parse(val) || {}

        const device = JSON.parse(sessionStorage.getItem('device')) || {} // 回显示 安装位置 选择之前填入的数据
        Object.assign(merchantInfo, { ...device })
        if (Object.keys(installList).length > 0) {
            Object.assign(merchantInfo, {
                deviceAdress: route.query.placementPosition ? route.query.placementPosition : `${installList.address}`
            })
            Object.assign(merchantInfo, {
                locationName: `${installList.locationName}`
            })

            Object.assign(merchantInfo, {
                locationCode: `${installList.locationCode}`
            })
        }
    })
}

// const getPowerDetail = async () => {
//     const res = await getPowerModeConfig()
//     console.log('--------------温度控制----', res)
// }
// await getPowerDetail()

onMounted(() => {
    // getSubLevelList()
    // getPowerDetail()

    // init()
})
// 门锁状态
// const lockStatus = ref(null)
// 详情页设备制冷控制字段 powerMode省电模式 0-常开，1-定时，3-常关
// console.log(isOffTemplature, '=========isOffTemplature======.jpg')

// lockStatus.value = isOffTemplature.powerMode === 0 ? '常开' : isOffTemplature.powerMode === 3 ? '常关' : isOffTemplature.powerMode === 2 ? '定时开启' : '-2' //  0: 关闭, 1: 开启
const getSubLevelList = async () => {
    const params = {
        busiCode: 'A1001022',
        appKey: 'A1001001',
        // deviceCode: route.query.index,
        deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : ''
    }

    const { data, code } = await getDeviceDetail(params)
    console.log(data, '000000000000000000000000000000000000000000000000000000')
    if (Number(code) === 200) {
        state.showOperationList = data || []
        serviceHotline.value = data.volume ? data?.volume : 0
        isStatus.value = data.deviceState === 0 ? '异常' : '正常'
        editDatas.value = data.deviceName
        state.doorsize = data?.cabinetAttr?.doorSize
        // placementPosition.value = data.locationName
        locationName.value = data.locationName
        placementPosition.value = data.equInstallLocation
        doorType.value = data?.cabinetDoorLis?.doorType

        sessionStorage.setItem('ownerId', state.showOperationList?.ownerId ?? '')
    }
}
const roleList = ref(null)
const lastCode = ref('') // 手机号后四位
// 获取身份
const getUserList = async () => {
    remoteLoading.value = true
    const params = {
        busiCode: 'A1001022',
        appKey: 'A1001001',
        deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null
        // deviceCode: route.query.index
    }
    const { data, code } = await openCheck(params)
    if (Number(code) === 200) {
        if (!data?.directOpenFlag) {
            remoteLoading.value = false
            userLoginShow.value = true
            const dealDate = data?.roleList || []
            const arr = []
            dealDate.forEach((ele) => {
                const text = `${ele.merchantTypeStr}: ${ele.merchantName}`
                const tel = ele.phoneMobile
                arr.push({
                    phoneMobile: tel,
                    merchantName: text
                })
            })
            console.log(arr, '000--list')
            roleList.value = arr || []
            const list = data?.roleList
            const mobile = list[0]?.phoneMobile
            const name = list[0]?.merchantTypeStr + '：' + list[0]?.merchantName

            // const mobile = list.filter(item => item.merchantTypeStr === '代运营商')[0]?.phoneMobile
            // const name = list.filter(item => item.merchantTypeStr === '代运营商')[0]?.merchantTypeStr + '：' + list.filter(item => item.merchantTypeStr === '代运营商')[0]?.merchantName

            user.value = name
            userphone.value = mobile
            const part = mobile.substring(7, 11)
            lastCode.value = part
            console.log(roleList.value, '000000000', dealDate)
            // roleList.value = arr || []
            // const list = data?.roleList
            // const mobile = list.filter(item => item.merchantTypeStr === '代运营商')[0]?.phoneMobile
            // user.value = mobile
            // const part = mobile.substring(7, 11)
            // lastCode.value = part
            // console.log(roleList.value, '000000000', dealDate)
        } else {
            isType.value = 'opendoor'
            // 双开门的话
            if (doorsize.value === 2) {
                console.log(doorsize, '----------------dddddddddddddd')
                selectDoor.value = true
                checked.value = 0
                remoteLoading.value = false
            } else {
                // 直接开门
                showTips.value = false
                remoteLoading.value = false
                handleOpen()
            }
        }
        // state.showOperationList = data || []
        // serviceHotline.value = data.volume ? data?.volume : 0
        // isStatus.value = data.deviceState === 0 ? '异常' : '正常'
        // editDatas.value = data.deviceName
        // placementPosition.value = data.equInstallLocation
        // sessionStorage.setItem('ownerId', state.showOperationList?.ownerId ?? '')
    }
}
const getPowerDetail = async () => {
    const params = {
        busiCode: 'A1001022',
        appKey: 'A1001001',
        deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null
        // deviceCode: route.query.index

    }
    const { code, data } = await getPowerModeConfig(params)
    if (Number(code) === 200) {
        state.isOffTemplature = data || {}
        settings.temperature = data.targetTemp

        if ((data.openingHour && data.closingHour) !== null) {
            settings.openingHour = data.openingHour < 10 ? `0${data.openingHour}:00` : `${data.openingHour}:00`
            settings.closingHour = data.closingHour < 10 ? `0${data.closingHour}:00` : `${data.closingHour}:00`
            const time = `${data.openingHour}:00~${data.closingHour}:00`
            Object.assign(settings, { effective: time })
        }
        lockStatuss.value = data.powerMode === 0 ? '常开' : data.powerMode === 3 ? '关闭制冷' : data.powerMode === 1 ? '定时开启' : '-2' //  0: 关闭, 1: 开启
    }
}
const onSubmit = async (values, a) => {
    const res = await equiUpdate({
        busiCode: 'A1001022',
        appKey: 'A1001001',
        deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null, // deviceCode: route.query.index,
        deviceName: editDatas.value
    })
    if (res.code === '200') {
        Toast('操作成功！')
        await getSubLevelList()
        editType.value = false
    }
}

// 设置项
const settings = reactive({
    status: state.isOffTemplature.powerMode,
    temperature: '8',
    effective: '',
    closingHour: '', // 开启
    openingHour: ''// 关闭时刻
})

const onConfirmEffective = (value) => {
    if (value[0].val >= value[1].val) {
        Toast('结束生效时间不能小于或者等于开始生效时间!')
        return
    }
    effectiveShow.value = false
    const time = `${value[0].hour}~${value[1].hour}`
    if (value[0].hour) Object.assign(settings, { openingHour: value[0].val })
    if (value[1].hour) Object.assign(settings, { closingHour: value[1].val })

    Object.assign(settings, { effective: time })
}

const onConfirmTempera = (value) => {
    temperatureShow.value = false
    Object.assign(settings, { temperature: value })
}

// 设置温度
const handleDeviceSetting = () => {
    deviceSetting.value = true
}
// 每日生效时间
const effectiveShowHandle = () => {
    getDefaultIndex()
    effectiveShow.value = true
}
const handleSubmitSettings = async (values) => {
    const params = {
        busiCode: 'A1001022',
        appKey: 'A1001001',
        // deviceCode: route.query.index,
        deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null,
        operatorId: sessionStorage.getItem('operatorId'),
        operatorName: sessionStorage.getItem('operatorName'),
        powerMode: state.isOffTemplature.powerMode, // 1可删除
        targetTemp: settings.temperature
    }

    const mode = state.isOffTemplature.powerMode
    const times = {
        closingHour: settings.closingHour, // 开启时刻
        openingHour: settings.openingHour // 关闭时刻
    }
    const { code } = await getPowerMode(mode === 0 || mode === 3 ? params : { ...params, ...times })

    if (code === '200') {
        deviceSetting.value = false
        await getSubLevelList()
        await getPowerDetail()
    }
}

// 解除绑定
const handleUnBind = async (values) => {
    show.value = true
}
// 远程拍摄
const handleRomote = async (values) => {
    // shootingShowCheck.value = 0
    shootingShow.value = true
}
// 设备状态
const handleDeviceStatus = async (val) => {
    const res = await getDeviceStates({
        busiCode: 'A1001022',
        appKey: 'A1001001',
        deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null
        // deviceCode: route.query.index
    })
    deviceStateData.value = res.data

    if (!res.code) Toast(res.msg)
    logicState.value = true
    deviceStatus.value = true
}
// 设备型号具体属性
const handleDeviceModelAttributes = async () => {
    deviceModelAttrsShow.value = true
}
// 设备型号具体属性dialog隐藏
const closePopver = async () => {
    deviceModelAttrsShow.value = false
}
// 选择安装位置
const showLocationPopupsPostion = () => {
    sessionStorage.setItem('device', JSON.stringify(merchantInfo))
    router.replace({
        path: '/device/device-seat',
        query: {
            target: '',
            index: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : 0,
            showNavbar: 0
        }

    })
}
// 远程拍照确定
const refuseCancel = async () => {
    show.value = false
}
// 确定
const refuseCancels = async () => {
    showTips.value = false
}
const soundChange = async (val) => {
    const res = await volumeCtrl({
        busiCode: 'A1001022',
        appKey: 'A1001001',
        deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null, // deviceCode: route.query.index,
        operatorId: sessionStorage.getItem('operatorId'),
        operatorName: sessionStorage.getItem('operatorName'),
        volume: val
    })
    if (!res.code) Toast(res.msg)
}

// 关闭弹窗前判断
const handleRemoteClose = (action, type) => {
    let currentVal
    switch (type) {
    case 'remote':
        currentVal = shootingShowCheck.value

        break
    case 'OpenLock':
        currentVal = checked.value
        break
    default:
        break
    }
    console.log(currentVal, 'TYPE')

    return new Promise((resolve) => {
        setTimeout(() => {
            if (action === 'confirm' && currentVal) {
                resolve(true)
            } else if (action === 'cancel') {
                resolve(true)
            } else {
                // 拦截取消操作
                resolve(false)
            }
        }, 500)
    })
}

// 确定
const refuseConfirmn = async (type) => {
    if (!shootingShowCheck.value && doorsize.value === 2 && type === 'remote') {
        Toast('请选择要操作的门')
    } else {
        if (type !== 'remote') {
            const { code } = await getDeviceUnBind({
                busiCode: 'A1001022',
                appKey: 'A1001001',
                // deviceCode: route.query.index,
                deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null,
                operatorId: sessionStorage.getItem('operatorId'),
                operatorName: sessionStorage.getItem('operatorName')
            })
            if (code === '200') {
                Toast('操作成功')
            }
        } else {
            handleShooting()
        }
    }
}

// 远程锁定
const handleLock = async () => {
    try {
        const { code, msg } = await getDeviceLock({
            busiCode: 'A1001022',
            appKey: 'A1001001',
            // deviceCode: route.query.index,
            deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null,
            operatorId: sessionStorage.getItem('operatorId'),
            operatorName: sessionStorage.getItem('operatorName'),
            // lockState: 1 // 锁定状态
            lockState: state.showOperationList.lockState === 1 ? 0 : 1
        })

        if (code === '200') {
            await getSubLevelList()
        }
        if (code !== 200) Toast(msg)
    } catch (error) {
        Toast(error)
    }
}
// 远程开门
const handleOpen = async () => {
    try {
        const { msg, code } = await getDeviceOpen({
            busiCode: 'A1001022',
            appKey: 'A1001001',
            // deviceCode: route.query.index,
            doorType: checked.value,
            deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null,
            operatorId: sessionStorage.getItem('operatorId'),
            operatorName: sessionStorage.getItem('operatorName')
        })
        if (code !== 200) Toast(msg)
    } catch (error) {
        Toast(error)
    }
}
// 设备重启
const handlereset = async () => {
    try {
        const { msg, code } = await getDeviceRestart({
            busiCode: 'A1001022',
            appKey: 'A1001001',
            deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null, // deviceCode: route.query.index,
            operatorId: sessionStorage.getItem('operatorId'),
            operatorName: sessionStorage.getItem('operatorName'),
            lockState: 0 // 锁定状态
        })

        if (code === '095406') {
            deviceResetShow.value = true
        } else if (code === '100') {
            deviceResetShow.value = true
        } else {
            Toast(msg)
        }
    } catch (error) {
        Toast(error)
    }
}
// 设备提锁左门右门
const checked = ref(0)
// 远程拍摄左门右门
const shootingShowCheck = ref(0)
// 设备提锁
const handleDeviceLock = async () => {
    if (!doorType.value && doorsize.value === 2) {
        isType.value = 'openlock'
        selectDoor.value = true
        checked.value = 0
    } else {
        await deviceOpenLock()
    }
}
const deviceOpenLock = async () => {
    try {
        const { msg, code } = await getDeviceLiftingLock({
            busiCode: 'A1001022',
            appKey: 'A1001001',
            doorType: checked.value,
            // deviceCode: route.query.index,
            deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null,
            operatorId: sessionStorage.getItem('operatorId'),
            operatorName: sessionStorage.getItem('operatorName')
        })

        if (code === '095405') {
            deviceResetShows.value = true
        } else if (code === '100') {
            deviceResetShows.value = true
        } else {
            Toast(msg)
        }
    } catch (error) {
        // Toast(error)
    }
}
// 远程 拍摄
const handleShooting = async () => {
    // shootingShowCheck.value = 0
    shootingShow.value = true

    try {
        const { code, msg } = await getRemoteShot({
            busiCode: 'A1001022',
            appKey: 'A1001001',
            // deviceCode: route.query.index,
            deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null,
            commandType: 'photo',
            // init
            doorType: shootingShowCheck.value
        })
        if (code !== 200) Toast(msg)
        // 失败或者成功时候弹窗消失
        shootingShow.value = false
        shootingShowCheck.value = 0
    } catch (error) {
        Toast(error)
    }
}
// 修改安装位置
const handleEdit = async () => {
    editType.value = true
}

// 远程开门防止重复点击
const remoteLoading = ref(false)
// 远程开门
// 远程开门
const handleOpenModel = async (val) => {
    isType.value = 'opendoor'
    if (type.value === 'open') await getUserList()
    // userLoginShow.value = false
    // 弹窗前校验用户身份
    // showTips.value = false
    type.value = val
}
// const handleOpenModel = async (val) => {
//     if (type.value === 'open') await getUserList()
//     // userLoginShow.value = false
//     // 弹窗前校验用户身份
//     // showTips.value = false
//     type.value = val
// }
// 状态按钮用t状态区分
const refuseConfirmns = async () => {
    if (type.value === 'lock') {
        handleLock()
    } else if (type.value === 'open') {
        console.log(handleOpen())
    } else if (type.value === 'reset') {
        handlereset()
    } else if (type.value === 'fighting') {
        handleDeviceLock()
    }
}

// 订单详情 需要一个订单状态
const handleOrderDetail = (orderNo) => {
    // appBridge('goMyPage')
    // let url = ''
    if (orderNo === '' || !state.showOperationList.hasOrderRight) {
        return
    }
    const orderType = state.showOperationList.orderType
    let url = ''
    if (orderType === 1) {
        url = `${window.location.origin}/container/lease/${orderNo}/4`
    } else if (orderType === 2) {
        url = `${window.location.origin}/container/stag/${orderNo}/4`
    } else if (orderType === 3) {
        return
        // url = `${window.location.origin}/container/stag/${orderNo}/4`
    }
    appBridge('openNewPage', {
        url
    })
}
const orderType = state.showOperationList.orderType

// 合同
const handleContract = (contractUri) => {
    if (!state.showOperationList.hasContractRight || !contractUri || orderType.value === 3) {
        return
    }
    appBridge('openContract', {
        contractUri: state.showOperationList.contractUri
    })
}
// 获取设备最新状态
const getequsttaus = async () => {
    equststus.value = true
}
const equstatusrefuse = async (values) => {
    equststus.value = false
}
const equstatuscancel = async (values) => {
    getRefreshStatus()
}
const equstatuscancelss = async (values) => {
    deviceResetShow.value = false
}
const equstatuscancels = async (values) => {
    deviceResetShows.value = false
}
// 获取设备最新状态
const getRefreshStatus = async () => {
    try {
        const param = {
            // deviceCode: route.query.index,
            deviceCode: extField.value ? extField.value.deviceCode : route.query.index ? route.query.index : null,
            abnormalTypeList: [],
            busiCode: 'A1001022',
            appKey: 'A1001001'
        }
        const res = await getRefreshEquipmentStatus(param)

        if (res.code === '200') {
            Toast(res.message)
            equststus.value = false
        }
    } catch (error) {
        Toast(error)
    }

    // init(param, paramsObj)
}
const getopenDoorDetail = async () => {
    console.log(extField.value.deviceCode, '000')
    console.log(extField.value.deviceCode, 'getopenDoorDetail-extField-')

    // const param = {
    //     workOrderId: extField.value ? extField.value.workOrderNo : '',
    //     busiCode: 'A1001022',
    //     appKey: 'A1001001'
    // }
    // {
    //     deviceCode: extField.value ? extField.value.applicationId : '',
    //     busiCode: 'A1001022',
    //     appKey: 'A1001001'
    // }

    // console.log(extField.value.applicationId, '000')

    getSubLevelList()
    getPowerDetail()
    init()
    // if (res.code === '200') {
    //     list.value = res.data || []
    // }

    // init(param, paramsObj)
}

const queryDetailId = async () => {
    const param = {
        msgId: msgId,
        busiCode: 'A1001002'
    }
    const res = await msgIdGetDetailId(param)
    console.log(res)
    if (res.code === '200') {
        extField.value = JSON.parse(res.data.extField)
        getopenDoorDetail()
    }
}
if (msgId) {
    console.log('消息中台跳转')
    queryDetailId()
} else {
    getSubLevelList()
    getPowerDetail()
    init()
}
const openValue = () => {
    shows.value = !shows.value
}
</script>
<style lang="scss" scoped>
.mine-content {
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #fe7e41;
    --van-nav-bar-title-font-size: 34px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    .van-nav-bar__placeholder {
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
        .van-hairline--bottom:after {
            border-bottom-width: 0;
        }
    }
}
.goodsDetailsBox {
    background: #fff;
    padding-bottom: 16px;
    padding-bottom: calc(16px + constant(safe-area-inset-bottom));
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
    .two-door-lh79 {
        height: 158px !important;
    }
      .one-door-lh79 {
        height: 102px !important;
    }

    .two-door-dialog-title {
        color: red;
        width: 512px;
        margin: 40px auto 0;
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;

    }
    .two-door-dialog-radio{
margin: 34px auto;
font-size: 26px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #696969;
    }
    .two-door-dialog-radio-l{
           margin-left: 120px;
    }
    .two-door-dialog-radio-r {
        margin-left: 140px;
    }
    .ptb4{
        padding: 8px 0;
    }
    .remote-raduo-gruop {
width: 100%;
font-size: 26px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #696969;
margin-top:56px;
.remote-raduo-gruop-l {
    padding-left: 124px;
}
.remote-raduo-gruop-r {
    padding-left: 140px;
}
    }
    .unbind-tips-desc {
        text-align: center;
        // padding-left:64px;

        width: 456px;
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;
        padding-left: 64px;
        margin-bottom: 41px;
        margin-top: 20px;
    }

    .device-status-title {
        height: 132px;
        display: flex;
        align-items: center;
        width: 100%;
        text-align: center;
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191919;
        border-bottom: 0.5px solid #e7e7e7;
    }
    .lock_status,
    .internet_status {
        height: 102px;
        border-bottom: 0.5px solid #f4f5f5;
        box-sizing: border-box;
        padding-left: 50px;
display: flex;
align-items: center;    }
    .two-door-lh87  {
        height: 174px;
    }
      .one-door-57  {
        height: 114px;

    }

    .pd0{
        padding-left: 4vw !important;
        font-family: PingFangSC-Regular, PingFang SC !important;
        font-weight: 400 !important;
        color: #191919 !important;
        border-bottom:  none !important;
        :deep(.van-cell__label){
             color: #191919 !important;
                   font-weight: 400 !important;
        color: #191919 !important;
                     font-family: PingFangSC-Regular, PingFang SC !important;

        }
    }
    .lock_status{
        :deep(.van-cell__title) {
            display: flex;
            flex: 1;
            align-items: center;
            font-size: var(--van-cell-font-size) !important;
            span{
                display: flex;
                font-size: var(--van-cell-font-size) !important;
                flex: 1;
            }

        }

    }
.lock_status {
    .normalClasss{
           color: #69925a;
            font-size: var(--van-cell-font-size);

    }
    .label-normalClasss{
            .normalClasss{
           color: #69925a;
           font-size: var(--van-cell-font-size) !important

    }
                .errClasss{
           color: #ff2442;
                      font-size: var(--van-cell-font-size) !important

    }

    }

     .errClass {
        color: #ff2442;

    }
}
        .lock_statusc
{
    :deep(.van-cell__value){
        span {
         color: #000 !important;

    }

    }

}

    .devicemodel_status{
        :deep(.van-cell__value){
    font-size:30px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #191919;
        }

    }
    .h4-title {
        padding: 0 50px;
        line-height: 88px;
        height: 88px;
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #191919;
    }

    .title-content {
        // margin-bottom: 60px;
        padding: 0 50px;

        li {
            font-size: 26px;
            line-height: 40px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #696969;
            border: none;
            outline: 0;
        }
    }
    .seting-titles {
        position: relative;

        .setings-h3 {
            height: 130px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #191919;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            border: 1px solid #e7e7e7;
            button {
                color: #fe7e41;
                background: none;
                position: absolute;
                right: 50px;
                top: 44px;
            }
        }
        :deep(.van-button) {
            position: absolute;
            right: 20px;
            z-index: 999;
        }
        .van-hairline--bottom {
            --van-border-color: #f4f5f5;
        }
    }
    .content-edit {
        .van-cell {
            // height: 102px;
            background: #f4f5f5;
            border-radius: 8px;
            margin: 40px auto;
            box-sizing: border-box;
            font-size: 30px;
            color: #191919;
        }
    }
    .unremot-tips-title {
        padding-left: 64px;
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;
        margin-top: 30px;
    }

    .unremot-tips-title-open {
   width: 100%;
   text-align: center;
   margin-top: 16px;
// height: 36px;
    font-size: 26px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #131313;

    }
    .device-seat-span {
        width: 420px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
    }
    .unbind-tips-title-content {
        margin-top: 10px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;
        padding-left: 64px;

        line-height: 42px;
        margin-bottom: 40px;
    }
    .unremot-tips-title-content {
        margin-top: 10px;
        // height: 136px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;
        padding-left: 64px;
        padding-right: 64px;
        line-height: 42px;
        margin-bottom: 40px;
    }

    .unbind-tips-title {
        width: 584px;
        padding-left: 64px;
        font-weight: 400;
        color: #000000;
        height: 20px;

        font-size: 28px;
        margin: 0 auto;
    }

    :deep(.van-dialog__confirm, ) {
        color: rgb(254, 126, 65);
    }

    .errClass {
        color: #ff2442;
    }

    .mt130 {
        margin-top: 130px;
    }

    .okClass {
        color: #69925a;
    }

    overflow: auto;

    .errClasss {
        :deep(.van-cell__value) > span {
            color: #ff2442;
        }
    }
    .orderDetailsTitle {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 750px;
        height: auto;
        background: linear-gradient(#fe7e41 0%, #ff5c0e 100%);
        font-size: 34px;
        text-align: center;
        line-height: 140px;

        .equipment {
            // float: left;
            font-weight: 600;
            color: #fff;
            width: 136px;
            height: 48px;
        }

        .back {
            color: #fff;
            float: left;
            margin-left: 20px;
            margin-top: 50px;
        }
    }
.pl24{
    padding-left: 50px;
}
    .checksms{
        font-size: 26px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #696969;
margin-bottom: 32px;
    }

.sendmsg{
font-size: 26px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #696969;
 margin-top: 32px;
}
.pr24{
    padding-right: 50px;
}
    .content-status {
        .device_status,
        .lock_status,
        .internet_status {
            height: 98px;

            box-sizing: border-box;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            border-bottom: 0.5px solid #f4f5f5;
            font-size: 30px;
            box-sizing: border-box;
        }

        .tips,
        .unbind-tips {
            .h4-title {
                padding: 0 50px;

                height: 88px;
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #191919;
            }

            .title-content {
                margin-bottom: 60px;
                padding: 0 50px;

                li {
                    font-size: 26px;
                    line-height: 40px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #696969;
                    border: none;
                    outline: 0;
                }
            }
        }
    }

    .unbind-content {
        font-size: 30px;
        color: #696969;
        margin: 20px 64px;
    }

    .setting {
        height: 500px;
    }

    .seting-title {
        width: 100%;
        box-sizing: border-box;
        font-size: 32px;
        color: #191919;
        position: absolute;
        height: 132px;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        :deep(.van-radio__icon--checked) {
            background: yellow;
        }
    }
    .mb20 {
        margin-bottom: 20px;
        height: 40px;
    }
    .setting-content {
        padding-top: 132px;
        .guizhu-field-temperature{
            :deep(.van-cell__title){
                width: 400px;
            }

        }
        :deep(.van-radio--horizontal){
                margin-right: 60px;
            }
    }

    .tips {
        text-align: left;
        margin: 20px auto;
        margin-left: 0%;
        margin-bottom: 40px;
        & > span {
            text-align: left;
            display: block;
            color: #696969;
        }
    }

    .informationBox {
        display: flex;
        padding-top: 26px;
    }

    .informationTitle {
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191919;
        margin-left: 20px;
    }

    .line {
        width: 10px;
        height: 28px;
        background: #fe7e41;
        display: block;
        margin-top: 6px;
    }

    .originalBox {
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fe7e41;
        margin-left: 346px;
    }

    .transverse {
        width: 631px;
        height: 2px;
        margin-left: 30px;
        background: #f2f6f9;
        margin-top: 17px;
    }

    .equipmentBox {
        // width: 690px;
        // height: 428px;
        background: #fff;
        margin-top: 20px;
        // margin-left: 30px;
        margin-bottom: 30px;
        position: relative;
        .mantle {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999;
            background: #fff;
            opacity: 0;
        }

        :deep(.van-field__label) {
            // background: red;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            // background: red;

            font-size: 30px;
        }

        .outside {
            box-sizing: border-box;
            height: 113px;
            line-height: 113px;
            display: flex;
            justify-content: space-between;
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            border-bottom: 1px solid #f4f5f5;
            // margin-top: 20px;
            // background: red;
            margin: 0 30px;
            :deep(.van-cell) {
                padding: 0;
                display: flex;
                align-items: center;
                font-size: 30px;
                font-weight: 400;
            }
            .withinLeft {
                // width: 120px;
                color: #191919;
                // margin-left: 30px;
            }

            .withinRight {
                flex: 1;
                // width: 470px;
                color: #191919;
                // margin-right: 30px;
                text-align: right;

                :deep(.van-cell__title) {
                    text-align: left;
                    background: red;
                }
            }
        }

        .errClass {
            :deep(.van-field__control) {
                color: #ff2442;
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
            }
        }

        .okClass {
            :deep(.van-field__control) {
                color: #69925a;
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
            }
        }
        .normalClasss {
            :deep(.van-cell__value) {
                color: #69925a;
            }
        }
        .normalClasss {
            :deep(.van-field__control) {
                color: #69925a;
            }
        }

        .popup-deviceName :deep(.van-popup) {
            position: fixed;
            bottom: 0;
        }
    }
    .custom-button {
        width: 32px;
        height: 32px;
        color: #fff;
        line-height: 32px;
        text-align: center;
        background-color: #fe7e41;
        border-radius: 50%;
    }
    .classTow {
        min-height: 391px;
        overflow: initial;
    }

    .devceSeat {
    }
    .putTow {
        display: flex;
        justify-content: flex-end;
        height: 96px;
        margin-top: -20px;
    }
.lh{
    border-bottom: 1px solid #DDDDDD;
}

  .input{

    position: relative;
  }

  .list{
    overflow: hidden;
    width: 488px;
    ul li{
    width: 100%;
    height: 80px;
    cursor: pointer;

    padding-left: 10px;
     ul li:hover{
    background-color: #cccccc;
  }
  }
  }

    .putOne {
        display: flex;
        justify-content: flex-end;
        height: 96px;
        margin-top: -30px;
        // float: right;
    }

    .moneyBox {
        width: 11px;
        height: 13px;
        margin-right: 5px;
        // margin-top: 5px;
    }

.sms-button {

font-size: 24px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #FE7E41;

}
.msg-w{
    height: 100px;
display: flex;
justify-content: center;
align-items: center;
    span{
        display: block;
        width: 50%;
        text-align: center;

font-size: 36px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #2E2E4D;

    }
}
    .title-open {
           :deep(.van-cell)  {
            margin-top: 48px;
                        margin-bottom: 32px;

            color: #ff2442;
            padding: 0;

        }
                  :deep(.van-title)  {
       color:#eee

        }
            :deep(.van-field__label)  {
           width: auto;

        }
             :deep(.van-field__control):placeholder {
font-size: 26px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #CCCCCC;
        }

    }
    .lock-status {
        box-sizing: border-box;
        margin-top: 16px;
        margin-bottom: 16px;

        // justify-content: center;
        // align-items: center;
        // flex-wrap: wrap;
        :deep(.van-button) {
            background: #fe7e41;

            // font-size: 14px;
        }

        .lock-btn {
            display: inline-block;
            // width: 105px;

            // margin: 0 7.5px;
            // border-radius: 4px;
            // padding: 7px 25px;
            // // width: 105px;
            // height: 30px;
            // line-height: 30px;
        }
    }
}
.merchant {
    :deep(.van-cell) {
        padding: 30px 50px;
    }
}
:deep(.van-picker__confirm) {
    color: #fe7e41;
}
.img-icon {
    width: 32px;
    height: 32px;
}
:deep(.van-icon-close:before) {
    position: absolute;
    left: 8px;
    top: 16px;
}
:deep(.van-picker-column__item--selected) {
    color: #e74d09;
}
             .bottom-device{
        padding: 34px 60px 0;
        width: calc(100vw - 120px);
            .btn{
                display: inline-block;
                width: 100%;
                height: 92px;
                line-height: 92px;
                background: #FE7E41;
                border-radius: 46px;
                text-align: center;
                color: #fff;
                font-size: 30px;
                margin-bottom: 34px;
                font-family: PingFangSC-Medium, PingFang SC;
            }
        }
</style>
