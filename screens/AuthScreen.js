import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  LogBox,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function AuthScreen() {
  const navigation = useNavigation();
  LogBox.ignoreLogs([
    `AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage`,
  ]);
  return (
    <>
      <StatusBar hidden />
      <View
        className="flex-1 items-center justify-center bg-[#ecf0f1]"
      >
        <Image
          source={{
            uri: "https://img.freepik.com/free-vector/detailed-chef-logo-template_23-2148986823.jpg?w=826&t=st=1660572354~exp=1660572954~hmac=321bd48a1003881c2b78183e27ce84d847c98c23b6ea28acbb21afbe6bc67064",
          }}
          className="w-36 h-36"
        />
        <View className="my-5 flex justify-center items-center">
          <Text className="font-bold text-base">Order Your Food Now!</Text>
          <View className="mt-5">
            <TouchableOpacity
              className="bg-[#00cec9] py-3 my-4 w-80 rounded-lg"
              onPress={() => navigation.navigate("Login")}
            >
              <Text className="text-center text-white font-bold">LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3 w-80 border-2 border-[#00cec9] rounded-lg"
              onPress={() => navigation.navigate("Register")}
            >
              <Text className="text-center font-bold">SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
