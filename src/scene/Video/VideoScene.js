//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import api from '../../api';
import { Network, toastShort } from '../../utils';
import { Area,VideoList } from '../../components';
// create a component
class VideoScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orgId: null,
            videoLists:null
        }
    }
    areaChange(newState) {
        this.setState({
            orgId: newState
        })
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.orgId !== this.state.orgId) {
            this.requestVideoData(nextState.orgId);
        }
        return true
    }
    requestVideoData(orgId) {
        let headers = {
            'X-Token': token
        };
        let params = { "orgId": orgId };
        Network.get(api.HOST + api.VIDEOLISTS, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                this.setState({
                    videoLists: res.data
                })
            }

        })
    }
    render() {
        return (
            <View style={styles.container}>
                <Area callbackParent={(newState) => this.areaChange(newState)}></Area>
                <VideoList videoList={this.state.videoLists}></VideoList>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

//make this component available to the app
export default VideoScene;
