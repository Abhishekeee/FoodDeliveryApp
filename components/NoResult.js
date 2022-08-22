import { View, Text, Image } from "react-native";
import React from "react";

export default function NoResult() {
  return (
    <>
      <View className="flex-1 justify-center items-center">
        <Image source={require("../assets/NoResult.png")} className='w-48 h-48 my-3' />
        <Text className="text-lg font-bold">No Result!</Text>
      </View>
    </>
  );
}
