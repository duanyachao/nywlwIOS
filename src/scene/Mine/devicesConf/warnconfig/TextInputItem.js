import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TextInput,DeviceEventEmitter } from 'react-native'
import { Network, toastShort } from '../../../../utils'
import api from '../../../../api'
import { screen, theme } from '../../../../common'
import {Button} from '../../../../components'
import pxToDp from '../../../../common/pxToDp'

export default class TextInputItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            highAlarmValue:'',
            lowAlarmValue:''
        }
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.alarm !== this.props.alarm) {
            let alarm=nextProps.alarm;
            this.setState({
                highAlarmValue:(alarm)?alarm.highAlarmValue:'',
                lowAlarmValue:(alarm)?alarm.lowAlarmValue:''    
            })    
        }
        return true
    }
    render() {
        const {highAlarmValue,lowAlarmValue}=this.state;
        const {data,editable,alarm,}=this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.eclTip}>{data.name}</Text>
                <View style={styles.conetList}>
                <View style={styles.itemContent}>
                        <Text>上限值</Text>
                        <TextInput
                            style={[styles.textInputStyle, (editable) ? styles.editableStyle : styles.unEditableStyle]}
                            maxLength={4}
                            editable={editable}
                            placeholder="上限值"
                            placeholderTextColor="#ccc"
                            underlineColorAndroid="transparent"
                            keyboardType='numeric'
                            defaultValue={(highAlarmValue)?`${highAlarmValue}`:''}
                            onChangeText={(text) => {
                                this.setState({
                                    highAlarmValue:text
                                })
                            }}
                        />
                    </View>
                <View style={styles.itemContent}>
                        <Text>下限值</Text>
                        <TextInput
                            style={[styles.textInputStyle, (editable) ? styles.editableStyle : styles.unEditableStyle]}
                            maxLength={4}
                            editable={editable}
                            placeholder="下限值"
                            placeholderTextColor="#ccc"
                            underlineColorAndroid="transparent"
                            keyboardType='numeric'
                            defaultValue={(lowAlarmValue)?`${lowAlarmValue}`:''}
                            onChangeText={(text) => {
                                this.setState({
                                    lowAlarmValue:text
                                })
                            }}
                        />
                    </View>
                </View>
                
            </View>
            )
    }
}
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:6,
    },
    eclTip:{
    },
    conetList:{
        flexDirection:'row',
    },
    itemContent:{
        flexDirection:'row',
        alignItems:'center' 
    },
    textInputStyle: {
        textAlign:'center',
        marginHorizontal: 5,
        fontSize: 14,
        width: pxToDp(100),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.theme,
    },
    setBtnsStyle:{
        marginVertical:4,
        flexDirection:'row',
        justifyContent:'flex-end',
    },
    deviceSetBtnStyle:{
        paddingHorizontal:15,
        paddingVertical:10,
        marginHorizontal:5,
        borderRadius:5  
    },
    saveBtnStyle:{
        backgroundColor:'#f57831'
    },
    modifyBtnStyle:{
        backgroundColor:'#289fff'
    },
    deviceSetBtnTxtStyle:{
        color:'#ffffff',
        fontSize:14   
    },
    editableStyle:{
        backgroundColor:'transparent'
    },
    unEditableStyle:{
        backgroundColor:'#eee'
    },
})
