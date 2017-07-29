import React, { Component } from 'react';
import {
    View
} from 'react-native';
import {screen,color} from '../common';
export default class SeparatorComponent extends Component {
    render() {
        return (
            <View style={{ height:screen.onePixel,backgroundColor: 'red' }}></View>
        );
    }
}
