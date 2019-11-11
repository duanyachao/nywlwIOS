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
import { Button } from '../../components';
// create a component
export default class WeatherDataList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData:null
        }
    }
    componentDidMount() {
        this.loadWeather()
    }
    WdataList= data =>{
        return (
            <View style={styles.wWrapper}>
                {data.map((item)=>{
                    if(item.key=='FX'){
                        item.unitName='风';
                        if (item.value==0 || item.value==360) {
                            item.value='东';    
                        }else if(item.value<90){
                            item.value='东北';
                        }else if(item.value==90){
                            item.value='北';
                        }else if(item.value>90 && item.value<180){
                            item.value='西北';
                        }else if(item.value==180){
                            item.value='西';
                        }else if(item.value>180 && item.value<270){
                            item.value='西南';
                        }else if(item.value==270){
                            item.value='南';
                        }else if(item.value>270 && item.value<360){
                            item.value='东南';
                        }else{

                        }  
                    }else{

                    }
                    return (
                        <View key={item.key} style={styles.listItem}>
                            <Text>{item.name}:&nbsp;</Text>
                            <Text>{item.value}</Text>
                            <Text>{item.unitName}</Text>
                        </View>
                    )
                })}
                
            </View>
        )
    }
    loadWeather(){
        let headers = {
            'X-Token': token
        };
        let params = { "orgId": weatherStationOrgId};
        Network.get(api.HOST+api.WEATHERURL, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                this.setState({
                    weatherData:res.data
                })    
            }

        })
    }
    render(){
        const {weatherData}=this.state;
        let  facName=(weatherData)?weatherData[0].facName:'';
        let data=(weatherData)?weatherData[0].sensorVOs:'';
        return (
            <View style={styles.container}>
                <View style={styles.wTitle}>
                <Text style={styles.wTitleT}>{facName}</Text>
                </View>
                {(weatherData)?this.WdataList(data):<View style={styles.nodata}><Text>暂无数据</Text></View>}
            </View>
        )   
    }
}

// define your styles
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderBottomColor:'#eee'
    },
    nodata:{
        flexDirection:'row',
        justifyContent:'center',
        padding:10
    },
    wTitle:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    wTitleT:{
        textAlign:'center',
        color:'#222',
        padding:10
    },
    wWrapper:{
        flexDirection:'row',
        flexWrap:'wrap',
        paddingBottom:10
    },
    listItem:{
        flexDirection:'row',
        paddingLeft:15,
        paddingVertical:5
        
    }
});
