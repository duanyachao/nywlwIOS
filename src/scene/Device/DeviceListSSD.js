//import liraries
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    FlatList,
    RefreshControl
} from 'react-native';
import DeviceSSDItem from './DeviceSSDItem';
import DeviceSSDItemDP from './DeviceSSDItemDP';
import { theme,screen } from '../../common'
import {Button} from './../../components'
import { Network, toastShort } from './../../utils'
import api from './../../api'
// create a component
export default class DeviceListSSD extends Component {
    constructor(props){
        super(props);
        this.state = {
            bTypeName:null,
            devicesSetDatasList:null,
            showSetting:false
        }
    }
    keyExtractor = (item, index) =>index;
    renderItem(item) {
        let {orgId}=this.props;
        return (
            <DeviceSSDItemDP
                rowData={item.item} 
                rowID={item.item.DEVICE_ID} 
                orgId={orgId} showSetting={this.state.showSetting} callback={()=>this.getDevicesSetDatas(this.state.devicesSetDatasList)}></DeviceSSDItemDP>)
        
    }
    componentDidMount(){
        storage.load({
            key:'userInfo'
        }).then((ret)=>{
            this.setState({
                bTypeName:ret.bTypeName    
            })
        })
        .catch(err => {
            // 如果没有找到数据且没有sync方法，
            // 或者有其他异常，则在catch中返回
            // console.warn(err.message);
            switch (err.name) {
              case 'NotFoundError':
                // TODO;
                break;
              case 'ExpiredError':
                // TODO
                break;
            }
          })    
    }
    /*
    定义列表头部
    */
    // headerComponent=()=>{
    //     return(
    //         )
    // }
    render() {
        const {devices,orgId,onfreash}=this.props;
        const itemH = 100;
        return (
            <View style={styles.container}>
                <FlatList
                    data={devices}
                    getItemLayout={(item, index) => ({ length: itemH, offset: itemH * index, index })}
                    initialNumToRender={30}
                    keyExtractor={this.keyExtractor}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={1}
                    onRefresh={(orgId)=>{onfreash(orgId)}}
                    refreshing={false}
                    ref="DevicesList"
                    renderItem={(item) => this.renderItem(item)}/>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    setBtnsStyle:{
        flexDirection:'row',
        justifyContent:'flex-end',
        marginVertical:5,
        marginRight:10
    },
    deviceSetBtnStyle:{
        alignItems:'center',
        justifyContent: 'center',
        padding:10,
        marginHorizontal:10,
        backgroundColor:theme.theme,
        borderRadius:5  
    },
    deviceSetBtnTxtStyle:{
        color:'#ffffff',
        fontSize:16    
    },
});
