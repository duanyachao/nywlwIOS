import React, { Component } from 'react'
import { Text, View,StyleSheet,TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Area, Header } from './../../../components'
import { screen, theme } from './../../../common'
import { rowStyle } from './../../../common/theme'
import { Network, toastShort } from './../../../utils'
import api from './../../../api'
export default class ConfigItemsScene extends Component {
    constructor(props){
        super(props)
        this.state={
            orgId:null
        }
    }
    areaChange(orgId, terminalId, terminalSerialNum) {
        this.setState({
            orgId:orgId
        })
        // console.info(orgId, terminalId, terminalSerialNum)    
    }    
    render() {
        const {navigation}=this.props;
        const {orgId}=this.state;
        return (
            <View style={styles.container}>
                <Area callbackParent={(orgId, terminalId, terminalSerialNum) => this.areaChange(orgId, terminalId, terminalSerialNum)}></Area>
                <View style={styles.configWrapperStyle}>
                    
                    <TouchableOpacity onPress={() => navigation.navigate('WarnConfig',{'orgId':orgId})}>
                        <View style={styles.configItemWrapperStyle}>
                            <View style={styles.itemLeft}>
                                <Text style={styles.itemName}>报警设置</Text>
                                <Text style={styles.itemTip}>设置和设备操作无关</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Icon  name='angle-right' size={16} color="#ccc"></Icon>
                            </View>
                        </View>
                    </TouchableOpacity> 
                   
                    <TouchableOpacity onPress={() => navigation.navigate('AutomateConfig',{'orgId':orgId})}>
                        <View style={styles.configItemWrapperStyle}>
                            <View style={styles.itemLeft}>
                                <Text style={styles.itemName}>阈值设置</Text>
                                <Text style={styles.itemTip}>根据设备、传感器来设置设备操作动作</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Icon  name='angle-right' size={16} color="#ccc"></Icon>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('TimerConfig',{'orgId':orgId})}>
                        <View style={styles.configItemWrapperStyle}>
                            <View style={styles.itemLeft}>
                                <Text style={styles.itemName}>定时设置</Text>
                                <Text style={styles.itemTip}>设置设备的运行时间</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Icon  name='angle-right' size={16} color="#ccc"></Icon>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('DurationConfig',{'orgId':orgId})}>
                        <View style={[styles.configItemWrapperStyle,styles.marginBottom]}>
                            <View style={styles.itemLeft}>
                                <Text style={styles.itemName}>时长设置</Text>
                                <Text style={styles.itemTip}>设置设备的运行时长</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Icon  name='angle-right' size={16} color="#ccc"></Icon>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => navigation.navigate('DevicesPortsConfig',{'orgId':orgId})}>
                        <View style={styles.configItemWrapperStyle}>
                            <View style={styles.itemLeft}>
                                <Text style={styles.itemName}>端口设置</Text>
                                <Text style={styles.itemTip}>设置设备对应控制器的定位</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Icon  name='angle-right' size={16} color="#ccc"></Icon>
                            </View>
                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => navigation.navigate('RemoterConfig',{'orgId':orgId})}>
                        <View style={[styles.configItemWrapperStyle,styles.marginBottom]}>
                            <View style={styles.itemLeft}>
                                <Text style={styles.itemName}>遥控设置</Text>
                                <Text style={styles.itemTip}>设置设备对应的遥控器按键</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Icon  name='angle-right' size={16} color="#ccc"></Icon>
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>
                
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    configWrapperStyle:{
        backgroundColor:'#fff',
        paddingLeft:10
    },
    configItemWrapperStyle:{
        flexDirection:'row',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderBottomColor:theme.bgGray3,
        paddingVertical:5,
    },
    itemLeft:{
        paddingLeft:5,
    },
    itemRight:{
        justifyContent:'center',
        marginRight:10
    },
    itemName:{
        fontSize:14,
        color:'#000',
        paddingVertical:6,
    },
    itemTip:{
        fontSize:10,
        color:'#ccc'
    },
    marginBottom: {
        marginBottom: 10
    }
});