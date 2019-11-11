import React, { Component } from 'react'
import { Text, View,StyleSheet } from 'react-native'
import {TabNavigator,TabBarTop,TabBarBottom} from 'react-navigation'
import { Area, Header } from '../../../components'
import { theme } from '../../../common'
import WarnConfigScene from './warnconfig/WarnConfigScene'
// import AutomateConfigScene from './automateconfig/AutomateConfigScene'
import AutomateConfigScene from './automateconfig/AutomateConfigScene'
import DevicesPortsConfigScene from './portconfig/DevicesPortsConfigScene'
import TimerConfigScene from './timeconfig/TimerConfigScene'
import RemoterConfigScene from './remoteconfig/RemoterConfigScene'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import { setSpText,scaleSizeH,scaleSizeW } from './../../../utils/ScreenSet'
export default class DevicesConfScene extends Component {
    constructor(props){
        super(props)
        this.state={
            orgId:null,
            configDataList:null    
        }
    }
    areaChange(orgId, terminalId, terminalSerialNum) {
        this.setState({
            orgId:orgId
        })
        // console.info(orgId, terminalId, terminalSerialNum)    
    }
    componentDidMount(){
        // console.info(this.props.navigation)
    }
    /**
 * Tab点击跳转调用的公共方法
 */
route = (navigation) => {
    if (!navigation.isFocused()) {
        // 路由方法, 动态跳转到对应界面
        navigation.navigate(navigation.state.routeName)
    }
};
    render() {
        const TabNav = TabNavigator(
            {
                WarnConfig: {
                    screen: WarnConfigScene,
                    navigationOptions:({navigation })=>({
                        tabBarLabel: '报警设置',
                        tabBarOnPress: () => { // 使用tabBarOnPress点击事件
                            this.route(navigation)
                        }
                    })
                },
                AutomateConfig: {
                    screen: AutomateConfigScene,
                    navigationOptions:({navigation })=>({
                        tabBarLabel: '阈值设置',
                        tabBarOnPress: () => { // 使用tabBarOnPress点击事件
                            // console.info(navigation)
                            this.route(navigation)
                        }
                    })
                },
                TimerConfig: {
                    screen: TimerConfigScene,
                    navigationOptions:({navigation })=>({
                        tabBarLabel: '定时设置',
                        tabBarOnPress: () => { // 使用tabBarOnPress点击事件
                            this.route(navigation)
                        }
                    })
                },
                DevicesPortsConfig: {
                    screen: DevicesPortsConfigScene,
                    navigationOptions:({navigation })=>({
                        tabBarLabel: '端口设置',
                        tabBarOnPress: () => { // 使用tabBarOnPress点击事件
                            this.route(navigation)
                        }
                    })
                },
                RemoterConfigConfig: {
                    screen: RemoterConfigScene,
                    navigationOptions:({navigation })=>({
                        tabBarLabel: '遥控设置',
                        tabBarOnPress: () => { // 使用tabBarOnPress点击事件
                            this.route(navigation)
                        }
                    })
                }
            },
            {
                initialRouteName: 'WarnConfig', // 设置默认的页面组件
                initialRouteParams: {orgId: this.state.orgId}, // 找这条命令不容易, 翻github翻了一个小时
                tabBarOptions: {
                    //当前选中的tab bar的文本颜色和图标颜色
                    activeTintColor: theme.theme,//'#4BC1D2',
                    //当前未选中的tab bar的文本颜色和图标颜色
                    inactiveTintColor: '#000',
                    //是否显示tab bar的图标，默认是false
                    showIcon: false,
                    //showLabel - 是否显示tab bar的文本，默认是true
                    showLabel: true,
                    //是否将文本转换为大小，默认是true
                    upperCaseLabel: false,
                    //material design中的波纹颜色(仅支持Android >= 5.0)
                    pressColor: '#788493',
                    //按下tab bar时的不透明度(仅支持iOS和Android < 5.0).
                    pressOpacity: 0.8,
                    //tab bar的样式
                    style: {
                        backgroundColor: '#fff',
                        paddingBottom: 1,
                        borderTopWidth: 0.2,
                        paddingTop:0,
                        borderTopColor: '#ccc',
                    },
                    //tab bar的文本样式
                    labelStyle: {
                        fontSize: 10,
                        // marginVertical:5,
                    },
                    //tab 页指示符的样式 (tab页下面的一条线).
                    indicatorStyle: {
                        backgroundColor:theme.theme,
                        height:1,
                    },
                },
                tabBarComponent:TabBarTop,
                //tab bar的位置, 可选值： 'top' or 'bottom'
                tabBarPosition: 'top',
                //是否允许滑动切换tab页
                swipeEnabled: false,
                //是否在切换tab页时使用动画
                animationEnabled: true,
                //是否懒加载
                lazy: true,
                //返回按钮是否会导致tab切换到初始tab页？ 如果是，则设置为initialRoute，否则为none。 缺省为initialRoute。
                backBehavior: 'none',
        });
        return (
            <View style={styles.container}>
                <Area callbackParent={(orgId, terminalId, terminalSerialNum) => this.areaChange(orgId, terminalId, terminalSerialNum)}></Area>
                <TabNav/>
            </View>
        )
    }
}


const styles=StyleSheet.create({
    container:{
        flex:1
    }
})
