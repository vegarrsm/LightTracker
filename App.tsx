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
  const {lux, setLux, schedule} = useLux(); //Consider if this is bad for performance
  const {storeData} = useRecordStorage();
  const {reviewTime, firstOpen, storeReviewTime} = useScheduleStorage();
  const {startScan, stopScan, deviceList, isScanning} = useDeviceScan({
    manager: manager,
    scanFilter: () => true,
  });
  const {currentTheme} = useTheme();
  const [initialRoute, setInitialRoute] = React.useState('Home');
  const [retryStall, setRetryStall] = React.useState(true);
  const lastBatchRef = React.useRef<number>(Date.now());

  // Reconnect attempt if no data is not received for 15 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      const deviceId = getDeviceIdFromRealm();
      if (lastBatchRef.current + 15000 < Date.now() && deviceId) {
        device?.isConnected().then(isConnected => {
          !isConnected &&
            startScan(
              d =>
                d?.id?.toLowerCase().includes(deviceId.toLowerCase()) || false,
            );
        });
      }
    }, 1000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [device, startScan]);

  // Checks if new batch has been received
  useEffect(() => {
    lastBatchRef.current = Date.now();
  }, [lux]);

  // Connect to device when opening app
  useEffect(() => {
    const deviceId = getDeviceIdFromRealm();
    if (deviceId && !monitor && !isScanning && retryStall) {
      setRetryStall(false);
      setTimeout(() => {
        console.log('retrystall true');
        setRetryStall(true);
      }, 2000);
      // Add condition here
      startScan(
        d => d?.id?.toLowerCase().includes(deviceId.toLowerCase()) || false,
      );
      console.log('back', device?.name);
      if (device) {
        console.log('calling getService');
        getService(device, setLux, monitor, setMonitor, setDevice, storeData, 5)
          .then(() => {
            stopScan();
          })
          .catch(e => {
            console.log('ERRRRRRRRRRRRRRRR\n\n', e);
          });
      }
    }
  }, [
    retryStall,
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
  console.log(schedule);

  useEffect(() => {
    const dev = deviceList.find(d => d.id === getDeviceIdFromRealm());
    if (dev) {
      console.log('Device found, stopping scan');
      setDevice(dev);
      stopScan();
    }
  }, [deviceList, stopScan, setDevice]); // A bit spaghetti to do this, should probably find a way to do it within useDeviceScan

  useEffect(() => {
    console.log(
      'useEffect',
      reviewTime,
      new Date(0),
      new Date().getDate(),
      reviewTime.getDate() !== new Date().getDate(),
      reviewTime !== new Date(0),
    );
    if (firstOpen) {
      setInitialRoute('SetGoals');
      storeReviewTime();
    } else if (
      reviewTime.getTime() !== new Date(0).getTime() &&
      reviewTime.getDate() !== new Date().getDate() // For longer usage this should be changed to account for if someone opens same day of another month
    ) {
      setInitialRoute('Morning');
    }
  }, [firstOpen, initialRoute, reviewTime, schedule, storeReviewTime]);
  console.log('INITIAL ROUTE', initialRoute);
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
