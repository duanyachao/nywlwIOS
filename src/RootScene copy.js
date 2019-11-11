//import liraries
import React, { Component } from 'react';
import {
    Alert,
    DeviceEventEmitter,
    InteractionManager,
    View,
    Text,
    StyleSheet,
    BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SplashScene from './SplashScene';
import LoginScene from './scene/Mine/LoginScene';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { theme, system, screen } from './common';
import { Network, toastShort } from '../src/utils';
import { TabBarItem, Header, Button } from './components';
import WarnScene from './scene/Warn/WarnScene';
import TaskScene from './scene/Task/TaskScene';
import ProductScene from './scene/Product/ProductScene';
import DeviceScene from './scene/Device/DeviceScene';
import EnvDataScene from './scene/EnvData/EnvDataScene';
import MineScene from './scene/Mine/MineScene';
import UserInfoScene from './scene/Mine/UserInfoScene'
import DevicesConfScene from './scene/Mine/devicesConf/DevicesConfScene'
import MsgScene from './scene/Mine/MsgScene'
import ModifyPasswordScene from './scene/Mine/ModifyPasswordScene'
import VideoScene from './scene/Video/VideoScene'
import JPushModule from 'jpush-react-native';
export default class RootScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            msgType: null,
            isOpen: false,
            currentRoute:null
        }
    }
    onBackAndroid = () => {
        let routes = this.refs.navigator.state.nav.routes;

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

        // 在收到点击事件之前调用此接口
        JPushModule.notifyJSDidLoad((resultCode) => {
            if (resultCode === 0) {
            }
        });
        this.loginListener = DeviceEventEmitter.addListener('loginSuccess', (msg) => {
            JPushModule.setAlias(msg, (map) => {
                if (map.errorCode === 0) {
                    // alert("set alias succeed");
                } else {
                    // alert("set alias failed, errorCode: " + map.errorCode);
                }
            });

        })
        JPushModule.getInfo((map) => {
            // console.info(map)
        });

        JPushModule.addReceiveNotificationListener((message) => {
            DeviceEventEmitter.emit('receiveWarnMsg', message)
            let msgType = eval('(' + message.extras + ')');
            this.setState({
                message: message.alertContent,
                msgType: msgType.type
            })
            if(!this.state.isOpen){
                Alert.alert(
                    (this.state.msgType == 'alarm') ? '报警提示' : '任务提示',
                    this.state.message,
                    [
                        // {
                        //     text: '查看详情', onPress: () => {
                        //         let routeName=this.state.currentRoute;
                        //         console.info(routeName)
                        //         if (routeName) {
                        //             this.refs.navigator.navigation.navigate('Msg', { 'title': '我的消息' });
                        //         } else {
                                    
                        //         }
                        //     }
                        // }
                        {
                            text: '确定', onPress: () => {
                                
                            }
                        }
    
                    ],
                    { cancelable: false }
                )
            }            
        })
        // JPushModule.addReceiveOpenNotificationListener((message) => {
        //     if (this.props.navigation === undefined) {
        //         // 启动主页面，初始化 navigation
        //         // 保存跳转事件，初始化完成后跳转
        //         // console.info(this.props.navigation)
        //     } else {
        //         // 跳转
        //         InteractionManager.runAfterInteractions(() => {
        //             this.props.navigation.navigate('Msg', { title: '我的消息' })
        //         })
        //     }

        //     // DeviceEventEmitter.emit('msg');        
        // });

    }
    componentWillUnmount() {
        if (system.isAndroid) {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
        this.loginListener.remove();
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Navigator 
                ref='navigator' 
                onNavigationStateChange={
                    (prevState, currentState,action) => {this.setState({
                        currentRoute:action
                    })
                }}></Navigator>
            </View>
        );
    }
}

const TabScene = TabNavigator({
    Env: {
        screen: EnvDataScene,
        navigationOptions: ({navigation}) => TabOptions('报警', navigation, 'warning', true, '报警信息')
    },
    Task: {
        screen: TaskScene,
        navigationOptions: ({navigation}) => TabOptions('任务', navigation, 'tasks', true, '任务管理')
    },
    Product: {
        screen: ProductScene,
        navigationOptions: ({navigation}) => TabOptions('生产', navigation, 'product-hunt', true, '生产管理')
    },
    Device: {
        screen: DeviceScene,
        navigationOptions: ({navigation}) => TabOptions('设备', navigation, 'sliders', true, '设备管理')
    },
    Video: {
        screen: VideoScene,
        navigationOptions: ({navigation}) => TabOptions('监控', navigation, 'video-camera', true, '视频监控')
    },
    Mine: {
        screen: MineScene,
        navigationOptions: ({navigation}) => TabOptions('我的', navigation, 'user', false, '')
    }
},
    {
        initialRouteName: 'Env',
        backBehavior: "none",
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled: true,
        // lazy: false,
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
const TabOptions = (tabBarTitle, navigation, iconName, isheader, navTitle) => {
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
    const header = (isheader) ? <Header title={headerTitle}  navigation={navigation} leftBtn={false} rightBtn={false}></Header> : null
    return { tabBarLabel, tabBarIcon, header, headerTitle };
};
const StackOptions = ({navigation}) => {
    let {state, goBack} = navigation;
    const headerStyle = {
        height: 45,
        backgroundColor: '#fff',
        borderBottomWidth: screen.onePixel,
        borderBottomColor: '#ccc'
    };
    const headerTitle = state.params.title;
    const headerTitleStyle = { color: '#a9a9a9', fontSize: 16 }
    const headerBackTitle = false;
    const headerLeft =
        <Icon.Button
            borderRadius={0}
            name="angle-left"
            backgroundColor="transparent"
            size={30}
            color='#ccc'
            iconStyle={{ marginLeft: 10 }}
            activeOpacity={.4}
            underlayColor={'#eee'}
            onPress={() => goBack()}
            style={{ marginBottom: 5 }}
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
    DevicesConfg: {
        screen: DevicesConfScene,
        navigationOptions: ({navigation}) => ({
            header: null
        })
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
// define your styles
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 300
    },
    btn: {
        margin: 10,
        backgroundColor: "#3B5998",
        padding: 10
    },


    btnTip: {
        textAlign: 'center',
        color: '#fff'
    },
    modalContent: {
        height: 300,
        width: 300
    },
})
