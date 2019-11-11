import React, { Component } from 'react';
import {
  Text,
  AppRegistry,
  DeviceEventEmitter,
  TouchableHighlight,
  InteractionManager,
  StyleSheet,
  View
} from 'react-native';
import Video from 'react-native-video';
import { screen } from '../common'
export default class Player extends Component {
  componentDidMount(){
  }
  render() {
    const {url}=this.props;
    return (
      <View style={styles.container}>
        <Video
          ref={(ref) => {
            this.player = ref
          }}
          volume={1.0}
          rate={1.0}
          paused={false}
          repeat={false}
          autoplay={true}
          resizeMode="contain"
          preload={'none'}
          loop={false}
          controls={true}
          muted={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch={"ignore"}
          progressUpdateInterval={250.0}
          style={styles.backgroundVideo}
          source={{uri:url}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // width: screen.width,
    // height: screen.width / (16 / 9)
  },
});
