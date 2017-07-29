//import liraries
import React, { Component } from 'react';
import {
    InteractionManager,
    Image,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { screen } from './common';
import { NavigationActions } from 'react-navigation';
// create a component
export default class SplashScene extends Component {
    static navigationOptions = ({
        header: null
    })
    componentDidMount() {
        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Login' })
                    ]
                })
                this.props.navigation.dispatch(resetAction);
            })
        }, 2000);
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    render() {
        return (
            <Image style={styles.container} source={require('./imgs/splash.jpg')}></Image>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        width: screen.width,
        height: screen.height
    },
});

