import React, { Component } from 'react'
import { Text, StyleSheet,View,FlatList } from 'react-native'
import { PagerTabIndicator, IndicatorViewPager } from 'rn-viewpager'
import { screen, theme } from '../../../../common'
import api from '../../../../api'
import {Network,toastShort  } from '../../../../utils'
import { Button } from '../../../../components'
import DurationItem from './DurationItem'
export default class DurationConfigScene extends Component {
    constructor(props){
        super(props)
        this.state={
            orgId:null,
            switchDevices:null,
            travelDevices:null,
        }
    }
    //获取设备
    getDevicesList = (orgId, category) => {
        let headers = {
            'X-Token': token
        };
        let params = {
            "orgId":orgId,
            "category":category
        }
        Network.get(api.HOST + api.GETLOGICDEVICESLIST, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                if (category==2) {
                    this.setState({
                        switchDevices:res.data
                    })    
                }
                if (category==3) {
                    this.setState({
                        travelDevices:res.data
                    })    
                }
            }
        })
    }
    //TAB选项
    renderTabIndicator() {
        let tabs = [
            { text: '开关类设备' }, { text: '行程类设备' }
        ];
        return (
            <PagerTabIndicator
                style={styles.indicatorContainer}
                textStyle={styles.tabTxt}
                selectedTextStyle={styles.selectedTabTxt}
                itemStyle={styles.tabItem}
                selectedItemStyle={styles.selectedTabItem}
                tabs={tabs}>
            </PagerTabIndicator>
        )
    }
    //单个设备渲染
    renderItem=(data,category,orgId)=>{
        return (
            <DurationItem data={data} category={category} orgId={orgId}/>
        )
    }
    //渲染设备列表
    renderFlatList=(data,category)=>{
        return (
            <FlatList
                data={data}
                initialNumToRender={30}
                keyExtractor={(item, index) =>index}
                onRefresh={() => { this.getDevicesList(this.state.orgId,category) }}
                refreshing={false}
                ref="DevicesList"
                renderItem={(item) => this.renderItem(item,category,this.state.orgId)} />
        )
    }
    //下发配置
    sendDevicesSetDatas=(orgId)=>{
        let headers = {
            'X-Token': token
        };
        let params = { "orgId": orgId };
        Network.get(api.HOST + api.SENDDEVICESET, params, headers, (res) => {
            console.info(res)
            if(res.meta.success){
                toastShort('下发信息成功')        
            }else{
                toastShort(res.meta.message)     
            }
        })
    }
    componentDidMount(){
        const {navigation}=this.props
        const {orgId}=this.state
        this.setState({
            orgId:navigation.state.params.orgId
        })
        this.getDevicesList(navigation.state.params.orgId,2)
        this.getDevicesList(navigation.state.params.orgId,3)
    }
    render() {
        const {switchDevices,travelDevices,orgId}=this.state
        // console.info(orgId)
        return (
            <View style={styles.container}>
                    <Button 
                        btnStyle={styles.sendBtnStyle}
                        btnTextStyle={styles.sendBtnTxtStyle} 
                        title='下发设置' 
                        onPress={()=> this.sendDevicesSetDatas(orgId)} />
                
                <IndicatorViewPager
                    style={{ flex: 1, flexDirection: 'column-reverse' }}
                    indicator={this.renderTabIndicator()}
                    scrollEnabled={true}
                    initialPage={0}>
                    {(switchDevices && switchDevices.length>0)?<View>{this.renderFlatList(switchDevices,2)}</View>:<View style={theme.nodata}><Text>暂无设备</Text></View>}
                    {(travelDevices && travelDevices.length>0)?<View>{this.renderFlatList(travelDevices,3)}</View>:<View style={theme.nodata}><Text>暂无设备</Text></View>}
                </IndicatorViewPager>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1
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
    indicatorContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 5,
        borderBottomColor: '#f0f0f0',
        borderTopWidth: 0,
        paddingTop: 0,
        paddingBottom: 0,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    tabTxt: {
        marginTop: 0,
        color: '#222',
        fontSize: 13,
        paddingBottom: 12,
    },
    selectedTabTxt: {
        marginTop: 0,
        color: '#05b8a5',
        fontSize: 13,
        paddingLeft: 6,
        paddingRight: 6,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#05b8a5'
    },
    tabItem: {
        paddingTop: 20,
        marginTop: 0
    },    
})
