import React, { Component } from 'react'
import { Text, View,StyleSheet } from 'react-native'
import { screen, theme } from '../../../../common'
import api from '../../../../api'
import {Network,toastShort  } from '../../../../utils'
import { Button } from '../../../../components'
import DurationItemConfig from './DurationItemConfig'
export default class DurationItem extends Component {
    constructor(props){
        super(props)
        this.state={
            orgId:null,
            showSetting:false
        }
    }
    render() {
        const {data,category,orgId}=this.props;
        // console.info(data)
        const {item,index}=data;
        return (
            <View key={index} style={styles.itemStyle}>
                <View style={styles.itemTop}>
                    <Text style={styles.deviceNameText}>{item.deviceName}</Text>    
                    {(category==3)?
                        <Button
                        btnStyle={[styles.deviceSetBtnStyle]}
                        btnTextStyle={styles.deviceSetBtnTxtStyle}
                        title='设置'
                        onPress={() => this.setState({ showSetting: !this.state.showSetting })} />:<View style={styles.noContent}></View>}
                </View>
                    
                {(!this.state.showSetting) ? null : <DurationItemConfig deviceData={item} orgId={orgId} />}
        </View>
        )
    }
}
const styles=StyleSheet.create({
    itemStyle: {
        paddingVertical:6,
        borderBottomColor: theme.bgGray2,
        borderBottomWidth: screen.onePixel,
        backgroundColor: '#fff',
    },
    itemTop:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    deviceNameText: {
        paddingLeft:10,
        fontSize: 14,
        color: '#222'
    },
    deviceSetBtnStyle:{
        padding:10,
        marginRight:15,
        backgroundColor:theme.theme,
        borderRadius:5  
    },
    deviceSetBtnTxtStyle:{
        color:'#ffffff',
        fontSize:14   
    },
    noContent:{
        paddingHorizontal:10,
        paddingVertical:20    
    }
})
