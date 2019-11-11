import React, { Component } from 'react';
import {
    Alert,
    Slider,
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import api from '../../api';
import { Network, toastShort } from '../../utils';
import { theme,screen } from '../../common';
import Spinner from 'react-native-loading-spinner-overlay';
export default class DeviceSSDItemDP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSetting:false,
            visible: false,
            deviceStatus: null,//上升-下降,展开-收起
            deviceStatusCode: null,//UP  DOWN  STOP
            btnDsiabled:null,
            actions:null

        }
    }
    getActionList = (rowData) => {
        let headers = {
            'X-Token': token
        }; 
        let params = { "deviceTypeId": rowData.DEVICE_TYPE_ID };
        Network.get(api.HOST + api.GETACTIONS, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                this.setState({
                    actions: res.data,
                    deviceStatus:rowData.NAME,
                    deviceStatusCode:rowData.VALUE
                })
            }
        })
    }
    componentDidMount() {
        const { rowData, rowID, orgId } = this.props;
        this.getActionList(rowData)   
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.rowData !== this.props.rowData) {
            const { rowData, rowID, orgId } = nextProps;
            this.getActionList(rowData)
            this.setState({
                showSetting:false
            })
        }
        return true
    }
    deviceOperate(item, rowData, orgId, token) {
        Alert.alert(
            '提示',
            '确定将'+rowData.DEVICE_NAME+item.name+'?',
            [
              {text: '确定', onPress: () =>{
                this.setState({
                    visible: !this.state.visible
                })
                    let headers={
                        'X-Token':token,
                        'Content-Type':'application/json'
                    };
                    let params={"deviceId": rowData.DEVICE_ID,"regionId": orgId,"status": item.code};
                    Network.postJson(api.HOST+api.DEVICES_UPDATE,params, headers,(res)=>{
                        // console.info(res)
                        if(res.meta.success){
                        this.setState({
                            deviceStatus:item.name,
                            deviceStatusCode:item.code
                        });
                        toastShort('操作成功');
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
    deviceOperate2(value,rowData,orgId,token){
        if(rowData.VALUE !=='ERROR'){

        }else{
            return
        }
        Alert.alert(
            '提示',
            '确定将'+rowData.DEVICE_NAME+'开启'+value+'%吗?',
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
                        if(res.meta.success){
                        this.setState({
                            deviceStatusCode:value,
                            deviceStatus:value+'%'
                        });
                    }else{
                        toastShort(res.meta.message);
                    }
                    this.setState({
                        visible: !this.state.visible
                    })
                })
              }},
             {text:'取消',onPress:()=>{
                this.setState({
                    deviceStatusCode:rowData.VALUE    
                });
             }} 
            ]
          )
    }
    
    render() {
        const { rowData, rowID, orgId,callback } = this.props;
        const {actions,deviceStatusCode,deviceStatus,showSetting}=this.state;
        let renderView;
        if (actions && actions.length>50) {
            renderView=(
                    <Slider style={styles.slider}
                        ref='slider'
                        maximumValue={100}
                        minimumValue={0}
                        maximumTrackTintColor={'#23c884'}
                        step={1}
                        value={parseInt(deviceStatusCode)}
                        onValueChange={(value)=>this.setState({deviceStatusCode:value})}
                        onSlidingComplete={(value) => this.deviceOperate2(value,rowData,orgId,token)}/>
                    )    
            }else if(actions && 0<actions.length<50){
                renderView= (
                    <View style={styles.itemBotLeftStyle}>
                        {actions.map((item,index)=>{
                        let disabled=(item.code==deviceStatusCode)?true:false;
                        return(
                            <TouchableOpacity key={index} disabled={disabled}
                            onPress={()=>{this.deviceOperate(item,rowData,orgId,token)}}>
                            <View style={[styles.btnWrapper, (disabled)?styles.btnTwo:styles.btnOne]}>
                                <Text style={styles.actionText}>
                                    {item.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        )
                    })}
                    </View>)
            }
        return(
            
            <View key={rowID} style={styles.itemStyle}>
                <Spinner visible={this.state.visible} textContent={"操作中..."} textStyle={{ color: '#FFF', fontSize: 16 }}></Spinner>
                <View style={styles.itemTopStyle}>
                    <Text style={styles.deviceName}>{rowData.DEVICE_NAME}</Text>
                    <Text style={styles.deviceStatus}>当前状态:{deviceStatus}</Text>
                </View>
                <View style={styles.itemBotStyle}>
                    {renderView}
                    <View style={styles.itemBotRightStyle}>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    itemStyle: {
        paddingVertical: 10,
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 4,
        backgroundColor: '#fff'
    },
    itemTopStyle: {
        paddingHorizontal: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    itemBotStyle: {
        paddingHorizontal: 10,
        flex: 1,
        flexDirection: 'row',
    },
    itemBotLeftStyle:{
        flex: 1,
        flexDirection: 'row',
    },
    itemBotRightStyle:{
        justifyContent:'center',    
    },
    btnWrapper: {
        marginLeft:15,
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 50,
        width: 50,
        height: 50
    },
    btnOne: {
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
    slider: {
        flex:1,
        marginRight:20
    }
})