import React, {useState} from 'react';
import {Button, TextInput, View} from 'react-native';
import {useFirebase} from '../../contexts/FirebaseContext';
import {useTheme} from '../../contexts/ThemeContext';

type LoginProps = {
  email?: string;
  password?: string;
};

export const Login: React.FC<LoginProps> = ({
  email: initialEmail,
  password: initialPassword,
}) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState(initialPassword || '');
  const {currentTheme} = useTheme();
  const {firebaseAuth} = useFirebase();

  const handleSubmit = async () => {
    if (firebaseAuth) {
      await firebaseAuth.signInWithEmailAndPassword(email, password);
    } else {
      console.log('firebaseAuth is null');
    }
  };

  return (
    <View
      style={{
        ...currentTheme,
        justifyContent: 'flex-end',
        padding: 50,
        paddingBottom: 100,
        height: '100%',
      }}>
      <TextInput
        placeholder="email"
        onChangeText={t => setEmail(t)}
        defaultValue={initialEmail}
        style={{marginBottom: 20, backgroundColor: currentTheme.secondary}}
      />
      <TextInput
        placeholder="password"
        onChangeText={t => setPassword(t)}
        defaultValue={initialPassword}
        style={{marginBottom: 20, backgroundColor: currentTheme.secondary}}
      />
      <View style={{}}>
        <Button
          title="Log in"
          onPress={() => {
            console.log(email, password);
            handleSubmit().then(
              e => {
                console.log('1', e);
              },
              e => {
                console.log('2', e);
              },
            );
          }}
          color={currentTheme.primary}
        />
      </View>
    </View>
  );
};
