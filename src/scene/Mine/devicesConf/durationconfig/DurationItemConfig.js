import React, { Component } from 'react'
import { Text,TextInput, View,StyleSheet  } from 'react-native'
// import PropTypes from 'prop-types'
import { theme,screen } from '../../../../common'
import { Network, toastShort} from '../../../../utils'
import {Button} from '../../../../components'
import api from '../../../../api'
import pxToDp from './../../../../common/pxToDp'
export default class TimerItemConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setId:null,
            editable:false,
            durationOff:0,
            durationOn:0,
            durationRunningPer:0,
            durationRunningInterval:0
        }
    }
    saveSetData(deviceData,orgId) {
        const {setId,durationOn,durationOff,durationRunningPer,durationRunningInterval}=this.state;
        // console.info('开启时长:'+durationOn,'关闭时长:'+durationOff,'单次运行时长:'+durationRunningPer,'单次间隔时长:'+durationRunningInterval)
        var regInt = /^\d+$/;
        if (!regInt.test(durationOn)) {
            toastShort('开启时长不正确,请重新设置');
            return false
        }
        if (!regInt.test(durationOff)) {
            toastShort('关闭时长不正确,请重新设置');
            return false
        }
        if (!regInt.test(durationRunningPer)) {
            toastShort('单次运行时长不正确,请重新设置');
            return false
        }
        if (!regInt.test(durationRunningInterval)) {
            toastShort('单次间隔时长不正确,请重新设置');
            return false
        }
        if(durationOn>3200 || durationOff>3200 || durationRunningPer>3200 || durationRunningInterval>3200){
            toastShort('时长不能超过3200秒,请重新设置');
            return false
        }
        if(parseInt(durationRunningPer)>parseInt(durationOn)){
            toastShort('单次运行时长不能大于开启时长,请重新设置');
            return false
        }
        if(parseInt(durationRunningPer)>parseInt(durationOff)){
            toastShort('单次运行时长不能大于关闭时长,请重新设置');
            return false
        }
        this.setState({
            durationOn: parseInt(durationOn),
            durationOff: parseInt(durationOff),
            durationRunningPer: parseInt(durationRunningPer),
            durationRunningInterval: parseInt(durationRunningInterval)
        })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        let params = { 
            'deviceId': deviceData.id,
            'durationOff':parseInt(durationOff),
            'durationOn':parseInt(durationOn),
            'durationRunningPer':parseInt(durationRunningPer),
            'durationRunningInterval':parseInt(durationRunningInterval),
            'orgId':orgId,
            'id':setId
        };
        Network.postJson(api.HOST + api.SAVEDEVICESET, params, headers, (res) => {
            // console.info(res)
            if (res.meta && res.meta.success) {
                this.setState({
                    editable:false
                })
                toastShort('保存成功')
                setTimeout(() => {
                    this.getDeviceSet(deviceData)    
                }, 500);
            }
        })

    }
    modifySetData() {
        this.setState({
            editable:true,
        })
    }
    getDeviceSet=(deviceData) => {
        let headers = {
            'X-Token': token
        };
        let params = { "deviceId":deviceData.id };
        Network.get(api.HOST + api.GETDEVICESET, params, headers, (res) => {
            
            if (res.meta.success && res.data) {
                this.setState({
                    setId:res.data.id,
                    durationOff:res.data.durationOff,
                    durationOn:res.data.durationOn,
                    durationRunningPer:res.data.durationRunningPer,
                    durationRunningInterval:res.data.durationRunningInterval
                })
                // console.info(this.state.setId)
            }
        })
    }
    componentDidMount(){
        const {deviceData,orgId}=this.props;
        // console.info(deviceData)
        this.getDeviceSet(deviceData)
    }
    render() {
        const {deviceData,orgId}=this.props;
        // console.info(deviceData)
        return (
            <View style={styles.container}>
                <View style={styles.itemWrapper}>
                    <View style={styles.setContentStyle}>
                        <View style={styles.setItemStyle}>
                            <Text style={styles.setItemTipStyle}>开启时长:</Text>
                            <TextInput
                                style={[styles.textInputStyle, (this.state.editable) ? styles.editableStyle : styles.unEditableStyle]}
                                maxLength={4}
                                editable={this.state.editable}
                                placeholder="<=3200"
                                placeholderTextColor="#ccc"
                                underlineColorAndroid="transparent"
                                keyboardType='numeric'
                                ref='durationOn'
                                defaultValue={`${this.state.durationOn}`}
                                onChangeText={(text) => this.setState({ durationOn: text })}

                            />
                            <Text style={styles.tipEndStyle}>秒</Text>
                        </View>
                        <View style={styles.setItemStyle}>
                            <Text style={styles.setItemTipStyle}>关闭时长:</Text>
                            <TextInput
                                style={[styles.textInputStyle, (this.state.editable) ? styles.editableStyle : styles.unEditableStyle]}
                                maxLength={4}
                                editable={this.state.editable}
                                placeholder="<=3200"
                                placeholderTextColor="#ccc"
                                underlineColorAndroid="transparent"
                                keyboardType='numeric'
                                ref='durationOff'
                                defaultValue={`${this.state.durationOff}`}
                                onChangeText={(text) => this.setState({ durationOff: text })}
                            />

                            <Text style={styles.tipEndStyle}>秒</Text>
                        </View>
                    </View>
                    <View style={styles.setContentStyle}>
                        <View style={styles.setItemStyle}>
                            <Text style={styles.setItemTipStyle}>单次运行时长:</Text>
                            <TextInput
                                style={[styles.textInputStyle, (this.state.editable) ? styles.editableStyle : styles.unEditableStyle]}
                                maxLength={4}
                                editable={this.state.editable}
                                placeholder="<=3200"
                                placeholderTextColor="#ccc"
                                underlineColorAndroid="transparent"
                                keyboardType='numeric'
                                ref='durationRunningPer'
                                defaultValue={`${this.state.durationRunningPer}`}
                                onChangeText={(text) => this.setState({ durationRunningPer: text })} />
                            <Text style={styles.tipEndStyle}>秒</Text>
                        </View>
                        <View style={styles.setItemStyle}>
                            <Text style={styles.setItemTipStyle}>单次间隔时长:</Text>
                            <TextInput
                                style={[styles.textInputStyle, (this.state.editable) ? styles.editableStyle : styles.unEditableStyle]}
                                maxLength={4}
                                editable={this.state.editable}
                                placeholder="<=3200"
                                placeholderTextColor="#ccc"
                                underlineColorAndroid="transparent"
                                keyboardType='numeric'
                                ref='durationRunningInterval'
                                defaultValue={`${this.state.durationRunningInterval}`}
                                onChangeText={(text) => this.setState({ durationRunningInterval: text })}
                            />

                            <Text style={styles.tipEndStyle}>秒</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.setBtnsStyle}>
                    <Button
                        btnStyle={[styles.deviceSetBtnStyle,styles.saveBtnStyle]}
                        btnTextStyle={styles.deviceSetBtnTxtStyle}
                        title='保存'
                        onPress={() =>{this.saveSetData(deviceData,orgId)}} />
                    <Button
                        btnStyle={[styles.deviceSetBtnStyle,styles.modifyBtnStyle]}
                        btnTextStyle={styles.deviceSetBtnTxtStyle}
                        title='修改'
                        onPress={() =>{this.modifySetData()}} />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        marginTop:10,
    },
    itemWrapper:{
        flexDirection:'row',
    },
    setContentStyle:{
        
    },
    setBtnsStyle:{
        flexDirection:'row',
        justifyContent:'center',
    },
    setItemStyle:{
        flexDirection:'row',
        alignItems:'center',
        padding:10,
    },
    setItemTipStyle:{
        fontSize:14,
        color:'#222'    
    },
    textInputStyle:{
        marginHorizontal:5,
        fontSize:14,
        width:pxToDp(110),
        // width:120,
        borderRadius:4,
        borderWidth:1,
        borderColor:theme.theme,
    },
    tipEndStyle:{
        
    },
    editableStyle:{
        backgroundColor:'transparent'
    },
    unEditableStyle:{
        backgroundColor:'#eee'
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
        fontSize:16    
    },
})
