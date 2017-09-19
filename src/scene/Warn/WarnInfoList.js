//import liraries
import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    Image,
    ListView,
    View,
    Text,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Network, toastShort } from '../../utils';
import api from '../../api';
import { ParamsIcon } from '../../common/Normal';
import { theme, screen } from '../../common';
// create a component
export default class WarnInfoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            warnInfo: null
        }
    }
    async requestWarnData() {
        try {
            const {areaData} = this.props;
            let response  = await fetch(api.HOST + api.DEVICES+'?orgId='+areaData.id,{
                method: 'GET',
                headers:{
                     'X-Token': token
                }
            })
            let responseJson = await response.json();
            let deviceIds=[];
            for (var index = 0; index < responseJson.data.length; index++) {
                    deviceIds.push(responseJson.data[index].deviceId);
            }
            let params = {
                deviceIds: deviceIds,
                orgId: areaData.id
            }
            if (deviceIds) {
                let headers = {
                    'Content-Type': 'application/json',
                    'X-Token': token
                }
                Network.postJson(api.HOST + api.WARNINFO, params, headers, (res) => {
                    if (res.meta.success && res.data) {
                        this.setState({
                            warnInfo: res.data
                        })
                        
                    } else {
                        // console.info(res)
                    }
                    DeviceEventEmitter.emit('报警状态',res);         
                })
            }
        } catch (error) {
            // console.info(error)
        }

    }
    componentDidMount() {
        this.requestWarnData()
        this.warnMsgListener=DeviceEventEmitter.addListener('receiveWarnMsg',(msg)=>{
            this.requestWarnData()    
        })
    }
    componentWillUnmount() {
        this.warnMsgListener.remove()
    }
    renderItem(item, i) {
        let warnColor, warnLevel;
        switch (item.status) {
            case "1":
                warnColor = '#ffd700';
                warnLevel = '一般';
                break;
            case "2":
                warnColor = '#ffa500';
                warnLevel = '高危';
                break;
            case "3":
                warnColor = '#ff0000';
                warnLevel = '异常';
                break;
            default:
                warnColor = '#808080';
                break;
        }
        let paramsIcon;
        switch (item.code) {
            case "OUTSD":
                paramsIcon = ParamsIcon.sdIcon;
                break;
            case "SD":
                paramsIcon = ParamsIcon.sdIcon;
                break;
            case "OUTWD":
                paramsIcon = ParamsIcon.wdIcon;
                break;
            case "WD":
                paramsIcon = ParamsIcon.wdIcon;
                break;
            case "EYHT":
                paramsIcon = ParamsIcon.co2Icon;
                break;
            case "AQ":
                paramsIcon = ParamsIcon.nh3Icon;
                break;
            case "JY":
                paramsIcon = ParamsIcon.jyIcon;
                break;
            case "FS":
                paramsIcon = ParamsIcon.fsIcon;
                break;
            case "GZQD":
                paramsIcon = ParamsIcon.gzIcon;
                break;
            default:
                break;
        }
        return (
            <View key={i} style={styles.warnItem}>
                <Icon name='exclamation-circle' size={theme.iconSize} color={warnColor}></Icon>
                <View style={styles.warnName}>
                    <Text style={styles.warnText}>{item.codename}</Text>
                    <Text style={styles.warnText}>{item.createTime}</Text>
                </View>
                <View style={styles.block}><Text></Text></View>
                <Image source={paramsIcon} resizeMode='contain' style={styles.paramsIcon}></Image>
                <View style={styles.warnValue}><Text style={styles.warnText}>{item.value}</Text></View>
                <View style={[styles.warnLevel, { borderTopColor: warnColor, borderRightColor: warnColor }]}>
                    <View style={styles.warnLevelTextWrapper}>
                        <Text style={styles.warnLevelText}>{warnLevel}</Text>
                    </View>
                    
                </View>
            </View>
        )
    }
    render() {
        const warnInfo = this.state.warnInfo;
        const {areaData} = this.props;
        if (warnInfo) {
            if (warnInfo.status == 2) {
                return (<View style={styles.warnList}>
                        <View style={styles.warnAreaTitle}>
                            <Icon name='map-marker' size={theme.iconSize} color={theme.iconColor}></Icon>
                            <Text style={styles.warnAreaTitleText}>{areaData.orgName}</Text>
                        </View>
                        <View style={styles.nodata}><Text>{warnInfo.result}</Text></View>
                    </View>)
            } else if (warnInfo.status == 1) {
                return (
                    <View style={styles.warnList}>
                        <View style={styles.warnAreaTitle}>
                            <Icon name='map-marker' size={theme.iconSize} color={theme.iconColor}></Icon>
                            <Text style={styles.warnAreaTitleText}>{areaData.orgName}</Text>
                        </View>
                        {warnInfo.result.map((item, i) => this.renderItem(item, i))}
                    </View>
                )
            } else {
                return (<View></View>)
            }
        } else {
            return (<View></View>)
        }

    }
}

// define your styles
const styles = StyleSheet.create({
    warnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 5,
        borderBottomColor: theme.background

    },
    warnAreaTitle: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center'
    },
    warnAreaTitleText: {
        paddingLeft: 8,
        fontSize:theme.normalFontSize

    },
    paramsIcon: { width: theme.warnImgSize, height: theme.warnImgSize, marginLeft: 10 },
    warnName: { paddingLeft: 12, paddingRight: 10 },
    warnValue: { paddingLeft: 12, flex: 1 },
    warnText:{
        fontSize:theme.warnFontSize
    },
    nodata: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#fff'

    },
    block: {
        // height:40,
        alignSelf: 'stretch',
        marginVertical: 4,
        width:1,
        backgroundColor: '#ccc'
    },
    warnLevel: {
        width: 0,
        borderWidth: 25,
        borderLeftColor: '#fff',
        borderBottomColor: '#fff',
    },
    warnLevelTextWrapper:{
        backgroundColor:'transparent'
    },
    warnLevelText: {
        fontSize:theme.warnLevelFontSize,
        position: 'absolute',
        color: '#fff',
        transform: [{ translateY: -15 }, { rotate: '45deg' }]
    }
});
