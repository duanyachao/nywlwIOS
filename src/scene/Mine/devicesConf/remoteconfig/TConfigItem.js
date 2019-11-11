import React, { Component } from 'react'
import { Alert,Text, View,StyleSheet,Picker,Dimensions,Switch } from 'react-native'
import { Button } from './../../../../components'
import { Network, toastShort } from './../../../../utils'
import api from './../../../../api'
import pxToDp from './../../../../common/pxToDp'
const { width, height } = Dimensions.get('window')
export default class TConfigItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configId:null,
            deviceId: null,//选择的设备id
            deviceTypeId:null,
            configStatus:false
        }
    }
    //提交配置
    saveConfigData=()=>{
        let headers = {
            'X-Token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let params ={
            "buttonNum":1,
            "confType":1,
            "deviceActionId":'08b9c4e0-a40d-4509-92ac-fc9c273973e9',
            "deviceId":this.state.deviceId,
            "id":this.state.configId,
            "orgId":this.props.orgId,
            "signalChannel":this.props.data
          }
        Network.postJson(api.HOST + api.SAVEREMOTERDATA, params, headers, (res) => {
            console.info(res)
            if (res.meta.success) {
                toastShort('保存成功')
                this.props.reload(this.props.orgId)
            }else{
                toastShort(res.meta.message)
            }
        })
    }
    //启用禁用删除配置
    switchConfig=()=>{
        if (this.state.configId) {
            if (this.state.configStatus) {
                Alert.alert(
                    '提示',
                    '确定禁用此项设置',
                    [
                      {text: '确定', onPress: () =>{
                            fetch(api.HOST + api.DELREMOTERDATA, {
                                method: 'POST',
                                headers: {
                                    'X-Token': token,
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: 'id=' +this.state.configId
                            }).then((res) =>res.json()).then((res)=>{
                                 console.info(res)
                                if (res.meta.success) {
                                    toastShort('禁用成功')
                                    this.props.reload(this.props.orgId)
                                } else {
                                    toastShort(res.meta.message)
                                    return false
                                }    
                            })
                      }},
                     {text:'取消',onPress:()=>{
                         return
                     }} 
                    ]
                  )
            } else {
                this.setState({
                    configStatus:!this.state.configStatus
                })    
            }    
        } else {
            this.setState({
                configStatus:!this.state.configStatus,
                deviceId:this.props.devices[0].id
            })    
        }
        
        
    }
    componentDidMount(){    
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.confData !==this.props.confData) {
            this.setState({
                configStatus:(nextProps.confData)?true:false,
                configId:(nextProps.confData)?nextProps.confData.id:null,
                deviceId:(nextProps.confData)?nextProps.confData.deviceId:this.props.devices[0].id,
            })    
        }
        return true
    }
    render() {
        const {data,devices,confData}=this.props;
        const {deviceId,configStatus}=this.state;
        // console.info(confData)
        return (
            <View style={styles.container}>
                <View style={styles.signalChannelItem}>
                    <Text style={styles.channelTip}>信道编号：</Text>
                    <Text style={styles.channelName}>{data}</Text>
                </View>
                <View style={styles.tDeviceItemStatus}>
                    <Text style={styles.channelTip}>信道状态：</Text>
                    <View style={styles.switchable}>
                        <Switch 
                            onValueChange={this.switchConfig} 
                            style={styles.switchBtn} 
                            value={configStatus}/>
                        <Text style={styles.channelTip}>{(configStatus)?'启用':'禁用'}</Text>
                    </View>
                </View>
                
                <View style={styles.tDeviceItem}>
                    <Text style={styles.deviceTip}>设备名称：</Text>
                    <View style={styles.deviceRight}>
                        {(devices && devices.length > 0) ?
                            ((configStatus)?
                            <Picker
                                selectedValue={deviceId}
                                style={styles.devicePicker}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({
                                        deviceId: itemValue,
                                        deviceTypeId:devices[itemIndex].typeId
                                    })
                                }}>
                                {devices.map((item) => (<Picker.Item key={item.id} value={item.id} label={item.deviceName} />))}
                            </Picker>:
                            <Text style={styles.nodeviceTip}>未绑定设备</Text> )
                            :
                            <Text style={styles.nodeviceTip}>暂无设备</Text>}

                    </View>

                </View>
                    {(configStatus)?
                        <Button
                        btnStyle={[styles.btnStyle,styles.saveBtnStyle]}
                        btnTextStyle={styles.btnTxtStyle}
                        title='保存'
                        onPress={this.saveConfigData} />:null
                    }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#fff',
        margin:3,
        padding:6
    },
    signalChannelItem:{
        flexDirection:'row'
    },
    tDeviceItem:{
        height:40,
        flexDirection:'row',
        alignItems:'center',
    },
    tDeviceItemStatus:{
        flexDirection:'row',
        alignItems:'center',

    },
    switchable:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    devicePicker: {
        width: pxToDp(200),
    },
    btnStyle:{
        alignSelf:'center',
        paddingHorizontal:15,
        paddingVertical:10,
        marginTop:0,
        borderRadius:5  
    },
    saveBtnStyle:{
        backgroundColor:'#f57831',
    },
    btnTxtStyle:{
        color:'#ffffff',
        fontSize:14    
    },
})
