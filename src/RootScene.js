//import liraries
import React, { Component } from 'react';
import { DeviceEventEmitter,View, Text, StyleSheet, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SplashScene from './SplashScene';
import LoginScene from './scene/Mine/LoginScene';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { theme, system, screen } from './common';
import { Network, toastShort } from '../src/utils';
import { TabBarItem,Header,Button } from './components';
import WarnScene from './scene/Warn/WarnScene';
import TaskScene from './scene/Task/TaskScene';
import ProductScene from './scene/Product/ProductScene';
import DeviceScene from './scene/Device/DeviceScene';
import EbusinessScene from './scene/Ebusiness/EbusinessScene';
import MineScene from './scene/Mine/MineScene';
import UserInfoScene from './scene/Mine/UserInfoScene'
import MyprofitScene from './scene/Mine/MyprofitScene'
import MsgScene from './scene/Mine/MsgScene'
import ModifyPasswordScene from './scene/Mine/ModifyPasswordScene'
import VideoScene from './scene/Video/VideoScene'
export default class RootScene extends Component {
    onBackAndroid = () => {
        let routes = this.refs.navigator.state.nav.routes;
        // console.info(routes);
        DeviceEventEmitter.emit('返回键');
        if (routes.length == 1) {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                BackHandler.exitApp();
                return true;
            }
            this.lastBackPressed = Date.now();
            toastShort('再按一次退出应用');
            return true
        } else {
            return false
        }
    }
    componentDidMount() {
        if (system.isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }

    }
    componentWillUnmount() {
        if (system.isAndroid) {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }

    }
    render() {
        return (
            <Navigator ref='navigator'></Navigator>
        );
    }
}
const TabScene = TabNavigator({
    Warn: {
        screen: WarnScene,
        navigationOptions: ({navigation}) => ({
            header:<Header title='报警信息' navigation={navigation}></Header>,
            tabBarLabel: '报警',
            tabBarIcon: ({ tintColor, focused }) => (
                <Icon name={'warning'}
                    size={theme.tabIconsize}
                    style={{ color: tintColor }}>
                </Icon>
            )
        })
    },
    Task: {
        screen: TaskScene,
        navigationOptions: ({navigation}) => ({
            header:<Header title='任务管理' navigation={navigation}></Header>,
            tabBarLabel: '任务',
            tabBarIcon: ({ tintColor, focused }) => (
                <Icon name={'tasks'}
                    size={theme.tabIconsize}
                    style={{ color: tintColor }}>
                </Icon>
            )
        })
    },
    Product: {
        screen: ProductScene,
        navigationOptions: ({navigation}) => ({
            header:<Header title='生产管理' navigation={navigation}></Header>,
            tabBarLabel: '生产',
            tabBarIcon: ({ tintColor, focused }) => (
                <Icon name={'product-hunt'}
                    size={theme.tabIconsize}
                    style={{ color: tintColor }}>
                </Icon>
            )
        })
    },
    Device: {
        screen: DeviceScene,
        navigationOptions: ({navigation}) => ({
            header:<Header title='设备管理' navigation={navigation}></Header>,
            tabBarLabel: '设备',
            tabBarIcon: ({ tintColor, focused }) => (
                <Icon name={'sliders'}
                    size={theme.tabIconsize}
                    style={{ color: tintColor }}>
                </Icon>
            )
        })
    },
    // Ebusiness: {
    //     screen: EbusinessScene,
    //     navigationOptions: ({navigation}) => ({
    //         header:<Header title='农资商城' navigation={navigation}></Header>,
    //         tabBarLabel: '农资',
    //         tabBarIcon: ({ tintColor, focused }) => (
    //             <Icon name={'shopping-cart'}
    //                 size={theme.tabIconsize}
    //                 style={{ color: tintColor }}>
    //             </Icon>
    //         )
    //     })
    // },
    Video: {
        screen: VideoScene,
        navigationOptions: ({navigation}) => ({
            header:<Header title='视频监控' navigation={navigation}></Header>,
            tabBarLabel: '监控',
            tabBarIcon: ({ tintColor, focused }) => (
                <Icon name={'video-camera'}
                    size={theme.tabIconsize}
                    style={{ color: tintColor }}>
                </Icon>
            )
        })
    },
    Mine: {
        screen: MineScene,
        navigationOptions: ({navigation}) => ({
            header:null,
            tabBarLabel: '我的',
            tabBarIcon: ({ tintColor, focused }) => (
                <Icon name={'user'}
                    size={theme.tabIconsize}
                    style={{ color: tintColor }}>
                </Icon>
            )
        })
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
            style: { backgroundColor: '#fff' },
        },
    }
);
const StackOptions = ({navigation}) => {
    let {state, goBack} = navigation;
    const headerStyle = {
        height:45,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: screen.onePixel,
        borderBottomColor: '#ccc'
    };
    const headerTitle = state.params.title;
    const headerTitleStyle = { color: '#a9a9a9',fontSize:16 }
    const headerBackTitle = false;
    const headerLeft =
        <Icon.Button
            borderRadius={0} 
            name="angle-left" 
            backgroundColor="transparent"
            size={30}
            color='#ccc'
            iconStyle={{marginLeft:10}}
            activeOpacity={.4}
            underlayColor={'#eee'}
            onPress={() => goBack()}
            style={{marginBottom:5}}
            >
        </Icon.Button>;
    return { headerStyle, headerTitle, headerTitleStyle, headerBackTitle, headerLeft }
};
const Navigator = StackNavigator({
    Splash: { screen: SplashScene },
    Login: { screen: LoginScene },
    Tab: { screen: TabScene },
    UserInfo: {
        screen: UserInfoScene,
        navigationOptions: ({navigation}) => StackOptions({ navigation })
    },
    ModifyPassword: {
        screen: ModifyPasswordScene,
        navigationOptions: ({navigation}) => StackOptions({ navigation })
    },
    Myprofit: {
        screen: MyprofitScene,
        navigationOptions: ({navigation}) => StackOptions({ navigation })
    },
    Msg: {
        screen: MsgScene,
        navigationOptions: ({navigation}) => StackOptions({ navigation })
    }

},
    {
        mode: (system.isAndroid) ? 'card' : 'modal',
    }
);


