//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Network, toastShort } from '../../utils';
import api from '../../api';
import WarnInfoList from './WarnInfoList';
// create a component
export default class WarnAreaList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceIds:null,
            token: null
        }
    }
    requestDeviceIds() {
        const {data, token} = this.props;
        this.setState({
            token: token
        })
        let headers = {
            'X-Token': token
        };
        let params = { "orgId": data.id };
        Network.get(api.HOST + api.DEVICES, params, headers, (res) => {
            if (res.meta.success) {
                this.setState({
                    deviceIds: res.data
                })
            }

        })    
    }
    componentDidMount() {
        this.requestDeviceIds()    
    }
    componentWillReceiveProps(){
        this.requestDeviceIds()    
    }
    render() {
        const devices=this.state.deviceIds;
        const {data, token} = this.props;
        if (!devices) {
            return(<View></View>)    
        } else {
            const deviceIds = [];
                for (var index = 0; index < devices.length; index++) {
                    deviceIds.push(devices[index].deviceId);
                }
            return(
                <WarnInfoList deviceIds={deviceIds} orgId={data.id} areaData={data} token={token}></WarnInfoList>
            )    
        }
    }
}

// define your styles
const styles = StyleSheet.create({

    
});
