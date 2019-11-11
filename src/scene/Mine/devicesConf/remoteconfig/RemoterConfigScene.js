import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,


} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { screen, theme } from '../../../../common'
import { Button } from './../../../../components'
import { Network, toastShort } from '../../../../utils'
import api from '../../../../api'
import TConfigItem from './TConfigItem'

export default class RemoterConfigScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orgId: this.props.navigation.state.params.orgId,//网点id
            confRemote:null,
            confType: 1,//遥控类型:1=单按键,2多按键
            devices: null,//根据confType关联设备列表
            allDevices:null,
            deviceActionList: null,//根据选择的设备id关联的操作列表
            signalChannels:[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]//信道号
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
        let headers = {
            'X-Token': token
        };
        let category=(confType==1)?3:'';
        let params = {
            "orgId": orgId,
            "category": category
        }
        if (confType==1) {
            Network.get(api.HOST + api.GETLOGICDEVICESLIST, params, headers, (res) => {
                // console.info(res)
                if (res.meta.success) {
                    this.setState({
                        devices: res.data
                    })
                }
            })    
        }
        if (confType==2) {
            Network.get(api.HOST + api.GETALLDEVICES, params, headers, (res) => {
                console.info(res)
                if (res.meta.success) {
                    this.setState({
                        allDevices: res.data
                    })
                }
            })    
        }
    }
    //渲染限位设备信息
    renderTdevicesFlatList=data=>{
        return (
            <FlatList
                data={data}
                numColumns={2}
                initialNumToRender={30}
                keyExtractor={(item, index) =>index}
                onRefresh={() => { this.getDevicesList(this.state.orgId,3) }}
                refreshing={false}
                ref="confDataList"
                renderItem={(item) => this.renderTdeviceItem(item)} />
        )
    }
    //渲染单个限位设备
    renderTdeviceItem=data=>{
        const {item,index}=data;
        let confData=null;
        if (this.state.confRemote && this.state.confRemote.length>0) {
            this.state.confRemote.forEach((data)=>{
                // console.info(data)
                if(data.signalChannel==item){
                    confData=data;
                }
            })
        }
        
        return (
            <TConfigItem data={item} key={index} reload={this.getConfRemote} devices={this.state.devices} orgId={this.state.orgId} confData={confData}/> 
        )  
    }
    renderAlldeivcesFlatList=data=>{

    }
    //获取配置
    getConfRemote=(orgId)=>{
        let headers = {
            'X-Token': token
        };
        let params = { "orgId": orgId };
        Network.get(api.HOST + api.GETREMOTERDATA, params, headers, (res) => {
            // console.info(res)
            if(res.meta.success){
                this.setState({
                    confRemote:res.data
                })        
            }
        })
    }
    //下发配置
    sendConfRemote=(orgId)=>{
        let headers = {
            'X-Token': token
        };
        let params = { "orgId": orgId };
        Network.get(api.HOST + api.SENDREMOTERDATA, params, headers, (res) => {
            console.info(res)
            if(res.meta.success){
                toastShort('下发信息成功')        
            }else{
                toastShort(res.meta.message)     
            }
        })
    }
    componentWillMount(){
        this.selectConfType(this.state.orgId,1)
        this.getConfRemote(this.state.orgId)
    }
    render() {
        const {
            orgId,
            confType,
            signalChannels,
            devices,
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
                            <Text style={styles.deviceTypeName}>限位</Text>
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
                            <Text style={styles.deviceTypeName}>操作</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.sendBtnWrapper}>
                    <Button 
                        btnStyle={styles.sendBtnStyle}
                        btnTextStyle={styles.sendBtnTxtStyle} 
                        title='下发设置' 
                        onPress={()=> this.sendConfRemote(orgId)} />
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
                <View style={styles.confContent}>
                    {(confType==1)?this.renderTdevicesFlatList(signalChannels):this.renderAlldeivcesFlatList(signalChannels)}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    confContent:{
        flex:1
    },
    selectConfTypeStyle: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.bgGray3,
        backgroundColor:'#fff',
    },
    sendBtnWrapper:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end',
    },
    sendBtnStyle:{
        alignSelf:'flex-end',
        padding:10,
        margin:10,
        backgroundColor:theme.theme,
        borderRadius:5     
    },
    sendBtnTxtStyle:{
        color:'#ffffff',
        fontSize:14   
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
    
})
