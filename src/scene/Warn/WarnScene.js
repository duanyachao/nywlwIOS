//import liraries
import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    FlatList,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { Header } from '../../components';
import { theme,screen } from '../../common';
import { Network, toastShort } from '../../utils';
import api from '../../api';
import WarnInfoList from './WarnInfoList';
// create a component
const pageSize = 10;
export default class WarnScene extends Component {
    static navigationOptions={
        header: <Header title='报警信息'></Header>
    }
    constructor(props) {
        super(props);
        this.state = {
            areaListData: null,
            noWarn:true
        }
    }
    requestAreaData() {

        let headers = {
            'X-Token': token
        };
        Network.get(api.HOST + api.REGIONS, '', headers, (res) => {
            if (res.meta.success) {
                // console.info(res)
                this.setState({
                    areaListData: res.data
                })
                global.areaList = res.data;
                storage.save({
                    key: 'areaList',
                    data: res.data
                })
            }


        })
    }
    renderItem(item) {
        return (<WarnInfoList areaData={item.item}></WarnInfoList>)
    }
    keyExtractor = (item, index) => item.id;
    componentDidMount() {
        this.requestAreaData()
    
        this.warnListener = DeviceEventEmitter.addListener('报警状态',(msg)=>{
            // console.info(msg)
            (msg.meta.success && msg.data && msg.data.status!==0)?this.setState({noWarn:false}):null 

        });
    }
    componentWillUnmount() {
        
        this.warnListener && this.warnListener.remove();
    }
    render() {
        const itemH = 100;
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.areaListData}
                    getItemLayout={(item, index) => ({ length: itemH, offset: itemH * index, index })}
                    initialNumToRender={pageSize}
                    keyExtractor={this.keyExtractor}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={1}
                    onRefresh={() => this.requestAreaData()}
                    refreshing={false}
                    ref="warnInfoList"
                    renderItem={(item) => this.renderItem(item)}
                ></FlatList>
                {(this.state.noWarn) ? <View style={styles.noWarnWrapper}><Text>无报警</Text></View> : null}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',

    },
    noWarnWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent:'center',
        alignItems:'center'
    }
});