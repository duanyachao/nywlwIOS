export default{
    // HOST:'http://221.13.156.250:9004/api/v1/',
    HOST:'http://nywlw.hnyfkj.com/api/v1/',
    DO_LOGIN:'doLogin',
    REGIONS:'org/regions',
    REGIONSV2:'http://nywlw.hnyfkj.com/api/v2/org/regions',//V2生产区域查询
    ENVDATA:'org/regions/envdata',//环境参数
    DEVICES:'terminaldevice/devices',
    WARNINFO:'alarm/devices',
    DEVICES_STATUS:'terminaldevice/status',
    DEVICES_UPDATE:'devicestate/update' ,
    BATCH:'biologyIn/yjCodes',
    DAYAGES:'biologyIn/dayAge',
    TASKLIST:'task/list',
    TASKUPDATE:'taskRecord/update',
    DAYINFO:'biologyInfo/dayInfo',
    DAYUPDATE:'biologyInfo/update',
    PROFILE:'userInfo/profile',//获取账户信息
    USERINFOUPDATE:'userInfo/update',//修改账户信息
    MODIFYPWD:'modifyPwd',//修改密码
    VIDEOLISTS:'videoInfo/conf',//视频监控
    WEATHERURL:'weatherStation/realEnvData',//气象站信息
    GETACTIONS:'baseDeviceTypeAction/getActions',//根据设备类型ID获取该设备类型绑定的设备操作
    GETDEVICESET:'confDurationDeviceDouble/get',//根据设备ID获取时长配置信息
    SAVEDEVICESET:'confDurationDeviceDouble/save',//保存或更新配置
    SENDDEVICESET:'confDurationDeviceDouble/sync',//下发双控设备行程时长配置,
    GETCONFIGLIST:'confAutomationDevice/list',//自动化配置列表
    GETLOGICDEVICESLIST:'logicDevice/list',//获取设备列表（包含传感器）
    GETECLS:'baseDataColumnDes/getSensorItems',//获取传感器环境参数
    SAVECONFAUTOMATION:'confAutomationDevice/save',//保存或更新配置
    SENDCONFAUTOMATION:'confAutomationDevice/sync',//下发阈值设置
    GETALLDEVICES:'logicDevice/getListByOrgId',//获取全部控制设备
    GETALLACTIONS:'baseAction/list',//获取设备操作信息
    GETALLECLS:'baseDataColumnDes/list',//获取传感器采集项信息
    DELCONFAUTOMATION:'confAutomationDevice/delete',//删除阈值配置
    GETREMOTERDATA:'confRemoteControl/list',//获取遥控器配置信息
    SAVEREMOTERDATA:'confRemoteControl/save',//更新或者保存遥控器配置信息
    DELREMOTERDATA:'confRemoteControl/delete',//删除遥控器配置信息
    SENDREMOTERDATA:'confRemoteControl/sync',//下发遥控器配置信息
    GETSENSORSALARM:'confSensorItemAlarm/list',//获取传感器告警配置
    SAVESENSORSALARM:'confSensorItemAlarm/save',//保存传感器告警配置

    //美团API
    recommend: 'http://api.meituan.com/group/v1/recommend/homepage/city/1?__skck=40aaaf01c2fc4801b9c059efcd7aa146&__skcy=mrUZYo7999nH8WgTicdfzaGjaSQ=&__skno=51156DC4-B59A-4108-8812-AD05BF227A47&__skts=1434530933.303717&__skua=bd6b6e8eadfad15571a15c3b9ef9199a&__vhost=api.mobile.meituan.com&ci=1&client=iphone&limit=40&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-06-17-14-50363&offset=0&position=39.983497,116.318042&userId=10086&userid=10086&utm_campaign=AgroupBgroupD100Fab_chunceshishuju__a__a___b1junglehomepagecatesort__b__leftflow___ab_gxhceshi__nostrategy__leftflow___ab_gxhceshi0202__b__a___ab_pindaochangsha__a__leftflow___ab_xinkeceshi__b__leftflow___ab_gxtest__gd__leftflow___ab_gxh_82__nostrategy__leftflow___ab_pindaoshenyang__a__leftflow___i_group_5_2_deallist_poitype__d__d___ab_b_food_57_purepoilist_extinfo__a__a___ab_trip_yidizhoubianyou__b__leftflow___ab_i_group_5_3_poidetaildeallist__a__b___ab_waimaizhanshi__b__b1___a20141120nanning__m1__leftflow___ab_pind',
    discount: 'http://api.meituan.com/group/v1/deal/topic/discount/city/1?ci=1&client=iphone&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-06-17-14-50363&userid=10086&utm_campaign=AgroupBgroupD100Fab_chunceshishuju__a__a___b1junglehomepagecatesort__b__leftflow___ab_gxhceshi__nostrategy__leftflow___ab_gxhceshi0202__b__a___ab_pindaochangsha__a__leftflow___ab_xinkeceshi__b__leftflow___ab_gxtest__gd__leftflow___ab_gxh_82__nostrategy__leftflow___ab_pindaoshenyang__a__leftflow___i_group_5_2_deallist_poitype__d__d___ab_b_food_57_purepoilist_extinfo__a__a___ab_trip_yidizhoubianyou__b__leftflow___ab_i_group_5_3_poidetaildeallist__a__b___ab_waimaizhanshi__b__b1___a20141120nanning__m1__leftflow___ab_pindaoquxincelue__a__leftflow___ab_i_group_5_5_onsite__b__b___ab_i_group_5_6_searchkuang__a__leftflow&utm_content=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&utm_medium=iphone&utm_source=AppStore&utm_term=5.7&uuid=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&version_name=5.7',
    menuInfo: [
            { title: '美食', icon: require('./imgs/goods/icon_homepage_foodCategory.png') },
            { title: '电影', icon: require('./imgs/goods/icon_homepage_movieCategory.png') },
            { title: '酒店', icon: require('./imgs/goods/icon_homepage_hotelCategory.png') },
            { title: 'KTV', icon: require('./imgs/goods/icon_homepage_KTVCategory.png') },
            { title: '优惠买单', icon: require('./imgs/goods/icon_homepage_default.png') },
            { title: '周边游', icon: require('./imgs/goods/icon_homepage_foottreatCategory.png') },
            { title: '生活服务', icon: require('./imgs/goods/icon_homepage_lifeServiceCategory.png') },
            { title: '休闲娱乐', icon: require('./imgs/goods/icon_homepage_entertainmentCategory.png') },
            { title: '丽人/美发', icon: require('./imgs/goods/icon_homepage_beautyCategory.png') },
            { title: '购物', icon: require('./imgs/goods/icon_homepage_shoppingCategory.png') },

            { title: '丽人/美发', icon: require('./imgs/goods/icon_homepage_beautyCategory.png') },
            { title: '电影', icon: require('./imgs/goods/icon_homepage_movieCategory.png') },
            { title: '周边游', icon: require('./imgs/goods/icon_homepage_foottreatCategory.png') },
            { title: '酒店', icon: require('./imgs/goods/icon_homepage_hotelCategory.png') },
            { title: '优惠买单', icon: require('./imgs/goods/icon_homepage_default.png') },
            { title: '休闲娱乐', icon: require('./imgs/goods/icon_homepage_entertainmentCategory.png') },
            { title: 'KTV', icon: require('./imgs/goods/icon_homepage_KTVCategory.png') },
            
        ] 
}