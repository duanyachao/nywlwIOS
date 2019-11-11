import React, { Component } from 'react'
import {
    Text,
    TextInput,
    View,
    Switch,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Modal,
    FlatList,
    Picker
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { screen, theme } from '../../../../common'
import { Network, toastShort } from '../../../../utils'
import api from '../../../../api'
import { Button } from '../../../../components'
import DateTimePicker from 'react-native-modal-datetime-picker'
export default class CreateTimerConfigScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configId: null,//配置项id
            orgId: null,//网点id
            devicesList: null,//设备列表(开关类、行程类)
            devicesTypeSelected: null,//自定义设备类型
            deviceTypeId: null,//设备类型id
            deviceId: null,//选择的设备id
            deviceActionList: null,//选择的设备对应的操作列表
            upperAction: null,//上限绑定的操作
            lowerAction: null,//下限绑定的操作
            upper: null,//时间1
            lower: null,//时间2
            upperSelected: null,//时间1对应的操作的选中状态
            lowerSelected: null, //时间2对应的操作的选中状态
            upperShow:null,
            lowerShow:null
        }
    }
    //获取设备
    getDevicesList = (orgId, category) => {
        let headers = {
            'X-Token': token
        };
        let params = {
            "orgId": orgId,
            "category": category
        }
        Network.get(api.HOST + api.GETLOGICDEVICESLIST, params, headers, (res) => {
            console.info(res)
            if (res.meta.success) {
                this.setState({
                    devicesList: res.data
                })
                if (!this.state.deviceId) {
                    this.setState({
                        deviceId: res.data[0].id,
                        deviceTypeId: res.data[0].typeId
                    })
                    this.getDeviceActionList(res.data[0].typeId);
                }    
            }
        })
    }
    //获取设备操作
    getDeviceActionList = (deviceTypeId) => {
        let headers = {
            'X-Token': token
        };
        let params = {
            "deviceTypeId": deviceTypeId,
        }
        Network.get(api.HOST + api.GETACTIONS, params, headers, (res) => {
            if (res.meta.success) {
                this.setState({
                    deviceActionList: res.data
                })
                if (this.state.deviceActionList) {
                    this.state.deviceActionList.forEach((deviceAction, index) => {
                        if (this.state.upperAction == deviceAction.id) {
                            this.setState({
                                upperSelected: index
                            })
                        }
                        if (this.state.lowerAction == deviceAction.id) {
                            this.setState({
                                lowerSelected: index
                            })
                        }
                    });
                } else {
                    console.info('没状态')
                }
            }
        })

    }
    //选择设备类型
    selectDeviceType = (orgId, category) => {
        this.setState({
            devicesTypeSelected: category,
            devicesList: null,
            deviceId: null,
            deviceActionList: null,
            upperAction: null,
            upper: null,
            lower: null,
            upperSelected: null,
            lowerSelected: null,
            lowerAction: null,
            upperShow:null,
            lowerShow:null
        })
        this.getDevicesList(orgId, category)

    }
    //选择操作
    selectDeviceAction(item, index, configType) {
        // console.info(index, this.state.upperSelected, this.state.lowerSelected)
        if (configType == 1) {
            this.setState({
                upperSelected: index,
                upperAction: item.id

            })
        }
        if (configType == 2) {
            this.setState({
                lowerSelected: index,
                lowerAction: item.id
            })
        }
    }
    //提交配置
    saveConfigData = () => {
        const {
            orgId,
            configId,
            devicesTypeSelected,
            deviceId,
            deviceTypeId,
            deviceActionList,
            devicesList,
            upper,
            lower,
            upperSelected,
            lowerSelected,
            upperAction,
            lowerAction,
        } = this.state;
        if (!deviceId) {
            toastShort('请选择设备')
        }
        if (!upperAction) {
            toastShort('设置失败,定时操作1未设置');
            return false
        }
        if (!lowerAction) {
            toastShort('设置失败,定时操作2未设置');
            return false
        }
        let headers = {
            'X-Token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let params = {
            "id": (configId) ? configId : null,
            "deviceId": deviceId,
            "downDeviceActionId": lowerAction,
            "downLimit": lower,
            "orgId": orgId,
            "upDeviceActionId": upperAction,
            "upLimit": upper
        }
        Network.postJson(api.HOST + api.SAVECONFAUTOMATION, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                toastShort('保存成功')
                this.props.navigation.navigate('TimerConfig', { 'orgId': orgId })
            }else{
                toastShort(res.meta.message)
            }
        })
    }
    showStartDateTimePicker = () =>
        this.setState({ startDateTimePickerVisible: true });

    showEndDateTimePicker = () => this.setState({ endDateTimePickerVisible: true });

    hideStartDateTimePicker = () =>
        this.setState({ startDateTimePickerVisible: false });

    hideEndDateTimePicker = () =>
        this.setState({ endDateTimePickerVisible: false });

    handleStartDatePicked = date => {
        let startH=(date.getHours()>=10)?date.getHours():'0'+date.getHours().toString();
        let startM=(date.getMinutes()>=10)?date.getMinutes():'0'+date.getMinutes().toString();
        let starthN=parseInt(startH);
        let startmN=parseInt(startM);
        this.setState({
            upper: (starthN<<8)+startmN,
            upperShow:startH+':'+startM,
        })
        // console.info(startH,startM)
        this.hideStartDateTimePicker();
    };

    handleEndDatePicked = date => {
        let endH=(date.getHours()>=10)?date.getHours():'0'+date.getHours().toString();
        let endM=(date.getMinutes()>=10)?date.getMinutes():'0'+date.getMinutes().toString();
        let endhN=parseInt(endH);
        let endmN=parseInt(endM);
        this.setState({
            lower: (endhN<<8)+endmN,
            lowerShow:endH+':'+endM,
        })
        this.hideEndDateTimePicker();
    };
    componentDidMount() {
        const { navigation } = this.props;
        let config = navigation.state.params.item;
        let orgId = navigation.state.params.orgId;
        let deviceTypeCategory = navigation.state.params.deviceTypeCategory;
        let deviceTypeId = navigation.state.params.deviceTypeId;
        let startTimer=navigation.state.params.startTimer;
        let endTimer=navigation.state.params.endTimer;
        // console.info(startTimer,endTimer)
        this.setState({
            orgId: orgId,
            deviceTypeId: deviceTypeId,
            devicesTypeSelected: deviceTypeCategory,
        })
        if (config) {
            this.setState({
                configId: config.id,
                deviceId: config.deviceId,
                upper: config.upLimit,
                upperAction: config.upDeviceActionId,
                lower: config.downLimit,
                lowerAction: config.downDeviceActionId,
                upperShow:startTimer,
                lowerShow:endTimer
            })
            this.getDevicesList(orgId, deviceTypeCategory)
            this.getDeviceActionList(deviceTypeId);

        } else {
            // console.info(1)
        }
    }
    render() {
        const {
            orgId,
            configId,
            devicesTypeSelected,
            deviceId,
            deviceActionList,
            devicesList,
            upper,
            lower,
            upperSelected,
            lowerSelected,
            upperAction,
            lowerAction,
            upperShow,
            lowerShow
        } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.selectDeviceTypeStyle}>
                    <View style={styles.deviceTypeLeft}>
                        <Text style={styles.deviceTypeTipStyle}>选择设备类型：</Text>
                    </View>
                    <View style={styles.deviceTypeRight}>
                        <TouchableOpacity
                            activeOpacity={.9}
                            style={styles.deviceTypeCheckboxStyle} onPress={() => this.selectDeviceType(orgId, 2)}>
                            {(devicesTypeSelected == 2) ?
                                <MaterialCommunityIcons
                                    name='check-circle'
                                    size={20}
                                    color={theme.theme} /> :
                                <MaterialCommunityIcons
                                    name='checkbox-blank-circle-outline'
                                    size={20}
                                    color={'#ccc'} />}
                            <Text style={styles.deviceTypeName}>开关设备</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={.9}
                            style={styles.deviceTypeCheckboxStyle} onPress={() => this.selectDeviceType(orgId, 3)}>
                            {(devicesTypeSelected == 3) ?
                                <MaterialCommunityIcons
                                    name='check-circle'
                                    size={20}
                                    color={theme.theme} /> :
                                <MaterialCommunityIcons
                                    name='checkbox-blank-circle-outline'
                                    size={20}
                                    color={'#ccc'} />}
                            <Text style={styles.deviceTypeName}>行程设备</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.selectDeviceStyle}>
                    <View style={styles.deviceLeft}>
                        <Text style={styles.deviceTipStyle}>请选择设备</Text>
                    </View>
                    <View style={styles.deviceRight}>
                        {(devicesList && devicesList.length > 0) ?
                            <Picker
                                selectedValue={deviceId}
                                style={styles.devicePicker}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({
                                        deviceId: itemValue,
                                        deviceTypeId: devicesList[itemIndex].typeId
                                    })
                                    this.getDeviceActionList(devicesList[itemIndex].typeId);
                                }}>
                                {devicesList.map((item) => (<Picker.Item key={item.id} value={item.id} label={item.deviceName} />))}
                            </Picker> :
                            <Text style={styles.nodeviceTip}>请先选择设备类型</Text>}

                    </View>

                </View>
                {(deviceId) ?
                    <View style={styles.setContentStyle}>
                        <View style={styles.setItemStyle}>
                            <View style={styles.setItemLeftStyle}>
                                <Text style={styles.setItemLeftTipStyle}>时间1</Text>
                                <Text style={styles.textInputStyle}>{upperShow}</Text>
                                <TouchableOpacity style={styles.dateTimerStyle}
                                    onPress={this.showStartDateTimePicker}
                                    activeOpacity={.7}>
                                    <MaterialCommunityIcons name={'timer'} size={20} color={theme.theme} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.setItemRightStyle}>
                                {(deviceActionList && deviceActionList.length > 0) ?
                                    deviceActionList.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={.9}
                                            style={styles.actionCheckboxStyle}
                                            onPress={() => this.selectDeviceAction(item, index, 1)}>
                                            {(upperSelected == index) ?
                                                <MaterialCommunityIcons
                                                    name='check-circle'
                                                    size={20}
                                                    color={theme.theme} /> :
                                                <MaterialCommunityIcons
                                                    name='checkbox-blank-circle-outline'
                                                    size={20}
                                                    color={'#ccc'} />}
                                            <Text style={styles.actionName}>{item.name}</Text>
                                        </TouchableOpacity>)) : null}
                            </View>

                        </View>
                        <View style={styles.setItemStyle}>
                            <View style={styles.setItemLeftStyle}>
                                <Text style={styles.setItemLeftTipStyle}>时间2</Text>
                                <Text style={styles.textInputStyle}>{lowerShow}</Text>
                                <TouchableOpacity
                                    style={styles.dateTimerStyle}
                                    activeOpacity={.7}
                                    onPress={this.showEndDateTimePicker}>
                                    <MaterialCommunityIcons name={'timer'} size={20} color={theme.theme} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.setItemRightStyle}>
                                {(deviceActionList && deviceActionList.length > 0) ?
                                    deviceActionList.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={.9}
                                            style={styles.actionCheckboxStyle}
                                            onPress={() => this.selectDeviceAction(item, index, 2)}>
                                            {(lowerSelected == index) ?
                                                <MaterialCommunityIcons
                                                    name='check-circle'
                                                    size={20}
                                                    color={theme.theme} /> :
                                                <MaterialCommunityIcons
                                                    name='checkbox-blank-circle-outline'
                                                    size={20}
                                                    color={'#ccc'} />}
                                            <Text style={styles.actionName}>{item.name}</Text>
                                        </TouchableOpacity>)) : null}
                            </View>

                        </View>

                    </View> :
                    <View style={theme.nodata}>
                        <MaterialCommunityIcons
                            name='alert-box'
                            size={30}
                            color={theme.bgGray2} />
                        <Text style={styles.noConfigTip}>先关联相关设备、再选择定时执行的设备操作</Text>
                    </View>}
                <View style={styles.btnGroup}>
                    <Button
                        btnStyle={[styles.configBtnStyle, styles.saveBtnStyle]}
                        btnTextStyle={styles.configBtnTxtStyle}
                        title='保存'
                        onPress={this.saveConfigData} />
                </View>
                <DateTimePicker
                    mode={'time'}
                    date={new Date()}
                    isVisible={this.state.startDateTimePickerVisible}
                    onConfirm={this.handleStartDatePicked}
                    onCancel={this.hideStartDateTimePicker}
                />
                <DateTimePicker
                    mode={'time'}
                    date={new Date()}
                    isVisible={this.state.endDateTimePickerVisible}
                    onConfirm={this.handleEndDatePicked}
                    onCancel={this.hideEndDateTimePicker}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    selectDeviceTypeStyle: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: screen.onePixel,
        borderBottomColor: theme.bgGray2,
    },
    deviceTypeLeft: {
        paddingLeft: 10
    },
    deviceTypeRight: {
        marginLeft: 20,
        flexDirection: 'row',
    },
    deviceTypeTipStyle: {
        fontSize: 14
    },
    dateTimerStyle: {
        alignSelf: 'center'
    },
    deviceTypeCheckboxStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10
    },
    deviceTypeName: {
        fontSize: 14,
        paddingLeft: 6
    },
    selectDeviceStyle: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: screen.onePixel,
        borderBottomColor: theme.bgGray2
    },

    deviceLeft: {
        paddingLeft: 10,
    },
    deviceRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    devicePicker: {
        width: 140,
    },
    deviceTipStyle: {
        fontSize: 14
    },
    nodeviceTip: {
        color: '#ccc',
        paddingRight: 6
    },
    setContentStyle: {
        flex: 1,
        paddingBottom: 10,
        borderBottomWidth: screen.onePixel,
        borderBottomColor: theme.bgGray2,
    },
    setItemStyle: {
        marginVertical: 10,
        flexDirection: 'row',
    },
    setItemLeftStyle: {
        flexDirection: 'row',
    },
    setItemRightStyle: {
        flexDirection: 'row',
        paddingLeft: 10
    },
    setItemLeftTipStyle: {
        paddingLeft: 10,
        alignSelf: 'center'
    },
    textInputStyle: {
        textAlign: 'center',
        textAlignVertical: 'center',
        height: 40,
        marginHorizontal: 5,
        fontSize: 14,
        width: 80,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.theme,
    },
    noConfigStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'blue'
    },
    noConfigTip: {
        color: theme.colorG,
        padding: 10

    },
    actionCheckboxStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: 5
    },
    actionName: {
        fontSize: 14,
        paddingLeft: 0
    },
    btnGroup: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    configBtnStyle: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 5,
    },
    saveBtnStyle: {
        backgroundColor: theme.theme
    },
    delBtnStyle: {
        backgroundColor: theme.colorFirebrick
    },
    configBtnTxtStyle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#fff'
    }

})
