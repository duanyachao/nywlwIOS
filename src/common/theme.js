import {StyleSheet} from 'react-native';
import screen from './screen'
import {setSpText,scaleSize} from './scale';
export default {
    theme: '#06C1AE',
    border: '#e0e0e0',
    background: '#f3f3f3',
    tabIconsize:setSpText(24),
    tabFontSize:setSpText(14),
    iconColor:'rgb(55,179,117)',
    nodata: {
        padding: 10,
        alignItems: 'center',

    },
    pcikerTipIconSize:16,
    pcikerRightIconSize:16,
    normalFontSize:14
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
        fontSize:setSpText(14),
        color: '#222'
    },
    picker: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    pickered: {
        fontSize: setSpText(14),
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
        borderBottomColor: '#ccc',
        borderBottomWidth:screen.onePixel,
        margin:2
    },
    tipIcon: {
        width: 20,
        textAlign: 'center'
    },
    itemTip: {
        paddingLeft: 10,
        fontSize:setSpText(14)
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