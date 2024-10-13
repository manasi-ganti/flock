import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Pressable, TextInput, Animated, Keyboard, Easing, Image, Platform, View, Alert, Text } from 'react-native';
import {locations} from '@/assets/locations';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';

export default function Map() {
  const INITIAL_REGION = {
    latitude: 47.66153780118779,
    longitude: -122.31474389099361,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [chatText, setChatText] = useState("");
  const translateYRef = useRef(new Animated.Value(0)).current;

  const onMarkerSelected = (marker: any) => {
    Alert.alert(marker.name);
  };

  const calloutPressed = (ev: any) => {
    console.log(ev);
  };

  const handleSubmit = () => {
    console.log(chatText);
    setChatText(""); // Clear input after sending
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      (event) => {
        Animated.timing(translateYRef, {
          toValue: -event.endCoordinates.height,
          duration: event.duration,
          easing: Easing.bezier(0.33, 0.66, 0.66, 1),
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      (event) => {
        Animated.timing(translateYRef, {
          toValue: 0,
          duration: event.duration,
          easing: Easing.bezier(0.33, 0.66, 0.66, 1),
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={location}
            onPress={() => onMarkerSelected(location)}
          >
            <Callout onPress={calloutPressed}>
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 24 }}>{location.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Animated.View
        style={{
          transform: [{ translateY: Platform.OS === "ios" ? translateYRef : 0 }],
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 10,
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          multiline
          value={chatText}
          onChangeText={(text) => setChatText(text)}
          placeholder="Type your message"
        />
        <Pressable
          onPress={handleSubmit}
          style={{
            marginLeft: 10,
            padding: 10,
            backgroundColor: "purple",
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="bird" size={24} color="white" />
        </Pressable>
      </Animated.View>
    </View>
  );
}
