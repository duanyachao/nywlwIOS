import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, } from 'react-native';
import { screen, system, color } from '../../common';
import { PageControl} from '../../components';
import EbusinessMenuItem from './EbusinessMenuItem';
export default class EbusinessMenuView extends Component {
    constructor(props) {
        super(props);
        this.state={
            currentPage:0,
        }
    }
    
    onScroll=(e)=>{
        let x = e.nativeEvent.contentOffset.x;
        let currentPage = x / screen.width;
        if (this.state.currentPage != currentPage) {
            this.setState({
                currentPage: currentPage
            })
        }
    }
    onMenuSelected(index){
        alert(index)
    }
    render() {
        const {menus}=this.props;
        let menuItems=menus.map(
            (menuInfo,i)=><EbusinessMenuItem
                key={i}
                title={menuInfo.title}
                icon={menuInfo.icon}
                // onPress={i=>this.onMenuSelected(i)} 
                onPress={()=>this.onMenuSelected(i)}
            ></EbusinessMenuItem>
        );
        let menusArr=[];
        let pageCount=Math.ceil(menus.length / 10);
        for (let i = 0; i < pageCount; i++) {
            let len=(menus.length > (i+1)*10) ? 10 : menus.length-(i*10);
            let items = menuItems.slice(i * 10, i * 10 + len);
            menuArr=(<View style={styles.itemsView} key={i}>
                   {items}
                </View>);
            menusArr.push(menuArr);
        }
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    onScroll={this.onScroll}
                >
                    <View style={styles.menuContainer}>
                        {menusArr}
                    </View>    
                </ScrollView>
                 <PageControl
                    style={styles.pageControl}
                    numberOfPages={pageCount}
                    currentPage={this.state.currentPage}
                    hidesForSinglePage={true}
                    pageIndicatorTintColor='gray'
                    currentPageIndicatorTintColor={color.theme}
                    indicatorSize={{ width: 8, height: 8 }}
                ></PageControl>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fff',
        paddingBottom:10 
    },
    contentContainer:{
       
    },
    menuContainer: {
        flexDirection: 'row',
    },
    itemsView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: screen.width,
    },
});

