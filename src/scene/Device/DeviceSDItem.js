import React, { Component } from 'react';
import{
    Alert,
    StyleSheet,
    View,
    Text,
    Image,
    Switch,
    TouchableHighlight
} from 'react-native';
import api from '../../api';
import { Network, toastShort } from '../../utils';
import{DeviceIcon} from '../../common/Normal';
const styles=StyleSheet.create({
    itemStyle:{
        height:46,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomColor:'#dcdcdc',
        borderBottomWidth:1,
        backgroundColor:'#fff'
    },
    deviceName:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:10,    
    },
    deviceIcon:{
        width:32,
        height:32,
        
    },
    deviceNameText:{
        paddingLeft:10,
    },
    deviceStatus:{
        flexDirection:'row',
         alignItems:'center',
        paddingRight:10,    
    },
    deviceStatusText:{
        paddingRight:10,    
    }
})
export default class DeviceItem extends Component{
    constructor(props){
        super(props);
        this.state={
            SwitchIsOn:false,
            statusText:null  
        }
        // this.changeStatus=this.changeStatus.bind(this);
    }
    changeStatus(status){
        switch (status) {
            case 'ON':
                this.setState({
                    SwitchIsOn:true,
                    statusText:'打开'
                })
                break;
            case 'OFF':
                this.setState({
                    SwitchIsOn:false,
                    statusText:'关闭'
                })
                break;
            case 'ERROR':
                this.setState({
                    SwitchIsOn:false,
                    statusText:'故障'
                })
                break;
            default:
                break;
        }
    }
    componentDidMount(){
        const {rowData}=this.props;
        let status=rowData.VALUE;
        this.changeStatus(status);    
        
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.rowData!==this.props.rowData){
            let status=nextProps.rowData.VALUE;
            this.changeStatus(status); 
        }
        return true
    }
    deviceOperate(rowData,status,orgId,token){
        let action, statusText;
        if(rowData.VALUE !=='ERROR'){
            if (status) {
                action="OFF";
                statusText='关闭';    
            } else {
                status="ON";
                statusText='打开';     
            }
        }else{
            return
        }
        Alert.alert(
            '提示',
            '确定将'+rowData.DEVICE_NAME+statusText+'?',
            [
              {text: '确定', onPress: () =>{
                    let headers={
                        'X-Token':token,
                        'Content-Type':'application/json'
                    };
                    let params={"deviceId": rowData.DEVICE_ID,"regionId": orgId,"status": status};
                    Network.postJson(api.HOST+api.DEVICES_UPDATE,params, headers,(res)=>{
                        if(res.meta.success){
                        this.setState({
                            SwitchIsOn:!this.state.SwitchIsOn,
                            statusText:statusText
                        });
                    }else{
                        toastShort(res.meta.message);
                    }
                })
              }},
             {text:'取消',onPress:()=>{
                 return
             }} 
            ]
          )
        }
    render(){
        const{rowData,rowID,orgId}=this.props;
        let onIcon,offIcon,deviceName;
        switch (rowData.D_T_CODE) {
            case ("DXFJ"):
            case("ZXFJ"):
            case("RFJ"):
            case("HXFJ"):
                deviceName="fj";
                onIcon=DeviceIcon.fj_on;
                offIcon=DeviceIcon.fj_off;
                break;
            case "GL":
                deviceName="gl";
                onIcon=DeviceIcon.gl_on;
                offIcon=DeviceIcon.gl_off;
                break;
            case "MJ":
                deviceName="mj";
                onIcon=DeviceIcon.mj_on;
                offIcon=DeviceIcon.mj_off;
                break;
            case "PW":
                deviceName="pw";
                onIcon=DeviceIcon.pw_on;
                offIcon=DeviceIcon.pw_off;
                break;
            case "SLB":
                deviceName="slb";
                onIcon=DeviceIcon.slb_on;
                offIcon=DeviceIcon.slb_off;
                break;
            case "WL":
                deviceName="wl";
                onIcon=DeviceIcon.wl_on;
                offIcon=DeviceIcon.wl_off;
                break;
            case "YX":
                deviceName="yao";
                onIcon=DeviceIcon.yao_on;
                offIcon=DeviceIcon.yao_off;
                break;
            case "ZM":
                deviceName="zm";
                onIcon=DeviceIcon.zm_on;
                offIcon=DeviceIcon.zm_off;
                break;
            default:
                break;
        }
        return(
            <TouchableHighlight underlayColor="rgb(255, 255,255)" onPress={() =>this.deviceOperate(rowData,this.state.SwitchIsOn,orgId,token)}>
            <View key={rowID} style={styles.itemStyle}>
                <View style={styles.deviceName}>
                     <Image source={this.state.SwitchIsOn?onIcon:offIcon} style={styles.deviceIcon}></Image>
                    <Text style={styles.deviceNameText}>{rowData.DEVICE_NAME}</Text>    
                </View>
                <View style={styles.deviceStatus}>
                    <Text style={styles.deviceStatusText}>{this.state.statusText}</Text> 
                     <Switch 
                        onValueChange={()=>this.deviceOperate(rowData,this.state.SwitchIsOn,orgId,token)} 
                        style={styles.switchBtn} 
                        value={this.state.SwitchIsOn}>
                    </Switch>
                </View>
        </View>
        </TouchableHighlight>
        )
    }
}