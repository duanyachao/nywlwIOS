import React, { Component } from 'react'
import {
    Text,
    TextInput,
    View,
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
export default class CreateRemoterConfigScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configId:null,//配置项id
            orgId: null,//网点id
            confType: null,//遥控类型:1=单按键,2多按键
            devicesList: null,//根据confType关联设备列表
            deviceId: null,//选择的设备id
            deviceActionList: null,//根据选择的设备id关联的操作列表
            signalChannel:null//信道号
        }
    }
    //选择遥控器类型
    selectConfType = (orgId, confType) => {
        this.setState({
            confType:confType
        })
        this.getDevicesList(orgId, confType)
    }
    //获取设备
    getDevicesList = (orgId, confType) => {
        let category=(confType==1)?3:2;
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
                    this.state.deviceActionList.forEach((deviceAction,index) => {
                        if(this.state.upperAction==deviceAction.id){
                            this.setState({
                                upperSelected:index
                            })
                        }
                        if(this.state.lowerAction==deviceAction.id){
                            this.setState({
                                lowerSelected:index
                            })    
                        }
                    });    
                } else {
                    console.info('没状态')    
                }
            }
        })

    }
    //选择操作
    selectDeviceAction(item, index, confType) {
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
    saveConfigData=()=>{
        const {
            orgId,
            configId,
            devicesTypeSelected,
            deviceId,
            deviceTypeId,
            deviceActionList,
            devicesList,
            sensorsList,
            sensorId,
            sensorTypeId,
            ECLs,
            ECLsId,
            upper,
            lower,
            upperSelected,
            lowerSelected,
            upperAction,
            lowerAction,
        } = this.state;
        let regInt = /^\d+$/;
        if (!deviceId) {
            toastShort('设置失败,请选择设备');
            return false
        }
        if (!sensorId) {
            toastShort('设置失败,请选择传感器');
            return false
        }
        if (!ECLsId) {
            toastShort('设置失败,请选择环境参数');
            return false
        }
        if (!regInt.test(upper)) {
            toastShort('上限值设置不正确,请重新设置');
            return false
        }
        if (!regInt.test(lower)) {
            toastShort('上限值设置不正确,请重新设置');
            return false
        }
        if (parseInt(upper) < parseInt(lower) || parseInt(lower) > parseInt(upper) || parseInt(upper)== parseInt(lower)) {
            toastShort('上下限值设置不正确,请重新设置');
            return false
        }
        if (!upperAction) {
            toastShort('设置失败,上限操作未设置');
            return false
        }
        if (!lowerAction) {
            toastShort('设置失败,下限操作未设置');
            return false
        }
        if (lowerAction==upperAction) {
            toastShort('设置失败,上下限操作设置不能相同');
            return false
        }
        let headers = {
            'X-Token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let params ={
            "id":(configId)?configId:null,
            "columnDesId": ECLsId,
            "deviceId": deviceId,
            "downDeviceActionId":lowerAction,
            "downLimit":parseInt(lower),
            "orgId": orgId,
            "sensorId": sensorId,
            "upDeviceActionId": upperAction,
            "upLimit":parseInt(upper)
          }
        Network.postJson(api.HOST + api.SAVECONFAUTOMATION, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                toastShort('保存成功')
                this.props.navigation.navigate('AutomateConfig',{'orgId':orgId})
            }else{
                toastShort(res.meta.message)
            }
        })
    }
    componentDidMount(){
        const { navigation } = this.props;
        let config=navigation.state.params.item;
        let orgId = navigation.state.params.orgId;
        this.setState({
            orgId:orgId,
        })
    }
    render() {
        const {
            orgId,
            configId,
            confType,
            devicesList,
            deviceId
        } = this.state;
        
        return (
            <View style={styles.container}>
                <View style={styles.selectConfTypeStyle}>
                    <View style={styles.deviceTypeLeft}>
                        <Text style={styles.deviceTypeTipStyle}>设置类型：</Text>
                    </View>
                    <View style={styles.deviceTypeRight}>
                        <TouchableOpacity
                            activeOpacity={.9}
                            style={styles.deviceTypeCheckboxStyle} onPress={() => this.selectConfType(orgId, 1)}>
                            {(confType == 1) ?
                                <MaterialCommunityIcons
                                    name='check-circle'
                                    size={20}
                                    color={theme.theme} /> :
                                <MaterialCommunityIcons
                                    name='checkbox-blank-circle-outline'
                                    size={20}
                                    color={'#ccc'} />}
                            <Text style={styles.deviceTypeName}>单按键(限位)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={true}
                            activeOpacity={.9}
                            style={styles.deviceTypeCheckboxStyle} onPress={() => this.selectConfType(orgId, 2)}>
                            {(confType == 2) ?
                                <MaterialCommunityIcons
                                    name='check-circle'
                                    size={20}
                                    color={theme.theme} /> :
                                <MaterialCommunityIcons
                                    name='checkbox-blank-circle-outline'
                                    size={20}
                                    color={'#ccc'} />}
                            <Text style={styles.deviceTypeName}>多按键(操作)</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {(confType==2)?<View style={styles.selectConfTypeStyle}>
                    <View style={styles.deviceTypeLeft}>
                        <Text style={styles.deviceTypeTipStyle}>遥控类型：</Text>
                    </View>
                    <View style={styles.deviceTypeRight}>
                        <TouchableOpacity
                            activeOpacity={.9}
                            style={styles.deviceTypeCheckboxStyle} onPress={() => this.selectConfType(orgId, 1)}>
                            {(confType == 1)?
                                <MaterialCommunityIcons
                                    name='check-circle'
                                    size={20}
                                    color={theme.theme} />:
                                <MaterialCommunityIcons
                                    name='checkbox-blank-circle-outline'
                                    size={20}
                                    color={'#ccc'} />}
                            <Text style={styles.deviceTypeName}>8按键</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={.9}
                            style={styles.deviceTypeCheckboxStyle} onPress={() => this.selectConfType(orgId, 2)}>
                            {(confType == 2) ?
                                <MaterialCommunityIcons
                                    name='check-circle'
                                    size={20}
                                    color={theme.theme} /> :
                                <MaterialCommunityIcons
                                    name='checkbox-blank-circle-outline'
                                    size={20}
                                    color={'#ccc'} />}
                            <Text style={styles.deviceTypeName}>16按键</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                :null}
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
                                    this.getSensorsList(orgId, 1);
                                }}>
                                {devicesList.map((item) => (<Picker.Item key={item.id} value={item.id} label={item.deviceName} />))}
                            </Picker> :
                            <Text style={styles.nodeviceTip}>请先选择设备类型</Text>}

                    </View>

                </View>
                
                <View style={styles.btnGroup}>
                    <Button
                        btnStyle={[styles.configBtnStyle, styles.saveBtnStyle]}
                        btnTextStyle={styles.configBtnTxtStyle}
                        title='保存'
                        onPress={() => { this.saveConfigData() }} />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    selectConfTypeStyle: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.bgGray3,
        // backgroundColor:'#fff',
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
        borderBottomWidth: 1,
        borderBottomColor: theme.bgGray3
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
        paddingBottom: 10,
        borderBottomWidth: screen.onePixel,
        borderBottomColor: theme.bgGray2,
    },
    setItemStyle: {
        paddingVertical: 6,
        flexDirection: 'row',
    },
    setItemLeftStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    setItemLeftTipStyle: {
        
        paddingLeft:10,
        justifyContent: 'center'
    },
    textInputStyle: {
        marginHorizontal: 5,
        fontSize: 14,
        width: 80,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.theme,
    },
    setItemRightStyle: {
        flexDirection: 'row',

    },
    noConfigStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noConfigTip: {
        color: theme.colorG,
        padding:10

    },
    actionCheckboxStyle: {
        
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center',
        marginHorizontal:5
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
