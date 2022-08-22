import { View, StatusBar } from "react-native";
import React, { useLayoutEffect } from "react";
import * as Animatable from "react-native-animatable";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";

export default function PreparingOrderScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    setTimeout(() => {
      navigation.navigate("Delivery");
    }, 4000);
  }, []);

  return (
    <>
      <StatusBar hidden />
      <View className="flex-1 bg-[#00ccbb] justify-center items-center">
        <Animatable.Image
          source={require("../assets/loading.gif")}
          animation="slideInUp"
          iterationCount={1}
          className="h-96 w-96"
        />
        <Animatable.Text
          animation="slideInUp"
          iterationCount={1}
          className="text-lg my-10 text-white font-bold text-center"
        >
          Waiting for the Restaurant to accept your order!
        </Animatable.Text>
        <Progress.Circle size={60} indeterminate={true} color="white" />
      </View>
    </>
  );
}
