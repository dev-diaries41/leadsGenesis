import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import { themes, sizes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';


let timeoutId: NodeJS.Timeout | null;

const createFlashMsg = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(themes.dark.secondaryBackgroundColor);
  const [successMsg, setSuccessMsg] = useState(false);


  const showMessage = (alertMessage: string, success: boolean, alertBackgroundColor?: string, timeout = 3000) => {
    setMessage(alertMessage);
    if(alertBackgroundColor){
      setBackgroundColor(alertBackgroundColor);
    }
    setSuccessMsg(success)
    setVisible(true);

    timeoutId = setTimeout(() => closeModal(), timeout);
  };

  const closeModal = () => {
    setVisible(false);
    setMessage('');
    if(timeoutId){
      clearTimeout(timeoutId)
    }
    timeoutId = null;
  };

  return {
    showMessage,
    FlashMessage: () => (
      <Modal visible={visible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: backgroundColor }]}>
              <Ionicons name={'notifications-circle'} size={24} color={successMsg ? themes.dark.conditionalColor : 'red'} />
              <Text style={styles.modalMessage}>{message}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    ),
  };
};


const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent:'flex-end',
      alignItems:'center',
    },
    modalContent: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: sizes.layout.large,
        height: 50,
        maxWidth:'80%',
        padding: sizes.layout.small,
        paddingHorizontal:sizes.layout.medium,
        marginBottom: sizes.layout.medium * 2

    },
    modalMessage: {
      fontSize: sizes.font.medium,
      marginLeft: sizes.layout.small, // or another suitable value
      color: themes.dark.textColor,
      textAlign: "center",
    },
    
  });
  

export {createFlashMsg};
