//import liraries
import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../common';
import { pickerStyle } from '../common/theme';
import Picker from 'react-native-picker';
import api from '../api';
import { Network, toastShort } from '../utils';
import {setSpText,scaleSize} from '../common/scale';
// create a component
export default class Dayage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dayAge: null,
            selectedIndex:null
            
        }
    }
    componentDidMount() {
        this.pickerListener = DeviceEventEmitter.addListener('返回键', () => Picker.hide());
    }
    componentWillUnmount(){
        Picker.hide()
        this.pickerListener.remove();
    }
    shouldComponentUpdate(nextProps, nextState) {
        const {callbackDayage} = this.props;
        if (nextProps.batch !== this.props.batch) {
            Picker.hide()
            let headers = {
                'X-Token': token,
                'Content-Type': 'application/json'
            };
            let params = { "orgId": this.props.orgId, "yjCode": nextProps.batch };
            Network.postJson(api.HOST + api.DAYAGES, params, headers, (res) => {
                if (res.meta.success && res.data) {
                    this.setState({
                        dayAge: res.data,
                        selectedIndex:res.data
                    });
                } else {
                    this.setState({
                        dayAge: null,
                        selectedIndex:null
                    });
                
                }
                callbackDayage(this.state.dayAge);
            })
        }
        return true
    }
    selectDayAge() {
        let dayageLists = [];
        for (var index = this.state.dayAge; index >= 1; index--) {
            dayageLists.push(index)
        }
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText:'取消',
            pickerTitleText:'选择日龄',
            pickerToolBarFontSize:setSpText(theme.normalFontSize),
            pickerFontSize:setSpText(theme.normalFontSize),
            pickerData: dayageLists,
            selectedValue:[(this.state.selectedIndex)],
            onPickerConfirm: dayage => {
                const {callbackDayage} = this.props;
                dayageLists.forEach(function(element,index) {
                    if(element==dayage){
                        this.setState({
                            selectedIndex:(dayageLists.length-index) 
                        })
                    }
                }, this);
                callbackDayage(this.state.selectedIndex);
            }

        });
        Picker.show();
        
        
    }
    render() {
        return (
            <View style={pickerStyle.container}>
                <View style={pickerStyle.pickerTip}>
                    <Icon name='calendar' size={theme.pcikerTipIconSize} color={theme.iconColor}></Icon>
                    <Text style={pickerStyle.pickerTipText}>日龄</Text>
                </View>
                {(this.state.selectedIndex) ?
                    <TouchableHighlight
                        underlayColor="rgb(255, 255,255)"
                        onPress={() => this.selectDayAge()}>
                        <View style={pickerStyle.picker}>
                            <Text style={pickerStyle.pickered}>{this.state.selectedIndex}</Text>
                            <Icon name='angle-right' size={theme.pcikerRightIconSize} color='#8c8c8c'></Icon>
                        </View>
                    </TouchableHighlight> : <View style={pickerStyle.nopicker}><Text style={pickerStyle.nopickerText}>暂无日龄</Text></View>}

            </View>
        );
    }
}
