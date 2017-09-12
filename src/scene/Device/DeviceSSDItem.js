import React, { Component } from 'react';
import {
    Alert,
    StyleSheet,
    View,
    Text,
    Image,
    Slider,
    TouchableHighlight
} from 'react-native';
import api from '../../api';
import { Network, toastShort } from '../../utils';
import { DeviceIcon } from '../../common/Normal';
import { theme,screen } from '../../common';
import {setSpText,scaleSize} from '../../common/scale';
const styles = StyleSheet.create({
    itemStyle: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 4,
        backgroundColor: '#fff'
    },
    itemTopStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    deviceName: {
        fontSize:setSpText(theme.normalFontSize),
        color: '#222'

    },
    deviceStatus: {
        fontSize:setSpText(theme.normalFontSize),
        color: '#05b8a5'
    },
    sliderWrapper: {
        marginTop: 10
    },
    slider: {

    },
})
export default class DeviceSSDItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        }
    }
    componentDidMount() {
        const {rowData, rowID, orgId} = this.props;
        this.setState({
            value: rowData.VALUE
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.rowData !== this.props.rowData) {
            this.setState({
                value: nextProps.rowData.VALUE
            })
        }
        return true
    }
    deviceOperate(value,rowData,orgId,token){
        if(rowData.VALUE !=='ERROR'){

        }else{
            return
        }
        Alert.alert(
            '提示',
            '确定将'+rowData.DEVICE_NAME+'开启'+value+'?',
            [
              {text: '确定', onPress: () =>{
                    let headers={
                        'X-Token':token,
                        'Content-Type':'application/json'
                    };
                    let params={"deviceId": rowData.DEVICE_ID,"regionId": orgId,"status": value};
                    Network.postJson(api.HOST+api.DEVICES_UPDATE,params, headers,(res)=>{
                        if(res.meta.success){
                        this.setState({
                            value:value
                        });
                    }else{
                        toastShort(res.meta.message);
                    }
                })
              }},
             {text:'取消',onPress:()=>{
                this.setState({
                    value:rowData.VALUE    
                });
             }} 
            ]
          )
        }
    
    render() {
        const {rowData, rowID, orgId} = this.props;
        return (
            <View key={rowID} style={styles.itemStyle}>
                <View style={styles.itemTopStyle}>
                    <Text style={styles.deviceName}>{rowData.DEVICE_NAME}</Text>
                    <Text style={styles.deviceStatus}>{this.state.value}%</Text>
                </View>
                <View style={styles.sliderWrapper}>
                    <Slider style={styles.slider}
                        ref='slider'
                        maximumValue={100}
                        minimumValue={0}
                        maximumTrackTintColor={'#23c884'}
                        step={1}
                        value={parseInt(this.state.value)}
                        onValueChange={(value)=>this.setState({value:value})}
                        onSlidingComplete={(value) => this.deviceOperate(value,rowData,orgId,token)}
                    ></Slider>
                </View>

            </View>
        )
    }
}