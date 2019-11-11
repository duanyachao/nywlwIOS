import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import { Network, toastShort } from './../../../../utils'
import api from './../../../../api'
import { screen, theme } from './../../../../common'
import WarnConfigItem from './WarnConfigItem'
export default class WarnConfigScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orgId: this.props.navigation.state.params.orgId,
            sensors: null,
            
        }
    }
    //获取传感器
    getSensors = (orgId, category) => {
        let headers = {
            'X-Token': token
        };
        let params = {
            "orgId": orgId,
            "category": category
        }
        Network.get(api.HOST + api.GETLOGICDEVICESLIST, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                this.setState({
                    sensors: res.data
                })
            }
        })
    }
    //渲染传感器
    renderSensor=(data)=>{
        const {item,index}=data;
        // console.info(data)
        return(
            <WarnConfigItem key={index} orgId={this.state.orgId} data={item}/>
        )
    }
    componentDidMount() {
        this.getSensors(this.state.orgId,1)
    }
    render() {
        const {sensors,orgId}=this.state;
        return (
            <View style={styles.container}>
                {sensors?
                <FlatList
                data={sensors}
                keyExtractor={(item, index) => index}
                refreshing={false}
                onRefresh={()=>this.getSensors(orgId,1)}
                ref="confDataList"
                renderItem={(item) => this.renderSensor(item)} />:
                <View style={theme.nodata}><Text>暂无数据</Text></View>    
            }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
