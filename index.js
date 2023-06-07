/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.warn = () => {};
console.log('IGNORE LOGS');
LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);

/*

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';

AppRegistry.registerComponent(appName, () => App);

notifee.registerForegroundService(notification => {
  return new Promise(() => {
    console.log(notification.title);
  });
});
*/
