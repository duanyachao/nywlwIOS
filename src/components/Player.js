import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {screen} from '../common'

export default class Player extends Component {
  constructor() {
    super();

    this.state = {
      
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <View>
        <Text>{this.props.url}</Text>
      </View>
    );
  }
}