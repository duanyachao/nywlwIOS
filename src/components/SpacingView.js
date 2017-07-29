import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {color} from '../common';

export default class SpacingView extends Component {
    render() {
        return (
            <View style={styles.container}>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        height: 14,
        backgroundColor: color.background,
    },
});
