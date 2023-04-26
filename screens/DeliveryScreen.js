import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { HomeIcon, XIcon } from "react-native-heroicons/solid";
import * as Progress from "react-native-progress";
import { useSelector, useDispatch } from "react-redux";
import { selectRestaurant } from "../features/restaurantSlice";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { selectUserLat, selectUserLon } from "../features/userSlice";
import { emptyCart } from "../features/cartSlice";

export default function DeliveryScreen() {
  const navigation = useNavigation();
  const restaurant = useSelector(selectRestaurant);
  const userLatitude = useSelector(selectUserLat);
  const userLongitude = useSelector(selectUserLon);
  const [polylineCoords, setPolylineCoords] = useState([]);
  const [time, setTime] = useState(0);

  const dispatch = useDispatch();
  const handleCancel = () => {
    dispatch(emptyCart());
    navigation.navigate("Home");
  };
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  // Calculate Distance between two location
  useEffect(() => {
    // Calculate Time and Distance for the Given Locations
    function calculateBikeTravelTimeAndDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1); // deg2rad below
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km

      const averageSpeed = 15; // km/h
      const travelTime = distance / averageSpeed; // hours
      const minutes = Math.round(travelTime * 60);
      const remainingMinutes = minutes % 60;

      setTime(remainingMinutes);

      const coords = [
        { latitude: lat1, longitude: lon1 },
        { latitude: lat2, longitude: lon2 },
      ];
      setPolylineCoords(coords);
    }

    calculateBikeTravelTimeAndDistance(
      restaurant.lat,
      restaurant.long,
      userLatitude,
      userLongitude
    );
  }, [restaurant.lat, restaurant.long, userLatitude, userLongitude]);
  // Reduce Time in every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(intervalId);
          return prevTime;
        }
      });
    }, 60 * 1000); // update every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <StatusBar hidden />
      <View className="bg-slate-900 flex-1">
        <View className="z-50">
          <View className="flex-row justify-between items-center p-5">
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <XIcon color="white" size={30} />
            </TouchableOpacity>
            <Text className="font-light text-white text-lg">Order Help</Text>
          </View>
          <View className="bg-white mx-5 my-2 rounded-md p-6 z-50 shadow-md">
            <View className="flex-row justify-between">
              <View>
                <Text className="text-lg text-gray-400">Estimated Arival</Text>
                <Text
                  className={`text-4xl font-bold ${
                    time === 0 ? "text-green-400" : "text-orange-500"
                  }`}
                >
                  {time === 0 ? "Delivered" : `${time} minutes`}
                </Text>
              </View>
              <Image
                source={{ uri: "https//links.papareact.com/fls" }}
                className="h-20 w-20"
              />
            </View>
            {time === 0 ? (
              <HomeIcon size={30} className="text-yellow-300" />
            ) : (
              <Progress.Bar size={30} color="#00ccbb" indeterminate={true} />
            )}
            <Text className="mt-3 text-gray-500">
              Your order at
              <Text className="font-bold"> {restaurant.title} </Text>
              is being prepared
            </Text>
          </View>
        </View>
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: restaurant.lat,
            longitude: restaurant.long,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          className="flex-1 -mt-10 z-0"
          mapType="mutedStandard"
        >
          <Marker
            coordinate={{
              latitude: restaurant.lat,
              longitude: restaurant.long,
            }}
            title={restaurant.title}
            description={restaurant.short_description}
            identifier="origin"
            pinColor="#c0392b"
          />
          <Marker
            coordinate={{
              latitude: userLatitude,
              longitude: userLongitude,
            }}
            title="Your Location"
            identifier="destination"
            pinColor="#00ccbb"
          />
          <Polyline
            coordinates={polylineCoords}
            strokeWidth={2}
            strokeColor="#00ccbb"
          />
        </MapView>
        <SafeAreaView className="bg-slate-900 flex-row items-center space-x-5 h-24">
          <Image
            source={{ uri: "https://links.papareact.com/wru" }}
            className="h-12 w-12 bg-gray-300 p-4 rounded-full ml-5"
          />
          <View className="flex-1">
            <Text className="text-lg text-white">Delivery Boy</Text>
            <Text className="text-gray-400">Your Rider</Text>
          </View>
          <Text
            className="text-white bg-red-500 rounded p-3 text-lg mr-5 font-bold"
            onPress={handleCancel}
          >
            Cancel Order
          </Text>
        </SafeAreaView>
      </View>
    </>
  );
}
