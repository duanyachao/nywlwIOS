import React, { Component } from 'react'
import { Text,TextInput, View,StyleSheet ,propTypes,ScrollView  } from 'react-native'
// import PropTypes from 'prop-types'
import { theme,screen } from './../../../common'
import { Network, toastShort} from './../../../utils'
import {Button} from './../../../components'
import api from './../../../api'
export default class DeviceSetComponent extends Component {
    // static propTypes = {
    //     durationOff: PropTypes.string,
    //     durationOn:PropTypes.string
    // }
    constructor(props) {
        super(props);
        this.state = {
            setId:null,
            editable:false,
            durationOff:0,
            durationOn:0,
        }
    }
    saveSetData(deviceData,orgId) {
        this.refs.durationOn.blur();
        console.info(this.state.durationOn,this.state.durationOff)
        var regInt = /^\d+$/;
        // if (!this.state.durationOn || !this.state.durationOff) {
        //     toastShort('请输入正转和反转时长');
        //     return false
        // } 
        if (!regInt.test(this.state.durationOn) || !regInt.test(this.state.durationOff)) {
            toastShort('时长设置不正确,请重新设置');
            return false
        }
        if(this.state.durationOn>=2400 || this.state.durationOff>=2400){
            toastShort('时长不能超过2400秒,请重新设置');
            return false
        }
        this.setState({
            durationOn: parseInt(this.state.durationOn),
            durationOff: parseInt(this.state.durationOff),
            
        })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        let params = { 
            'deviceId': deviceData.DEVICE_ID,
            'durationOff':parseInt(this.state.durationOff),
            'durationOn':parseInt(this.state.durationOn),
            'orgId':orgId,
            'id':this.state.setId
        };
        Network.postJson(api.HOST + api.SAVEDEVICESET, params, headers, (res) => {
            // console.info(res)
            if (res.meta && res.meta.success) {
                this.setState({
                    editable:false
                })
                toastShort('保存成功')
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
        let params = { "deviceId":deviceData.DEVICE_ID };
        Network.get(api.HOST + api.GETDEVICESET, params, headers, (res) => {
            console.info(res)
            if (res.meta.success && res.data) {
                this.setState({
                    setId:res.data.id,
                    durationOff:res.data.durationOff,
                    durationOn:res.data.durationOn,
                })
            }
        })
    }
    componentDidMount(){
        const {deviceData,orgId}=this.props;
        this.getDeviceSet(deviceData)
        console.info(this.state.durationOn)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.deviceData !== this.props.deviceData) {
            const { deviceData,orgId } = nextProps;
            this.getDeviceSet(deviceData)
        }
        return true
    }
    render() {
        const {deviceData,orgId}=this.props;
        return (
            <View style={styles.container}>
                <View style={styles.setContentStyle}>
                    <View style={styles.setItemStyle}>
                        <Text style={styles.setItemTipStyle}>开启时长:</Text>
                        <ScrollView keyboardShouldPersistTaps={'always'}>
                        <TextInput 
                            style={[styles.textInputStyle,(this.state.editable)?styles.editableStyle:styles.unEditableStyle]}
                            maxLength={4}
                            editable={this.state.editable}
                            placeholder="<=2400"
                            placeholderTextColor="#ccc"
                            underlineColorAndroid="transparent"
                            keyboardType='numeric'
                            ref='durationOn'
                            defaultValue={`${this.state.durationOn}`}
                            onChangeText={(text) => this.setState({ durationOn: text })}
                            // value={(this.state.durationOn)?`${this.state.durationOn}`:null}
                            
                            />
                        </ScrollView>
                        <Text style={styles.tipEndStyle}>秒</Text>
                    </View>
                    <View style={styles.setItemStyle}>
                        <Text style={styles.setItemTipStyle}>关闭时长:</Text>
                        <TextInput 
                            style={[styles.textInputStyle,(this.state.editable)?styles.editableStyle:styles.unEditableStyle]}
                            maxLength={4}
                            editable={this.state.editable}
                            placeholder="<=2400"
                            placeholderTextColor="#ccc"
                            underlineColorAndroid="transparent"
                            keyboardType='numeric'
                            ref='durationOff'
                            defaultValue={`${this.state.durationOff}`}
                            // defaultValue={(this.state.durationOff)?`${this.state.durationOff}`:'0'}
                            onChangeText={(text) => this.setState({ durationOff: text })}
                            // value={`${this.state.durationOff}`}
                            />
                            
                        <Text style={styles.tipEndStyle}>秒</Text>
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
        borderTopWidth:1,
        borderTopColor:'#eee',
    },
    setContentStyle:{
        flexDirection:'row',
        justifyContent:'center'
    },
    setBtnsStyle:{
        flexDirection:'row',
        justifyContent:'center',
    },
    setItemStyle:{
        // flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        padding:10
    },
    setItemTipStyle:{
        fontSize:14,
        color:'#222'    
    },
    textInputStyle:{
        marginHorizontal:5,
        fontSize:14,
        width:80,
        // width:scaleSizeW(120),
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
