//import liraries
import React, { Component } from 'react';
import {
    Alert,
    DeviceEventEmitter,
    Image,
    InteractionManager,
    Linking,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { screen, theme } from '../../common';
import { rowStyle } from '../../common/theme';
import { Header, Button } from '../../components';
import { Network, toastShort } from '../../utils';
import api from '../../api';
import { NavigationActions } from 'react-navigation';
// create a component
class MineScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
        }
    }
    getUserInfo() {
        let headers = {
            'X-Token': token
        };
        let params = { "userId": userId };
        Network.get(api.HOST + api.PROFILE, params, headers, (res) => {
            if (res.meta.success) {
                this.setState({
                    userInfo: res.data
                })
            }

        })
    }
    componentDidMount() {
        this.getUserInfo()
        this.modifyUserInfoListener = DeviceEventEmitter.addListener('修改成功', () => this.getUserInfo());
    }
    componentWillUnmount() {
        this.modifyUserInfoListener.remove();

    }
    loginOut() {

        Alert.alert('提示',
            '确定退出此账户?',
            [
                {
                    text: '确定', onPress: () => {
                        // global.token = null;
                        // global.userId = null;
                        // global.weatherStationOrgId=null;
                        storage.remove({
                            key: 'loginInfo',
                        })
                            .then(
                            InteractionManager.runAfterInteractions(() => {
                                const resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({ routeName: 'Login' })
                                    ]
                                })
                                this.props.navigation.dispatch(resetAction);
                            })
                            );

                    }
                },
                { text: '取消', onPress: () => { } }
            ])

    }
    render() {
        // console.info(this.state.userInfo)
        return (
            <View style={styles.container}>
                <View style={[styles.userWrapper, styles.marginBottom]}>
                    <Image style={styles.touxPic} source={require('./../../imgs/userCenter/user.png')}></Image>
                    <TouchableOpacity
                        activeOpacity={.6}
                        onPress={() => this.props.navigation.navigate('UserInfo',
                            {
                                title: '个人信息',
                                userInfo: this.state.userInfo,
                            })
                        }>
                        <View style={styles.userRightText}>
                            <Text style={styles.trueNameText}>{(this.state.userInfo) ? this.state.userInfo.realName : ''}</Text>

                            <View style={styles.info}>
                                <Text style={styles.infoTip}>个人信息</Text>
                                <Icon style={styles.arrowIcon} name='angle-right' size={18} color="#fff"></Icon>
                            </View>

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[rowStyle.mineWrapper, styles.marginBottom]}>
                    <TouchableOpacity onPress={() => /*this.props.navigation.navigate('Msg', { title: '我的信息' })*/{}}>
                        <View style={rowStyle.myItem}>
                            <View style={rowStyle.myItemLeft}>
                                <Icon style={rowStyle.tipIcon} name='comment-o' size={18} color={theme.theme}></Icon>
                                <Text style={rowStyle.itemTip}>我的消息</Text>
                            </View>
                            <View style={rowStyle.myItemRight}>
                                <Text style={rowStyle.itemTip}></Text>
                                <Icon style={rowStyle.arrowIcon} name='angle-right' size={18} color="#ccc"></Icon>

                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => /*this.props.navigation.navigate('Myprofit', { title: '我的收益' })*/{}}>
                        <View style={[rowStyle.myItem, rowStyle.noBorerBottom]}>
                            <View style={rowStyle.myItemLeft}>
                                <Icon style={rowStyle.tipIcon} name='rmb' size={18} color={theme.theme}></Icon>
                                <Text style={rowStyle.itemTip}>我的收益</Text>
                            </View>
                            <View style={rowStyle.myItemRight}>
                                <Text style={rowStyle.itemTip}></Text>
                                <Icon style={rowStyle.arrowIcon} name='angle-right' size={18} color="#ccc"></Icon>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[rowStyle.mineWrapper, styles.systemWrapper]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ModifyPassword', { title: '修改密码' })}>
                        <View style={rowStyle.myItem}>
                            <View style={rowStyle.myItemLeft}>
                                <Icon style={rowStyle.tipIcon} name='key' size={18} color={theme.theme}></Icon>
                                <Text style={rowStyle.itemTip}>修改密码</Text>
                            </View>
                            <View style={rowStyle.myItemRight}>
                                <Text style={rowStyle.itemTip}></Text>
                                <Icon style={rowStyle.arrowIcon} name='angle-right' size={18} color="#ccc"></Icon>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        var url = 'tel:4000832531';
                        Linking.canOpenURL(url).then(supported => {
                            if (supported) {
                                Linking.openURL(url);
                            } else {
                                // console.log('无法打开该URI: ' + url);
                            }
                        })
                    }}>
                        <View style={rowStyle.myItem}>
                            <View style={rowStyle.myItemLeft}>
                                <Icon style={rowStyle.tipIcon} name='phone' size={18} color={theme.theme}></Icon>
                                <Text style={rowStyle.itemTip}>联系客服</Text>
                            </View>
                            <View style={rowStyle.myItemRight}>
                                <Text style={rowStyle.itemTip}></Text>
                                <Text style={{ color: '#c0c0c0', paddingRight: 10 }}>400-083-2531</Text>
                                <Icon style={rowStyle.arrowIcon} name='angle-right' size={18} color="#ccc"></Icon>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('DevicesConfg', { title: '我的设置' })}>
                    <View style={[rowStyle.myItem, rowStyle.noBorerBottom]}>
                        <View style={rowStyle.myItemLeft}>
                            <Icon style={rowStyle.tipIcon} name='cog' size={18} color={theme.theme}></Icon>
                            <Text style={rowStyle.itemTip}>我的设置</Text>
                        </View>
                        <View style={rowStyle.myItemRight}>
                            <Text style={rowStyle.itemTip}></Text>
                            <Icon style={rowStyle.arrowIcon} name='angle-right' size={18} color="#ccc"></Icon>
                        </View>
                    
                    </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.btnWrapper}>
                    <Button
                        btnStyle={styles.loginOutBtn}
                        btnTextStyle={styles.btnTip}
                        onPress={() => this.loginOut()}
                        title='退出'>
                    </Button>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    marginBottom: {
        marginBottom: 10
    },
    userWrapper: {
        // height:screen.height*.1,
        backgroundColor: theme.theme,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingVertical: 20
    },
    touxPic: {
        width: 48,
        height: 48
    },
    userRightText: {
        paddingLeft: 12
    },
    trueNameText: {
        color: '#fff'
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoTip: {
        color: '#fff',
        paddingRight: 8
    },
    btnWrapper: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    loginOutBtn: {
        marginHorizontal: 6,
        marginBottom: 8,
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: theme.theme
    },
    btnTip: {
        textAlign: 'center',
        color: '#fff'
    }
});

//make this component available to the app
export default MineScene;
