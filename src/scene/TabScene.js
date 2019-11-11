//import liraries
import React, { Component } from 'react';
import { InteractionManager,View, Text, StyleSheet } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import WarnScene from './Warn/WarnScene';
import EnvDataScene from './EnvData/EnvDataScene';
import TaskScene from './Task/TaskScene';
import ProductScene from './Product/ProductScene';
import DeviceScene from './Device/DeviceScene';
import EbusinessScene from './Ebusiness/EbusinessScene';
import VideoScene from './Video/VideoScene'
import MineScene from './Mine/MineScene';
import { theme, system, screen } from '../common';
import { TabBarItem, Header,} from '../components';
const Tabs = TabNavigator({
    Warn: {
        screen: EnvDataScene,
        navigationOptions: ({navigation})=> TabOptions('报警',navigation,'warning',true,'报警信息')
    },
    Task: {
        screen: TaskScene,
        navigationOptions: ({navigation})=> TabOptions('任务',navigation,'tasks',true,'任务管理')
    },
    Product: {
        screen: ProductScene,
        navigationOptions: ({navigation})=> TabOptions('生产',navigation,'product-hunt',true,'生产管理')
    },
    Device: {
        screen: DeviceScene,
        navigationOptions: ({navigation})=> TabOptions('设备',navigation,'sliders',true,'设备管理')
    },
    Video: {
        screen: VideoScene,
        navigationOptions: ({navigation})=> TabOptions('监控',navigation,'video-camera',true,'视频监控')
    },
    Mine: {
        screen: MineScene,
        navigationOptions: ({navigation})=> TabOptions('我的',navigation,'user',false,'')
    }
},
    {
        initialRouteName: 'Warn',
        backBehavior: "none",
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled: true,
        lazy: true,
        // order: ["Home", "Nearby", "Order", "Mine"],
        animationEnabled: true,
        tabBarOptions: {
            showIcon: true,
            activeTintColor: theme.theme,
            inactiveTintColor: '#979797',
            labelStyle: {
                fontSize: theme.tabFontSize,
            },
            style: { backgroundColor: 'blue' },
        },
    }
);
const TabOptions = (tabBarTitle,navigation,iconName, isheader, navTitle) => {
    const tabBarLabel = tabBarTitle;
    const tabBarIcon = (({tintColor, focused}) => {
        return (
            <Icon name={iconName}
                size={theme.tabIconsize}
                style={{ color: tintColor }}>
            </Icon>
        )
    });
    const headerTitle = navTitle;
    const header=(isheader)?<Header title={headerTitle} navigation={navigation}></Header>:null
    return { tabBarLabel,tabBarIcon, header,headerTitle};
};
// create a component
class TabScene extends Component {
     
     componentDidMount() {

    }
    render() {
        return (
            <Tabs></Tabs>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default TabScene;
