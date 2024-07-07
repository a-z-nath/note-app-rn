import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Ensure AsyncStorage is imported
import Note from '../components/Note';
import NoteInputModal from '../components/NoteInputModal';
import NotFound from '../components/NotFound';
import RoundIconBtn from '../components/RoundIconBtn';
import SearchBar from '../components/SearchBar';
import OtpVerification from '../components/OtpVerification';
import OtpInputModal from '../components/OtpInputModal';
import { useNotes } from '../contexts/NoteProvider';

const reverseData = data => {
  return data.sort((a, b) => {
    const aInt = parseInt(a.time);
    const bInt = parseInt(b.time);
    if (aInt < bInt) return 1;
    if (aInt === bInt) return 0;
    if (aInt > bInt) return -1;
  });
};

const NoteScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpVerificationVisible, setOtpVerificationVisible] = useState(false);
  const [referenceNo, setReferenceNo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultNotFound, setResultNotFound] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const DAILY_FREE_LIMIT = 5;
  const { notes, setNotes, findNotes } = useNotes();

  const checkNoteLimit = () => {
    const today = new Date();
    const todayNotes = notes.filter(note => {
      const noteDate = new Date(note.time);
      return (
        noteDate.getDate() === today.getDate() &&
        noteDate.getMonth() === today.getMonth() &&
        noteDate.getFullYear() === today.getFullYear()
      );
    });
    return todayNotes.length < DAILY_FREE_LIMIT;
  };

  const handleAddNotePress = () => {
    if (subscribed || checkNoteLimit()) {
      setModalVisible(true);
    } else {
      Alert.alert(
        'Note Limit Reached',
        'You have reached your daily note limit. Would you like to buy unlimited notes for today?',
        [
          {
            text: 'No Thanks',
            onPress: () => console.log('No thanks'),
          },
          {
            text: 'Buy',
            onPress: () => setOtpVerificationVisible(true),
          },
        ],
        { cancelable: true }
      );
    }
  };

  const reverseNotes = reverseData(notes);

  const handleOnSubmit = async (title, desc) => {
    const note = { id: Date.now(), title, desc, time: Date.now() };
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to save the note to AsyncStorage', error);
    }
  };

  const openNote = (note) => {
    navigation.navigate('NoteDetail', { note });
  };

  const handleOnSearchInput = async text => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchQuery('');
      setResultNotFound(false);
      return await findNotes();
    }
    const filteredNotes = notes.filter(note => {
      if (note.title.toLowerCase().includes(text.toLowerCase())) {
        return note;
      }
    });

    if (filteredNotes.length) {
      setNotes([...filteredNotes]);
    } else {
      setResultNotFound(true);
    }
  };

  const handleOnClear = async () => {
    setSearchQuery('');
    setResultNotFound(false);
    await findNotes();
  };

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <View style={{ height: 16 }} ></View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {notes.length ? (
            <SearchBar
              value={searchQuery}
              onChangeText={handleOnSearchInput}
              containerStyle={{ marginVertical: 20 }}
              onClear={handleOnClear}
            />
          ) : null}

          {resultNotFound ? (
            <NotFound />
          ) : (
            <FlatList
              data={reverseNotes}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <Note onPress={() => openNote(item)} item={item} />
              )}
            />
          )}

          {!notes.length ? (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                styles.emptyHeaderContainer,
              ]}
            >
              <Text style={styles.emptyHeader}>Add Notes</Text>
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
      <RoundIconBtn
        onPress={handleAddNotePress}
        antIconName='plus'
        style={styles.addBtn}
      />
      <NoteInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleOnSubmit}
      />
      <OtpVerification
        visible={otpVerificationVisible}
        onClose={() => setOtpVerificationVisible(false)}
        onSubmit={(referenceNo) => {
          setReferenceNo(referenceNo);
          setOtpVerificationVisible(false);
          setOtpModalVisible(true);
        }}
      />
      <OtpInputModal
        visible={otpModalVisible}
        onClose={() => setOtpModalVisible(false)}
        referenceNo={referenceNo}
        onSubmit={() => {
          setSubscribed(true);
          setOtpModalVisible(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    zIndex: 1,
  },
  emptyHeader: {
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    opacity: 0.2,
  },
  emptyHeaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  addBtn: {
    position: 'absolute',
    right: 15,
    bottom: 50,
    zIndex: 1,
  },
});

export default NoteScreen;
