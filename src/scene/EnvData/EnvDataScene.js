//import liraries
import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    FlatList,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { PagerTabIndicator, IndicatorViewPager } from 'rn-viewpager';
import { Area, Header } from '../../components';
import { theme, screen } from '../../common';
import { Network, toastShort } from '../../utils';
import api from '../../api';
import EnvDataInfoList from './EnvDataInfoList';
import WeatherDataList from './WeatherDataList';
export default class EnvDataScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgId: null,
            terminalId: null,
            terminalSerialNum: null,
            envDataList: null,
            infoTime:null,
            bTypeName:null,
            noWarn: true
        }
    }
    areaChange(orgId, terminalId, terminalSerialNum) {
        this.setState({
            orgId: orgId,
            terminalId: terminalId,
            terminalSerialNum: terminalSerialNum
        })
        let evndataUrl = api.HOST + api.ENVDATA;
        let headers = {
            'Content-Type': 'application/json',
            'X-Token': token
        }
        let params = {
            "orgId": orgId,
            "terminalId":terminalId,
            "serialNum":terminalSerialNum,
            
        }
        //对象转Map
        // objToStrMap=(obj)=>{
        //     let strMap = new Map();
        //     for (let k of Object.keys(obj)) {
        //       strMap.set(k,obj[k]);
        //     }
        //     return strMap;
        // }
        // let envData = objToStrMap(res.data.edMap);   
        Network.postJson(evndataUrl, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success && Object.keys(res.data.edMap).length !== 0) {
                //对象转数组
                let arr = [];
                let obj=res.data.edMap;
                for (let i in obj) {
                    let o = {};
                    o[i] = obj[i];
                    arr.push(o)
                }
                this.setState({
                    envDataList: arr,
                    infoTime: res.data.time
                })                              
                DeviceEventEmitter.emit('报警状态', res);
            } else {
                this.setState({
                    envDataList: null,
                    infoTime:null
                })
            }
        })
    }
    renderItem(item) {
        let envCode=Object.keys(item.item)[0];
        let bTypeName=this.state.bTypeName;
        if (envCode=='THI' && bTypeName=='温室大棚') {
            return(<View></View>)
        } else {
            return (<EnvDataInfoList envData={item.item}></EnvDataInfoList>)    
        }
        
    }
    keyExtractor = (item, index) =>index;
    renderFlistFooter=()=>{
        return (
            <View style={styles.flatListFooter}><Text style={styles.updateTime}>更新时间:&nbsp;&nbsp;&nbsp;&nbsp;{this.state.infoTime}</Text></View>
        )
    }
    renderEnvDataInfoList(){
        const itemH = 100;
        return (
                <FlatList
                    data={this.state.envDataList}
                    getItemLayout={(item, index) => ({ length: itemH, offset: itemH * index, index })}
                    initialNumToRender={30}
                    keyExtractor={this.keyExtractor}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={1}
                    onRefresh={() => this.areaChange(this.state.orgId, this.state.terminalId, this.state.terminalSerialNum)}
                    refreshing={false}
                    ref="EnvDataInfoList"
                    ListFooterComponent={this.renderFlistFooter}
                    renderItem={(item) => this.renderItem(item)}>
                </FlatList>
        )
    } 
    componentDidMount() {
        // console.info(bTypeName)
        storage.load({
            key:'userInfo'
        }).then((ret)=>{
            // console.info(JSON.stringify(ret))
            this.setState({
                bTypeName:ret.bTypeName
            })
        })
        .catch(err => {
            // 如果没有找到数据且没有sync方法，
            // 或者有其他异常，则在catch中返回
            console.warn(err.message);
            switch (err.name) {
              case 'NotFoundError':
                // TODO;
                break;
              case 'ExpiredError':
                // TODO
                break;
            }
          })
        this.warnListener = DeviceEventEmitter.addListener('报警状态', (msg) => {
            // console.info(msg)
            (msg.meta.success && msg.data && msg.data.status !== 0) ? this.setState({ noWarn: false }) : null

        });
    }
    componentWillUnmount() {
        this.warnListener && this.warnListener.remove();
    }
    /*
    环境数据界面新增生产区域和室外数据
    */
   renderTabIndicator() {
    let tabs = [
        { text: '室外气象' }, { text: '生产区域' }
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
        return (
            <View style={styles.container}>
                <WeatherDataList/>
                <Area callbackParent={(orgId, terminalId, terminalSerialNum) => this.areaChange(orgId, terminalId, terminalSerialNum)}></Area>
                {this.state.envDataList ? this.renderEnvDataInfoList(this.state.envDataList) : <View style={styles.noWarnWrapper}><Text>暂无数据</Text></View>}
            </View>

            // <View style={styles.container}>
                
            //     <IndicatorViewPager
            //         style={{ flex: 1, flexDirection: 'column-reverse' }}
            //         indicator={this.renderTabIndicator()}
            //         scrollEnabled={true}
            //         initialPage={0}>
            //         <View>
            //         <WeatherDataList/>
            //         </View>
            //         <View>
            //             <Area callbackParent={(orgId, terminalId, terminalSerialNum) => this.areaChange(orgId, terminalId, terminalSerialNum)}></Area>
            //             {this.state.envDataList ? this.renderEnvDataInfoList(this.state.envDataList) : <View style={styles.noWarnWrapper}><Text>暂无数据</Text></View>}
            //         </View>
            //     </IndicatorViewPager>
            // </View>
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
        color:theme.theme,
        fontSize: 13,
        paddingLeft: 6,
        paddingRight: 6,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor:theme.theme
    },
    tabItem: {
        paddingTop: 20,
        marginTop: 0
    },
    selectedTabItem: {

    },
    noWarnWrapper: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    updateTime:{
        textAlign:'right',
        paddingVertical:10,
        paddingRight:5
    }
});