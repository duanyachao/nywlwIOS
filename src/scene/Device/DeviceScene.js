import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    InteractionManager
} from 'react-native';
import { PagerTabIndicator, IndicatorViewPager } from 'rn-viewpager';
import { theme, Header, Area } from '../../components';
import DeviceListSD from './DeviceListSD';
import DeviceListSSD from './DeviceListSSD';
import api from '../../api';
import { Network, toastShort } from '../../utils';
export default class Devices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgId: null,
            devices:null
        }
    }
    requestDevicesList() {
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.orgId !== this.state.orgId) {
            let headers = {
                'X-Token': token
            };
            let params = { "orgId": nextState.orgId };
            Network.get(api.HOST + api.DEVICES_STATUS, params, headers, (res) => {
                if(res.meta.success){
                    this.setState({
                        devices:res.data
                    })
                }
            })
        }
        return true;
    }
    areaChange(newState) {
        this.setState({
            orgId: newState
        })
    }
    renderTabIndicator() {
        let tabs = [
            { text: '开关设备' }, { text: '开关停设备' }
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
    render() {
        const devices=this.state.devices;
        return (
            <View style={styles.container}>
                <Area callbackParent={(newState) => this.areaChange(newState)}></Area>
                <IndicatorViewPager
                    style={{ flex: 1, flexDirection: 'column-reverse' }}
                    indicator={this.renderTabIndicator()}
                    scrollEnabled={true}
                    initialPage={0}>
                    {(devices && devices.sd.length>0)?<View><DeviceListSD orgId={this.state.orgId} devices={devices.sd}></DeviceListSD></View>:<View><Text>暂无设备</Text></View>}
                    {(devices && devices.ssd.length>0)?<View><DeviceListSSD orgId={this.state.orgId} devices={devices.ssd}></DeviceListSSD></View>:<View><Text>暂无设备</Text></View>}
                
                </IndicatorViewPager>
            </View>
        );
    }
}
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
        alignItems: 'flex-end'
    },
    tabTxt: {
        marginTop: 0,
        color: '#222',
        fontSize: 13,
        paddingBottom: 12,
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