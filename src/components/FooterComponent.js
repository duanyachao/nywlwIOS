import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
export default class FooterComponent extends Component {
    render() {
        return (
            <View style={{flex:1}}><Text>数据加载完毕</Text></View>
        );
    }
}
