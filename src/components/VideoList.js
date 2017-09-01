//import liraries
import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme,screen } from '../common';
import { pickerStyle } from '../common/theme';
import Picker from 'react-native-picker';
import api from '../api';
import { Network, toastShort } from '../utils';
import {Player} from '../components'
// create a component
export default class VideoList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vcameraName: null,
            forwordUrl: null,
        }
    }
    componentDidMount() {
        this.pickerListener = DeviceEventEmitter.addListener('返回键', () => Picker.hide());
    }
    componentWillUnmount() {
        Picker.hide();
        this.pickerListener.remove();
    }
    selectVideo(videoList) {
        let videoLists = [];
        for (var index = 0; index < videoList.length; index++) {
            videoLists.push(videoList[index].vcameraName)

        }
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择监控点',
            pickerData: videoLists,
            selectedValue: [this.state.vcameraName],
            onPickerConfirm: data => {
                videoList.forEach((element, index) => {
                    if (element.vcameraName == data[0]) {
                        this.setState({
                            vcameraName: element.vcameraName,
                            forwordUrl: element.forwordUrl
                        })
                    }
                })

            },

        });
        Picker.show();
    }
    componentWillReceiveProps(nextProps) {
        Picker.hide()
        let videoList = nextProps.videoList;
        if (videoList) {
            this.setState({
                vcameraName: videoList[0].vcameraName,
                forwordUrl: videoList[0].forwordUrl
            })
        }


    }
    render() {
        return (
            <View style={styles.container}>
                <View style={pickerStyle.container}>
                    <View style={pickerStyle.pickerTip}>
                        <Icon name='calendar' size={18} color={theme.iconColor}></Icon>
                        <Text style={pickerStyle.pickerTipText}>监控点</Text>
                    </View>
                    {(this.props.videoList && this.props.videoList.length > 0) ?
                        <TouchableHighlight
                            underlayColor="rgb(255, 255,255)"
                            onPress={() => this.selectVideo(this.props.videoList)}>
                            <View style={pickerStyle.picker}>
                                <Text style={pickerStyle.pickered}>{(this.state.vcameraName) ? this.state.vcameraName : null}</Text>
                                <Icon name='angle-right' size={24} color='#8c8c8c'></Icon>
                            </View>
                        </TouchableHighlight> : <View style={pickerStyle.nopicker}><Text style={pickerStyle.nopickerText}>暂无监控</Text></View>}
                </View>
                {(this.state.forwordUrl) ?
                    
                    <Player url={this.state.forwordUrl}></Player>
                    
                    : <View style={theme.nodata}><Text>无视频</Text></View>}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})
