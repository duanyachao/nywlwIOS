import React, { Component } from 'react';
import {
    Alert,
    Button,
    Slider,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import api from '../../api';
import { Network, toastShort } from '../../utils';
import { DeviceIcon } from '../../common/Normal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme,screen } from '../../common';
import Spinner from 'react-native-loading-spinner-overlay';
export default class DeviceSSDItemDP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            deviceStatus: null,//上升-下降,展开-收起
            opValue: null,//UP  DOWN  STOP
            upActionName: null,
            downActionName: null,
            btnDsiabled:null,
            actions:null

        }
    }
    getActionList = (deviceTypeId) => {
        let headers = {
            'X-Token': token
        };
        let params = { "deviceTypeId": deviceTypeId };
        Network.get(api.HOST + api.GETACTIONS, params, headers, (res) => {
            if (res.meta.success) {
                console.info(res.data)
                this.setState({
                    actions: res.data
                })
            }
        })
    }
    loadDevices(rowData){
        // console.info(rowData)
        this.getActionList(rowData.DEVICE_TYPE_ID)

        let upActionName, downActionName, deviceStatus, opDeviceStatusName;
        let actionArr=['UP','DOWN'];
        if (rowData.D_T_CODE=='TC') {
            upActionName='打开';
            downActionName='关闭';
            switch (rowData.VALUE) {
                case 'UP':
                    deviceStatus='打开';    
                    break;
                case 'DOWN':
                    deviceStatus='关闭';    
                    break;
                case 'STOP':
                    deviceStatus='停止';    
                    break;
                default:
                    break;
            }
            
        }else if(rowData.D_T_CODE=='ZYW'){
            upActionName='展开';
            downActionName='收起';
            switch (rowData.VALUE) {
                case 'UP':
                    deviceStatus='展开';    
                    break;
                case 'DOWN':
                    deviceStatus='收起';    
                    break;
                case 'STOP':
                    deviceStatus='停止';    
                    break;
                default:
                    break;
            }
        }else if(rowData.D_T_CODE=='JL' ||rowData.D_T_CODE=='0'){
            upActionName='卷起';
            downActionName='放下';
            switch (rowData.VALUE) {
                case 'UP':
                    deviceStatus='卷起';    
                    break;
                case 'DOWN':
                    deviceStatus='放下';    
                    break;
                case 'STOP':
                    deviceStatus='停止';    
                    break;
                default:
                    break;
            }
        }
        else {
            
        }
        this.setState({
            upActionName: upActionName,
            downActionName: downActionName,
            deviceStatus: deviceStatus,
            opValue: rowData.VALUE

        })
    }
    componentDidMount() {
        const { rowData, rowID, orgId } = this.props;
        this.loadDevices(rowData)    
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.rowData !== this.props.rowData) {
            const { rowData, rowID, orgId } = nextProps;
            this.loadDevices(rowData)
        }
        return true
    }
    deviceOperate(value, rowData, orgId, token) {
        let actionName;
        switch (value) {
            case 'UP':
                actionName=this.state.upActionName;
                break;
            case 'DOWN':
                actionName=this.state.downActionName;
                break;
            case 'STOP':
                actionName='停止';
                break;
            default:
                break;
        }
        if(rowData.VALUE !=='ERROR'){

        }else{
            return
        }
        Alert.alert(
            '提示',
            '确定将'+rowData.DEVICE_NAME+actionName+'?',
            [
              {text: '确定', onPress: () =>{
                this.setState({
                    visible: !this.state.visible
                })
                    let headers={
                        'X-Token':token,
                        'Content-Type':'application/json'
                    };
                    let params={"deviceId": rowData.DEVICE_ID,"regionId": orgId,"status": value};
                    Network.postJson(api.HOST+api.DEVICES_UPDATE,params, headers,(res)=>{
                        console.info(res)
                        if(res.meta.success){
                        this.setState({
                            deviceStatus:actionName,
                            opValue:value
                        });
                    }else{
                        toastShort(res.meta.message);
                    }
                    this.setState({
                        visible: !this.state.visible
                    });
                })
              }},
             {text:'取消',onPress:()=>{
                
             }} 
            ]
          )
    }

    render() {
        const { rowData, rowID, orgId } = this.props;
        return (
            <View key={rowID} style={styles.itemStyle}>
                <Spinner visible={this.state.visible} textContent={"操作中..."} textStyle={{ color: '#FFF', fontSize: 16 }}></Spinner>
                <View style={styles.itemTopStyle}>
                    <Text style={styles.deviceName}>{rowData.DEVICE_NAME}</Text>
                    <Text style={styles.deviceStatus}>当前状态:{this.state.deviceStatus}</Text>
                </View>
                <View style={styles.itemBotStyle}>
                    <TouchableOpacity
                        // disabled={(this.state.opValue=='UP')?true:false} 
                        onPress={()=>{this.deviceOperate('UP',rowData,orgId,token)}}>
                        <View style={[styles.btnWrapper, styles.btnOne]}>
                            <Text style={styles.actionText}>
                                {this.state.upActionName}
                            </Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        // disabled={(this.state.opValue=='DOWN')?true:false} 
                        onPress={()=>{this.deviceOperate('DOWN',rowData,orgId,token)}}
                    >
                        <View style={[styles.btnWrapper, styles.btnOne]}>
                            <Text style={styles.actionText}>
                                {this.state.downActionName}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{this.deviceOperate('STOP',rowData,orgId,token)}}
                    >
                        <View style={[styles.btnWrapper, styles.btnTwo]}>
                            <Text style={styles.actionText}>
                                停止
                            </Text>
                        </View>
                    </TouchableOpacity>
                    
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    itemStyle: {
        padding: 10,
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 4,
        backgroundColor: '#fff'
    },
    itemTopStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    itemBotStyle: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: 'space-between',
    },
    btnWrapper: {
        marginLeft:30,
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 50,
        width: 50,
        height: 50
    },
    btnOne: {
        // backgroundColor: 'rgba(92, 205, 91, 0.91)',
        backgroundColor:theme.theme        
    },
    btnTwo: {
        backgroundColor: '#f95900'
    },
    actionText:{
        color:'#ffffff',
        fontSize:16
    },
    deviceName: {
        fontSize: 16,
        color: '#222'

    },
    deviceStatus: {
        fontSize: 16,
        color: '#05b8a5'
    },
    sliderWrapper: {
        marginTop: 10
    },
    slider: {

    },
})