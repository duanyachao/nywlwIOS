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
export default class Bacth extends Component {
    constructor(props) {
        super(props)
        this.state = {
            batchs: null,
            batch:null,
            biologyInId:null,
            batchIndex:null
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const {callbackBacth} = this.props;
        if (nextProps.orgId !== this.props.orgId) {
            // this.setState({
            //     batchIndex:null,
            //     batch:null    
            // })
            Picker.hide()
            let headers = {
                'X-Token': token
            };
            let params = { "orgId": nextProps.orgId };
            Network.get(api.HOST + api.BATCH, params, headers, (res) => {
                if (res.meta.success && res.data.length > 0) {
                    this.setState({
                        batchs: res.data,
                        batch:res.data[0].yjcode,
                        batchIndex:0,
                        biologyInId:res.data[0].id
                    })
                } else {
                    this.setState({
                        batchs: null,
                        batch:null,
                        batchIndex:null,
                        biologyInId:null
                    })
                }
            callbackBacth(this.state.batch,this.state.biologyInId);    
            })
        }
        return true
    }
    componentDidMount() {
        this.pickerListener = DeviceEventEmitter.addListener('返回键', () => Picker.hide());
    }
    componentWillUnmount(){
        Picker.hide()
        this.pickerListener.remove();
    }
    selectBtach() {
        let batchLists = [];
        for (var index = 0; index < this.state.batchs.length; index++) {
            batchLists.push(this.state.batchs[index].yjcode)

        }
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText:'取消',
            pickerTitleText:'选择批次',
            pickerToolBarFontSize:setSpText(14),
            pickerFontSize:setSpText(14),
            pickerData: batchLists,
            selectedValue:[(this.state.batchIndex)?batchLists[this.state.batchIndex]:batchLists[0]],
            onPickerConfirm: batch => {
                let biologyInId,batchIndex;
                const {callbackBacth} = this.props;
                this.state.batchs.forEach(function(element,index) {
                    if(element.yjcode==batch.toString()){
                        biologyId=element.id;
                        batchIndex=index;
                        this.setState({
                            batchIndex:batchIndex,
                            batch:element.yjcode,
                            biologyInId:biologyId    
                        })
                    }
                }, this);
                callbackBacth(this.state.batch,this.state.biologyInId); 
            }

        });
        Picker.show();
    }
    render() {
        const batchs = this.state.batchs;
        const batch=this.state.batch;
        return (
            <View style={pickerStyle.container}>
                <View style={pickerStyle.pickerTip}>
                    <Icon name='list' size={setSpText(theme.pcikerTipIconSize)} color={theme.iconColor}></Icon>
                    <Text style={pickerStyle.pickerTipText}>生产批次</Text>
                </View>
                {(batchs && batchs.length !== 0) ?
                    <TouchableHighlight
                        underlayColor="rgb(255, 255,255)"
                        onPress={() => this.selectBtach()}>
                        <View style={pickerStyle.picker}>
                            <Text style={pickerStyle.pickered}>{batch}</Text>
                            <Icon name='angle-right' size={setSpText(theme.pcikerRightIconSize)} color='#8c8c8c'></Icon>
                        </View>
                    </TouchableHighlight> : <View style={pickerStyle.nopicker}><Text style={pickerStyle.nopickerText}>暂无批次</Text></View>}

            </View>
        );
    }
}
