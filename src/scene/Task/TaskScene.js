//import liraries
import React, { Component } from 'react';
import { 
    ListView,
    View, 
    Text, 
    StyleSheet 
} from 'react-native';
import {Header,Area,Batch,Dayage} from '../../components';
import TaskList from './TaskList';

// create a component
export default class TaskScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgId: null,
            batch:null,
            biologyInId:null,
            dayAge:null,

            
        }
    }
    areaChange(newState) {
        this.setState({
            orgId: newState
        })
    }
    batchChange(batch,biologyInId,batchIndex){
        this.setState({
            batch:batch,
            biologyInId:biologyInId,

        })
    }
    dayAgeChange(newState){
        this.setState({
            dayAge:newState
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <Area callbackParent={(newState) => this.areaChange(newState)}></Area>
                <Batch orgId={this.state.orgId} callbackBacth={(batch,biologyInId) => this.batchChange(batch,biologyInId)}></Batch>
                <Dayage orgId={this.state.orgId} batch={this.state.batch} callbackDayage={(newState) => this.dayAgeChange(newState)}></Dayage>
                <TaskList biologyInId={this.state.biologyInId} dayAge={this.state.dayAge}></TaskList>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
