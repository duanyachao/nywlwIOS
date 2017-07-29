//import liraries
import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    View,
    InteractionManager,
    TouchableOpacity,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { screen, theme } from '../../common';
import { rowStyle } from '../../common/theme';
import { Button } from '../../components';
import { Network, toastShort } from '../../utils';
import api from '../../api';
// create a component

class UserInfoScene extends Component {

    constructor(props) {
        super(props)
        this.state = {
            editable: false,
            realName: null,
            phoneNum: null,
            userInfoId: null,
            userId:null
        }
    }
    componentDidMount() {
        const {state,goBack} = this.props.navigation;
        console.info(state)
        this.setState({
            realName: state.params.userInfo.realName,
            phoneNum: state.params.userInfo.phoneNum,
            userInfoId: state.params.userInfo.userInfoId,
            userId:state.params.userId
        })
    }
    updateUserInfo() {
        if (!this.state.realName) {
            toastShort('姓名不能为空')
            return false
        }
        if (!this.state.phoneNum) {
            toastShort('手机号不能为空')
            return false
        }
        var regphoneNum = /^1(3[0-9]|4[57]|5[0-9]|7[0135678]|8[0-9])\d{8}$/;
        if (!regphoneNum.test(this.state.phoneNum)) {
            this.setState({
                phoneNum: null
            })
            toastShort('手机号不正确，请重新输入');
            return false
        } else {
            let headers = {
                'X-Token': token,
                'Content-Type': 'application/json'
            };
            let params = { 'realName': this.state.realName, 'phoneNum': this.state.phoneNum, 'userInfoId': this.state.userInfoId };
            Network.postJson(api.HOST + api.USERINFOUPDATE, params, headers, (res) => {
                if (res.meta.success) {
                    toastShort('修改成功')
                    InteractionManager.runAfterInteractions(() => {
                        DeviceEventEmitter.emit('修改成功',);
                        this.props.navigation.goBack()
                    })
                }else{
                    toastShort('修改失败，请重试')
                    return false
                }

            })
        }

    }
    render() {
        const {state} = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={[rowStyle.mineWrapper, { marginTop: 10 }]}>
                    <View style={[rowStyle.myItem, { marginRight: 20 }]}>
                        <View style={rowStyle.myItemLeft}>
                            <Text style={rowStyle.itemTip}>姓    名</Text>
                        </View>
                        <View style={[rowStyle.myItemRight]}>
                            <TextInput
                                editable={this.state.editable}
                                ref='trueName'
                                underlineColorAndroid="transparent"
                                style={{ flex: 1 }}
                                defaultValue={this.state.realName}
                                onChangeText={(text) => this.setState({ realName: text })}>
                            </TextInput>
                        </View>
                    </View>
                    <View style={[rowStyle.myItem, rowStyle.noBorerBottom]}>
                        <View style={rowStyle.myItemLeft}>
                            <Text style={rowStyle.itemTip}>手机号</Text>
                        </View>
                        <View style={rowStyle.myItemRight}>
                            <TextInput
                                editable={this.state.editable}
                                ref='phoneNum'
                                keyboardType='numeric'
                                maxLength={11}
                                underlineColorAndroid="transparent"
                                style={{ flex: 1 }}
                                defaultValue={this.state.phoneNum}
                                onChangeText={(text) => this.setState({ phoneNum: text })}>
                            </TextInput>
                        </View>
                    </View>
                </View>
                {(this.state.editable) ?
                    <View style={styles.btnWrapper}>
                        <Button
                            btnStyle={styles.btnStyle}
                            btnTextStyle={styles.btnTip}
                            onPress={() => this.updateUserInfo()}
                            title='保存'>
                        </Button>
                        <Button
                            btnStyle={[styles.btnStyle, { backgroundColor: 'red' }]}
                            btnTextStyle={styles.btnTip}
                            onPress={() => this.setState({
                                editable: false,
                                trueName: state.params.userInfo.trueName,
                                phoneNum: state.params.userInfo.phoneNum
                            })
                            }
                            title='取消'>
                        </Button>
                    </View> :
                    <View style={styles.btnWrapper}>
                        <Button
                            btnStyle={styles.btnStyle}
                            btnTextStyle={styles.btnTip}
                            onPress={() => this.setState({ editable: true })}
                            title='修改'>
                        </Button>
                    </View>}

            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnWrapper: {
        marginTop: 10,
    },
    btnStyle: {
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
export default UserInfoScene;
