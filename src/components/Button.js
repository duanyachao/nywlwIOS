//import liraries
import React, { Component,PropTypes } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';

// create a component
export default class Button extends Component {
    static propTypes={
        onPress:PropTypes.func,
        disabled:PropTypes.bool,
        btnTextStyle:Text.propTypes.style,
        btnStyle:View.propTypes.style,
        title:PropTypes.string,
        activeOpacity:PropTypes.number
    }
    static defaultProps={
        onPress() {},
        disabled:false,
        activeOpacity:0.8
    }
    render() {
        let   { onPress, disabled, btnTextStyle, btnStyle, title, activeOpacity } = this.props;
        return (
            <TouchableOpacity
                style={btnStyle}
                onPress={onPress}
                disabled={disabled}
                activeOpacity={activeOpacity}>
                <Text style={btnTextStyle}>{title}</Text>
            </TouchableOpacity>
        );
    }
}



