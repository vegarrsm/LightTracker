// App.tsx
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Home} from './src/screens/homeScreen/Home';
import {Settings} from './src/screens/settingsScreen/Settings';
import {SetGoal} from './src/screens/setGoalScreen/SetGoal';
import {ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import {LuxProvider, useLux} from './src/contexts/LuxContext';
import {FirebaseProvider, useFirebase} from './src/contexts/FirebaseContext';
import {DeviceProvider, useDevice} from './src/contexts/DeviceContext';
import {Login} from './src/screens/loginScreen/Login';
import {Permission, PermissionsAndroid, View} from 'react-native';
import {requestPermission} from './src/util/requestPermission';
import {getDeviceIdFromRealm} from './src/util/realmDevice';
import {getService} from './src/util/getService';
import useDeviceScan from './src/util/deviceScan';
import useRecordStorage, {useScheduleStorage} from './src/util/storage';
import Review from './src/screens/morningReviewScreen/Review';
import {TimeOfDay} from './src/components/charts/util/gradientCalculator';

const Stack = createStackNavigator();

const defaultOptions = {headerShown: false};

const RenderApp = () => {
  const {accessToken} = useFirebase();
  const {device, monitor, setDevice, setMonitor, manager} = useDevice();
  const {setLux} = useLux(); //Consider if this is bad for performance
  const {storeData} = useRecordStorage();
  const {reviewTime, firstOpen, storeReviewTime} = useScheduleStorage();
  const {startScan, stopScan, deviceList, isScanning} = useDeviceScan({
    manager: manager,
    scanFilter: () => true,
  });
  const {currentTheme} = useTheme();
  const [initialRoute, setInitialRoute] = React.useState('Home');

  useEffect(() => {
    const deviceId = getDeviceIdFromRealm();
    console.log(
      '\nAPP EFFECT: ',
      deviceId,
      monitor === null,
      deviceId && !monitor,
      isScanning,
    );
    if (deviceId && !monitor && !isScanning) {
      // Add condition here
      startScan(
        d => d?.id?.toLowerCase().includes(deviceId.toLowerCase()) || false,
      );
      console.log('back', device?.name);
      if (device) {
        getService(
          device,
          setLux,
          monitor,
          setMonitor,
          setDevice,
          storeData,
          15,
        )
          .then(() => {
            stopScan();
          })
          .catch(e => {
            console.log('ERRRRRRRRRRRRRRRR\n\n', e);
          });
      }
    }
  }, [
    device,
    isScanning,
    monitor,
    setDevice,
    setLux,
    setMonitor,
    startScan,
    stopScan,
    storeData,
  ]);

  useEffect(() => {
    const dev = deviceList.find(d => d.id === getDeviceIdFromRealm());
    if (dev) {
      console.log('Device found, stopping scan');
      setDevice(dev);
      stopScan();
    }
  }, [deviceList, stopScan, setDevice]); // A bit spaghetti to do this, should probably find a way to do it within useDeviceScan

  useEffect(() => {
    if (firstOpen) {
      setInitialRoute('SetGoals');
      storeReviewTime();
    } else if (
      reviewTime.toLocaleDateString() !== new Date().toLocaleDateString()
    ) {
      setInitialRoute('Morning');
    }
  }, [firstOpen, initialRoute, reviewTime, storeReviewTime]);

  return (
    <View
      style={{
        backgroundColor: currentTheme.backgroundColor,
        minHeight: '100%',
      }}>
      {accessToken ? (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
              name="Home"
              component={Home}
              options={defaultOptions}
            />
            <Stack.Screen // Keep this at index 1 or make the screenlistener check the routenames for index
              name="Settings"
              component={Settings}
              options={defaultOptions}
            />
            <Stack.Screen
              name="Morning"
              component={Review}
              options={defaultOptions}
            />
            <Stack.Screen
              name="SetGoals"
              component={SetGoal}
              initialParams={{
                timeOfDay: [
                  TimeOfDay.Morning,
                  TimeOfDay.Day,
                  TimeOfDay.Evening,
                  TimeOfDay.Night,
                ],
              }}
              options={{...defaultOptions}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <Login />
      )}
    </View>
  );
};

const App = () => {
  console.log('app');
  useEffect(() => {
    const permissions: Permission[] = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];
    requestPermission(permissions).then(() => {
      console.log('Permissions granted:', permissions);
    });
  }, []);

  return (
    <FirebaseProvider>
      <ThemeProvider>
        <LuxProvider>
          <DeviceProvider>
            <RenderApp />
          </DeviceProvider>
        </LuxProvider>
      </ThemeProvider>
    </FirebaseProvider>
  );
};

export default App;
