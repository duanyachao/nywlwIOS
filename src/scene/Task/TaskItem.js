//import liraries
import React, { Component } from 'react';
import { Alert, View,PixelRatio, Text, StyleSheet, Switch, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../../api';
import { theme } from '../../components';
import { screen } from '../../common';
import { Network, toastShort } from '../../utils';
import {setSpText,scaleSize} from '../../common/scale';
// create a component
export default class TaskItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            switchStatus: null,
            taskStatus: null,
            disabled: null
        }
    }
    taskAction(taskItem, biologyInId) {
        if (taskItem.FINISH_STATE == 0) {
            return
        } else {
            Alert.alert(
                '提示',
                '确定完成此任务?',
                [
                    {
                        text: '确定', onPress: () => {
                            let headers = {
                                'X-Token': token,
                                'Content-Type': 'application/json'
                            };
                            let params = { "biologyInId": biologyInId, "status": 0, "taskId": taskItem.ID };
                            Network.postJson(api.HOST + api.TASKUPDATE, params, headers, (res) => {
                                // console.info(res.data)
                                if (res.meta.success) {
                                    this.setState({
                                        switchStatus: !this.state.switchStatus,
                                        disabled: true,
                                        taskStatus: `完成(${res.data.finishTime})`
                                    });
                                } else {
                                    toastShort(res.meta.message);
                                }
                            })
                        }
                    },
                    {
                        text: '取消', onPress: () => {
                            return
                        }
                    }
                ]
            )


        }
    }
    changeStatus(status,taskItem) {
        switch (status) {
            case -1:
            case 1:
                this.setState({
                    switchStatus: true,
                    taskStatus: '未完成',
                    disabled: false
                })
                break;
            case 0:
                this.setState({
                    switchStatus: false,
                    taskStatus: `完成(${taskItem.FINISH_TIME})`,
                    disabled: true
                })
                break;
            default:
                break;
        }
    }
    componentDidMount() {
        const {taskItem} = this.props;
        let status = taskItem.FINISH_STATE;
        this.changeStatus(status,taskItem);

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.taskItem !== this.props.taskItem) {
            let status = nextProps.taskItem.FINISH_STATE;
            this.changeStatus(status,nextProps.taskItem);
        }
        return true
    }
    render() {
        const {taskItem, biologyInId} = this.props;
        return (
            <TouchableHighlight underlayColor="rgb(255, 255,255)" disabled={this.state.disabled} onPress={() => this.taskAction(taskItem, biologyInId)}>
                <View style={styles.taskItem}>
                    <View style={styles.taskItemLeft}>
                        <View style={styles.taskItemLeftTop}>
                            <Text style={styles.taskItemLeftTopText}>
                                {taskItem.TASK_NAME}
                            </Text>
                        </View>
                        <View style={styles.taskItemLeftBottom}>
                            <View style={styles.taskTime}>
                                <Icon name='clock-o' size={setSpText(22)} color={'green'}></Icon>
                                <Text style={styles.taskItemLeftBottomText}>{taskItem.START_TIME}--{taskItem.END_TIME}</Text>
                            </View>
                            {(this.state.switchStatus) ?
                                <View style={styles.taskIsEnd}>
                                    <Icon name='clock-o' size={setSpText(22)} color={'red'}></Icon>
                                    <Text style={styles.taskItemLeftBottomText}>{this.state.taskStatus}</Text>
                                </View> :
                                <View style={styles.taskIsEnd}>
                                    <Icon name='check-circle' size={setSpText(22)} color={'green'}></Icon>
                                    <Text style={styles.taskItemLeftBottomText}>{this.state.taskStatus}</Text>
                                </View>}

                        </View>
                    </View>
                    <View style={styles.taskItemRight}>
                        <Switch
                            onValueChange={() => this.taskAction(taskItem, biologyInId)}
                            value={this.state.switchStatus}
                            disabled={this.state.disabled}
                        >
                        </Switch>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    taskItem: {
        padding: 6,
        justifyContent:'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: screen.onePixel,
        borderBottomColor: '#f0f0f0',
    },
    taskItemLeft: {
        flex:1
    },
    taskItemRight:{
    },
    taskItemLeftTop: {
        paddingBottom:6,
        flexDirection: 'row',
    },
    taskItemLeftBottom: {
    },
    taskTime: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    taskIsEnd: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    taskItemLeftTopText:{
        fontSize:setSpText(14)
    },
    taskItemLeftBottomText: {
        fontSize:setSpText(14),
        paddingLeft: 6
    },
    taskItemRight: {
        justifyContent:'flex-end',
        alignItems: 'center'
    }
});
