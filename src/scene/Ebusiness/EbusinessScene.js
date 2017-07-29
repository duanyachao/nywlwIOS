//import liraries
import React, { Component } from 'react';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager'
import {
    FlatList,
    View,
    Text,
    StyleSheet

} from 'react-native';
import api from '../../api';
import { Network, toastShort } from '../../utils';
import { Header,SpacingView } from '../../components';
import { screen, color } from '../../common';
import { Heading1, Heading2, Paragraph } from '../../common/Text';
import EbusinessMenuView from './EbusinessMenuView';
import EbusinessGridView from './EbusinessGridView';
import GroupPurchaseCell from '../../components/GroupPurchase/GroupPurchaseCell';
// create a component
const pageSize = 10;
const goodsList = [];
class EbusinessScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            discounts: [],
            listdata: [],
            reloaddata: [],
            loadMore: false
        }
    }
    componentDidMount() {
        this.requestData();
    }
    requestData() {
        this.requestDetail();
        this.requestRecommend();
        this.requestDiscount()
    }
    requestDetail() {

    }
    requestDiscount() {
        fetch(api.discount)
            .then((response) => response.json())
            .then((json) => {
                // console.info(JSON.stringify(json.data))
                this.setState({ discounts: json.data })
            })
            .catch((error) => {
                // console.info(error)
            })
    }
    requestRecommend() {
        fetch(api.recommend)
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    listdata: json.data,
                    reloaddata: json.data.slice(0, pageSize)
                })
            })
    }
    renderHeader() {
        const menus = api.menuInfo;
        return (
            <View style={styles.container}>
                <EbusinessMenuView menus={menus} ></EbusinessMenuView>
                <EbusinessGridView discounts={this.state.discounts} {...this.props}></EbusinessGridView>
                <SpacingView></SpacingView>
                <View style={styles.recommendHeader}>
                    <Heading2 style={{ color: 'gray', }}>猜你喜欢</Heading2>
                </View>
            </View>
        )
    }
    renderFooter() {
        if (this.state.loadMore) {
            // console.info('正在加载中......')
            return (<View><Text>正在加载</Text></View>)
        } else {
            if (this.state.reloaddata.length != 0 && this.state.reloaddata.length == this.state.listdata.length) {
                // console.info('全部数据')
                return (<View><Text>全部加载</Text></View>)
            } else {
                return null
            }

        }
    }
    onEndReached() {
        let currentPage = this.state.reloaddata && this.state.reloaddata.length;
        let count = this.state.listdata && this.state.listdata.length;
        if (currentPage < count) {
            this.setState({
                reloaddata: this.state.reloaddata.concat(this.state.listdata.slice(currentPage, currentPage + pageSize)),
                loadMore: true
            });
        } else {
            this.setState({
                loadMore: false
            });
        }
    }
    keyExtractor = (item, index) => item.id;
    render() {
        const itemH = 100;
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.reloaddata}
                    getItemLayout={(item, index) => ({ length: itemH, offset: itemH * index, index })}
                    initialNumToRender={pageSize}
                    keyExtractor={this.keyExtractor}
                    ListHeaderComponent={() => this.renderHeader()}
                    ListFooterComponent={() => this.renderFooter()}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={1}
                    onRefresh={() => this.requestData()}
                    refreshing={false}
                    ref="tuangouList"
                    renderItem={(item) =>
                        <GroupPurchaseCell
                            info={item.item}
                            onPress={() => { }}
                        ></GroupPurchaseCell>}>
                </FlatList>
            </View>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background

    },
    recommendHeader: {
        height: 35,
        justifyContent: 'center',
        borderWidth: screen.onePixel,
        borderColor: color.border,
        paddingVertical: 8,
        //paddingLeft: 20,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    searchBar: {
        width: screen.width * 0.7,
        height: 30,
        borderRadius: 10,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    searchIcon: {
        width: 20,
        height: 20,
        margin: 5,
    }
});

//make this component available to the app
export default EbusinessScene;
