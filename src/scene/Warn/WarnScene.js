//import liraries
import React, { Component } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { Header } from '../../components';
import { Network, toastShort } from '../../utils';
import api from '../../api';
import WarnAreaList from './WarnAreaList';
// create a component
const pageSize = 10;
export default class WarnScene extends Component {
    // static navigationOptions = ({navigation}) => (
    //     {
    //         header: (<Header navigation={navigation} title='报警信息'></Header>),
    //     })
    constructor(props) {
        super(props);
        this.state = {
            areaListData: [],
            token: null
        }
    }
    requestAreaData() {

        let headers = {
            'X-Token': token
        };
        this.setState({
            token: token
        })
        Network.get(api.HOST + api.REGIONS, '', headers, (res) => {
            if (res.meta.success) {
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
        return (<WarnAreaList data={item.item} token={this.state.token}></WarnAreaList>)
    }
    keyExtractor = (item, index) => item.id;
    componentDidMount() {
        this.requestAreaData()
        this.timer = setInterval(() => { this.requestAreaData()},10000)
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
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
});