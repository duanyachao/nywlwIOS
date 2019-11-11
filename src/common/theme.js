import {StyleSheet} from 'react-native';
import screen from './screen'
export default {
    colorG:'#bebebe',
    colorLG:'#D3D3D3',
    bgGray1:'#f5f5f5',
    bgGray2:'#dcdcdc',
    bgGray3:'#EEE9E9',
    colorFirebrick:'#B22222',
    colorTurquoise:'#40E0D0',
    theme: '#06C1AE',
    border: '#e0e0e0',
    background: '#f3f3f3',
    tabIconsize:24,
    tabFontSize:12,
    iconColor:'rgb(55,179,117)',
    rpos:{
        position:'relative',
    },
    noBorerBottom: {
        borderBottomWidth: 0
    },
    nodata: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,

    },
}
export const pickerStyle=StyleSheet.create({
     container: {
        flexDirection: 'row',
        height: 44,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 5
    },
    pickerTip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerTipText: {
        paddingLeft: 10,
        fontSize: 14,
        color: '#222'
    },
    picker: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    pickered: {
        fontSize: 14,
        color: '#8c8c8c',
        paddingRight:10
    },
    nopicker:{
        flexDirection: 'row',
        alignItems: 'center'   
    },
    nopickerText:{
        color:'#8c8c8c'    
    }    
})
export const rowStyle=StyleSheet.create({
    noBorerBottom: {
        borderBottomWidth: 0
    },
    mineWrapper: {
        backgroundColor: '#fff',
    },
    myItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        height: 45,
        justifyContent: 'space-between',
        borderBottomColor:'#EEE9E9',
        borderBottomWidth:screen.onePixel,
        margin:2
    },
    tipIcon: {
        width: 20,
        textAlign: 'center'
    },
    itemTip: {
        paddingLeft: 10
    },
    myItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    myItemRight: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    itemRightTip: {
        paddingRight: 10
    },
    arrowIcon: {
        paddingRight: 20
    },
})