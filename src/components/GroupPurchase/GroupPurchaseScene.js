import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList,StatusBar, TouchableOpacity, Image, InteractionManager } from 'react-native';
import { Button, NavigationItem, RefreshListView, RefreshState, Separator, SpacingView } from '../../components'
import { Heading1, Heading2, Paragraph, HeadingBig } from '../../common/Text'
import { screen,color,system} from '../../common'
import api, { recommendUrlWithId, groupPurchaseDetailWithId } from '../../api'
import GroupPurchaseCell from './GroupPurchaseCell'
const pageSize = 10;
export default class GroupPurchaseScene extends Component {
    static navigationOptions = ({navigation}) => ({
        // title:''+navigation.state.params.info.title,
        headerTitle: `${navigation.state.params.info.title}`,
        headerRight: <NavigationItem
            icon={require('../../img/Public/icon_navigationItem_share.png')}
            onPress={() => { }}
        ></NavigationItem>
    })
    constructor(props) {
        super(props);
        this.state = {
            info: {},
            listdata: [],
            reloaddata: [],
            loadMore: false
        }
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.requestData();
        });
    }
    requestData() {
        this.requestDetail();
        this.requestRecommend();
    }
    requestDetail() {

    }
    requestRecommend() {
        let info = this.props.navigation.state.params.info;
        fetch(recommendUrlWithId(info.id))
            .then((response) => response.json())
            .then((json) => {
                let listdata = json.data.deals.map((info) => {
                    return {
                        id: info.id,
                        imgurl: info.imgurl,
                        title: info.brandname,
                        subtitle: `[${info.range}]${info.title}`,
                        price: info.price
                    }
                })
                this.setState({
                    listdata: listdata,
                    reloaddata: listdata.slice(0, pageSize)
                })
            })

    }
    renderHeader = () => {
        let info = this.props.navigation.state.params.info;
        return(
            <View>
                <View>
                    <Image style={styles.banner} source={{ uri: info.imgurl.replace('w.h', '480.0') }} />

                    <View style={styles.topContainer}>
                        <Heading1 style={{ color: color.theme }}>￥</Heading1>
                        <HeadingBig style={{ marginBottom: -8 }}>{info.price}</HeadingBig>
                        <Paragraph style={{ marginLeft: 10 }}>门市价：￥{(info.price * 1.1).toFixed(0)}</Paragraph>
                        <View style={{ flex: 1 }} />
                        <Button title='立即抢购' style={{ color: 'white', fontSize: 18 }} containerStyle={styles.buyButton}
                        />
                    </View>
                </View>

                <Separator />

                <View>
                    <View style={styles.tagContainer}>
                        <Image style={{ width: 20, height: 20 }} source={require('../../img/Home/icon_deal_anytime_refund.png')} />
                        <Paragraph style={{ color: '#89B24F' }}>  随时退</Paragraph>
                        <View style={{ flex: 1 }} />
                        <Paragraph>已售{1234}</Paragraph>
                    </View>

                </View>

                <SpacingView />

                <View style={styles.tipHeader}>
                    <Heading2>看了本团购的用户还看了</Heading2>
                </View>
            </View>
        )
    }
    renderFooter() {
        return null
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
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={() => this.renderFooter()}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={1}
                    onRefresh={() => this.requestData()}
                    refreshing={false}
                    ref="tuangouDetails"
                    renderItem={(item) =>
                        <GroupPurchaseCell
                            // id={item.item.id}
                            info={item.item}
                            onPress={() => {
                                StatusBar.setBarStyle('default', false);
                                this.props.navigation.navigate('GroupPurchase', { info: item.item });
                            }}
                        ></GroupPurchaseCell>}>
                </FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    banner: {
        width: screen.width,
        height: screen.width * 0.5
    },
    topContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    buyButton: {
        backgroundColor: '#fc9e28',
        width: 94,
        height: 36,
        borderRadius: 7,
    },
    tagContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    tipHeader: {
        height: 35,
        justifyContent: 'center',
        borderWidth: screen.onePixel,
        borderColor: color.border,
        paddingVertical: 8,
        paddingLeft: 20,
        backgroundColor: 'white'
    }
});
