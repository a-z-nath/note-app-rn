import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  StatusBar,
  Alert
} from 'react-native';
import RoundIconBtn from '../components/RoundIconBtn';

const BaseUrl = process.env.BASE_URL;
const appId =  process.env.APP_ID;
const API_KEY= process.env.API_KEY;



const OtpInputModal = ({ visible, onClose, referenceNo, onSubmit }) => {
  const [otp, setOtp] = useState('');

  const handleOtpChange = (text) => {
    // Remove any non-numeric characters
    const sanitizedText = text.replace(/[^0-9]/g, '');
    setOtp(sanitizedText);
  };

  const handleSubmit = async () => {
    if (otp.length === 6) {
      try {
        const verifyOtpPayload = {
            appId: `${appId}`,
            password: `${API_KEY}`,
            referenceNo: `${referenceNo}`,
            otp: `${otp}`
        }
        // Call the API to verify the OTP
        const response = await fetch(`${BaseUrl}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(verifyOtpPayload)
        });
        const data = await response.json();
        if (data.statusCode === "S1000") {
          onSubmit();
        } else {
          Alert.alert('Error', 'Failed to verify OTP.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
    } else {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP.');
    }
  };

  return (
    <>
      <StatusBar hidden />
      <Modal visible={visible} animationType='fade'>
        <View style={styles.container}>
          <TextInput
            value={otp}
            onChangeText={handleOtpChange}
            placeholder='Enter OTP'
            keyboardType='numeric'
            style={styles.input}
            maxLength={6}
          />
          <View style={styles.btnContainer}>
            {otp.length === 6 ? (
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

export default OtpInputModal;
