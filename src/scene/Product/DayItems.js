//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from '../../components';
import { screen,theme } from '../../common';
import api from '../../api';
import { Network, toastShort } from '../../utils';
// create a component
var avgWeight, dayDeaths, dayFodders, feedMeatRate, drugUsage;
export default class dayItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editable: false,
            editText: null,
            type: null,
            dayDieNumer: null,
            dayFeed: null,
            averageWeight: null,
            feedRate: null,
            remark: null
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                editable: false,
                editText: null,
                type: null,
            })
        }
        return true
    }
    addAction(biologyInId, dayAge, id) {
        let averageWeight, dayDeaths, dayFodders, drugUsage, feedMeatRate;
        const {callRefreash} = this.props;

        var regZZS = /^\d+$/;
        var regZXS = /^\d+(\.\d+)?$/;
        if (!regZZS.test(this.state.dayDieNumer)) {
            this.refs.dayDie.clear();
            toastShort('死亡数只能为正整数');
            return false
        } else {
            dayDeaths = parseInt(this.state.dayDieNumer)
        }
        if (!regZZS.test(this.state.dayFeed)) {
            this.refs.dayFeed.clear();
            toastShort('用料量只能为正整数');
            return false
        } else {
            dayFodders = parseInt(this.state.dayFeed)
        }
        if (!regZXS.test(this.state.averageWeight)) {
            toastShort('均重只能为正数');
            this.refs.averageWeight.clear();
            return false
        } else {
            averageWeight = parseFloat(this.state.averageWeight)
        }
        if (!regZXS.test(this.state.feedRate)) {
            this.refs.feedRate.clear();
            toastShort('料肉比只能为正数');
            return false
        } else {
            feedMeatRate = parseFloat(this.state.feedRate)
        }
        drugUsage = this.state.remark;
        let headers = {
            'X-Token': token,
            'Content-Type': 'application/json'
        };
        // console.info(this.state.type, averageWeight, biologyInId, dayAge, dayDeaths, dayFodders, drugUsage, feedMeatRate, id)
        let params = {
            "actType": this.state.type,
            "avgWeight": averageWeight,
            "biologyInId": biologyInId,
            "dayAge": dayAge,
            "dayDeaths": dayDeaths,
            "dayFodders": dayFodders,
            "drugUsage": drugUsage,
            "feedMeatRate": feedMeatRate,
            "id": id
        }
        Network.postJson(api.HOST + api.DAYUPDATE, params, headers, (res) => {
            if (res.meta.success) {
                callRefreash(biologyInId, dayAge);
                toastShort('录入成功');
            } else {
                toastShort('录入失败，请重新录入');
            }
        });
    }
    render() {
        const {data, biologyInId, dayAge, actType, id} = this.props;
        return (
            <View style={styles.container}>
                {(data) ?
                    <View style={styles.content}>
                        <View style={styles.lrfsTip}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>录入方式:</Text>
                                <Text style={{ color: 'green', paddingLeft: 6 }}>{this.state.editText}</Text>
                            </View>

                            <View style={styles.lrfsTipBtns}>
                                <Button
                                    btnStyle={[styles.lrfsTipBtnStyle, styles.addBtnStyle]}
                                    btnTextStyle={styles.btnTextStyle}
                                    title={'新增'}
                                    onPress={() => this.setState({
                                        editable: true,
                                        editText: '新增',
                                        type: 1,
                                        dayDieNumer: 0,
                                        dayFeed: 0,
                                        averageWeight: 0,
                                        feedRate: 0,
                                        remark: '无'
                                    })}>
                                </Button>
                                <Button
                                    btnStyle={[styles.lrfsTipBtnStyle, styles.modifyBtnStyle, (actType == 1) ? styles.btnDisable : null]}
                                    disabled={(actType == 1) ? true : false}
                                    btnTextStyle={styles.btnTextStyle}
                                    title={'修改'}
                                    onPress={() => this.setState({
                                        editable: true,
                                        editText: '修改',
                                        type: 0,
                                        dayDieNumer:data.dayDieNumer,
                                        dayFeed:data.dayFeed,
                                        averageWeight:data.averageWeight,
                                        feedRate:data.feedRate,
                                        remark:data.remark,
                                    })}>
                                </Button>
                            </View>
                        </View>
                        <View style={styles.dayItems}>
                            <View style={styles.dayItem}>
                                <Text style={styles.dayItemLeftTip}>当日死亡数:</Text>
                                <Text style={styles.dayItemText}>{(actType == 1) ? 0 : data.dayDieNumer} 只</Text>
                                {(this.state.editable) ?
                                    <TextInput
                                        ref='dayDie'
                                        underlineColorAndroid="transparent"
                                        keyboardType="numeric"
                                        style={styles.textInput}
                                        defaultValue={`${this.state.dayDieNumer}`}
                                        onChangeText={(text) => this.setState({ dayDieNumer: text })}>
                                    </TextInput> : null}

                            </View>
                            <View style={styles.dayItem}>
                                <Text style={styles.dayItemLeftTip}>当日用料量:</Text>
                                <Text style={styles.dayItemText}>{(actType == 1) ? 0 : data.dayFeed} kg</Text>
                                {(this.state.editable) ?
                                    <TextInput
                                        ref='dayFeed'
                                        underlineColorAndroid="transparent"
                                        keyboardType="numeric"
                                        style={styles.textInput}
                                        defaultValue={`${this.state.dayFeed}`}
                                        onChangeText={(text) => this.setState({ dayFeed: text })}>
                                    </TextInput> : null}
                            </View>
                            <View style={styles.dayItem}>
                                <Text style={styles.dayItemLeftTip}>均重:</Text>
                                <Text style={styles.dayItemText}>{(actType == 1) ? 0 : data.averageWeight} kg</Text>
                                {(this.state.editable) ?
                                    <TextInput
                                        ref='averageWeight'
                                        underlineColorAndroid="transparent"
                                        keyboardType="numeric"
                                        style={styles.textInput}
                                        defaultValue={`${this.state.averageWeight}`}
                                        onChangeText={(text) => this.setState({ averageWeight: text })}>
                                    </TextInput> : null}
                            </View>
                            <View style={styles.dayItem}>

                                <Text style={styles.dayItemLeftTip}>料肉比:</Text>
                                <Text style={styles.dayItemText}>{(actType == 1) ? 0 : data.feedRate}</Text>
                                {(this.state.editable) ?
                                    <TextInput
                                        ref='feedRate'
                                        underlineColorAndroid="transparent"
                                        keyboardType="numeric"
                                        style={styles.textInput}
                                        defaultValue={`${this.state.feedRate}`}
                                        onChangeText={(text) => this.setState({ feedRate: text })}>
                                    </TextInput> : null}
                            </View>
                            <View style={[styles.dayItem, styles.dayItemRemark]}>
                                <Text style={[styles.dayItemLeftTip, styles.remarkTip]}>用药情况:</Text>
                                <View style={{ flex: 1 }}>
                                    {(this.state.editable) ?
                                        <TextInput
                                            underlineColorAndroid="transparent"
                                            keyboardType="default"
                                            style={[styles.remarkTextInput]}
                                            multiline={true}
                                            maxLength={100}
                                            defaultValue={this.state.remark}
                                            onChangeText={(text) => this.setState({ remark: text })}>
                                        </TextInput> :
                                        <Text style={styles.remarkText}>{(actType==1)?'无':data.remark}</Text>}

                                </View>
                            </View>
                        </View>
                        {(this.state.editable) ?
                            <View style={styles.saveBtnGroup}>
                                <Button
                                    btnStyle={[styles.lrfsTipBtnStyle, styles.updateBtnStyle]}
                                    btnTextStyle={styles.saveBtnTextStyle}
                                    title='保存'
                                    onPress={() => this.addAction(biologyInId, dayAge, id)}
                                >
                                </Button>
                                <Button
                                    btnStyle={[styles.lrfsTipBtnStyle, styles.cancelBtnStyle]}
                                    btnTextStyle={styles.saveBtnTextStyle}
                                    title='取消' onPress={() => this.setState({ editable: false,editText:null })}>
                                </Button>
                            </View>
                            : null}
                    </View>
                    : <View style={theme.nodata}><Text>无数据</Text></View>}
            </View>
        )


    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    lrfsTip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 6,
        alignItems: 'center',
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: screen.onePixel,
    },
    lrfsTipBtns: {
        flexDirection: 'row'
    },
    lrfsTipBtnStyle: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 6

    },
    btnDisable: {
        backgroundColor: '#ccc'
    },
    modifyBtnStyle: {
        backgroundColor: 'red'
    },
    btnTextStyle: {
        color: '#fff'
    },
    addBtnStyle: {
        backgroundColor: 'green'
    },
    dayItem: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: screen.onePixel,

    },
    dayItemLeftTip: {
        width: 90,
        textAlign: 'justify'
    },
    dayItemText: {
        width: 120,
        textAlign: 'center'
    },
    textInput: {
        position: 'absolute',
        width: 100,
        right: 10,
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 0,
        paddingLeft: 6
    },
    dayItemRemark: {
        height: 60,
    },
    remarkTip: {
    },
    remarkText: {
    },
    remarkTextInput: {
        backgroundColor: '#eee',
    },
    saveBtnGroup: {
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    updateBtnStyle: {
        backgroundColor: 'blue'
    },
    cancelBtnStyle: {
        backgroundColor: 'green'
    },
    saveBtnTextStyle: {
        color: '#fff'
    },
});