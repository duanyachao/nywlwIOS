//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../../common';
import {setSpText,scaleSize} from '../../common/scale';
// create a component
export default class ProductTotal extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const {totalData}=this.props;
        return (
            (totalData)?<View style={styles.totalStyle}>
                    <View style={styles.totalItemStyle}>
                        <View style={styles.totalItemLeftStyle}>
                            <Icon name='list' size={setSpText(theme.pcikerTipIconSize)} color={theme.iconColor}></Icon>
                            <Text style={styles.totalItemLeftTextStyle}>进鸡总数</Text>
                        </View>
                        <View style={styles.totalItemRightStyle}>
                            <Text style={styles.totalNumStyle}>{totalData.totalNumber}</Text>
                            <Text style={styles.unitStyle}>只</Text>
                        </View>
                    </View>
                    <View style={styles.totalItemStyle}>
                        <View style={styles.totalItemLeftStyle}>
                            <Icon name='list' size={setSpText(theme.pcikerTipIconSize)} color={theme.iconColor}></Icon>
                            <Text style={styles.totalItemLeftTextStyle}>总存栏数</Text>
                        </View>
                        <View style={styles.totalItemRightStyle}>
                            <Text style={styles.totalNumStyle}>{totalData.restNumber}</Text>
                            <Text style={styles.unitStyle}>只</Text>
                        </View>
                    </View>
                    <View style={styles.totalItemStyle}>
                        <View style={styles.totalItemLeftStyle}>
                            <Icon name='list' size={setSpText(theme.pcikerTipIconSize)} color={theme.iconColor}></Icon>
                            <Text style={styles.totalItemLeftTextStyle}>死亡总数</Text>
                        </View>
                        <View style={styles.totalItemRightStyle}>
                            <Text style={styles.totalNumStyle}>{totalData.totalDieNumber}</Text>
                            <Text style={styles.unitStyle}>只</Text>
                        </View>
                    </View>
                    <View style={styles.totalItemStyle}>
                        <View style={styles.totalItemLeftStyle}>
                            <Icon name='list' size={setSpText(theme.pcikerTipIconSize)}color={theme.iconColor}></Icon>
                            <Text style={styles.totalItemLeftTextStyle}>总用料量</Text>
                        </View>
                        <View style={styles.totalItemRightStyle}>
                            <Text style={styles.totalNumStyle}>{totalData.currentFeed}</Text>
                            <Text style={styles.unitStyle}>kg</Text>
                        </View>
                    </View>
                </View>
        :<View></View>
            );
    }
}

// define your styles
const styles = StyleSheet.create({
    totalItemStyle: {
        flexDirection: 'row',
        height: 44,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 5,
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    totalItemLeftStyle: {
        flexDirection: 'row',
        alignItems:'center'
    },
    totalItemLeftTextStyle: {
        paddingLeft: 10,
        fontSize:setSpText(14),
        color: '#222'
    },
    totalItemRightStyle: {
        flexDirection: 'row'
    },
    totalNumStyle: {

    },
    unitStyle: {
        paddingLeft: 10
    },
    
});
