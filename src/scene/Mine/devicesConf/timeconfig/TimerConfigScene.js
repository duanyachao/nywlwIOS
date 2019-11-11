import React, { Component } from 'react'
import { Alert,Text, View,StyleSheet,TouchableOpacity,FlatList } from 'react-native'
import { Network, toastShort } from '../../../../utils'
import api from '../../../../api'
import { screen, theme } from '../../../../common'
import {Button} from '../../../../components'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/FontAwesome'
export default class TimerConfigScene extends Component {
    constructor(props){
        super(props)
        this.state={
            orgId:null,
            autoConfigDataList:null,
            timerConfigList:null,
            devices:null,
            uperAction:null,
            lowerAction:null,
            allActions:null,  
        }
    }
    //获取配置信息
    getConfigList=(orgId)=>{
        // console.info(orgId)
        let headers = {
            'X-Token': token
        };
        let params = {
            "orgId":orgId 
        }
        Network.get(api.HOST + api.GETCONFIGLIST, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                let timerConfigDatas=new Array();
                res.data.forEach((data)=>{
                    if (!data.sensorId) {
                        timerConfigDatas.push(data)        
                    }
                })
                this.setState({
                    autoConfigDataList: res.data,
                    timerConfigList:timerConfigDatas
                })
            }
        })
    }
    //获取全部控制设备
    getDevices = (orgId) => {
        let headers = {
            'X-Token': token
        };
        let params = {
            "orgId": orgId,
        }
        Network.get(api.HOST + api.GETALLDEVICES, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                this.setState({
                    devices: res.data
                })
            }
        })
    }
    //获取全部操作
    getActions = () => {
        let headers = {
            'X-Token': token
        };
        Network.get(api.HOST + api.GETALLACTIONS, '', headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                this.setState({
                    allActions: res.data
                })
            }
        })
    }
    //新增定时配置
    createTimerConfig=(autoConfigDataList,orgId)=>{
        if (autoConfigDataList && autoConfigDataList.length==10) {
            toastShort('配置信息已达10条，不能新增')    
        } else {
            this.props.navigation.navigate('CreateTimerConfig',{'orgId':orgId})
        }
    }
    //下发配置
    sendConfigData=(orgId)=>{
        let headers = {
            'X-Token': token
        };
        let params = { "orgId": orgId };
        Network.get(api.HOST + api.SENDCONFAUTOMATION, params, headers, (res) => {
            // console.info(res)
            if(res.meta.success){
                toastShort('下发信息成功')        
            }else{
                toastShort(res.meta.message)     
            }
        })
    }
    //修改配置
    editTimerConfig=(item,orgId,deviceTypeCategory,deviceTypeId,startT,endT)=>{
        this.props.navigation.navigate('CreateTimerConfig',{
            'orgId':orgId,
            'item':item,
            'deviceTypeCategory':deviceTypeCategory,
            'deviceTypeId':deviceTypeId,
            'startTimer':startT,
            'endTimer':endT
        })    
    }
    //删除配置
    delConfig=(id)=>{
        console.info(id)
        Alert.alert(
            '提示',
            '确定删除此项设置',
            [
              {text: '确定', onPress: () =>{
                    let headers = {
                        'X-Token': token,
                    }
                    // let body=id;
                    // Network.post(api.HOST + api.DELCONFAUTOMATION, params, (res) => {
                    //     console.info(res)
                    //     if (res.meta.success) {
                    //         toastShort('删除成功')
                    //         this.getConfigList(this.state.orgId)
                    //     } else {
                    //         toastShort(res.meta.message)
                    //     }
                    // })
                    fetch(api.HOST + api.DELCONFAUTOMATION, {
                        method: 'POST',
                        headers: {
                            'X-Token': token,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: 'id=' + id
                    }).then((res) =>res.json()).then((res)=>{
                         console.info(res)
                        if (res.meta.success) {
                            toastShort('删除成功')
                            this.getConfigList(this.state.orgId)
                        } else {
                            toastShort(res.meta.message)
                        }    
                    })
              }},
             {text:'取消',onPress:()=>{
                 return
             }} 
            ]
          )
       
    }
    renderItem=(data) =>{
        const {devices,allActions,orgId}=this.state;
        let {item,index}=data;
        let deviceName,uperAction,lowerAction,deviceTypeCategory,deviceTypeId;
        let startTH=item.upLimit>>8;
        let startTM=item.upLimit&'0xff';
        let endTH=item.downLimit>>8;
        let endTM=item.downLimit&'0xff';
        let startT=((startTH>10)?startTH:('0'+startTH))+':'+((startTM>10)?startTM:('0'+startTM));
        let endT=((endTH>10)?endTH:('0'+endTH))+':'+((endTM>10)?endTM:('0'+endTM));
        if(devices && devices.length){
            devices.forEach(device => {
                if (device.id==item.deviceId) {
                    deviceTypeCategory=device.deviceTypeCategory;
                    deviceName=device.deviceName;
                    deviceTypeId=device.typeId;    
                }   
        });
        }
        if(allActions && allActions.length){
            allActions.forEach(action => {
                if (item.upDeviceActionId==action.id) {
                    uperAction=action.name    
                }
                if (item.downDeviceActionId==action.id) {
                    lowerAction=action.name    
                } 
            // console.info(sensor)    
        });
        }
        return (
            <View style={styles.listItem}>  
                <View style={styles.itemContent}>
                    <View style={styles.itemContentLeft}>
                        <View style={styles.itemRow}>
                            <Text style={styles.tip}>设备名称:</Text>
                            <Text style={styles.tipcontent}>{deviceName}</Text>
                        </View>
                    </View>
                    <View style={styles.configContent}>
                        <Text style={styles.tip}>定时规则:</Text>
                        <Text style={styles.tipcontent}>{startT}，设备{uperAction};{endT}，设备{lowerAction}</Text>
                        
                    </View>
                    <View style={styles.itemContentRight}>
                        <TouchableOpacity 
                            style={styles.btnStyle}
                            activeOpacity={.7}
                            onPress={() =>this.editTimerConfig(item,orgId,deviceTypeCategory,deviceTypeId,startT,endT) }>
                                <Icon
                                    name="edit"
                                    iconStyle={styles.iconStyle}
                                    size={25}
                                    color={theme.theme}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btnStyle}
                            activeOpacity={.7}
                            onPress={() => this.delConfig(item.id)}>
                            <Icon
                                name="close"
                                iconStyle={styles.iconStyle}
                                size={25}
                                color={theme.colorFirebrick}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )    
    }
    keyExtractor = (item, index) =>index;
    //列表信息
    renderFlatListView=()=>{
      return (
        <View style={styles.configList}>
            <Button 
                btnStyle={styles.setBtnStyle}
                btnTextStyle={styles.setBtnTxtStyle} 
                title='下发设置' 
                onPress={()=> this.sendConfigData(this.state.orgId)} />
            <FlatList
                data={this.state.timerConfigList}
                keyExtractor={this.keyExtractor}
                ref="autoConfigDataList"
                onRefresh={()=>{this.getConfigList(this.state.orgId)}}
                refreshing={false}
                renderItem={(data) => this.renderItem(data)}/>
        </View>
      )  
    }
    componentDidMount(){
        const {navigation}=this.props;
        let orgId=navigation.state.params.orgId;
        this.setState({
            orgId:orgId
        })
        this.getConfigList(orgId)
        this.getDevices(orgId)
        this.getActions(orgId)
    }
    render() {
        const {autoConfigDataList,timerConfigList,orgId}=this.state;
        return (
            <View style={styles.container}>
                {(timerConfigList && timerConfigList.length>0)?
                    this.renderFlatListView():<View style={theme.nodata}><Text>暂无配置信息</Text></View>}
                <TouchableOpacity 
                    style={styles.addBtnStyle}
                    activeOpacity={.7}
                    onPress={() =>this.createTimerConfig(autoConfigDataList,orgId) }>
                    <MaterialCommunityIcons
                        name="plus"
                        iconStyle={styles.iconStyle}
                        size={30}
                        color='#FFF'
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    addBtnStyle:{
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        bottom:50,
        right:20, 
        backgroundColor:theme.theme,
        width:50,
        height:50,
        borderRadius:50,
        zIndex:100
    },
    setBtnStyle:{
        margin:5,
        padding:10,
        alignSelf:'flex-end',
        backgroundColor:theme.theme,
        borderRadius:5  
    },
    setBtnTxtStyle:{
        textAlign:'center',
        color:'#ffffff',
        fontSize:14   
    },
    configList:{
        flex:1
    },
    listItem:{
        margin:10,
    },
    itemContent:{
        backgroundColor:'#fff',
        padding:8   
    },
    itemContentLeft:{
        flexDirection:'row',        
    },
    itemContentRight:{
        paddingTop:10,
        flexDirection:'row',
        justifyContent:'flex-end'     
    },
    itemRow:{
        flexDirection:'row',
        paddingRight:8,
        paddingVertical:4
    },
    configContent:{
        // paddingLeft:4
        flexDirection:'row',
        flexWrap:'wrap'
    },
    tip:{

    },
    tipcontent:{
        color:'#222'
    },
    btnStyle:{
        padding:5,
        marginHorizontal:8
    }
})
