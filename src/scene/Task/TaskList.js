//import liraries
import React, { Component } from 'react';
import {
    ListView,
    View,
    Text,
    StyleSheet,
    Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../../api';
import { screen,theme } from '../../common';
import { Network, toastShort } from '../../utils';
import TaskItem from './TaskItem';
// create a component
export default class TaskList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.biologyInId) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows([]),
            })
        } else {
            let headers = {
                'X-Token': token,
                'Content-Type': 'application/json'
            };
            let params = { "biologyInId": nextProps.biologyInId, "dayAge": nextProps.dayAge };
            Network.postJson(api.HOST + api.TASKLIST, params, headers, (res) => {
                if (res.meta.success) {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(res.data),
                    })
                }
            })
        }

    }
    componentDidMount() {

    }
    renderItem(rowData, sectionID, rowID) {
        
        return (
            <TaskItem taskItem={rowData} biologyInId={this.props.biologyInId}></TaskItem>
        )
    }
    renderHeader() {
        return (
            <View style={styles.taskTitle}>
                <Icon name='bars' size={theme.iconSize} color={theme.iconColor}></Icon>
                <Text style={styles.taskTitleText}>任务列表</Text>
            </View>
        )
    }
    render() {
        return (
            (this.state.dataSource && this.state.dataSource._cachedRowCount > 0) ?
                <ListView
                    initialListSize={1}
                    dataSource={this.state.dataSource}
                    renderHeader={() => this.renderHeader()}
                    renderRow={(rowData, sectionID, rowID) => this.renderItem(rowData, sectionID, rowID)}
                    style={styles.listViewStyle}
                    onEndReachedThreshold={10}
                    enableEmptySections={true}
                ></ListView>
                : <View style={theme.nodata}><Text>无任务</Text></View>
        )



    }
}

// define your styles
const styles = StyleSheet.create({
    taskTitle: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical:6,
    },
    taskTitleText: {
        paddingLeft: 10,
        fontSize:theme.normalFontSize

    },
    
});
