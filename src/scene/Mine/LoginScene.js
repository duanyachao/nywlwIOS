//import liraries
import React, { Component } from 'react';
import {
    BackHandler,
    DeviceEventEmitter,
    Image,
    PixelRatio,
    View,
    Text,
    TextInput,
    StyleSheet,
    InteractionManager
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { screen, system } from '../../common';
import { Button } from '../../components';
import api from '../../api';
import { Network, toastShort } from '../../utils';
import { NavigationActions } from 'react-navigation';
// create a component
export default class LoginScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            // token: null,
            loginName: null,
            passWord: null,
            phoneNum: null,
            // userId: null
        }
    }
    static navigationOptions = ({
        header: null
    })
    goRootScene() {
        // global.userId = this.state.userId;
        // global.token = this.state.token;
        InteractionManager.runAfterInteractions(() => {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Tab' })
                ]
            })
            this.props.navigation.dispatch(resetAction);
        })

    }
    loginAction() {
        if (!this.state.loginName) {
            toastShort('用户名不能为空');
            return;
        }
        if (!this.state.passWord) {
            toastShort('密码不能为空');
            return;
        }
        if (!this.state.phoneNum) {
            toastShort('手机号不能为空');
            return;
        }
        if (this.state.passWord.length<6) {
            this.setState({
                passWord: null
            })
            toastShort('密码至少6位,请重新输入');
            return;
        }
        var regphoneNum = /^1(3[0-9]|4[57]|5[0-9]|7[0135678]|8[0-9])\d{8}$/;
        if (!regphoneNum.test(this.state.phoneNum)) {
            this.setState({
                phoneNum: null
            })
            toastShort('手机号不正确，请重新输入');
            return false
        }
        this.setState({
            visible: !this.state.visible
        })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        let params = { 'loginName': this.state.loginName, 'password': this.state.passWord, 'phoneNum': this.state.phoneNum };
        Network.postJson(api.HOST + api.DO_LOGIN, params, headers, (res) => {
            if (res.meta && res.meta.success) {
                // console.info(res.data)
                // this.setState({
                //     token: res.data.token,
                //     userId: res.data.user.userId,
                //     loginName: this.state.loginName,
                //     passWord: this.state.passWord,
                //     phoneNum: this.state.phoneNum,
                // });
                //请求成功后将token值保存到本地后，再跳转到主界面
                storage.save({
                    key: 'loginInfo',
                    data: {
                        // token: res.data.token,
                        loginName: this.state.loginName,
                        passWord: this.state.passWord,
                        phoneNum: this.state.phoneNum,
                        // userId: this.state.userId
                    }
                })
                global.userId = res.data.user.userId;
                global.token = res.data.token;
                global.weatherStationOrgId=res.data.user.orgId;
                global.bTypeName='';
                storage.load({
                    key:'loginInfo'
                }).then((ret)=>{
                    let headers = {
                        'X-Token': token
                    };
                    let params = { "userId": userId };
                    Network.get(api.HOST + api.PROFILE, params, headers, (res) => {
                        if (res.meta.success) {
                            storage.save({
                                key:'userInfo',
                                data:res.data
                            })
                            bTypeName=res.data.bTypeName;
                            // console.info(bTypeName)
                        }
            
                    })
                })
                .catch(err => {
                    // 如果没有找到数据且没有sync方法，
                    // 或者有其他异常，则在catch中返回
                    console.warn(err.message);
                    switch (err.name) {
                      case 'NotFoundError':
                        // TODO;
                        break;
                      case 'ExpiredError':
                        // TODO
                        break;
                    }
                })
                .then(()=>{
                    DeviceEventEmitter.emit('loginSuccess',this.state.loginName)
                    this.goRootScene()
                });

            } else {
                toastShort('登录失败，请重新尝试');
                // console.info(res)
            }
            this.setState({
                visible: !this.state.visible
            });
        });
    }
    componentDidMount() {
        // console.info(storage)
        // 读取本地数据判断用户是否已经登录,
        storage.load({
            key: 'loginInfo',
        }).then(ret => {
            if (ret) {
                this.setState({
                    loginName: ret.loginName,
                    passWord: ret.passWord,
                    phoneNum: ret.phoneNum
                })
                this.loginAction()    
            } else {
                    
            }  
        }).catch(err => {
            // console.info(err)
        })
    }
    render() {
        return (
            <Image source={require('../../imgs/logre/img_dl_bg.png')} style={styles.container}>
                <Spinner visible={this.state.visible} textContent={"登录中..."} textStyle={{ color: '#FFF', fontSize: 16 }}></Spinner>
                <Image style={styles.logo} source={require('../../imgs/logre/img_dl_logo.png')}></Image>
                <View style={styles.loginForm}>
                    <View style={styles.textInput}>
                        <View style={styles.iconWrapper}>
                            <Icon name='user' size={24} color="#fff"></Icon>
                        </View>
                        <TextInput style={styles.textStyle}
                            placeholder="账号/用户名"
                            placeholderTextColor="#fff"
                            underlineColorAndroid="transparent"
                            ref='loginName'
                            defaultValue={(this.state.loginName) ? this.state.loginName : ''}
                            onChangeText={(text) => this.setState({ loginName: text })}>
                        </TextInput>
                    </View>
                    <View style={[styles.textInput]}>
                        <View style={styles.iconWrapper}>
                            <Icon name='lock' size={24} color="#fff"></Icon>
                        </View>
                        <TextInput style={styles.textStyle}
                            placeholder="密码"
                            placeholderTextColor="#fff"
                            underlineColorAndroid="transparent"
                            secureTextEntry={true}
                            ref='password'
                            defaultValue={(this.state.passWord) ? this.state.passWord : ''}
                            onChangeText={(text) => this.setState({ passWord: text })}>
                        </TextInput>
                    </View>
                    <View style={[styles.textInput]}>
                        <View style={styles.iconWrapper}>
                            <Icon name='mobile' size={24} color="#fff"></Icon>
                        </View>
                        <TextInput style={styles.textStyle}
                            placeholder="手机号"
                            placeholderTextColor="#fff"
                            underlineColorAndroid="transparent"
                            keyboardType='numeric'
                            ref='phoneNum'
                            defaultValue={(this.state.phoneNum) ? this.state.phoneNum : ''}
                            onChangeText={(text) => this.setState({ phoneNum: text })}>
                        </TextInput>
                    </View>
                    <Button btnStyle={styles.btnStyle} btnTextStyle={styles.btnTextStyle} title='登录' onPress={() => this.loginAction()}></Button>

                </View>
                <View style={styles.copyRight}>
                    <Image source={require('../../imgs/logre/img_dl_gsmc.png')}></Image>
                </View>
            </Image>

        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: screen.width,
        height: screen.height
    },
    logo: {
        marginTop: 55,
        alignSelf: 'center'
    },
    loginForm: {
        paddingHorizontal: 20,
        paddingTop: 48
    },
    textInput: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderBottomWidth:screen.onePixel,
        borderBottomColor: 'rgba(255,255,255,.6)',

    },
    iconWrapper:{
        justifyContent:'center',
        width:36,
        alignItems: 'center',
    },
    textStyle: {
        flex: 1,
        color: '#fff',

    },
    btnTextStyle: {
        color: 'rgb(55,179,117)',

    },
    btnStyle: {
        paddingVertical:10,
        alignItems: 'center',
        marginTop: 48,
        backgroundColor: '#fff',
        borderRadius: 6,

    },
    copyRight: {
        marginBottom: 25,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    }

});
