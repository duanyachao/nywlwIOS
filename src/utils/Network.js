/**
 * Network 网络请求
 *
 * https://github.com/facebook/react-native
 */
import React, { PureComponent, PropTypes } from 'react';
import {
    Alert,
    NetInfo,
    AsyncStorage,
} from 'react-native';
function objectToString(obj) {
    var quest = obj ? Object.keys(obj).sort().map(function (key) {
        var val = obj[key];
        if (Array.isArray(val)) {
            var temp = encodeURIComponent(key) + '=[';
            temp += val.sort().map(function (val2) {
                return JSON.stringify(val2);
            }).join(',');
            return temp += ']';
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
    // console.log('POST: '+quest);
    return quest;
}
function networkIsOk() {
    let reach = Network.info;
    if (reach === 'none' || reach === 'NONE' || reach === 'UNKNOWN' || reach === 'unknown') {
        Alert.alert(
            '提示',
            '无法连接,请快检查一下网络~',
            [{ text: '确定', onPress: () => { } }]
        )
        return false;
    } else if (reach === 'cell' || reach === 'MOBILE') {
        AsyncStorage.getItem('isUseExpensive', function (errs, result) {
            if (errs === null && result === '1') {
                return true;
            } else {
                Alert.alert(
                    '确认',
                    '网络非WIFI环境,是否要继续?',
                    [
                        { text: '取消', onPress: () => { } },
                        {
                            text: '确定', onPress: () => {
                                try {
                                    AsyncStorage.setItem('isUseExpensive', '1');
                                    Network._postFethData(url, fetchOptions, callback);
                                } catch (error) {

                                }
                            }
                        },
                    ]
                );
            }
            return false;
        });
    }
    return true;
}
function dataException(err) {
    Alert.alert(
        '提示',
        '数据异常,请重新尝试' + err,
        [{ text: '确定', onPress: () => { } }]
    )
}

export default class Network extends PureComponent {

    static post(url, data, callback) {
        var fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: objectToString(data),
        };

        if (networkIsOk()) {
            fetch(url, fetchOptions)
                .then(res => res.json())
                .then(res => {
                    callback(res);
                })
                .catch((err) => {
                    callback(err);
                })
                .done();
        }
    }

    static postJson(url, data, headers, callback) {
        var fetchOptions = {
            method: 'POST',
            headers:headers,
            body: JSON.stringify(data)
        };
        if (networkIsOk()) {
            fetch(url, fetchOptions)
                .then(res => res.json())
                .then(res => {
                    callback(res);
                })
                .catch((err) => {
                    callback(err);
                })
                .done();
        }
    }

    static get(url,params,headers, callback) {
        var fetchOptions = {
            method: 'GET',
            headers:headers
        };
        
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
            
        }
        if (networkIsOk()) {
            fetch(url, fetchOptions)
                .then((res) => res.json())
                .then((res) => {
                    callback(res);
                })
                .catch((err) => {
                    callback(err);
                })
                .done();
        }
    }


}
