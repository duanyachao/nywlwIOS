import React, { Component } from 'react'
import { View, Text, StyleSheet, RefreshControl, FlatList,TouchableOpacity,ActivityIndicator } from 'react-native'
import RefreshState from './RefreshState'
export default class RefreshListView extends Component {
    static propTypes = {
        onHeaderRefresh: React.PropTypes.func,
        onFooterRefresh: React.PropTypes.func,
    }

    static defaultProps = {
        footerRefreshingText: '数据加载中……',
        footerFailureText: '点击重新加载',
        footerNoMoreDataText: '已加载全部数据'
    }

    constructor(props: Object) {
        super(props)

        this.state = {
            headerState: RefreshState.Idle,
            footerState: RefreshState.Idle,
        }
    }

    startHeaderRefreshing() {
        this.setState({ headerState: RefreshState.Refreshing })

        this.props.onHeaderRefresh && this.props.onHeaderRefresh()
    }

    startFooterRefreshing() {
        this.setState({ footerState: RefreshState.Refreshing })

        this.props.onFooterRefresh && this.props.onFooterRefresh()
    }

    shouldStartHeaderRefreshing() {
        if (this.state.headerState == RefreshState.Refreshing ||
            this.state.footerState == RefreshState.Refreshing) {
            return false
        }

        return true
    }

    shouldStartFooterRefreshing() {
        if (this.state.headerState == RefreshState.Refreshing ||
            this.state.footerState == RefreshState.Refreshing) {
            return false
        }
        if (this.state.footerState == RefreshState.Failure ||
            this.state.footerState == RefreshState.NoMoreData) {
            return false
        }
        if (this.props.data.length == this.props.listdata.length) {
            alert(22222)
            return false
        }

        return true
    }

    endRefreshing(refreshState: RefreshState) {
        if (refreshState == RefreshState.Refreshing) {
            return
        }
        let footerState = refreshState
        if (this.props.data.length == this.props.listdata.length) {
            footerState = RefreshState.Idle
        }

        this.setState({
            headerState: RefreshState.Idle,
            footerState: footerState
        })
    }

    headerState() {
        return self.state.headerState
    }

    footerState() {
        return self.state.footerState
    }

    onHeaderRefresh() {
        if (this.shouldStartHeaderRefreshing()) {
            this.startHeaderRefreshing();
        }
    }

    onFooterRefresh() {
        if (this.shouldStartFooterRefreshing()) {
            this.startFooterRefreshing();
        }
    }
    keyExtractor = (item, index) => item.id;
    render() {
        const {itemH}=this.props;
        return (
            <FlatList
                {...this.props}
                getItemLayout={(item, index) => ({ length: itemH, offset: itemH * index, index })}
                keyExtractor={this.keyExtractor}
                ListFooterComponent={()=>this.renderFooter()}
                onRefresh={() => this.onHeaderRefresh()}
                refreshing={this.state.headerState == RefreshState.Refreshing}
                onEndReachedThreshold={1}
                onEndReached={() => this.onFooterRefresh()}
            ></FlatList>
        );
    }


    renderFooter() {
        let footer = null;

        switch (this.state.footerState) {
            case RefreshState.Idle:
                alert(1)
                break;
            case RefreshState.Failure: 
                alert(2)
            {
                footer =
                    <TouchableOpacity style={styles.footerContainer}
                        onPress={() => this.startFooterRefreshing()}
                    >
                        <Text style={styles.footerText}>
                            {this.props.footerFailureText}
                        </Text>
                    </TouchableOpacity>
                break;
            }
            case RefreshState.Refreshing: 
                alert(3)
            {
                footer =
                    <View style={styles.footerContainer} >
                        <ActivityIndicator size="small" color="#888888" />
                        <Text style={styles.footerText}>
                            {this.props.footerRefreshingText}
                        </Text>
                    </View>
                break;
            }
            case RefreshState.NoMoreData: 
                alert(4)
            {
                footer =
                    <View style={styles.footerContainer} >
                        <Text style={styles.footerText}>
                            {this.props.footerNoMoreDataText}
                        </Text>
                    </View>
                break;
            }
        }

        return footer;
    }

}
const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    footerText: {
        fontSize: 14,
        color: '#555555'
    }
});
