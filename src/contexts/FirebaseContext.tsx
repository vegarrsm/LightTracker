import React, {createContext, useContext, useEffect, useState} from 'react';
import firebase, {ReactNativeFirebase} from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import {API_KEY} from '@env';
import {ProviderProps} from './ThemeContext';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'mastersensedata.firebaseapp.com',
  projectId: 'mastersensedata',
  storageBucket: 'mastersensedata.appspot.com',
  messagingSenderId: '706104493777',
  appId: '1:706104493777:web:a0920b94e19cfb1298e7f0',
  measurementId: 'G-DQ2X21B2DT',
  databaseURL: 'https://mastersensedata.firebaseio.com',
};

interface FirebaseContextInterface {
  firebaseAuth: FirebaseAuthTypes.Module | undefined;
  firestoreDb: FirebaseFirestoreTypes.Module | undefined;
  accessToken?: string;
}

const FirebaseContext = createContext<FirebaseContextInterface>({
  firebaseAuth: undefined,
  firestoreDb: undefined,
  accessToken: undefined,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<ProviderProps> = ({
  children,
}: ProviderProps) => {
  const [firebaseAuth, setFirebaseAuth] = useState<FirebaseAuthTypes.Module>();
  const [firestoreDb, setFirestoreDb] =
    useState<FirebaseFirestoreTypes.Module>();
  const [accessToken, setToken] = useState<string>('');
  const [app, setApp] = useState<ReactNativeFirebase.FirebaseApp>();

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig, 'LightBehavior').then(a => {
        setApp(a);
      });
    } else {
      setApp(firebase.app('LightBehavior'));
    }
  }, []);

  useEffect(() => {
    setFirebaseAuth(app?.auth());
    setFirestoreDb(app?.firestore());
  }, [app]);

  useEffect(() => {
    const unsubscribe = firebaseAuth?.onIdTokenChanged(user => {
      if (user) {
        user.getIdToken().then(t => setToken(t));
      } else {
        setToken('');
      }
    });

    // Clean up the subscription
    return unsubscribe;
  }, [firebaseAuth]);

  useEffect(() => {
    console.log(accessToken);
  }, [accessToken]);

  return (
    <FirebaseContext.Provider value={{firebaseAuth, firestoreDb, accessToken}}>
      {children}
    </FirebaseContext.Provider>
  );
};
