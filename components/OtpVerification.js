import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  StatusBar,
  Alert,
  Text
} from 'react-native';
import RoundIconBtn from './RoundIconBtn';

const BaseUrl = process.env.BASE_URL;
const appId =  process.env.APP_ID;
const API_KEY= process.env.API_KEY;


const OtpSentModal = ({ visible, onClose, onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('8801');

  const handlePhoneNumberChange = (text) => {
    // Remove any non-numeric characters
    const sanitizedText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(sanitizedText);
  };

  const handleSubmit = async () => {
    if (phoneNumber.length === 13) {
        const sentOtpPayload = {
            appId: `${appId}`,
            password: `${API_KEY}`,
            mobile: `${phoneNumber}`,
        }
      try {
        // Call the API to get the referenceNo
        const response = await fetch(`${BaseUrl}/request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sentOtpPayload)
        });
        const data = await response.json();
        if (data.referenceNo) {
          onSubmit(data.referenceNo);
        } else {
          Alert.alert('Error', 'Failed to get reference number.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
    } else {
      Alert.alert('Invalid Number', 'Please enter an 13-digit phone number.');
    }
  };

  return (
    <>
      <StatusBar hidden />
      <Modal visible={visible} animationType='fade'>
        <View style={styles.container}>
          <Text
            className="text-lg "
          >Please provide your Airtel or Robi mobile number. Like 8801*********</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            placeholder='Enter Phone Number'
            keyboardType='numeric'
            style={styles.input}
            maxLength={13}
          />
          <View style={styles.btnContainer}>
            {phoneNumber.length === 13 ? (
              <RoundIconBtn
                size={15}
                antIconName='check'
                onPress={handleSubmit}
              />
            ) : null}
            <RoundIconBtn
              size={15}
              style={{ marginLeft: 15 }}
              antIconName='close'
              onPress={onClose}
            />
          </View>
        </View>
        {/* <TouchableWithoutFeedback onPress={onClose}>
          <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
        </TouchableWithoutFeedback> */}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    fontSize: 20,
    marginBottom: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalBG: {
    flex: 1,
    zIndex: -1,
  },
});

export default OtpSentModal;
