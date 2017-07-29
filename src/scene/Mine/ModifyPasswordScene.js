//import liraries
import React, { Component } from 'react';
import { InteractionManager, View, Text, TextInput, StyleSheet } from 'react-native';
import { screen, system, theme } from '../../common';
import { Button } from '../../components';
import { Network, toastShort } from '../../utils';
import api from '../../api';
// create a component
class ModifyPasswordScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPWD: null,
            newPWD: null,
            renewPWD: null,
            focusCurrent: false,
            focusNewPWD: false,
            focusRenewPWD: false
        }
    }
    componentDidMount() {
    }
    updatePWD() {
        if (!this.state.currentPWD) {
            toastShort('当前密码不能为空')
            return false
        }
        if (!this.state.newPWD) {
            toastShort('新密码不能为空')
            return false
        }
        if (!this.state.renewPWD) {
            toastShort('确认密码不能为空')
            return false
        }
        if (this.state.currentPWD.length < 6 || this.state.newPWD.length < 6 || this.state.renewPWD.length < 6) {
            toastShort('密码小于6位，请重新输入')
            this.setState({
                currentPWD: null,
                newPWD: null,
                renewPWD: null,
            })
            return false
        }
        if (this.state.newPWD !== this.state.renewPWD) {
            toastShort('两次密码输入不一致，请重新输入')
            this.setState({
                renewPWD: null,
            })
        }
        storage.load({
            key: 'loginInfo',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            if (ret.passWord !== this.state.currentPWD) {
                toastShort('当前密码输入不正确，请重新输入')
                this.setState({
                    currentPWD: null,
                })
                return false
            } else {
                let headers = {
                    'X-Token': token,
                    'Content-Type': 'application/json'
                };
                let params = { 'newPwd': this.state.newPWD, 'pwd': this.state.currentPWD, 'reNewPwd': this.state.renewPWD };
                Network.postJson(api.HOST + api.MODIFYPWD, params, headers, (res) => {
                    console.info(res)
                    if (res.meta.success) {
                        toastShort('修改成功,请重新登录')
                        global.token = null;
                        global.userId = null;
                        storage.remove({
                            key: 'loginInfo'
                        }).then(
                            InteractionManager.runAfterInteractions(() => {
                                this.props.navigation.navigate('Login')
                            })
                            )
                    } else {
                        toastShort('修改失败，请重试')
                        this.setState({
                            currentPWD: null,
                            newPWD: null,
                            renewPWD: null,
                        })
                        return false
                    }

                })
            }
        }).catch(err => {
            // console.info(err)
        })


    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.modifyPasswordWrapper}>
                    <View style={styles.item}>
                        <Text style={styles.tipText}>当前密码:</Text>
                        <TextInput
                            style={[styles.textInputWrapper, { borderBottomColor: (this.state.focusCurrent) ? theme.theme : '#ccc' }]}
                            ref='current'
                            selectionColor={theme.theme}
                            secureTextEntry={true}
                            underlineColorAndroid="transparent"
                            value={this.state.currentPWD}
                            onFocus={() => this.setState({ focusCurrent: !this.state.focusCurrent })}
                            onBlur={() => this.setState({ focusCurrent: !this.state.focusCurrent })}
                            onChangeText={(text) => this.setState({ currentPWD: text })}>
                        </TextInput>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.tipText}>新密码:</Text>
                        <TextInput
                            style={[styles.textInputWrapper, { borderBottomColor: (this.state.focusNewPWD) ? theme.theme : '#ccc' }]}
                            ref='newPWD'
                            selectionColor={theme.theme}
                            secureTextEntry={true}
                            underlineColorAndroid="transparent"
                            value={this.state.newPWD}
                            onFocus={() => this.setState({ focusNewPWD: !this.state.focusNewPWD })}
                            onBlur={() => this.setState({ focusNewPWD: !this.state.focusNewPWD })}
                            onChangeText={(text) => this.setState({ newPWD: text })}>
                        </TextInput>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.tipText}>确认新密码:</Text>
                        <TextInput
                            style={[styles.textInputWrapper, { borderBottomColor: (this.state.focusRenewPWD) ? theme.theme : '#ccc' }]}
                            ref='renewPWD'
                            selectionColor={theme.theme}
                            secureTextEntry={true}
                            underlineColorAndroid="transparent"
                            value={this.state.renewPWD}
                            onFocus={() => this.setState({ focusRenewPWD: !this.state.focusRenewPWD })}
                            onBlur={() => this.setState({ focusRenewPWD: !this.state.focusRenewPWD })}
                            onChangeText={(text) => this.setState({ renewPWD: text })}>
                        </TextInput>
                    </View>
                    <Text style={styles.tip}>密码长度至少6位</Text>
                    <Button
                        btnStyle={styles.btnStyle}
                        btnTextStyle={styles.btnTip}
                        onPress={() => this.updatePWD()}
                        title='确定'>
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
    modifyPasswordWrapper: {
        padding: 15
    },
    item: {
        marginBottom: 8
    },
    tipText: {

    },
    textInputWrapper: {
        borderBottomWidth: screen.onePixel,
        // borderBottomColor:this.state.focusColor
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
    },
    tip: {
        color: '#999',
        fontSize: 12,
        marginBottom: 10
    }
});

//make this component available to the app
export default ModifyPasswordScene;
