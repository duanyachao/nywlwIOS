import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TextInput,DeviceEventEmitter } from 'react-native'
import { Network, toastShort } from '../../../../utils'
import api from '../../../../api'
import { screen, theme } from '../../../../common'
import {Button} from '../../../../components'
import pxToDp from '../../../../common/pxToDp'
import TextInputItem from './TextInputItem'

export default class WarnConfigItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ECLs: null,
            editable:false,
            alarmData:null
        }
    }
    //获取传感器环境参数
    getECLs = deviceTypeId => {
        let headers = {
            'X-Token': token
        };
        let params = {
            "deviceTypeId": deviceTypeId
        }
        Network.get(api.HOST + api.GETECLS, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success && res.data.length>0) {
                this.setState({
                    ECLs: res.data
                })
            }
        })
    }
    //获取报警信息配置
    getECLsAlarm = (orgId,sensorId)=>{
        let headers = {
            'X-Token': token
        };
        let params = {
            "orgId":orgId,
            "sensorId": sensorId,
            
        }
        Network.get(api.HOST + api.GETSENSORSALARM, params, headers, (res) => {
            console.info(res)
            if (res.meta.success && res.data.length>0) {
                this.setState({
                    alarmData: res.data
                })
            }
        })
    }
    //渲染采集项
    renderECLsItem =(item,index) =>{
        // console.info(item)
        hvalue=item.code+'highAlarmValue';
        lvalue=item.code+'lowAlarmValue';
        const {alarmData}=this.state;
        let alarm;
        if(alarmData && alarmData.length){
            alarmData.forEach((data,index) => {
                if (data.columnDesId==item.id) {
                    alarm=alarmData[index]     
                }   
        });
        }
        return (
            <TextInputItem 
                key={index}  
                alarm={(alarm)?alarm:null} 
                data={item} 
                editable={this.state.editable}
                ref={`${index}`}
                />
        )
    };
    modifySetData=()=>{
        this.setState({
            editable:!this.state.editable,
        })
    }
    saveSetData=()=> {
        const {ECLs}=this.state;
        let isEmpty=ECLs.length,
            params=new Array(),
            regInt = /^\d+$/, 
            headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        for(let [index,item] of ECLs.entries()) {
            let hvalue=this.refs[index].state.highAlarmValue;
            let lvalue=this.refs[index].state.lowAlarmValue;
            // console.info(this.refs[index])
            if (!hvalue && !lvalue) {
                isEmpty--;    
            }else{
                if (hvalue !=='') {
                    if (!regInt.test(hvalue)) {
                        toastShort(item.name+'上限值不是非负整数，保存失败')
                        return false    
                    }    
                }
                if (lvalue !=='') {
                    if (!regInt.test(lvalue)) {
                        toastShort(item.name+'下限值不是非负整数，保存失败')
                        return false    
                    }    
                }
                if (parseInt(hvalue)<=parseInt(lvalue)) {
                    toastShort(item.name+'上限值小于或等于下限值，保存失败')
                    return false    
                }
                params.push({
                    "columnDesId":item.id,
                    "highAlarmValue": (hvalue)?parseInt(hvalue):'',
                    "lowAlarmValue": (lvalue)?parseInt(lvalue):'',
                    "orgId": this.props.orgId,
                    "sensorId": this.props.data.id
                })
                console.info(params)    
            }
            
          }
          if (!isEmpty) {
            toastShort('至少要有一项设置,保存失败')
            return false     
          } else {
            setTimeout(() => {
                Network.postJson(api.HOST + api.SAVESENSORSALARM, params, headers, (res) => {
                    console.info(res)
                    if (res.meta && res.meta.success) {
                        this.setState({
                            editable:false
                        })
                        toastShort('保存成功')
                    }else{
                        toastShort(res.meta.message)    
                    }
                })    
            }, 500);    
          }
        
        

    }
    componentDidMount() {
        const { data,orgId } = this.props;
        this.getECLs(data.typeId)
        this.getECLsAlarm(orgId,data.id)
    }
    render() {
        const { orgId, data } = this.props;
        const { ECLs } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.itemTip}>
                    <Text style={styles.itemTipText}>{data.deviceName}</Text>
                </View>
                    {ECLs ? 
                    <View>
                        <View style={styles.contentWrapper}>
                            {ECLs.map((item, index) => this.renderECLsItem(item, index))}
                        </View>
                        <View style={styles.setBtnsStyle}>
                            <Button
                                btnStyle={[styles.deviceSetBtnStyle, styles.saveBtnStyle]}
                                btnTextStyle={styles.deviceSetBtnTxtStyle}
                                title='保存'
                                onPress={this.saveSetData} />
                            <Button
                                btnStyle={[styles.deviceSetBtnStyle, styles.modifyBtnStyle]}
                                btnTextStyle={styles.deviceSetBtnTxtStyle}
                                title='修改'
                                onPress={this.modifySetData} />
                        </View>
                    </View>
                         : 
                        <View style={theme.nodata}><Text>暂无数据</Text></View>}

                </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 6,
    },
    itemTip: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.bgGray2
    },
    itemTipText:{

    },
    contentWrapper:{
    },
    setBtnsStyle:{
        marginVertical:4,
        flexDirection:'row',
        justifyContent:'flex-end',
    },
    deviceSetBtnStyle:{
        paddingHorizontal:15,
        paddingVertical:10,
        marginHorizontal:5,
        borderRadius:5  
    },
    saveBtnStyle:{
        backgroundColor:'#f57831'
    },
    modifyBtnStyle:{
        backgroundColor:'#289fff'
    },
    deviceSetBtnTxtStyle:{
        color:'#ffffff',
        fontSize:14   
    },
    editableStyle:{
        backgroundColor:'transparent'
    },
    unEditableStyle:{
        backgroundColor:'#eee'
    },
})
