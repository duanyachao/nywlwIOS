import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { screen, theme } from '../common';
import {setSpText,scaleSize} from '../common/scale';
const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop:20,
        height:theme.headerH,
        backgroundColor: theme.theme
    },
    msgIcon: {

    },
    topBarLeft: {
        width: 48
    },
    topBarCenter: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    topBarCenterTitle: {
        color: '#fff',
    },
    topBarRight: {
        width: 32,
        alignItems: 'center',
        marginRight: 6
    }
});
export default class Header extends Component {
    constructor(props) {
        super(props);
    }
    msgButtonAction() {
        const {navigation} = this.props;
        // console.info(navigation)
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('Msg', { title: '我的消息' })
        })
    }
    componentDidMount() {

    }
    componentWillUnmount(){
        this.pushListener && this.pushListener.remove()    
    }
    render() {
        return (
            <View>
                <View style={styles.topBar}>
                    <View style={styles.topBarLeft}></View>
                    <View style={styles.topBarCenter}>
                        <Text style={styles.topBarCenterTitle}>{this.props.title}</Text>
                    </View>
                    <TouchableOpacity style={styles.topBarRight} onPress={() => /*this.msgButtonAction()*/{}}>
                        <Icon style={styles.icon} name='commenting' size={18} color="#fff"></Icon>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}