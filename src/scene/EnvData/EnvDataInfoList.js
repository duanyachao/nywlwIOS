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
import { setSpText, scaleSize } from '../../common/scale'
// create a component
export default class EnvDataList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            envData: null,
            envCode:null,
            unitCode:null

        }
    }
    componentDidMount() {
        this.warnMsgListener = DeviceEventEmitter.addListener('receiveWarnMsg', (msg) => {

        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.envData !== this.props.envData) {
            this.setState({
                envCode:Object.keys(nextProps.envData)[0],
                envData:nextProps.envData[Object.keys(nextProps.envData)[0]],
                unitCode:nextProps.envData[Object.keys(nextProps.envData)[0]].unitCode
            })
        }
        return true
    }
    componentWillMount(){
        this.setState({
            envCode:Object.keys(this.props.envData)[0],
            envData:this.props.envData[Object.keys(this.props.envData)[0]],
            unitCode:this.props.envData[Object.keys(this.props.envData)[0]].unitCode
        })
    }
    componentWillUnmount() {
        this.warnMsgListener.remove()
    }
    renderItem(item, i) {
        // console.info(item);
        let warnColor, warnLevel;
        let envCode=this.state.envCode;
        let unitCode=this.state.unitCode;
        switch (item.STATUS) {
            case "0":
                    warnColor='green';
                    warnLevel='正常';
                    break;   
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
        switch (envCode) {
            case "OUTSD":
                paramsIcon = ParamsIcon.sdIcon;
                break;
            case "SD":
                paramsIcon = ParamsIcon.sdIcon;
                break;
            case "OUTSD":
                paramsIcon = ParamsIcon.sdIcon;
                break;
            case "OUTWD":
                paramsIcon = ParamsIcon.wdIcon;
                break;
            case "WD":
                paramsIcon = ParamsIcon.wdIcon;
                break;
            case "TRWD":
                paramsIcon = ParamsIcon.wdIcon;
                break;
            case "TRSD":
                paramsIcon = ParamsIcon.sdIcon;
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
                <Icon name='exclamation-circle' size={24} color={warnColor}></Icon>
                <View style={styles.warnName}>
                    <Text>{item.PDES}</Text>
                </View>
                <View style={styles.block}></View>
                <View style={styles.warnValue}>
                    <Image source={paramsIcon} style={styles.paramsIcon}></Image>
                    <Text>{item.VAL}</Text>
                    <Text>{unitCode}</Text>
                </View>
                <View style={[styles.warnLevel, { borderTopColor: warnColor, borderRightColor: warnColor }]}><Text style={styles.warnLevelText}>{warnLevel}</Text></View>
            </View>
        )
    }
    render(){
        let envData=this.state.envData;
        return(
            <View style={styles.warnList}>
                    <View style={styles.warnAreaTitle}>
                        <Text style={styles.warnAreaTitleText}>{envData.envItemName}</Text>
                    </View>
                        {envData.list.map((item, i) => this.renderItem(item, i))}
            </View>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    warnList:{},
    warnAreaTitle: {
        height:30,
        justifyContent: 'center',
    },
    warnAreaTitleText: {
        paddingLeft:20
    },
    warnItem: {
        display: 'flex',
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        height:50,
        marginBottom:5
    },
    paramsIcon: { marginRight: 20 },
    warnName: { paddingHorizontal: 20 ,width:100},
    warnValue: { 
        flexDirection:'row', 
        alignItems:'center',
        paddingLeft: 20,
    },
    block: {
        alignSelf: 'stretch',
        // marginVertical: 1,
        width: screen.onePixel,
        backgroundColor: '#ccc'
    },
    warnLevel: {
        position: 'absolute',
        right: 0,
        top: 0,
        borderWidth: 25,
        borderLeftColor: '#fff',
        borderBottomColor: '#fff',
    },
    warnLevelText: {
        position: 'absolute',
        color: '#fff',
        transform: [{ translateY: -20},{translateX: -5}, { rotate: '45deg' }]
    }
});
