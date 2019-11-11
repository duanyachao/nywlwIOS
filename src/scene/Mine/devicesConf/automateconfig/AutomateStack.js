import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { StackNavigator } from 'react-navigation'
import {Header} from './../../../../components'
import AutomateConfigScene from './AutomateConfigScene'
import CreateAutomateconfigScene from './CreateAutomateconfigScene'
const AutomateStack = StackNavigator({
  Config: {
    screen: AutomateConfigScene,
    navigationOptions: ({ navigation }) => ({
      header: <Header title='阈值设置' leftBtn={true} rightBtn={false} navigation={navigation}></Header>
    })
  },
  Create: {
    screen: CreateAutomateconfigScene,
    navigationOptions: ({ navigation }) => ({
      header: <Header title='新增阈值设置' leftBtn={true} rightBtn={false} navigation={navigation}></Header>
    })
  }
},
  {
    initialRouteName: 'Config',
    mode: 'modal',
    // headerMode: 'none',
  }
)
export default AutomateStack

