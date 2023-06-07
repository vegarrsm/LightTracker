import {PermissionsAndroid, Permission} from 'react-native';

export const requestPermission = async (perms: Permission[]): Promise<void> => {
  for (const perm of perms) {
    try {
      const granted = await PermissionsAndroid.request(perm, {
        title: 'Cool Photo App Permission',
        message:
          'Cool Photo App needs access to certain permissions ' +
          'to function properly.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use ', perm);
      } else {
        console.log(perm, ' permission denied');
      }
    } catch (err) {
      console.log('ERROR');
      console.warn(err);
    }
  }
};
