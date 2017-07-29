//import liraries
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView
} from 'react-native';
import DeviceSSDItem from './DeviceSSDItem';
// create a component
export default class DeviceListSSD extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }
    renderItem(rowData,sectionID,rowID){
        const {orgId}=this.props;
        return <DeviceSSDItem rowData={rowData} rowID={rowID} orgId={orgId}></DeviceSSDItem>
    }
    render() {
        const {devices}=this.props;
        return (
            <ListView
                initialListSize={1}
                dataSource={this.state.dataSource.cloneWithRows(devices)}
                renderRow={(rowData,sectionID,rowID)=>this.renderItem(rowData,sectionID,rowID)}
                style={styles.listViewStyle}
                onEndReachedThreshold={10}
                enableEmptySections={true}
            ></ListView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
});
