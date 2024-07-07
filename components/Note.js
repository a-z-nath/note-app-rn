import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';


const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const currentDate = new Date();

  // Check if it's today
  if (
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  ) {
    // Return clock time
    const hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format
    return `${formattedHours}:${minutes} ${ampm}`;
  } else {
    // Check if it's yesterday
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday';
    } else {
      // Return date in format dd/mm/yyyy
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }
};


const Note = ({ item, onPress }) => {
  const { title, desc, time } = item;
  return (
    <View
      style={{marginVertical: 10, position: 'relative'}}
    >
      <TouchableOpacity onPress={onPress} style={styles.container} className="bg-sky-300">
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text numberOfLines={2}>{desc}</Text>
        <View
          style={{position: 'absolute', bottom: 4, right: 12 }}
        >
          <Text>{formatTime(time)}</Text>
        </View>
      </TouchableOpacity>
    </View>
    
  );
};

const width = Dimensions.get('window').width - 40;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dbb2ff',
    width: width ,
    padding: 8,
    borderRadius: 10,
    minHeight: 100,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',

  },
});

export default Note;
