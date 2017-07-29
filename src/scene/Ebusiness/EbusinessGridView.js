import React, { Component } from 'react';
import { View, Text, StyleSheet,StatusBar } from 'react-native';
import {color, screen, system} from '../../common';
import EbusinessGridItem from './EbusinessGridItem';
export default class EbusinessGridView extends Component {
    constructor(props){
        super(props);
    }
    onGridSelected(index) {
        let discount = this.props.discounts[index];
        if (discount.type == 1) {
            StatusBar.setBarStyle('default', false);
            let location =(discount.tplurl.indexOf('http')==-1 ? discount.tplurl.indexOf('https'): discount.tplurl.indexOf('http'));
            let url =unescape(discount.tplurl.slice(location));
            this.props.navigation.navigate('Web', { url: url});
        }
    }
    render() {
        const {discounts}=this.props;
        let gridItems=discounts.map((discount,i)=>
            <EbusinessGridItem
                key={i}
                info={discount}
                onPress={()=>this.onGridSelected(i)}
            ></EbusinessGridItem>)
        return (
            <View style={styles.container}>
                {gridItems}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        borderTopWidth: screen.onePixel,
        borderLeftWidth: screen.onePixel,
        borderColor: color.border
    },
});
