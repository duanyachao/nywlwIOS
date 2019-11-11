import {AppRegistry} from 'react-native';
import App from './src';
global.__APP__=true;
global.__ANDROID__=false;
global.__IOS__=true;
AppRegistry.registerComponent('nywlw',()=>App);