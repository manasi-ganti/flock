import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
//import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import axios from 'axios';
import * as SMS from 'expo-sms';

// API URL for your backend
const API_URL = 'http://localhost:3000'; // Change this to your backend URL

// Function to register for push notifications
// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }

//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }

// Main App component
export default function App() {
  interface Message {
    _id: string; 
    senderId: string;
    receiverIds: string[];
    message: string;
    timestamp: string; 
  }
  
  // const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  //const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState(false);
  // const [notification, setNotification] = useState<any>(false);

  // const notificationListener = useRef<any>();
  // const responseListener = useRef<any>();

  useEffect(() => {
    const registerUser = async () => {
      const response = await axios.post(`${API_URL}/register`, {
        name: 'Jane',
        phone: '2063428631',
        latitude: 37.7749,//location?.coords.latitude,
        longitude: -122.4194, //location?.coords.longitude,
      });
      console.log("id " + response.data._id);
      setUserId(response.data._id);
    };
    registerUser();

    console.log("hi");

    const getMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages/670bc5236aa9d1758ac7e754`);
        console.log("res " + response.data);
        setMessages(response.data);
        console.log("messages");
      } catch (error: any) {
        console.error('Error fetching messages:', error);
      }
      
    };
    getMessages();
  }, []);
  //   const getAvailablility = async() => {
  //     const isSmsAvailable = await SMS.isAvailableAsync();
  //     setIsAvailable(isSmsAvailable);
  //   }
  //   getAvailablility();
  // }, []);
  // const sendSms = async () => {
  //   const {result} = await SMS.sendSMSAsync(
  //     ['123456789'],
  //     'hi'
  //   );
  //   console.log(result);
  // };
  
    


  //   // Request location and register for push notifications on component mount
  //   // (async () => {
  //   //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   //   if (status !== 'granted') {
  //   //     Alert.alert('Permission to access location was denied');
  //   //     return;
  //   //   }

  //   //   let loc = await Location.getCurrentPositionAsync({});
  //   //   setLocation(loc);

  //   //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  //   // })();

  //   // Listen for notifications
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
  //     if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  

  // Register the user
  // const registerUser = async () => {
  //   const response = await axios.post(`${API_URL}/register`, {
  //     name: 'Jane',
  //     phone: '2063428631',
  //     latitude: 37.7749,//location?.coords.latitude,
  //     longitude: -122.4194, //location?.coords.longitude,
  //   });
  //   console.log(response.data._id);
  //   setUserId(response.data._id);
  // };

  // Send a message to users within a specific distance
  // const sendMessage = async () => {
  //   try {
  //     const response = await axios.post(`${API_URL}/sendPidge`, {
  //       senderId: userId,
  //       message,
  //       distance: 5000, 
  //     });

  //     // Get receiverIds and their expoPushTokens (you'll need to store tokens in your database)
  //     // const receiverIds = response.data.receiverIds; 

  //     // // Send push notifications to each receiver (replace with actual token retrieval)
  //     // for (const receiverId of receiverIds) {
  //     //   const receiverToken = await getExpoPushTokenForUserId(receiverId); // Replace with your token retrieval logic

  //     //   if (receiverToken) {
  //     //     const notificationMessage = {
  //     //       to: receiverToken,
  //     //       sound: 'default',
  //     //       title: 'New Message',
  //     //       body: message,
  //     //       data: { someData: 'goes here' },
  //     //     };
    
  //     //     await fetch('https://exp.host/--/api/v2/push/send', {
  //     //       method: 'POST',
  //     //       headers: {
  //     //         Accept: 'application/json',
  //     //         'Accept-Encoding': 'gzip, deflate',
  //     //         'Content-Type': 'application/json',
  //     //       },
  //     //       body: JSON.stringify(notificationMessage),
  //     //     });
  //     //   }
  //     // }
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //     // Handle the error
  //   }
  // };

  // Fetch message history
  // const getMessages = async () => {
  //   const response = await axios.get(`${API_URL}/messages/${userId}`);
  //   setMessages(response.data);
  // };

  return (
    <View style={{ padding: 50, flex: 1 }}>
      <ScrollView>
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageBox}>
            <Text style={styles.messageText}>{msg.message}</Text>
            <Text style={styles.timestampText}>Sent at: {new Date(msg.timestamp).toLocaleString()}</Text> 
            <Text style={styles.receiversText}>To: {msg.receiverIds.join(', ')}</Text> 
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  messageBox: {
    backgroundColor: '#B0C4DE', // Dusty blue color
    padding: 20,
    marginVertical: 10,
    borderRadius: 8, 
    width: '100%', 
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timestampText: {
    fontSize: 12,
    color: '#555', 
    marginBottom: 5,
  },
  receiversText: {
    fontSize: 14,
  },
});