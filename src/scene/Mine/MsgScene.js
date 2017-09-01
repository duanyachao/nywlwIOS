//import liraries
import React, { Component } from 'react';
import {DeviceEventEmitter, View, Text, StyleSheet } from 'react-native';
import { PagerTabIndicator, IndicatorViewPager } from 'rn-viewpager';
// create a component
class msgScene extends Component {
    constructor(props){
        super(props)
        this.state={
            data:null
        }
    }
    renderTabIndicator() {
        let tabs = [
            { text: '报警消息' }, { text: '任务消息' }
        ];
        return (
            <PagerTabIndicator
                style={styles.indicatorContainer}
                textStyle={styles.tabTxt}
                selectedTextStyle={styles.selectedTabTxt}
                itemStyle={styles.tabItem}
                selectedItemStyle={styles.selectedTabItem}
                tabs={tabs}>
            </PagerTabIndicator>
        )
    }
    
    componentDidMount(){
        // this.pushListener = DeviceEventEmitter.addListener('receiveMsg',(msg)=>console.info(msg))
    }
    render() {
        return (
            <View style={styles.container}>
            <IndicatorViewPager
                style={{ flex: 1, flexDirection: 'column-reverse' }}
                indicator={this.renderTabIndicator()}
                scrollEnabled={true}
                initialPage={0}>
                <View><Text>报警消息</Text></View>
                <View><Text>任务消息</Text></View>
            
            </IndicatorViewPager>
        </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    indicatorContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 5,
        borderBottomColor: '#f0f0f0',
        borderTopWidth: 0,
        paddingTop: 0,
        paddingBottom: 0,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    tabTxt: {
        marginTop: 0,
        color: '#222',
        fontSize: 13,
        paddingBottom: 6,
    },
    selectedTabTxt: {
        marginTop: 0,
        color: '#05b8a5',
        fontSize: 13,
        paddingLeft: 6,
        paddingRight: 6,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#05b8a5'
    },
    tabItem: {
        paddingTop: 20,
        marginTop: 0
    },
    selectedTabItem: {

    }
});

//make this component available to the app
export default msgScene;
