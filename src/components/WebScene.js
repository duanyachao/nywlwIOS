
import React, { Component } from 'react';
import { View, Text, StyleSheet, WebView, InteractionManager } from 'react-native';
export default class WebScene extends Component {
    static navigationOptions = ({navigation}) => ({
        headerStyle: { backgroundColor: 'white' },
        title: navigation.state.params.title,
    })
    constructor(props) {
        super(props);
        this.state = {
            source: {}
        }

    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({ source: { uri: this.props.navigation.state.params.url } })
        })
    }
    onLoadEnd(e) {
        if (e.nativeEvent.title && e.nativeEvent.title.length > 0) {
            this.props.navigation.setParams({ title: e.nativeEvent.title })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    ref='webView'
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={this.state.source}
                    onLoadEnd={(e) => this.onLoadEnd(e)}
                    scalesPageToFit={true}>
                </WebView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    webView: {
        flex: 1,
    }
});
