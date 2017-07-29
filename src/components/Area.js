/**
 * Created by duanyachao on 17/2/24.
 * 生产区域界面
 */
import React, { Component } from 'react';
import {
    InteractionManager,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
    ListView,
    Modal,
    Picker,
    Image,
    View,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../common';
import {pickerStyle} from '../common/theme';
export default class Area extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgId: null,
            orgName: null,
            modalVisible: false,
            selectIndex: null,
            callbackParent:null,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }
    componentDidMount() {
        const {callbackParent} = this.props;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(areaList),
        });
        (!this.state.orgId) ? this.setState({
            orgId: areaList[0].id,
            orgName: areaList[0].orgName,
            selectIndex: 0
        }) : null;
        callbackParent(areaList[0].id)
  
    }
    renderItem(rowData, sectionId, rowId) {
        return (
            <TouchableHighlight underlayColor="rgb(255, 255,255)" onPress={() =>{this.selectArea(rowData,rowId)}}>
                <View style={styles.areaListItem} key={rowId}>
                    <Text style={styles.areaListItemText}>{rowData.orgName}</Text>
                    <View style={styles.gxIcon}>
                        {(this.state.selectIndex==rowId) ?  <Icon name='check-circle' size={18} color={theme.iconColor}></Icon>:
                        <Icon name='circle-thin' size={18} color={"#eee"}></Icon>
                    }
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
    selectArea(rowData, rowId) {
        const {callbackParent}=this.props;
        this.setState({
            orgId: rowData.id,
            orgName: rowData.orgName,
            selectIndex: rowId,
            modalVisible: !this.state.modalVisible
        });
        callbackParent(rowData.id);
        // alert(callbackParent)    
    }
    render() {
        return (
            <View style={pickerStyle.container}>
                <View style={pickerStyle.pickerTip}>
                    <Icon name='map-signs' size={18} color={theme.iconColor}></Icon>
                    <Text style={pickerStyle.pickerTipText}>生产区域</Text>
                </View>
                {this.state.dataSource ?
                    <TouchableHighlight
                        underlayColor="rgb(255, 255,255)"
                        onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                        <View style={pickerStyle.picker}>
                            <Text style={pickerStyle.pickered}>{this.state.orgName}</Text>
                            <Icon name='angle-right' size={24} color='#8c8c8c'></Icon>
                        </View>
                    </TouchableHighlight>
                    : <View></View>
                }
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                    <TouchableHighlight style={{ flex: 1 }} onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                        <View style={styles.areaListWrapper}>
                            <View style={styles.areaList}>
                                <ListView
                                    initialListSize={10}
                                    dataSource={this.state.dataSource}
                                    renderRow={(rowData, sectionId, rowId)=>this.renderItem(rowData, sectionId, rowId)}
                                    style={styles.listViewStyle}
                                    onEndReachedThreshold={10}
                                    enableEmptySections={true}>
                                </ListView>
                            </View>
                        </View>
                    </TouchableHighlight>
                </Modal>
            </View>
        )

    }
}
const styles = StyleSheet.create({
    areaListWrapper: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        paddingLeft: 8,
        paddingRight: 8,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
    },
    areaList: {
        borderRadius: 4,
        backgroundColor: '#fff',
        paddingBottom: 10
    },
    areaListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 44,
        borderBottomColor: '#efefef',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingLeft: 18

    },
    gxIcon: {
        alignSelf: 'center',
        paddingRight: 14
    },
    areaListItemText: {
        fontSize: 18,
        color: '#000'
    }
});

