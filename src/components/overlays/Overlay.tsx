// Overlay.tsx
import React from 'react';
import {View, Modal, TouchableOpacity} from 'react-native';

interface OverlayProps {
  visible: boolean;
  children: React.ReactNode;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Overlay: React.FC<OverlayProps> = ({visible, setVisible, children}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            opacity: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          onPress={() => setVisible(false)}
        />
        {children}
      </View>
    </Modal>
  );
};

export default Overlay;
