//import liraries
import React, { Component } from 'react';
import {
    ListView,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet,
    Modal
} from 'react-native';
import { Header, Area, Batch, Dayage, Button } from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme,screen } from '../../common';
import api from '../../api';
import { Network, toastShort } from '../../utils';
import ProductTotal from './ProductTotal';
import DayItems from './DayItems';
// create a component
export default class ProductScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgId: null,
            biologyInId: null,
            batch: null,
            dayAge: null,
            currentDayTotalData: null,
            actType:null,
            id:null
        }
    }
    areaChange(newState) {
        this.setState({
            orgId: newState
        })
    }
    batchChange(batch, biologyInId, batchIndex) {
        this.setState({
            batch: batch,
            biologyInId: biologyInId,

        })
    }
    dayAgeChange(newState) {
        this.setState({
            dayAge: newState
        })
    }
    componentDidMount() {

    }
    requestData(biologyInId, dayAge) {
        let headers = {
            'X-Token': token,
            'Content-Type': 'application/json'
        };
        let params = { "biologyInId": biologyInId, "dayAge": dayAge };
        Network.postJson(api.HOST + api.DAYINFO, params, headers, (res) => {
            if (res.meta.success && res.data.length>0) {
                let result=res.data;
                let len=result.length;
                this.setState({
                    currentDayTotalData: result[len - 1],
                    actType:(dayAge==result[len - 1].chickenAge)?0:1,
                    id:(dayAge==result[len - 1].chickenAge)?result[len - 1].id:null
                })
                
            }else{
                this.setState({
                    currentDayTotalData: null,
                    actType:1
                })    
            }
        })
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.dayAge !== this.state.dayAge) {
            this.requestData(nextState.biologyInId, nextState.dayAge);

        }

        return true
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView >
                <Area callbackParent={(newState) => this.areaChange(newState)}></Area>
                <Batch
                    orgId={this.state.orgId}
                    callbackBacth={(batch, biologyInId) => this.batchChange(batch, biologyInId)}>
                </Batch>
                {(this.state.currentDayTotalData)?<ProductTotal totalData={this.state.currentDayTotalData}></ProductTotal>:null}
                <View style={styles.sjlrTit}>
                    <Icon name='pencil' size={18} color={theme.iconColor}></Icon>
                    <Text style={styles.sjlrText}>数据录入</Text>
                </View>
                <Dayage
                    orgId={this.state.orgId}
                    batch={this.state.batch}
                    callbackDayage={(newState) => this.dayAgeChange(newState)}>
                </Dayage>
                
                <DayItems callRefreash={(biologyInId,dayAge)=>this.requestData(biologyInId, dayAge)} data={this.state.currentDayTotalData} biologyInId={this.state.biologyInId} dayAge={this.state.dayAge} actType={this.state.actType} id={this.state.id}></DayItems>
            </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex:1
    },
    sjlrTit: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: screen.onePixel,
    },
    sjlrText: {
        paddingLeft: 10,
        fontSize: 14,
        color: '#222'
    },
   
});
