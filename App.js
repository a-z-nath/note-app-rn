import dotenv from 'dotenv'
dotenv.config({
  path: './env'
});
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import Intro from './screens/Intro';
import NoteScreen from './screens/NoteScreen';
import NoteDetail from './components/NoteDetail';
import NoteProvider from './contexts/NoteProvider';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']);

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState({});
  const [isAppFirstTimeOpen, setIsAppFirstTimeOpen] = useState(false);
  const findUser = async () => {
    const result = await AsyncStorage.getItem('user');

    if (result === null) return setIsAppFirstTimeOpen(true);

    setUser(JSON.parse(result));
    setIsAppFirstTimeOpen(false);
  };

  useEffect(() => {
    findUser();
  }, []);

  const RenderNoteScreen = props => <NoteScreen {...props} />

  if (isAppFirstTimeOpen) return <Intro onFinish={findUser} />;
  return (
    <NavigationContainer>
      <NoteProvider>
        <Stack.Navigator 
          screenOptions={{ headerTitle: '', headerTransparent: true }}
          initialRouteName='NoteScreen'
        >
          <Stack.Screen component={RenderNoteScreen} name='NoteScreen' />
          <Stack.Screen component={NoteDetail} name='NoteDetail' />
        </Stack.Navigator>
      </NoteProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
